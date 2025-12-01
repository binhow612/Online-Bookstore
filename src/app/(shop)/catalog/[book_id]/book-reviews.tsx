"use client";

import { useSession } from "@/components/session";
import { Button } from "@/components/ui/button";
import { Book, BookReview } from "@/types"; // Đảm bảo import đúng type từ dự án của bạn
import { Star, Trash2, User, LogIn } from "lucide-react"; // Dùng Lucide icons
import { format } from "date-fns";
import { vi } from "date-fns/locale"; // Format ngày tháng tiếng Việt
import Link from "next/link";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { createBookReview, deleteBookReview } from "./actions"; // Import server actions cũ
import { cn } from "@/lib/utils";

// --- SUB-COMPONENT: FORM VIẾT ĐÁNH GIÁ ---
function BookReviewForm({ book }: { book: Book }) {
  const [rating, setRating] = useState(5);
  const { pending } = useFormStatus();
  const session = useSession();

  // Chưa đăng nhập -> Hiện thông báo yêu cầu login
  if (!session.user) {
    return (
      <div className="bg-[#F5EDE3] p-6 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#8B6B4F]/20">
        <div className="flex items-center gap-3 text-[#4E3B31]">
          <div className="p-2 bg-[#8B6B4F]/10 rounded-full">
            <LogIn className="w-5 h-5 text-[#8B6B4F]" />
          </div>
          <span className="font-medium">Đăng nhập để viết đánh giá cho cuốn sách này</span>
        </div>
        <Link
          href={`/login?next=${encodeURIComponent(`/catalog/${book.id}`)}`}
        >
          <Button variant="outline" className="border-[#8B6B4F] text-[#8B6B4F] hover:bg-[#8B6B4F] hover:text-white bg-transparent">
            Đăng nhập ngay
          </Button>
        </Link>
      </div>
    );
  }

  // Đã đăng nhập -> Hiện form
  return (
    <form className="flex flex-col gap-4 bg-[#fff] p-4 rounded-lg border border-[#8B6B4F]/10 shadow-sm" action={createBookReview}>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-[#8B6B4F]">Đánh giá của bạn</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="transition-transform hover:scale-110 focus:outline-none"
              onClick={() => setRating(star)}
              aria-label={`Rate ${star}`}
              disabled={pending}
            >
              <Star 
                className={cn(
                  "w-6 h-6 transition-colors", 
                  star <= rating 
                    ? "fill-[#C8A165] text-[#C8A165]" // Màu vàng kim
                    : "text-[#8B6B4F]/30" // Màu nâu nhạt
                )} 
              />
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="comment" className="text-sm font-medium text-[#8B6B4F]">Nhận xét</label>
        <textarea
          id="comment"
          className="w-full p-3 bg-[#FBF8F3] border border-[#8B6B4F]/20 rounded-md focus:outline-none focus:ring-1 focus:ring-[#8B6B4F] text-[#4E3B31] min-h-[100px] placeholder:text-[#4E3B31]/40"
          placeholder="Chia sẻ cảm nhận của bạn về cuốn sách này..."
          rows={3}
          disabled={pending}
          required
          name="comment"
        />
      </div>

      <input type="hidden" name="book_id" value={book.id} />
      <input type="hidden" name="rating" value={rating} />
      
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={pending}
          className="bg-[#8B6B4F] hover:bg-[#6d543e] text-white font-medium px-6"
        >
          {pending ? "Đang gửi..." : "Gửi đánh giá"}
        </Button>
      </div>
    </form>
  );
}

// --- SUB-COMPONENT: CARD HIỂN THỊ ĐÁNH GIÁ ---
function BookReviewCard({ review }: { review: BookReview }) {
  const session = useSession();
  const [isDeleting, setIsDeleting] = useState(false);

  const onDelete = async () => {
    if (isDeleting) return;
    if (!confirm("Bạn có chắc muốn xóa đánh giá này?")) return;
    
    setIsDeleting(true);
    try {
      await deleteBookReview(review.id);
      toast.success("Đã xóa đánh giá");
    } catch {
      toast.error("Xóa đánh giá thất bại");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="border-b border-[#8B6B4F]/10 pb-6 last:border-0 last:pb-0">
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="h-10 w-10 rounded-full bg-[#E8DFC5] flex items-center justify-center text-[#8B6B4F] overflow-hidden border border-[#8B6B4F]/20">
             <User className="h-6 w-6" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm text-[#4E3B31] font-bold">
                {review.user?.first_name} {review.user?.last_name || "Người dùng ẩn danh"}
              </div>
              
              {/* Rating Stars */}
              <div className="flex items-center gap-1 my-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "w-3.5 h-3.5",
                      star <= review.rating ? "fill-[#C8A165] text-[#C8A165]" : "text-[#8B6B4F]/30"
                    )}
                  />
                ))}
              </div>

              {/* Date */}
              <div className="text-xs text-[#4E3B31]/50 mb-2">
                {format(new Date(review.created_at), "dd MMMM, yyyy HH:mm", { locale: vi })} | Phân loại hàng: Sách in
              </div>
            </div>

            {/* Delete Button (Chỉ hiện nếu là chủ sở hữu) */}
            {session.user?.id === review.user_id && (
              <button
                className="text-xs text-[#4E3B31]/40 hover:text-red-500 flex items-center gap-1 transition-colors"
                onClick={onDelete}
                disabled={isDeleting}
                title="Xóa đánh giá"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Xóa</span>
              </button>
            )}
          </div>

          {/* Comment Text */}
          <div className="text-[#4E3B31] text-sm leading-relaxed mt-1 bg-[#fff]/50 p-0 rounded">
            {review.comment}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- MAIN COMPONENT ---
export function BookReviews({ reviews, book }: { reviews: BookReview[]; book: Book }) {
  return (
    <div className="bg-[#FBF8F3] rounded-xl shadow-[0_6px_18px_rgba(78,59,49,0.06)] p-6 mt-6 border border-[#4E3B31]/10">
      <div className="bg-[#F5EDE3] p-3 mb-6 rounded-md">
        <h2 className="text-lg font-bold text-[#8B6B4F] uppercase">Đánh giá sản phẩm</h2>
      </div>

      {/* Form viết đánh giá */}
      <div className="mb-8">
        <BookReviewForm book={book} />
      </div>

      {/* Danh sách đánh giá */}
      <div className="space-y-6 px-0 sm:px-4">
        {!reviews?.length ? (
          <div className="text-center py-8 flex flex-col items-center gap-2">
            <Star className="w-12 h-12 text-[#8B6B4F]/20" />
            <p className="text-[#4E3B31]/70 font-serif">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <BookReviewCard key={review.id} review={review} />
          ))
        )}
      </div>
    </div>
  );
}