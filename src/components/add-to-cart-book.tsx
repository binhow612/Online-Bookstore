// add-to-cart-book.tsx
"use client";

import { Book, Product } from "@/types";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "@/components/cart";
import { Button } from "@/components/ui/button";

export function AddToCartBook({ book }: { book: Book }) {
  const { dispatch } = useCart();
  const [quantity, setQuantity] = useState(1);

  // Chuyển Book → Product
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

  const addToCart = () => {
    if (!Number.isInteger(quantity) || quantity < 1) {
      toast.error("Please enter a valid quantity (1 or more)");
      setQuantity(1);
      return;
    }

    dispatch({
      type: "add",
      product: productFromBook,
      quantity,
    });

    toast.success(`Added ${quantity} × "${book.title}" to your cart`);
  };

  const onBlur = () => {
    if (!Number.isInteger(quantity) || quantity < 1) {
      setQuantity(1);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center border rounded w-28 justify-between px-3 py-2">
        <button
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="text-xl font-semibold"
        >
          -
        </button>

        <input
          type="number"
          className="w-12 h-10 text-center border-none outline-none bg-transparent"
          value={quantity}
          min={1}
          step={1}
          onChange={(e) => setQuantity(Number(e.target.value))}
          onBlur={onBlur}
        />

        <button
          onClick={() => setQuantity((q) => q + 1)}
          className="text-xl font-semibold"
        >
          +
        </button>
      </div>

      <Button onClick={addToCart}>Add to Cart</Button>
    </div>
  );
}
