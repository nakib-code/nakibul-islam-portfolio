import type { Metadata } from "next";
import "./globals.css";
import {
  Inter,
  Space_Grotesk,
  Noto_Sans_Bengali,
} from "next/font/google";

import ThemeProvider from "@/components/providers/ThemeProvider";
import ScrollProgress from "@/components/shared/ScrollProgress";
import BackToTop from "@/components/shared/BackToTop";
import I18nProvider from "@/providers/I18nProvider";
import DeveloperSignalField from "@/components/background/DeveloperSignalField";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  variable: "--font-bengali",
  display: "swap",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",

  name: "Nakibul Islam",

  url: "https://your-domain.com",

  image: "https://your-domain.com/images/profile.png",

  jobTitle: "Full Stack Developer",

  description:
    "Full Stack Developer specializing in Next.js, React, TypeScript, Node.js, PostgreSQL and MongoDB.",

  sameAs: [
    "https://github.com/nakib-code",
    "https://www.linkedin.com/in/nakibul/",
  ],

  knowsAbout: [
    "Next.js",
    "React",
    "TypeScript",
    "Node.js",
    "Express.js",
    "PostgreSQL",
    "MongoDB",
    "Tailwind CSS",
  ],
};

export const metadata: Metadata = {
  title: {
    default: "Nakibul Islam | Full Stack Developer",
    template: "%s | Nakibul Islam",
  },

  description:
    "Full Stack Developer specializing in Next.js, React, TypeScript, Node.js, PostgreSQL and MongoDB. Building modern, scalable web applications.",

  keywords: [
    "Nakibul Islam",
    "Full Stack Developer",
    "Next.js",
    "React",
    "TypeScript",
    "Node.js",
    "MongoDB",
    "PostgreSQL",
    "Portfolio",
  ],

  authors: [
    {
      name: "Nakibul Islam",
    },
  ],

  creator: "Nakibul Islam",

  metadataBase: new URL("https://your-domain.com"),

  openGraph: {
    title: "Nakibul Islam | Full Stack Developer",

    description:
      "Modern Full Stack Developer Portfolio built with Next.js.",

    url: "https://your-domain.com",

    siteName: "Nakibul Islam Portfolio",

    locale: "en_US",

    type: "website",

    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Nakibul Islam Portfolio",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "Nakibul Islam | Full Stack Developer",

    description:
      "Modern Full Stack Developer Portfolio built with Next.js.",

    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} ${notoSansBengali.variable}`}
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />

        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {/* Global developer signal background */}
          <div className="pointer-events-none fixed inset-0 z-0">
            <DeveloperSignalField />
          </div>

          <ScrollProgress />

          <I18nProvider>
            <div className="relative z-10">
              {children}
            </div>
          </I18nProvider>

          <BackToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}