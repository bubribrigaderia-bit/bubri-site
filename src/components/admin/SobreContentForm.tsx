"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updatePageContent } from "@/app/admin/actions";
import { ImageUploadField } from "./ImageUploadField";
import { SaveBar } from "./SaveBar";

export function SobreContentForm({ content }: { content: Record<string, string> }) {
  const router = useRouter();
  const [fields, setFields] = useState({
    foto_url: content.foto_url ?? "",
    paragrafo_1: content.paragrafo_1 ?? "",
    paragrafo_2: content.paragrafo_2 ?? "",
    paragrafo_3: content.paragrafo_3 ?? "",
    valor_1_titulo: content.valor_1_titulo ?? "",
    valor_1_descricao: content.valor_1_descricao ?? "",
    valor_2_titulo: content.valor_2_titulo ?? "",
    valor_2_descricao: content.valor_2_descricao ?? "",
    valor_3_titulo: content.valor_3_titulo ?? "",
    valor_3_descricao: content.valor_3_descricao ?? "",
    cta_final: content.cta_final ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function updateField(key: keyof typeof fields, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);

    const result = await updatePageContent(
      Object.entries(fields).map(([section_key, value]) => ({
        page: "sobre" as const,
        section_key,
        content: value,
      }))
    );

    setSaving(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    setSaved(true);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      <ImageUploadField
        label="Foto (sua ou do ateliê)"
        value={fields.foto_url || null}
        onChange={(url) => updateField("foto_url", url)}
      />

      <label className="flex flex-col gap-1 text-sm">
        História — parágrafo 1
        <textarea
          value={fields.paragrafo_1}
          onChange={(e) => updateField("paragrafo_1", e.target.value)}
          rows={3}
          className="border border-line-soft px-3 py-2 bg-paper-raised"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        História — parágrafo 2
        <textarea
          value={fields.paragrafo_2}
          onChange={(e) => updateField("paragrafo_2", e.target.value)}
          rows={3}
          className="border border-line-soft px-3 py-2 bg-paper-raised"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        História — parágrafo 3
        <textarea
          value={fields.paragrafo_3}
          onChange={(e) => updateField("paragrafo_3", e.target.value)}
          rows={3}
          className="border border-line-soft px-3 py-2 bg-paper-raised"
        />
      </label>

      <div className="flex flex-col gap-4">
        <p className="text-xs font-semibold tracking-wider uppercase text-accent-ink">
          Nossos valores
        </p>
        {[1, 2, 3].map((n) => (
          <div key={n} className="border border-line-soft p-3 flex flex-col gap-3">
            <label className="flex flex-col gap-1 text-sm">
              Título do valor {n}
              <input
                value={fields[`valor_${n}_titulo` as keyof typeof fields]}
                onChange={(e) =>
                  updateField(`valor_${n}_titulo` as keyof typeof fields, e.target.value)
                }
                className="border border-line-soft px-3 py-2 bg-paper-raised"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Descrição do valor {n}
              <input
                value={fields[`valor_${n}_descricao` as keyof typeof fields]}
                onChange={(e) =>
                  updateField(`valor_${n}_descricao` as keyof typeof fields, e.target.value)
                }
                className="border border-line-soft px-3 py-2 bg-paper-raised"
              />
            </label>
          </div>
        ))}
      </div>

      <label className="flex flex-col gap-1 text-sm">
        Texto do botão final
        <input
          value={fields.cta_final}
          onChange={(e) => updateField("cta_final", e.target.value)}
          className="border border-line-soft px-3 py-2 bg-paper-raised"
        />
      </label>

      <SaveBar saving={saving} error={error} saved={saved} onSave={handleSave} />
    </div>
  );
}
