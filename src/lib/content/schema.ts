import { z } from "zod";
import { categories } from "@/config/categories";

const text = z.string().trim().min(1);
const date = z.iso.date();
const minutes = z.number().int().nonnegative();
const localRecipeImage = z
  .string()
  .regex(/^\/images\/recipes\/[a-z0-9-]+\.(jpg|jpeg|png|webp)$/);
const publicationImage = z.url().refine((value) => {
  const url = new URL(value);
  return (
    url.protocol === "https:" &&
    url.username === "" &&
    url.password === "" &&
    url.port === "" &&
    url.pathname.startsWith("/publication-media/") &&
    url.search === "" &&
    url.hash === ""
  );
}, "Publication images must use HTTPS under /publication-media/");

export const recipeSchema = z
  .strictObject({
    title: text.optional(),
    description: text,
    date: date.optional(),
    updated: date.optional(),
    category: z.enum(categories.map((category) => category.slug)).optional(),
    tags: z.array(text).default([]),
    image: z.union([localRecipeImage, publicationImage]),
    imageAlt: text.optional(),
    imageAttribution: text.optional(),
    prepMinutes: minutes.optional(),
    cookMinutes: minutes.optional(),
    restMinutes: minutes.default(0),
    servings: z.number().int().positive().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  })
  .refine(
    (recipe) => !recipe.updated || !recipe.date || recipe.updated >= recipe.date,
    {
    message: "updated must be on or after date",
    path: ["updated"],
    },
  );

export const pageSchema = z.strictObject({ title: text, description: text });
export type RecipeMetadata = z.infer<typeof recipeSchema>;
