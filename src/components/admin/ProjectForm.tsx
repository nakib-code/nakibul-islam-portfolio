"use client";

import Link from "next/link";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { ArrowLeft, ImagePlus, LoaderCircle, Save, UploadCloud } from "lucide-react";
import { ProjectFormValues, StoreProject } from "@/type/project";

const categories = ["E-commerce", "SaaS", "Portfolio", "Landing Page", "Agency", "Other"];

const emptyForm: ProjectFormValues = {
  title: "",
  slug: "",
  description: "",
  category: "E-commerce",
  price: "",
  techStack: "Next.js, TypeScript, Tailwind CSS",
  liveUrl: "",
  imageUrl: "",
  imagePublicId: "",
  whatsappMessage: "Hi, I'm interested in this website template.",
};

const inputClass =
  "w-full rounded-xl border border-white/10 bg-[#11131b] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20";

type Props = {
  mode: "create" | "edit";
  project?: StoreProject;
};

export default function ProjectForm({ mode, project }: Props) {
  const [form, setForm] = useState<ProjectFormValues>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [localPreview, setLocalPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!project) return;
    setForm({
      title: project.title ?? "",
      slug: project.slug ?? "",
      description: project.description ?? "",
      category: project.category ?? "Other",
      price: String(project.price ?? ""),
      techStack: Array.isArray(project.techStack) ? project.techStack.join(", ") : "",
      liveUrl: project.liveUrl ?? "",
      imageUrl: project.imageUrl ?? "",
      imagePublicId: project.imagePublicId ?? "",
      whatsappMessage: project.whatsappMessage ?? "Hi, I'm interested in this website template.",
    });
  }, [project]);

  useEffect(() => {
    if (!imageFile) {
      setLocalPreview("");
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setLocalPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const updateField = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "title" && !prev.slug) {
        next.slug = value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      }
      return next;
    });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setError("");
    if (!file) {
      setImageFile(null);
      return;
    }
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      setError("Please choose a JPG, PNG, or WebP image.");
      e.target.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be 5 MB or less.");
      e.target.value = "";
      return;
    }
    setImageFile(file);
  };

  const uploadImage = async () => {
    if (!imageFile) return { imageUrl: form.imageUrl, imagePublicId: form.imagePublicId };
    const formData = new FormData();
    formData.append("file", imageFile);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const result = await response.json();
    if (!response.ok || !result.success || !result.data?.secure_url || !result.data?.public_id) {
      throw new Error(result.message || "Image upload failed.");
    }
    return {
      imageUrl: result.data.secure_url as string,
      imagePublicId: result.data.public_id as string,
    };
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setNotice("");

    try {
      if (!form.imageUrl && !imageFile) {
        throw new Error("Please upload a website preview image.");
      }
      if (mode === "edit" && !imageFile && !form.imagePublicId) {
        throw new Error("This project has no saved Cloudinary image ID. Upload a new image before saving.");
      }

      const uploadedImage = await uploadImage();
      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim().toLowerCase(),
        description: form.description.trim(),
        category: form.category,
        price: Number(form.price),
        techStack: form.techStack.split(",").map((item) => item.trim()).filter(Boolean),
        liveUrl: form.liveUrl.trim(),
        imageUrl: uploadedImage.imageUrl,
        imagePublicId: uploadedImage.imagePublicId,
        whatsappMessage: form.whatsappMessage.trim(),
      };

      if (!Number.isFinite(payload.price) || payload.price < 0) {
        throw new Error("Enter a valid non-negative price.");
      }

      const response = await fetch(
        mode === "create" ? "/api/projects" : `/api/projects/${project?._id}`,
        {
          method: mode === "create" ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || `Failed to ${mode === "create" ? "create" : "update"} project.`);
      }

      setNotice(mode === "create" ? "Website published successfully." : "Website updated successfully.");
      if (mode === "create") {
        setForm(emptyForm);
        setImageFile(null);
        const fileInput = document.getElementById("project-image") as HTMLInputElement | null;
        if (fileInput) fileInput.value = "";
      }
      window.location.assign("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const preview = localPreview || form.imageUrl;

  return (
    <main className="min-h-screen bg-[#090a0f] px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-4xl">
        <Link href="/admin/dashboard" className="mb-7 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white">
          <ArrowLeft size={16} /> Back to inventory
        </Link>

        <div className="mb-7">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
            {mode === "create" ? "New listing" : "Edit listing"}
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {mode === "create" ? "Add a website" : "Update website"}
            <span className="text-violet-400">.</span>
          </h1>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            Manage the website details shown in your public store.
          </p>
        </div>

        {error && <div role="alert" className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}
        {notice && <div role="status" className="mb-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">{notice}</div>}

        <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-white/[0.08] bg-[#101117] p-5 sm:p-8">
          <section className="grid gap-5 sm:grid-cols-2">
            <Field label="Website title">
              <input name="title" value={form.title} onChange={updateField} required maxLength={120} className={inputClass} placeholder="E-commerce starter template" />
            </Field>
            <Field label="URL slug">
              <input name="slug" value={form.slug} onChange={updateField} required pattern="[a-z0-9]+(-[a-z0-9]+)*" title="Use lowercase letters, numbers and hyphens" className={inputClass} placeholder="ecommerce-starter" />
            </Field>
            <Field label="Category">
              <select name="category" value={form.category} onChange={updateField} className={inputClass}>
                {categories.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
            </Field>
            <Field label="Price (USD)">
              <input type="number" name="price" value={form.price} onChange={updateField} required min="0" step="0.01" className={inputClass} placeholder="99" />
            </Field>
          </section>

          <Field label="Description">
            <textarea name="description" value={form.description} onChange={updateField} required minLength={10} maxLength={3000} rows={5} className={`${inputClass} resize-y`} placeholder="Describe the template, its features, and what the buyer receives." />
          </Field>

          <section className="grid gap-5 sm:grid-cols-2">
            <Field label="Technologies (comma-separated)">
              <input name="techStack" value={form.techStack} onChange={updateField} required className={inputClass} placeholder="Next.js, TypeScript, Tailwind CSS" />
            </Field>
            <Field label="Live demo URL">
              <input type="url" name="liveUrl" value={form.liveUrl} onChange={updateField} required className={inputClass} placeholder="https://demo.example.com" />
            </Field>
          </section>

          <Field label="WhatsApp inquiry message">
            <textarea name="whatsappMessage" value={form.whatsappMessage} onChange={updateField} required rows={2} maxLength={1000} className={`${inputClass} resize-y`} placeholder="Hi, I'm interested in this website template." />
          </Field>

          <section className="rounded-xl border border-dashed border-white/15 bg-black/10 p-4 sm:p-5">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-200">
              <ImagePlus size={17} className="text-violet-300" />
              Website preview image
            </div>
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Website preview" className="mb-4 max-h-72 w-full rounded-xl border border-white/10 object-cover object-top" />
            ) : (
              <div className="mb-4 flex min-h-36 flex-col items-center justify-center rounded-xl bg-white/[0.03] text-sm text-gray-500">
                <UploadCloud size={24} className="mb-2" />
                No image selected
              </div>
            )}
            <input id="project-image" type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} className="block w-full text-sm text-gray-400 file:mr-4 file:rounded-lg file:border-0 file:bg-violet-600 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white hover:file:bg-violet-500" />
            <p className="mt-2 text-xs text-gray-600">
              JPG, PNG or WebP · maximum 5 MB. {mode === "edit" ? "Leave empty to keep the current image." : "The image uploads securely when you publish."}
            </p>
          </section>

          <div className="flex flex-col-reverse gap-3 border-t border-white/[0.07] pt-5 sm:flex-row sm:justify-end">
            <Link href="/admin/dashboard" className="inline-flex items-center justify-center rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-gray-300 hover:bg-white/5">
              Cancel
            </Link>
            <button type="submit" disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? <LoaderCircle size={17} className="animate-spin" /> : <Save size={17} />}
              {loading ? "Saving..." : mode === "create" ? "Publish website" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="block text-xs font-medium text-gray-400">{label}</span>
      {children}
    </label>
  );
}
