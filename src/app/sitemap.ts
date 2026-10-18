import type { MetadataRoute } from "next";
import { OCCASIONS } from "@/types/database";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const priority: Record<string, number> = { corporativo: 0.9, presentes: 0.9 };

  return [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...OCCASIONS.map((o) => ({
      url: `${SITE_URL}/${o.path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: priority[o.path] ?? 0.8,
    })),
    { url: `${SITE_URL}/cardapio`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/contato`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/nossa-historia`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];
}
