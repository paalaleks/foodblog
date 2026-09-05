export const site = {
  name: "The Recipe Journal",
  description:
    "Seasonal recipes, simple ingredients, and the everyday joy of cooking.",
  url: new URL(process.env.SITE_URL || "http://localhost:3000").origin,
  author: "The Recipe Journal",
  sampleContent: true,
};

export const absoluteUrl = (path: string) => new URL(path, site.url).toString();
