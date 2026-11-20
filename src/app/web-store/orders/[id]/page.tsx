"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  LoaderCircle,
  RefreshCw,
  ShieldCheck,
  XCircle,
  Zap,
} from "lucide-react";
import { IOrder, IPayment } from "@/type/store";

interface OrderWithPayment extends IOrder {
  payment?: IPayment | null;
}

export default function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [order, setOrder] = useState<OrderWithPayment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Resubmission state for rejected orders
  const [newSenderNumber, setNewSenderNumber] = useState("");
  const [newTrxId, setNewTrxId] = useState("");
  const [resubmitting, setResubmitting] = useState(false);
  const [resubmitMsg, setResubmitMsg] = useState("");

  const loadOrder = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const res = await fetch(`/api/orders/${id}`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok || !data.success || !data.data) {
        throw new Error(data.message || "Order not found.");
      }
      setOrder(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load order.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    void loadOrder();
  }, [id]);

  const handleResubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;
    setResubmitting(true);
    setResubmitMsg("");

    try {
      const res = await fetch("/api/payments/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order._id,
          bkashSenderNumber: newSenderNumber,
          transactionId: newTrxId,
          amount: order.totalAmountBdt,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to resubmit payment.");
      }
      setResubmitMsg("Payment resubmitted successfully for verification.");
      void loadOrder();
    } catch (err) {
      setResubmitMsg(err instanceof Error ? err.message : "Resubmission failed.");
    } finally {
      setResubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
        <LoaderCircle size={28} className="animate-spin text-[#824CEA]" />
        <span className="ml-3 text-sm text-gray-400">Loading order details...</span>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 px-4 text-center text-white">
        <h1 className="text-2xl font-bold">{error || "Order Not Found"}</h1>
        <Link
          href="/web-store"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#824CEA] px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-[#723fd3]"
        >
          <ArrowLeft size={16} /> Back to Store
        </Link>
      </div>
    );
  }

  const isApproved =
    order.status === "PAID" ||
    order.status === "COMPLETED" ||
    order.payment?.status === "APPROVED";

  const isPending =
    order.status === "PENDING_VERIFICATION" ||
    order.payment?.status === "PENDING_VERIFICATION";

  const isRejected = order.payment?.status === "REJECTED";

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-8 text-white sm:px-6 lg:px-12">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-800 pb-4">
          <Link
            href="/web-store"
            className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
          >
            <ArrowLeft size={16} /> Web Store
          </Link>
          <button
            type="button"
            onClick={() => void loadOrder(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-800 bg-gray-900 px-3.5 py-1.5 text-xs text-gray-300 transition hover:border-gray-700 hover:text-white"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            <span>Refresh Status</span>
          </button>
        </div>

        {/* Order Title & Status Banner */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Order Tracking
              </span>
              <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                Order #{order.orderNumber}
              </h1>
            </div>

            {/* Status Badge */}
            <div>
              {isApproved && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-400">
                  <CheckCircle2 size={16} /> PAYMENT APPROVED
                </span>
              )}
              {isPending && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-1.5 text-xs font-bold text-amber-400">
                  <Clock size={16} /> PENDING VERIFICATION
                </span>
              )}
              {isRejected && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/40 bg-red-500/10 px-4 py-1.5 text-xs font-bold text-red-400">
                  <XCircle size={16} /> PAYMENT REJECTED
                </span>
              )}
            </div>
          </div>

          {/* Dynamic Explanatory Banner */}
          {isPending && (
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 text-sm text-amber-200">
              <div className="flex items-center gap-2 font-bold text-amber-300">
                <Clock size={18} />
                <span>Manual Verification In Progress</span>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-amber-100/90">
                We have received your bKash submission (TrxID:{" "}
                <strong className="font-mono">{order.payment?.transactionId}</strong>).
                The admin is manually checking the bKash account statement to verify
                the exact amount. Once confirmed, your download button will automatically
                activate here and you will also receive an email confirmation.
              </p>
            </div>
          )}

          {isApproved && (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-sm text-emerald-200">
              <div className="flex items-center gap-2 font-bold text-emerald-300">
                <CheckCircle2 size={18} />
                <span>Payment Verified & Approved!</span>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-emerald-100/90">
                Thank you! Your payment has been confirmed. You now have full access to
                download the complete source code and template packages below.
              </p>
            </div>
          )}

          {isRejected && (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-200">
              <div className="flex items-center gap-2 font-bold text-red-300">
                <XCircle size={18} />
                <span>Payment Verification Unsuccessful</span>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-red-100/90">
                The admin was unable to verify this transaction.
                {order.payment?.rejectionReason && (
                  <span className="block mt-1 font-semibold">
                    Reason: {order.payment.rejectionReason}
                  </span>
                )}
              </p>

              {/* Resubmit form */}
              <form onSubmit={handleResubmit} className="mt-4 rounded-xl bg-gray-950/80 p-4 border border-red-500/20 space-y-3">
                <p className="text-xs font-bold text-white">Resubmit Payment Information:</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    type="tel"
                    required
                    value={newSenderNumber}
                    onChange={(e) => setNewSenderNumber(e.target.value)}
                    placeholder="Correct Sender bKash Number"
                    className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-xs text-white outline-none focus:border-[#824CEA]"
                  />
                  <input
                    type="text"
                    required
                    value={newTrxId}
                    onChange={(e) => setNewTrxId(e.target.value.toUpperCase())}
                    placeholder="Correct Transaction ID (TrxID)"
                    className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-xs font-mono uppercase text-white outline-none focus:border-[#824CEA]"
                  />
                </div>
                {resubmitMsg && <p className="text-xs text-amber-300">{resubmitMsg}</p>}
                <button
                  type="submit"
                  disabled={resubmitting}
                  className="rounded-lg bg-[#824CEA] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#723fd3] disabled:opacity-50"
                >
                  {resubmitting ? "Resubmitting..." : "Resubmit for Verification"}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Order Details & Items Card */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900/90 p-6 shadow-xl backdrop-blur-xl space-y-6">
          <div className="grid gap-4 border-b border-gray-800 pb-5 text-xs sm:grid-cols-3">
            <div>
              <span className="text-gray-500">Customer Name</span>
              <p className="mt-0.5 font-semibold text-white">{order.customer.name}</p>
            </div>
            <div>
              <span className="text-gray-500">Customer Email</span>
              <p className="mt-0.5 font-semibold text-white">{order.customer.email}</p>
            </div>
            <div>
              <span className="text-gray-500">Total Payable</span>
              <p className="mt-0.5 font-bold text-emerald-400">
                ৳{order.totalAmountBdt} BDT (${order.totalAmount} USD)
              </p>
            </div>
          </div>

          {/* Purchased Items & Download Links */}
          <div>
            <h2 className="text-base font-bold text-white">Order Items</h2>
            <div className="mt-3 divide-y divide-gray-800/80">
              {order.items.map((item) => (
                <div key={item.productId} className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-800">
                      <Image
                        src={item.imageUrl || "/images/project-placeholder.png"}
                        alt={item.title}
                        fill
                        unoptimized
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{item.title}</h3>
                      <p className="text-xs text-gray-400">
                        Price: ${item.price} USD (৳{item.priceBdt} BDT)
                      </p>
                    </div>
                  </div>

                  {/* Download Action Button */}
                  <div>
                    {isApproved ? (
                      <Link
                        href={`/web-store/purchased?orderId=${order._id}`}
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600"
                      >
                        <Download size={14} />
                        Download Digital Files
                      </Link>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-lg border border-gray-800 bg-gray-950 px-3 py-1.5 text-xs font-medium text-gray-500">
                        <Lock size={12} />
                        Download locked until approved
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transaction Summary */}
          {order.payment && (
            <div className="rounded-xl border border-gray-800/80 bg-gray-950/60 p-4 text-xs space-y-2">
              <span className="font-bold text-[#a98af5]">bKash Payment Submission:</span>
              <div className="grid gap-2 sm:grid-cols-3 text-gray-300">
                <div>
                  <span className="text-gray-500">Transaction ID:</span>{" "}
                  <code className="font-mono text-white font-bold">{order.payment.transactionId}</code>
                </div>
                <div>
                  <span className="text-gray-500">Sender Number:</span> {order.payment.bkashSenderNumber}
                </div>
                <div>
                  <span className="text-gray-500">Submitted At:</span>{" "}
                  {new Date(order.payment.submittedAt).toLocaleString()}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
