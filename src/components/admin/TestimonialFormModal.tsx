"use client";

import { useState, type FormEvent } from "react";
import type { Testimonial } from "@/types/database";
import { upsertTestimonial } from "@/app/admin/actions";

export function TestimonialFormModal({
  initialItem,
  onClose,
  onSaved,
}: {
  initialItem: Testimonial | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [authorName, setAuthorName] = useState(initialItem?.author_name ?? "");
  const [text, setText] = useState(initialItem?.text ?? "");
  const [rating, setRating] = useState(initialItem?.rating ?? 5);
  const [displayOrder, setDisplayOrder] = useState(initialItem?.display_order ?? 0);
  const [active, setActive] = useState(initialItem?.active ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const result = await upsertTestimonial({
      id: initialItem?.id,
      author_name: authorName,
      text,
      rating,
      display_order: Number(displayOrder) || 0,
      active,
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
        <h2 className="font-bold text-lg">
          {initialItem ? "Editar depoimento" : "Novo depoimento"}
        </h2>

        <label className="flex flex-col gap-1 text-sm">
          Nome de quem avaliou
          <input
            required
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Ex: Marina S."
            className="border border-line-soft px-3 py-2 bg-paper-raised"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Texto da avaliação
          <textarea
            required
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            className="border border-line-soft px-3 py-2 bg-paper-raised"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Estrelas
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="border border-line-soft px-3 py-2 bg-paper-raised"
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {"★".repeat(n)} ({n})
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Ordem (menor aparece primeiro)
          <input
            type="number"
            value={displayOrder}
            onChange={(e) => setDisplayOrder(Number(e.target.value))}
            className="border border-line-soft px-3 py-2 bg-paper-raised w-24"
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
