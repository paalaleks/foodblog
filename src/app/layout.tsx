import type { Metadata } from "next";
import { DM_Sans, Lora } from "next/font/google";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { site } from "@/config/site";
import "./globals.css";

const sans = DM_Sans({ variable: "--font-body", subsets: ["latin"] });
const serif = Lora({ variable: "--font-editorial", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Good food, everyday joy`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  icons: { icon: "/icon.svg" },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.name,
    description: site.description,
    images: [
      {
        url: "/images/recipes/mushroom-pasta.jpg",
        alt: "Mushroom and sage pasta",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${sans.variable} ${serif.variable}`}
    >
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
