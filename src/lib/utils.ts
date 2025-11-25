import { Book, Cart, CartItem, Product } from "@/types";
import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// ======================
// UTILITY FUNCTIONS
// ======================

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function debounce<T extends () => unknown>(fn: T, delay: number) {
  let timeout: NodeJS.Timeout;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(), delay);
  };
}

// ======================
// PRICE FORMATTING
// ======================

export function formatPrice(amount: number | string) {
  return Number(amount).toLocaleString("en-US");
}

export function formatPriceUSD(amount: number | string) {
  return "$" + Number(amount).toLocaleString("en-US");
}

// ======================
// PRODUCT COSTS
// ======================

export function getProductCost(product: Product) {
  const price = Number(product.price) * (100 - Number(product.discount_percent)) * 0.01;
  const originalPrice = Number(product.price);
  return { price: formatPrice(price), originalPrice: formatPrice(originalPrice) };
}

export function getCartItemCost(item: CartItem) {
  const productCost = getProductCost(item.product);
  return {
    cost: formatPrice(Number(productCost.price) * item.quantity),
    originalCost: formatPrice(Number(productCost.originalPrice) * item.quantity),
  };
}

export function getCartTotalCost(cart: Cart) {
  const totalCostNumber = cart.items.reduce(
    (total, item) => total + Number(getCartItemCost(item).cost.replace(/,/g, "")),
    0
  );
  const originalTotalCostNumber = cart.items.reduce(
    (total, item) => total + Number(getCartItemCost(item).originalCost.replace(/,/g, "")),
    0
  );

  const savingNumber = originalTotalCostNumber - totalCostNumber;

  return {
    totalCost: formatPrice(totalCostNumber),
    originalTotalCost: formatPrice(originalTotalCostNumber),
    saving: formatPrice(savingNumber),
  };
}

// ======================
// BOOK COSTS
// ======================

export function getBookCost(book: Book) {
  const price = Number(book.price) * (100 - Number(book.discount_percent)) * 0.01;
  const originalPrice = Number(book.price);
  return { price: formatPrice(price), originalPrice: formatPrice(originalPrice) };
}

// Optional: If you want cart functionality for books
export type BookCartItem = {
  book: Book;
  book_id: string;
  quantity: number;
};

export type BookCart = {
  items: BookCartItem[];
};

export function getBookCartItemCost(item: BookCartItem) {
  const bookCost = getBookCost(item.book);
  return {
    cost: formatPrice(Number(bookCost.price) * item.quantity),
    originalCost: formatPrice(Number(bookCost.originalPrice) * item.quantity),
  };
}

export function getBookCartTotalCost(cart: BookCart) {
  const totalCostNumber = cart.items.reduce(
    (total, item) => total + Number(getBookCartItemCost(item).cost.replace(/,/g, "")),
    0
  );
  const originalTotalCostNumber = cart.items.reduce(
    (total, item) => total + Number(getBookCartItemCost(item).originalCost.replace(/,/g, "")),
    0
  );
  const savingNumber = originalTotalCostNumber - totalCostNumber;

  return {
    totalCost: formatPrice(totalCostNumber),
    originalTotalCost: formatPrice(originalTotalCostNumber),
    saving: formatPrice(savingNumber),
  };
}
