import { BookCard } from "@/components/book-card";
import { SimpleSearchForm } from "@/components/search-bar";
import { getBooks, getCategories } from "@/lib/data";
import Link from "next/link";
import { BookOpen, Truck, Star, Sparkles, LibraryBig, ArrowRight } from "lucide-react";

export default async function LandingPage() {
  // Fetch real data from database
  const allBooks = await getBooks();
  const allCategories = await getCategories();
  const featuredBooks = allBooks.filter((book) => book.featured).slice(0, 8);

  return (
    <div className="flex flex-col min-h-screen font-sans text-[#4E3B31]">
      
      {/* 1. HERO SECTION: Ấn tượng đầu tiên */}
      <section className="relative bg-[#F5EDE3] py-20 md:py-32 px-4 flex flex-col items-center text-center overflow-hidden">
        {/* Background Pattern mờ (nếu có) */}
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#8B6B4F_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="inline-flex items-center justify-center p-3 bg-[#8B6B4F]/10 rounded-full mb-4">
            <LibraryBig className="w-8 h-8 text-[#8B6B4F]" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-[#4E3B31] tracking-tight leading-tight">
            The Old Library <br />
            <span className="text-[#8B6B4F]">Bookstore</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-[#4E3B31]/80 font-light italic font-serif max-w-2xl mx-auto">
            "Where every story finds its reader."
          </p>

          <div className="pt-8 w-full max-w-2xl mx-auto">
            <div className="bg-white p-2 rounded-xl shadow-xl border border-[#8B6B4F]/20">
              <SimpleSearchForm
                placeholder="Tìm kiếm sách, tác giả, thể loại..."
                className="w-full"
              />
            </div>
            <p className="mt-3 text-sm text-[#4E3B31]/60">
              Phổ biến: Văn học, Kinh tế, Tiểu thuyết, Lịch sử...
            </p>
          </div>
        </div>
      </section>

      {/* 2. STATS & FEATURES: Nền trắng sạch sẽ */}
      <section className="bg-white py-16 px-4 border-y border-[#4E3B31]/5">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-4">
              <div className="text-3xl md:text-4xl font-bold text-[#8B6B4F] mb-1">{allBooks.length}+</div>
              <div className="text-sm font-medium uppercase tracking-wider text-[#4E3B31]/60">Đầu Sách</div>
            </div>
            <div className="p-4 border-l border-[#4E3B31]/10">
              <div className="text-3xl md:text-4xl font-bold text-[#8B6B4F] mb-1">{allCategories.length}</div>
              <div className="text-sm font-medium uppercase tracking-wider text-[#4E3B31]/60">Thể Loại</div>
            </div>
            <div className="p-4 border-l border-[#4E3B31]/10">
              <div className="text-3xl md:text-4xl font-bold text-[#8B6B4F] mb-1">24/7</div>
              <div className="text-sm font-medium uppercase tracking-wider text-[#4E3B31]/60">Hỗ Trợ</div>
            </div>
            <div className="p-4 border-l border-[#4E3B31]/10">
              <div className="text-3xl md:text-4xl font-bold text-[#8B6B4F] mb-1">100%</div>
              <div className="text-sm font-medium uppercase tracking-wider text-[#4E3B31]/60">Chính Hãng</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-16">
            <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-xl hover:bg-[#F9F5F1] transition-colors">
              <div className="w-12 h-12 bg-[#F5EDE3] rounded-full flex items-center justify-center text-[#8B6B4F]">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg">Kho Sách Đa Dạng</h3>
              <p className="text-sm text-[#4E3B31]/70">Từ văn học kinh điển đến sách bán chạy hiện đại.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-xl hover:bg-[#F9F5F1] transition-colors">
              <div className="w-12 h-12 bg-[#F5EDE3] rounded-full flex items-center justify-center text-[#8B6B4F]">
                <Star className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg">Tuyển Chọn Kỹ Lưỡng</h3>
              <p className="text-sm text-[#4E3B31]/70">Sách được chọn lọc và bảo quản cẩn thận.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-xl hover:bg-[#F9F5F1] transition-colors">
              <div className="w-12 h-12 bg-[#F5EDE3] rounded-full flex items-center justify-center text-[#8B6B4F]">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg">Ưu Đãi Đặc Biệt</h3>
              <p className="text-sm text-[#4E3B31]/70">Nhiều chương trình khuyến mãi hấp dẫn mỗi tuần.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-3 p-6 rounded-xl hover:bg-[#F9F5F1] transition-colors">
              <div className="w-12 h-12 bg-[#F5EDE3] rounded-full flex items-center justify-center text-[#8B6B4F]">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg">Giao Hàng Nhanh</h3>
              <p className="text-sm text-[#4E3B31]/70">Đóng gói cẩn thận và vận chuyển toàn quốc.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED BOOKS: Nền Beige ấm áp */}
      {featuredBooks.length > 0 && (
        <section className="bg-[#FBF8F3] py-20 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#4E3B31] mb-2">
                  Sách Nổi Bật
                </h2>
                <div className="h-1 w-20 bg-[#8B6B4F] rounded-full"></div>
                <p className="mt-4 text-[#4E3B31]/70 max-w-xl">
                  Những tựa sách được yêu thích nhất và đánh giá cao bởi cộng đồng độc giả.
                </p>
              </div>
              <Link 
                href="/catalog?featured=true" 
                className="group flex items-center gap-2 text-[#8B6B4F] font-bold hover:text-[#6d543e] transition-colors"
              >
                Xem tất cả <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {featuredBooks.map((book, index) => (
                <Link key={book.id} href={`/catalog/${book.id}`} className="group h-full">
                  <div className="h-full transition-transform duration-300 group-hover:-translate-y-1">
                    <BookCard
                      book={book}
                      imageProps={index < 4 ? { priority: true } : undefined}
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. CATEGORIES: Nền trắng */}
      <section className="bg-white py-20 px-4">
        <div className="container mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-serif font-bold text-[#4E3B31] mb-12">
            Khám Phá Theo Thể Loại
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {allCategories.map((category) => (
              <Link
                key={category.id}
                href={`/catalog?category=${category.id}`}
                className="px-6 py-3 bg-[#F9F5F1] border border-[#4E3B31]/10 rounded-full hover:bg-[#8B6B4F] hover:text-white hover:border-[#8B6B4F] transition-all text-sm font-medium shadow-sm hover:shadow-md"
                title={category.description || undefined}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. ABOUT TEASER: Nền tối (Dark Brown) tạo điểm nhấn cuối trang */}
      <section className="bg-[#4E3B31] text-[#F5EDE3] py-24 px-6 text-center relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-[#FFFFFF] opacity-5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#C8A165] opacity-10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight">
            Thế Giới Dành Cho <br/> Những Người Yêu Sách
          </h2>
          <p className="text-lg opacity-80 leading-relaxed font-light">
            "Chào mừng bạn đến với cửa hàng sách trực tuyến mang phong cách cổ điển của chúng tôi — nơi những câu chuyện vượt thời gian gặp gỡ sự tiện lợi hiện đại. Hãy bước vào một thế giới được tạo ra bởi độc giả, dành cho độc giả."
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="/catalog"
              className="px-10 py-4 bg-[#C8A165] text-[#4E3B31] font-bold rounded-lg shadow-[0_4px_14px_rgba(200,161,101,0.3)] hover:bg-[#b08d55] hover:shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              Dạo Cửa Hàng
            </Link>
            <Link
              href="/about"
              className="px-10 py-4 bg-transparent border border-[#F5EDE3]/30 text-[#F5EDE3] font-semibold rounded-lg hover:bg-[#F5EDE3]/10 transition-all"
            >
              Về Chúng Tôi
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}