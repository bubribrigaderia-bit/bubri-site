"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Pillar } from "@/types/database";
import { updatePageContent, updatePillar } from "@/app/admin/actions";
import { ImageUploadField } from "./ImageUploadField";
import { SaveBar } from "./SaveBar";

export function HomeContentForm({
  content,
  pillars,
}: {
  content: Record<string, string>;
  pillars: Pillar[];
}) {
  const router = useRouter();
  const [fields, setFields] = useState({
    hero_eyebrow: content.hero_eyebrow ?? "",
    hero_headline: content.hero_headline ?? "",
    hero_subheadline: content.hero_subheadline ?? "",
    hero_cta: content.hero_cta ?? "",
    reviews_cta: content.reviews_cta ?? "",
    foto_hero_url: content.foto_hero_url ?? "",
  });
  const [pillarValues, setPillarValues] = useState(
    Object.fromEntries(
      pillars.map((p) => [p.id, { title: p.title, description: p.description, photo_url: p.photo_url }])
    )
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function updateField(key: keyof typeof fields, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  function updatePillarField(
    id: string,
    key: "title" | "description" | "photo_url",
    value: string
  ) {
    setPillarValues((prev) => ({ ...prev, [id]: { ...prev[id], [key]: value } }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);

    const contentResult = await updatePageContent(
      Object.entries(fields).map(([section_key, value]) => ({
        page: "home" as const,
        section_key,
        content: value,
      }))
    );

    if (!contentResult.success) {
      setSaving(false);
      setError(contentResult.error);
      return;
    }

    for (const pillar of pillars) {
      const values = pillarValues[pillar.id];
      const result = await updatePillar({ id: pillar.id, ...values });
      if (!result.success) {
        setSaving(false);
        setError(result.error);
        return;
      }
    }

    setSaving(false);
    setSaved(true);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <ImageUploadField
          label="Foto de destaque (hero)"
          value={fields.foto_hero_url || null}
          onChange={(url) => updateField("foto_hero_url", url)}
          aspect={3 / 2}
        />
        <label className="flex flex-col gap-1 text-sm">
          Frase de destaque (headline)
          <input
            value={fields.hero_headline}
            onChange={(e) => updateField("hero_headline", e.target.value)}
            className="border border-line-soft px-3 py-2 bg-paper-raised"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Texto de apoio (subheadline)
          <textarea
            value={fields.hero_subheadline}
            onChange={(e) => updateField("hero_subheadline", e.target.value)}
            rows={2}
            className="border border-line-soft px-3 py-2 bg-paper-raised"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Texto do botão principal
          <input
            value={fields.hero_cta}
            onChange={(e) => updateField("hero_cta", e.target.value)}
            className="border border-line-soft px-3 py-2 bg-paper-raised"
          />
        </label>
      </div>

      <div className="flex flex-col gap-4">
        <p className="text-xs font-semibold tracking-wider uppercase text-accent-ink">
          Os 4 pilares
        </p>
        {pillars.map((pillar) => (
          <div key={pillar.id} className="border border-line-soft p-3 flex flex-col gap-3">
            <ImageUploadField
              label="Foto"
              value={pillarValues[pillar.id]?.photo_url ?? null}
              onChange={(url) => updatePillarField(pillar.id, "photo_url", url)}
            />
            <label className="flex flex-col gap-1 text-sm">
              Título
              <input
                value={pillarValues[pillar.id]?.title ?? ""}
                onChange={(e) => updatePillarField(pillar.id, "title", e.target.value)}
                className="border border-line-soft px-3 py-2 bg-paper-raised"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Descrição
              <textarea
                value={pillarValues[pillar.id]?.description ?? ""}
                onChange={(e) => updatePillarField(pillar.id, "description", e.target.value)}
                rows={2}
                className="border border-line-soft px-3 py-2 bg-paper-raised"
              />
            </label>
          </div>
        ))}
      </div>

      <SaveBar saving={saving} error={error} saved={saved} onSave={handleSave} />
    </div>
  );
}
