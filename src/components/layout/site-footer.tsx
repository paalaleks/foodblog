import Link from "next/link";
import { Sprout } from "lucide-react";
import { site } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="footer-top">
          <div>
            <Link href="/" className="footer-brand">
              <Sprout aria-hidden="true" />
              {site.name}.
            </Link>
            <p>Simple ingredients. Good company. A little everyday joy.</p>
          </div>
          <nav aria-label="Footer navigation">
            <Link href="/">Home</Link>
            <Link href="/recipes">Recipes</Link>
            <Link href="/about">About</Link>
          </nav>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getUTCFullYear()} {site.name}
          </span>
          <span>
            {site.sampleContent
              ? "First edition · Sample recipe collection"
              : "Made for the everyday cook"}
          </span>
        </div>
      </div>
    </footer>
  );
}
