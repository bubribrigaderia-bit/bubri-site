"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Product, ProductCategory, ProductOccasionMeta } from "@/types/database";
import { occasionNiches } from "@/types/database";
import { setProductOccasionMeta } from "@/app/admin/actions";
import { PhotoOrPlaceholder } from "@/components/site/PhotoOrPlaceholder";

function sortByMeta(products: Product[], meta: ProductOccasionMeta[]): Product[] {
  const posByProduct = new Map(meta.map((m) => [m.product_id, m.position]));
  return [...products].sort(
    (a, b) =>
      (posByProduct.get(a.id) ?? Number.MAX_SAFE_INTEGER) -
        (posByProduct.get(b.id) ?? Number.MAX_SAFE_INTEGER) ||
      a.name.localeCompare(b.name, "pt-BR")
  );
}

function SortableRow({
  product,
  niches,
  niche,
  busy,
  onNicheChange,
}: {
  product: Product;
  niches: { value: string; label: string }[];
  niche: string;
  busy: boolean;
  onNicheChange: (value: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: product.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`border border-line-soft bg-paper-raised p-2 flex items-center gap-3 ${
        isDragging ? "opacity-70 shadow-md z-10" : ""
      }`}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        disabled={busy}
        aria-label={`Arrastar ${product.name}`}
        className="shrink-0 cursor-grab active:cursor-grabbing touch-none px-1.5 py-1 text-graphite text-lg leading-none disabled:opacity-30"
      >
        ⠿
      </button>
      <PhotoOrPlaceholder
        src={product.photo_url}
        alt={product.name}
        className="h-10 w-10 shrink-0 rounded"
      />
      <p className="flex-1 min-w-0 text-sm font-bold truncate">{product.name}</p>
      {niches.length > 0 && (
        <select
          value={niche}
          disabled={busy}
          onChange={(e) => onNicheChange(e.target.value)}
          className="shrink-0 border border-line-soft bg-paper-raised text-xs px-2 py-1"
        >
          <option value="">— sem nicho —</option>
          {niches.map((n) => (
            <option key={n.value} value={n.value}>
              {n.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

export function OccasionProductsManager({
  slug,
  products,
  meta,
  tableMissing,
}: {
  slug: ProductCategory;
  /** Produtos que pertencem a esta ocasião (já filtrados por `categories`). */
  products: Product[];
  /** Linhas de `product_occasion_meta` desta ocasião. */
  meta: ProductOccasionMeta[];
  tableMissing: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const niches = occasionNiches(slug);
  const nicheByProduct = useMemo(
    () => new Map(meta.map((m) => [m.product_id, m.event_niche])),
    [meta]
  );

  const orderedFromProps = useMemo(() => sortByMeta(products, meta), [products, meta]);
  const [ordered, setOrdered] = useState<Product[]>(orderedFromProps);
  useEffect(() => {
    setOrdered(orderedFromProps);
  }, [orderedFromProps]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  async function persistOrder(list: Product[]) {
    setBusy(true);
    setError(null);
    const results = await Promise.all(
      list.map((p, index) =>
        setProductOccasionMeta({
          product_id: p.id,
          occasion_slug: slug,
          position: index,
          event_niche: nicheByProduct.get(p.id) ?? "",
        })
      )
    );
    setBusy(false);
    const failed = results.find((r) => !r.success);
    if (failed && !failed.success) {
      setError(failed.error);
      setOrdered(orderedFromProps); // desfaz o otimismo
      return;
    }
    router.refresh();
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = ordered.findIndex((p) => p.id === active.id);
    const newIndex = ordered.findIndex((p) => p.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const next = arrayMove(ordered, oldIndex, newIndex);
    setOrdered(next);
    void persistOrder(next);
  }

  async function setNiche(product: Product, value: string) {
    setBusy(true);
    setError(null);
    const result = await setProductOccasionMeta({
      product_id: product.id,
      occasion_slug: slug,
      position: ordered.findIndex((p) => p.id === product.id),
      event_niche: value,
    });
    setBusy(false);
    if (!result.success) {
      setError(result.error);
      return;
    }
    router.refresh();
  }

  if (tableMissing) {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold tracking-wider uppercase text-accent-ink">
          Ordem dos produtos{niches.length ? " e nichos" : ""}
        </p>
        <p className="text-sm text-graphite border border-dashed border-line-soft p-3">
          Rode a migração <code>migration-ordem-e-nichos.sql</code> no Supabase para liberar a
          ordenação{niches.length ? " e os nichos" : ""} dos produtos desta ocasião.
        </p>
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <p className="text-xs font-semibold tracking-wider uppercase text-accent-ink">
          Ordem dos produtos{niches.length ? " e nichos" : ""}
        </p>
        <p className="text-xs text-graphite">
          Arraste pelo <span aria-hidden="true">⠿</span> para mudar a ordem em que os produtos
          aparecem nesta ocasião
          {niches.length
            ? ' e escolha em qual bloco ("Mesa de doces" ou "Lembrancinhas") cada um entra'
            : ""}
          . Não altera as categorias do produto — isso continua em Produtos.
        </p>
      </div>

      {error && <p className="text-sm text-red-700">{error}</p>}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={ordered.map((p) => p.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-2">
            {ordered.map((product) => (
              <SortableRow
                key={product.id}
                product={product}
                niches={niches}
                niche={nicheByProduct.get(product.id) ?? ""}
                busy={busy}
                onNicheChange={(value) => setNiche(product, value)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
