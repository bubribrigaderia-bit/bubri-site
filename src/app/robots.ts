import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// Libera explicitamente os robôs de busca e de IA (ChatGPT, Perplexity, Claude,
// Google, Bing). O painel /admin fica de fora.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: [
          "OAI-SearchBot",
          "ChatGPT-User",
          "GPTBot",
          "PerplexityBot",
          "ClaudeBot",
          "Claude-SearchBot",
          "Google-Extended",
          "Bingbot",
          "Googlebot",
        ],
        allow: "/",
        disallow: "/admin",
      },
      { userAgent: "*", allow: "/", disallow: "/admin" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
