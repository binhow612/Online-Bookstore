"use client";

import Link from "next/link";
import { Logo } from "@/components/logo";
import { useCart } from "@/components/cart";
import {
  HomeIcon,
  BookOpenIcon,
  MagnifyingGlassIcon,
  UserIcon,
  ShoppingCartIcon,
  InformationCircleIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { totalQuantities } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="bg-[var(--beige-cream)] border-b border-[rgba(78,59,49,0.06)] sticky top-0 z-40 header-shadow">
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex-shrink-0">
            <Logo />
          </div>

          <nav className="hidden md:flex items-center gap-2 text-sm text-[var(--dark-coffee)]">
            <Link
              href="/home"
              className="px-3 py-2 rounded-md hover:bg-[var(--warm-white)] flex items-center gap-2"
            >
              <HomeIcon className="w-5 h-5" />
              <span className="hidden lg:inline">Home</span>
            </Link>

            <Link
              href="/catalog"
              className="px-3 py-2 rounded-md hover:bg-[var(--warm-white)] flex items-center gap-2"
            >
              <BookOpenIcon className="w-5 h-5" />
              <span className="hidden lg:inline">Catalogue</span>
            </Link>

            <Link
              href="/about"
              className="px-3 py-2 rounded-md hover:bg-[var(--warm-white)] flex items-center gap-2"
            >
              <InformationCircleIcon className="w-5 h-5" />
              <span className="hidden lg:inline">About</span>
            </Link>

            <Link
              href="/support"
              className="px-3 py-2 rounded-md hover:bg-[var(--warm-white)] flex items-center gap-2"
            >
              <DocumentTextIcon className="w-5 h-5" />
              <span className="hidden lg:inline">Support</span>
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/search"
            className="px-3 py-2 rounded-md text-sm hover:bg-[var(--warm-white)]"
          >
            <MagnifyingGlassIcon className="w-5 h-5" />
          </Link>
          <Link
            href="/account"
            className="px-3 py-2 rounded-md text-sm hover:bg-[var(--warm-white)]"
          >
            <UserIcon className="w-5 h-5" />
          </Link>

          <Link
            href="/cart"
            className="relative px-3 py-2 rounded-md text-sm border border-[rgba(78,59,49,0.06)] hover:bg-[var(--warm-white)] transition-colors"
          >
            <ShoppingCartIcon className="w-5 h-5" />
            
            {mounted && totalQuantities > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#C8A165] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center border border-white shadow-sm">
                {totalQuantities > 99 ? "99+" : totalQuantities}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}