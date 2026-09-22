"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Check, Loader2, Send } from "lucide-react";

export default function ContactTerminal() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [status, setStatus] = useState<
    "idle" | "sending" | "success"
  >("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !email || !message) return;

    setStatus("sending");

    // Temporary simulation
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setStatus("success");
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-[#0B1020] shadow-2xl shadow-primary/5">
      {/* Terminal Header */}
      <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.02] px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-red-500/80" />
          <span className="size-2.5 rounded-full bg-yellow-500/80" />
          <span className="size-2.5 rounded-full bg-green-500/80" />
        </div>

        <div className="font-mono text-[11px] text-gray-500">
          nakib@portfolio ~ contact
        </div>

        <div className="w-10" />
      </div>

      {/* Terminal Body */}
      <div className="p-5 sm:p-7">
        {status === "success" ? (
          <SuccessMessage
            onReset={() => {
              setStatus("idle");
              setName("");
              setEmail("");
              setMessage("");
            }}
          />
        ) : (
          <>
            {/* Command */}
            <div className="mb-6 font-mono text-sm">
              <span className="text-emerald-400">nakib@portfolio</span>
              <span className="text-gray-500">:</span>
              <span className="text-blue-400">~</span>
              <span className="text-gray-500">$ </span>
              <span className="text-gray-200">
                ./send-message
                <span className="ml-1 inline-block animate-pulse text-primary">
                  ▊
                </span>
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <TerminalInput
                label="Name"
                value={name}
                onChange={setName}
                placeholder="Ahmed"
                type="text"
              />

              {/* Email */}
              <TerminalInput
                label="Email"
                value={email}
                onChange={setEmail}
                placeholder="you@example.com"
                type="email"
              />

              {/* Message */}
              <div>
                <label className="mb-2 block font-mono text-xs text-gray-500">
                  <span className="text-primary">›</span> Message
                </label>

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell me about your project..."
                  rows={5}
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 font-mono text-sm text-gray-200 outline-none transition-all duration-300 placeholder:text-gray-600 focus:border-primary/50 focus:bg-primary/[0.03] focus:ring-2 focus:ring-primary/10"
                />
              </div>

              {/* Button */}
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={status === "sending"}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 font-mono text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-primary/30 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {status === "sending" ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="size-4" />
                    SEND MESSAGE
                    <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </>
                )}
              </motion.button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

function TerminalInput({
  label,
  value,
  onChange,
  placeholder,
  type,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type: string;
}) {
  return (
    <div>
      <label className="mb-2 block font-mono text-xs text-gray-500">
        <span className="text-primary">›</span> {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 font-mono text-sm text-gray-200 outline-none transition-all duration-300 placeholder:text-gray-600 focus:border-primary/50 focus:bg-primary/[0.03] focus:ring-2 focus:ring-primary/10"
      />
    </div>
  );
}

function SuccessMessage({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex min-h-[430px] flex-col items-center justify-center text-center font-mono"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 12,
        }}
        className="flex size-16 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
      >
        <Check className="size-8" />
      </motion.div>

      <p className="mt-6 text-sm text-emerald-400">
        ✓ Message sent successfully.
      </p>

      <h3 className="mt-3 text-xl font-semibold text-gray-100">
        Thanks for reaching out!
      </h3>

      <p className="mt-3 max-w-sm text-sm leading-6 text-gray-500">
        I appreciate your message. I'll get back to you as soon as possible.
      </p>

      <button
        onClick={onReset}
        className="mt-7 rounded-xl border border-white/10 px-4 py-2 text-xs text-gray-400 transition-colors hover:border-primary/30 hover:text-primary"
      >
        SEND ANOTHER MESSAGE
      </button>
    </motion.div>
  );
}