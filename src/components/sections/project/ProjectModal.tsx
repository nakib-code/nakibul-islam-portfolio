"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  GitBranch,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import type { Project } from "@/type/project";

interface ProjectModalProps {
  project: Project;
  open: boolean;
  onClose: () => void;
}

export default function ProjectModal({
  project,
  open,
  onClose,
}: ProjectModalProps) {
  const { t } = useTranslation("common");

  const [activeImage, setActiveImage] = useState(0);

  const projectKey = project.key;
  const imageCount = project.images.length;

  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (imageCount <= 1) return;

      if (event.key === "ArrowRight") {
        setActiveImage((current) =>
          current >= imageCount - 1 ? 0 : current + 1,
        );
      }

      if (event.key === "ArrowLeft") {
        setActiveImage((current) =>
          current <= 0 ? imageCount - 1 : current - 1,
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [open, imageCount, onClose]);

  const nextImage = () => {
    if (imageCount <= 1) return;

    setActiveImage((current) =>
      current >= imageCount - 1 ? 0 : current + 1,
    );
  };

  const previousImage = () => {
    if (imageCount <= 1) return;

    setActiveImage((current) =>
      current <= 0 ? imageCount - 1 : current - 1,
    );
  };

  /*
   * Safety check:
   * If the project changes and the previous activeImage
   * no longer exists, use the first image.
   */
  const safeActiveImage =
    activeImage >= imageCount ? 0 : activeImage;

  const currentImage =
    project.images[safeActiveImage];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.96,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.96,
              y: 20,
            }}
            transition={{
              duration: 0.25,
              ease: "easeOut",
            }}
            className="relative z-10 max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-[28px] border border-border bg-background shadow-2xl"
          >
            {/* Header */}
            <div className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/90 px-5 py-4 backdrop-blur-xl sm:px-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  {t("projects.caseStudy")}
                </p>

                <h2 className="mt-1 font-heading text-xl font-bold sm:text-2xl">
                  {t(
                    `projects.items.${projectKey}.title`,
                  )}
                </h2>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label={t(
                  "projects.closeCaseStudy",
                )}
                className="flex size-10 items-center justify-center rounded-full border border-border bg-muted/50 transition-colors hover:bg-muted"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 sm:p-8">
              {/* Main Image */}
              <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
                <div className="relative aspect-video">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={safeActiveImage}
                      initial={{
                        opacity: 0,
                        scale: 1.02,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                      }}
                      exit={{
                        opacity: 0,
                      }}
                      transition={{
                        duration: 0.25,
                      }}
                      className="absolute inset-0"
                    >
                      {currentImage && (
                        <Image
                          src={currentImage}
                          alt={`${t(
                            `projects.items.${projectKey}.title`,
                          )} screenshot ${
                            safeActiveImage + 1
                          }`}
                          fill
                          sizes="(max-width: 768px) 100vw, 1100px"
                          className="object-cover"
                        />
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {/* Previous */}
                  {imageCount > 1 && (
                    <button
                      type="button"
                      onClick={previousImage}
                      aria-label={t(
                        "projects.previousImage",
                      )}
                      className="absolute left-4 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white backdrop-blur-md transition hover:bg-black/70"
                    >
                      <ArrowLeft className="size-4" />
                    </button>
                  )}

                  {/* Next */}
                  {imageCount > 1 && (
                    <button
                      type="button"
                      onClick={nextImage}
                      aria-label={t(
                        "projects.nextImage",
                      )}
                      className="absolute right-4 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white backdrop-blur-md transition hover:bg-black/70"
                    >
                      <ArrowRight className="size-4" />
                    </button>
                  )}

                  {/* Counter */}
                  <div className="absolute bottom-4 right-4 rounded-full border border-white/10 bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
                    {safeActiveImage + 1} /{" "}
                    {imageCount}
                  </div>
                </div>
              </div>

              {/* Thumbnails */}
              {imageCount > 1 && (
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {project.images.map(
                    (image, index) => (
                      <button
                        key={`${image}-${index}`}
                        type="button"
                        onClick={() =>
                          setActiveImage(index)
                        }
                        aria-label={`${t(
                          "projects.viewImage",
                        )} ${index + 1}`}
                        className={`relative aspect-video overflow-hidden rounded-xl border transition-all ${
                          safeActiveImage === index
                            ? "border-primary ring-2 ring-primary/20"
                            : "border-border opacity-60 hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`${t(
                            `projects.items.${projectKey}.title`,
                          )} thumbnail ${
                            index + 1
                          }`}
                          fill
                          sizes="(max-width: 768px) 30vw, 300px"
                          className="object-cover"
                        />
                      </button>
                    ),
                  )}
                </div>
              )}

              {/* Information */}
              <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">
                {/* Overview */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    {t("projects.overview")}
                  </p>

                  <h3 className="mt-3 font-heading text-2xl font-bold">
                    {t(
                      `projects.items.${projectKey}.shortDescription`,
                    )}
                  </h3>

                  <p className="mt-4 leading-8 text-muted-foreground">
                    {t(
                      `projects.items.${projectKey}.description`,
                    )}
                  </p>
                </div>

                {/* Technologies */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    {t("projects.technologies")}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.technologies.map(
                      (technology) => (
                        <span
                          key={technology}
                          className="rounded-full border border-border bg-muted/50 px-3 py-1.5 text-xs font-medium"
                        >
                          {technology}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              </div>

              {/* Features */}
              {project.features.length > 0 && (
                <div className="mt-8 border-t border-border pt-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    {t("projects.keyFeatures")}
                  </p>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {project.features.map(
                      (_, index) => (
                        <div
                          key={`${projectKey}-feature-${index}`}
                          className="rounded-xl border border-border bg-card/50 px-4 py-3 text-sm text-muted-foreground"
                        >
                          {t(
                            `projects.items.${projectKey}.features.${index}`,
                          )}
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              {/* Links */}
              <div className="mt-8 flex flex-wrap gap-3 border-t border-border pt-6">
                <a
                  href={project.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5"
                >
                  {t("projects.liveDemo")}

                  <ArrowUpRight className="size-4" />
                </a>

                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-semibold transition-all hover:-translate-y-0.5 hover:bg-muted"
                >
                  <GitBranch className="size-4" />

                  {t("projects.github")}
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}