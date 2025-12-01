"use client";

import { Book, Product } from "@/types";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "@/components/cart";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { syncCart } from "@/lib/cart";
import { cn } from "@/lib/utils";

export function AddToCartBook({ book }: { book: Book }) {
  const { cart, dispatch } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isBuyNowLoading, setIsBuyNowLoading] = useState(false);
  const router = useRouter();

  const productFromBook: Product = {
    id: book.id,
    name: book.title,
    description: book.description ?? null,
    price: book.price,
    discount_percent: book.discount_percent,
    image_urls: [book.cover_url],
    stock_quantity: book.stock_quantity,
    featured: book.featured,
    ingredients: null,
    nutritional_info: null,
    allergen_info: null,
    serving_suggestions: null,
    storage_instructions: null,
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Chỉ cho phép nhập số
    if (val === "" || /^[0-9\b]+$/.test(val)) {
      setQuantity(Number(val));
    }
  };

  const handleBlur = () => {
    if (!quantity || quantity < 1) {
      setQuantity(1);
    } else if (quantity > book.stock_quantity) {
      setQuantity(book.stock_quantity);
    }
  };

  const handleAddToCart = async (isBuyNow: boolean = false) => {
    if (!quantity || quantity < 1) {
      toast.error("Vui lòng nhập số lượng hợp lệ");
      return;
    }

    if (isBuyNow) {
      setIsBuyNowLoading(true);
      try {
        const currentItems = [...cart.items];
        const existingItemIndex = currentItems.findIndex(
          (i) => i.product.id === productFromBook.id
        );

        if (existingItemIndex > -1) {
          currentItems[existingItemIndex] = {
            ...currentItems[existingItemIndex],
            quantity: currentItems[existingItemIndex].quantity + quantity,
          };
        } else {
          currentItems.push({
            product: productFromBook,
            product_id: productFromBook.id,
            quantity: quantity,
          });
        }

        await syncCart({
          items: currentItems.map((item) => ({
            product_id: item.product_id,
            quantity: item.quantity,
          })),
        });

        dispatch({
          type: "add",
          product: productFromBook,
          quantity,
        });

        router.push("/checkout");
      } catch (error) {
        console.error(error);
        toast.error("Có lỗi xảy ra, vui lòng thử lại");
        setIsBuyNowLoading(false);
      }
    } else {
      dispatch({
        type: "add",
        product: productFromBook,
        quantity,
      });
      toast.success(`Đã thêm ${quantity} cuốn "${book.title}" vào giỏ hàng`);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Chọn số lượng */}
      <div className="flex gap-4 items-center">
        <span className="text-[#4E3B31]/70 w-24 font-medium">Số lượng</span>
        <div className="flex items-center">
          <div className="flex items-center border border-[#8B6B4F]/40 rounded-md bg-white h-9">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-8 h-full flex items-center justify-center border-r border-[#8B6B4F]/40 hover:bg-[#F5EDE3] text-[#4E3B31] transition-colors"
              disabled={isBuyNowLoading}
            >
              -
            </button>

            {/* SỬA: Dùng type="text" để loại bỏ mũi tên spin button mặc định */}
            <input
              type="text"
              inputMode="numeric"
              className="w-14 h-full text-center border-none outline-none bg-transparent text-[#4E3B31] font-medium focus:ring-0 p-0 m-0"
              value={quantity || ""}
              onChange={handleQuantityChange}
              onBlur={handleBlur}
              disabled={isBuyNowLoading}
            />

            <button
              onClick={() => setQuantity((q) => Math.min(book.stock_quantity, q + 1))}
              className="w-8 h-full flex items-center justify-center border-l border-[#8B6B4F]/40 hover:bg-[#F5EDE3] text-[#4E3B31] transition-colors"
              disabled={isBuyNowLoading}
            >
              +
            </button>
          </div>
          <span className="text-[#4E3B31]/70 text-sm ml-4">
            {book.stock_quantity} sản phẩm có sẵn
          </span>
        </div>
      </div>

      {/* Các nút bấm */}
      <div className="flex flex-wrap gap-4">
        <Button
          onClick={() => handleAddToCart(false)}
          disabled={isBuyNowLoading}
          variant="outline"
          className="bg-[#F5EDE3] border-[#8B6B4F] text-[#8B6B4F] hover:bg-[#E8DFC5] h-12 px-8 text-base font-medium rounded-md shadow-sm"
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          Thêm Vào Giỏ Hàng
        </Button>

        <Button
          onClick={() => handleAddToCart(true)}
          disabled={isBuyNowLoading}
          className="bg-gradient-to-b from-[#C8A165] to-[#8B6B4F] hover:opacity-90 text-white h-12 px-12 text-base font-bold rounded-md shadow-[0_6px_14px_rgba(139,107,79,0.14)] border-none min-w-[160px]"
        >
          {isBuyNowLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Đang xử lý...
            </>
          ) : (
            "Mua Ngay"
          )}
        </Button>
      </div>
    </div>
  );
}