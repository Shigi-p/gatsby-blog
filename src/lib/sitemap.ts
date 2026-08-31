/**
 * sitemap には正規 URL だけを載せる。
 * 旧 Gatsby スラッグの 301 用ページを入れると、検索結果が古いパスに戻る。
 */
export function isCanonicalSitemapUrl(page: string): boolean {
  const path = new URL(page).pathname.replace(/\/$/, "") || "/";

  if (
    path === "/" ||
    path === "/blog" ||
    path === "/about" ||
    path === "/search" ||
    path === "/tags"
  ) {
    return true;
  }

  if (path.startsWith("/tags/")) {
    return true;
  }

  return /^\/\d{4}-\d{2}-\d{2}-\d{2}$/.test(path);
}
