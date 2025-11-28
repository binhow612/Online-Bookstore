"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart";
import { getCartItemCost, getCartTotalCost } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const { cart, dispatch } = useCart();

  const total = getCartTotalCost(cart);

  if (cart.items.length === 0)
    return (
      <div className="max-w-4xl mx-auto py-20 text-center">
        <h1 className="text-3xl font-semibold mb-4">Your cart is empty</h1>
        <Link href="/catalog" className="text-blue-600 underline">
          Browse books →
        </Link>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-semibold mb-6">Your Cart</h1>

      <div className="space-y-6">
        {cart.items.map((item) => {
          const cost = getCartItemCost(item);
          return (
            <div key={item.product.id} className="flex items-center gap-4 border-b pb-5">
              <Image
                src={item.product.image_urls[0]}
                width={90}
                height={90}
                alt={item.product.name}
                className="rounded"
              />

              <div className="flex-1">
                <h2 className="text-lg font-medium">{item.product.name}</h2>
                <p className="text-neutral-600">
                  {Number(cost.cost).toLocaleString()}₫
                </p>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() =>
                      dispatch({ type: "update", productId: item.product.id, quantity: item.quantity - 1 })
                    }
                    className="px-3 py-1 border rounded"
                  >
                    -
                  </button>

                  <span className="text-lg">{item.quantity}</span>

                  <button
                    onClick={() =>
                      dispatch({ type: "update", productId: item.product.id, quantity: item.quantity + 1 })
                    }
                    className="px-3 py-1 border rounded"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => dispatch({ type: "remove", productId: item.product.id })}
                  className="text-red-500 underline mt-2 text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* TOTAL */}
      <div className="mt-10 text-right">
        <p className="text-xl font-semibold">
          Total: {Number(total.totalCost).toLocaleString()}₫
        </p>

        <Link href="/checkout">
          <Button className="mt-4">Proceed to Checkout →</Button>
        </Link>
      </div>
    </div>
  );
}
