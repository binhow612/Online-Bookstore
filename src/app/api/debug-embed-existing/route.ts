// src/app/api/debug-embed-existing/route.ts
import { db } from "@/db";
import { booksTable } from "@/db/schema"; // Import bảng booksTable
import { embedBook, embedReviews } from "@/lib/embedder"; // Import hàm mới
import { vectorStore } from "@/lib/vector-store";

export async function POST(request: Request) {
  const json = await request.json();
  if (!json.token || json.token !== process.env["SECRET_KEY"]) {
    return new Response("Unauthorized", { status: 401 });
  }

  // SỬA: Query bảng booksTable thay vì productsTable
  const books = await db.query.booksTable.findMany({
    with: {
      bookReviews: { // Sửa thành bookReviews
        with: {
          book: true,
          user: true,
        },
      },
    },
  });

  let vectorCount = 0;

  for (const book of books) {
    // Sửa: Gọi embedBook
    const [bookVectorData] = await embedBook(book);
    vectorCount += 1;
    await vectorStore.upsert([bookVectorData]);

    if (book.bookReviews && book.bookReviews.length > 0) {
       // Sửa: Gọi embedReviews với dữ liệu sách
       const reviewVectorDataArr = await embedReviews(
        book.bookReviews,
        book,
      );
      if (reviewVectorDataArr.length > 0) {
          vectorCount += reviewVectorDataArr.length;
          await vectorStore.upsert(reviewVectorDataArr);
      }
    }
  }

  return Response.json({
    bookCount: books.length, // Trả về số lượng sách
    vectorCount,
  });
}