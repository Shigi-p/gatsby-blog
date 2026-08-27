import { getCollection, type CollectionEntry } from "astro:content";

/**
 * Gatsby テーマがタイトルから生成していた旧スラッグ。
 * frontmatter に slug が無い記事だけをここに持つ。
 */
const LEGACY_SLUG_BY_ID: Record<string, string> = {
  "20220117": "0117-weekly-memo",
  "20220110": "0110-weekly-memo",
  "20220103": "0103-weekly-memo",
  "20211227": "1227-weekly-memo",
  "20211220": "1220-weekly-memo",
  "20211213": "1213-weekly-memo",
  "20211122": "1122-weekly-memo",
  "20211115": "1115-weekly-memo",
  "20211108": "1108-weekly-memo",
  "20211101": "1101-weekly-memo",
  "20211025": "1025-weekly-memo",
  "20211018": "1018-weekly-memo",
  "20210716": "safariのtransitionと戦う",
  "20210714": "input-type-date-を徹底解剖する",
  "20210630": "tsにて-string型の-arrayをリテラル型にするヤツが謎だった",
  "20210629": "mac-m-1-で-gatsbyを試そうと思ったら-個人的に-ちょっと苦労した",
};

export type Post = {
  entry: CollectionEntry<"posts">;
  permalink: string;
  href: string;
  legacySlugs: string[];
  dateStamp: string;
};

function normalizeId(id: string): string {
  return id.replace(/\/index$/, "");
}

function stripSlash(slug: string): string {
  return slug.replace(/^\//, "");
}

function toDateStamp(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function sequenceHint(legacySlug: string | undefined): number {
  if (!legacySlug) {
    return Number.MAX_SAFE_INTEGER;
  }

  const nextFormat = legacySlug.match(/^\d{4}-\d{2}-\d{2}-(\d{2})$/);
  if (nextFormat) {
    return Number(nextFormat[1]);
  }

  const gatsbySameDay = legacySlug.match(/_(\d{2})$/);
  if (gatsbySameDay) {
    return Number(gatsbySameDay[1]);
  }

  return Number.MAX_SAFE_INTEGER;
}

export async function getPosts(): Promise<Post[]> {
  const entries = await getCollection("posts");
  const decorated = entries.map((entry) => {
    const id = normalizeId(entry.id);
    const fromFrontmatter = entry.data.slug
      ? stripSlash(entry.data.slug)
      : undefined;
    const legacySlug = fromFrontmatter ?? LEGACY_SLUG_BY_ID[id];

    return {
      entry,
      id,
      dateStamp: toDateStamp(entry.data.date),
      legacySlug,
      sortHint: sequenceHint(legacySlug),
    };
  });

  decorated.sort((a, b) => {
    if (a.dateStamp !== b.dateStamp) {
      return a.dateStamp.localeCompare(b.dateStamp);
    }
    if (a.sortHint !== b.sortHint) {
      return a.sortHint - b.sortHint;
    }
    return a.id.localeCompare(b.id);
  });

  const sequenceByDate = new Map<string, number>();
  const posts = decorated.map((item) => {
    const next = (sequenceByDate.get(item.dateStamp) ?? 0) + 1;
    sequenceByDate.set(item.dateStamp, next);
    const permalink = `${item.dateStamp}-${String(next).padStart(2, "0")}`;
    const legacySlugs = item.legacySlug && item.legacySlug !== permalink
      ? [item.legacySlug]
      : [];

    return {
      entry: item.entry,
      permalink,
      href: `/${permalink}`,
      legacySlugs,
      dateStamp: item.dateStamp,
    };
  });

  const seen = new Set<string>();
  for (const post of posts) {
    if (seen.has(post.permalink)) {
      throw new Error(`重複した permalink: ${post.permalink}`);
    }
    seen.add(post.permalink);
  }

  return posts;
}

export async function getPostsNewestFirst(): Promise<Post[]> {
  const posts = await getPosts();
  return posts.slice().reverse();
}
