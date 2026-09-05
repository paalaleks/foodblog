import type { Metadata } from "next";
import { Suspense } from "react";
import { getRecipes, summarizeRecipe } from "@/lib/content/recipes";
import { RecipeBrowser } from "@/components/recipes/recipe-browser";
import { RecipeGrid } from "@/components/recipes/recipe-card";

export const metadata: Metadata = {
  title: "Recipes",
  description:
    "Find your next favourite recipe. Browse breakfast, mains, sides, and something sweet.",
  alternates: { canonical: "/recipes" },
};

export default async function RecipesPage() {
  const recipes = (await getRecipes()).map(summarizeRecipe);
  return (
    <div className="shell page-section">
      <header className="page-intro">
        <p className="eyebrow">THE RECIPE COLLECTION</p>
        <h1>What sounds good?</h1>
        <p>
          Something simple. Something seasonal. Something you’ll make again.
        </p>
      </header>
      <Suspense fallback={<RecipeGrid eager recipes={recipes} />}>
        <RecipeBrowser recipes={recipes} />
      </Suspense>
    </div>
  );
}
