import { BookCard } from "@/components/book-card";
import { getCategories } from "@/lib/data";
import { Metadata } from "next";
import Link from "next/link";
import { CategoryList } from "./category-list";

async function BookList({
  page,
  categoryId,
  searchQuery,
}: {
  page: number;
  categoryId?: string;
  searchQuery?: string;
}) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", "10");

  if (categoryId) params.set("category", categoryId);
  if (searchQuery) params.set("q", searchQuery);

  const res = await fetch(`http://localhost:3000/api/books?${params}`, {
    cache: "no-store",
  });
  const json = await res.json();
  const books = json.data;

  return (
    <div>
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

      {/* PAGINATION */}
      <div className="flex justify-center mt-8 gap-4">
        {page > 1 && (
          <Link
            href={`/catalog?page=${page - 1}${
              categoryId ? `&category=${categoryId}` : ""
            }${searchQuery ? `&q=${searchQuery}` : ""}`}
            className="px-4 py-2 border rounded"
          >
            ← Previous
          </Link>
        )}

        {books.length === 10 && (
          <Link
            href={`/catalog?page=${page + 1}${
              categoryId ? `&category=${categoryId}` : ""
            }${searchQuery ? `&q=${searchQuery}` : ""}`}
            className="px-4 py-2 border rounded"
          >
            Next →
          </Link>
        )}
      </div>
    </div>
  );
}

export default async function CatalogPage({ searchParams }) {
  const params = await searchParams;

  const page = Number(params.page || 1);
  const categories = await getCategories();

  return (
    <div className="container flex flex-col md:flex-row py-12">
      <div className="md:w-[200px]">
        <CategoryList
          categoryId={params.category}
          categories={categories}
          searchQuery={params.q}
        />
      </div>

      <div className="md:flex-1">
        <BookList
          page={page}
          categoryId={params.category}
          searchQuery={params.q}
        />
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Catalog - The Book Haven",
  description: "Browse our collection of books by category.",
};
