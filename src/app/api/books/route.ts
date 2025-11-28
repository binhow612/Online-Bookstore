import { NextResponse } from "next/server";
import { db } from "@/db";       // từ src/db/index.ts
import { books } from "@/db/schema"; // từ src/db/schema.ts

export async function GET() {
  try {
    const allBooks = await db.select().from(books);
    return NextResponse.json(allBooks);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch books" }, { status: 500 });
  }
}
