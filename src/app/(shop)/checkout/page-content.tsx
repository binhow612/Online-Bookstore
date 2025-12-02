"use client";

import { useCart } from "@/components/cart";
import { CountrySelect } from "@/components/country-select";
import { useSession } from "@/components/session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, formatPrice, getCartItemCost, getCartTotalCost } from "@/lib/utils";
import { CartItem, Order } from "@/types";
import { 
  MapPinIcon, 
  CreditCardIcon, 
  UserIcon, 
  ShieldCheckIcon, 
  BanknotesIcon, 
  QrCodeIcon,
  TruckIcon
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { RefObject, useRef, useState } from "react";
import { CompleteScreen } from "./complete-screen";
import { Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import { createOrderAction } from "./action"; // Import Server Action

// --- COMPONENTS CON ---

function SummaryItemCard({ item }: { item: CartItem }) {
  const itemPrice = getCartItemCost(item);
  return (
    <div className="flex items-start gap-4 py-4 border-b border-[#4E3B31]/10 last:border-0">
      <div className="relative w-16 h-20 flex-shrink-0 rounded-md overflow-hidden border border-[#4E3B31]/10">
        <Image
          src={item.product.image_urls[0]}
          alt={item.product.name}
          fill
          className="object-cover"
        />
        <span className="absolute top-0 right-0 bg-[#8B6B4F] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-bl-md">
          x{item.quantity}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-[#4E3B31] line-clamp-2 font-serif">{item.product.name}</p>
        <p className="text-xs text-[#4E3B31]/60 mt-1">Bìa mềm</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-[#8B6B4F]">${formatPrice(itemPrice.cost)}</p>
      </div>
    </div>
  );
}

// --- FORM GIAO HÀNG ---
function ShippingSection({
  formRef,
}: {
  formRef: RefObject<HTMLFormElement | null>;
}) {
  const session = useSession();

  const onUseAccountDetails = () => {
    const form = formRef.current;
    if (!form || !session.user) return;
    
    const setVal = (name: string, val: string | null | undefined) => {
        const el = form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement;
        if (el) el.value = val || "";
    };

    setVal("shipping_first_name", session.user.first_name);
    setVal("shipping_last_name", session.user.last_name);
    setVal("shipping_address", session.user.address);
    setVal("shipping_city", session.user.city);
    setVal("shipping_country_code", session.user.country_code);
    setVal("shipping_phone_number", session.user.phone_number);
    if(session.user.email) setVal("guest_email", session.user.email);
  };

  return (
    <div className="bg-[#FBF8F3] p-6 md:p-8 rounded-xl shadow-[0_2px_8px_rgba(78,59,49,0.05)] border border-[#4E3B31]/10">
      <div className="flex items-center justify-between mb-6 border-b border-[#4E3B31]/10 pb-4">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-[#8B6B4F]/10 rounded-full text-[#8B6B4F]">
                <MapPinIcon className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-[#4E3B31] font-serif">Địa chỉ giao hàng</h2>
        </div>
        {session.user && (
          <button
            className="text-xs font-medium text-white bg-[#8B6B4F] hover:bg-[#6d543e] px-4 py-2 rounded-full transition-all shadow-sm hover:shadow"
            onClick={onUseAccountDetails}
            type="button"
          >
            Dùng thông tin tài khoản
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1.5">
             <label className="text-sm font-medium text-[#4E3B31]/80">Họ</label>
             <Input
                type="text"
                placeholder="Nguyễn"
                name="shipping_first_name"
                defaultValue={session.user?.first_name || undefined}
                required
                className="bg-white border-[#4E3B31]/20 focus:ring-[#8B6B4F] h-11"
            />
        </div>
        <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#4E3B31]/80">Tên</label>
            <Input
                type="text"
                placeholder="Văn A"
                name="shipping_last_name"
                defaultValue={session.user?.last_name || undefined}
                required
                className="bg-white border-[#4E3B31]/20 focus:ring-[#8B6B4F] h-11"
            />
        </div>
        
        <div className="space-y-1.5 md:col-span-2">
            <label className="text-sm font-medium text-[#4E3B31]/80">Email</label>
            <Input
                type="email"
                placeholder="email@example.com"
                name="guest_email"
                defaultValue={session.user?.email || undefined}
                required
                className="bg-white border-[#4E3B31]/20 focus:ring-[#8B6B4F] h-11"
            />
        </div>

        <div className="space-y-1.5 md:col-span-2">
            <label className="text-sm font-medium text-[#4E3B31]/80">Địa chỉ nhận hàng</label>
            <Input
                type="text"
                placeholder="Số nhà, tên đường, phường/xã..."
                name="shipping_address"
                defaultValue={session.user?.address || undefined}
                required
                className="bg-white border-[#4E3B31]/20 focus:ring-[#8B6B4F] h-11"
            />
        </div>

        <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#4E3B31]/80">Thành phố</label>
            <Input
                type="text"
                placeholder="Hồ Chí Minh"
                name="shipping_city"
                defaultValue={session.user?.city || undefined}
                required
                className="bg-white border-[#4E3B31]/20 focus:ring-[#8B6B4F] h-11"
            />
        </div>

        <div className="space-y-1.5">
             <label className="text-sm font-medium text-[#4E3B31]/80">Quốc gia</label>
             <CountrySelect
                name="shipping_country_code"
                defaultValue={session.user?.country_code || "VN"}
                required
                className="bg-white border-[#4E3B31]/20 focus:ring-[#8B6B4F] h-11"
            />
        </div>

        <div className="space-y-1.5 md:col-span-2">
            <label className="text-sm font-medium text-[#4E3B31]/80">Số điện thoại</label>
            <Input
                placeholder="+84 901 234 567"
                type="tel"
                name="shipping_phone_number"
                defaultValue={session.user?.phone_number || undefined}
                required
                className="bg-white border-[#4E3B31]/20 focus:ring-[#8B6B4F] h-11"
            />
        </div>
      </div>
    </div>
  );
}

// --- PAYMENT METHOD SECTION ---
type PaymentMethod = "cod" | "bank" | "card";

function PaymentSection({
  method,
  setMethod,
  totalCost
}: {
  method: PaymentMethod;
  setMethod: (m: PaymentMethod) => void;
  totalCost: number;
}) {
  return (
    <div className="bg-[#FBF8F3] p-6 md:p-8 rounded-xl shadow-[0_2px_8px_rgba(78,59,49,0.05)] border border-[#4E3B31]/10 mt-6">
        <div className="flex items-center gap-3 mb-6 border-b border-[#4E3B31]/10 pb-4">
            <div className="p-2 bg-[#8B6B4F]/10 rounded-full text-[#8B6B4F]">
                <CreditCardIcon className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-[#4E3B31] font-serif">Phương thức thanh toán</h2>
        </div>

        <div className="space-y-4">
            {/* Option 1: COD */}
            <label className={cn(
                "flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all",
                method === "cod" 
                    ? "border-[#8B6B4F] bg-[#F5EDE3] ring-1 ring-[#8B6B4F]" 
                    : "border-[#4E3B31]/20 bg-white hover:border-[#8B6B4F]/50"
            )}>
                <input 
                    type="radio" 
                    name="payment_method" 
                    value="cod" 
                    checked={method === "cod"} 
                    onChange={() => setMethod("cod")}
                    className="w-5 h-5 text-[#8B6B4F] focus:ring-[#8B6B4F] accent-[#8B6B4F]"
                />
                <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 bg-white rounded-md shadow-sm text-[#4E3B31]">
                        <TruckIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="font-bold text-[#4E3B31]">Thanh toán khi nhận hàng (COD)</p>
                        <p className="text-sm text-[#4E3B31]/60">Thanh toán tiền mặt khi shipper giao sách đến.</p>
                    </div>
                </div>
            </label>

            {/* Option 2: Bank Transfer */}
            <label className={cn(
                "flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all",
                method === "bank" 
                    ? "border-[#8B6B4F] bg-[#F5EDE3] ring-1 ring-[#8B6B4F]" 
                    : "border-[#4E3B31]/20 bg-white hover:border-[#8B6B4F]/50"
            )}>
                <input 
                    type="radio" 
                    name="payment_method" 
                    value="bank" 
                    checked={method === "bank"} 
                    onChange={() => setMethod("bank")}
                    className="w-5 h-5 text-[#8B6B4F] focus:ring-[#8B6B4F] accent-[#8B6B4F]"
                />
                <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 bg-white rounded-md shadow-sm text-[#4E3B31]">
                        <QrCodeIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="font-bold text-[#4E3B31]">Chuyển khoản ngân hàng (QR)</p>
                        <p className="text-sm text-[#4E3B31]/60">Quét mã QR hoặc chuyển khoản thủ công.</p>
                    </div>
                </div>
            </label>
            
            {/* Bank Details Panel */}
            {method === "bank" && (
                <div className="ml-9 p-5 bg-white rounded-lg border border-[#4E3B31]/10 animate-in fade-in slide-in-from-top-2">
                    <div className="flex flex-col md:flex-row gap-6">
                         <div className="flex-shrink-0 flex flex-col items-center">
                            <div className="w-32 h-32 bg-[#4E3B31] rounded-lg flex items-center justify-center text-white text-xs mb-2">
                                [QR Code Placeholder]
                            </div>
                            <p className="text-xs text-[#4E3B31]/60">Quét để thanh toán nhanh</p>
                         </div>
                         <div className="flex-1 space-y-3 text-sm">
                            <div className="flex justify-between border-b border-dashed border-[#4E3B31]/20 pb-2">
                                <span className="text-[#4E3B31]/60">Ngân hàng</span>
                                <span className="font-bold text-[#4E3B31]">Vietcombank</span>
                            </div>
                            <div className="flex justify-between border-b border-dashed border-[#4E3B31]/20 pb-2">
                                <span className="text-[#4E3B31]/60">Số tài khoản</span>
                                <span className="font-bold text-[#4E3B31] font-mono text-base">1234 5678 9012</span>
                            </div>
                            <div className="flex justify-between border-b border-dashed border-[#4E3B31]/20 pb-2">
                                <span className="text-[#4E3B31]/60">Chủ tài khoản</span>
                                <span className="font-bold text-[#4E3B31] uppercase">THE BOOK HAVEN</span>
                            </div>
                            <div className="flex justify-between border-b border-dashed border-[#4E3B31]/20 pb-2">
                                <span className="text-[#4E3B31]/60">Số tiền</span>
                                <span className="font-bold text-[#8B6B4F] text-base">${formatPrice(totalCost)}</span>
                            </div>
                            <div className="flex justify-between items-center bg-[#F5EDE3] p-2 rounded">
                                <span className="text-[#4E3B31]/60 text-xs">Nội dung CK</span>
                                <span className="font-bold text-[#4E3B31] font-mono">TBH_ORDER_{Math.floor(Math.random() * 1000)}</span>
                            </div>
                         </div>
                    </div>
                </div>
            )}

            {/* Option 3: Credit Card */}
            <label className={cn(
                "flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all",
                method === "card" 
                    ? "border-[#8B6B4F] bg-[#F5EDE3] ring-1 ring-[#8B6B4F]" 
                    : "border-[#4E3B31]/20 bg-white hover:border-[#8B6B4F]/50"
            )}>
                <input 
                    type="radio" 
                    name="payment_method" 
                    value="card" 
                    checked={method === "card"} 
                    onChange={() => setMethod("card")}
                    className="w-5 h-5 text-[#8B6B4F] focus:ring-[#8B6B4F] accent-[#8B6B4F]"
                />
                <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 bg-white rounded-md shadow-sm text-[#4E3B31]">
                        <BanknotesIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="font-bold text-[#4E3B31]">Thẻ Tín dụng / Ghi nợ</p>
                        <p className="text-sm text-[#4E3B31]/60">Visa, Mastercard, JCB...</p>
                    </div>
                </div>
            </label>

            {/* Credit Card Form Panel */}
            {method === "card" && (
                <div className="ml-9 p-5 bg-white rounded-lg border border-[#4E3B31]/10 space-y-4 animate-in fade-in slide-in-from-top-2">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase text-[#4E3B31]/60">Tên chủ thẻ</label>
                        <div className="relative">
                            <Input placeholder="NGUYEN VAN A" className="bg-[#FBF8F3] border-[#4E3B31]/20 pl-9 uppercase" />
                            <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#4E3B31]/40" />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase text-[#4E3B31]/60">Số thẻ</label>
                        <div className="relative">
                            <Input placeholder="0000 0000 0000 0000" className="bg-[#FBF8F3] border-[#4E3B31]/20 pl-9 font-mono" />
                            <CreditCardIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#4E3B31]/40" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase text-[#4E3B31]/60">Ngày hết hạn</label>
                            <Input placeholder="MM/YY" className="bg-[#FBF8F3] border-[#4E3B31]/20 font-mono text-center" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase text-[#4E3B31]/60">CVV</label>
                            <div className="relative">
                                <Input placeholder="123" type="password" maxLength={3} className="bg-[#FBF8F3] border-[#4E3B31]/20 font-mono text-center pr-8" />
                                <Lock className="w-3 h-3 absolute right-3 top-1/2 -translate-y-1/2 text-[#4E3B31]/40" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
}

// --- MAIN PAGE CONTENT ---
export function CheckoutPageContent({
  paypalClientId, // Giữ lại prop để không lỗi type, nhưng có thể không dùng
}: {
  paypalClientId: string;
}) {
  const { cart, dispatch } = useCart();
  const { totalCost, originalTotalCost, saving } = getCartTotalCost(cart);

  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");

  const formRef = useRef<HTMLFormElement>(null);

  // Xử lý khi bấm "Đặt hàng"
  // Xử lý khi bấm "Đặt hàng"
  const handlePlaceOrder = async () => {
    if (!formRef.current) return;

    // 1. Validate Form (HTML5 Validation)
    if (!formRef.current.checkValidity()) {
      formRef.current.reportValidity();
      return;
    }

    setIsProcessing(true);

    try {
      const formData = new FormData(formRef.current);

      // 2. Chuẩn bị dữ liệu để gửi xuống Server Action
      // Lưu ý: Các key 'name' trong input form phải khớp với logic lấy dữ liệu dưới đây
      const orderData = {
        items: cart.items,
        shippingAddress: {
          firstName: formData.get("shipping_first_name") as string,
          lastName: formData.get("shipping_last_name") as string,
          email: formData.get("guest_email") as string,
          phone: formData.get("shipping_phone_number") as string,
          address: formData.get("shipping_address") as string,
          city: formData.get("shipping_city") as string,
          countryCode: formData.get("shipping_country_code") as string,
        },
        totalPrice: totalCost,
        paymentMethod: paymentMethod,
      };

      // 3. GỌI SERVER ACTION THẬT (file action.ts)
      const result = await createOrderAction(orderData);

      if (result?.error) {
        // Trường hợp Server trả về lỗi (ví dụ: lỗi DB, lỗi validate)
        toast.error(result.error);
        setIsProcessing(false);
        return;
      }

      if (result?.success && result.orderId) {
        // 4. Thành công: Tạo object Order để hiển thị trang CompleteScreen
        const completedOrderData: Order = {
          id: result.orderId, // ID thật từ Database
          total_price: totalCost.toString(),
          shipping_first_name: orderData.shippingAddress.firstName,
          shipping_last_name: orderData.shippingAddress.lastName,
          shipping_address: orderData.shippingAddress.address,
          shipping_city: orderData.shippingAddress.city,
          shipping_country_code: orderData.shippingAddress.countryCode,
          status: "processing",
          created_at: new Date(),
          // Các trường khác map tạm để hiển thị, hoặc fetch lại nếu cần
          items: [], 
        } as any; // Cast as any nếu type Order của bạn quá strict và thiếu trường

        setCompletedOrder(completedOrderData);
        dispatch({ type: "clear" }); // Xóa giỏ hàng
      }
      
    } catch (error) {
      console.error("Lỗi frontend:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (completedOrder) {
    return <CompleteScreen order={completedOrder} />;
  }

  if (!cart.items.length) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#F5EDE3] text-[#4E3B31]">
        <h1 className="text-3xl font-serif font-bold mb-4">Giỏ hàng trống</h1>
        <Link href="/catalog" className="bg-[#8B6B4F] text-white px-6 py-3 rounded-md hover:bg-[#6d543e]">
          Quay lại mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#F5EDE3] min-h-screen py-10 text-[#4E3B31]">
      <div className="container mx-auto px-4 max-w-7xl">
          
        <h1 className="text-3xl md:text-4xl font-bold font-serif text-[#8B6B4F] mb-8 text-center md:text-left">
            Thanh Toán & Đặt Hàng
        </h1>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 xl:gap-12">
            
            {/* CỘT TRÁI: FORM + PAYMENT */}
            <div className="xl:col-span-8 space-y-6">
                <form ref={formRef}>
                    <ShippingSection formRef={formRef} />
                </form>
                <PaymentSection method={paymentMethod} setMethod={setPaymentMethod} totalCost={totalCost} />
            </div>

            {/* CỘT PHẢI: ORDER SUMMARY (STICKY) */}
            <div className="xl:col-span-4">
                <div className="bg-[#FBF8F3] p-6 md:p-8 rounded-xl shadow-[0_4px_20px_rgba(78,59,49,0.05)] border border-[#4E3B31]/10 sticky top-24">
                    <h2 className="text-2xl font-bold text-[#4E3B31] font-serif mb-6">Tóm tắt đơn hàng</h2>

                    <div className="max-h-[300px] overflow-y-auto pr-2 mb-6 scrollbar-thin scrollbar-thumb-[#8B6B4F]/20">
                        {cart.items.map((item) => (
                            <SummaryItemCard key={item.product.id} item={item} />
                        ))}
                    </div>

                    <div className="space-y-3 text-sm text-[#4E3B31]/80 pb-6 border-b border-[#4E3B31]/10">
                        <div className="flex justify-between">
                            <span>Tạm tính</span>
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
                            <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-sm uppercase tracking-wider">FREE</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-end py-6">
                        <span className="text-lg font-bold text-[#4E3B31] mb-1">Tổng cộng</span>
                        <span className="text-4xl font-bold text-[#8B6B4F] font-serif leading-none">
                            ${formatPrice(totalCost)}
                        </span>
                    </div>

                    <Button 
                        onClick={handlePlaceOrder}
                        disabled={isProcessing}
                        className="w-full bg-[#8B6B4F] hover:bg-[#6d543e] text-white h-14 text-lg font-bold shadow-[0_4px_14px_rgba(139,107,79,0.3)] rounded-md justify-center uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Đang xử lý...
                            </>
                        ) : (
                            "ĐẶT HÀNG"
                        )}
                    </Button>

                    <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#4E3B31]/50">
                        <ShieldCheckIcon className="w-4 h-4" />
                        <span>Bảo mật thanh toán 100%</span>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}