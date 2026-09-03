"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product, ProductCategory } from "@/types/database";
import { PRODUCT_CATEGORIES } from "@/types/database";
import { deleteProduct, toggleProductActive } from "@/app/admin/actions";
import { ProductFormModal } from "./ProductFormModal";
import { PhotoOrPlaceholder } from "@/components/site/PhotoOrPlaceholder";

type ModalState = { mode: "create" } | { mode: "edit"; product: Product } | null;

export function ProductsManager({ initialProducts }: { initialProducts: Product[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<ProductCategory | "todos">("todos");
  const [modal, setModal] = useState<ModalState>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const visibleProducts =
    filter === "todos"
      ? initialProducts
      : initialProducts.filter((p) => p.categories.includes(filter));

  async function handleToggleActive(product: Product) {
    setBusyId(product.id);
    await toggleProductActive(product.id, !product.active);
    setBusyId(null);
    router.refresh();
  }

  async function handleDelete(id: string) {
    setBusyId(id);
    await deleteProduct(id);
    setBusyId(null);
    setPendingDeleteId(null);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFilter("todos")}
            className={`text-xs px-3 py-1.5 border ${filter === "todos" ? "border-ink font-semibold" : "border-line-soft text-graphite"}`}
          >
            Todos
          </button>
          {PRODUCT_CATEGORIES.map((category) => (
            <button
              key={category.value}
              type="button"
              onClick={() => setFilter(category.value)}
              className={`text-xs px-3 py-1.5 border ${filter === category.value ? "border-ink font-semibold" : "border-line-soft text-graphite"}`}
            >
              {category.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setModal({ mode: "create" })}
          className="border border-accent text-accent-ink font-semibold px-4 py-2 text-sm hover:bg-accent-soft transition-colors"
        >
          + Novo produto
        </button>
      </div>

      {visibleProducts.length === 0 ? (
        <div className="border border-dashed border-line-soft p-6 text-center text-sm text-graphite flex flex-col items-center gap-3">
          <p>Nenhum produto nessa categoria ainda.</p>
          <button
            type="button"
            onClick={() => setModal({ mode: "create" })}
            className="border border-accent text-accent-ink font-semibold px-4 py-2 text-sm hover:bg-accent-soft transition-colors"
          >
            + Adicionar produto
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {visibleProducts.map((product) => (
            <div
              key={product.id}
              className="border border-line-soft p-3 flex items-center gap-3"
            >
              <PhotoOrPlaceholder
                src={product.photo_url}
                alt={product.name}
                className="h-14 w-14 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate">{product.name}</p>
                <p className="text-xs text-graphite truncate">
                  {product.categories
                    .map((value) => PRODUCT_CATEGORIES.find((c) => c.value === value)?.label)
                    .filter(Boolean)
                    .join(", ")}
                  {product.price_label ? ` · ${product.price_label}` : ""}
                </p>
              </div>

              <label className="flex items-center gap-2 text-xs text-graphite shrink-0">
                <input
                  type="checkbox"
                  checked={product.active}
                  disabled={busyId === product.id}
                  onChange={() => handleToggleActive(product)}
                />
                Ativo
              </label>

              <button
                type="button"
                onClick={() => setModal({ mode: "edit", product })}
                className="text-xs font-semibold text-accent-ink hover:underline shrink-0"
              >
                Editar
              </button>

              {pendingDeleteId === product.id ? (
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-graphite">Excluir?</span>
                  <button
                    type="button"
                    onClick={() => handleDelete(product.id)}
                    disabled={busyId === product.id}
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
                  onClick={() => setPendingDeleteId(product.id)}
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
        <ProductFormModal
          initialProduct={modal.mode === "edit" ? modal.product : null}
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
