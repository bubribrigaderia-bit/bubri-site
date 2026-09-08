"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { FaqItem } from "@/types/database";
import { deleteFaqItem, upsertFaqItem } from "@/app/admin/actions";
import { FaqFormModal } from "./FaqFormModal";

type ModalState = { mode: "create" } | { mode: "edit"; item: FaqItem } | null;

export function FaqManager({ initialItems }: { initialItems: FaqItem[] }) {
  const router = useRouter();
  const [modal, setModal] = useState<ModalState>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [reordering, setReordering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const items = [...initialItems].sort((a, b) => a.display_order - b.display_order);
  const nextOrder = items.length
    ? Math.max(...items.map((i) => i.display_order)) + 1
    : 0;

  async function handleDelete(id: string) {
    setBusyId(id);
    await deleteFaqItem(id);
    setBusyId(null);
    setPendingDeleteId(null);
    router.refresh();
  }

  async function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;

    // Reescreve o display_order de todas as perguntas conforme a nova ordem.
    // (Faz isso na lista inteira porque hoje várias perguntas têm display_order 0,
    // e trocar 0 por 0 não mudaria nada.)
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];

    setReordering(true);
    setError(null);
    const results = await Promise.all(
      next.map((item, order) =>
        upsertFaqItem({
          id: item.id,
          question: item.question,
          answer: item.answer,
          active: item.active,
          display_order: order,
        })
      )
    );
    setReordering(false);
    const failed = results.find((r) => !r.success);
    if (failed && !failed.success) {
      setError(failed.error);
      return;
    }
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <p className="text-xs font-semibold tracking-wider uppercase text-accent-ink">
          Perguntas frequentes
        </p>
        <button
          type="button"
          onClick={() => setModal({ mode: "create" })}
          className="border border-accent text-accent-ink font-semibold px-4 py-2 text-sm hover:bg-accent-soft transition-colors"
        >
          + Nova pergunta
        </button>
      </div>

      <p className="text-xs text-graphite -mt-2">
        Use as setas ↑ / ↓ para mudar a ordem em que as perguntas aparecem no site.
      </p>

      {error && <p className="text-sm text-red-700">{error}</p>}

      <div className="flex flex-col gap-2">
        {items.map((item, i) => (
          <div key={item.id} className="border border-line-soft p-3 flex items-start gap-3">
            <div className="flex flex-col gap-1 shrink-0">
              <button
                type="button"
                disabled={reordering || i === 0}
                onClick={() => move(i, -1)}
                className="px-1.5 border border-line-soft rounded disabled:opacity-30"
                aria-label="Mover para cima"
              >
                ↑
              </button>
              <button
                type="button"
                disabled={reordering || i === items.length - 1}
                onClick={() => move(i, 1)}
                className="px-1.5 border border-line-soft rounded disabled:opacity-30"
                aria-label="Mover para baixo"
              >
                ↓
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm">{item.question}</p>
              <p className="text-xs text-graphite line-clamp-2">{item.answer}</p>
            </div>
            <button
              type="button"
              onClick={() => setModal({ mode: "edit", item })}
              className="text-xs font-semibold text-accent-ink hover:underline shrink-0"
            >
              Editar
            </button>
            {pendingDeleteId === item.id ? (
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-graphite">Excluir?</span>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  disabled={busyId === item.id}
                  className="text-xs font-semibold text-red-700"
                >
                  Sim
                </button>
                <button
                  type="button"
                  onClick={() => setPendingDeleteId(null)}
                  className="text-xs text-graphite"
                >
                  Não
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setPendingDeleteId(item.id)}
                className="text-xs text-graphite hover:text-red-700 shrink-0"
              >
                Excluir
              </button>
            )}
          </div>
        ))}
      </div>

      {modal && (
        <FaqFormModal
          initialItem={modal.mode === "edit" ? modal.item : null}
          nextOrder={nextOrder}
          onClose={() => setModal(null)}
          onSaved={() => {
            setModal(null);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
