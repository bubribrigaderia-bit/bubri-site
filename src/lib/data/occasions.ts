import { createClient } from "@/lib/supabase/server";
import type {
  CorporateClient,
  OccasionPhoto,
  ProductCategory,
  ProductOccasionMeta,
} from "@/types/database";

// Antes da migração a tabela não existe: PostgREST responde PGRST205
// (schema cache) ou o Postgres responde 42P01 (undefined_table).
function isMissingTable(error: { code?: string } | null): boolean {
  return error?.code === "PGRST205" || error?.code === "42P01";
}

export async function getOccasionPhotos(slug: ProductCategory): Promise<OccasionPhoto[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("occasion_photos")
    .select("*")
    .eq("occasion_slug", slug)
    .eq("active", true)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    if (isMissingTable(error)) return [];
    throw new Error(`Falha ao carregar as fotos da ocasião: ${error.message}`);
  }
  return data;
}

export async function getAllOccasionPhotosForAdmin(): Promise<OccasionPhoto[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("occasion_photos")
    .select("*")
    .order("occasion_slug", { ascending: true })
    .order("display_order", { ascending: true });

  if (error) {
    if (isMissingTable(error)) return [];
    throw new Error(`Falha ao carregar as fotos das ocasiões: ${error.message}`);
  }
  return data;
}

export async function getProductOccasionMeta(
  slug: ProductCategory
): Promise<ProductOccasionMeta[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("product_occasion_meta")
    .select("*")
    .eq("occasion_slug", slug);

  if (error) {
    if (isMissingTable(error)) return [];
    throw new Error(`Falha ao carregar a ordem dos produtos da ocasião: ${error.message}`);
  }
  return data;
}

export async function getAllProductOccasionMeta(): Promise<ProductOccasionMeta[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("product_occasion_meta").select("*");

  if (error) {
    if (isMissingTable(error)) return [];
    throw new Error(`Falha ao carregar a ordem dos produtos das ocasiões: ${error.message}`);
  }
  return data;
}

/** false enquanto a migração `migration-ordem-e-nichos.sql` não rodou no Supabase. */
export async function productOccasionMetaReady(): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("product_occasion_meta")
    .select("product_id")
    .limit(1);
  return !(error && isMissingTable(error));
}

export async function getCorporateClients(): Promise<CorporateClient[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("corporate_clients")
    .select("*")
    .eq("active", true)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    if (isMissingTable(error)) return [];
    throw new Error(`Falha ao carregar os clientes corporativos: ${error.message}`);
  }
  return data;
}

export async function getAllCorporateClientsForAdmin(): Promise<CorporateClient[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("corporate_clients")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    if (isMissingTable(error)) return [];
    throw new Error(`Falha ao carregar os clientes corporativos: ${error.message}`);
  }
  return data;
}
