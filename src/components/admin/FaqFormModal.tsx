"use client";

import { useState, type FormEvent } from "react";
import type { FaqItem } from "@/types/database";
import { upsertFaqItem } from "@/app/admin/actions";

export function FaqFormModal({
  initialItem,
  onClose,
  onSaved,
}: {
  initialItem: FaqItem | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [question, setQuestion] = useState(initialItem?.question ?? "");
  const [answer, setAnswer] = useState(initialItem?.answer ?? "");
  const [active, setActive] = useState(initialItem?.active ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const result = await upsertFaqItem({
      id: initialItem?.id,
      question,
      answer,
      active,
      display_order: initialItem?.display_order ?? 0,
    });

    setSaving(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    onSaved();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-paper w-full max-w-md p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto"
      >
        <h2 className="font-bold text-lg">{initialItem ? "Editar pergunta" : "Nova pergunta"}</h2>

        <label className="flex flex-col gap-1 text-sm">
          Pergunta
          <input
            required
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="border border-line-soft px-3 py-2 bg-paper-raised"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Resposta
          <textarea
            required
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={4}
            className="border border-line-soft px-3 py-2 bg-paper-raised"
          />
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
          Ativo (visível no site)
        </label>

        {error && <p className="text-sm text-red-700">{error}</p>}

        <div className="flex gap-3 justify-end mt-2">
          <button type="button" onClick={onClose} className="text-sm text-graphite px-3 py-2">
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="border border-accent text-accent-ink font-semibold px-4 py-2 text-sm hover:bg-accent-soft transition-colors disabled:opacity-50"
          >
            {saving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </div>
  );
}
