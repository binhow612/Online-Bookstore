"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart";
import { getCartItemCost, getCartTotalCost, formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // [!code ++] Import Input
import { Trash2, Minus, Plus, ArrowLeft, ShieldCheck, ShoppingBag, Tag } from "lucide-react"; // [!code ++] Import Tag icon
import { cn } from "@/lib/utils";

export default function CartPage() {
  const { cart, dispatch } = useCart();
  const { totalCost, originalTotalCost, saving } = getCartTotalCost(cart);

  // Empty Cart State
  if (cart.items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#F5EDE3] text-[#4E3B31]">
        <div className="bg-[#FBF8F3] p-6 rounded-full mb-6 shadow-sm">
            <ShoppingBag className="w-12 h-12 text-[#8B6B4F]/50" />
        </div>
        <h1 className="text-2xl md:text-3xl font-serif font-bold mb-4">Giỏ hàng của bạn đang trống</h1>
        <p className="text-[#4E3B31]/70 mb-8 max-w-md text-center">
          Có vẻ như bạn chưa thêm cuốn sách nào vào giỏ. Hãy dạo một vòng cửa hàng và tìm những câu chuyện thú vị nhé.
        </p>
        <Link href="/catalog">
          <Button className="bg-[#8B6B4F] hover:bg-[#6d543e] text-white px-8 py-6 text-lg rounded-md justify-center">
            Tiếp tục mua sắm
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#F5EDE3] min-h-screen py-10 text-[#4E3B31]">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-2 mb-8 text-[#4E3B31]/70 hover:text-[#8B6B4F] transition-colors w-fit">
            <ArrowLeft className="w-4 h-4" />
            <Link href="/catalog" className="text-sm font-medium">Tiếp tục mua sắm</Link>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold font-serif text-[#8B6B4F] mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN: Cart Items List */}
          <div className="lg:col-span-8">
            <div className="space-y-4">
              {cart.items.map((item) => {
                const { cost, originalCost } = getCartItemCost(item);
                
                return (
                  <div 
                    key={item.product.id} 
                    className="group bg-[#FBF8F3] rounded-xl p-4 sm:p-6 shadow-[0_2px_8px_rgba(78,59,49,0.03)] border border-[#4E3B31]/5 flex gap-4 sm:gap-6 transition-all hover:border-[#8B6B4F]/20 hover:shadow-[0_4px_12px_rgba(78,59,49,0.06)]"
                  >
                    {/* Image */}
                    <div className="relative w-20 h-28 sm:w-24 sm:h-36 flex-shrink-0 overflow-hidden rounded-md bg-[#F5EDE3]">
                      <Image
                        src={item.product.image_urls[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover object-center"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start gap-2">
                            <div>
                                <h2 className="text-lg sm:text-xl font-bold font-serif text-[#4E3B31] line-clamp-2">
                                    <Link href={`/catalog/${item.product.id}`} className="hover:text-[#8B6B4F] transition-colors">
                                        {item.product.name}
                                    </Link>
                                </h2>
                                <p className="text-sm text-[#4E3B31]/60 mt-1 line-clamp-1">
                                    {item.product.description || "Bìa mềm • Tiếng Việt"}
                                </p>
                            </div>
                            
                            {/* Remove Button (Desktop) */}
                            <button
                                onClick={() => dispatch({ type: "remove", productId: item.product.id })}
                                className="text-[#4E3B31]/40 hover:text-red-500 transition-colors p-1"
                                aria-label="Remove item"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-4 mt-4">
                            {/* Quantity Controls */}
                            <div className="flex items-center bg-white border border-[#4E3B31]/10 rounded-lg h-9">
                                <button
                                    onClick={() =>
                                      dispatch({ type: "update", product: item.product, quantity: Math.max(1, item.quantity - 1) })
                                    }
                                    className="w-8 h-full flex items-center justify-center text-[#4E3B31] hover:bg-[#F5EDE3] rounded-l-lg transition-colors disabled:opacity-50"
                                    disabled={item.quantity <= 1}
                                >
                                    <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                                <button
                                    onClick={() =>
                                      dispatch({ type: "update", product: item.product, quantity: item.quantity + 1 })
                                    }
                                    className="w-8 h-full flex items-center justify-center text-[#4E3B31] hover:bg-[#F5EDE3] rounded-r-lg transition-colors"
                                >
                                    <Plus className="w-3 h-3" />
                                </button>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                                {cost !== originalCost && (
                                    <div className="text-xs text-[#4E3B31]/40 line-through mb-0.5">
                                        ${formatPrice(originalCost)}
                                    </div>
                                )}
                                <div className="text-lg font-bold text-[#8B6B4F]">
                                    ${formatPrice(cost)}
                                </div>
                            </div>
                        </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 flex justify-end">
               <button 
                  onClick={() => {
                    if(confirm("Bạn có chắc muốn xóa toàn bộ giỏ hàng?")) dispatch({ type: "clear" });
                  }}
                  className="flex items-center gap-2 text-sm text-red-500/70 hover:text-red-600 transition-colors px-4 py-2 hover:bg-red-50 rounded-md"
               >
                   <Trash2 className="w-4 h-4" /> Xóa tất cả
               </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-[#FBF8F3] rounded-xl p-6 shadow-[0_4px_20px_rgba(78,59,49,0.05)] border border-[#4E3B31]/10 sticky top-24">
                <h2 className="text-xl font-bold text-[#4E3B31] font-serif mb-6">Order Summary</h2>

                <div className="space-y-3 text-sm text-[#4E3B31]/80 pb-6 border-b border-[#4E3B31]/10">
                    <div className="flex justify-between">
                        <span>Tạm tính ({cart.items.reduce((a, b) => a + b.quantity, 0)} sản phẩm)</span>
                        <span className="font-medium">${formatPrice(originalTotalCost)}</span>
                    </div>
                    {saving > 0 && (
                        <div className="flex justify-between text-[#C8A165]">
                            <span>Giảm giá</span>
                            <span>-${formatPrice(saving)}</span>
                        </div>
                    )}
                    <div className="flex justify-between items-center">
                        <span>Phí vận chuyển</span>
                        {/* [!code ++] Badge Free Shipping màu xanh lá */}
                        <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-sm border border-emerald-200 uppercase tracking-wider">
                            FREE
                        </span>
                    </div>
                </div>

                {/* [!code ++] Voucher Input Section */}
                <div className="py-6 border-b border-[#4E3B31]/10">
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4E3B31]/40" />
                            <Input 
                                placeholder="Mã giảm giá" 
                                className="bg-white border-[#4E3B31]/20 pl-9 focus:ring-[#8B6B4F] text-sm h-10"
                            />
                        </div>
                        <Button variant="outline" className="border-[#8B6B4F]/30 text-[#8B6B4F] hover:bg-[#8B6B4F] hover:text-white h-10">
                            Áp dụng
                        </Button>
                    </div>
                </div>

                <div className="flex justify-between items-center py-6">
                    <span className="text-base font-bold text-[#4E3B31]">Tổng cộng</span>
                    <span className="text-3xl font-bold text-[#8B6B4F] font-serif">
                        ${formatPrice(totalCost)}
                    </span>
                </div>

                <Link href="/checkout" className="block w-full">
                    <Button className="w-full bg-[#8B6B4F] hover:bg-[#6d543e] text-white h-12 text-base font-bold shadow-md rounded-md justify-center uppercase tracking-wide">
                        Thanh toán ngay
                    </Button>
                </Link>

                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#4E3B31]/50">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Bảo mật thanh toán 100%</span>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}