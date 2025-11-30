import { BookCard } from "@/components/book-card";
import { SimpleSearchForm } from "@/components/search-bar";
import { getBooks, getCategories } from "@/lib/data";
import Link from "next/link";

export default async function LandingPage() {
  // Fetch real data from database
  const allBooks = await getBooks();
  const allCategories = await getCategories();
  const featuredBooks = allBooks.filter(book => book.featured).slice(0, 8);

  return (
    <div className="min-h-screen bg-[#f7f2e8] flex flex-col items-center py-12 px-6">
      {/* Decorative frame */}
      <div className="w-full max-w-5xl border-4 border-[#8b6b3f] rounded-xl p-8 md:p-12 shadow-[0_0_30px_rgba(0,0,0,0.25)] bg-[#fcf9f3] mb-12">
        {/* Title */}
        <h1 className="text-center text-4xl md:text-5xl font-serif font-bold text-[#6b4e2e] tracking-wide">
          The Old Library Bookstore
        </h1>

        {/* Slogan */}
        <p className="text-center text-lg md:text-xl mt-4 font-light italic text-[#8b6b3f]">
          "Where every story finds its reader."
        </p>

        {/* Divider */}
        <div className="mt-8 w-full border-t border-[#c9b49a]"></div>

        {/* About */}
        <div className="mt-8 text-center text-base md:text-lg text-[#6a563d] leading-relaxed font-serif">
          Welcome to our classic-themed online bookstore — a place where
          timeless stories meet modern convenience. Explore thousands of books,
          curated collections, author highlights, and personalized
          recommendations. Step into a world crafted for readers, by readers.
        </div>

        {/* Search Bar */}
        <div className="mt-10">
          <SimpleSearchForm 
            placeholder="Search for books, authors, categories..."
            className="max-w-2xl mx-auto"
          />
        </div>

        {/* Quick Stats */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-[#f7f2e8] rounded-lg border border-[#c9b49a]">
            <div className="text-3xl font-bold text-[#8b6b3f]">{allBooks.length}+</div>
            <div className="text-sm text-[#6a563d] mt-1 font-serif">Books Available</div>
          </div>
          <div className="text-center p-4 bg-[#f7f2e8] rounded-lg border border-[#c9b49a]">
            <div className="text-3xl font-bold text-[#8b6b3f]">{allCategories.length}</div>
            <div className="text-sm text-[#6a563d] mt-1 font-serif">Categories</div>
          </div>
          <div className="text-center p-4 bg-[#f7f2e8] rounded-lg border border-[#c9b49a]">
            <div className="text-3xl font-bold text-[#8b6b3f]">24/7</div>
            <div className="text-sm text-[#6a563d] mt-1 font-serif">Online Shopping</div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 border-l-4 border-[#8b6b3f]">
            <h3 className="text-lg font-serif font-semibold text-[#6b4e2e] mb-2">
              📚 Vast Collection
            </h3>
            <p className="text-sm text-[#6a563d] font-serif">
              From Vietnamese classics to international bestsellers, discover
              books across all genres.
            </p>
          </div>
          <div className="p-4 border-l-4 border-[#8b6b3f]">
            <h3 className="text-lg font-serif font-semibold text-[#6b4e2e] mb-2">
              ⭐ Featured Selections
            </h3>
            <p className="text-sm text-[#6a563d] font-serif">
              Handpicked recommendations and curated collections just for you.
            </p>
          </div>
          <div className="p-4 border-l-4 border-[#8b6b3f]">
            <h3 className="text-lg font-serif font-semibold text-[#6b4e2e] mb-2">
              💰 Special Offers
            </h3>
            <p className="text-sm text-[#6a563d] font-serif">
              Enjoy exclusive discounts and promotions on popular titles.
            </p>
          </div>
          <div className="p-4 border-l-4 border-[#8b6b3f]">
            <h3 className="text-lg font-serif font-semibold text-[#6b4e2e] mb-2">
              🚚 Fast Delivery
            </h3>
            <p className="text-sm text-[#6a563d] font-serif">
              Quick and reliable shipping to bring books to your doorstep.
            </p>
          </div>
        </div>

        {/* Categories Preview */}
        <div className="mt-10">
          <h2 className="text-center text-2xl font-serif font-bold text-[#6b4e2e] mb-6">
            Browse by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {allCategories.map((category) => (
              <Link
                key={category.id}
                href={`/catalog?category=${category.id}`}
                className="p-4 text-center bg-[#f7f2e8] hover:bg-[#ede4d3] border border-[#c9b49a] rounded-lg transition text-base text-[#6b4e2e] font-semibold"
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                title={category.description || undefined}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <a
            href="/catalog"
            className="px-10 py-4 bg-[#8b6b3f] hover:bg-[#6b4e2e] transition text-[#fcf9f3] text-lg font-semibold rounded-lg shadow-lg text-center"
          >
            Browse Catalog
          </a>
          <a
            href="/home"
            className="px-10 py-4 bg-transparent hover:bg-[#8b6b3f1a] transition border-2 border-[#8b6b3f] text-[#8b6b3f] hover:text-[#6b4e2e] text-lg font-semibold rounded-lg text-center"
          >
            Enter Home
          </a>
        </div>
      </div>

      {/* Featured Books Section */}
      {featuredBooks.length > 0 && (
        <div className="w-full max-w-7xl px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#6b4e2e] mb-2">
              Featured Books
            </h2>
            <p className="text-lg text-[#8b6b3f] font-serif italic">
              Discover our handpicked selection of must-read titles
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {featuredBooks.map((book, index) => (
              <Link key={book.id} href={`/catalog/${book.id}`}>
                <BookCard
                  book={book}
                  imageProps={index < 4 ? { priority: true } : undefined}
                />
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/catalog"
              className="inline-block px-8 py-3 bg-[#8b6b3f] hover:bg-[#6b4e2e] transition text-white font-serif font-semibold rounded-lg shadow-md"
            >
              View All Books →
            </Link>
          </div>
        </div>
      )}

      {/* Footer */}
      <p className="mt-12 text-sm text-[#8b6b3f] opacity-70">
        © 2025 The Old Library Bookstore
      </p>
    </div>
  );
}