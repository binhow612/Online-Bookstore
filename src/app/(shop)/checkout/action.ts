"use server";

import { db } from "@/db";
import { ordersTable, bookOrderItemsTable } from "@/db/schema"; // Sửa: Import bookOrderItemsTable
import { getSession } from "@/lib/session";
import { CartItem } from "@/types";
import { revalidatePath } from "next/cache";

export async function createOrderAction(data: {
  items: CartItem[];
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    countryCode: string;
  };
  totalPrice: number;
  paymentMethod: string;
}) {
  const session = await getSession();
  const userId = session.user?.id;

  // Nếu muốn bắt buộc đăng nhập mới được mua:
  // if (!userId) return { error: "Bạn cần đăng nhập." };

  try {
    // 1. Tạo Order (Sửa lại các trường cho khớp với schema.ts)
    const [newOrder] = await db
      .insert(ordersTable)
      .values({
        user_id: userId, // Có thể null
        status: "processing",
        total_price: data.totalPrice.toString(), // Convert sang string
        shipping_first_name: data.shippingAddress.firstName,
        shipping_last_name: data.shippingAddress.lastName,
        // Schema.ts của bạn dùng guest_email, không có shipping_email
        guest_email: data.shippingAddress.email, 
        shipping_address: data.shippingAddress.address,
        shipping_city: data.shippingAddress.city,
        shipping_country_code: data.shippingAddress.countryCode,
        // Lưu ý: Schema hiện tại KHÔNG có cột payment_method và shipping_phone_number
        // Bạn cần thêm cột vào DB hoặc bỏ qua dòng này nếu không muốn lỗi.
      })
      .returning();

    if (!newOrder) {
        throw new Error("Không thể tạo đơn hàng (Insert Order failed)");
    }

    // 2. Tạo Order Items (Dùng đúng bảng sách và thêm subtotal)
    await db.insert(bookOrderItemsTable).values(
      data.items.map((item) => {
        const price = Number(item.product.price);
        const subtotal = price * item.quantity;

        return {
          order_id: newOrder.id,
          book_id: item.product.id, // ID của sách
          quantity: item.quantity,
          price: price.toString(),
          subtotal: subtotal.toString(), // TRƯỜNG BẮT BUỘC BỊ THIẾU TRƯỚC ĐÓ
        };
      })
    );

    revalidatePath("/orders");
    return { success: true, orderId: newOrder.id };

  } catch (error) {
    // QUAN TRỌNG: Hãy xem dòng này trong Terminal của VS Code để biết chính xác lỗi gì
    console.error("Chi tiết lỗi Create order:", error);
    
    // Trả về lỗi để Frontend hiển thị
    return { error: "Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại." };
  }
}