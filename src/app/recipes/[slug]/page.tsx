import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowDown, Clock3, Utensils } from "lucide-react";
import {
  getRecipe,
  getRecipes,
  summarizeRecipe,
  type Recipe,
} from "@/lib/content/recipes";
import { getCategory } from "@/config/categories";
import { site, absoluteUrl } from "@/config/site";
import { recipeStructuredData, serializeJsonLd } from "@/lib/recipe-seo";
import { RecipeBody } from "@/components/recipes/recipe-body";
import { RecipeGrid } from "@/components/recipes/recipe-card";
import { PrintButton } from "@/components/recipes/print-button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Props = { params: Promise<{ slug: string }> };
type RecipeCategory = NonNullable<ReturnType<typeof getCategory>>;

function CategoryBreadcrumb({ category }: { category?: RecipeCategory }) {
  if (!category) return null;
  return (
    <>
      <span>/</span>
      <Link href={`/recipes/category/${category.slug}`}>{category.name}</Link>
    </>
  );
}

function CategoryEyebrow({ category }: { category?: RecipeCategory }) {
  if (!category) return null;
  return (
    <Link className="eyebrow" href={`/recipes/category/${category.slug}`}>
      {category.name}
    </Link>
  );
}

function RecipeByline({ recipe }: { recipe: Recipe }) {
  return (
    <p className="byline">
      From {site.author}
      {recipe.date ? (
        <>
          <span>·</span>
          <time dateTime={recipe.date}>
            {new Intl.DateTimeFormat("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
              timeZone: "UTC",
            }).format(new Date(recipe.date))}
          </time>
        </>
      ) : null}
      {recipe.updated ? <span>Updated {recipe.updated}</span> : null}
    </p>
  );
}

type RecipeFact = Readonly<{
  label: string;
  icon?: "clock" | "servings";
}>;

function optionalFact(
  value: number | undefined,
  suffix: string,
  icon?: RecipeFact["icon"],
): RecipeFact | undefined {
  return value === undefined ? undefined : { label: `${value} ${suffix}`, icon };
}

function positiveFact(value: number, suffix: string): RecipeFact | undefined {
  return value > 0 ? { label: `${value} ${suffix}` } : undefined;
}

function RecipeFacts({ recipe }: { recipe: Recipe }) {
  const facts = [
    optionalFact(recipe.totalMinutes, "min total", "clock"),
    optionalFact(recipe.prepMinutes, "min prep"),
    optionalFact(recipe.cookMinutes, "min cook"),
    positiveFact(recipe.restMinutes, "min rest"),
    optionalFact(recipe.servings, "servings", "servings"),
  ].filter((fact): fact is RecipeFact => fact !== undefined);
  if (facts.length === 0) return null;
  return (
    <div className="recipe-facts">
      {facts.map((fact) => (
        <span key={fact.label}>
          {fact.icon === "clock" ? <Clock3 aria-hidden="true" /> : null}
          {fact.icon === "servings" ? <Utensils aria-hidden="true" /> : null}
          {fact.label}
        </span>
      ))}
    </div>
  );
}

function RecipeHero({ recipe }: { recipe: Recipe }) {
  return (
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
  );
}

function RecipeIntro({
  recipe,
  category,
}: {
  recipe: Recipe;
  category?: RecipeCategory;
}) {
  return (
    <header className="recipe-intro">
      <div className="recipe-intro-meta">
        <CategoryEyebrow category={category} />
        {site.sampleContent ? <Badge variant="outline">Sample recipe</Badge> : null}
      </div>
      <h1>{recipe.title}</h1>
      <p className="recipe-description">{recipe.description}</p>
      <RecipeByline recipe={recipe} />
      <RecipeFacts recipe={recipe} />
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
  );
}

function relatedRecipes(
  recipe: Recipe,
  category: RecipeCategory | undefined,
  recipes: Recipe[],
) {
  const others = recipes.filter((item) => item.slug !== recipe.slug);
  if (!category) return others.slice(0, 3);
  return [
    ...others.filter((item) => item.category === category.slug),
    ...others.filter((item) => item.category !== category.slug),
  ].slice(0, 3);
}

function RelatedRecipes({ recipes }: { recipes: Recipe[] }) {
  if (recipes.length === 0) return null;
  return (
    <section className="related-recipes no-print">
      <div className="section-heading">
        <div>
          <p className="eyebrow">KEEP THE INSPIRATION GOING</p>
          <h2>More for your table</h2>
        </div>
      </div>
      <RecipeGrid recipes={recipes.map(summarizeRecipe)} />
    </section>
  );
}

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
      ...(recipe.date ? { publishedTime: recipe.date } : {}),
      ...(recipe.updated || recipe.date
        ? { modifiedTime: recipe.updated || recipe.date }
        : {}),
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
  const category = recipe.category
    ? getCategory(recipe.category)
    : undefined;
  const related = relatedRecipes(recipe, category, await getRecipes());
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
        <CategoryBreadcrumb category={category} />
        <span>/</span>
        <span aria-current="page">{recipe.title}</span>
      </nav>
      <article>
        <RecipeIntro recipe={recipe} category={category} />
        <RecipeHero recipe={recipe} />
        <RecipeBody recipe={recipe} />
        {site.sampleContent && (
          <p className="sample-note">
            Part of our sample collection. This recipe has not yet been
            kitchen-tested; photography is illustrative.
          </p>
        )}
      </article>
      <RelatedRecipes recipes={related} />
    </div>
  );
}
