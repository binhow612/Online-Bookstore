import { notFound } from "next/navigation";
import { db } from "@/db";
import { booksTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ProductGallery } from "./product-gallery";
import { Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
// [!code ++] Import component mới
import { BookReviews } from "./book-reviews";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ book_id: string }>;
}) {
  const { book_id } = await params;

  // Fetch book data with categories AND reviews
  const book = await db.query.booksTable.findFirst({
    where: eq(booksTable.id, book_id),
    with: {
      bookCategories: {
        with: {
          category: true,
        },
      },
      // [!code ++] Lấy thêm reviews và thông tin người user đánh giá
      bookReviews: {
        with: {
          user: true, 
        },
        orderBy: (reviews, { desc }) => [desc(reviews.created_at)], // Sắp xếp mới nhất
        limit: 5, // Lấy 5 review tiêu biểu
      },
    },
  });

  if (!book) return notFound();

  // Mock data (giữ nguyên phần cũ của bạn)
  const rating = 4.8;
  const soldCount = 1200;
  const reviewCount = book.bookReviews.length > 0 ? book.bookReviews.length : 256; // Dùng số thật nếu có
  const originalPrice = Number(book.price) * 1.2;
  const discountPercent = "20%";
  
  const images = book.cover_url ? [book.cover_url] : [];
  if (images.length > 0) {
      images.push(images[0], images[0], images[0]); 
  }

  const categoryNames = book.bookCategories.map((bc) => bc.category.name).join(", ");

  return (
    <div className="bg-[#F5EDE3] min-h-screen pb-10 text-[#4E3B31]">
      <div className="container mx-auto pt-6">
        
        {/* MAIN PRODUCT CARD (Giữ nguyên code phần trên) */}
        <div className="bg-[#FBF8F3] rounded-xl shadow-[0_6px_18px_rgba(78,59,49,0.06)] p-6 border border-[#4E3B31]/10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-5">
              <ProductGallery images={images} />
            </div>

            <div className="md:col-span-7 flex flex-col gap-6">
              <h1 className="text-2xl md:text-3xl font-bold text-[#8B6B4F] line-clamp-2 font-serif">
                {book.title}
              </h1>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 border-r pr-4 border-[#8B6B4F]/30">
                  <span className="text-[#C8A165] border-b border-[#C8A165] font-bold text-lg">
                    {rating}
                  </span>
                  <div className="flex text-[#C8A165]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-1 border-r pr-4 border-[#8B6B4F]/30">
                  <span className="border-b border-[#4E3B31] font-bold text-lg text-[#4E3B31]">
                    {reviewCount}
                  </span>
                  <span className="text-[#4E3B31]/70">Đánh giá</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[#4E3B31] font-bold text-lg">
                    {soldCount}
                  </span>
                  <span className="text-[#4E3B31]/70">Đã bán</span>
                </div>
              </div>

              <div className="bg-[#F5EDE3] p-4 flex items-center gap-4 rounded-lg">
                <span className="text-[#4E3B31]/60 line-through text-lg font-serif">
                  {formatCurrency(originalPrice)}
                </span>
                <span className="text-[#8B6B4F] text-4xl font-bold font-serif">
                  {formatCurrency(Number(book.price))}
                </span>
                <span className="bg-[#C8A165] text-white text-xs font-bold px-2 py-1 rounded-sm uppercase">
                  {discountPercent} GIẢM
                </span>
              </div>

              <div className="space-y-6 pl-2">
                <div className="flex gap-4 items-center text-sm">
                  <span className="text-[#4E3B31]/70 w-24">Chính sách</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[#4E3B31]">Trả hàng 15 ngày</span>
                    <span className="text-[#4E3B31]/50 text-xs">Đổi ý miễn phí</span>
                  </div>
                </div>

                <div className="flex gap-4 items-center">
                   <span className="text-[#4E3B31]/70 w-24">Số lượng</span>
                   <div className="flex items-center border border-[#8B6B4F]/40 rounded-md bg-white">
                      <button className="px-3 py-1 border-r border-[#8B6B4F]/40 hover:bg-[#F5EDE3] text-[#4E3B31]">-</button>
                      <input type="text" value="1" className="w-14 text-center border-none focus:ring-0 h-8 bg-transparent text-[#4E3B31]" readOnly />
                      <button className="px-3 py-1 border-l border-[#8B6B4F]/40 hover:bg-[#F5EDE3] text-[#4E3B31]">+</button>
                   </div>
                   <span className="text-[#4E3B31]/70 text-sm ml-2">1200 sản phẩm có sẵn</span>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <Button 
                  variant="outline"
                  className="bg-[#F5EDE3] border-[#8B6B4F] text-[#8B6B4F] hover:bg-[#E8DFC5] h-12 px-8 text-base font-medium rounded-md shadow-sm"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Thêm Vào Giỏ Hàng
                </Button>

                <Button 
                  className="bg-gradient-to-b from-[#C8A165] to-[#8B6B4F] hover:opacity-90 text-white h-12 px-12 text-base font-bold rounded-md shadow-[0_6px_14px_rgba(139,107,79,0.14)] border-none"
                >
                  Mua Ngay
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* PRODUCT DETAILS SECTION (Giữ nguyên) */}
        <div className="bg-[#FBF8F3] rounded-xl shadow-[0_6px_18px_rgba(78,59,49,0.06)] p-6 mt-6 border border-[#4E3B31]/10">
          <div className="bg-[#F5EDE3] p-3 mb-6 rounded-md">
            <h2 className="text-lg font-bold text-[#8B6B4F] uppercase">Chi tiết sản phẩm</h2>
          </div>
          <div className="space-y-4 px-4 text-sm text-[#4E3B31]">
            <div className="grid grid-cols-12 gap-4">
               <div className="col-span-3 md:col-span-2 text-[#4E3B31]/70">Danh Mục</div>
               <div className="col-span-9 md:col-span-10 text-[#8B6B4F] font-medium font-serif underline decoration-[#8B6B4F]/40 cursor-pointer">
                  Shopee &gt; Nhà Sách Online &gt; {categoryNames || "Sách"}
               </div>
            </div>
            {/* ... các dòng khác giữ nguyên ... */}
            <div className="grid grid-cols-12 gap-4">
               <div className="col-span-3 md:col-span-2 text-[#4E3B31]/70">ISBN</div>
               <div className="col-span-9 md:col-span-10">978-3-16-148410-0</div>
            </div>
          </div>
        </div>

        {/* PRODUCT DESCRIPTION SECTION (Giữ nguyên) */}
        <div className="bg-[#FBF8F3] rounded-xl shadow-[0_6px_18px_rgba(78,59,49,0.06)] p-6 mt-6 border border-[#4E3B31]/10">
           <div className="bg-[#F5EDE3] p-3 mb-6 rounded-md">
            <h2 className="text-lg font-bold text-[#8B6B4F] uppercase">Mô tả sản phẩm</h2>
          </div>
          <div className="px-4 text-[#4E3B31] leading-relaxed whitespace-pre-line text-sm font-serif">
            {book.description || "Chưa có mô tả cho sản phẩm này."}
          </div>
        </div>

        {/* [!code ++] PRODUCT REVIEWS SECTION (Mới thêm vào) */}
        <BookReviews reviews={book.bookReviews} book={book} />

      </div>
    </div>
  );
}