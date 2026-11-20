"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Download,
  ExternalLink,
  Layers3,
  LoaderCircle,
  Lock,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

interface PurchasedItem {
  downloadId: string;
  token: string;
  expiresAt: string;
  downloadCount: number;
  lastDownloadedAt?: string;
  orderNumber: string;
  orderDate: string;
  product: {
    _id?: string;
    title: string;
    slug?: string;
    category: string;
    imageUrl?: string;
    liveUrl?: string;
    price?: number;
  };
}

export default function CustomerPurchasedPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [items, setItems] = useState<PurchasedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [customer, setCustomer] = useState<{ name: string; email: string } | null>(null);

  const fetchPurchases = async () => {
    setLoading(true);
    setError("");
    try {
      const url = orderId
        ? `/api/customer/purchases?orderId=${encodeURIComponent(orderId)}`
        : `/api/customer/purchases`;

      const [purchasesRes, userRes] = await Promise.all([
        fetch(url),
        fetch("/api/customer/auth/me"),
      ]);

      const [purchasesData, userData] = await Promise.all([
        purchasesRes.json(),
        userRes.json(),
      ]);

      if (userData.success && userData.user) {
        setCustomer(userData.user);
      }

      if (purchasesData.success && Array.isArray(purchasesData.data)) {
        setItems(purchasesData.data);
      } else if (!userData.user && !orderId) {
        // Prompt login
        setError("Please sign in or provide an order link to view your purchased products.");
      } else {
        setError(purchasesData.message || "No approved purchases found.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load purchases.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const url = orderId
          ? `/api/customer/purchases?orderId=${encodeURIComponent(orderId)}`
          : `/api/customer/purchases`;

        const [purchasesRes, userRes] = await Promise.all([
          fetch(url),
          fetch("/api/customer/auth/me"),
        ]);

        const [purchasesData, userData] = await Promise.all([
          purchasesRes.json(),
          userRes.json(),
        ]);

        if (cancelled) return;

        if (userData.success && userData.user) {
          setCustomer(userData.user);
        }

        if (purchasesData.success && Array.isArray(purchasesData.data)) {
          setItems(purchasesData.data);
        } else if (!userData.user && !orderId) {
          setError("Please sign in or provide an order link to view your purchased products.");
        } else {
          setError(purchasesData.message || "No approved purchases found.");
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load purchases.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [orderId]);

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-8 text-white sm:px-6 lg:px-12">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-800 pb-4">
          <Link
            href="/web-store"
            className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
          >
            <ArrowLeft size={16} /> Back to Web Store
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/web-store/orders"
              className="rounded-xl border border-gray-800 bg-gray-900 px-3.5 py-1.5 text-xs text-gray-300 hover:text-white"
            >
              Order History
            </Link>
            <button
              type="button"
              onClick={() => void fetchPurchases()}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-xl border border-gray-800 bg-gray-900 px-3.5 py-1.5 text-xs text-gray-300 hover:border-gray-700"
            >
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-400">
            <ShieldCheck size={14} />
            <span>Verified Digital Library</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            My Purchased Products
          </h1>
          <p className="text-xs text-gray-400">
            {customer
              ? `Account: ${customer.name} (${customer.email})`
              : "All digital templates approved for download."}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24 text-gray-400 text-sm">
            <LoaderCircle size={24} className="animate-spin text-[#824CEA] mr-2.5" />
            Loading your downloads...
          </div>
        ) : error && items.length === 0 ? (
          <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-8 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-800 text-gray-400">
              <Lock size={24} />
            </div>
            <h2 className="text-lg font-bold text-white">Access Your Downloads</h2>
            <p className="mx-auto max-w-md text-xs text-gray-400 leading-relaxed">
              {error}
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <Link
                href="/web-store/login?redirect=/web-store/purchased"
                className="rounded-xl bg-[#824CEA] px-5 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-[#723fd3]"
              >
                Sign In to Account
              </Link>
              <Link
                href="/web-store"
                className="rounded-xl border border-gray-800 bg-gray-900 px-5 py-2.5 text-xs font-semibold text-gray-300 hover:text-white"
              >
                Browse Store
              </Link>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-gray-800 bg-gray-900/40 p-12 text-center">
            <Layers3 size={32} className="mx-auto text-gray-600 mb-3" />
            <h2 className="text-lg font-bold text-white">No purchased products yet</h2>
            <p className="mt-1 text-xs text-gray-400">
              Once your manual bKash payment is verified by the admin, your download links will appear here.
            </p>
            <Link
              href="/web-store"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#824CEA] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#723fd3]"
            >
              Explore Store
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {items.map((item) => (
              <motion.div
                key={item.downloadId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col justify-between rounded-2xl border border-gray-800 bg-gray-900/80 p-5 shadow-xl transition hover:border-[#824CEA]/50"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                      Approved & Active
                    </span>
                    <span className="text-[11px] font-mono text-gray-500">
                      #{item.orderNumber}
                    </span>
                  </div>

                  <h3 className="mt-3 text-lg font-bold text-white">
                    {item.product.title}
                  </h3>
                  <p className="text-xs text-gray-400">
                    Category: {item.product.category}
                  </p>

                  <div className="mt-4 rounded-xl border border-gray-800/80 bg-gray-950/60 p-3 text-[11px] text-gray-400 space-y-1">
                    <p>
                      <strong>Downloads count:</strong> {item.downloadCount} times
                    </p>
                    {item.lastDownloadedAt && (
                      <p>
                        <strong>Last downloaded:</strong>{" "}
                        {new Date(item.lastDownloadedAt).toLocaleDateString()}
                      </p>
                    )}
                    <p>
                      <strong>Access valid until:</strong>{" "}
                      {new Date(item.expiresAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-gray-800 flex items-center justify-between gap-3">
                  {item.product.liveUrl && (
                    <a
                      href={item.product.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-white"
                    >
                      <ExternalLink size={13} /> Demo
                    </a>
                  )}

                  <a
                    href={`/api/downloads/${item.token}`}
                    download
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600"
                  >
                    <Download size={14} />
                    Download Package (.zip)
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
