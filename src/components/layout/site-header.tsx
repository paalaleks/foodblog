import Link from "next/link";
import { Search, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileNav } from "./mobile-nav";
import { site } from "@/config/site";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link href="/" className="brand" aria-label={`${site.name} — Home`}>
          <Sprout aria-hidden="true" strokeWidth={1.4} />
          <span>
            {site.name}
            <span className="brand-dot">.</span>
          </span>
        </Link>
        <nav aria-label="Main navigation" className="desktop-nav">
          <Link href="/recipes">Recipes</Link>
          <Link href="/about">About the journal</Link>
          <Button variant="outline" asChild>
            <Link href="/recipes">
              <Search data-icon="inline-start" />
              Find a recipe
            </Link>
          </Button>
        </nav>
        <MobileNav siteName={site.name} />
      </div>
    </header>
  );
}
