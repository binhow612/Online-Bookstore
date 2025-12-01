"use client"; // Cần thêm use client để dùng useState

import { formatCurrency, getBookCost } from "@/lib/utils";
import { Book } from "@/types";
import { StarIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useState } from "react"; // Import useState

// Mở rộng type Book để TypeScript hiểu trường bookReviews nếu có data kèm theo
type BookWithReviews = Book & {
  bookReviews?: { rating: number }[];
};

export function BookCard({
  book,
  imageProps,
}: {
  book: BookWithReviews;
  imageProps?: Partial<React.ComponentProps<typeof Image>>;
}) {
  // State để theo dõi xem ảnh có bị lỗi hay không
  const [isImageError, setIsImageError] = useState(false);

  const bookCost = getBookCost(book);

  const reviewCount = book.bookReviews?.length || 0;
  const averageRating =
    reviewCount > 0
      ? (
          book.bookReviews!.reduce((acc, r) => acc + r.rating, 0) / reviewCount
        ).toFixed(1)
      : null;

  return (
    <div className="group flex flex-col gap-2 p-4 bg-white rounded-lg hover:bg-gray-50 transition-colors h-full border border-transparent hover:border-[#8B6B4F]/20">
      {/* Phần Hình Ảnh */}
      <div className="relative w-full aspect-[2/3] bg-neutral-100 rounded-lg overflow-hidden mb-2 shadow-sm group-hover:shadow-md transition-all">
        <Image
          // Logic: Nếu isImageError là true thì dùng ảnh placeholder, ngược lại dùng ảnh gốc
          src={isImageError ? "/book-placeholder.png" : book.cover_url}
          alt={book.title}
          className={`w-full h-full object-cover transition-transform group-hover:scale-105 ${
            isImageError ? "opacity-50 grayscale" : "" // Thêm hiệu ứng mờ/xám nếu là ảnh placeholder (tùy chọn)
          }`}
          width={192}
          height={288}
          // Sự kiện khi ảnh gốc bị lỗi tải
          onError={() => setIsImageError(true)}
          // Thêm unoptimized nếu ảnh gốc là URL ngoại lai (ví dụ từ Picsum) để tránh lỗi Next/Image config
          // Nếu cover_url của bạn là ảnh nội bộ trong /public thì có thể bỏ dòng này
          unoptimized={!isImageError && book.cover_url.startsWith("http")}
          {...imageProps}
        />
        {/* Badges */}
        <div className="absolute top-2 right-2 flex flex-col items-end gap-2">
          {book.featured && (
            <span className="bg-[#0F766E] text-white text-[10px] uppercase font-bold py-1 px-2 rounded shadow-sm">
              Featured
            </span>
          )}
          {Number(book.discount_percent) > 0 && (
            <span className="bg-[#be123c] text-white text-[10px] font-bold py-1 px-2 rounded shadow-sm">
              -{parseInt(book.discount_percent)}%
            </span>
          )}
        </div>
      </div>

      {/* Phần Thông Tin (Giữ nguyên) */}
      <div className="flex flex-col flex-1">
        <h3
          className="text-lg font-serif font-bold text-[#4E3B31] line-clamp-1 group-hover:text-[#8B6B4F] transition-colors"
          title={book.title}
        >
          {book.title}
        </h3>
        <p className="text-sm text-[#4E3B31]/70 mb-1">by {book.author}</p>
        
        <p className="text-xs text-neutral-500 line-clamp-2 mb-3 flex-1">
          {book.description}
        </p>

        {/* Phần Giá và Đánh giá (Cùng hàng) */}
        <div className="flex items-end justify-between mt-auto pt-2 border-t border-gray-100">
          {/* Giá tiền */}
          <div className="flex flex-col leading-none">
            {bookCost.price !== bookCost.originalPrice && (
              <span className="text-xs text-neutral-400 line-through mb-1">
                {formatCurrency(bookCost.originalPrice)}
              </span>
            )}
            <span className="text-xl font-bold text-[#8B6B4F]">
              {formatCurrency(bookCost.price)}
            </span>
          </div>

          {/* Số sao */}
          {averageRating ? (
            <div className="flex items-center gap-1 bg-[#F5EDE3] px-2 py-1 rounded-md">
              <StarIcon className="w-4 h-4 text-[#C8A165]" />
              <span className="text-sm font-bold text-[#4E3B31]">
                {averageRating}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1 opacity-40">
               <StarIcon className="w-4 h-4 text-gray-400" />
               <span className="text-xs text-gray-500">Chưa có</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}