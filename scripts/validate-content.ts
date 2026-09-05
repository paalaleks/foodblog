import { loadRecipes } from "../src/lib/content/recipes";
import { getAboutPage } from "../src/lib/content/pages";

const [recipes] = await Promise.all([loadRecipes(), getAboutPage()]);
console.log(
  `Content valid: ${recipes.filter((recipe) => !recipe.draft).length} published recipes, ${recipes.filter((recipe) => recipe.draft).length} drafts, and the About page.`,
);
