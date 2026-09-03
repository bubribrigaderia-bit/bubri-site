import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OCCASIONS, occasionByPath } from "@/types/database";
import { getPillars } from "@/lib/data/pillars";
import { OccasionPage } from "@/components/site/OccasionPage";

export const dynamicParams = false;

export function generateStaticParams() {
  return OCCASIONS.map((o) => ({ ocasiao: o.path }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ocasiao: string }>;
}): Promise<Metadata> {
  const { ocasiao } = await params;
  const occasion = occasionByPath(ocasiao);
  if (!occasion) return {};

  const pillars = await getPillars();
  const pillar = pillars.find((p) => p.slug === occasion.value);
  return { title: pillar?.title ?? occasion.menuLabel };
}

export default async function OcasiaoRoute({
  params,
}: {
  params: Promise<{ ocasiao: string }>;
}) {
  const { ocasiao } = await params;
  const occasion = occasionByPath(ocasiao);
  if (!occasion) notFound();

  return <OccasionPage occasion={occasion} />;
}
