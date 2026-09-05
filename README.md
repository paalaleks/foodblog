# The Recipe Journal

A Next.js food blog with recipes authored in Markdown, styled with Tailwind CSS and shadcn/ui.

## What is built

- Responsive homepage: hero first, then six latest recipes.
- Recipe collection with ingredient/text search, category filters, and shareable URL state.
- Category pages, Markdown About page, and useful 404 pages.
- Recipe pages with ingredient checkboxes, numbered methods, jump links, and print layouts.
- Validated content, draft exclusion, metadata, Recipe JSON-LD, sitemap, and crawler rules.

The Recipe Journal is a working identity. Six sample recipes and illustrative photographs are included; recipes are not yet kitchen-tested. The site is implemented locally and has not been deployed.

## Run locally

```bash
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000).

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server on port 3000 |
| `npm run build` | Production build with content validation |
| `npm start` | Serve an existing production build |
| `npm run lint` | ESLint |
| `npm run validate:content` | Validate recipes and About content without building the interface |
| `npm test` | Content and search unit tests |
| `npm run test:e2e` | Build and run desktop/mobile Chromium tests against a temporary production server on port 3001 |

Install the browser before running the end-to-end suite for the first time:

```bash
npx playwright install chromium
```

Port 3001 must be free for the browser suite. Its production server is stopped by Playwright when testing finishes. Screenshots and failure traces are written to the ignored `test-results/` directory.

## Add a recipe

Create `content/recipes/your-recipe.md` and add its photograph to `public/images/recipes/`. Follow the [recipe authoring guide](docs/recipe-content.md), then run `npm run validate:content`. A recipe with `draft: true` is excluded from every public collection and route. Publish with `draft: false` and rebuild/deploy.

## Configure the site

- `src/config/site.ts`: name, author attribution, description, and sample-content label.
- `src/config/categories.ts`: category names and descriptions.
- `content/pages/about.md`: the About page.
- `src/app/globals.css`: colours, typography, responsive layout, and print styles.

`SITE_URL` sets the canonical origin used in metadata and sitemap URLs. It defaults to `http://localhost:3000` for development. Set it to your real domain in the deployment environment **before building**. Replace the working identity, sample recipes, and illustrative photography before public launch. Set `sampleContent` to false only after replacing/reviewing the collection.

## Project documentation

| Document | Contents |
| --- | --- |
| [Project overview](docs/project-overview.md) | Scope, design direction, and remaining launch decisions |
| [Site map](docs/site-map.md) | Routes, navigation, page contents, and reader journeys |
| [Architecture](docs/architecture.md) | File structure, content flow, and server/client boundaries |
| [Recipe authoring](docs/recipe-content.md) | Complete Markdown example and publishing workflow |
| [Implementation plan](docs/implementation-plan.md) | Progress and acceptance checks |

Foundation: Next.js 16.3.4, React 19.2.8, TypeScript, Tailwind CSS 4, and shadcn/ui with Radix primitives. Content uses gray-matter, Zod, unified/remark, and react-markdown. No database or external content service is required. `package-lock.json` records installed versions.
