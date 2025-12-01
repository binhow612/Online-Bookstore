import "./globals.css";
import { Merriweather } from "next/font/google";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
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
              <Footer />

              <ChatModal />
              <Toaster />
            </body>
          </ChatProvider>
        </CartProvider>
      </SessionProvider>
    </html>
  );
}