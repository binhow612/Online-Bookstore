'use client';

import { useEffect, useState } from 'react';
import BookCard from '@/components/BookCard';

interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  cover: string;
}

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/api/books') // đổi URL thành backend của bạn
      .then(res => res.json())
      .then(data => {
        setBooks(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch books:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center mt-10">Loading books...</p>;

  // Lấy 3 sách đầu tiên cho "Today's picks"
  const todaysPicks = books.slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-10">
      <section className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="col-span-2 bg-[var(--warm-white)] p-6 rounded-2xl book-card">
          <h1 className="text-3xl md:text-4xl">Welcome to The Book Haven</h1>
          <p className="mt-3 text-[rgba(78,59,49,0.7)]">
            A curated collection of books chosen for their craft, story and soul. Find your next treasured read.
          </p>
          <div className="mt-5">
            <a href="/catalog" className="btn-wood">Browse the Catalog</a>
          </div>
        </div>

        <aside className="bg-[var(--warm-white)] p-6 rounded-2xl book-card">
          <h3 className="font-semibold">Today's picks</h3>
          <ul className="mt-4 space-y-3 text-sm text-[rgba(78,59,49,0.8)]">
            {todaysPicks.map(book => (
              <li key={book.id}>📚 {book.title} — ${book.price.toFixed(2)}</li>
            ))}
          </ul>
        </aside>
      </section>

      <section>
        <h2 className="text-2xl mb-4">Featured Titles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map(b => (
            <BookCard key={b.id} book={b} />
          ))}
        </div>
      </section>
    </div>
  );
}
