# Project overview

Status: first release implemented locally. Last updated: 2026-09-05. Final content, branding, and deployment are still launch decisions.

## Purpose

Create a food blog where readers can discover a recipe, quickly understand its time and ingredients, and comfortably follow it while cooking. The owner should be able to publish by editing a Markdown file and adding photographs.

## Confirmed requirements

- Use Next.js.
- Focus on food and recipes.
- Store blog content in Markdown.
- shadcn/ui is an acceptable UI foundation.
- Document the project before building the application features.
- Homepage content starts with a hero section, followed directly by a recipe list.

## Implemented first release

| Area | Included behavior |
| --- | --- |
| Home | Hero section followed directly by a recipe list; no intervening content sections |
| Recipe discovery | Recipe index with text search and category filtering |
| Categories | A shareable page for each category containing published recipes |
| Recipe detail | Photograph, introduction, times, servings, ingredients, method, and notes |
| Cooking experience | Jump to recipe, ingredient checkboxes, and browser print layout |
| About | Markdown page describing the author and approach to cooking |
| Publishing | Local Markdown files, validated metadata, and draft exclusion |
| Search visibility | Page metadata, canonical URLs, recipe structured data, sitemap, and robots file |
| Responsive access | Mobile and desktop layouts, keyboard navigation, readable contrast, and image descriptions |

Each recipe acts as a blog post: its introduction can contain the story behind the food. A separate journal section is an optional later addition.

## Design direction

The interface uses a seasonal food journal style: warm cream surfaces, olive accents, Lora serif headings, DM Sans body text, and prominent food photography. shadcn/ui supplies accessible controls, customized through shared theme tokens. The homepage places the hero directly before the recipe list.

The Recipe Journal is the working name, with a simple sprout mark. The final identity and author biography can be supplied before launch.

## Content and operating assumptions

- One site owner edits repository files; readers do not need accounts.
- English content and metric measurements are the initial defaults.
- Recipes belong to one primary category and can carry multiple descriptive tags.
- Publishing a content change requires rebuilding and deploying the site.
- Start with a small collection of complete sample recipes, clearly distinguished from the owner's recipes.
- Store photographs locally, retaining source and usage-rights notes.

## Outside the first release

Accounts, comments, ratings, saved collections, automatic serving conversion, nutrition calculations, a browser-based CMS, multilingual content, advertising, newsletter delivery, and a separate journal are deferred. Scope these individually if needed.

Do not invent ratings, author credentials, or newsletter subscription claims to fill out the design.

## Open decisions

| Decision | Working proposal |
| --- | --- |
| Blog name and author | The Recipe Journal is the working name; author biography remains to be supplied |
| Visual identity | Seasonal editorial style described above |
| Launch categories | Breakfast, mains, sides, desserts; adjust to actual recipes |
| Language and units | English and metric |
| Initial content | Six labeled sample recipes are included; replace with reviewed owner content |
| Hosting and domain | Choose before deployment; no provider selected |
| Additional posts | Add a journal only if needed beyond recipe introductions |

## Success criteria

A reader can find and print a recipe on a phone or desktop. The owner can add a recipe without changing application code. Drafts stay unpublished, broken content produces a useful build error, and every published recipe has a stable URL.
