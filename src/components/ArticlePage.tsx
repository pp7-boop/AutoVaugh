import React, { useEffect, useState } from "react";

type Related = { slug: string; title: string };

export default function ArticlePage({ article, related = [] as Related[] }: { article: any; related?: Related[] }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const h = () => setProgress(window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100);
    window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <article className="article">
      <div className="progress" style={{ width: `${progress}%` }} />
      <p className="meta">{article.reading_time} • Updated {article.updated_at?.slice(0,10)}</p>
      <h1>{article.title}</h1>
      {article.hero_url && <img src={article.hero_url} alt={article.hero_alt || article.title} loading="lazy" />}
      <div className="toc" dangerouslySetInnerHTML={{ __html: article.toc_html || "" }} />
      <section dangerouslySetInnerHTML={{ __html: article.html }} />
      <aside className="cta">Book a discreet, verified experience.</aside>
      {related.length ? (
        <section className="related">
          <h3>Related</h3>
          {related.map((r: any) => <a key={r.slug} href={`/${r.slug}`}>{r.title}</a>)}
        </section>
      ) : null}
    </article>
  );
}
