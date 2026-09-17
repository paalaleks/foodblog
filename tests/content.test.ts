import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import matter from "gray-matter";
import {
  getRecipes,
  parseRecipe,
  loadRecipes,
} from "../src/lib/content/recipes";
import { parseRecipeBody } from "../src/lib/content/markdown";
import { recipeStructuredData, serializeJsonLd } from "../src/lib/recipe-seo";

const source = await fs.readFile(
  "content/recipes/mushroom-sage-pasta.md",
  "utf8",
);
const { data, content } = matter(source);
const changed = (fields: Record<string, unknown>) =>
  matter.stringify(content, { ...data, ...fields });

test("all recipes validate and derive total times and structured data from Markdown", async () => {
  const recipes = await loadRecipes();
  assert.ok(recipes.length >= 6);
  for (const recipe of recipes) {
    assert.notEqual(recipe.prepMinutes, undefined);
    assert.notEqual(recipe.cookMinutes, undefined);
    if (recipe.prepMinutes === undefined || recipe.cookMinutes === undefined) {
      throw new Error("Sample recipes include preparation and cooking times.");
    }
    assert.equal(
      recipe.totalMinutes,
      recipe.prepMinutes + recipe.cookMinutes + recipe.restMinutes,
    );
    const json = recipeStructuredData(recipe);
    assert.deepEqual(json.recipeIngredient, recipe.ingredients);
    assert.deepEqual(
      json.recipeInstructions.map((step) => step.text),
      recipe.steps.map((step) => step.text),
    );
  }
});

test("plain Markdown formatting and multi-paragraph steps survive extraction", () => {
  const body = parseRecipeBody(
    "A **simple** intro.\n\n## Ingredients\n\n- 1 lemon\n\n## Method\n\n1. **Slice** the lemon.\n\n   Keep the juice.\n\n## Notes\n\nServe *fresh*.",
  );
  assert.match(body.introduction, /\*\*simple\*\*/);
  assert.match(body.steps[0].markdown, /\*\*Slice\*\*/);
  assert.match(body.steps[0].markdown, /Keep the juice/);
  assert.match(body.notes, /\*fresh\*/);
});

test("publication media retains its supplied image attribution", async () => {
  const recipe = await parseRecipe(
    changed({
      image: "https://foodblog-pi.vercel.app/publication-media/example.png",
      imageAttribution: "Photo supplied by the recipe author.",
    }),
    "published-recipe.md",
  );

  assert.equal(recipe.imageAttribution, "Photo supplied by the recipe author.");
  assert.equal(
    recipe.image,
    "https://foodblog-pi.vercel.app/publication-media/example.png",
  );
});

test("description and image are the only required recipe frontmatter", async () => {
  const recipe = await parseRecipe(
    matter.stringify(content, {
      description: "A flexible supper assembled from the supplied recipe.",
      image: data.image,
    }),
    "flexible-supper.md",
  );

  assert.equal(recipe.title, "Flexible supper");
  assert.equal(recipe.imageAlt, recipe.description);
  assert.equal(recipe.date, undefined);
  assert.equal(recipe.category, undefined);
  assert.equal(recipe.prepMinutes, undefined);
  assert.equal(recipe.cookMinutes, undefined);
  assert.equal(recipe.totalMinutes, undefined);
  assert.equal(recipe.servings, undefined);
  assert.equal(recipe.draft, false);

  const json = recipeStructuredData(recipe);
  for (const field of [
    "datePublished",
    "dateModified",
    "prepTime",
    "cookTime",
    "totalTime",
    "recipeYield",
    "recipeCategory",
  ]) {
    assert.equal(Object.hasOwn(json, field), false, field);
  }
});

for (const [label, fields] of [
  ["blank title", { title: "" }],
  ["impossible calendar date", { date: "2026-02-30" }],
  ["unknown category", { category: "unknown" }],
  ["negative time", { cookMinutes: -2 }],
  ["fractional servings", { servings: 1.5 }],
  ["unsafe image path", { image: "/images/recipes/../../secret.jpg" }],
  ["missing image", { image: "/images/recipes/missing-image.jpg" }],
  ["update predates publication", { updated: "2020-01-01" }],
  ["unknown frontmatter field", { servigns: 2 }],
] as const) {
  test(`rejects ${label} with source filename`, async () => {
    await assert.rejects(
      parseRecipe(changed(fields), "example.md"),
      /example\.md:/,
    );
  });
}

test("future publication requires a draft and unsafe slugs cannot become paths", async () => {
  await assert.rejects(
    parseRecipe(changed({ date: "2099-01-01" }), "future.md"),
    /future/,
  );
  const draft = await parseRecipe(
    changed({ date: "2099-01-01", draft: true }),
    "future.md",
  );
  assert.equal(draft.draft, true);
  await assert.rejects(parseRecipe(source, "../escape.md"), /Filename/);
});

test("rejects missing, duplicated, misordered, or malformed recipe sections", () => {
  for (const body of [
    "## Method\n\n1. Mix.",
    "## Method\n\n1. Mix.\n\n## Ingredients\n\n- Flour",
    "## Ingredients\n\n- Flour\n\n## Ingredients\n\n- Flour\n\n## Method\n\n1. Mix.",
    "## Ingredients\n\nFlour\n\n## Method\n\n1. Mix.",
    "## Ingredients\n\n- Flour\n  - Nested\n\n## Method\n\n1. Mix.",
    "<script>alert(1)</script>\n\n## Ingredients\n\n- Flour\n\n## Method\n\n1. Mix.",
  ])
    assert.throws(() => parseRecipeBody(body));
});

test("published collection excludes real draft files and discovers a new Markdown file", async (context) => {
  const directory = await fs.mkdtemp(
    path.join(os.tmpdir(), "recipe-journal-test-"),
  );
  context.after(async () => {
    const resolved = path.resolve(directory);
    assert.equal(path.dirname(resolved), path.resolve(os.tmpdir()));
    assert.ok(path.basename(resolved).startsWith("recipe-journal-test-"));
    await fs.rm(resolved, { recursive: true, force: true });
  });
  await fs.writeFile(path.join(directory, "new-recipe.md"), source);
  await fs.writeFile(
    path.join(directory, "draft-recipe.md"),
    changed({ draft: true }),
  );
  const recipes = await getRecipes(directory);
  assert.deepEqual(
    recipes.map((recipe) => recipe.slug),
    ["new-recipe"],
  );
});

test("JSON-LD cannot close its enclosing script", () => {
  const malicious = { title: "</script><script>alert(1)</script>" };
  assert.equal(serializeJsonLd(malicious).includes("<"), false);
  assert.deepEqual(JSON.parse(serializeJsonLd(malicious)), malicious);
});
