"use client";

import React, {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useSyncExternalStore,
} from "react";
import { IProductItem, CartItem } from "@/type/store";

interface CartContextType {
  items: CartItem[];
  addItem: (product: IProductItem) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  totalCount: number;
  totalAmountUsd: number;
  isInCart: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "nakib_portfolio_cart_v1";

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener("cart-updated", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("cart-updated", callback);
  };
}

function getSnapshot(): string {
  if (typeof window === "undefined") return "[]";
  try {
    return localStorage.getItem(CART_STORAGE_KEY) || "[]";
  } catch {
    return "[]";
  }
}

function getServerSnapshot(): string {
  return "[]";
}

function saveCartToStorage(items: CartItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("cart-updated"));
  } catch {
    // ignore storage errors
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const rawCart = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const items: CartItem[] = useMemo(() => {
    try {
      const parsed = JSON.parse(rawCart);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [rawCart]);

  const addItem = useCallback(
    (product: IProductItem) => {
      const exists = items.some((item) => item.product._id === product._id);
      if (exists) return;
      saveCartToStorage([...items, { product, quantity: 1 }]);
    },
    [items]
  );

  const removeItem = useCallback(
    (productId: string) => {
      saveCartToStorage(items.filter((item) => item.product._id !== productId));
    },
    [items]
  );

  const clearCart = useCallback(() => {
    saveCartToStorage([]);
  }, []);

  const isInCart = useCallback(
    (productId: string) => {
      return items.some((item) => item.product._id === productId);
    },
    [items]
  );

  const totalCount = useMemo(() => items.length, [items]);

  const totalAmountUsd = useMemo(() => {
    return items.reduce((acc, item) => {
      const price =
        typeof item.product.salePrice === "number" && item.product.salePrice > 0
          ? item.product.salePrice
          : item.product.price;
      return acc + (price || 0);
    }, 0);
  }, [items]);

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      clearCart,
      totalCount,
      totalAmountUsd,
      isInCart,
    }),
    [items, addItem, removeItem, clearCart, totalCount, totalAmountUsd, isInCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
