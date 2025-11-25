import { BookEntity, BookReviewEntity } from "@/db/schema"; // Cập nhật import
import { ProductDataVectorEntity } from "@/types";
import outdent from "outdent";
import { openai } from "./ai";

class Embedder {
  constructor() {}

  async embed(texts: string[]) {
    const res = await openai.embeddings.create({
      input: texts,
      model: "text-embedding-3-small",
    });

    return res.data.map((d) => d.embedding);
  }
}

export const embedder = new Embedder();

// Đổi tên hàm và tham số từ Product sang Book
export async function embedBook(
  book: BookEntity,
): Promise<Omit<ProductDataVectorEntity, "id">[]> {
  // Tạo nội dung vector dựa trên thông tin sách
  const content = outdent`
    Book Title: ${book.title}
    Author: ${book.author}
    Description: ${book.description}
    Publisher: ${book.publisher}
    Year: ${book.publication_year}
  `;

  const [vector] = await embedder.embed([content]);

  return [
    {
      product_id: book.id, // Vẫn giữ key là product_id trong Milvus để đỡ phải sửa schema
      vector,
      content_type: "product_info",
      content_text: content,
      user_review_id: 0,
    },
  ];
}

// Cập nhật hàm embedReviews để nhận BookReview
export async function embedReviews(
  reviews: BookReviewEntity[],
  book: BookEntity,
): Promise<Omit<ProductDataVectorEntity, "id">[]> {
  // --- THÊM ĐOẠN NÀY ---
  // Nếu không có review nào, trả về mảng rỗng ngay lập tức
  if (!reviews || reviews.length === 0) {
    return [];
  }
  // ---------------------
  const data = reviews.map((review): Omit<ProductDataVectorEntity, "id"> => {
    const content = outdent`
      Review for book ${book.title}:
      ${review.comment} (Rating: ${review.rating}/5)
    `;

    return {
      product_id: book.id,
      vector: [],
      content_type: "user_review",
      content_text: content,
      user_review_id: review.id,
    };
  });
  
  // ... giữ nguyên phần còn lại của hàm ...
  const vectors = await embedder.embed(data.map((d) => d.content_text));
  return data.map((d, i) => ({
    ...d,
    vector: vectors[i],
  }));
}
