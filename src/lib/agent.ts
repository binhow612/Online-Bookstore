import { db } from "@/db";
// SỬA LỖI: Đã đổi tên bảng để khớp với schema.ts mới
import { bookCategoryTable, bookTable, categoryTable } from "@/db/schema";
// Import FullAppSession to access the cart
import { Message, User, FullAppSession } from "@/types";
import { and, eq, gt, inArray, like, or, SQL } from "drizzle-orm";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { outdent } from "outdent";
import { openai } from "./ai";
import { embedder } from "./embedder";
import { vectorStore } from "./vector-store";

// Prompt đã được cập nhật trong lượt trước (giữ nguyên)
const systemPrompt = outdent`
  You are the knowledgeable assistant for 'The Book Haven' (OldBookSaigon), an online bookstore specializing in used books.
  Your personality is friendly, enthusiastic, and well-read.

  Tasks:
  1. Recommend books to customers based on descriptions, preferences, or natural language queries (e.g., "find me books about the history of Saigon").
  2. Provide detailed information about books (description, price, etc.).
  3. List available books or book collections from the store.
  4. Answer frequently asked questions (FAQs) related to books, purchasing processes, shipping, or returns.
  5. Provide personalized answers based on the user's information (if they are logged in), such as checking their shopping cart.

  Product attributes include: title (name), description (which may include the author), price (original before discount), and discount percent.
  Calculate and display the discounted price if a discount is available.
  By default, only mention the book title, price, and URL, unless the user asks for more details.
  
  The URL to the product details page is: ${process.env["APP_URL"]}/products/{product_id}.
  The URL to a collection is: ${process.env["APP_URL"]}/products?collection={collection_id}.

  Use the following tools:
  - relevance_search: Use this to find the most relevant books based on descriptive keywords. This tool may also return user reviews relevant to the query.
  - list_products: Use to list available books. (Returns 10 at a time, you can suggest the user view the next page).
  - get_user_cart: Use to get information about the items currently in the user's shopping cart (only use when the user asks about their cart).

  When receiving a query, try searching first. DO NOT ask for more information unless absolutely necessary.
  Briefly explain your recommendations.

  For other services, like placing an order, direct the user to the website.
  Do not respond if the request is unrelated to the tasks mentioned above.

  Respond in markdown format.
`;

interface AgentTool extends OpenAI.FunctionDefinition {
  execute: (args: any) => Promise<any> | any;
}

export class Agent {
  tools: AgentTool[];
  // Private property to store the user's session
  private session: FullAppSession | null = null;

