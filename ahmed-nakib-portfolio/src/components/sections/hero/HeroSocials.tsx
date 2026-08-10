import Link from "next/link";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { Mail } from "lucide-react";

const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/nakib-code/",
    icon: FaGithub,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/nakibul/",
    icon: FaLinkedinIn,
  },
  {
    label: "Email",
    href: "office.nakib@gmail.com",
    icon: Mail,
  },
];

export default function HeroSocials() {
  return (
    <div className="flex items-center gap-3">
      {socialLinks.map((social) => {
        const Icon = social.icon;

        return (
          <Link
            key={social.label}
            href={social.href}
            target={social.label === "Email" ? undefined : "_blank"}
            rel={social.label === "Email" ? undefined : "noreferrer"}
            aria-label={social.label}
            className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-background/50 text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent hover:text-foreground"
          >
            <Icon className="size-4" />
          </Link>
        );
      })}
    </div>
  );
}