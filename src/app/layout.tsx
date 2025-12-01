import "./globals.css";
import { Merriweather } from "next/font/google";
import Navbar from "@/components/layout/navbar";
import { ChatProvider, ChatModal } from "@/components/chat";
import { Toaster } from "sonner";

// [!code ++] 1. Import thêm các thư viện này
import { getSession } from "@/lib/session";
import { CartProvider } from "@/components/cart";
import { SessionProvider } from "@/components/session";

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-serif",
});

export const metadata = {
  title: "The Book Haven",
  description: "A classic online bookstore",
};

// [!code ++] 2. Thêm từ khóa async vào function
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // [!code ++] 3. Lấy dữ liệu session từ server
  const session = await getSession();

  return (
    <html lang="en" className={merriweather.className}>
      {/* [!code ++] 4. Bọc SessionProvider và CartProvider ở ngoài cùng */}
      <SessionProvider session={session}>
        <CartProvider initialSession={session}>
          <ChatProvider>
            <body>
              <Navbar />

              <main className="min-h-[80vh]">{children}</main>

              {/* FOOTER */}
              <footer className="bg-[var(--wood-brown)] text-[var(--warm-white)] mt-12">
                <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* ... (Giữ nguyên nội dung footer cũ của bạn) ... */}
                  <div>
                    <h4 className="text-xl font-semibold">The Book Haven</h4>
                    <p className="mt-2 text-sm text-[rgba(255,248,243,0.9)]">
                      A curated collection of timeless books. Craftsmanship in reading.
                    </p>
                  </div>
                  {/* ... (Giữ nguyên phần còn lại) ... */}
                </div>
                <div className="text-center text-[rgba(255,248,243,0.7)] py-4 border-t border-[rgba(255,248,243,0.06)]">
                  © {new Date().getFullYear()} The Book Haven
                </div>
              </footer>

              <ChatModal />
              <Toaster />
            </body>
          </ChatProvider>
        </CartProvider>
      </SessionProvider>
    </html>
  );
}