import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import { toString } from "mdast-util-to-string";
import type { Root, RootContent, List, Nodes } from "mdast";

const processor = unified().use(remarkParse).use(remarkStringify);
const stringify = (children: RootContent[]) =>
  processor.stringify({ type: "root", children });

function validateNodes(node: Nodes) {
  if (node.type === "html")
    throw new Error("Raw HTML is unsupported; use plain Markdown");
  if (node.type === "heading" && node.depth === 1)
    throw new Error(
      "The page supplies the title; use headings of level 2 or below",
    );
  if ("children" in node) node.children.forEach(validateNodes);
}

export function parseMarkdown(markdown: string): Root {
  const tree = processor.parse(markdown);
  validateNodes(tree);
  return tree;
}

function sectionList(
  nodes: RootContent[],
  ordered: boolean,
  name: string,
): List {
  if (
    nodes.length !== 1 ||
    nodes[0].type !== "list" ||
    Boolean(nodes[0].ordered) !== ordered ||
    !nodes[0].children.length
  ) {
    throw new Error(
      `${name} must contain one nonempty ${ordered ? "ordered" : "unordered"} list`,
    );
  }
  const list = nodes[0];
  for (const item of list.children) {
    if (
      !toString(item).trim() ||
      item.children.some((child) => child.type !== "paragraph")
    ) {
      throw new Error(
        `${name} entries must be nonempty paragraphs, without nested lists`,
      );
    }
  }
  return list;
}

export function parseRecipeBody(markdown: string) {
  const tree = parseMarkdown(markdown);
  const headings = tree.children.flatMap((node, index) =>
    node.type === "heading" && node.depth === 2
      ? [{ name: toString(node), index }]
      : [],
  );
  const names = headings.map((heading) => heading.name).join(",");
  if (names !== "Ingredients,Method" && names !== "Ingredients,Method,Notes") {
    throw new Error(
      "Expected exactly ## Ingredients, ## Method, then optional ## Notes, in that order",
    );
  }
  const [ingredientsHeading, methodHeading, notesHeading] = headings;
  const ingredients = sectionList(
    tree.children.slice(ingredientsHeading.index + 1, methodHeading.index),
    false,
    "Ingredients",
  );
  const method = sectionList(
    tree.children.slice(methodHeading.index + 1, notesHeading?.index),
    true,
    "Method",
  );
  return {
    introduction: stringify(tree.children.slice(0, ingredientsHeading.index)),
    ingredients: ingredients.children.map((item) => toString(item)),
    steps: method.children.map((item) => ({
      text: toString(item),
      markdown: stringify(item.children),
    })),
    notes: notesHeading
      ? stringify(tree.children.slice(notesHeading.index + 1))
      : "",
  };
}
