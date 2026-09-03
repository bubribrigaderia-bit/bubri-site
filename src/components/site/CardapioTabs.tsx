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

  const categoriesToShow =
    active === "todos" ? PRODUCT_CATEGORIES : PRODUCT_CATEGORIES.filter((c) => c.value === active);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap gap-2">
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
            onClick={() => setActive(category.value)}
            className={`text-sm px-4 py-1.5 rounded-full border transition-colors ${
              active === category.value
                ? "bg-accent border-accent text-paper font-semibold"
                : "border-line-soft text-graphite hover:border-accent"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {categoriesToShow.map((category) => {
        const products = groupedProducts[category.value];
        if (products.length === 0) return null;

        return (
          <section key={category.value} className="flex flex-col gap-4">
            <p className="font-display text-2xl italic">
              {category.label}
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
