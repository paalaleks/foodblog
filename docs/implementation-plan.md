# Implementation plan

Status: first release implemented and verified locally. Deployment and final editorial content remain outstanding.

## Current progress

- [x] Initialize Next.js with TypeScript, App Router, Tailwind CSS, and ESLint.
- [x] Initialize shadcn/ui with Radix and its Button component.
- [x] Document scope, site map, structure, and content format.
- [x] Implement the Markdown content pipeline.
- [x] Build the interface and routes.
- [x] Verify reader and author workflows.
- [ ] Choose and configure deployment.

## Build sequence

### 1. Content foundation

Implement the schema, Markdown parser, published-content queries, categories, and site configuration. Add sample recipes and About content. Validate paths, sections, dates, and draft behavior before connecting the interface.

Completion check: valid files enter the collection, invalid content reports its filename and problem, and drafts stay out of public queries.

### 2. Layout and discovery

Build the header/footer, theme, homepage, recipe cards, index, category pages, and About page. Add search and filters with shareable URL state.

The homepage must place the hero first and the recipe list immediately after it. Keep search and category filters on the recipe index, with a link there from the homepage list.

Completion check: the homepage follows hero → recipe list, its browse action reaches the list, and its recipe links work; navigation works on mobile and desktop; search and category selection combine correctly; resetting, refresh, and browser navigation preserve expected state; zero results offers recovery.

### 3. Recipe and cooking experience

Build recipe detail pages with Markdown content, times, servings, ingredient checklist, jump link, print action, and related recipes. Add the not-found experience.

Completion check: published recipes resolve at stable URLs; jump and checkbox actions work with keyboard and pointer; print preview includes the complete recipe without navigation clutter; unknown and draft slugs return 404.

### 4. Metadata and release checks

Generate metadata, recipe structured data, sitemap, and robots output. Verify images, content accuracy, accessibility, production rendering, and authoring. Replace sample identity before launch.

Completion check: content and metadata agree; public links resolve; the sitemap includes published recipes and excludes drafts; lint and production build pass.

## Verification approach

| Area | Meaningful checks |
| --- | --- |
| Content tests | Missing fields, impossible dates, invalid categories, unsafe slugs/paths, missing images, malformed sections, draft exclusion |
| Search tests | Case/whitespace normalization, ingredient matching, combined filters, empty results, stable sorting |
| Browser flow | Home → search/filter → recipe → ingredient checklist; refresh and back navigation |
| Routes | Published recipe/category/About pages load; unknown and draft URLs return 404 |
| Visual review | Mobile and desktop layouts, crops, long titles, focus visibility, print preview |
| Search visibility | Canonicals, metadata, structured data matching visible content, sitemap contents |
| Author workflow | Add a recipe without code changes, validate it, preview it, then build |

Verification on 2026-09-05: content validation, ESLint, the production build, 18 Node unit tests, and eight Playwright tests passed. Browser tests cover desktop and mobile Chromium. Full-page homepage, recipe, and print screenshots were also visually reviewed.

Run `npm test` for content/search checks, `npm run validate:content` for authoring validation, and `npm run test:e2e` for browser tests. The browser command builds a fresh production app and serves it temporarily on port 3001. Install Chromium once with `npx playwright install chromium`. Screenshots and failure traces are stored in the ignored `test-results/` directory.

React Doctor reviewed the full source tree. Its remaining advisory warnings concern small-collection iteration, static list keys, server-rendered time, deliberate fail-fast configuration, and generated shadcn patterns. No blocking React errors were reported. Cross-browser testing beyond Chromium and kitchen testing of the sample recipes are not claimed.

## Launch inputs

Supply the final name, author biography, domain, original or appropriately licensed photographs, and reviewed recipes. Choose hosting and configure the canonical site URL. Add policy pages if the actual services and launch requirements call for them.

Deployment is a separate step. Neither the scaffold nor these documents publish a site.

## Keeping documentation current

Update the site map when routes change, the content guide when recipe fields change, and the architecture tree when responsibilities move. Mark features implemented only after verification.
