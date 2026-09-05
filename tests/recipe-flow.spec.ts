import { expect, test } from "@playwright/test";

test("homepage leads from the hero to the recipe list, with loaded photographs", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Good food.Everyday joy.",
  );
  await expect(page.getByTestId("recipe-card")).toHaveCount(6);
  const order = await page
    .locator("main > section")
    .evaluateAll((sections) =>
      sections.map((section) => section.id || section.className),
    );
  expect(order).toEqual(["home-hero", "recipes"]);
  await page
    .getByRole("link", { name: "Browse the recipes", exact: true })
    .click();
  await expect(page).toHaveURL(/#recipes$/);
  await expect
    .poll(() =>
      page
        .locator(".hero-image img")
        .evaluate((image) => (image as HTMLImageElement).naturalWidth),
    )
    .toBeGreaterThan(0);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
  await page.screenshot({
    path: testInfo.outputPath("homepage.png"),
    fullPage: true,
  });
});

test("search combines filters, survives refresh and back, and has a reset state", async ({
  page,
}) => {
  await page.goto("/recipes");
  await page.getByRole("searchbox", { name: "Search recipes" }).fill("egg");
  await page
    .locator('[data-slot="toggle-group-item"]')
    .filter({ hasText: /^Breakfast$/ })
    .click();
  await expect(page.getByTestId("recipe-card")).toHaveCount(2);
  await expect(page).toHaveURL(/category=breakfast/);
  await page.reload();
  await expect(page.getByRole("searchbox")).toHaveValue("egg");
  await expect(page.getByTestId("recipe-card")).toHaveCount(2);
  await page
    .locator('[data-slot="toggle-group-item"]')
    .filter({ hasText: /^Desserts$/ })
    .click();
  await expect(page.getByTestId("recipe-card")).toHaveCount(1);
  await page.goBack();
  await expect(page.getByTestId("recipe-card")).toHaveCount(2);
  await page.getByRole("searchbox").fill("no-such-ingredient");
  await expect(page.getByText("No recipes on this page yet")).toBeVisible();
  await page.getByRole("button", { name: "Show all recipes" }).click();
  await expect(page.getByTestId("recipe-card")).toHaveCount(6);
  await expect(page).toHaveURL("http://localhost:3001/recipes");
});

test("recipe navigation, ingredient keyboard interaction, printing and metadata work", async ({
  page,
}, testInfo) => {
  await page.goto("/recipes");
  await page
    .getByRole("heading", { name: "Mushroom & sage tagliatelle" })
    .getByRole("link")
    .click();
  await expect(page).toHaveURL(/mushroom-sage-pasta$/);
  await page.getByRole("link", { name: "Jump to recipe" }).click();
  const ingredient = page.getByRole("checkbox", {
    name: "200 g dried tagliatelle",
  });
  await ingredient.focus();
  await page.keyboard.press("Space");
  await expect(ingredient).toBeChecked();
  await page.screenshot({
    path: testInfo.outputPath("recipe.png"),
    fullPage: true,
  });
  await page.evaluate(() => {
    window.print = () => {
      document.documentElement.dataset.printCalled = "true";
    };
  });
  await page.getByRole("button", { name: "Print recipe" }).first().click();
  await expect(page.locator("html")).toHaveAttribute(
    "data-print-called",
    "true",
  );
  await page.emulateMedia({ media: "print" });
  await expect(page.locator(".site-header")).toBeHidden();
  await expect(page.getByRole("heading", { name: "The method" })).toBeVisible();
  await expect(page.locator(".print-source")).toBeVisible();
  expect(
    await page
      .locator(".ingredient-checklist label")
      .filter({ hasText: "200 g dried tagliatelle" })
      .evaluate((label) => getComputedStyle(label).textDecorationLine),
  ).toBe("none");
  await page.screenshot({
    path: testInfo.outputPath("print.png"),
    fullPage: true,
  });
  const json = JSON.parse(
    await page.locator('script[type="application/ld+json"]').innerText(),
  );
  expect(json.recipeIngredient).toHaveLength(9);
  expect(json.recipeInstructions).toHaveLength(5);
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    new URL(
      "/recipes/mushroom-sage-pasta",
      process.env.SITE_URL || "http://localhost:3000",
    ).toString(),
  );
});

test("categories, About, 404s, sitemap and mobile navigation are reachable", async ({
  page,
  request,
  isMobile,
}) => {
  await page.goto("/");
  if (isMobile) {
    await page.getByRole("button", { name: "Open menu" }).click();
    await page
      .getByRole("navigation", { name: "Mobile navigation" })
      .getByRole("link", { name: "About the journal" })
      .click();
    await expect(page.getByRole("dialog")).toBeHidden();
  } else {
    await page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("link", { name: "About the journal" })
      .click();
  }
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "A little more joy in the everyday.",
  );
  await page.goto("/recipes/category/mains");
  await expect(page.getByTestId("recipe-card")).toHaveCount(2);
  for (const url of [
    "/recipes/unknown",
    "/recipes/category/unknown",
    "/missing-page",
  ]) {
    const response = await request.get(url);
    expect(response.status()).toBe(404);
  }
  await page.goto("/recipes/unknown");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    /This page isn’t\s*on the menu\./,
  );
  const sitemap = await request.get("/sitemap.xml");
  expect(await sitemap.text()).toContain("/recipes/mushroom-sage-pasta");
  const robots = await request.get("/robots.txt");
  expect(await robots.text()).toContain("/sitemap.xml");
});
