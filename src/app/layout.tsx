// src/app/layout.tsx

import "./globals.css";
import { Merriweather } from "next/font/google";
import Link from "next/link";

import {
  HomeIcon,
  BookOpenIcon,
  MagnifyingGlassIcon,
  UserIcon,
  ShoppingCartIcon,
  InformationCircleIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

// Chat components
import { ChatProvider, ChatModal } from "@/components/chat";

// ⭐ Toaster (để hiển thị toast Add to Cart)
import { Toaster } from "sonner";

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-serif",
});

export const metadata = {
  title: "The Book Haven",
  description: "A classic online bookstore",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={merriweather.className}>
      <ChatProvider>
        <body>
          {/* HEADER */}
          <header className="bg-[var(--beige-cream)] border-b border-[rgba(78,59,49,0.06)] sticky top-0 z-40 header-shadow">
            <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <Link
                  href="/"
                  className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--wood-brown)]"
                >
                  The Book Haven
                </Link>

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
                    <span className="hidden lg:inline">Catalog</span>
                  </Link>

                  <Link
                    href="/about"
                    className="px-3 py-2 rounded-md hover:bg-[var(--warm-white)] flex items-center gap-2"
                  >
                    <InformationCircleIcon className="w-5 h-5" />
                    <span className="hidden lg:inline">About</span>
                  </Link>

                  <Link
                    href="/policy"
                    className="px-3 py-2 rounded-md hover:bg-[var(--warm-white)] flex items-center gap-2"
                  >
                    <DocumentTextIcon className="w-5 h-5" />
                    <span className="hidden lg:inline">Policies</span>
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
                  href="/checkout"
                  className="px-3 py-2 rounded-md text-sm border border-[rgba(78,59,49,0.06)] hover:bg-[var(--warm-white)]"
                >
                  <ShoppingCartIcon className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </header>

          {/* MAIN CONTENT */}
          <main className="min-h-[80vh]">{children}</main>

          {/* FOOTER */}
          <footer className="bg-[var(--wood-brown)] text-[var(--warm-white)] mt-12">
            <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="text-xl font-semibold">The Book Haven</h4>
                <p className="mt-2 text-sm text-[rgba(255,248,243,0.9)]">
                  A curated collection of timeless books. Craftsmanship in
                  reading.
                </p>
              </div>

              <div>
                <h5 className="font-semibold">Customer</h5>
                <ul className="mt-3 text-sm space-y-2 text-[rgba(255,248,243,0.9)]">
                  <li>
                    <Link href="/refunds-and-returns-terms" className="hover:underline">
                      Shipping & Returns
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="hover:underline">
                      Terms & Conditions
                    </Link>
                  </li>
                  <li>
                    <Link href="/promotion-terms" className="hover:underline">
                      Promotions Terms
                    </Link>
                  </li>
                  <li>
                    <Link href="/accessibility-statement" className="hover:underline">
                      Accessibility
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h5 className="font-semibold">Contact</h5>
                <p className="mt-3 text-sm text-[rgba(255,248,243,0.9)]">
                  hello@bookhaven.example
                </p>
              </div>
            </div>

            <div className="text-center text-[rgba(255,248,243,0.7)] py-4 border-t border-[rgba(255,248,243,0.06)]">
              © {new Date().getFullYear()} The Book Haven
            </div>
          </footer>

          {/* Chat support */}
          <ChatModal />

          {/* ⭐ Toaster để hiển thị toast Add to Cart */}
          <Toaster />
        </body>
      </ChatProvider>
    </html>
  );
}
