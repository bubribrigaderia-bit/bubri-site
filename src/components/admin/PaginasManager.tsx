"use client";

import { useState } from "react";
import type { Pillar, FaqItem } from "@/types/database";
import { HomeContentForm } from "./HomeContentForm";
import { SobreContentForm } from "./SobreContentForm";
import { FaqManager } from "./FaqManager";

const TABS = ["home", "sobre", "contato"] as const;
type Tab = (typeof TABS)[number];

const TAB_LABELS: Record<Tab, string> = {
  home: "Home",
  sobre: "Sobre",
  contato: "Contato",
};

export function PaginasManager({
  pillars,
  homeContent,
  sobreContent,
  faqItems,
}: {
  pillars: Pillar[];
  homeContent: Record<string, string>;
  sobreContent: Record<string, string>;
  faqItems: FaqItem[];
}) {
  const [tab, setTab] = useState<Tab>("home");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`text-sm px-3 py-1.5 border ${tab === t ? "border-ink font-semibold" : "border-line-soft text-graphite"}`}
          >
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      {tab === "home" && <HomeContentForm content={homeContent} pillars={pillars} />}
      {tab === "sobre" && <SobreContentForm content={sobreContent} />}
      {tab === "contato" && <FaqManager initialItems={faqItems} />}
    </div>
  );
}
