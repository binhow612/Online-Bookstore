"use client";

import { Product } from "@/types";
import { toast } from "sonner";
import { useCart } from "./cart";
import { Button } from "./ui/button";

export function AddToCart({
  product,
  quantity,
  setQuantity, // nhận từ ProductPage để đồng bộ
}: {
  product: Product;
  quantity: number;
  setQuantity: (q: number) => void;
}) {
  const { dispatch } = useCart();

  const addToCart = () => {
    if (!quantity || quantity < 1) {
      toast.error("Please enter a valid quantity (1 or more)");
      setQuantity(1);
      return;
    }

    dispatch({
      type: "add",
      product,
      quantity,
    });

    toast.success(`Added ${quantity} × ${product.name} to your cart!`);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.currentTarget.valueAsNumber;
    if (!Number.isInteger(val) || val < 1) val = 1;
    setQuantity(val);
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        className="w-20 h-10 text-center border border-neutral-300 rounded"
        value={quantity}
        min={1}
        step={1}
        onChange={onInputChange}
        aria-label="Quantity"
      />
      <Button onClick={addToCart}>Add to Cart</Button>
    </div>
  );
}
