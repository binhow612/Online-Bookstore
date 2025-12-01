"use server";

import { db } from "@/db";
import { ordersTable, orderItemsTable } from "@/db/schema";
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
  
  // Lưu ý: Nếu muốn cho phép khách vãng lai (guest) đặt hàng, bạn cần xử lý logic user_id có thể null hoặc tạo guest user.
  // Ở đây tôi giả định user đã đăng nhập hoặc bạn chấp nhận user_id null (tuỳ schema DB của bạn).
  // Nếu schema bắt buộc user_id, bạn phải bắt user đăng nhập trước.
  const userId = session.user?.id; 

  if (!userId) {
      // Tùy chọn: Trả về lỗi nếu bắt buộc đăng nhập
      // return { error: "Bạn cần đăng nhập để đặt hàng" };
      
      // Hoặc: Logic cho Guest (nếu DB cho phép user_id null)
  }

  try {
    // 1. Tạo Order
    const [newOrder] = await db
      .insert(ordersTable)
      .values({
        user_id: userId, // Có thể null nếu là guest
        status: "processing",
        total_price: data.totalPrice.toString(),
        shipping_first_name: data.shippingAddress.firstName,
        shipping_last_name: data.shippingAddress.lastName,
        shipping_email: data.shippingAddress.email,
        shipping_phone_number: data.shippingAddress.phone,
        shipping_address: data.shippingAddress.address,
        shipping_city: data.shippingAddress.city,
        shipping_country_code: data.shippingAddress.countryCode,
        payment_method: data.paymentMethod, // Cần đảm bảo schema có cột này hoặc lưu vào notes
      })
      .returning();

    // 2. Tạo Order Items
    if (newOrder) {
      await db.insert(orderItemsTable).values(
        data.items.map((item) => ({
          order_id: newOrder.id,
          book_id: item.product.id,
          quantity: item.quantity,
          price: item.product.price, // Lưu giá tại thời điểm mua
        }))
      );
    }

    revalidatePath("/orders");
    return { success: true, orderId: newOrder.id };
  } catch (error) {
    console.error("Create order error:", error);
    return { error: "Có lỗi xảy ra khi tạo đơn hàng" };
  }
}