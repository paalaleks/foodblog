import { test } from "node:test";
import assert from "node:assert/strict";
import { filterRecipes } from "../src/lib/recipe-search";
import { getRecipes, summarizeRecipe } from "../src/lib/content/recipes";

const recipes = (await getRecipes()).map(summarizeRecipe);

test("search normalizes whitespace and case and matches ingredients", () => {
  assert.deepEqual(
    filterRecipes(recipes, "  TAGLIATELLE  ").map((recipe) => recipe.slug),
    ["mushroom-sage-pasta"],
  );
  assert.deepEqual(
    filterRecipes(recipes, "bicarbonate").map((recipe) => recipe.slug),
    ["chocolate-chunk-cookies"],
  );
});

test("category and all query terms must match together", () => {
  assert.equal(filterRecipes(recipes, "egg", "breakfast").length, 2);
  assert.equal(filterRecipes(recipes, "chocolate", "breakfast").length, 0);
  assert.equal(filterRecipes(recipes, "avocado egg", "breakfast").length, 2);
  assert.equal(filterRecipes(recipes, "", "unknown").length, 0);
});

test("stable ordering and clearing filters preserve the collection", () => {
  const reversed = [...recipes].reverse();
  assert.deepEqual(filterRecipes(reversed), recipes);
  assert.equal(reversed[0].slug, recipes.at(-1)?.slug);
  const sameDate = [recipes[0], { ...recipes[1], date: recipes[0].date }];
  assert.deepEqual(
    filterRecipes(sameDate).map((recipe) => recipe.slug),
    sameDate.map((recipe) => recipe.slug).sort(),
  );
});
