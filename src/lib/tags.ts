import { getPostsNewestFirst, type Post } from "./permalinks";

/** Gatsby テーマが作っていた URL と揃える。 */
const TAG_SLUG_BY_NAME: Record<string, string> = {
  WeeklyMemo: "weekly-memo",
};

export function tagSlug(name: string): string {
  return TAG_SLUG_BY_NAME[name] ?? name;
}

export function tagHref(name: string): string {
  return `/tags/${tagSlug(name)}`;
}

export type TagGroup = {
  name: string;
  slug: string;
  href: string;
  posts: Post[];
};

export async function getTagGroups(): Promise<TagGroup[]> {
  const posts = await getPostsNewestFirst();
  const groups = new Map<string, TagGroup>();

  for (const post of posts) {
    for (const name of post.entry.data.tags) {
      const current = groups.get(name);
      if (current) {
        current.posts.push(post);
        continue;
      }

      groups.set(name, {
        name,
        slug: tagSlug(name),
        href: tagHref(name),
        posts: [post],
      });
    }
  }

  return [...groups.values()].sort((a, b) =>
    a.name.localeCompare(b.name, "ja"),
  );
}
