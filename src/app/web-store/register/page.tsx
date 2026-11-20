"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, LoaderCircle, Lock, Mail, Phone, User } from "lucide-react";

export default function CustomerRegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/web-store";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/customer/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to create account.");
      }

      router.push(redirect);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4 py-12 text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900/90 p-8 shadow-2xl backdrop-blur-xl"
      >
        <Link
          href="/web-store"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
        >
          <ArrowLeft size={16} /> Back to Store
        </Link>

        <h1 className="text-2xl font-bold tracking-tight text-white">
          Create Account
        </h1>
        <p className="mt-1 text-sm text-gray-400">
          Sign up to easily track and download your digital templates.
        </p>

        {error && (
          <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400">
              Full Name
            </label>
            <div className="relative mt-1">
              <User
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full rounded-xl border border-gray-800 bg-gray-950/80 py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-600 outline-none transition focus:border-[#824CEA] focus:ring-1 focus:ring-[#824CEA]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400">
              Email Address
            </label>
            <div className="relative mt-1">
              <Mail
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full rounded-xl border border-gray-800 bg-gray-950/80 py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-600 outline-none transition focus:border-[#824CEA] focus:ring-1 focus:ring-[#824CEA]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400">
              bKash / Contact Phone Number
            </label>
            <div className="relative mt-1">
              <Phone
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="017XXXXXXXX"
                className="w-full rounded-xl border border-gray-800 bg-gray-950/80 py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-600 outline-none transition focus:border-[#824CEA] focus:ring-1 focus:ring-[#824CEA]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400">
              Password (min 6 characters)
            </label>
            <div className="relative mt-1">
              <Lock
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-800 bg-gray-950/80 py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-600 outline-none transition focus:border-[#824CEA] focus:ring-1 focus:ring-[#824CEA]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#824CEA] py-3 text-sm font-semibold text-white shadow-lg shadow-[#824CEA]/25 transition hover:bg-[#723fd3] disabled:opacity-50"
          >
            {loading ? (
              <>
                <LoaderCircle size={16} className="animate-spin" />
                Creating account...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-400">
          Already have an account?{" "}
          <Link
            href={`/web-store/login?redirect=${encodeURIComponent(redirect)}`}
            className="font-medium text-[#a98af5] hover:underline"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
