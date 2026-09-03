"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CorporateClient } from "@/types/database";
import { deleteCorporateClient } from "@/app/admin/actions";
import { CorporateClientFormModal } from "./CorporateClientFormModal";
import { PhotoOrPlaceholder } from "@/components/site/PhotoOrPlaceholder";

type ModalState = { mode: "create" } | { mode: "edit"; item: CorporateClient } | null;

export function CorporateClientsManager({ initialItems }: { initialItems: CorporateClient[] }) {
  const router = useRouter();
  const [modal, setModal] = useState<ModalState>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    setBusyId(id);
    await deleteCorporateClient(id);
    setBusyId(null);
    setPendingDeleteId(null);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs font-semibold tracking-wider uppercase text-accent-ink">
            Empresas que já fecharam
          </p>
          <p className="text-xs text-graphite mt-1">
            Aparecem numa faixa de logos na página Corporativo.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModal({ mode: "create" })}
          className="border border-accent text-accent-ink font-semibold px-4 py-2 text-sm hover:bg-accent-soft transition-colors shrink-0"
        >
          + Nova empresa
        </button>
      </div>

      {initialItems.length === 0 ? (
        <p className="border border-dashed border-line-soft p-4 text-sm text-graphite text-center">
          Nenhuma empresa ainda.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {initialItems.map((item) => (
            <div key={item.id} className="border border-line-soft p-3 flex items-center gap-3">
              <PhotoOrPlaceholder
                src={item.logo_url}
                alt={item.name}
                className="h-12 w-12 shrink-0 rounded"
              />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate">
                  {item.name}
                  {!item.active && (
                    <span className="text-graphite font-normal"> · oculto</span>
                  )}
                </p>
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
        <CorporateClientFormModal
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
