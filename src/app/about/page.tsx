import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAboutPage } from "@/lib/content/pages";
import { getRecipes } from "@/lib/content/recipes";
import { Markdown } from "@/components/content/markdown";
import { Button } from "@/components/ui/button";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getAboutPage();
  return {
    title: "About the journal",
    description: page.description,
    alternates: { canonical: "/about" },
  };
}
export default async function AboutPage() {
  const [page, recipes] = await Promise.all([getAboutPage(), getRecipes()]);
  const image =
    recipes.find((recipe) => recipe.category === "sides") || recipes[0];
  return (
    <div className="shell page-section about-page">
      <header className="page-intro">
        <p className="eyebrow">ABOUT THE JOURNAL</p>
        <h1>{page.title}</h1>
      </header>
      <div className="about-columns">
        {image && (
          <div className="about-image">
            <Image
              src={image.image}
              alt={image.imageAlt}
              fill
              sizes="(max-width: 760px) 100vw, 45vw"
            />
          </div>
        )}
        <div>
          <Markdown>{page.content}</Markdown>
          <Button asChild>
            <Link href="/recipes">
              Explore the recipes
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
