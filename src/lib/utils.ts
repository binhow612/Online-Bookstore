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
  const num = Number(amount);
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

// [!code ++] Thêm hàm này vào file utils.ts
export function formatCurrency(amount: number | string) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(Number(amount));
}

export function formatPriceUSD(amount: number | string) {
  return "$" + formatPrice(amount);
}

// ======================
// PRODUCT COSTS
// ======================

export function getProductCost(product: Product) {
  const price = Number(product.price) * (100 - Number(product.discount_percent)) * 0.01;
  const originalPrice = Number(product.price);
  return { 
    price: price, // Return raw number for calculations
    originalPrice: originalPrice // Return raw number for calculations
  };
}

export function getCartItemCost(item: CartItem) {
  const productCost = getProductCost(item.product);
  return {
    cost: productCost.price * item.quantity,
    originalCost: productCost.originalPrice * item.quantity,
  };
}

export function getCartTotalCost(cart: Cart) {
  const totalCostNumber = cart.items.reduce(
    (total, item) => total + getCartItemCost(item).cost,
    0
  );
  const originalTotalCostNumber = cart.items.reduce(
    (total, item) => total + getCartItemCost(item).originalCost,
    0
  );

  const savingNumber = originalTotalCostNumber - totalCostNumber;

  return {
    totalCost: totalCostNumber,
    originalTotalCost: originalTotalCostNumber,
    saving: savingNumber,
  };
}

// ======================
// BOOK COSTS
// ======================

export function getBookCost(book: Book) {
  const price = Number(book.price) * (100 - Number(book.discount_percent)) * 0.01;
  const originalPrice = Number(book.price);
  return { 
    price: price, // Return raw number for calculations
    originalPrice: originalPrice // Return raw number for calculations
  };
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
    cost: bookCost.price * item.quantity,
    originalCost: bookCost.originalPrice * item.quantity,
  };
}

export function getBookCartTotalCost(cart: BookCart) {
  const totalCostNumber = cart.items.reduce(
    (total, item) => total + getBookCartItemCost(item).cost,
    0
  );
  const originalTotalCostNumber = cart.items.reduce(
    (total, item) => total + getBookCartItemCost(item).originalCost,
    0
  );
  const savingNumber = originalTotalCostNumber - totalCostNumber;

  return {
    totalCost: totalCostNumber,
    originalTotalCost: originalTotalCostNumber,
    saving: savingNumber,
  };
}