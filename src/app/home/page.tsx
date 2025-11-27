import { BookCard } from '@/components/book-card';
import { getBooks } from '@/lib/data';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

export default async function Home() {
  const allBooks = await getBooks();
  
  // Get featured books
  const featuredBooks = allBooks.filter(book => book.featured).slice(0, 8);
  
  // Get books with discounts for "Today's picks"
  const discountedBooks = allBooks
    .filter(book => Number(book.discount_percent) > 0)
    .sort((a, b) => Number(b.discount_percent) - Number(a.discount_percent))
    .slice(0, 3);
  
  // If no discounted books, just show first 3 featured
  const todaysPicks = discountedBooks.length > 0 ? discountedBooks : featuredBooks.slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-10">
      <section className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="col-span-2 bg-[var(--warm-white)] p-6 rounded-2xl book-card">
          <h1 className="text-3xl md:text-4xl">Welcome to The Book Haven</h1>
          <p className="mt-3 text-[rgba(78,59,49,0.7)]">
            A curated collection of books chosen for their craft, story and soul. Find your next treasured read.
          </p>
          <div className="mt-5">
            <a href="/catalog" className="btn-wood">
              Browse the Catalog
            </a>
          </div>
        </div>

        <aside className="bg-[var(--warm-white)] p-6 rounded-2xl book-card">
          <h3 className="font-semibold">Today's picks</h3>
          <ul className="mt-4 space-y-3 text-sm text-[rgba(78,59,49,0.8)]">
            {todaysPicks.map((book) => {
              const price = Number(book.price) * (100 - Number(book.discount_percent)) / 100;
              return (
                <li key={book.id}>
                  <Link href={`/catalog/${book.id}`} className="hover:underline">
                    📚 {book.title} — ${formatPrice(price)}
                    {Number(book.discount_percent) > 0 && (
                      <span className="ml-2 text-rose-600 font-semibold">
                        {parseInt(book.discount_percent)}% off
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </aside>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl">Featured Titles</h2>
          <Link href="/catalog" className="text-sm text-[rgba(78,59,49,0.7)] hover:underline">
            View All →
          </Link>
        </div>
        
        {featuredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredBooks.map((book, index) => (
              <Link key={book.id} href={`/catalog/${book.id}`}>
                <BookCard
                  book={book}
                  imageProps={index < 4 ? { priority: true } : undefined}
                />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-[rgba(78,59,49,0.6)]">
            <p>No featured books available yet.</p>
            <Link href="/catalog" className="text-sm underline mt-2 inline-block">
              Browse all books
            </Link>
          </div>
        )}
      </section>

      {/* Optional: Add discounted books section */}
      {discountedBooks.length > 0 && (
        <section className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl">Special Offers</h2>
            <Link href="/catalog" className="text-sm text-[rgba(78,59,49,0.7)] hover:underline">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {discountedBooks.slice(0, 4).map((book) => (
              <Link key={book.id} href={`/catalog/${book.id}`}>
                <BookCard book={book} />
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}