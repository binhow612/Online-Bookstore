import { notFound } from "next/navigation";
import { db } from "@/db";
import { booksTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ProductGallery } from "./product-gallery";
import { Star } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { BookReviews } from "./book-reviews";
import { AddToCartBook } from "@/components/add-to-cart-book"; // Import component

export default async function ProductPage({
  params,
}: {
  params: Promise<{ book_id: string }>;
}) {
  const { book_id } = await params;

  const book = await db.query.booksTable.findFirst({
    where: eq(booksTable.id, book_id),
    with: {
      bookCategories: {
        with: {
          category: true,
        },
      },
      bookReviews: {
        with: {
          user: true, 
        },
        orderBy: (reviews, { desc }) => [desc(reviews.created_at)],
        limit: 5,
      },
      bookOrderItems: true,
    },
  });

  if (!book) return notFound();

  // --- Tính toán số liệu ---
  const reviewCount = book.bookReviews.length;
  const averageRating =
    reviewCount > 0
      ? book.bookReviews.reduce((acc, review) => acc + review.rating, 0) / reviewCount
      : 0;
  const ratingDisplay = averageRating > 0 ? averageRating.toFixed(1) : "Chưa có";

  // Tính số lượng đã bán
  const soldCount = book.bookOrderItems 
    ? book.bookOrderItems.reduce((acc, item) => acc + item.quantity, 0)
    : 0;

  const originalPrice = Number(book.price);
  const discountPercent = Number(book.discount_percent);
  const hasDiscount = discountPercent > 0;
  const finalPrice = hasDiscount
    ? originalPrice * (1 - discountPercent / 100)
    : originalPrice;

  const images = book.cover_url ? [book.cover_url] : [];
  if (images.length > 0) {
      // Giả lập thêm ảnh thumb nếu chỉ có 1 ảnh
      images.push(images[0], images[0], images[0]); 
  }

  const categoryNames = book.bookCategories.map((bc) => bc.category.name).join(", ");

  return (
    <div className="bg-[#F5EDE3] min-h-screen pb-10 text-[#4E3B31]">
      <div className="container mx-auto pt-6">
        
        {/* MAIN PRODUCT CARD */}
        <div className="bg-[#FBF8F3] rounded-xl shadow-[0_6px_18px_rgba(78,59,49,0.06)] p-6 border border-[#4E3B31]/10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-5">
              <ProductGallery images={images} />
            </div>

            <div className="md:col-span-7 flex flex-col gap-6">
              <h1 className="text-2xl md:text-3xl font-bold text-[#8B6B4F] line-clamp-2 font-serif">
                {book.title}
              </h1>

              <div className="text-lg text-[#4E3B31]/80">
                Tác giả: <span className="font-semibold">{book.author}</span>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 border-r pr-4 border-[#8B6B4F]/30">
                  <span className="text-[#C8A165] border-b border-[#C8A165] font-bold text-lg">
                    {ratingDisplay}
                  </span>
                  <div className="flex text-[#C8A165]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.round(averageRating) ? "fill-current" : "text-gray-300"
                        }`}
                      />
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
                {hasDiscount && (
                  <span className="text-[#4E3B31]/60 line-through text-lg font-serif">
                    {formatCurrency(originalPrice)}
                  </span>
                )}
                <span className="text-[#8B6B4F] text-4xl font-bold font-serif">
                  {formatCurrency(finalPrice)}
                </span>
                {hasDiscount && (
                  <span className="bg-[#C8A165] text-white text-xs font-bold px-2 py-1 rounded-sm uppercase">
                    {parseInt(discountPercent.toString())}% GIẢM
                  </span>
                )}
              </div>

              <div className="space-y-6 pl-2">
                <div className="flex gap-4 items-center text-sm">
                  <span className="text-[#4E3B31]/70 w-24">Chính sách</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[#4E3B31]">Trả hàng 15 ngày</span>
                    <span className="text-[#4E3B31]/50 text-xs">Đổi ý miễn phí</span>
                  </div>
                </div>

                {/* Sử dụng component AddToCartBook thay cho code cũ */}
                <AddToCartBook book={book} />
              </div>
            </div>
          </div>
        </div>

        {/* PRODUCT DETAILS SECTION */}
        <div className="bg-[#FBF8F3] rounded-xl shadow-[0_6px_18px_rgba(78,59,49,0.06)] p-6 mt-6 border border-[#4E3B31]/10">
          <div className="bg-[#F5EDE3] p-3 mb-6 rounded-md">
            <h2 className="text-lg font-bold text-[#8B6B4F] uppercase">Chi tiết sản phẩm</h2>
          </div>
          <div className="space-y-4 px-4 text-sm text-[#4E3B31]">
            <div className="grid grid-cols-12 gap-4">
               <div className="col-span-3 md:col-span-2 text-[#4E3B31]/70">Danh Mục</div>
               <div className="col-span-9 md:col-span-10 text-[#8B6B4F] font-medium font-serif">
                  {categoryNames || "Sách"}
               </div>
            </div>
            <div className="grid grid-cols-12 gap-4">
               <div className="col-span-3 md:col-span-2 text-[#4E3B31]/70">Nhà xuất bản</div>
               <div className="col-span-9 md:col-span-10">{book.publisher || "Đang cập nhật"}</div>
            </div>
             <div className="grid grid-cols-12 gap-4">
               <div className="col-span-3 md:col-span-2 text-[#4E3B31]/70">Năm xuất bản</div>
               <div className="col-span-9 md:col-span-10">{book.publication_year || "N/A"}</div>
            </div>
            <div className="grid grid-cols-12 gap-4">
               <div className="col-span-3 md:col-span-2 text-[#4E3B31]/70">Số trang</div>
               <div className="col-span-9 md:col-span-10">{book.page_count || "N/A"}</div>
            </div>
            <div className="grid grid-cols-12 gap-4">
               <div className="col-span-3 md:col-span-2 text-[#4E3B31]/70">ISBN</div>
               <div className="col-span-9 md:col-span-10">{book.isbn || "N/A"}</div>
            </div>
          </div>
        </div>

        {/* PRODUCT DESCRIPTION SECTION */}
        <div className="bg-[#FBF8F3] rounded-xl shadow-[0_6px_18px_rgba(78,59,49,0.06)] p-6 mt-6 border border-[#4E3B31]/10">
           <div className="bg-[#F5EDE3] p-3 mb-6 rounded-md">
            <h2 className="text-lg font-bold text-[#8B6B4F] uppercase">Mô tả sản phẩm</h2>
          </div>
          <div className="px-4 text-[#4E3B31] leading-relaxed whitespace-pre-line text-sm font-serif">
            {book.description || "Chưa có mô tả cho sản phẩm này."}
          </div>
        </div>

        {/* PRODUCT REVIEWS SECTION */}
        <BookReviews reviews={book.bookReviews} book={book} />
      </div>
    </div>
  );
}