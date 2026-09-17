import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Clock3 } from "lucide-react";
import type { RecipeSummary } from "@/lib/content/recipes";
import { getCategory } from "@/config/categories";

export function RecipeCard({
  recipe,
  eager = false,
}: {
  recipe: RecipeSummary;
  eager?: boolean;
}) {
  const category = recipe.category
    ? getCategory(recipe.category)
    : undefined;
  const hasMeta = category || recipe.totalMinutes !== undefined;

  return (
    <article className="recipe-card" data-testid="recipe-card">
      <Link
        href={`/recipes/${recipe.slug}`}
        className="recipe-card-image"
        aria-label={`View ${recipe.title}`}
        tabIndex={-1}
      >
        <Image
          src={recipe.image}
          alt={recipe.imageAlt}
          fill
          loading={eager ? "eager" : "lazy"}
          sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 33vw"
        />
        <span className="image-arrow" aria-hidden="true">
          <ArrowUpRight />
        </span>
      </Link>
      {hasMeta ? (
        <div className="recipe-card-meta">
          {category ? (
            <Link href={`/recipes/category/${category.slug}`}>
              {category.name}
            </Link>
          ) : null}
          {recipe.totalMinutes === undefined ? null : (
            <span>
              <Clock3 aria-hidden="true" />
              {recipe.totalMinutes} min
            </span>
          )}
        </div>
      ) : null}
      <h3>
        <Link href={`/recipes/${recipe.slug}`}>{recipe.title}</Link>
      </h3>
      <p>{recipe.description}</p>
    </article>
  );
}

export function RecipeGrid({
  recipes,
  eager = false,
}: {
  recipes: RecipeSummary[];
  eager?: boolean;
}) {
  return (
    <div className="recipe-grid">
      {recipes.map((recipe, index) => (
        <RecipeCard
          key={recipe.slug}
          recipe={recipe}
          eager={eager && index < 3}
        />
      ))}
    </div>
  );
}
