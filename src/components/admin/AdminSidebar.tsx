"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Plus,
  ExternalLink,
  X,
} from "lucide-react";

const navigation = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Websites",
    href: "/admin/dashboard",
    icon: FolderKanban,
  },
  {
    label: "Add Website",
    href: "/admin/projects/new",
    icon: Plus,
  },
];

type AdminSidebarProps = {
  onClose?: () => void;
};

export default function AdminSidebar({ onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col border-r border-white/[0.08] bg-[#0d0e14]">
      <div className="flex h-[72px] items-center justify-between border-b border-white/[0.08] px-5">
        <Link
          href="/admin/dashboard"
          onClick={onClose}
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-lg font-bold text-white">
            N
          </div>

          <div>
            <p className="font-bold tracking-wide text-white">Nakib Admin</p>
            <p className="mt-0.5 text-xs text-gray-500">Control panel</p>
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

      <div className="px-4 py-6">
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
          Workspace
        </p>

        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin/dashboard" &&
                pathname.startsWith(item.href));

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                  isActive
                    ? "border border-violet-500/20 bg-violet-500/10 font-medium text-violet-300"
                    : "text-gray-400 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-4">
        <Link
          href="/web-store"
          target="_blank"
          className="flex items-center justify-between rounded-xl border border-white/[0.08] px-3 py-3 text-sm text-gray-400 transition hover:border-violet-500/30 hover:text-white"
        >
          <span>View public store</span>
          <ExternalLink size={15} />
        </Link>

        <div className="mt-4 rounded-xl bg-white/[0.03] p-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-xs text-gray-400">Admin panel active</span>
          </div>
        </div>
      </div>
    </aside>
  );
}