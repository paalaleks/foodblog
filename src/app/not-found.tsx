import Link from "next/link";
import { ArrowRight, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="shell not-found">
      <Sprout aria-hidden="true" />
      <p className="eyebrow">404 · A LITTLE DETOUR</p>
      <h1>
        This page isn’t
        <br />
        on the menu.
      </h1>
      <p>Let’s find you something good to cook instead.</p>
      <Button asChild>
        <Link href="/recipes">
          Back to the recipes
          <ArrowRight data-icon="inline-end" />
        </Link>
      </Button>
    </div>
  );
}
