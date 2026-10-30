"use client";

import { useState } from "react";
import type { Product, ProductCategory } from "@/types/database";
import { PRODUCT_CATEGORIES } from "@/types/database";
import { ProductCard } from "./ProductCard";

export function CardapioTabs({
  groupedProducts,
  whatsappNumber,
}: {
  groupedProducts: Record<ProductCategory, Product[]>;
  whatsappNumber: string;
}) {
  const [active, setActive] = useState<ProductCategory | "todos">("todos");
  const [collapsed, setCollapsed] = useState<ProductCategory[]>([]);

  const categoriesToShow =
    active === "todos" ? PRODUCT_CATEGORIES : PRODUCT_CATEGORIES.filter((c) => c.value === active);

  const categoriesWithProducts = categoriesToShow.filter(
    (c) => groupedProducts[c.value].length > 0
  );
  const allCollapsed = categoriesWithProducts.every((c) => collapsed.includes(c.value));

  function toggleCategory(value: ProductCategory) {
    setCollapsed((current) =>
      current.includes(value) ? current.filter((c) => c !== value) : [...current, value]
    );
  }

  function selectCategory(value: ProductCategory) {
    setActive(value);
    setCollapsed((current) => current.filter((c) => c !== value));
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setActive("todos")}
          className={`text-sm px-4 py-1.5 rounded-full border transition-colors ${
            active === "todos"
              ? "bg-accent border-accent text-paper font-semibold"
              : "border-line-soft text-graphite hover:border-accent"
          }`}
        >
          Todos
        </button>
        {PRODUCT_CATEGORIES.map((category) => (
          <button
            key={category.value}
            type="button"
            onClick={() => selectCategory(category.value)}
            className={`text-sm px-4 py-1.5 rounded-full border transition-colors ${
              active === category.value
                ? "bg-accent border-accent text-paper font-semibold"
                : "border-line-soft text-graphite hover:border-accent"
            }`}
          >
            {category.label}
          </button>
        ))}
        {active === "todos" && (
          <button
            type="button"
            onClick={() =>
              setCollapsed(allCollapsed ? [] : PRODUCT_CATEGORIES.map((c) => c.value))
            }
            className="text-sm font-semibold text-accent-ink px-2 py-1.5 hover:underline sm:ml-auto"
          >
            {allCollapsed ? "Abrir tudo" : "Recolher tudo"}
          </button>
        )}
      </div>

      {categoriesToShow.map((category) => {
        const products = groupedProducts[category.value];
        if (products.length === 0) return null;
        const isCollapsed = collapsed.includes(category.value);

        return (
          <section key={category.value} className="flex flex-col gap-4">
            <button
              type="button"
              onClick={() => toggleCategory(category.value)}
              aria-expanded={!isCollapsed}
              className="flex items-center justify-between gap-4 text-left border-b border-line-soft pb-2"
            >
              <span className="font-display text-2xl italic">{category.label}</span>
              <span
                aria-hidden="true"
                className={`text-xl transition-transform ${isCollapsed ? "-rotate-90" : ""}`}
              >
                ▾
              </span>
            </button>
            <div
              className={`${isCollapsed ? "hidden" : "grid"} gap-6 sm:grid-cols-2 lg:grid-cols-4 items-stretch`}
            >
              {products.map((product) => (
                <ProductCard key={product.id} product={product} whatsappNumber={whatsappNumber} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
