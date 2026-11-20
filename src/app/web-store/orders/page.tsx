"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  ExternalLink,
  Layers3,
  LoaderCircle,
  RefreshCw,
  ShoppingCart,
  XCircle,
} from "lucide-react";
import { IOrder } from "@/type/store";

export default function CustomerOrdersHistoryPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const [ordersRes, userRes] = await Promise.all([
        fetch("/api/orders"),
        fetch("/api/customer/auth/me"),
      ]);

      const [ordersData, userData] = await Promise.all([
        ordersRes.json(),
        userRes.json(),
      ]);

      if (userData.success && userData.user) {
        setUser(userData.user);
      }

      if (ordersData.success && Array.isArray(ordersData.data)) {
        setOrders(ordersData.data);
      } else if (!userData.user) {
        setError("Please sign in to view your complete order history.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-8 text-white sm:px-6 lg:px-12">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-800 pb-4">
          <Link
            href="/web-store"
            className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
          >
            <ArrowLeft size={16} /> Back to Web Store
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/web-store/purchased"
              className="rounded-xl border border-gray-800 bg-gray-900 px-3.5 py-1.5 text-xs text-gray-300 hover:text-white"
            >
              My Downloads
            </Link>
            <button
              type="button"
              onClick={() => void fetchOrders()}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-xl border border-gray-800 bg-gray-900 px-3.5 py-1.5 text-xs text-gray-300 hover:border-gray-700"
            >
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            My Orders
          </h1>
          <p className="mt-1 text-xs text-gray-400">
            {user
              ? `Account: ${user.name} (${user.email})`
              : "Track all your web store template purchases and payment verification statuses."}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-xs text-gray-400">
            <LoaderCircle size={20} className="animate-spin text-[#824CEA] mr-2" />
            Loading order history...
          </div>
        ) : error && orders.length === 0 ? (
          <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-8 text-center space-y-3">
            <p className="text-sm text-gray-300">{error}</p>
            <Link
              href="/web-store/login?redirect=/web-store/orders"
              className="inline-block rounded-xl bg-[#824CEA] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#723fd3]"
            >
              Sign In to View Orders
            </Link>
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl border border-gray-800 bg-gray-900/40 p-12 text-center">
            <ShoppingCart size={32} className="mx-auto text-gray-600 mb-3" />
            <h2 className="text-base font-bold text-white">No orders found</h2>
            <p className="mt-1 text-xs text-gray-400">
              You haven&apos;t placed any orders yet.
            </p>
            <Link
              href="/web-store"
              className="mt-5 inline-block rounded-xl bg-[#824CEA] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#723fd3]"
            >
              Explore Web Store
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => {
              const isPaid = o.status === "PAID" || o.status === "COMPLETED";
              const isPending = o.status === "PENDING_VERIFICATION";
              const isCancelled = o.status === "CANCELLED";

              return (
                <motion.div
                  key={o._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-gray-800 bg-gray-900/80 p-5 shadow-xl transition hover:border-gray-700 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-800/80 pb-3">
                    <div>
                      <span className="font-mono text-sm font-bold text-white">
                        #{o.orderNumber}
                      </span>
                      <p className="text-[11px] text-gray-500">
                        {new Date(o.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div>
                      {isPaid && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 size={13} /> Paid & Approved
                        </span>
                      )}
                      {isPending && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400 border border-amber-500/20">
                          <Clock size={13} /> Pending Verification
                        </span>
                      )}
                      {isCancelled && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-3 py-1 text-xs font-bold text-red-400 border border-red-500/20">
                          <XCircle size={13} /> Cancelled
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
                    <div>
                      <p className="text-gray-400">
                        {o.items.length} {o.items.length === 1 ? "Product" : "Products"}:{" "}
                        <strong className="text-white">
                          {o.items.map((i) => i.title).join(", ")}
                        </strong>
                      </p>
                      <p className="mt-0.5 text-emerald-400 font-bold">
                        Total: ৳{o.totalAmountBdt} BDT (${o.totalAmount} USD)
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/web-store/orders/${o.orderNumber}`}
                        className="rounded-xl border border-gray-700 bg-gray-950 px-3.5 py-1.5 text-xs font-medium text-gray-300 hover:text-white hover:border-gray-600"
                      >
                        Track Order Details
                      </Link>
                      {isPaid && (
                        <Link
                          href={`/web-store/purchased?orderId=${o._id}`}
                          className="rounded-xl bg-emerald-500 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-600"
                        >
                          Downloads
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
