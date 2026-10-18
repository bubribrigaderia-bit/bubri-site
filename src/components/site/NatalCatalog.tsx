"use client";

import { useMemo, useState } from "react";
import {
  NATAL_GROUPS,
  NATAL_PRODUCTS,
  NATAL_SPECIAL_CONDITION_QTY,
  formatBRL,
  lowestPrice,
  type NatalProduct,
} from "@/lib/data/natal";
import { buildWhatsAppLink } from "@/lib/whatsapp";

type OrderLine = {
  key: string;
  productId: string;
  label: string;
  flavor?: string;
  unitPrice: number;
  qty: number;
};

type DeliveryOption = "sp" | "outro_estado" | "a_combinar";

const DELIVERY_LABELS: Record<DeliveryOption, string> = {
  sp: "São Paulo (capital e região)",
  outro_estado: "Outro estado (envio pelos Correios)",
  a_combinar: "Vários endereços / a combinar",
};

function lineKey(productId: string, label: string, flavor?: string) {
  return [productId, label, flavor ?? ""].join("|");
}

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return y && m && d ? `${d}/${m}/${y}` : iso;
}

function ProductCard({
  product,
  onAdd,
}: {
  product: NatalProduct;
  onAdd: (line: Omit<OrderLine, "key">) => void;
}) {
  const [variantIndex, setVariantIndex] = useState(0);
  const [flavor, setFlavor] = useState(product.flavors?.[0] ?? "");
  const [qty, setQty] = useState(product.group === "lembrancas" ? 10 : 1);
  const [added, setAdded] = useState(false);

  const variant = product.variants[variantIndex];
  const hasVariants = product.variants.length > 1;

  function handleAdd() {
    const safeQty = Math.max(1, Math.floor(qty) || 1);
    onAdd({
      productId: product.id,
      label: variant.label,
      flavor: product.flavors ? flavor : undefined,
      unitPrice: variant.price,
      qty: safeQty,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  return (
    <article className="bg-paper-raised rounded-2xl flex h-full flex-col overflow-hidden border border-line-soft">
      <div className="relative">
        <img
          src={product.photo}
          alt={product.name}
          loading="lazy"
          className="aspect-[4/5] w-full object-cover bg-wine"
        />
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-wine px-3 py-1 text-xs font-semibold text-[#f3dfb4] shadow">
            {product.badge}
          </span>
        )}
        <span className="absolute right-3 bottom-3 rounded-full bg-[#c9a86a] px-3 py-1.5 font-display text-sm font-bold text-[#3c2815] shadow">
          {product.fromPrice ? "a partir de " : ""}
          {formatBRL(lowestPrice(product))}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-display text-xl text-ink">{product.name}</h3>
        <p className="text-sm text-graphite leading-relaxed">{product.description}</p>

        {hasVariants && (
          <ul className="text-sm text-ink flex flex-col gap-1">
            {product.variants.map((v) => (
              <li key={v.label} className="flex items-baseline gap-2">
                <span>{v.label.replace(`${product.name} — `, "")}</span>
                <span className="flex-1 border-b border-dotted border-line" />
                <span className="font-semibold">{formatBRL(v.price)}</span>
              </li>
            ))}
          </ul>
        )}

        {(product.flavors || product.includedFlavors) && (
          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent-ink">
              {product.flavors ? "Sabores" : "Nesta edição"}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {(product.flavors ?? product.includedFlavors ?? []).map((f) => (
                <span
                  key={f}
                  className="rounded-full bg-accent-soft px-2.5 py-1 text-xs text-ink"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-auto flex flex-col gap-2.5 pt-3 border-t border-line-soft">
          {hasVariants && (
            <label className="flex flex-col gap-1 text-xs text-graphite">
              Opção
              <select
                value={variantIndex}
                onChange={(e) => setVariantIndex(Number(e.target.value))}
                className="rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink"
              >
                {product.variants.map((v, i) => (
                  <option key={v.label} value={i}>
                    {v.label} — {formatBRL(v.price)}
                  </option>
                ))}
              </select>
            </label>
          )}

          {product.flavors && (
            <label className="flex flex-col gap-1 text-xs text-graphite">
              Sabor
              <select
                value={flavor}
                onChange={(e) => setFlavor(e.target.value)}
                className="rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink"
              >
                {product.flavors.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </label>
          )}

          <div className="flex items-end gap-2">
            <label className="flex flex-col gap-1 text-xs text-graphite w-24">
              Quantidade
              <input
                type="number"
                min={1}
                inputMode="numeric"
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink"
              />
            </label>
            <button
              type="button"
              onClick={handleAdd}
              className={`flex-1 rounded-full px-4 py-2.5 text-sm font-bold transition-colors ${
                added ? "bg-[#2f6b3a] text-white" : "bg-wine text-white hover:bg-wine-deep"
              }`}
            >
              {added ? "✓ Adicionado" : "Adicionar ao pedido"}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export function NatalCatalog({ whatsappNumber }: { whatsappNumber: string }) {
  const [lines, setLines] = useState<OrderLine[]>([]);
  const [company, setCompany] = useState("");
  const [contact, setContact] = useState("");
  const [date, setDate] = useState("");
  const [delivery, setDelivery] = useState<DeliveryOption>("sp");
  const [city, setCity] = useState("");
  const [notes, setNotes] = useState("");

  function addLine(line: Omit<OrderLine, "key">) {
    const key = lineKey(line.productId, line.label, line.flavor);
    setLines((prev) => {
      const existing = prev.find((l) => l.key === key);
      if (existing) {
        return prev.map((l) => (l.key === key ? { ...l, qty: l.qty + line.qty } : l));
      }
      return [...prev, { ...line, key }];
    });
  }

  function setLineQty(key: string, qty: number) {
    setLines((prev) =>
      prev.map((l) => (l.key === key ? { ...l, qty: Math.max(1, Math.floor(qty) || 1) } : l))
    );
  }

  function removeLine(key: string) {
    setLines((prev) => prev.filter((l) => l.key !== key));
  }

  const totalUnits = lines.reduce((sum, l) => sum + l.qty, 0);
  const totalValue = lines.reduce((sum, l) => sum + l.qty * l.unitPrice, 0);
  const hasSpecialCondition = totalUnits >= NATAL_SPECIAL_CONDITION_QTY;

  const message = useMemo(() => {
    const parts: string[] = [
      "Olá, Bubri! Vim pela página de Natal Corporativo e gostaria de receber uma proposta.",
      "",
    ];
    if (company.trim()) parts.push(`*Empresa:* ${company.trim()}`);
    if (contact.trim()) parts.push(`*Contato:* ${contact.trim()}`);
    if (lines.length > 0) {
      parts.push("", "*Itens de interesse:*");
      for (const l of lines) {
        const flavor = l.flavor ? ` (${l.flavor})` : "";
        parts.push(`• ${l.qty}x ${l.label}${flavor} — ${formatBRL(l.unitPrice)} cada`);
      }
      parts.push(
        "",
        `*Total de itens:* ${totalUnits}`,
        `*Valor estimado (catálogo):* ${formatBRL(totalValue)}`
      );
    } else {
      parts.push("", "Ainda não escolhi os produtos — quero ajuda para montar o pedido.");
    }
    parts.push("");
    if (date) parts.push(`*Data de entrega desejada:* ${formatDate(date)}`);
    const deliveryText =
      delivery === "outro_estado" && city.trim()
        ? `${DELIVERY_LABELS[delivery]} — ${city.trim()}`
        : DELIVERY_LABELS[delivery];
    parts.push(`*Entrega:* ${deliveryText}`);
    if (notes.trim()) parts.push(`*Observações:* ${notes.trim()}`);
    return parts.join("\n");
  }, [company, contact, lines, totalUnits, totalValue, date, delivery, city, notes]);

  const whatsappHref = buildWhatsAppLink(whatsappNumber, message);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <>
      <div id="colecao" className="mx-auto max-w-5xl px-6 w-full flex flex-col gap-14 scroll-mt-24">
        {NATAL_GROUPS.map((group) => (
          <section key={group.value} className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h2 className="font-display text-3xl md:text-4xl text-ink">{group.title}</h2>
              <p className="text-graphite">{group.subtitle}</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
              {NATAL_PRODUCTS.filter((p) => p.group === group.value).map((product) => (
                <ProductCard key={product.id} product={product} onAdd={addLine} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <section id="pedido" className="mx-auto max-w-5xl px-6 w-full scroll-mt-24">
        <div className="rounded-3xl bg-wine text-white p-6 md:p-10 flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#e2c892]">
              Confirme as opções
            </span>
            <h2 className="font-display text-3xl md:text-4xl text-[#f3dfb4]">Monte o pedido da sua empresa</h2>
            <p className="text-white/85 max-w-prose">
              Escolha os presentes acima, preencha os dados e envie direto pelo WhatsApp. A Bubri
              responde com a proposta final: valores, prazo e prévia da personalização com a sua marca.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
            {/* Resumo */}
            <div className="flex flex-col gap-4">
              <h3 className="font-display text-xl text-[#f3dfb4]">Seu pedido</h3>
              {lines.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/30 p-6 text-sm text-white/80">
                  Nenhum item ainda. Use o botão <strong>“Adicionar ao pedido”</strong> nos produtos
                  acima — ou envie mesmo assim que a gente ajuda a escolher.
                  <a href="#colecao" className="block mt-3 font-semibold text-[#e2c892] hover:underline">
                    Ver a coleção ↑
                  </a>
                </div>
              ) : (
                <ul className="flex flex-col divide-y divide-white/15 rounded-2xl bg-white/5">
                  {lines.map((l) => (
                    <li key={l.key} className="flex flex-wrap items-center gap-3 p-4">
                      <div className="flex-1 min-w-[10rem]">
                        <p className="font-semibold">{l.label}</p>
                        <p className="text-xs text-white/70">
                          {l.flavor ? `${l.flavor} · ` : ""}
                          {formatBRL(l.unitPrice)} cada
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          aria-label={`Diminuir ${l.label}`}
                          onClick={() => setLineQty(l.key, l.qty - 1)}
                          className="h-8 w-8 rounded-full border border-white/30 hover:bg-white/10"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min={1}
                          aria-label={`Quantidade de ${l.label}`}
                          value={l.qty}
                          onChange={(e) => setLineQty(l.key, Number(e.target.value))}
                          className="w-16 rounded-lg border border-white/30 bg-transparent px-2 py-1 text-center text-sm"
                        />
                        <button
                          type="button"
                          aria-label={`Aumentar ${l.label}`}
                          onClick={() => setLineQty(l.key, l.qty + 1)}
                          className="h-8 w-8 rounded-full border border-white/30 hover:bg-white/10"
                        >
                          +
                        </button>
                      </div>
                      <span className="w-24 text-right font-semibold">
                        {formatBRL(l.qty * l.unitPrice)}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeLine(l.key)}
                        className="text-xs text-white/70 hover:text-white underline"
                      >
                        remover
                      </button>
                    </li>
                  ))}
                  <li className="flex flex-col gap-1 p-4">
                    <div className="flex items-baseline justify-between">
                      <span className="text-white/80">{totalUnits} itens</span>
                      <span className="font-display text-2xl text-[#f3dfb4]">
                        {formatBRL(totalValue)}
                      </span>
                    </div>
                    <p className="text-xs text-white/65">
                      Valor estimado pelos preços do catálogo, sem frete. O valor final é confirmado
                      na proposta.
                    </p>
                  </li>
                </ul>
              )}

              <div
                className={`rounded-2xl p-4 text-sm ${
                  hasSpecialCondition
                    ? "bg-[#c9a86a] text-[#3c2815]"
                    : "border border-white/20 text-white/85"
                }`}
              >
                {hasSpecialCondition ? (
                  <>
                    <strong>Seu pedido tem condição especial!</strong> A partir de{" "}
                    {NATAL_SPECIAL_CONDITION_QTY} unidades preparamos uma proposta exclusiva para a
                    sua empresa.
                  </>
                ) : (
                  <>
                    Presentear a equipe inteira tem condição especial: a partir de{" "}
                    <strong>{NATAL_SPECIAL_CONDITION_QTY} unidades</strong>, preparamos uma proposta
                    exclusiva.
                  </>
                )}
              </div>
            </div>

            {/* Dados */}
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                window.open(whatsappHref, "_blank", "noopener,noreferrer");
              }}
            >
              <h3 className="font-display text-xl text-[#f3dfb4]">Dados da empresa</h3>
              <label className="flex flex-col gap-1 text-sm">
                Empresa
                <input
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Nome da empresa"
                  className="rounded-lg bg-white px-3 py-2.5 text-[#3c2815] placeholder:text-[#7c6549]/70"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                Seu nome
                <input
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="Quem vai receber a proposta"
                  className="rounded-lg bg-white px-3 py-2.5 text-[#3c2815] placeholder:text-[#7c6549]/70"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                Data de entrega desejada
                <input
                  type="date"
                  min={today}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="rounded-lg bg-white px-3 py-2.5 text-[#3c2815]"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                Entrega
                <select
                  value={delivery}
                  onChange={(e) => setDelivery(e.target.value as DeliveryOption)}
                  className="rounded-lg bg-white px-3 py-2.5 text-[#3c2815]"
                >
                  {(Object.keys(DELIVERY_LABELS) as DeliveryOption[]).map((k) => (
                    <option key={k} value={k}>
                      {DELIVERY_LABELS[k]}
                    </option>
                  ))}
                </select>
              </label>
              {delivery === "outro_estado" && (
                <label className="flex flex-col gap-1 text-sm">
                  Cidade / estado
                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ex.: Belo Horizonte / MG"
                    className="rounded-lg bg-white px-3 py-2.5 text-[#3c2815] placeholder:text-[#7c6549]/70"
                  />
                </label>
              )}
              <label className="flex flex-col gap-1 text-sm">
                Observações (opcional)
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex.: precisa de nota fiscal, cores da marca, entrega em mais de um endereço…"
                  className="rounded-lg bg-white px-3 py-2.5 text-[#3c2815] placeholder:text-[#7c6549]/70"
                />
              </label>
              <button
                type="submit"
                className="mt-1 rounded-full bg-[#c9a86a] px-8 py-4 font-bold text-[#3c2815] shadow-lg hover:-translate-y-0.5 hover:bg-[#d9ba7e] transition-all"
              >
                Enviar pedido pelo WhatsApp
              </button>
              <p className="text-xs text-white/65">
                A logo da empresa pode ser enviada depois, na mesma conversa.
              </p>
            </form>
          </div>
        </div>
      </section>

      {lines.length > 0 && (
        <a
          href="#pedido"
          className="fixed bottom-5 left-5 right-24 sm:right-auto z-40 flex items-center justify-between gap-4 rounded-full bg-wine px-5 py-3 text-sm text-white shadow-xl hover:bg-wine-deep"
        >
          <span>
            <strong>{totalUnits}</strong> itens · {formatBRL(totalValue)}
          </span>
          <span className="font-semibold text-[#e2c892]">Ver pedido →</span>
        </a>
      )}
    </>
  );
}
