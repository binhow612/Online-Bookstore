import { db } from "@/db";
import { booksTable, bookCategoriesTable } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const page = Number(url.searchParams.get("page") || 1);
  const limit = Number(url.searchParams.get("limit") || 10);
  const category = url.searchParams.get("category");
  const search = url.searchParams.get("q")?.toLowerCase();
  const offset = (page - 1) * limit;

  let books;

  if (category) {
    books = await db.query.booksTable.findMany({
      limit,
      offset,
      with: { bookCategories: true },
      orderBy: asc(booksTable.id)
    });
    books = books.filter((b) =>
      b.bookCategories.some((c) => c.category_id === category)
    );
  } else {
    books = await db.query.booksTable.findMany({
      limit,
      offset,
      orderBy: asc(booksTable.id)
    });
  }

  if (search) {
    books = books.filter(
      (b) =>
        b.title.toLowerCase().includes(search) ||
        b.author?.toLowerCase().includes(search) ||
        b.description?.toLowerCase().includes(search)
    );
  }

  return NextResponse.json({
    page,
    limit,
    data: books,
  });
}
