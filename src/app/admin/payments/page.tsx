"use client";

import { useEffect, useState, useMemo } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  Search,
  RefreshCw,
  LoaderCircle,
  ExternalLink,
} from "lucide-react";
import { IPayment } from "@/type/store";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<IPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("PENDING_VERIFICATION");
  const [search, setSearch] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState<string>("");
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  // Reject modal state
  const [rejectingPayment, setRejectingPayment] = useState<IPayment | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const fetchPayments = async () => {
    setLoading(true);
    setActionError("");
    try {
      const res = await fetch("/api/admin/payments", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to load payments.");
      }
      setPayments(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Error fetching payments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  let cancelled = false;

  const load = async () => {
    try {
      const res = await fetch("/api/admin/payments", { cache: "no-store" });
      const data = await res.json();
      if (!cancelled && res.ok && data.success) {
        setPayments(Array.isArray(data.data) ? data.data : []);
      } else if (!cancelled) {
        setActionError(data.message || "Failed to load payments.");
      }
    } catch (err) {
      if (!cancelled) {
        setActionError(err instanceof Error ? err.message : "Error fetching payments.");
      }
    } finally {
      if (!cancelled) setLoading(false);
    }
  };

  load();

  return () => {
    cancelled = true;
  };
}, []);

  const filteredPayments = useMemo(() => {
    return payments.filter((item) => {
      const matchesStatus =
        statusFilter === "ALL" || item.status === statusFilter;

      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        item.transactionId.toLowerCase().includes(q) ||
        item.orderNumber.toLowerCase().includes(q) ||
        item.customer.name.toLowerCase().includes(q) ||
        item.customer.email.toLowerCase().includes(q) ||
        item.bkashSenderNumber.includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [payments, statusFilter, search]);

  const handleApprove = async (payment: IPayment) => {
    if (
      !window.confirm(
        `Approve bKash payment for Order #${payment.orderNumber}?\n\nTrxID: ${payment.transactionId}\nAmount: ৳${payment.amount} BDT\n\nPlease confirm you have checked your bKash account statement.`
      )
    ) {
      return;
    }

    setActionLoadingId(payment._id);
    setActionError("");
    setActionSuccess("");

    try {
      const res = await fetch("/api/admin/payments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentId: payment._id,
          action: "approve",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Approval failed.");
      }

      setActionSuccess(`Payment for Order #${payment.orderNumber} approved successfully!`);
      void fetchPayments();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to approve payment.");
    } finally {
      setActionLoadingId("");
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectingPayment) return;

    setActionLoadingId(rejectingPayment._id);
    setActionError("");
    setActionSuccess("");

    try {
      const res = await fetch("/api/admin/payments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentId: rejectingPayment._id,
          action: "reject",
          rejectionReason,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Rejection failed.");
      }

      setActionSuccess(`Payment for Order #${rejectingPayment.orderNumber} marked as rejected.`);
      setRejectingPayment(null);
      setRejectionReason("");
      void fetchPayments();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to reject payment.");
    } finally {
      setActionLoadingId("");
    }
  };

  const pendingCount = payments.filter((p) => p.status === "PENDING_VERIFICATION").length;

  return (
    <main className="min-h-screen bg-[#090a0f] p-4 text-white sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Page Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                bKash Payment Verification
              </h1>
              {pendingCount > 0 && (
                <span className="rounded-full bg-amber-500/20 border border-amber-500/30 px-2.5 py-0.5 text-xs font-bold text-amber-300">
                  {pendingCount} Pending
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-gray-400">
              Verify customer Transaction IDs (TrxID) manually against your bKash statement before approving download access.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void fetchPayments()}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-medium text-gray-300 transition hover:bg-white/10 hover:text-white"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            <span>Refresh List</span>
          </button>
        </div>

        {/* Notifications */}
        {actionError && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
            {actionError}
          </div>
        )}
        {actionSuccess && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300">
            {actionSuccess}
          </div>
        )}

        {/* Filters & Search Toolbar */}
        <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.08] bg-[#0d0e14] p-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Status Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: "Pending Verification", value: "PENDING_VERIFICATION" },
              { label: "Approved", value: "APPROVED" },
              { label: "Rejected", value: "REJECTED" },
              { label: "All Payments", value: "ALL" },
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

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search TrxID, order, customer..."
              className="w-full rounded-xl border border-white/10 bg-[#12141c] py-2 pl-9 pr-3 text-xs text-white placeholder-gray-500 outline-none transition focus:border-violet-500"
            />
          </div>
        </div>

        {/* Payments Table */}
        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d0e14]">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-xs text-gray-500">
              <LoaderCircle size={20} className="animate-spin text-violet-500 mr-2" />
              Loading payment submissions...
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="py-16 text-center text-xs text-gray-400">
              No payments match the current filter.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="border-b border-white/[0.08] bg-white/[0.02] text-[11px] uppercase tracking-wider text-gray-400">
                  <tr>
                    <th className="px-4 py-3.5">Order #</th>
                    <th className="px-4 py-3.5">Customer</th>
                    <th className="px-4 py-3.5">Amount (BDT)</th>
                    <th className="px-4 py-3.5">Transaction ID</th>
                    <th className="px-4 py-3.5">Sender Number</th>
                    <th className="px-4 py-3.5">Submitted</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filteredPayments.map((p) => {
                    const isProcessing = actionLoadingId === p._id;

                    return (
                      <tr key={p._id} className="transition hover:bg-white/[0.02]">
                        <td className="px-4 py-3.5 font-mono font-bold text-white">
                          <a
                            href={`/web-store/orders/${p.orderNumber}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 hover:text-violet-400"
                          >
                            <span>#{p.orderNumber}</span>
                            <ExternalLink size={11} />
                          </a>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="font-medium text-white">{p.customer.name}</p>
                          <p className="text-[11px] text-gray-400">{p.customer.email}</p>
                        </td>
                        <td className="px-4 py-3.5 font-bold text-emerald-400">
                          ৳{p.amount} BDT
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="rounded bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 font-mono font-bold text-violet-300">
                            {p.transactionId}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 font-mono text-gray-300">
                          {p.bkashSenderNumber}
                        </td>
                        <td className="px-4 py-3.5 text-gray-400">
                          {new Date(p.submittedAt).toLocaleString()}
                        </td>
                        <td className="px-4 py-3.5">
                          {p.status === "APPROVED" && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                              <CheckCircle size={12} /> Approved
                            </span>
                          )}
                          {p.status === "PENDING_VERIFICATION" && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-500/20">
                              <Clock size={12} /> Pending
                            </span>
                          )}
                          {p.status === "REJECTED" && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2.5 py-0.5 text-[10px] font-bold text-red-400 border border-red-500/20" title={p.rejectionReason}>
                              <XCircle size={12} /> Rejected
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          {p.status === "PENDING_VERIFICATION" ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                disabled={isProcessing}
                                onClick={() => void handleApprove(p)}
                                className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white transition hover:bg-emerald-500 disabled:opacity-50"
                              >
                                <CheckCircle size={13} />
                                <span>Approve</span>
                              </button>
                              <button
                                type="button"
                                disabled={isProcessing}
                                onClick={() => {
                                  setRejectingPayment(p);
                                  setRejectionReason("");
                                }}
                                className="inline-flex items-center gap-1 rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-300 transition hover:bg-red-500/20 disabled:opacity-50"
                              >
                                <XCircle size={13} />
                                <span>Reject</span>
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-gray-500">
                              {p.verifiedAt ? `Checked ${new Date(p.verifiedAt).toLocaleDateString()}` : "Completed"}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {rejectingPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-red-500/30 bg-[#0d0e14] p-6 text-white shadow-2xl">
            <h3 className="text-base font-bold text-white">
              Reject Payment for #{rejectingPayment.orderNumber}
            </h3>
            <p className="mt-1 text-xs text-gray-400">
              TrxID: <span className="font-mono text-violet-300">{rejectingPayment.transactionId}</span> | Amount: ৳{rejectingPayment.amount} BDT
            </p>

            <div className="mt-4">
              <label className="block text-xs font-medium text-gray-300">
                Rejection Reason (will be emailed to customer) *
              </label>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Transaction ID was not found in our bKash account statement or incorrect amount received."
                className="mt-1 w-full rounded-xl border border-white/10 bg-[#12141c] p-3 text-xs text-white placeholder-gray-500 outline-none focus:border-red-500"
              />
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRejectingPayment(null)}
                className="rounded-xl border border-white/10 px-4 py-2 text-xs font-medium text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void handleConfirmReject()}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-500"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
