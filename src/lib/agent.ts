import { db } from "@/db";
import { bookCategoriesTable, booksTable, categoriesTable } from "@/db/schema";
import { Message, FullAppSession } from "@/types";
import { and, eq, gt, inArray, like, or, SQL } from "drizzle-orm";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { outdent } from "outdent";
import { openai } from "./ai";
import { embedder } from "./embedder";
import { vectorStore } from "./vector-store";

// [!code change] Cập nhật Prompt để định dạng list rõ ràng và bắt buộc có ảnh
const systemPrompt = outdent`
  You are the knowledgeable assistant for 'The Book Haven' (OldBookSaigon), an online bookstore specializing in used books.
  Your personality is friendly, enthusiastic, and well-read.

  Tasks:
  1. Recommend books to customers based on descriptions, preferences, or natural language queries.
  2. Provide detailed information about books.
  3. List available books or book categories.
  4. Answer FAQs related to books, purchasing, shipping, or returns.
  5. Provide personalized answers based on user info (e.g., cart status).

  Product attributes include: title, author, description, price, discount percent, and cover_url.
  Calculate the discounted price if applicable.
  
  **IMPORTANT DISPLAY RULES:**
  - When listing or recommending a book, **ALWAYS** display its cover image first using Markdown syntax: ![Book Title](cover_url).
  - Then, display the book details using a **bulleted list** format exactly like this:
    - ""**Title:** [Book Title]
    - **Tác giả:** [Author Name]
    - **Giá:** [Price]
    - **Nội dung:** [Short Description]
    - **Giảm giá:** [Discount Percent]% (if applicable)
    - **Giá sau giảm:** [Final Price] (if applicable)
    - [Chi tiết và mua hàng](${process.env["APP_URL"]}/catalog/{product_id})
  
  - Ensure the "Chi tiết và mua hàng" link is always on its own separate bullet line at the end of the list.
  
  The URL to a category/collection is: ${process.env["APP_URL"]}/catalog?category={category_id}.

  Use the following tools:
  - relevance_search: Find relevant books based on descriptive keywords.
  - list_products: List available books (10 at a time).
  - list_collections: List available categories.
  - get_user_cart: Check user's shopping cart.

  When receiving a query, try searching first. DO NOT ask for more information unless absolutely necessary.
  Briefly explain your recommendations.
  Respond in markdown format.
`;

interface AgentTool extends OpenAI.FunctionDefinition {
  execute: (args: any) => Promise<any> | any;
}

export class Agent {
  tools: AgentTool[];
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
                "Search query to filter books by title or description",
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
            category_id: {
              type: ["string", "null"], 
              description:
                "Filter by category ID (use list_collections to get IDs first)",
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
        execute: async ({ search, offset, featured, discounted, category_id }) => {
          const conds: SQL[] = [];

          if (search) {
            conds.push(
              or(
                like(booksTable.title, `%${search}%`),
                like(booksTable.description, `%${search}%`),
                like(booksTable.author, `%${search}%`)
              )!
            );
          }

          if (featured !== null) {
            conds.push(eq(booksTable.featured, featured));
          }

          if (discounted !== null) {
            conds.push(gt(booksTable.discount_percent, "0"));
          }

          if (category_id) {
            conds.push(eq(bookCategoriesTable.category_id, category_id));
          }

          const query = db
            .selectDistinctOn([booksTable.id], {
              id: booksTable.id,
              title: booksTable.title,
              author: booksTable.author,
              description: booksTable.description,
              price: booksTable.price,
              discount_percent: booksTable.discount_percent,
              featured: booksTable.featured,
              cover_url: booksTable.cover_url,
            })
            .from(booksTable)
            .leftJoin(
              bookCategoriesTable,
              eq(booksTable.id, bookCategoriesTable.book_id)
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
          const productIds = result.map((r) => r.product_id).filter(Boolean);

          if (productIds.length === 0) {
            return [];
          }

          const products = await db.query.booksTable.findMany({
            where: inArray(booksTable.id, productIds),
            columns: {
              id: true,
              title: true,
              author: true,
              description: true,
              price: true,
              cover_url: true,
            },
          });

          const productInfoCount = result.filter(
            (r) => r.content_type === "product_info"
          ).length;
          const reviewCount = result.length - productInfoCount;
          console.log(
            `Product info count: ${productInfoCount}, Review count: ${reviewCount}`
          );

          return result.map((r) => {
            return {
              product: products.find((p) => p.id === r.product_id),
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
              type: "string",
            },
          },
          required: ["product_id"],
          additionalProperties: false,
        },
        strict: true,
        async execute({ product_id }) {
          const product = await db.query.booksTable.findFirst({
            where: eq(booksTable.id, product_id),
            columns: {
              id: true,
              title: true,
              author: true,
              isbn: true,
              description: true,
              price: true,
              discount_percent: true,
              featured: true,
              cover_url: true,
              publisher: true,
              publication_year: true,
              page_count: true,
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
        description: "List all book categories",
        parameters: {
          type: "object",
          properties: {},
        },
        execute: () => {
          return db
            .select({
              id: categoriesTable.id,
              name: categoriesTable.name,
              description: categoriesTable.description,
            })
            .from(categoriesTable);
        },
      },
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
            (t) => t.name === toolCall.function.name
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