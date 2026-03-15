import { Env, Brief } from "../types";
import { kvCache } from "../lib/cache";

export async function generateArticle(env: Env, brief: Brief) {
  return kvCache(env, `article:${brief.id}`, 86400, async () => {
    const prompt = buildPrompt(brief);
    const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": env.GEMINI_KEY },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], temperature: 0.55 })
    });
    const json = await res.json<any>();
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text || "";
    return {
      title: extractBetween(text, "<title>", "</title>"),
      html: text,
      meta_description: extractBetween(text, "<meta>", "</meta>"),
      primary_keyword: brief.primary_keyword,
      secondary_keywords: brief.secondary_keywords,
      market: brief.market ?? "global"
    };
  });
}

function buildPrompt(brief: Brief) {
  return `Write a ${brief.word_count || 1300}-word article for affluent audiences in ${brief.market}. Use the primary keyword "${brief.primary_keyword}" and include secondary keywords ${brief.secondary_keywords.join(", ")}. Maintain luxury, discreet tone. Provide real stats with citations, actionable steps, and schema-ready headings. Output HTML with <title>, <meta>, <body> only.`;
}

function extractBetween(text: string, start: string, end: string) {
  const s = text.indexOf(start);
  const e = text.indexOf(end);
  if (s === -1 || e === -1) return "";
  return text.substring(s + start.length, e).trim();
}
