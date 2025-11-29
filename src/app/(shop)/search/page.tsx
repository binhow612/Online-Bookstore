import { BookCard } from "@/components/book-card";
import { getBooks, getCategories } from "@/lib/data";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

// Simple fuzzy search function
function fuzzyMatch(text: string, query: string): number {
  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();
  
  // Exact match gets highest score
  if (textLower.includes(queryLower)) {
    return 100;
  }
  
  // Check if all characters exist in order
  let score = 0;
  let textIndex = 0;
  
  for (let i = 0; i < queryLower.length; i++) {
    const char = queryLower[i];
    const foundIndex = textLower.indexOf(char, textIndex);
    
    if (foundIndex === -1) {
      return 0; // Character not found
    }
    
    // Give points based on how close characters are
    const distance = foundIndex - textIndex;
    score += Math.max(0, 10 - distance);
    textIndex = foundIndex + 1;
  }
  
  return score;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = params.q || "";
  
  const allBooks = await getBooks();
  const allCategories = await getCategories();
  
  let matchedBooks: Array<{ book: any; score: number }> = [];
  let matchedCategories: Array<{ category: any; score: number }> = [];
  
  if (query.trim()) {
    // Search books
    matchedBooks = allBooks
      .map((book) => {
        let score = 0;
        score += fuzzyMatch(book.title, query) * 3; // Title is most important
        score += fuzzyMatch(book.author || "", query) * 2; // Author is second
        score += fuzzyMatch(book.description || "", query); // Description is third
        score += fuzzyMatch(book.publisher || "", query);
        
        return { book, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score);
    
    // Search categories
    matchedCategories = allCategories
      .map((category) => {
        let score = 0;
        score += fuzzyMatch(category.name, query) * 2;
        score += fuzzyMatch(category.description || "", query);
        
        return { category, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score);
  }

  return (
    <div className="container py-12">
      {/* Search Header */}
      <div className="max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl font-bold text-center mb-8 text-[var(--wood-brown)]">
          Search Books & Categories
        </h1>
        
        <form method="GET" action="/search" className="relative">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search for books, authors, categories..."
            className="w-full px-5 py-4 pl-14 text-lg rounded-lg border-2 border-gray-300 focus:border-[var(--wood-brown)] focus:outline-none shadow-sm"
            autoFocus
          />
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-[var(--wood-brown)] hover:bg-[#6b4e2e] transition text-white font-semibold rounded-md"
          >
            Search
          </button>
        </form>
      </div>

      {/* Results */}
      {query.trim() ? (
        <div className="space-y-12">
          {/* Categories Results */}
          {matchedCategories.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-6 text-[var(--wood-brown)]">
                Categories ({matchedCategories.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {matchedCategories.map(({ category }) => (
                  <Link
                    key={category.id}
                    href={`/catalog?category=${category.id}`}
                    className="p-6 bg-white rounded-lg border-2 border-gray-200 hover:border-[var(--wood-brown)] transition-all shadow-sm hover:shadow-md"
                  >
                    <h3 className="text-xl font-semibold text-[var(--wood-brown)] mb-2">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {category.description}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Books Results */}
          {matchedBooks.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-6 text-[var(--wood-brown)]">
                Books ({matchedBooks.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {matchedBooks.map(({ book }, index) => (
                  <Link key={book.id} href={`/catalog/${book.id}`}>
                    <BookCard
                      book={book}
                      imageProps={index < 4 ? { priority: true } : undefined}
                    />
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* No Results */}
          {matchedBooks.length === 0 && matchedCategories.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-gray-600 mb-4">
                No results found for "{query}"
              </p>
              <p className="text-gray-500 mb-8">
                Try different keywords or browse our categories
              </p>
              <Link
                href="/catalog"
                className="inline-block px-6 py-3 bg-[var(--wood-brown)] text-white rounded-lg hover:bg-[#6b4e2e] transition"
              >
                Browse All Books
              </Link>
            </div>
          )}
        </div>
      ) : (
        // Empty State - No Search Query
        <div className="text-center py-16">
          <p className="text-xl text-gray-600 mb-8">
            Enter a search term to find books and categories
          </p>
          
          <div className="max-w-4xl mx-auto">
            <h3 className="text-lg font-semibold mb-4 text-[var(--wood-brown)]">
              Popular Categories
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {allCategories.slice(0, 8).map((category) => (
                <Link
                  key={category.id}
                  href={`/catalog?category=${category.id}`}
                  className="p-4 bg-white rounded-lg border border-gray-200 hover:border-[var(--wood-brown)] transition text-center"
                >
                  <span className="text-sm font-semibold text-[var(--wood-brown)]">
                    {category.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export const metadata = {
  title: "Search - The Book Haven",
  description: "Search for books, authors, and categories",
};