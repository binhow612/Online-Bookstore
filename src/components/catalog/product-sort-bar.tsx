"use client";

import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

interface ProductSortBarProps {
  totalPages: number;
  currentPage: number;
}

export function ProductSortBar({ totalPages, currentPage }: ProductSortBarProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPriceOpen, setIsPriceOpen] = useState(false);

  // [Sửa đổi logic] Mặc định là 'newest' thay vì 'relevance'
  const currentSort = searchParams.get("sort") || "newest"; 

  const createSortUrl = (sortValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", sortValue);
    params.set("page", "1");
    return `/catalog?${params.toString()}`;
  };

  const handleSort = (sortValue: string) => {
    router.push(createSortUrl(sortValue));
    setIsPriceOpen(false);
  };

  const isActive = (value: string) => currentSort === value;

  const getPriceLabel = () => {
    if (currentSort === "price_asc") return "Giá: Thấp đến Cao";
    if (currentSort === "price_desc") return "Giá: Cao đến Thấp";
    return "Giá";
  };

  // Cấu hình Style (Giữ nguyên style màu nâu bạn đã duyệt)
  const activeBgColor = "bg-[#8B6B4F]";
  const activeHoverBgColor = "hover:bg-[#72563d]";
  const activeTextColor = "text-[#8B6B4F]";
  const inactiveHoverBgColor = "hover:bg-[#F5EDE3]";
  const roundedClass = "rounded-md";

  return (
    <div className={cn("flex flex-col md:flex-row md:items-center justify-between bg-[#F9F5F1] py-3 px-5 mb-6 gap-4 border border-[#4E3B31]/10", roundedClass)}>
      
      {/* Left: Sort Options */}
      <div className="flex items-center flex-wrap gap-2.5 text-sm">
        <span className="text-[#4E3B31]/70 mr-2 font-medium">Sắp xếp theo</span>

        {/* [ĐÃ XÓA] Nút Liên Quan */}

        {/* Nút Mới Nhất */}
        <button
          onClick={() => handleSort("newest")}
          className={cn(
            "h-[34px] px-4 capitalize shadow-sm transition-colors font-medium",
            roundedClass,
            isActive("newest")
               ? cn(activeBgColor, activeHoverBgColor, "text-white")
               : cn("bg-white text-[#4E3B31]", inactiveHoverBgColor)
          )}
        >
          Mới Nhất
        </button>

        {/* Nút Bán Chạy (Logic mới: dựa trên bookOrderItems) */}
        <button
          onClick={() => handleSort("best_selling")}
          className={cn(
            "h-[34px] px-4 capitalize shadow-sm transition-colors font-medium",
            roundedClass,
            isActive("best_selling")
               ? cn(activeBgColor, activeHoverBgColor, "text-white")
               : cn("bg-white text-[#4E3B31]", inactiveHoverBgColor)
          )}
        >
          Bán Chạy
        </button>

         {/* Nút Yêu Thích (Logic mới: dựa trên số sao rating) */}
         <button
          onClick={() => handleSort("rating")}
          className={cn(
            "h-[34px] px-4 capitalize shadow-sm transition-colors font-medium",
            roundedClass,
            isActive("rating")
               ? cn(activeBgColor, activeHoverBgColor, "text-white")
               : cn("bg-white text-[#4E3B31]", inactiveHoverBgColor)
          )}
        >
          Yêu Thích
        </button>

        {/* Dropdown Giá */}
        <div className="relative min-w-[200px]">
          <button
            onClick={() => setIsPriceOpen(!isPriceOpen)}
            className={cn(
              "h-[34px] w-full px-4 shadow-sm flex items-center justify-between bg-white text-[#4E3B31] font-medium",
              inactiveHoverBgColor,
              roundedClass,
              (currentSort === "price_asc" || currentSort === "price_desc") && activeTextColor
            )}
          >
            <span>{getPriceLabel()}</span>
            <ChevronDownIcon className="w-4 h-4 text-gray-500" />
          </button>
          
          {isPriceOpen && (
            <div className={cn("absolute top-full left-0 w-full mt-1 bg-white shadow-lg z-10 py-2 animate-in fade-in zoom-in-95 duration-100 border border-[#4E3B31]/10", roundedClass)}>
              <button
                onClick={() => handleSort("price_asc")}
                className={cn("w-full text-left px-4 py-2 hover:bg-[#F5EDE3]", isActive("price_asc") ? activeTextColor + " font-bold" : "text-[#4E3B31]")}
              >
                Giá: Thấp đến Cao
              </button>
              <button
                onClick={() => handleSort("price_desc")}
                className={cn("w-full text-left px-4 py-2 hover:bg-[#F5EDE3]", isActive("price_desc") ? activeTextColor + " font-bold" : "text-[#4E3B31]")}
              >
                Giá: Cao đến Thấp
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right: Mini Pagination */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-[#4E3B31]">
          <span className={cn("font-bold", activeTextColor)}>{currentPage}</span>
          <span className="text-[#4E3B31]/60">/{totalPages}</span>
        </span>
        <div className={cn("flex shadow-sm border border-[#4E3B31]/20 overflow-hidden", roundedClass)}>
          <Link
            href={currentPage > 1 ? createSortUrl(currentSort).replace(`page=1`, `page=${currentPage - 1}`) : "#"}
            className={cn(
              "w-9 h-[34px] flex items-center justify-center bg-white border-r border-[#4E3B31]/20 transition-colors",
              currentPage <= 1 ? "opacity-50 cursor-not-allowed bg-[#F9F5F1] text-gray-400" : cn("text-[#4E3B31]", inactiveHoverBgColor)
            )}
            onClick={(e) => currentPage <= 1 && e.preventDefault()}
          >
            <ChevronLeftIcon className="w-3 h-3" />
          </Link>
          <Link
            href={currentPage < totalPages ? createSortUrl(currentSort).replace(`page=1`, `page=${currentPage + 1}`) : "#"}
            className={cn(
              "w-9 h-[34px] flex items-center justify-center bg-white transition-colors",
              currentPage >= totalPages ? "opacity-50 cursor-not-allowed bg-[#F9F5F1] text-gray-400" : cn("text-[#4E3B31]", inactiveHoverBgColor)
            )}
             onClick={(e) => currentPage >= totalPages && e.preventDefault()}
          >
            <ChevronRightIcon className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}