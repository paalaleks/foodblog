import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowDown, Clock3, Utensils } from "lucide-react";
import { getRecipe, getRecipes, summarizeRecipe } from "@/lib/content/recipes";
import { getCategory } from "@/config/categories";
import { site, absoluteUrl } from "@/config/site";
import { recipeStructuredData, serializeJsonLd } from "@/lib/recipe-seo";
import { RecipeBody } from "@/components/recipes/recipe-body";
import { RecipeGrid } from "@/components/recipes/recipe-card";
import { PrintButton } from "@/components/recipes/print-button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Props = { params: Promise<{ slug: string }> };
export async function generateStaticParams() {
  return (await getRecipes()).map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const recipe = await getRecipe((await params).slug);
  if (!recipe) notFound();
  return {
    title: recipe.title,
    description: recipe.description,
    alternates: { canonical: `/recipes/${recipe.slug}` },
    openGraph: {
      title: recipe.title,
      description: recipe.description,
      type: "article",
      publishedTime: recipe.date,
      modifiedTime: recipe.updated || recipe.date,
      url: absoluteUrl(`/recipes/${recipe.slug}`),
      images: [{ url: recipe.image, alt: recipe.imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: recipe.title,
      description: recipe.description,
      images: [recipe.image],
    },
  };
}
export default async function RecipePage({ params }: Props) {
  const recipe = await getRecipe((await params).slug);
  if (!recipe) notFound();
  const category = getCategory(recipe.category)!;
  const others = (await getRecipes()).filter(
    (item) => item.slug !== recipe.slug,
  );
  const related = [
    ...others.filter((item) => item.category === recipe.category),
    ...others.filter((item) => item.category !== recipe.category),
  ].slice(0, 3);
  return (
    <div className="shell recipe-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(recipeStructuredData(recipe)),
        }}
      />
      <nav className="breadcrumbs no-print" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/recipes">Recipes</Link>
        <span>/</span>
        <Link href={`/recipes/category/${category.slug}`}>{category.name}</Link>
        <span>/</span>
        <span aria-current="page">{recipe.title}</span>
      </nav>
      <article>
        <header className="recipe-intro">
          <div className="recipe-intro-meta">
            <Link
              className="eyebrow"
              href={`/recipes/category/${category.slug}`}
            >
              {category.name}
            </Link>
            {site.sampleContent && (
              <Badge variant="outline">Sample recipe</Badge>
            )}
          </div>
          <h1>{recipe.title}</h1>
          <p className="recipe-description">{recipe.description}</p>
          <p className="byline">
            From {site.author}
            <span>·</span>
            <time dateTime={recipe.date}>
              {new Intl.DateTimeFormat("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
                timeZone: "UTC",
              }).format(new Date(recipe.date))}
            </time>
            {recipe.updated && <span>Updated {recipe.updated}</span>}
          </p>
          <div className="recipe-facts">
            <span>
              <Clock3 aria-hidden="true" />
              {recipe.totalMinutes} min total
            </span>
            <span>{recipe.prepMinutes} min prep</span>
            <span>{recipe.cookMinutes} min cook</span>
            {recipe.restMinutes > 0 && (
              <span>{recipe.restMinutes} min rest</span>
            )}
            <span>
              <Utensils aria-hidden="true" />
              Serves {recipe.servings}
            </span>
          </div>
          <div className="recipe-actions no-print">
            <Button asChild>
              <a href="#recipe">
                Jump to recipe
                <ArrowDown data-icon="inline-end" />
              </a>
            </Button>
            <PrintButton />
          </div>
          <p className="print-source">
            {absoluteUrl(`/recipes/${recipe.slug}`)}
          </p>
        </header>
        <figure className="recipe-hero no-print">
          <div className="recipe-hero-image">
            <Image
              src={recipe.image}
              alt={recipe.imageAlt}
              fill
              preload
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
          </div>
          {recipe.imageAttribution ? (
            <figcaption className="recipe-image-attribution">
              {recipe.imageAttribution}
            </figcaption>
          ) : null}
        </figure>
        <RecipeBody recipe={recipe} />
        {site.sampleContent && (
          <p className="sample-note">
            Part of our sample collection. This recipe has not yet been
            kitchen-tested; photography is illustrative.
          </p>
        )}
      </article>
      {related.length > 0 && (
        <section className="related-recipes no-print">
          <div className="section-heading">
            <div>
              <p className="eyebrow">KEEP THE INSPIRATION GOING</p>
              <h2>More for your table</h2>
            </div>
          </div>
          <RecipeGrid recipes={related.map(summarizeRecipe)} />
        </section>
      )}
    </div>
  );
}
