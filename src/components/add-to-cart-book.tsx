"use client";

import { Book, Product } from "@/types";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "@/components/cart";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Loader2 } from "lucide-react"; 
import { useRouter } from "next/navigation";
import { syncCart } from "@/lib/cart"; // Import server action

export function AddToCartBook({ book }: { book: Book }) {
  const { cart, dispatch } = useCart(); // Lấy cả cart để tính toán sync
  const [quantity, setQuantity] = useState(1);
  const [isBuyNowLoading, setIsBuyNowLoading] = useState(false);
  const router = useRouter();

  // Chuyển đổi Book thành Product
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

  const handleAddToCart = async (isBuyNow: boolean = false) => {
    if (!Number.isInteger(quantity) || quantity < 1) {
      toast.error("Vui lòng nhập số lượng hợp lệ (tối thiểu là 1)");
      setQuantity(1);
      return;
    }

    if (isBuyNow) {
      setIsBuyNowLoading(true);
      
      try {
        // 1. Tính toán danh sách item mới thủ công để sync lên server trước
        // (Tránh phụ thuộc vào useEffect của CartProvider vì nó chạy ngầm)
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

        // 2. Gọi Server Action để đồng bộ ngay lập tức và ĐỢI nó hoàn thành
        await syncCart({
          items: currentItems.map((item) => ({
            product_id: item.product_id,
            quantity: item.quantity,
          })),
        });

        // 3. Cập nhật Client State (để UI hiển thị đúng nếu quay lại)
        dispatch({
          type: "add",
          product: productFromBook,
          quantity,
        });

        // 4. Sau khi server đã nhận dữ liệu, mới chuyển trang
        router.push("/checkout");
        
      } catch (error) {
        console.error(error);
        toast.error("Có lỗi xảy ra, vui lòng thử lại");
        setIsBuyNowLoading(false);
      }
    } else {
      // Logic thêm vào giỏ hàng bình thường (không cần await sync)
      dispatch({
        type: "add",
        product: productFromBook,
        quantity,
      });
      toast.success(`Đã thêm ${quantity} cuốn "${book.title}" vào giỏ hàng`);
    }
  };

  const onBlur = () => {
    if (!Number.isInteger(quantity) || quantity < 1) {
      setQuantity(1);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* PHẦN 1: CHỌN SỐ LƯỢNG (Style giống Shopee) */}
      <div className="flex items-center gap-6">
        <span className="text-[#757575] font-medium min-w-[80px]">Số lượng</span>
        
        <div className="flex items-center">
          <div className="flex items-center border border-[#8B6B4F]/30 rounded-sm h-8 bg-white">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-8 h-full flex items-center justify-center border-r border-[#8B6B4F]/30 hover:bg-[#F5EDE3] text-[#4E3B31] transition-colors disabled:opacity-50"
              disabled={isBuyNowLoading}
            >
              -
            </button>

            {/* Sửa lỗi lệch số: dùng p-0, m-0, text-center, h-full */}
            <input
              type="number"
              className="w-14 h-full text-center border-none outline-none bg-transparent text-[#4E3B31] font-medium focus:ring-0 p-0 m-0 appearance-none flex items-center justify-center"
              value={quantity}
              min={1}
              step={1}
              onChange={(e) => setQuantity(Number(e.target.value))}
              onBlur={onBlur}
              disabled={isBuyNowLoading}
            />

            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-full flex items-center justify-center border-l border-[#8B6B4F]/30 hover:bg-[#F5EDE3] text-[#4E3B31] transition-colors disabled:opacity-50"
              disabled={isBuyNowLoading}
            >
              +
            </button>
          </div>
          <span className="text-[#757575] text-sm ml-4">{book.stock_quantity} sản phẩm có sẵn</span>
        </div>
      </div>

      {/* PHẦN 2: HAI NÚT CHỨC NĂNG */}
      <div className="flex items-center gap-4">
        {/* Nút Thêm vào giỏ hàng */}
        <Button 
          onClick={() => handleAddToCart(false)}
          disabled={isBuyNowLoading}
          className="bg-[#F5EDE3] border border-[#8B6B4F] text-[#8B6B4F] hover:bg-[#E8DFC5] h-12 px-6 text-base font-medium rounded-sm shadow-sm"
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          Thêm Vào Giỏ Hàng
        </Button>

        {/* Nút Mua ngay */}
        <Button 
          onClick={() => handleAddToCart(true)}
          disabled={isBuyNowLoading}
          className="bg-[#8B6B4F] hover:bg-[#6d543e] text-white h-12 px-8 text-base font-bold rounded-sm shadow-md border-none min-w-[140px]"
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