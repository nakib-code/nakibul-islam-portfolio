"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ShoppingBag,
  Trash2,
  Zap,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, clearCart, totalAmountUsd } = useCart();
  const [bdtRate, setBdtRate] = useState(120);

  useEffect(() => {
    let ignore = false;
    async function loadSettings() {
      try {
        const res = await fetch("/api/payments/bkash-settings");
        const data = await res.json();
        if (!ignore && data.success && data.data?.bdtRate) {
          setBdtRate(data.data.bdtRate);
        }
      } catch {
        // use fallback 120
      }
    }
    void loadSettings();
    return () => {
      ignore = true;
    };
  }, []);

  const totalAmountBdt = Math.round(totalAmountUsd * bdtRate);

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10 text-white sm:px-6 lg:px-12">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/web-store"
              className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
            >
              <ArrowLeft size={16} /> Continue Browsing Store
            </Link>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Shopping Cart
            </h1>
          </div>

          {items.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="rounded-xl border border-gray-800 bg-gray-900 px-3.5 py-2 text-xs font-medium text-gray-400 transition hover:border-red-500/40 hover:text-red-400"
            >
              Clear Cart
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center rounded-2xl border border-gray-800 bg-gray-900/50 py-20 text-center"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-800/80 text-gray-400">
              <ShoppingBag size={28} />
            </div>
            <h2 className="mt-4 text-xl font-bold text-white">Your cart is empty</h2>
            <p className="mt-1 max-w-sm text-sm text-gray-400">
              Explore our web store and choose from production-ready website templates.
            </p>
            <Link
              href="/web-store"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#824CEA] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-[#723fd3]"
            >
              Browse Templates
            </Link>
          </motion.div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-12">
            {/* Items List */}
            <div className="space-y-4 lg:col-span-8">
              {items.map(({ product }) => {
                const effectivePrice =
                  typeof product.salePrice === "number" && product.salePrice > 0
                    ? product.salePrice
                    : product.price;

                return (
                  <motion.div
                    key={product._id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col gap-4 rounded-2xl border border-gray-800 bg-gray-900/80 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-gray-800">
                        <Image
                          src={product.imageUrl || "/images/project-placeholder.png"}
                          alt={product.title}
                          fill
                          unoptimized
                          sizes="112px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <span className="rounded-full border border-gray-800 bg-gray-950 px-2.5 py-0.5 text-[10px] font-semibold text-[#a98af5]">
                          {product.category}
                        </span>
                        <Link
                          href={`/web-store/${product.slug}`}
                          className="mt-1 block text-base font-bold text-white transition hover:text-[#a98af5]"
                        >
                          {product.title}
                        </Link>
                        <p className="text-xs text-gray-400">
                          Instant Digital Download (Source Code & Assets)
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-6 border-t border-gray-800/60 pt-3 sm:border-0 sm:pt-0">
                      <div className="text-right sm:text-right">
                        <p className="text-lg font-bold text-white">
                          ${effectivePrice}
                        </p>
                        <p className="text-xs text-[#a98af5]">
                          ≈ ৳{Math.round(effectivePrice * bdtRate)} BDT
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(product._id)}
                        aria-label={`Remove ${product.title} from cart`}
                        className="rounded-xl border border-transparent p-2 text-gray-500 transition hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-400"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 rounded-2xl border border-gray-800 bg-gray-900/90 p-6 shadow-2xl backdrop-blur-xl">
                <h2 className="text-lg font-bold text-white">Order Summary</h2>

                <div className="mt-5 space-y-3 text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>Items count</span>
                    <span className="font-medium text-white">{items.length}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal (USD)</span>
                    <span className="font-medium text-white">${totalAmountUsd}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Exchange Rate</span>
                    <span className="font-medium text-white">$1 = ৳{bdtRate}</span>
                  </div>

                  <div className="border-t border-gray-800 pt-3">
                    <div className="flex items-baseline justify-between">
                      <span className="text-base font-bold text-white">Total Payable</span>
                      <div className="text-right">
                        <span className="text-xl font-black text-white">${totalAmountUsd}</span>
                        <div className="text-sm font-bold text-[#a98af5]">
                          ৳{totalAmountBdt} BDT
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-[#824CEA]/30 bg-[#824CEA]/10 p-3 text-xs text-[#c084fc]">
                  <div className="flex items-center gap-1.5 font-semibold">
                    <Zap size={14} />
                    <span>Manual bKash Payment</span>
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-gray-300">
                    Pay securely using your personal bKash account and submit your Transaction ID at checkout.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => router.push("/web-store/checkout")}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#824CEA] py-3.5 text-sm font-bold text-white shadow-xl shadow-[#824CEA]/30 transition hover:bg-[#723fd3]"
                >
                  Proceed to Checkout
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
