import { BookCard } from "@/components/book-card";
import { getCategories } from "@/lib/data";
import { Book } from "@/types";
import { Metadata } from "next";
import Link from "next/link";
import { CategoryList } from "./category-list";
// [!code ++] Import component mới
import { ProductSortBar } from "@/components/catalog/product-sort-bar";

async function BookList({
  page,
  categoryId,
  searchQuery,
  sort, // [!code ++] Nhận thêm prop sort
}: {
  page: number;
  categoryId?: string;
  searchQuery?: string;
  sort?: string; // [!code ++]
}) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", "12");
  if (categoryId) params.set("category", categoryId);
  if (searchQuery) params.set("q", searchQuery);
  if (sort) params.set("sort", sort); // [!code ++] Gửi params sort lên API

  const res = await fetch(`http://localhost:3000/api/books?${params}`, {
    cache: "no-store",
  });
  const json = await res.json();
  const books: Book[] = json.data;
  const totalPages = json.totalPages || 1; // [!code ++] Lấy totalPages từ API

  return (
    <div>
      {/* [!code ++] Thêm Sort Bar vào đây */}
      <ProductSortBar totalPages={totalPages} currentPage={page} />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {books.map((book, index) => (
          <Link key={book.id} href={`/catalog/${book.id}`}>
            <BookCard
              book={book}
              imageProps={index < 4 ? { priority: true } : undefined}
            />
          </Link>
        ))}
      </div>

      {/* PAGINATION BOTTOM (Giữ nguyên hoặc dùng chung logic với sort bar) */}
      <div className="flex justify-center mt-8 gap-4">
        {page > 1 && (
          <Link
            href={`/catalog?page=${page - 1}${
              categoryId ? `&category=${categoryId}` : ""
            }${searchQuery ? `&q=${searchQuery}` : ""}${sort ? `&sort=${sort}` : ""}`}
            className="px-4 py-2 border rounded bg-white hover:bg-gray-50"
          >
            ← Previous
          </Link>
        )}

        {/* Nút Next logic đơn giản */}
        {page < totalPages && (
          <Link
            href={`/catalog?page=${page + 1}${
              categoryId ? `&category=${categoryId}` : ""
            }${searchQuery ? `&q=${searchQuery}` : ""}${sort ? `&sort=${sort}` : ""}`}
            className="px-4 py-2 border rounded bg-white hover:bg-gray-50"
          >
            Next →
          </Link>
        )}
      </div>
    </div>
  );
}

type SearchParams = Promise<{
  page?: string;
  category?: string;
  q?: string;
  sort?: string; // [!code ++]
}>;

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  const page = Number(params.page || 1);
  const categories = await getCategories();

  return (
    <div className="container flex flex-col md:flex-row py-12">
      <div className="md:w-[200px] mb-8 md:mb-0">
        <CategoryList
          categoryId={params.category}
          categories={categories}
          searchQuery={params.q}
        />
      </div>

      <div className="md:flex-1 md:pl-8">
        <BookList
          page={page}
          categoryId={params.category}
          searchQuery={params.q}
          sort={params.sort} // [!code ++]
        />
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Catalog - The Book Haven",
  description: "Browse our collection of books by category.",
};