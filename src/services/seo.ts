export async function seoCheck(article: { html: string; primary_keyword?: string }) {
  const ok = article.html && article.html.length > 1200; // rough length gate
  return { ok };
}
