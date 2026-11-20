"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Plus,
  ExternalLink,
  X,
  CreditCard,
  ShoppingCart,
  Tags,
  Sliders,
} from "lucide-react";

const navigation = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Payment Verification",
    href: "/admin/payments",
    icon: CreditCard,
    showPendingBadge: true,
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    label: "Websites Inventory",
    href: "/admin/dashboard",
    icon: FolderKanban,
  },
  {
    label: "Add Website",
    href: "/admin/projects/new",
    icon: Plus,
  },
  {
    label: "Categories",
    href: "/admin/categories",
    icon: Tags,
  },
  {
    label: "Payment Settings",
    href: "/admin/settings/payment",
    icon: Sliders,
  },
];

type AdminSidebarProps = {
  onClose?: () => void;
};

export default function AdminSidebar({ onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const [pendingCount, setPendingCount] = useState<number>(0);

  useEffect(() => {
    let ignore = false;
    async function loadStats() {
      try {
        const res = await fetch("/api/admin/sales");
        const data = await res.json();
        if (!ignore && data.success && typeof data.data?.pendingVerifications === "number") {
          setPendingCount(data.data.pendingVerifications);
        }
      } catch {
        // ignore
      }
    }
    void loadStats();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <aside className="flex h-full w-64 flex-col border-r border-white/[0.08] bg-[#0d0e14]">
      <div className="flex h-[72px] items-center justify-between border-b border-white/[0.08] px-5">
        <Link
          href="/admin/dashboard"
          onClick={onClose}
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-lg font-bold text-white shadow-lg shadow-violet-600/30">
            N
          </div>

          <div>
            <p className="font-bold tracking-wide text-white">Nakib Admin</p>
            <p className="mt-0.5 text-xs text-gray-500">Store & Payment Control</p>
          </div>
        </Link>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="rounded-lg p-2 text-gray-400 hover:bg-white/5 lg:hidden"
          >
            <X size={19} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
          Management
        </p>

        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition ${
                  isActive
                    ? "border border-violet-500/20 bg-violet-500/10 font-medium text-violet-300"
                    : "text-gray-400 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} />
                  <span>{item.label}</span>
                </div>

                {item.showPendingBadge && pendingCount > 0 && (
                  <span className="flex h-5 items-center justify-center rounded-full bg-amber-500/20 px-2 text-[10px] font-bold text-amber-300 border border-amber-500/30">
                    {pendingCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto border-t border-white/[0.06] p-4">
        <Link
          href="/web-store"
          target="_blank"
          className="flex items-center justify-between rounded-xl border border-white/[0.08] px-3 py-2.5 text-xs text-gray-400 transition hover:border-violet-500/30 hover:text-white"
        >
          <span>View Public Store</span>
          <ExternalLink size={14} />
        </Link>

        <div className="mt-3 rounded-xl bg-white/[0.02] p-2.5">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-[11px] text-gray-400">bKash System Online</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
