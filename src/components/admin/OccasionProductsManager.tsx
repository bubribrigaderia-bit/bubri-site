"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product, ProductCategory, ProductOccasionMeta } from "@/types/database";
import { occasionNiches } from "@/types/database";
import { setProductOccasionMeta } from "@/app/admin/actions";
import { PhotoOrPlaceholder } from "@/components/site/PhotoOrPlaceholder";

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

  const metaByProduct = new Map(meta.map((m) => [m.product_id, m]));
  const niches = occasionNiches(slug);

  const ordered = [...products].sort(
    (a, b) =>
      (metaByProduct.get(a.id)?.position ?? Number.MAX_SAFE_INTEGER) -
        (metaByProduct.get(b.id)?.position ?? Number.MAX_SAFE_INTEGER) ||
      a.name.localeCompare(b.name, "pt-BR")
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
          event_niche: metaByProduct.get(p.id)?.event_niche ?? "",
        })
      )
    );
    setBusy(false);
    const failed = results.find((r) => !r.success);
    if (failed && !failed.success) {
      setError(failed.error);
      return;
    }
    router.refresh();
  }

  async function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= ordered.length) return;
    const next = [...ordered];
    [next[index], next[target]] = [next[target], next[index]];
    await persistOrder(next);
  }

  async function setNiche(product: Product, value: string) {
    setBusy(true);
    setError(null);
    const result = await setProductOccasionMeta({
      product_id: product.id,
      occasion_slug: slug,
      position:
        metaByProduct.get(product.id)?.position ??
        ordered.findIndex((p) => p.id === product.id),
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
          Define a ordem em que os produtos aparecem nesta ocasião
          {niches.length ? ' e em qual bloco ("Mesa de doces" ou "Lembrancinhas") cada um entra' : ""}.
          Não altera as categorias do produto — isso continua em Produtos.
        </p>
      </div>

      {error && <p className="text-sm text-red-700">{error}</p>}

      <div className="flex flex-col gap-2">
        {ordered.map((product, i) => (
          <div key={product.id} className="border border-line-soft p-2 flex items-center gap-3">
            <div className="flex gap-1 shrink-0">
              <button
                type="button"
                disabled={busy || i === 0}
                onClick={() => move(i, -1)}
                className="px-1.5 border border-line-soft rounded disabled:opacity-30"
                aria-label="Mover para cima"
              >
                ↑
              </button>
              <button
                type="button"
                disabled={busy || i === ordered.length - 1}
                onClick={() => move(i, 1)}
                className="px-1.5 border border-line-soft rounded disabled:opacity-30"
                aria-label="Mover para baixo"
              >
                ↓
              </button>
            </div>
            <PhotoOrPlaceholder
              src={product.photo_url}
              alt={product.name}
              className="h-10 w-10 shrink-0 rounded"
            />
            <p className="flex-1 min-w-0 text-sm font-bold truncate">{product.name}</p>
            {niches.length > 0 && (
              <select
                value={metaByProduct.get(product.id)?.event_niche ?? ""}
                disabled={busy}
                onChange={(e) => setNiche(product, e.target.value)}
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
        ))}
      </div>
    </div>
  );
}
