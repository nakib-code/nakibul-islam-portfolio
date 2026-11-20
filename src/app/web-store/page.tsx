"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  MessageCircle,
  Search,
  ShoppingBag,
  ShoppingCart,
  SlidersHorizontal,
  User,
  Zap,
} from "lucide-react";
import { IProductItem } from "@/type/store";
import { useCart } from "@/context/CartContext";

export default function WebStorePage() {
  const { addItem, isInCart, totalCount } = useCart();
  const [projects, setProjects] = useState<IProductItem[]>([]);
  const [categories, setCategories] = useState<string[]>([
    "All",
    "E-commerce",
    "SaaS",
    "Portfolio",
    "Landing Page",
    "Agency",
  ]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "price-asc" | "price-desc">("newest");
  const [bdtRate, setBdtRate] = useState<number>(120);
  const [customerUser, setCustomerUser] = useState<{ name: string; email: string } | null>(null);

  // Fetch projects and bKash settings
  useEffect(() => {
    let ignore = false;

    async function fetchData() {
      try {
        const [projRes, settingsRes, userRes] = await Promise.all([
          fetch("/api/projects"),
          fetch("/api/payments/bkash-settings"),
          fetch("/api/customer/auth/me"),
        ]);

        const [projData, settingsData, userData] = await Promise.all([
          projRes.json(),
          settingsRes.json(),
          userRes.json(),
        ]);

        if (ignore) return;

        if (projData.success && Array.isArray(projData.data)) {
          setProjects(projData.data);

          // Extract distinct categories from data if available
          const distinct = Array.from(
            new Set(
              projData.data
                .map((p: IProductItem) => p.category)
                .filter((c: unknown): c is string => typeof c === "string" && c.trim().length > 0)
            )
          ) as string[];
          if (distinct.length > 0) {
            setCategories(["All", ...distinct]);
          }
        }

        if (settingsData.success && settingsData.data?.bdtRate) {
          setBdtRate(settingsData.data.bdtRate);
        }

        if (userData.success && userData.user) {
          setCustomerUser(userData.user);
        }
      } catch (error) {
        console.error("Failed to fetch store data:", error);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    void fetchData();

    return () => {
      ignore = true;
    };
  }, []);

  // Filter and Sort projects
  const filteredProjects = useMemo(() => {
    return projects
      .filter((project) => {
        const matchesCategory =
          selectedCategory === "All" || project.category === selectedCategory;

        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          project.title.toLowerCase().includes(q) ||
          project.description.toLowerCase().includes(q) ||
          (Array.isArray(project.techStack) &&
            project.techStack.some((t) => t.toLowerCase().includes(q)));

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        const priceA =
          typeof a.salePrice === "number" && a.salePrice > 0 ? a.salePrice : a.price;
        const priceB =
          typeof b.salePrice === "number" && b.salePrice > 0 ? b.salePrice : b.price;

        if (sortBy === "price-asc") return priceA - priceB;
        if (sortBy === "price-desc") return priceB - priceA;

        // Default newest
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      });
  }, [projects, selectedCategory, searchQuery, sortBy]);

  // WhatsApp order link
  const getWhatsAppLink = (
    projectTitle: string,
    price: number,
    customMessage?: string
  ) => {
    const phoneNumber = "8801700000000";
    const message =
      customMessage?.trim() ||
      `Hi Nakibul, I am interested in purchasing your website template "${projectTitle}" ($${price} / ৳${Math.round(
        price * bdtRate
      )} BDT).`;
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-8 text-white sm:px-6 lg:px-12">
      <div className="mx-auto max-w-7xl space-y-10">
        {/* Navigation & User Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-800/80 pb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-800 bg-gray-900 px-4 py-2 text-sm font-medium text-gray-300 transition hover:border-[#824CEA]/50 hover:bg-gray-800 hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to Portfolio
          </Link>

          <div className="flex items-center gap-3">
            {customerUser ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/web-store/purchased"
                  className="rounded-xl border border-gray-800 bg-gray-900 px-3.5 py-2 text-xs font-semibold text-gray-300 transition hover:border-gray-700 hover:text-white"
                >
                  My Downloads
                </Link>
                <Link
                  href="/web-store/orders"
                  className="rounded-xl border border-gray-800 bg-gray-900 px-3.5 py-2 text-xs font-semibold text-gray-300 transition hover:border-gray-700 hover:text-white"
                >
                  My Orders
                </Link>
              </div>
            ) : (
              <Link
                href="/web-store/login"
                className="inline-flex items-center gap-1.5 rounded-xl border border-gray-800 bg-gray-900 px-3.5 py-2 text-xs font-semibold text-gray-300 transition hover:border-[#824CEA]/40 hover:text-white"
              >
                <User size={14} />
                <span>Customer Sign In</span>
              </Link>
            )}

            <Link
              href="/web-store/cart"
              className="relative inline-flex items-center gap-2 rounded-xl bg-[#824CEA] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-[#824CEA]/25 transition hover:bg-[#723fd3]"
            >
              <ShoppingCart size={16} />
              <span>Cart</span>
              {totalCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[11px] font-bold text-[#824CEA]">
                  {totalCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Hero Section */}
        <div className="space-y-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-[#824CEA]/30 bg-[#824CEA]/10 px-4 py-1.5 text-xs font-semibold text-[#c084fc]"
          >
            <Zap size={14} />
            <span>Digital Marketplace • Manual bKash Payments Supported</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl font-extrabold tracking-tight sm:text-5xl"
          >
            My Digital Web <span className="text-[#824CEA]">Store</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto max-w-2xl text-sm text-gray-400 sm:text-base"
          >
            Production-ready, customizable website templates. Instant download access
            upon bKash verification.
          </motion.p>
        </div>

        {/* Search & Sort Toolbar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates by title, stack, keyword..."
              className="w-full rounded-xl border border-gray-800 bg-gray-900/90 py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none transition focus:border-[#824CEA] focus:ring-1 focus:ring-[#824CEA]"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <SlidersHorizontal size={14} className="text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "newest" | "price-asc" | "price-desc")
              }
              className="rounded-xl border border-gray-800 bg-gray-900 px-3.5 py-2 text-xs font-medium text-gray-300 outline-none transition focus:border-[#824CEA]"
            >
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                selectedCategory === category
                  ? "bg-[#824CEA] text-white shadow-lg shadow-[#824CEA]/30"
                  : "border border-gray-800 bg-gray-900 text-gray-400 hover:border-gray-700 hover:text-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="py-24 text-center text-sm text-gray-500">
            Loading products from database...
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="rounded-2xl border border-gray-800 bg-gray-900/30 py-20 text-center">
            <h2 className="text-lg font-bold text-white">No templates found</h2>
            <p className="mt-1 text-xs text-gray-400">
              Try adjusting your search query or category filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project, index) => {
              const inCart = isInCart(project._id);
              const effectivePrice =
                typeof project.salePrice === "number" && project.salePrice > 0
                  ? project.salePrice
                  : project.price;
              const hasDiscount =
                typeof project.salePrice === "number" &&
                project.salePrice > 0 &&
                project.salePrice < project.price;
              const priceBdt = Math.round(effectivePrice * bdtRate);

              return (
                <motion.article
                  key={project._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.05, 0.3) }}
                  className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/90 shadow-xl transition hover:-translate-y-1 hover:border-[#824CEA]/50"
                >
                  <div>
                    {/* Image Preview & Category Badge */}
                    <Link
                      href={`/web-store/${project.slug}`}
                      className="relative block h-52 overflow-hidden bg-gray-800"
                    >
                      <Image
                        src={project.imageUrl || "/images/project-placeholder.png"}
                        alt={project.title}
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute right-3 top-3 rounded-full border border-[#824CEA]/40 bg-gray-950/80 px-3 py-1 text-[11px] font-semibold text-[#a98af5] backdrop-blur-md">
                        {project.category}
                      </span>
                    </Link>

                    {/* Content */}
                    <div className="space-y-3 p-5">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/web-store/${project.slug}`}
                          className="text-lg font-bold text-white transition hover:text-[#a98af5]"
                        >
                          {project.title}
                        </Link>
                        <div className="text-right">
                          <span className="text-lg font-extrabold text-white">
                            ${effectivePrice}
                          </span>
                          {hasDiscount && (
                            <span className="ml-1.5 text-xs text-gray-500 line-through">
                              ${project.price}
                            </span>
                          )}
                          <p className="text-[11px] font-medium text-[#c084fc]">
                            ≈ ৳{priceBdt} BDT
                          </p>
                        </div>
                      </div>

                      <p className="line-clamp-2 text-xs leading-relaxed text-gray-400">
                        {project.description}
                      </p>

                      {/* Tech stack */}
                      {Array.isArray(project.techStack) && project.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {project.techStack.slice(0, 4).map((tech) => (
                            <span
                              key={tech}
                              className="rounded-md border border-gray-800 bg-gray-950/80 px-2 py-0.5 text-[10px] text-gray-400"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="border-t border-gray-800/80 p-4 space-y-2">
                    <div className="flex gap-2">
                      <Link
                        href={`/web-store/${project.slug}`}
                        className="flex-1 rounded-xl border border-gray-700 bg-gray-950/80 py-2.5 text-center text-xs font-semibold text-gray-300 transition hover:border-[#824CEA]/50 hover:text-white"
                      >
                        Details
                      </Link>

                      <button
                        type="button"
                        onClick={() => addItem(project)}
                        disabled={inCart}
                        className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold transition ${
                          inCart
                            ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
                            : "bg-[#824CEA] text-white hover:bg-[#723fd3]"
                        }`}
                      >
                        <ShoppingBag size={14} />
                        {inCart ? "In Cart" : "Add to Cart"}
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[11px] text-gray-400">
                      {project.liveUrl ? (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 transition hover:text-white"
                        >
                          <ExternalLink size={12} /> Live Demo
                        </a>
                      ) : <span />}

                      <a
                        href={getWhatsAppLink(project.title, effectivePrice, project.whatsappMessage)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-emerald-400 transition hover:text-emerald-300"
                      >
                        <MessageCircle size={12} /> WhatsApp Inquiry
                      </a>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
