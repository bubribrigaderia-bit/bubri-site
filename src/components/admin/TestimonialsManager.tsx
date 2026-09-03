"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Testimonial } from "@/types/database";
import { deleteTestimonial } from "@/app/admin/actions";
import { TestimonialFormModal } from "./TestimonialFormModal";

type ModalState = { mode: "create" } | { mode: "edit"; item: Testimonial } | null;

export function TestimonialsManager({ initialItems }: { initialItems: Testimonial[] }) {
  const router = useRouter();
  const [modal, setModal] = useState<ModalState>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    setBusyId(id);
    await deleteTestimonial(id);
    setBusyId(null);
    setPendingDeleteId(null);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs font-semibold tracking-wider uppercase text-accent-ink">
            Depoimentos (avaliações no site)
          </p>
          <p className="text-xs text-graphite mt-1">
            Cole aqui as avaliações reais dos seus clientes (do Google, WhatsApp, etc.).
            Elas aparecem na Home.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModal({ mode: "create" })}
          className="border border-accent text-accent-ink font-semibold px-4 py-2 text-sm hover:bg-accent-soft transition-colors shrink-0"
        >
          + Novo depoimento
        </button>
      </div>

      {initialItems.length === 0 ? (
        <p className="border border-dashed border-line-soft p-4 text-sm text-graphite text-center">
          Nenhum depoimento ainda. Adicione o primeiro.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {initialItems.map((item) => (
            <div key={item.id} className="border border-line-soft p-3 flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm">
                  {item.author_name}{" "}
                  <span className="text-accent-ink font-normal">
                    {"★".repeat(item.rating)}
                  </span>
                  {!item.active && (
                    <span className="text-graphite font-normal"> · oculto</span>
                  )}
                </p>
                <p className="text-xs text-graphite line-clamp-2">{item.text}</p>
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
      )}

      {modal && (
        <TestimonialFormModal
          initialItem={modal.mode === "edit" ? modal.item : null}
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
