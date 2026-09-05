"use client";

import { useSearchParams } from "next/navigation";
import { Search, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
  EmptyContent,
} from "@/components/ui/empty";
import { categories } from "@/config/categories";
import { filterRecipes } from "@/lib/recipe-search";
import type { RecipeSummary } from "@/lib/content/recipes";
import { RecipeGrid } from "./recipe-card";

export function RecipeBrowser({ recipes }: { recipes: RecipeSummary[] }) {
  const params = useSearchParams();
  const query = params.get("q") || "";
  const category = params.get("category") || "all";
  const results = filterRecipes(recipes, query, category);
  const active = Boolean(query || category !== "all");

  function update(key: string, value: string, replace = false) {
    const next = new URLSearchParams(window.location.search);
    if (value && value !== "all") next.set(key, value);
    else next.delete(key);
    const url = `/recipes${next.size ? `?${next}` : ""}`;
    if (replace) window.history.replaceState(null, "", url);
    else window.history.pushState(null, "", url);
  }

  function clear() {
    window.history.pushState(null, "", "/recipes");
  }

  return (
    <div className="recipe-browser">
      <div className="discovery-controls">
        <form
          role="search"
          className="search-form"
          onSubmit={(event) => {
            event.preventDefault();
            document
              .getElementById("results")
              ?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="recipe-search" className="sr-only">
                Search recipes
              </FieldLabel>
              <Input
                id="recipe-search"
                type="search"
                placeholder="A dish, an ingredient, a little inspiration…"
                value={query}
                onChange={(event) => update("q", event.target.value, true)}
              />
            </Field>
          </FieldGroup>
          <Button
            type="submit"
            size="icon-lg"
            aria-label="Go to search results"
          >
            <Search />
          </Button>
        </form>
        <ToggleGroup
          type="single"
          value={category}
          onValueChange={(value) => {
            if (value) update("category", value);
          }}
          aria-label="Filter by category"
          variant="outline"
          size="lg"
          className="category-filters"
        >
          <ToggleGroupItem value="all">All recipes</ToggleGroupItem>
          {categories
            .filter((item) =>
              recipes.some((recipe) => recipe.category === item.slug),
            )
            .map((item) => (
              <ToggleGroupItem value={item.slug} key={item.slug}>
                {item.name}
              </ToggleGroupItem>
            ))}
        </ToggleGroup>
      </div>
      <div className="results-heading" id="results">
        <p role="status" aria-live="polite">
          {results.length} {results.length === 1 ? "recipe" : "recipes"}
          {query.trim() ? ` for “${query.trim()}”` : " to make your own"}
        </p>
        {active && (
          <Button variant="ghost" onClick={clear}>
            <RotateCcw data-icon="inline-start" />
            Clear filters
          </Button>
        )}
      </div>
      {results.length ? (
        <RecipeGrid eager recipes={results} />
      ) : (
        <Empty className="py-20">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Search />
            </EmptyMedia>
            <EmptyTitle>No recipes on this page yet</EmptyTitle>
            <EmptyDescription>
              Try another ingredient or clear your filters to see the whole
              collection.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="outline" onClick={clear}>
              Show all recipes
            </Button>
          </EmptyContent>
        </Empty>
      )}
    </div>
  );
}
