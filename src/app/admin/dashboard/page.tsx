"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowUpRight, ExternalLink, Layers3, LoaderCircle, Plus, RefreshCw, Search, Trash2 } from "lucide-react";
import { StoreProject } from "@/type/project";

export default function AdminDashboardPage() {
  const [projects, setProjects] = useState<StoreProject[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState("");

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/projects", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not load websites.");
      }
      setProjects(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load websites.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchProjects();
  }, [fetchProjects]);

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return projects;
    return projects.filter((project) =>
      `${project.title} ${project.category} ${project.slug}`.toLowerCase().includes(query)
    );
  }, [projects, search]);

  const handleDelete = async (project: StoreProject) => {
    if (!window.confirm(`Delete "${project.title}"? This cannot be undone.`)) return;
    setDeletingId(project._id);
    setError("");
    try {
      const response = await fetch(`/api/projects/${project._id}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not delete website.");
      }
      setProjects((current) => current.filter((item) => item._id !== project._id));
      if (result.imageCleanupWarning) {
        setError("The website was deleted, but its Cloudinary image may need manual cleanup.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete website.");
    } finally {
      setDeletingId("");
    }
  };

  const categoriesCount = new Set(projects.map((project) => project.category)).size;

  return (
    <main className="min-h-screen bg-[#090a0f] px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-9 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 text-xs text-violet-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Store administration
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Website inventory<span className="text-violet-400">.</span></h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">Create, update and remove the ready-made websites shown in your store.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/web-store" target="_blank" className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm text-gray-300 hover:bg-white/5">
              View store <ArrowUpRight size={16} />
            </Link>
            <Link href="/admin/projects/new" className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold hover:bg-violet-500">
              <Plus size={17} /> Add website
            </Link>
          </div>
        </header>

        <section className="mb-7 grid gap-4 sm:grid-cols-3">
          <Stat label="Total websites" value={projects.length} />
          <Stat label="Categories" value={categoriesCount} />
          <Stat label="With live demos" value={projects.filter((project) => Boolean(project.liveUrl)).length} />
        </section>

        {error && <div role="alert" className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>}

        <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#101117]">
          <div className="flex flex-col gap-4 border-b border-white/[0.07] p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="font-semibold">All websites</h2>
              <p className="mt-1 text-xs text-gray-500">{filteredProjects.length} listing{filteredProjects.length === 1 ? "" : "s"}</p>
            </div>
            <div className="flex gap-2">
              <div className="relative w-full sm:w-72">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search title, slug, category..." aria-label="Search websites" className="w-full rounded-xl border border-white/10 bg-[#11131b] py-2.5 pl-10 pr-3 text-sm outline-none focus:border-violet-500" />
              </div>
              <button type="button" onClick={() => void fetchProjects()} aria-label="Refresh inventory" className="rounded-xl border border-white/10 px-3 text-gray-300 hover:bg-white/5">
                <RefreshCw size={16} />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-3 py-20 text-sm text-gray-500"><LoaderCircle size={18} className="animate-spin" /> Loading inventory...</div>
          ) : filteredProjects.length === 0 ? (
            <div className="px-5 py-20 text-center">
              <Layers3 size={28} className="mx-auto mb-3 text-gray-600" />
              <p className="font-medium">{search ? "No matching websites" : "Your store is empty"}</p>
              <p className="mt-2 text-sm text-gray-500">{search ? "Try a different search." : "Add your first website template to get started."}</p>
              {!search && <Link href="/admin/projects/new" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold"><Plus size={16} /> Add website</Link>}
            </div>
          ) : (
            <>
              <div className="divide-y divide-white/[0.06] md:hidden">
                {filteredProjects.map((project) => (
                  <article key={project._id} className="p-4">
                    <div className="flex gap-3">
                      <ProjectImage project={project} />
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-sm font-semibold">{project.title}</h3>
                        <p className="mt-1 text-xs text-gray-500">{project.category}</p>
                        <p className="mt-2 text-sm font-bold text-violet-300">${Number(project.price).toFixed(2)}</p>
                      </div>
                    </div>
                    <ProjectActions project={project} deleting={deletingId === project._id} onDelete={handleDelete} />
                  </article>
                ))}
              </div>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[760px] text-left">
                  <thead><tr className="border-b border-white/[0.06] text-[11px] uppercase tracking-wider text-gray-500">
                    <th className="px-6 py-4 font-medium">Website</th><th className="px-4 py-4 font-medium">Category</th><th className="px-4 py-4 font-medium">Price</th><th className="px-6 py-4 text-right font-medium">Actions</th>
                  </tr></thead>
                  <tbody className="divide-y divide-white/[0.05]">
                    {filteredProjects.map((project) => (
                      <tr key={project._id} className="hover:bg-white/[0.02]">
                        <td className="px-6 py-4"><div className="flex items-center gap-3"><ProjectImage project={project} /><div className="min-w-0"><p className="max-w-xs truncate text-sm font-medium">{project.title}</p><p className="mt-1 max-w-xs truncate text-xs text-gray-600">{project.slug}</p></div></div></td>
                        <td className="px-4 py-4"><span className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-1.5 text-xs text-gray-400">{project.category}</span></td>
                        <td className="px-4 py-4 text-sm font-semibold text-violet-300">${Number(project.price).toFixed(2)}</td>
                        <td className="px-6 py-4"><ProjectActions project={project} deleting={deletingId === project._id} onDelete={handleDelete} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>
        <footer className="py-6 text-center text-xs text-gray-600">Web Store Admin · Manage your digital inventory</footer>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return <div className="rounded-2xl border border-white/[0.08] bg-[#101117] p-5"><p className="text-sm text-gray-500">{label}</p><p className="mt-4 text-3xl font-bold">{value}</p></div>;
}

function ProjectImage({ project }: { project: StoreProject }) {
  return (
    <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white/[0.03]">
      {project.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={project.imageUrl} alt={project.title} className="h-full w-full object-cover" />
      ) : <div className="flex h-full items-center justify-center text-xs text-gray-600">No image</div>}
    </div>
  );
}

function ProjectActions({ project, deleting, onDelete }: { project: StoreProject; deleting: boolean; onDelete: (project: StoreProject) => void }) {
  return (
    <div className="mt-4 flex justify-end gap-2 md:mt-0">
      {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer" aria-label={`Preview ${project.title}`} className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-gray-300 hover:bg-white/5"><ExternalLink size={14} /> <span className="hidden lg:inline">Preview</span></a>}
      <Link href={`/admin/projects/${project._id}/edit`} className="inline-flex items-center gap-2 rounded-lg border border-violet-500/20 px-3 py-2 text-xs text-violet-300 hover:bg-violet-500/10">Edit</Link>
      <button type="button" disabled={deleting} onClick={() => onDelete(project)} className="inline-flex items-center gap-2 rounded-lg border border-red-500/20 px-3 py-2 text-xs text-red-300 hover:bg-red-500/10 disabled:opacity-50"><Trash2 size={14} /> {deleting ? "Deleting..." : "Delete"}</button>
    </div>
  );
}
