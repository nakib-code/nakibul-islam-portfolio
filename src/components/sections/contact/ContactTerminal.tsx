"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Check,
  Loader2,
  Send,
} from "lucide-react";
import { useTranslation } from "react-i18next";

type FormStatus = "idle" | "sending" | "success" | "error";

export default function ContactTerminal() {
  const { t } = useTranslation("common");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      return;
    }

    setStatus("sending");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to send message.",
        );
      }

      setStatus("success");
    } catch (error) {
      console.error("Contact form error:", error);

      setStatus("error");

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to send message. Please try again.",
      );
    }
  };

  const handleReset = () => {
    setStatus("idle");
    setErrorMessage("");
    setName("");
    setEmail("");
    setMessage("");
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
          <SuccessMessage onReset={handleReset} />
        ) : (
          <>
            {/* Command */}
            <div className="mb-6 font-mono text-sm">
              <span className="text-emerald-400">
                nakib@portfolio
              </span>

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

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Name */}
              <TerminalInput
                label={t("contact.terminal.name")}
                value={name}
                onChange={setName}
                placeholder={t(
                  "contact.terminal.namePlaceholder",
                )}
                type="text"
                disabled={status === "sending"}
              />

              {/* Email */}
              <TerminalInput
                label={t("contact.terminal.email")}
                value={email}
                onChange={setEmail}
                placeholder={t(
                  "contact.terminal.emailPlaceholder",
                )}
                type="email"
                disabled={status === "sending"}
              />

              {/* Message */}
              <div>
                <label className="mb-2 block font-mono text-xs text-gray-500">
                  <span className="text-primary">›</span>{" "}
                  {t("contact.terminal.message")}
                </label>

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t(
                    "contact.terminal.messagePlaceholder",
                  )}
                  rows={5}
                  disabled={status === "sending"}
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 font-mono text-sm text-gray-200 outline-none transition-all duration-300 placeholder:text-gray-600 focus:border-primary/50 focus:bg-primary/[0.03] focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              {/* Error */}
              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 font-mono text-xs leading-5 text-red-400"
                >
                  {errorMessage}
                </motion.div>
              )}

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
                    {t("contact.terminal.sending")}
                  </>
                ) : (
                  <>
                    <Send className="size-4" />

                    {t("contact.terminal.sendButton")}

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
  disabled,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block font-mono text-xs text-gray-500">
        <span className="text-primary">›</span>{" "}
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        required
        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 font-mono text-sm text-gray-200 outline-none transition-all duration-300 placeholder:text-gray-600 focus:border-primary/50 focus:bg-primary/[0.03] focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
      />
    </div>
  );
}

function SuccessMessage({
  onReset,
}: {
  onReset: () => void;
}) {
  const { t } = useTranslation("common");

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
        ✓ {t("contact.terminal.successMessage")}
      </p>

      <h3 className="mt-3 text-xl font-semibold text-gray-100">
        {t("contact.terminal.successTitle")}
      </h3>

      <p className="mt-3 max-w-sm text-sm leading-6 text-gray-500">
        {t("contact.terminal.successDescription")}
      </p>

      <button
        onClick={onReset}
        className="mt-7 rounded-xl border border-white/10 px-4 py-2 text-xs text-gray-400 transition-colors hover:border-primary/30 hover:text-primary"
      >
        {t("contact.terminal.sendAnother")}
      </button>
    </motion.div>
  );
}