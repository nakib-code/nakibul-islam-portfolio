"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  LoaderCircle,
  Share2,
  ShoppingBag,
  ShoppingCart,
  Zap,
} from "lucide-react";
import { IProductItem } from "@/type/store";
import { useCart } from "@/context/CartContext";

export default function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const { addItem, isInCart } = useCart();

  const [product, setProduct] = useState<IProductItem | null>(null);
  const [bdtRate, setBdtRate] = useState<number>(120);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      try {
        const [projRes, settingsRes] = await Promise.all([
          fetch(`/api/projects`),
          fetch(`/api/payments/bkash-settings`),
        ]);

        const projData = await projRes.json();
        const settingsData = await settingsRes.json();

        if (ignore) return;

        if (settingsData.success && settingsData.data?.bdtRate) {
          setBdtRate(settingsData.data.bdtRate);
        }

        if (projData.success && Array.isArray(projData.data)) {
          const found = projData.data.find(
            (item: IProductItem) => item.slug === slug
          );
          if (found) {
            setProduct(found);
            setActiveImage(found.imageUrl || "/images/project-placeholder.png");
          } else {
            setError("Product not found.");
          }
        } else {
          setError("Failed to load product details.");
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Error loading product.");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    void loadData();

    return () => {
      ignore = true;
    };
  }, [slug]);

  const handleShare = () => {
    if (typeof navigator !== "undefined") {
      void navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addItem(product);
    router.push("/web-store/checkout");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950 text-gray-400">
        <LoaderCircle size={28} className="animate-spin text-[#824CEA]" />
        <span className="ml-3 text-sm">Loading product...</span>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 px-4 text-center text-white">
        <h1 className="text-2xl font-bold">{error || "Product Not Found"}</h1>
        <p className="mt-2 text-sm text-gray-400">
          The requested website template could not be found.
        </p>
        <Link
          href="/web-store"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#824CEA] px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-[#723fd3]"
        >
          <ArrowLeft size={16} /> Back to Store
        </Link>
      </div>
    );
  }

  const effectivePrice =
    typeof product.salePrice === "number" && product.salePrice > 0
      ? product.salePrice
      : product.price;

  const originalPrice = product.price;
  const hasDiscount =
    typeof product.salePrice === "number" &&
    product.salePrice > 0 &&
    product.salePrice < originalPrice;

  const priceInBdt = Math.round(effectivePrice * bdtRate);
  const inCart = isInCart(product._id);

  const allScreenshots = [
    product.imageUrl,
    ...(Array.isArray(product.screenshots) ? product.screenshots : []),
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-8 text-white sm:px-6 lg:px-12">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Top Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/web-store"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-800 bg-gray-900 px-4 py-2 text-sm text-gray-300 transition hover:border-[#824CEA]/50 hover:bg-gray-800 hover:text-white"
          >
            <ArrowLeft size={16} /> Back to Web Store
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-800 bg-gray-900 px-3.5 py-2 text-xs text-gray-400 transition hover:border-gray-700 hover:text-white"
            >
              <Share2 size={14} />
              {copied ? "Link Copied!" : "Share"}
            </button>
            <Link
              href="/web-store/cart"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-800 bg-gray-900 px-4 py-2 text-sm text-gray-300 transition hover:border-[#824CEA]/50 hover:text-white"
            >
              <ShoppingCart size={16} className="text-[#a98af5]" />
              <span>Cart</span>
            </Link>
          </div>
        </div>

        {/* Product Hero Layout */}
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Left Column: Visual Gallery */}
          <div className="space-y-4 lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-video w-full overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 shadow-2xl"
            >
              <Image
                src={activeImage || "/images/project-placeholder.png"}
                alt={product.title}
                fill
                unoptimized
                priority
                sizes="(max-width: 1024px) 100vw, 65vw"
                className="object-cover"
              />
              <span className="absolute right-3.5 top-3.5 rounded-full border border-[#824CEA]/40 bg-gray-950/80 px-3.5 py-1 text-xs font-semibold text-[#a98af5] backdrop-blur-md">
                {product.category}
              </span>
            </motion.div>

            {/* Gallery Thumbnails */}
            {allScreenshots.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {allScreenshots.map((img, idx) => (
                  <button
                    key={`${img}-${idx}`}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className={`relative h-18 w-28 shrink-0 overflow-hidden rounded-xl border transition ${
                      activeImage === img
                        ? "border-[#824CEA] ring-2 ring-[#824CEA]/50"
                        : "border-gray-800 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Screenshot ${idx + 1}`}
                      fill
                      unoptimized
                      sizes="112px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Pricing & Actions */}
          <div className="space-y-6 lg:col-span-5">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                {product.title}
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-gray-300">
                {product.description}
              </p>
            </div>

            {/* Price Box */}
            <div className="rounded-2xl border border-gray-800 bg-gray-900/80 p-5 backdrop-blur-md">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-white">
                  ${effectivePrice}
                </span>
                <span className="text-sm font-medium text-gray-400">USD</span>

                {hasDiscount && (
                  <span className="text-lg text-gray-500 line-through">
                    ${originalPrice}
                  </span>
                )}
              </div>

              {/* bKash Equivalent */}
              <div className="mt-2 flex items-center gap-2 rounded-lg bg-[#824CEA]/10 px-3 py-1.5 text-xs font-medium text-[#c084fc]">
                <Zap size={14} className="shrink-0 text-[#e9d5ff]" />
                <span>
                  bKash Payable: <strong>৳{priceInBdt} BDT</strong> (Rate: $1 = ৳
                  {bdtRate})
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleBuyNow}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#824CEA] py-3.5 text-sm font-bold text-white shadow-xl shadow-[#824CEA]/30 transition hover:bg-[#723fd3]"
              >
                <Zap size={18} />
                Buy Now with bKash
              </button>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={inCart}
                className={`flex w-full items-center justify-center gap-2 rounded-xl border py-3.5 text-sm font-semibold transition ${
                  inCart
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                    : "border-gray-700 bg-gray-900 text-gray-200 hover:border-[#824CEA]/50 hover:bg-gray-800 hover:text-white"
                }`}
              >
                {inCart ? (
                  <>
                    <CheckCircle2 size={18} className="text-emerald-400" />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} />
                    Add to Cart
                  </>
                )}
              </button>

              {product.liveUrl && (
                <a
                  href={product.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-800 bg-gray-950/60 py-3 text-sm font-medium text-gray-400 transition hover:border-gray-700 hover:text-white"
                >
                  <ExternalLink size={16} />
                  Explore Live Demo Preview
                </a>
              )}
            </div>

            {/* Tech Stack */}
            {Array.isArray(product.techStack) && product.techStack.length > 0 && (
              <div className="space-y-2 border-t border-gray-800/80 pt-5">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Built With
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {product.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-lg border border-gray-800 bg-gray-950 px-2.5 py-1 text-xs text-gray-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Feature Checklist */}
        {Array.isArray(product.features) && product.features.length > 0 && (
          <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6 md:p-8">
            <h2 className="text-lg font-bold text-white">Included Features</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {product.features.map((feat) => (
                <div key={feat} className="flex items-center gap-2.5 text-sm text-gray-300">
                  <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
