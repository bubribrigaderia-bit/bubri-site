"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { SiteSettings } from "@/types/database";
import { updateSiteSettings } from "@/app/admin/actions";
import { SaveBar } from "./SaveBar";

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const router = useRouter();
  const [fields, setFields] = useState({
    whatsapp_number: settings.whatsapp_number,
    business_hours: settings.business_hours,
    instagram_handle: settings.instagram_handle,
    google_reviews_url: settings.google_reviews_url,
    delivery_text: settings.delivery_text,
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

    const result = await updateSiteSettings(fields);

    setSaving(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    setSaved(true);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-5 max-w-md">
      <label className="flex flex-col gap-1 text-sm">
        WhatsApp (só números, com DDI e DDD)
        <input
          value={fields.whatsapp_number}
          onChange={(e) => updateField("whatsapp_number", e.target.value)}
          placeholder="5511999999999"
          className="border border-line-soft px-3 py-2 bg-paper-raised"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Horário de atendimento
        <input
          value={fields.business_hours}
          onChange={(e) => updateField("business_hours", e.target.value)}
          className="border border-line-soft px-3 py-2 bg-paper-raised"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Instagram (sem @)
        <input
          value={fields.instagram_handle}
          onChange={(e) => updateField("instagram_handle", e.target.value)}
          className="border border-line-soft px-3 py-2 bg-paper-raised"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Link de avaliações do Google
        <input
          value={fields.google_reviews_url}
          onChange={(e) => updateField("google_reviews_url", e.target.value)}
          className="border border-line-soft px-3 py-2 bg-paper-raised"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Texto de entrega
        <textarea
          value={fields.delivery_text}
          onChange={(e) => updateField("delivery_text", e.target.value)}
          rows={2}
          className="border border-line-soft px-3 py-2 bg-paper-raised"
        />
      </label>

      <SaveBar saving={saving} error={error} saved={saved} onSave={handleSave} />
    </div>
  );
}
