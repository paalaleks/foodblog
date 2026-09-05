import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { categories, getCategory } from "@/config/categories";
import { getRecipes, summarizeRecipe } from "@/lib/content/recipes";
import { RecipeGrid } from "@/components/recipes/recipe-card";

type Props = { params: Promise<{ category: string }> };
export async function generateStaticParams() {
  const recipes = await getRecipes();
  return categories
    .filter((category) =>
      recipes.some((recipe) => recipe.category === category.slug),
    )
    .map((category) => ({ category: category.slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = getCategory((await params).category);
  if (!category) notFound();
  return {
    title: `${category.name} recipes`,
    description: category.description,
    alternates: { canonical: `/recipes/category/${category.slug}` },
  };
}
export default async function CategoryPage({ params }: Props) {
  const category = getCategory((await params).category);
  if (!category) notFound();
  const recipes = (await getRecipes()).filter(
    (recipe) => recipe.category === category.slug,
  );
  if (!recipes.length) notFound();
  return (
    <div className="shell page-section">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/recipes">Recipes</Link>
        <span>/</span>
        <span aria-current="page">{category.name}</span>
      </nav>
      <header className="page-intro">
        <p className="eyebrow">SOMETHING FOR EVERY TABLE</p>
        <h1>{category.name}</h1>
        <p>{category.description}</p>
      </header>
      <div className="results-heading">
        <p>
          {recipes.length} {recipes.length === 1 ? "recipe" : "recipes"}
        </p>
        <Link className="text-link" href="/recipes">
          <ArrowLeft aria-hidden="true" />
          All recipes
        </Link>
      </div>
      <RecipeGrid eager recipes={recipes.map(summarizeRecipe)} />
    </div>
  );
}
