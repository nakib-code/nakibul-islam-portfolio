"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  RefreshCw,
  LoaderCircle,
  ExternalLink,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { IOrder } from "@/type/store";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders", { cache: "no-store" });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setOrders(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  let cancelled = false;

  const load = async () => {
    try {
      const res = await fetch("/api/admin/orders", { cache: "no-store" });
      const data = await res.json();
      if (!cancelled && res.ok && data.success) {
        setOrders(Array.isArray(data.data) ? data.data : []);
      } else if (!cancelled) {
        console.error(data.message || "Failed to load orders.");
      }
    } catch (err) {
      if (!cancelled) console.error(err);
    } finally {
      if (!cancelled) setLoading(false);
    }
  };

  load();

  return () => {
    cancelled = true;
  };
}, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        order.orderNumber.toLowerCase().includes(q) ||
        order.customer.name.toLowerCase().includes(q) ||
        order.customer.email.toLowerCase().includes(q) ||
        order.customer.phone.includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [orders, statusFilter, search]);

  return (
    <main className="min-h-screen bg-[#090a0f] p-4 text-white sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              Customer Orders
            </h1>
            <p className="mt-1 text-xs text-gray-400">
              Manage digital store orders and inspect customer transactions.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void fetchOrders()}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-medium text-gray-300 transition hover:bg-white/10 hover:text-white"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.08] bg-[#0d0e14] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: "All Orders", value: "ALL" },
              { label: "Pending Verification", value: "PENDING_VERIFICATION" },
              { label: "Paid", value: "PAID" },
              { label: "Cancelled", value: "CANCELLED" },
            ].map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setStatusFilter(tab.value)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  statusFilter === tab.value
                    ? "bg-violet-600 text-white font-semibold"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order #, customer..."
              className="w-full rounded-xl border border-white/10 bg-[#12141c] py-2 pl-9 pr-3 text-xs text-white placeholder-gray-500 outline-none focus:border-violet-500"
            />
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d0e14]">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-xs text-gray-500">
              <LoaderCircle size={20} className="animate-spin text-violet-500 mr-2" />
              Loading orders...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-16 text-center text-xs text-gray-400">
              No orders found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="border-b border-white/[0.08] bg-white/[0.02] text-[11px] uppercase tracking-wider text-gray-400">
                  <tr>
                    <th className="px-4 py-3.5">Order Number</th>
                    <th className="px-4 py-3.5">Customer</th>
                    <th className="px-4 py-3.5">Items</th>
                    <th className="px-4 py-3.5">Amount (BDT)</th>
                    <th className="px-4 py-3.5">Amount (USD)</th>
                    <th className="px-4 py-3.5">Date</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5 text-right">View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filteredOrders.map((o) => (
                    <tr key={o._id} className="transition hover:bg-white/[0.02]">
                      <td className="px-4 py-3.5 font-mono font-bold text-white">
                        <a
                          href={`/web-store/orders/${o.orderNumber}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 hover:text-violet-400"
                        >
                          <span>#{o.orderNumber}</span>
                          <ExternalLink size={11} />
                        </a>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="font-medium text-white">{o.customer.name}</p>
                        <p className="text-[11px] text-gray-400">{o.customer.email}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="rounded bg-white/5 px-2 py-0.5 text-[11px]">
                          {o.items.length} {o.items.length === 1 ? "item" : "items"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-bold text-emerald-400">
                        ৳{o.totalAmountBdt} BDT
                      </td>
                      <td className="px-4 py-3.5 text-gray-300">
                        ${o.totalAmount} USD
                      </td>
                      <td className="px-4 py-3.5 text-gray-400">
                        {new Date(o.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3.5">
                        {o.status === "PAID" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                            <CheckCircle size={11} /> Paid
                          </span>
                        )}
                        {o.status === "PENDING_VERIFICATION" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-500/20">
                            <Clock size={11} /> Pending
                          </span>
                        )}
                        {o.status === "PENDING" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-gray-500/10 px-2 py-0.5 text-[10px] font-bold text-gray-400 border border-gray-500/20">
                            Created
                          </span>
                        )}
                        {o.status === "CANCELLED" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-bold text-red-400 border border-red-500/20">
                            <XCircle size={11} /> Cancelled
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(o)}
                          className="rounded-lg border border-white/10 p-1.5 text-gray-400 hover:bg-white/5 hover:text-white"
                          title="Inspect Order Details"
                        >
                          <Eye size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0d0e14] p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">
                  Order #{selectedOrder.orderNumber}
                </h3>
                <p className="text-xs text-gray-400">
                  {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="text-xs space-y-2">
              <p><strong>Customer:</strong> {selectedOrder.customer.name} ({selectedOrder.customer.email})</p>
              <p><strong>Phone:</strong> {selectedOrder.customer.phone}</p>
              <p><strong>Total:</strong> ৳{selectedOrder.totalAmountBdt} BDT (${selectedOrder.totalAmount} USD)</p>
              <p><strong>Status:</strong> {selectedOrder.status}</p>
            </div>

            <div className="border-t border-white/10 pt-3">
              <p className="text-xs font-bold text-gray-400 mb-2">Items:</p>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {selectedOrder.items.map((item) => (
                  <div key={item.productId} className="flex justify-between items-center text-xs bg-white/[0.02] p-2 rounded-lg">
                    <span>{item.title}</span>
                    <span className="font-semibold text-emerald-400">${item.price} USD</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-white/10 pt-3">
              <Link
                href={`/admin/payments`}
                className="text-xs text-violet-400 hover:underline"
              >
                Open Verification Panel →
              </Link>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="rounded-xl bg-white/10 px-4 py-1.5 text-xs font-semibold hover:bg-white/20"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
