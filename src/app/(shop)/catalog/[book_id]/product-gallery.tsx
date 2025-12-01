"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-md border border-[#8B6B4F]/20 bg-[#FBF8F3]">
        <Image
          src={images[selectedIndex] || "/images/placeholder.png"}
          alt="Product image"
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {images.map((img, idx) => (
          <button
            key={idx}
            onMouseEnter={() => setSelectedIndex(idx)}
            onClick={() => setSelectedIndex(idx)}
            className={cn(
              "relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-sm border bg-[#FBF8F3]",
              selectedIndex === idx
                ? "border-[#8B6B4F] ring-2 ring-[#8B6B4F]/20" // Màu Wood Brown khi active
                : "border-[#8B6B4F]/20 hover:border-[#C8A165]" // Màu Gold Accent khi hover
            )}
          >
            <Image
              src={img}
              alt={`Thumbnail ${idx}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Actions: Share & Favorite */}
      <div className="flex items-center justify-center gap-6 pt-2 text-sm text-[#4E3B31]/80">
        <div className="flex items-center gap-1">
          <span>Chia sẻ:</span>
          {/* Sửa lại màu icon xã hội cho hợp tone nâu, hoặc giữ nguyên màu brand cũng được, ở đây mình chuyển sang style tối giản */}
          <button className="h-6 w-6 rounded-full bg-[#4E3B31] text-white flex items-center justify-center hover:bg-[#8B6B4F]">f</button>
          <button className="h-6 w-6 rounded-full bg-[#4E3B31] text-white flex items-center justify-center hover:bg-[#8B6B4F]">in</button>
        </div>
        <div className="h-4 w-px bg-[#8B6B4F]/30"></div>
        <button className="flex items-center gap-2 hover:text-[#C8A165] transition-colors">
          <Heart className="h-6 w-6 text-[#8B6B4F]" />
          <span>Đã thích (102)</span>
        </button>
      </div>
    </div>
  );
}