import { createClient } from "@/lib/supabase/server";
import type { Product, ProductCategory } from "@/types/database";
import { PRODUCT_CATEGORIES } from "@/types/database";

// Transição: enquanto a migração para `categories` (lista) não roda no banco,
// os registros ainda têm só `category` (texto). Normalizamos para sempre
// entregar `categories` preenchido ao resto do app.
function normalizeProduct(row: Product & { category?: ProductCategory | null }): Product {
  const categories =
    Array.isArray(row.categories) && row.categories.length > 0
      ? row.categories
      : row.category
        ? [row.category]
        : [];
  return { ...row, categories };
}

export async function getActiveProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .order("display_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Falha ao carregar o catálogo: ${error.message}`);
  }

  return (data ?? []).map(normalizeProduct);
}

export async function getAllProductsForAdmin(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("display_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Falha ao carregar produtos: ${error.message}`);
  }

  return (data ?? []).map(normalizeProduct);
}

export function groupProductsByCategory(
  products: Product[]
): Record<ProductCategory, Product[]> {
  const groups = Object.fromEntries(
    PRODUCT_CATEGORIES.map((c) => [c.value, [] as Product[]])
  ) as Record<ProductCategory, Product[]>;

  for (const product of products) {
    for (const category of product.categories) {
      groups[category]?.push(product);
    }
  }

  return groups;
}
