"use client";

import { motion , type Variants} from "framer-motion";
import { GitBranch, Mail, MapPin } from "lucide-react";
import { LuLinkedin } from "react-icons/lu";


import { contactContent } from "@/data/contact";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export default function ContactInfo() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        amount: 0.2,
      }}
      className="space-y-4"
    >
      {/* Email */}
      <motion.a
        variants={itemVariants}
        href={`mailto:${contactContent.email}`}
        className="group flex items-center gap-4 rounded-2xl border border-border bg-card/50 p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-card"
      >
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Mail className="size-5" />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Email
          </p>

          <p className="mt-1 truncate font-medium transition-colors group-hover:text-primary">
            {contactContent.email}
          </p>
        </div>
      </motion.a>

      {/* Location */}
      <motion.div
        variants={itemVariants}
        className="flex items-center gap-4 rounded-2xl border border-border bg-card/50 p-5 backdrop-blur-xl"
      >
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <MapPin className="size-5" />
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Location
          </p>

          <p className="mt-1 font-medium">
            {contactContent.location}
          </p>
        </div>
      </motion.div>

      {/* Availability */}
      <motion.div
        variants={itemVariants}
        className="flex items-center gap-4 rounded-2xl border border-border bg-card/50 p-5 backdrop-blur-xl"
      >
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10"
        >
          <span className="size-3 rounded-full bg-emerald-500" />
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Availability
          </p>

          <p className="mt-1 font-medium text-emerald-500">
            {contactContent.availability}
          </p>
        </div>
      </motion.div>

      {/* Social Links */}
      <motion.div
        variants={itemVariants}
        className="flex gap-3 pt-2"
      >
        {/* GitHub */}
        <a
          href={contactContent.socials[0].href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="flex size-11 items-center justify-center rounded-xl border border-border bg-card/50 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
        >
          <GitBranch className="size-5" />
        </a>

        {/* LinkedIn */}
        <a
          href={contactContent.socials[1].href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="flex size-11 items-center justify-center rounded-xl border border-border bg-card/50 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
        >
          <LuLinkedin className="size-5" />
        </a>
      </motion.div>
    </motion.div>
  );
}