import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { cache } from "react";
import { recipeSchema, type RecipeMetadata } from "./schema";
import { parseRecipeBody } from "./markdown";

export type Recipe = Omit<RecipeMetadata, "title" | "imageAlt"> &
  ReturnType<typeof parseRecipeBody> & {
    slug: string;
    title: string;
    imageAlt: string;
    totalMinutes?: number;
  };
export type RecipeSummary = Pick<
  Recipe,
  | "slug"
  | "title"
  | "description"
  | "date"
  | "category"
  | "tags"
  | "image"
  | "imageAlt"
  | "totalMinutes"
  | "ingredients"
>;

export async function parseRecipe(
  source: string,
  filename: string,
  publicDirectory = path.join(process.cwd(), "public"),
  today = new Date().toISOString().slice(0, 10),
): Promise<Recipe> {
  try {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*\.md$/.test(filename))
      throw new Error(
        "Filename must be a lowercase, hyphenated slug ending in .md",
      );
    const { data, content } = matter(source);
    const metadata = recipeSchema.parse(data);
    if (!metadata.draft && metadata.date && metadata.date > today)
      throw new Error(
        "Published date cannot be in the future; use draft: true",
      );
    if (metadata.image.startsWith("/")) {
      const imagePath = path.join(publicDirectory, metadata.image.slice(1));
      const imageStat = await fs.lstat(imagePath).catch(() => null);
      if (!imageStat?.isFile() || imageStat.isSymbolicLink())
        throw new Error(
          `Image does not exist as a local file: ${metadata.image}`,
        );
    }
    const slug = filename.slice(0, -3);
    const totalMinutes =
      metadata.prepMinutes !== undefined && metadata.cookMinutes !== undefined
        ? metadata.prepMinutes + metadata.cookMinutes + metadata.restMinutes
        : undefined;
    return {
      ...metadata,
      ...parseRecipeBody(content),
      slug,
      title:
        metadata.title ??
        `${slug.charAt(0).toUpperCase()}${slug.slice(1).replaceAll("-", " ")}`,
      imageAlt: metadata.imageAlt ?? metadata.description,
      ...(totalMinutes === undefined ? {} : { totalMinutes }),
    };
  } catch (error) {
    throw new Error(
      `${filename}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

export async function loadRecipes(
  directory = path.join(process.cwd(), "content/recipes"),
  publicDirectory = path.join(process.cwd(), "public"),
) {
  const files = (await fs.readdir(directory, { withFileTypes: true })).filter(
    (file) => file.isFile() && file.name.endsWith(".md"),
  );
  const recipes = await Promise.all(
    files.map(async (file) =>
      parseRecipe(
        await fs.readFile(path.join(directory, file.name), "utf8"),
        file.name,
        publicDirectory,
      ),
    ),
  );
  return recipes.sort(
    (a, b) =>
      (b.date ?? "").localeCompare(a.date ?? "") ||
      a.slug.localeCompare(b.slug),
  );
}

export const getRecipes = cache(
  async (directory?: string, publicDirectory?: string) =>
    (await loadRecipes(directory, publicDirectory)).filter(
      (recipe) => !recipe.draft,
    ),
);
export const getRecipe = async (slug: string) =>
  (await getRecipes()).find((recipe) => recipe.slug === slug);
export const summarizeRecipe = ({
  slug,
  title,
  description,
  date,
  category,
  tags,
  image,
  imageAlt,
  totalMinutes,
  ingredients,
}: Recipe): RecipeSummary => ({
  slug,
  title,
  description,
  date,
  category,
  tags,
  image,
  imageAlt,
  totalMinutes,
  ingredients,
});
