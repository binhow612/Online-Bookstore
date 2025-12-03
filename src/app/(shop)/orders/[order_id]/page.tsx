import { getOrderById } from "@/lib/data";
import { getSession } from "@/lib/session";
import { formatPrice } from "@/lib/utils";
import { format } from "date-fns";
import { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function OrderDetailPage({
  params,
}: {
  params: { order_id: string };
}) {
  const session = await getSession();
  if (!session.user) redirect("/login");

  const order = await getOrderById(params.order_id);
  if (!order) redirect("/orders");

  return (
    <div className="container max-w-3xl mx-auto py-12">
      {/* PAGE TITLE */}
      <h1 className="text-3xl font-semibold text-[var(--wood-brown)] mb-8">
        Order <span className="font-bold">#{order.id}</span>
      </h1>

      {/* ORDER SUMMARY CARD */}
      <div
        className="
        bg-[var(--warm-white)]
        border border-[rgba(78,59,49,0.12)]
        rounded-2xl p-6 shadow-sm 
        flex flex-col gap-3
      "
      >
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Placed on</span>
          <span className="text-[var(--dark-coffee)] font-semibold">
            {format(new Date(order.created_at), "MMMM d, yyyy h:mm a")}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Total Amount</span>
          <span className="text-[var(--dark-coffee)] font-semibold text-lg">
            ${formatPrice(order.total_price)}
          </span>
        </div>

        {/* Status (optional future use) */}
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Status</span>
          <span className="inline-block px-3 py-1 rounded-md bg-[var(--beige-cream)] text-[var(--wood-brown)] font-medium shadow-sm text-sm border border-[rgba(78,59,49,0.1)]">
            {order.status ?? "Completed"}
          </span>
        </div>
      </div>

      {/* SECTION TITLE */}
      <h2 className="text-2xl font-semibold text-[var(--wood-brown)] mt-10 mb-4">
        Order Items
      </h2>

      {/* LIST OF ORDER ITEMS */}
      <div className="flex flex-col gap-4">
        {order.bookOrderItems?.map((item) => (
          <div
            key={item.id}
            className="
              flex gap-4 
              bg-white
              rounded-2xl 
              shadow-sm 
              border border-[rgba(78,59,49,0.1)] 
              p-4
              hover:shadow-md
              transition-shadow
            "
          >
            {/* BOOK COVER */}
            {item.book?.cover_url && (
              <Image
                src={item.book.cover_url}
                alt={item.book.title}
                width={90}
                height={130}
                className="rounded-md object-cover shadow-sm"
              />
            )}

            {/* TITLE + PRICE */}
            <div className="flex flex-col justify-center flex-1">
              <p className="font-semibold text-lg text-[var(--wood-brown)] leading-tight">
                {item.book?.title}
              </p>

              <p className="text-gray-700 text-sm mt-1">
                Quantity:{" "}
                <span className="font-medium">{item.quantity}</span>
              </p>

              <p className="text-gray-700 text-sm">
                Unit Price: ${formatPrice(item.unit_price)}
              </p>

              <p className="text-gray-800 font-semibold text-sm mt-2">
                Subtotal: ${formatPrice(item.unit_price * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Order Details - The Book Haven",
  robots: "noindex",
};
