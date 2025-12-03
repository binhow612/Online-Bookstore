import { getOrdersByUserId } from "@/lib/data";
import { getSession } from "@/lib/session";
import { formatPrice } from "@/lib/utils";
import { Order } from "@/types";
import { format } from "date-fns";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const getDescription = (order: Order) => {
  const bookItems = order.bookOrderItems?.slice(0, 3) ?? [];
  const remaining = (order.bookOrderItems?.length ?? 0) - 3;

  const itemNames = bookItems.map((item) => item.book?.title).join(", ");
  const remainingText = remaining > 0 ? ` and ${remaining} more` : "";

  return `${itemNames}${remainingText}`;
};

function OrderCard({ order }: { order: Order }) {
  const firstBookItem = order.bookOrderItems?.[0];

  return (
    <div
      className="
        bg-[var(--warm-white)]
        border border-[rgba(78,59,49,0.12)]
        rounded-xl p-5 
        shadow-sm
        hover:shadow-md 
        transition-all duration-200
        hover:-translate-y-1
        flex gap-5
      "
    >
      {firstBookItem?.book?.cover_url && (
        <Image
          src={firstBookItem.book.cover_url}
          alt={firstBookItem.book.title}
          width={96}
          height={144}
          className="
            w-24 h-36 object-cover 
            rounded-lg shadow-sm border border-[rgba(78,59,49,0.1)]
          "
        />
      )}

      <div className="flex-1 flex flex-col justify-center">
        <h2 className="text-xl font-semibold text-[var(--wood-brown)]">
          Order #{order.id}
        </h2>

        <p className="text-sm text-neutral-700 mt-1">
          {format(new Date(order.created_at), "MMMM d, yyyy h:mm a")}
        </p>

        <p className="text-neutral-700 text-sm mt-2">
          {getDescription(order)}
        </p>

        <p className="text-neutral-600 text-sm mt-2 font-medium">
          {order.bookOrderItems?.length ?? 0} item
          {(order.bookOrderItems?.length ?? 0) !== 1 && "s"} • $
          {formatPrice(order.total_price)}
        </p>
      </div>
    </div>
  );
}

export default async function OrdersPage() {
  const session = await getSession();
  if (!session.user) redirect("/login");

  const orders = await getOrdersByUserId(session.user.id);

  return (
    <div className="container max-w-4xl mx-auto py-12">
      <h1 className="text-4xl font-bold text-[var(--wood-brown)] mb-6">
        My Orders
      </h1>

      {!orders.length && (
        <p className="text-lg text-neutral-700 bg-[var(--warm-white)] p-6 rounded-xl border border-[rgba(78,59,49,0.1)] shadow-sm">
          You haven&apos;t placed any orders yet.
        </p>
      )}

      <div className="flex flex-col gap-4">
        {orders.map((order) => (
          <Link key={order.id} href={`/orders/${order.id}`}>
            <OrderCard order={order} />
          </Link>
        ))}
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: "My Orders - The Book Haven",
  robots: "noindex",
};
