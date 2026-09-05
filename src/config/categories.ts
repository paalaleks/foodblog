export const categories = [
  {
    slug: "breakfast",
    name: "Breakfast",
    description:
      "Slow mornings, good beginnings. Something worth getting out of bed for.",
  },
  {
    slug: "mains",
    name: "Mains",
    description:
      "Satisfying plates for weeknight suppers and leisurely weekend tables.",
  },
  {
    slug: "sides",
    name: "Sides",
    description: "Colourful, generous little dishes that make the meal.",
  },
  {
    slug: "desserts",
    name: "Desserts",
    description:
      "A little sweetness. For sharing, celebrating, or just because.",
  },
] as const;

export const getCategory = (slug: string) =>
  categories.find((category) => category.slug === slug);
