import { db } from "@/db";
import {
  booksTable,
  bookCategoriesTable,
  bookOrderItemsTable,
  bookReviewsTable,
} from "@/db/schema";
import {
  asc,
  desc,
  eq,
  sql,
  inArray,
  and,
  ilike,
  countDistinct,
} from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const page = Number(url.searchParams.get("page") || 1);
  const limit = Number(url.searchParams.get("limit") || 12);
  const categoryId = url.searchParams.get("category");
  const search = url.searchParams.get("q");
  const sort = url.searchParams.get("sort") || "newest";

  const offset = (page - 1) * limit;

  // --- BƯỚC 1: Xây dựng Query ---
  // [QUAN TRỌNG]: Phải select và group by 'featured' để có thể sort theo nó
  const baseQuery = db
    .select({
      id: booksTable.id,
      featured: booksTable.featured, // [!code ++] Lấy thêm trường featured
      // Tính toán các field ảo
      soldCount: sql<number>`coalesce(sum(${bookOrderItemsTable.quantity}), 0)`.as("sold_count"),
      avgRating: sql<number>`coalesce(avg(${bookReviewsTable.rating}), 0)`.as("avg_rating"),
    })
    .from(booksTable)
    .leftJoin(
      bookCategoriesTable,
      eq(booksTable.id, bookCategoriesTable.book_id)
    )
    .leftJoin(
      bookOrderItemsTable,
      eq(booksTable.id, bookOrderItemsTable.book_id)
    )
    .leftJoin(
      bookReviewsTable,
      eq(booksTable.id, bookReviewsTable.book_id)
    )
    // [QUAN TRỌNG]: Group by cả ID và Featured để tránh lỗi SQL
    .groupBy(booksTable.id, booksTable.featured); // [!code ++]

  // --- BƯỚC 2: Filter ---
  const whereConditions = [];

  if (categoryId) {
    whereConditions.push(eq(bookCategoriesTable.category_id, categoryId));
  }

  if (search) {
    const searchLower = `%${search.toLowerCase()}%`;
    whereConditions.push(
      sql`(${booksTable.title} ILIKE ${searchLower} OR ${booksTable.author} ILIKE ${searchLower})`
    );
  }

  if (whereConditions.length > 0) {
    baseQuery.where(and(...whereConditions));
  }

  // --- BƯỚC 3: Xử lý Logic Sắp xếp (Sort) ---
  const orderByConditions = [];

  // 3.1. Ưu tiên 1: Theo lựa chọn của người dùng
  switch (sort) {
    case "price_asc":
      orderByConditions.push(asc(booksTable.price));
      break;
    case "price_desc":
      orderByConditions.push(desc(booksTable.price));
      break;
    case "best_selling":
      orderByConditions.push(desc(sql`sold_count`));
      break;
    case "rating":
      orderByConditions.push(desc(sql`avg_rating`));
      break;
    case "newest":
    default:
      orderByConditions.push(desc(booksTable.created_at));
      break;
  }

  // 3.2. Ưu tiên 2: Nếu chỉ số trên bằng nhau, Featured lên trước
  // (desc boolean: true sẽ nằm trước false)
  orderByConditions.push(desc(booksTable.featured)); // [!code ++]

  // 3.3. Ưu tiên 3: Cuối cùng sort theo ID để đảm bảo phân trang không bị nhảy lung tung
  orderByConditions.push(desc(booksTable.id)); // [!code ++]

  
  // Query đếm tổng số lượng (Total Count)
  const countQuery = db
    .select({ count: countDistinct(booksTable.id) })
    .from(booksTable)
    .leftJoin(
      bookCategoriesTable,
      eq(booksTable.id, bookCategoriesTable.book_id)
    );
    
  if (whereConditions.length > 0) {
     countQuery.where(and(...whereConditions));
  }
  
  const totalResult = await countQuery;
  const totalBooks = totalResult[0]?.count || 0;
  const totalPages = Math.ceil(totalBooks / limit);

  // --- BƯỚC 4: Thực thi Query lấy ID ---
  const sortedIdsResult = await baseQuery
    .orderBy(...orderByConditions) // [!code ++] Spread mảng điều kiện sort
    .limit(limit)
    .offset(offset);

  const sortedIds = sortedIdsResult.map((item) => item.id);

  if (sortedIds.length === 0) {
    return NextResponse.json({
      page,
      limit,
      totalPages,
      data: [],
    });
  }

  // --- BƯỚC 5: Fetch Data đầy đủ ---
  const books = await db.query.booksTable.findMany({
    where: inArray(booksTable.id, sortedIds),
    with: {
      bookReviews: true, // <--- Cần dòng này để BookCard tính toán được số sao
      bookCategories: {
        with: {
          category: true,
        },
      },
    },
  });

  // --- BƯỚC 6: Sắp xếp lại kết quả cuối cùng ---
  const sortedBooks = sortedIds
    .map((id) => books.find((book) => book.id === id))
    .filter((book) => book !== undefined);

  return NextResponse.json({
    page,
    limit,
    totalPages,
    data: sortedBooks,
  });
}