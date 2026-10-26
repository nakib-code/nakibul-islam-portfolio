"use client";

import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import ProjectForm from "@/components/admin/ProjectForm";
import Link from "next/link";
import { StoreProject } from "@/type/project";

export default function EditProjectClient({ id }: { id: string }) {
  const [project, setProject] = useState<StoreProject | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadProject() {
      try {
        const response = await fetch(`/api/projects/${id}`, {
          signal: controller.signal,
          cache: "no-store",
        });
        const result = await response.json();
        if (!response.ok || !result.success || !result.data) {
          throw new Error(result.message || "Could not load this project.");
        }
        setProject(result.data);
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : "Could not load this project.");
      }
    }

    void loadProject();
    return () => controller.abort();
  }, [id]);

  if (error) {
    return (
      <main className="min-h-screen bg-[#090a0f] px-4 py-16 text-white">
        <div role="alert" className="mx-auto max-w-xl rounded-2xl border border-red-500/20 bg-red-500/10 p-6">
          <h1 className="font-semibold">Could not open project</h1>
          <p className="mt-2 text-sm text-red-200">{error}</p>
          <Link href="/admin/dashboard" className="mt-5 inline-block text-sm text-violet-300 hover:text-violet-200">Back to inventory</Link>
        </div>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="flex min-h-screen items-center justify-center gap-3 bg-[#090a0f] text-sm text-gray-400">
        <LoaderCircle size={18} className="animate-spin" /> Loading project...
      </main>
    );
  }

  return <ProjectForm mode="edit" project={project} />;
}