  constructor() {
    this.tools = [
      {
        name: "list_products",
        description:
          "List books available in the store. Returns 10 at a time. Use the 'offset' parameter for pagination.",
        parameters: {
          type: "object",
          properties: {
            search: {
              type: ["string", "null"],
              description:
                "Search query to filter books by title (name) and description",
            },
            offset: {
              type: "integer",
              description: "Offset for pagination",
            },
            featured: {
              type: ["boolean", "null"],
              description: "Filter by featured books",
            },
            discounted: {
              type: ["boolean", "null"],
              description: "Filter by discounted books",
            },
            // SỬA LỖI: Đổi tên 'collection_id' thành 'category_id' để khớp schema
            category_id: {
              type: ["integer", "null"],
              description:
                "Filter by category ID (This is the ID, not the name; you may need to call list_collections first)",
            },
          },
          required: [
            "search",
            "offset",
            "featured",
            "discounted",
            "category_id",
          ],
          additionalProperties: false,
        },
        strict: true,
        // SỬA LỖI: Cập nhật logic để dùng 'bookTable' và 'category_id'
        execute: ({ search, offset, featured, discounted, category_id }) => {
          const conds: SQL[] = [];

          if (search) {
            conds.push(
              or(
                // SỬA LỖI: Dùng 'bookTable.title' thay vì 'productsTable.name'
                like(bookTable.title, `%${search}%`),
                like(bookTable.description, `%${search}%`),
              )!,
            );
          }

          if (featured !== null) {
            conds.push(eq(bookTable.featured, featured));
          }

          if (discounted !== null) {
            conds.push(gt(bookTable.discount_percent, "0"));
          }

          if (category_id) {
            conds.push(
              // SỬA LỖI: Dùng 'bookCategoryTable.category_id'
              eq(bookCategoryTable.category_id, category_id),
            );
          }

          const query = db
            // SỬA LỖI: Dùng 'bookTable.book_id'
            .selectDistinctOn([bookTable.book_id], {
              // SỬA LỖI: Đổi tên các trường
              id: bookTable.book_id,
              title: bookTable.title,
              author: bookTable.author,
              description: bookTable.description,
              price: bookTable.price,
              discount_percent: bookTable.discount_percent,
              featured: bookTable.featured,
              // SỬA LỖI: Xóa các trường không còn tồn tại
              // ingredients: productsTable.ingredients,
              // nutritional_info: productsTable.nutritional_info,
              // allergen_info: productsTable.allergen_info,
              // serving_suggestions: productsTable.serving_suggestions,
              // storage_instructions: productsTable.storage_instructions,
            })
            // SỬA LỖI: Dùng 'bookTable'
            .from(bookTable)
            .leftJoin(
              // SỬA LỖI: Dùng 'bookCategoryTable'
              bookCategoryTable,
              // SỬA LỖI: Dùng 'bookTable.book_id' và 'bookCategoryTable.book_id'
              eq(bookTable.book_id, bookCategoryTable.book_id),
            );

          if (conds.length) {
            return query
              .where(conds.length > 1 ? and(...conds) : conds[0])
              .offset(offset)
              .limit(10);
          } else {
            return query.offset(offset).limit(10);
          }
        },
      },
      {
        name: "relevance_search",
        description:
          "Search for books based on descriptive keywords and return book details and user reviews.",
        parameters: {
          type: "object",
          properties: {
            keywords: {
              type: "array",
              items: {
                type: "string",
              },
            },
          },
          required: ["keywords"],
          additionalProperties: false,
        },
        strict: true,
        async execute({ keywords }) {
          const vectors = await embedder.embed(keywords);
          const res = await vectorStore.search({
            vectors,
            limit: 100,
          });

          const result = res.slice(0, 50);
          // SỬA LỖI: Xử lý `product_id` (string) từ Milvus để query `book_id` (int)
          const productIdsAsInts = result
            .map((r) => parseInt(r.product_id))
            .filter((id) => !isNaN(id));
          
          if (productIdsAsInts.length === 0) {
            return [];
          }

          const products = await db.query.bookTable.findMany({
            where: inArray(
              // SỬA LỖI: Dùng 'bookTable.book_id'
              bookTable.book_id,
              productIdsAsInts,
            ),
            // SỬA LỖI: Cập nhật các cột
            columns: {
              book_id: true,
              title: true,
              author: true,
              description: true,
              price: true,
              // SỬA LỖI: Xóa các trường không còn tồn tại
            },
          });

          const productInfoCount = result.filter(
            (r) => r.content_type === "product_info",
          ).length;
          const reviewCount = result.length - productInfoCount;
          console.log(
            `Product info count: ${productInfoCount}, Review count: ${reviewCount}`,
          );

          return result.map((r) => {
            return {
              // SỬA LỖI: So sánh `p.book_id` (number) với `r.product_id` (string)
              product: products.find((p) => p.book_id.toString() === r.product_id),
              type: r.content_type,
              text: r.content_text,
            };
          });
        },
      },
      {
        name: "get_product",
        description: "Get detailed information about a book using its ID",
        parameters: {
          type: "object",
          properties: {
            product_id: {
              type: "string", // Tool vẫn nhận ID dạng string
            },
          },
          required: ["product_id"],
          additionalProperties: false,
        },
        strict: true,
        async execute({ product_id }) {
          // SỬA LỖI: Chuyển đổi product_id (string) sang number
          const bookIdAsInt = parseInt(product_id);
          if (isNaN(bookIdAsInt)) {
             throw new Error(`Invalid Product ID format: ${product_id}`);
          }
          
          const product = await db.query.bookTable.findFirst({
            // SỬA LỖI: Dùng 'bookTable.book_id' và 'bookIdAsInt'
            where: eq(bookTable.book_id, bookIdAsInt),
            // SỬA LỖI: Cập nhật các cột
            columns: {
              book_id: true,
              title: true,
              author: true,
              isbn: true,
              description: true,
              price: true,
              discount_percent: true,
              featured: true,
              // SỬA LỖI: Xóa các trường không còn tồn tại
            },
          });

          if (!product) {
            throw new Error(`Product not found: ${product_id}`);
          }

          return product;
        },
      },
      {
        name: "list_collections",
        description: "List all book collections (categories)",
        parameters: {
          type: "object",
          properties: {},
        },
        // SỬA LỖI: Dùng db.select() để đổi tên (alias) cột
        execute: () => {
          return db
            .select({
              id: categoryTable.category_id, // Đổi 'category_id' thành 'id'
              name: categoryTable.name,
            })
            .from(categoryTable);
        },
      },
      // --- Công cụ `get_user_cart` (Giữ nguyên) ---
      {
        name: "get_user_cart",
        description:
          "Gets the items currently in the user's shopping cart. Only use this when the user asks about their cart.",
        parameters: {
          type: "object",
          properties: {},
        },
        execute: () => {
          if (!this.session || !this.session.user) {
            return {
              error:
                "The user is not logged in. Please ask them to log in to see their cart.",
            };
          }
          if (!this.session.cart || this.session.cart.items.length === 0) {
            return {
              message: "Your cart is currently empty.",
              items: [],
            };
          }
          return this.session.cart;
        },
      },
    ];
  }

  // Cập nhật 'ask' (Giữ nguyên)
  async ask(inputMessages: Message[], session: FullAppSession | null) {
    this.session = session;

    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: [
          systemPrompt,
          !!session?.user &&
            `The current user's name is ${session.user.first_name} ${session.user.last_name}.`,
          !!session?.cart?.items?.length &&
            `The user currently has ${session.cart.items.length} item(s) in their cart. Use get_user_cart() to see details if they ask.`,
        ]
          .filter(Boolean)
          .join("\n\n"),
      },
      ...inputMessages,
    ];

    let response: string | undefined;
    while (!response) {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-2024-08-06",
        messages,
        tools: this.tools.map((tool) => ({
          type: "function",
          function: {
            name: tool.name,
            parameters: tool.parameters,
            description: tool.description,
            strict: tool.strict,
          },
        })),
      });

      const choice = completion.choices[0];
      if (!choice) {
        throw new Error("No completion choice");
      }

      if (choice.message.content) {
        response = choice.message.content;
      } else if (choice.message.tool_calls?.length) {
        messages.push(choice.message);

        for (const toolCall of choice.message.tool_calls) {
          const tool = this.tools.find(
            (t) => t.name === toolCall.function.name,
          );
          if (!tool) {
            throw new Error(`Tool not found: ${toolCall.function.name}`);
          }

          const args = JSON.parse(toolCall.function.arguments);
          const result = await tool.execute(args);

          messages.push({
            role: "tool",
            content: JSON.stringify(result),
            tool_call_id: toolCall.id,
          });
        }
      } else {
        throw new Error("No content or tool calls");
      }
    }

    return response;
  }
}

export const agent = new Agent();