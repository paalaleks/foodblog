import type { RecipeSummary } from "./content/recipes";

export function filterRecipes(
  recipes: RecipeSummary[],
  query = "",
  category = "all",
) {
  const terms = query
    .trim()
    .toLocaleLowerCase("en")
    .split(/\s+/)
    .filter(Boolean);
  return recipes
    .filter((recipe) => {
      const haystack = [
        recipe.title,
        recipe.description,
        ...recipe.tags,
        ...recipe.ingredients,
      ]
        .join(" ")
        .toLocaleLowerCase("en");
      return (
        (category === "all" || recipe.category === category) &&
        terms.every((term) => haystack.includes(term))
      );
    })
    .sort(
      (a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug),
    );
}
