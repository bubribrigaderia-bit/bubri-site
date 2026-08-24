import { createClient } from "@/lib/supabase/server";
import type { Product, ProductCategory } from "@/types/database";

export async function getActiveProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .order("category", { ascending: true })
    .order("display_order", { ascending: true });

  if (error) {
    throw new Error(`Falha ao carregar o catálogo: ${error.message}`);
  }

  return data;
}

export async function getAllProductsForAdmin(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("category", { ascending: true })
    .order("display_order", { ascending: true });

  if (error) {
    throw new Error(`Falha ao carregar produtos: ${error.message}`);
  }

  return data;
}

export function groupProductsByCategory(
  products: Product[]
): Record<ProductCategory, Product[]> {
  return {
    presentes: products.filter((p) => p.category === "presentes"),
    casamentos_eventos: products.filter((p) => p.category === "casamentos_eventos"),
    corporativo: products.filter((p) => p.category === "corporativo"),
    degustacao: products.filter((p) => p.category === "degustacao"),
  };
}
