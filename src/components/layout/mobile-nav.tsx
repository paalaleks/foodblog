"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";

export function MobileNav({ siteName }: { siteName: string }) {
  return (
    <div className="mobile-nav">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon-lg" aria-label="Open menu">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{siteName}</SheetTitle>
            <SheetDescription>
              A little inspiration for your table.
            </SheetDescription>
          </SheetHeader>
          <nav aria-label="Mobile navigation" className="mobile-links">
            {[
              { href: "/", title: "Home" },
              { href: "/recipes", title: "Recipes" },
              { href: "/about", title: "About the journal" },
            ].map((link) => (
              <SheetClose asChild key={link.href}>
                <Link href={link.href}>{link.title}</Link>
              </SheetClose>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
