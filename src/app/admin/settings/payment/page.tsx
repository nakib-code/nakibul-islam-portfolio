"use client";

import { useEffect, useState } from "react";
import {
  Save,
  LoaderCircle,
  Sliders,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  DollarSign,
} from "lucide-react";
import { IPaymentSettings, BkashAccountType } from "@/type/store";

export default function AdminPaymentSettingsPage() {
  const [bkashNumber, setBkashNumber] = useState("");
  const [accountType, setAccountType] = useState<BkashAccountType>("Personal");
  const [bdtRate, setBdtRate] = useState(120);
  const [instructions, setInstructions] = useState("");
  const [instructionsBn, setInstructionsBn] = useState("");
  const [isEnabled, setIsEnabled] = useState(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    let ignore = false;
    async function loadSettings() {
      try {
        const res = await fetch("/api/admin/settings/payment");
        const data = await res.json();
        if (!ignore && data.success && data.data) {
          const s: IPaymentSettings = data.data;
          setBkashNumber(s.bkashNumber || "");
          setAccountType(s.accountType || "Personal");
          setBdtRate(s.bdtRate || 120);
          setInstructions(s.instructions || "");
          setInstructionsBn(s.instructionsBn || "");
          setIsEnabled(s.isEnabled !== false);
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    void loadSettings();
    return () => {
      ignore = true;
    };
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/settings/payment", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bkashNumber,
          accountType,
          bdtRate: Number(bdtRate) || 120,
          instructions,
          instructionsBn,
          isEnabled,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update settings.");
      }

      setMessage({ type: "success", text: "bKash payment settings saved successfully!" });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Error saving payment settings.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#090a0f] text-white">
        <LoaderCircle size={24} className="animate-spin text-violet-500" />
        <span className="ml-2.5 text-xs text-gray-400">Loading payment settings...</span>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#090a0f] p-4 text-white sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
            Manual bKash Payment Settings
          </h1>
          <p className="mt-1 text-xs text-gray-400">
            Configure your receiving bKash phone number, account type, and instructions shown to customers during checkout.
          </p>
        </div>

        {message && (
          <div
            className={`rounded-xl border p-3.5 text-xs flex items-center gap-2 ${
              message.type === "success"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                : "border-red-500/30 bg-red-500/10 text-red-300"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle size={16} className="shrink-0 text-red-400" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Main Configuration Card */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#0d0e14] p-6 space-y-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">
              Account Details
            </h2>

            <div className="grid gap-5 sm:grid-cols-2">
              {/* bKash Phone Number */}
              <div>
                <label className="block text-xs font-medium text-gray-300">
                  bKash Receiving Number *
                </label>
                <div className="relative mt-1">
                  <CreditCard
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
                  />
                  <input
                    type="text"
                    required
                    value={bkashNumber}
                    onChange={(e) => setBkashNumber(e.target.value)}
                    placeholder="e.g. 017XXXXXXXX"
                    className="w-full rounded-xl border border-white/10 bg-[#12141c] py-2.5 pl-10 pr-4 font-mono text-sm text-white placeholder-gray-600 outline-none transition focus:border-violet-500"
                  />
                </div>
                <p className="mt-1 text-[11px] text-gray-500">
                  This number will be displayed on the checkout page for customers.
                </p>
              </div>

              {/* Account Type */}
              <div>
                <label className="block text-xs font-medium text-gray-300">
                  bKash Account Type *
                </label>
                <select
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value as BkashAccountType)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-[#12141c] py-2.5 px-3 text-sm text-white outline-none transition focus:border-violet-500"
                >
                  <option value="Personal">Personal (Customer uses &apos;Send Money&apos;)</option>
                  <option value="Merchant">Merchant (Customer uses &apos;Payment&apos;)</option>
                </select>
                <p className="mt-1 text-[11px] text-gray-500">
                  Controls the step-by-step instruction text shown to the buyer.
                </p>
              </div>

              {/* BDT Conversion Rate */}
              <div>
                <label className="block text-xs font-medium text-gray-300">
                  Exchange Rate (1 USD = ? BDT) *
                </label>
                <div className="relative mt-1">
                  <DollarSign
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
                  />
                  <input
                    type="number"
                    required
                    min={1}
                    value={bdtRate}
                    onChange={(e) => setBdtRate(Number(e.target.value))}
                    placeholder="120"
                    className="w-full rounded-xl border border-white/10 bg-[#12141c] py-2.5 pl-10 pr-4 font-mono text-sm text-white placeholder-gray-600 outline-none transition focus:border-violet-500"
                  />
                </div>
                <p className="mt-1 text-[11px] text-gray-500">
                  Automatically calculates exact BDT payable amount from USD catalog price.
                </p>
              </div>

              {/* Enable / Disable Toggle */}
              <div className="flex flex-col justify-center">
                <label className="block text-xs font-medium text-gray-300">
                  bKash Payment Status
                </label>
                <div className="mt-2 flex items-center gap-3">
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={isEnabled}
                      onChange={(e) => setIsEnabled(e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="peer h-6 w-11 rounded-full bg-gray-800 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-emerald-500 peer-checked:after:translate-x-full" />
                  </label>
                  <span className="text-xs font-medium text-gray-300">
                    {isEnabled ? "Payments Active" : "Payments Disabled"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Instructions Card */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#0d0e14] p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">
              Payment Instructions
            </h2>

            <div>
              <label className="block text-xs font-medium text-gray-300">
                Instructions (English)
              </label>
              <textarea
                rows={5}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-[#12141c] p-3 font-mono text-xs text-white placeholder-gray-600 outline-none transition focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300">
                Instructions (Bengali / বাংলা)
              </label>
              <textarea
                rows={5}
                value={instructionsBn}
                onChange={(e) => setInstructionsBn(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-[#12141c] p-3 font-mono text-xs text-white placeholder-gray-600 outline-none transition focus:border-violet-500"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-violet-600/30 transition hover:bg-violet-500 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <LoaderCircle size={16} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Save Payment Settings</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
