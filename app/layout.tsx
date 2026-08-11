import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;

  return {
    title: "Trading Academy — Learn markets by doing",
    description: "A complete interactive trading course for Indian markets, from foundations to systematic trading.",
    openGraph: {
      title: "Trading Academy — Learn markets by doing",
      description: "Learn NIFTY, options, risk, OI and systematic trading through interactive decisions and simulations.",
      type: "website",
      images: [{ url: `${origin}/og-v2.png`, width: 1200, height: 630, alt: "Trading Academy interactive Indian-market education" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Trading Academy — Learn markets by doing",
      description: "A complete interactive trading school for Indian markets.",
      images: [`${origin}/og-v2.png`],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body></html>;
}
