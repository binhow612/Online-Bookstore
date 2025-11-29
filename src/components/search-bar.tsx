"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";

interface SearchBarProps {
  placeholder?: string;
  defaultValue?: string;
  className?: string;
  inputClassName?: string;
  autoFocus?: boolean;
}

export function SearchBar({
  placeholder = "Search for books, authors, categories...",
  defaultValue = "",
  className = "",
  inputClassName = "",
  autoFocus = false,
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={`w-full px-5 py-4 pl-14 text-base md:text-lg rounded-lg border-2 border-gray-300 focus:border-[var(--wood-brown)] focus:outline-none shadow-sm ${inputClassName}`}
      />
      <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-[var(--wood-brown)] hover:bg-[#6b4e2e] transition text-white text-sm font-semibold rounded-md"
      >
        Search
      </button>
    </form>
  );
}

// Alternative: Simple search form (no client JS)
export function SimpleSearchForm({
  placeholder = "Search...",
  defaultValue = "",
  className = "",
}: SearchBarProps) {
  return (
    <form method="GET" action="/search" className={`relative ${className}`}>
      <input
        type="text"
        name="q"
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full px-5 py-4 pl-14 text-base md:text-lg rounded-lg border-2 border-gray-300 focus:border-[var(--wood-brown)] focus:outline-none shadow-sm"
      />
      <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-[var(--wood-brown)] hover:bg-[#6b4e2e] transition text-white text-sm font-semibold rounded-md"
      >
        Search
      </button>
    </form>
  );
}