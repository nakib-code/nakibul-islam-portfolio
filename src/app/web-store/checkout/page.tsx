"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  Copy,
  Info,
  LoaderCircle,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  User,
  Zap,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { IPaymentSettings } from "@/type/store";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalAmountUsd, clearCart } = useCart();

  const [settings, setSettings] = useState<IPaymentSettings | null>(null);
  const [bdtRate, setBdtRate] = useState(120);
  const [loadingSettings, setLoadingSettings] = useState(true);

  // Customer details
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Payment details
  const [senderBkashNumber, setSenderBkashNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");

  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Load bKash settings & customer session
  useEffect(() => {
    let ignore = false;

    async function loadData() {
      try {
        const [settingsRes, userRes] = await Promise.all([
          fetch("/api/payments/bkash-settings"),
          fetch("/api/customer/auth/me"),
        ]);

        const [settingsData, userData] = await Promise.all([
          settingsRes.json(),
          userRes.json(),
        ]);

        if (ignore) return;

        if (settingsData.success && settingsData.data) {
          setSettings(settingsData.data);
          if (settingsData.data.bdtRate) {
            setBdtRate(settingsData.data.bdtRate);
          }
        }

        if (userData.success && userData.user) {
          setName(userData.user.name || "");
          setEmail(userData.user.email || "");
          setPhone(userData.user.phone || "");
        }
      } catch (err) {
        console.error("Failed to load checkout settings:", err);
      } finally {
        if (!ignore) setLoadingSettings(false);
      }
    }

    void loadData();

    return () => {
      ignore = true;
    };
  }, []);

  const totalAmountBdt = Math.round(totalAmountUsd * bdtRate);

  const handleCopyNumber = () => {
    if (!settings?.bkashNumber) return;
    void navigator.clipboard.writeText(settings.bkashNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCheckoutAndPay = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (items.length === 0) {
      setError("Your cart is empty. Please add a product before checking out.");
      return;
    }

    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError("Please provide your full name, email, and contact phone number.");
      return;
    }

    if (!senderBkashNumber.trim() || !transactionId.trim()) {
      setError("Please provide your bKash Sender Number and the bKash Transaction ID (TrxID).");
      return;
    }

    setSubmitting(true);

    try {
      // 1. Create Order
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { name, email, phone },
          items: items.map((it) => it.product._id),
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.message || "Failed to create order.");
      }

      const createdOrder = orderData.order;

      // 2. Submit bKash payment verification
      const paymentRes = await fetch("/api/payments/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: createdOrder._id,
          bkashSenderNumber: senderBkashNumber,
          transactionId,
          amount: createdOrder.totalAmountBdt,
        }),
      });

      const paymentData = await paymentRes.json();
      if (!paymentRes.ok || !paymentData.success) {
        throw new Error(paymentData.message || "Failed to submit payment details.");
      }

      // 3. Clear cart and redirect to order status page
      clearCart();
      router.push(`/web-store/orders/${createdOrder.orderNumber}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong during checkout.");
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 px-4 text-center text-white">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-sm text-gray-400">
          Please add a template to your cart to proceed with checkout.
        </p>
        <Link
          href="/web-store"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#824CEA] px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-[#723fd3]"
        >
          <ArrowLeft size={16} /> Return to Store
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-8 text-white sm:px-6 lg:px-12">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Navigation */}
        <div className="flex items-center justify-between border-b border-gray-800/80 pb-4">
          <Link
            href="/web-store/cart"
            className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
          >
            <ArrowLeft size={16} /> Back to Cart
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400">
            <ShieldCheck size={16} />
            <span>Secure Manual bKash Checkout</span>
          </div>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Order Checkout
        </h1>

        {error && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            <AlertTriangle size={18} className="mt-0.5 shrink-0 text-red-400" />
            <div>
              <p className="font-semibold">Checkout Error</p>
              <p className="mt-0.5 text-xs text-red-200">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleCheckoutAndPay} className="grid gap-8 lg:grid-cols-12">
          {/* Left Column: Customer Details & bKash Payment Form */}
          <div className="space-y-6 lg:col-span-7">
            {/* Step 1: Customer Information */}
            <div className="rounded-2xl border border-gray-800 bg-gray-900/90 p-6 shadow-xl backdrop-blur-xl">
              <h2 className="flex items-center gap-2 text-lg font-bold text-white">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#824CEA] text-xs">
                  1
                </span>
                Customer Information
              </h2>
              <p className="mt-1 text-xs text-gray-400">
                Your download links and invoice will be sent to this email address.
              </p>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-400">
                    Full Name *
                  </label>
                  <div className="relative mt-1">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Shakib Ahmed"
                      className="w-full rounded-xl border border-gray-800 bg-gray-950 py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-600 outline-none transition focus:border-[#824CEA]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400">
                    Email Address *
                  </label>
                  <div className="relative mt-1">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full rounded-xl border border-gray-800 bg-gray-950 py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-600 outline-none transition focus:border-[#824CEA]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400">
                    Contact Phone Number *
                  </label>
                  <div className="relative mt-1">
                    <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="017XXXXXXXX"
                      className="w-full rounded-xl border border-gray-800 bg-gray-950 py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-600 outline-none transition focus:border-[#824CEA]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Manual bKash Payment Instructions */}
            <div className="rounded-2xl border border-[#824CEA]/40 bg-gradient-to-br from-gray-900 via-gray-900 to-[#824CEA]/10 p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-bold text-white">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#824CEA] text-xs">
                    2
                  </span>
                  Manual bKash Payment
                </h2>
                <span className="rounded-full border border-[#824CEA]/40 bg-[#824CEA]/20 px-3 py-1 text-xs font-semibold text-[#c084fc]">
                  {settings?.accountType || "Personal"} Account
                </span>
              </div>

              {/* Number and Amount Showcase */}
              <div className="mt-5 grid gap-4 rounded-xl border border-gray-800 bg-gray-950/90 p-4 sm:grid-cols-2">
                <div>
                  <span className="text-xs font-medium text-gray-400">Admin bKash Number</span>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="font-mono text-lg font-bold text-white tracking-wide">
                      {loadingSettings ? "Loading..." : settings?.bkashNumber || "01700000000"}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyNumber}
                      className="rounded-lg border border-gray-800 bg-gray-900 p-1.5 text-gray-400 transition hover:border-[#824CEA] hover:text-white"
                      title="Copy bKash Number"
                    >
                      {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                    </button>
                  </div>
                  {copied && <p className="mt-1 text-[11px] text-emerald-400">Copied to clipboard!</p>}
                </div>

                <div>
                  <span className="text-xs font-medium text-gray-400">Exact Payable Amount</span>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-2xl font-black text-emerald-400">
                      ৳{totalAmountBdt} BDT
                    </span>
                    <span className="text-xs text-gray-400">(${totalAmountUsd} USD)</span>
                  </div>
                </div>
              </div>

              {/* Step-by-Step Instructions */}
              <div className="mt-4 rounded-xl border border-gray-800/80 bg-gray-950/60 p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#a98af5]">
                  <Info size={14} />
                  <span>Payment Instructions</span>
                </div>
                <div className="mt-2 whitespace-pre-line text-xs leading-relaxed text-gray-300">
                  {settings?.instructions ||
                    "1. Open your bKash app or dial *247#.\n2. Choose 'Send Money' (for Personal).\n3. Enter the bKash number above.\n4. Enter the EXACT payable amount.\n5. Confirm transaction with your PIN.\n6. Enter your sender number and Transaction ID (TrxID) below."}
                </div>
              </div>

              {/* Input: Sender Number and TrxID */}
              <div className="mt-5 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300">
                      Your bKash Sender Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={senderBkashNumber}
                      onChange={(e) => setSenderBkashNumber(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="mt-1 w-full rounded-xl border border-gray-800 bg-gray-950 py-2.5 px-4 text-sm font-mono text-white placeholder-gray-600 outline-none transition focus:border-[#824CEA]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300">
                      bKash Transaction ID (TrxID) *
                    </label>
                    <input
                      type="text"
                      required
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                      placeholder="e.g. BL9A8X7K2M"
                      className="mt-1 w-full rounded-xl border border-gray-800 bg-gray-950 py-2.5 px-4 text-sm font-mono uppercase text-white placeholder-gray-600 outline-none transition focus:border-[#824CEA]"
                    />
                  </div>
                </div>

                {/* Important Security Warning */}
                <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-300">
                  <Lock size={15} className="mt-0.5 shrink-0 text-amber-400" />
                  <span>
                    <strong>Security Notice:</strong> Do <strong>NOT</strong> share your bKash PIN or OTP. We will never ask for your PIN. Only submit the public Transaction ID generated after sending money.
                  </span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#824CEA] py-4 text-base font-bold text-white shadow-xl shadow-[#824CEA]/30 transition hover:bg-[#723fd3] disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <LoaderCircle size={18} className="animate-spin" />
                  Submitting Payment Information...
                </>
              ) : (
                <>
                  <Zap size={18} />
                  Submit Payment for Verification (৳{totalAmountBdt} BDT)
                </>
              )}
            </button>
          </div>

          {/* Right Column: Order Items Review */}
          <div className="space-y-4 lg:col-span-5">
            <div className="sticky top-24 rounded-2xl border border-gray-800 bg-gray-900/90 p-6 shadow-2xl backdrop-blur-xl">
              <h2 className="text-lg font-bold text-white">Order Summary</h2>

              <div className="mt-4 divide-y divide-gray-800">
                {items.map(({ product }) => {
                  const effectivePrice =
                    typeof product.salePrice === "number" && product.salePrice > 0
                      ? product.salePrice
                      : product.price;

                  return (
                    <div key={product._id} className="flex items-center gap-3 py-3">
                      <div className="relative h-14 w-18 shrink-0 overflow-hidden rounded-lg bg-gray-800">
                        <Image
                          src={product.imageUrl || "/images/project-placeholder.png"}
                          alt={product.title}
                          fill
                          unoptimized
                          sizes="72px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 truncate">
                        <p className="truncate text-sm font-semibold text-white">
                          {product.title}
                        </p>
                        <p className="text-[11px] text-gray-400">
                          Digital Source & Assets
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-white">
                          ${effectivePrice}
                        </span>
                        <p className="text-[10px] text-[#a98af5]">
                          ৳{Math.round(effectivePrice * bdtRate)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pricing breakdown */}
              <div className="mt-4 space-y-2 border-t border-gray-800 pt-4 text-xs">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="font-medium text-white">${totalAmountUsd} USD</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Exchange Rate</span>
                  <span className="font-medium text-white">$1 = ৳{bdtRate} BDT</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Delivery Method</span>
                  <span className="font-medium text-emerald-400">Instant Download</span>
                </div>
                <div className="border-t border-gray-800 pt-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm font-bold text-white">Total Amount</span>
                    <div className="text-right">
                      <span className="text-lg font-bold text-white">${totalAmountUsd} USD</span>
                      <p className="text-base font-black text-emerald-400">
                        ৳{totalAmountBdt} BDT
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
