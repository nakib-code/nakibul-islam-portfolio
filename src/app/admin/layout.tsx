import AdminLayoutClient from "@/components/admin/AdminLayoutClient";
import type { ReactNode } from "react";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}