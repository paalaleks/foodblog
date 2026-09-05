import type { Recipe } from "./content/recipes";
import { absoluteUrl, site } from "@/config/site";
import { getCategory } from "@/config/categories";

export function recipeStructuredData(recipe: Recipe) {
  return {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.title,
    description: recipe.description,
    image: [absoluteUrl(recipe.image)],
    author: { "@type": "Organization", name: site.author },
    datePublished: recipe.date,
    dateModified: recipe.updated || recipe.date,
    prepTime: `PT${recipe.prepMinutes}M`,
    cookTime: `PT${recipe.cookMinutes}M`,
    totalTime: `PT${recipe.totalMinutes}M`,
    recipeYield: `${recipe.servings} servings`,
    recipeCategory: getCategory(recipe.category)?.name,
    keywords: recipe.tags.join(", "),
    recipeIngredient: recipe.ingredients,
    recipeInstructions: recipe.steps.map((step, index) => ({
      "@type": "HowToStep",
      text: step.text,
      url: absoluteUrl(`/recipes/${recipe.slug}#step-${index + 1}`),
    })),
    mainEntityOfPage: absoluteUrl(`/recipes/${recipe.slug}`),
  };
}

export const serializeJsonLd = (data: unknown) =>
  JSON.stringify(data).replace(/</g, "\\u003c");
