'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, MessageCircle } from 'lucide-react';

interface IProject {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  price: number;
  techStack: string[];
  liveUrl: string;
  imageUrl: string;
  whatsappMessage: string;
}

export default function WebStorePage() {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Fetch projects
  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch('/api/projects');

        if (!res.ok) {
          throw new Error('Failed to fetch projects');
        }

        const data = await res.json();

        if (data.success && Array.isArray(data.data)) {
          setProjects(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch store projects:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  // Categories
  const categories = [
    'All',
    'E-commerce',
    'SaaS',
    'Portfolio',
    'Landing Page',
    'Agency',
  ];

  // Filter projects
  const filteredProjects =
    selectedCategory === 'All'
      ? projects
      : projects.filter(
          (project) => project.category === selectedCategory
        );

  // WhatsApp order link
  const getWhatsAppLink = (
    projectTitle: string,
    price: number,
    customMessage?: string
  ) => {
    // Replace with your WhatsApp number including country code.
    // Example Bangladesh: 8801XXXXXXXXX (without +)
    const phoneNumber = '8801XXXXXXXXX';

    const message =
      customMessage?.trim() ||
      `Hi, I am interested in buying your website template "${projectTitle}" priced at $${price}. Let's discuss the payment and delivery.`;

    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
  };

  return (
    <div className="min-h-screen bg-gray-950 px-6 py-10 text-white md:py-16">
      <div className="mx-auto max-w-7xl space-y-12">

        {/* Back to Home */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-800 bg-gray-900 px-4 py-2.5 text-sm font-medium text-gray-300 transition-all hover:border-[#824CEA]/50 hover:bg-gray-800 hover:text-white"
          >
            <ArrowLeft size={18} />
            Back to Home
          </Link>
        </div>

        {/* Header Section */}
        <div className="space-y-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold tracking-tight md:text-5xl"
          >
            My Web{' '}
            <span className="text-[#824CEA]">Store</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto max-w-2xl text-sm text-gray-400 md:text-base"
          >
            Explore and buy production-ready, fully responsive
            full-stack website templates built with Next.js,
            TypeScript, and Tailwind CSS.
          </motion.p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                selectedCategory === category
                  ? 'border-[#824CEA] bg-[#824CEA] text-white shadow-lg shadow-[#824CEA]/30'
                  : 'border-gray-800 bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Project Grid */}
        {loading ? (
          <div className="py-20 text-center text-gray-400">
            Loading web store items...
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="py-20 text-center">
            <h2 className="text-xl font-semibold text-white">
              No projects found
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              No projects are available in this category yet.
            </p>

            {selectedCategory !== 'All' && (
              <button
                type="button"
                onClick={() => setSelectedCategory('All')}
                className="mt-5 rounded-xl bg-[#824CEA] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#6d3ee0]"
              >
                View All Projects
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project, index) => (
              <motion.article
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.08, 0.4) }}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#824CEA]/50"
              >
                <div>
                  {/* Project Image */}
                  <div className="relative h-48 overflow-hidden bg-gray-800">
                    <img
                      src={project.imageUrl || '/images/project-placeholder.png'}
                      alt={project.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    <span className="absolute right-3 top-3 rounded-full border border-[#824CEA]/30 bg-gray-950/80 px-3 py-1 text-xs font-semibold text-[#a98af5] backdrop-blur-md">
                      {project.category}
                    </span>
                  </div>

                  {/* Project Details */}
                  <div className="space-y-3 p-6">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-xl font-bold text-white transition-colors group-hover:text-[#a98af5]">
                        {project.title}
                      </h2>

                      <span className="shrink-0 text-lg font-bold text-[#a98af5]">
                        ${project.price}
                      </span>
                    </div>

                    <p className="line-clamp-3 text-sm leading-6 text-gray-400">
                      {project.description}
                    </p>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {project.techStack?.map((tech, techIndex) => (
                        <span
                          key={`${tech}-${techIndex}`}
                          className="rounded-md border border-gray-700/50 bg-gray-800 px-2.5 py-1 text-[11px] text-gray-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 p-6 pt-0">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-700 bg-gray-800 py-2.5 text-center text-sm font-semibold text-gray-200 transition hover:bg-gray-700"
                  >
                    <ExternalLink size={16} />
                    Preview
                  </a>

                  <a
                    href={getWhatsAppLink(
                      project.title,
                      project.price,
                      project.whatsappMessage
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#824CEA] py-2.5 text-center text-sm font-semibold text-white shadow-lg shadow-[#824CEA]/20 transition hover:bg-[#6d3ee0]"
                  >
                    <MessageCircle size={16} />
                    Buy Now
                  </a>
                </div>
              </motion.article>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
