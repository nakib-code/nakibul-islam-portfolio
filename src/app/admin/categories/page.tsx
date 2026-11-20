"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, LoaderCircle, RefreshCw } from "lucide-react";
import { ICategory } from "@/type/store";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setCategories(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  let cancelled = false;

  const load = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (!cancelled && data.success && Array.isArray(data.data)) {
        setCategories(data.data);
      }
    } catch (err) {
      console.error("Failed to load categories:", err);
    } finally {
      if (!cancelled) setLoading(false);
    }
  };

  load();

  return () => {
    cancelled = true;
  };
}, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, order }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to create category.");
      }
      setName("");
      setDescription("");
      setOrder(0);
      void fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error creating category.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id || !window.confirm("Are you sure you want to delete this category?")) return;
    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Delete failed.");
      }
      void fetchCategories();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete.");
    }
  };

  return (
    <main className="min-h-screen bg-[#090a0f] p-4 text-white sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              Template Categories
            </h1>
            <p className="mt-1 text-xs text-gray-400">
              Manage website categories used for storefront filtering.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void fetchCategories()}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 px-3.5 py-2 text-xs font-medium text-gray-300 hover:bg-white/5"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Create Category Form */}
          <div className="lg:col-span-5">
            <form onSubmit={handleCreate} className="rounded-2xl border border-white/[0.08] bg-[#0d0e14] p-5 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-300">
                Add New Category
              </h2>

              <div>
                <label className="block text-xs font-medium text-gray-400">Category Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Fintech / Banking"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-[#12141c] py-2 px-3 text-xs text-white placeholder-gray-600 outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional brief description"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-[#12141c] p-3 text-xs text-white placeholder-gray-600 outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400">Display Order</label>
                <input
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                  placeholder="0"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-[#12141c] py-2 px-3 text-xs text-white placeholder-gray-600 outline-none focus:border-violet-500"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-violet-600 py-2.5 text-xs font-bold text-white transition hover:bg-violet-500 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <LoaderCircle size={14} className="animate-spin" /> Adding...
                  </>
                ) : (
                  <>
                    <Plus size={14} /> Add Category
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Categories List */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-white/[0.08] bg-[#0d0e14] p-5">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-4">
                Active Categories ({categories.length})
              </h2>

              {loading ? (
                <div className="py-12 text-center text-xs text-gray-500">
                  <LoaderCircle size={18} className="animate-spin text-violet-500 mx-auto mb-2" />
                  Loading categories...
                </div>
              ) : categories.length === 0 ? (
                <div className="py-12 text-center text-xs text-gray-500">
                  No custom categories yet. Default categories will be extracted from products.
                </div>
              ) : (
                <div className="divide-y divide-white/[0.04]">
                  {categories.map((c) => (
                    <div key={c._id} className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-xs font-bold text-white">{c.name}</p>
                        <p className="text-[11px] text-gray-500">slug: {c.slug} • order: {c.order}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDelete(c._id)}
                        className="rounded-lg p-1.5 text-gray-500 hover:bg-red-500/10 hover:text-red-400"
                        title="Delete category"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
