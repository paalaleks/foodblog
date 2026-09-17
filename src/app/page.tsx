import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Clock3,
  Sprout,
} from "lucide-react";
import { getRecipes, summarizeRecipe } from "@/lib/content/recipes";
import { RecipeGrid } from "@/components/recipes/recipe-card";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default async function Home() {
  const recipes = await getRecipes();
  const featured = recipes.find((recipe) => recipe.featured) || recipes[0];
  return (
    <>
      <section className="home-hero" aria-labelledby="hero-title">
        <div className="shell hero-layout">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="eyebrow-line" />A JOURNAL FOR THE EVERYDAY COOK
            </p>
            <h1 id="hero-title">
              Good food.
              <br />
              <em>Everyday joy.</em>
            </h1>
            <p className="hero-description">
              Seasonal ingredients, simple recipes, and a little inspiration for
              whatever’s on your table.
            </p>
            <Button asChild size="lg">
              <a href="#recipes">
                Browse the recipes
                <ArrowDown data-icon="inline-end" />
              </a>
            </Button>
            <div className="hero-footnote">
              <Sprout aria-hidden="true" />
              <span>Made with care. Meant to be shared.</span>
            </div>
          </div>
          {featured && (
            <div className="hero-visual">
              <div className="hero-image">
                <Image
                  src={featured.image}
                  alt={featured.imageAlt}
                  fill
                  preload
                  sizes="(max-width: 760px) 100vw, 50vw"
                />
              </div>
              <div className="season-stamp" aria-hidden="true">
                <span>GOOD FOOD</span>
                <Sprout strokeWidth={1.2} />
                <span>SIMPLE PLEASURES</span>
              </div>
              <Link href={`/recipes/${featured.slug}`} className="hero-caption">
                <div>
                  <span className="eyebrow">ON THE TABLE TODAY</span>
                  <h2>{featured.title}</h2>
                  {featured.totalMinutes === undefined ? null : (
                    <span className="caption-time">
                      <Clock3 aria-hidden="true" />
                      {featured.totalMinutes} minutes
                    </span>
                  )}
                </div>
                <span className="caption-arrow">
                  <ArrowUpRight aria-hidden="true" />
                </span>
              </Link>
            </div>
          )}
        </div>
      </section>
      <section
        id="recipes"
        className="shell home-recipes"
        aria-labelledby="latest-title"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">FRESH FROM THE JOURNAL</p>
            <h2 id="latest-title">A little inspiration for your table</h2>
            <p>Good things to cook, bake, and come back to.</p>
          </div>
          <Link className="text-link" href="/recipes">
            View all recipes
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>
        {recipes.length ? (
          <RecipeGrid recipes={recipes.slice(0, 6).map(summarizeRecipe)} />
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>The first recipes are on their way</EmptyTitle>
              <EmptyDescription>
                Come back soon for something good to cook.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
        <div className="collection-end">
          <span>A recipe for every kind of day.</span>
          <Button variant="outline" asChild>
            <Link href="/recipes">
              Explore the collection
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
