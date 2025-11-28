"use client";

import { useCart } from "@/components/cart";
import { getCartItemCost, getCartTotalCost } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CheckoutPage() {
  const { cart, dispatch } = useCart();
  const total = getCartTotalCost(cart);

  if (cart.items.length === 0)
    return (
      <div className="max-w-4xl mx-auto py-20 text-center">
        <h1 className="text-3xl font-semibold mb-4">Your cart is empty</h1>
        <Link href="/catalog" className="text-blue-600 underline">
          Shop books →
        </Link>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
      {/* LEFT – FORM */}
      <div>
        <h1 className="text-3xl font-semibold mb-6">Checkout</h1>

        <form className="space-y-4">
          <input className="w-full border px-4 py-2 rounded" placeholder="First name" />
          <input className="w-full border px-4 py-2 rounded" placeholder="Last name" />
          <input className="w-full border px-4 py-2 rounded" placeholder="Street address" />
          <input className="w-full border px-4 py-2 rounded" placeholder="City" />
          <input className="w-full border px-4 py-2 rounded" placeholder="Country" />
          <input className="w-full border px-4 py-2 rounded" placeholder="Phone number" />

          <Button className="w-full mt-4">Place Order →</Button>
        </form>
      </div>

      {/* RIGHT – ORDER SUMMARY */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex justify-between">
          Your Order
          <button
            onClick={() => dispatch({ type: "clear" })}
            className="text-red-500 underline text-sm"
          >
            Clear Cart
          </button>
        </h2>

        <div className="space-y-4">
          {cart.items.map((item) => {
            const cost = getCartItemCost(item);
            return (
              <div key={item.product.id} className="flex gap-3 border-b pb-3">
                <Image
                  src={item.product.image_urls[0]}
                  width={70}
                  height={70}
                  alt={item.product.name}
                  className="rounded"
                />

                <div>
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-sm text-neutral-600">Quantity: {item.quantity}</p>
                  <p className="text-sm font-semibold">
                    {Number(cost.cost).toLocaleString()}₫
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 text-lg font-semibold">
          Total: {Number(total.totalCost).toLocaleString()}₫  
        </div>
      </div>
    </div>
  );
}
