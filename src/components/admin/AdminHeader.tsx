"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell, LogOut, Menu } from "lucide-react";

type AdminHeaderProps = {
  onMenuClick: () => void;
};

export default function AdminHeader({
  onMenuClick,
}: AdminHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const pageTitle = pathname.includes("/projects/new")
    ? "Add Website"
    : pathname.includes("/edit")
      ? "Edit Website"
      : "Dashboard";

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      router.replace("/auth/login");
      router.refresh();
    } catch {
      setLoggingOut(false);
      window.alert("Could not log out. Please try again.");
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-white/[0.08] bg-[#0d0e14]/95 px-4 backdrop-blur-xl sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open sidebar"
          className="rounded-lg border border-white/10 p-2 text-gray-300 hover:bg-white/5 lg:hidden"
        >
          <Menu size={19} />
        </button>

        <div>
          <h1 className="text-sm font-semibold text-white sm:text-base">
            {pageTitle}
          </h1>
          <p className="mt-1 hidden text-xs text-gray-500 sm:block">
            Manage your digital business
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div
          className="hidden items-center gap-2 rounded-full border border-white/[0.08] px-3 py-2 sm:flex"
          title="Admin status"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="text-xs text-gray-400">Administrator</span>
        </div>

        <button
          type="button"
          aria-label="Notifications"
          title="Notifications"
          className="rounded-lg border border-white/10 p-2 text-gray-400 hover:bg-white/5 hover:text-white"
        >
          <Bell size={18} />
        </button>

        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="inline-flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2 text-xs font-medium text-red-300 transition hover:bg-red-500/20 disabled:opacity-50 sm:text-sm"
        >
          <LogOut size={16} />
          <span>{loggingOut ? "Logging out..." : "Logout"}</span>
        </button>
      </div>
    </header>
  );
}