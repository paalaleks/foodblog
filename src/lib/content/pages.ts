import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { pageSchema } from "./schema";
import { parseMarkdown } from "./markdown";

export async function getAboutPage() {
  try {
    const { data, content } = matter(
      await fs.readFile(
        path.join(process.cwd(), "content/pages/about.md"),
        "utf8",
      ),
    );
    parseMarkdown(content);
    return { ...pageSchema.parse(data), content };
  } catch (error) {
    throw new Error(
      `about.md: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
