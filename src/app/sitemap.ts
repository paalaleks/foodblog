import type { MetadataRoute } from "next";
import { getRecipes } from "@/lib/content/recipes";
import { categories } from "@/config/categories";
import { absoluteUrl } from "@/config/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const recipes = await getRecipes();
  return [
    ...["/", "/recipes", "/about"].map((url) => ({ url: absoluteUrl(url) })),
    ...categories
      .filter((category) =>
        recipes.some((recipe) => recipe.category === category.slug),
      )
      .map((category) => ({
        url: absoluteUrl(`/recipes/category/${category.slug}`),
      })),
    ...recipes.map((recipe) => ({
      url: absoluteUrl(`/recipes/${recipe.slug}`),
      lastModified: recipe.updated || recipe.date,
    })),
  ];
}
