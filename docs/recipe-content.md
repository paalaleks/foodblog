# Recipe authoring guide

Status: implemented content contract. Run `npm run validate:content` to check all recipes and the About page.

## Content locations

Each recipe lives in `content/recipes/<slug>.md`. Use a lowercase, hyphenated filename such as `lemon-basil-pasta.md`, which becomes `/recipes/lemon-basil-pasta`.

Place photographs in `public/images/recipes/` and reference them with URLs beginning `/images/recipes/`. Preserve published filenames: renaming changes the public URL and needs a redirect.

## Example recipe

This illustrates the format. It is draft sample content, not a tested recipe ready for publication.

```markdown
---
title: "Lemon & basil pasta"
description: "A simple pasta with fresh basil, lemon, and Parmesan."
date: "2026-09-05"
category: "mains"
tags: ["pasta", "quick", "weeknight"]
image: "/images/recipes/lemon-basil-pasta.jpg"
imageAlt: "Pasta with basil leaves, lemon zest, and grated Parmesan in a shallow bowl"
imageAttribution: "Photo supplied by the recipe author."
prepMinutes: 10
cookMinutes: 15
servings: 2
featured: false
draft: true
---

A bright, uncomplicated supper for days when you want something
comforting without spending the whole evening in the kitchen.

## Ingredients

- 200 g dried pasta
- 1 lemon, zest and juice
- 2 tbsp olive oil
- 40 g Parmesan, finely grated
- 1 handful fresh basil, roughly torn
- Salt and black pepper, to taste

## Method

1. Bring a large pan of salted water to a boil. Cook the pasta according
   to the packet instructions, reserving a mug of cooking water.
2. Combine the lemon zest, 1 tablespoon of lemon juice, and olive oil
   in a large bowl.
3. Add the drained pasta. Toss with the Parmesan and a splash of cooking
   water until coated, adding more water as needed.
4. Fold in the basil, season to taste, and serve immediately.

## Notes

Add the remaining lemon juice a little at a time if you prefer a sharper sauce.
```

## Frontmatter fields

| Field | Required | Rule |
| --- | --- | --- |
| `title` | Yes | Nonempty display title |
| `description` | Yes | Nonempty summary for cards and metadata |
| `date` | Yes | Quoted calendar date in `YYYY-MM-DD` format |
| `updated` | No | Quoted date on or after publication date |
| `category` | Yes | Slug defined in `src/config/categories.ts` |
| `tags` | No | Nonempty descriptive strings; defaults to an empty list |
| `image` | Yes | Path to an existing local recipe image, or an approved HTTPS URL under `/publication-media/` |
| `imageAlt` | Yes | Description of the actual image |
| `imageAttribution` | No | Visible credit for the supplied image |
| `prepMinutes` | Yes | Integer, zero or greater |
| `cookMinutes` | Yes | Integer, zero or greater |
| `restMinutes` | No | Integer, zero or greater; default zero; includes chilling/rising |
| `servings` | Yes | Positive integer |
| `featured` | No | Boolean, default false |
| `draft` | Yes | Boolean; true until ready to publish |

Derive total time from preparation, cooking, and resting time. The author comes from shared site configuration in this single-author version.

Publication is controlled by `draft`. Future dates are not a scheduling mechanism; reject a future-dated published recipe during the build using UTC calendar dates consistently. If multiple published recipes are featured, choose the newest; if none are featured, use the newest published recipe.

## Markdown body rules

- The page supplies the level-one title; do not repeat it in the body.
- Introductory paragraphs come before `## Ingredients`.
- Include exactly one `## Ingredients` section with a nonempty unordered list.
- Follow it with exactly one `## Method` section with a nonempty ordered list.
- An optional `## Notes` section may follow.
- Initially, ingredients and method use flat lists. Each method item is one step and may contain paragraphs, emphasis, and links.
- Use standard Markdown. Raw HTML, JSX, scripts, and executable MDX are unsupported.

The renderer and structured-data generator use these same sections. Extract sections with a Markdown syntax tree, not text splitting. Validate order and list shape, reporting the source filename on failure.

## About page

`content/pages/about.md` uses `title` and `description` frontmatter followed by ordinary Markdown. It does not require recipe fields or headings. Use level-two headings beneath the page title. Keep the author name and site identity in shared configuration.

## Publishing workflow

1. Create the Markdown file with `draft: true`.
2. Add its photograph and image description. Record image source and permitted usage in an adjacent `.credits.md` file when appropriate.
3. Write the introduction, measured ingredients, complete method, and notes.
4. Run `npm run validate:content`, then `npm run dev`. Drafts remain excluded from public routes. To preview a draft's full page, temporarily set `draft: false` in a local working copy, then restore it before sharing unfinished work.
5. Check times, yield, category, image, and print output. Verify ingredients before applying dietary labels.
6. When ready, set `draft: false`, run `npm run validate:content`, `npm run lint`, `npm test`, and `npm run build`, commit content and images, then deploy.

The included sample collection is marked in recipe pages and the footer through `sampleContent` in `src/config/site.ts`. Keep this label until the sample collection has been replaced/reviewed. Photographs are illustrative; source records are in `public/images/recipes/photography.credits.md`.

Content changes require a deployment to appear publicly. A private draft preview system is outside the first release.
