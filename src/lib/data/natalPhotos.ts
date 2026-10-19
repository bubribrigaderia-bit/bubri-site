import { createClient } from "@/lib/supabase/server";

// Antes da migração a tabela não existe: PostgREST responde PGRST205
// (schema cache) ou o Postgres responde 42P01 (undefined_table).
function isMissingTable(error: { code?: string } | null): boolean {
  return error?.code === "PGRST205" || error?.code === "42P01";
}

/** Fotos trocadas pelo admin, por id de produto (ou "capa"). */
export async function getNatalPhotos(): Promise<Record<string, string>> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("natal_photos").select("product_id, photo_url");

  if (error) {
    if (isMissingTable(error)) return {};
    throw new Error(`Falha ao carregar as fotos de Natal: ${error.message}`);
  }
  return Object.fromEntries(data.map((row) => [row.product_id, row.photo_url]));
}

export type NatalGalleryItem = { id: string; photo_url: string };

/** Fotos extras do carrossel, por id de produto, já na ordem de exibição. */
export async function getNatalGallery(): Promise<Record<string, NatalGalleryItem[]>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("natal_gallery")
    .select("id, product_id, photo_url")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    if (isMissingTable(error)) return {};
    throw new Error(`Falha ao carregar as fotos extras de Natal: ${error.message}`);
  }

  const byProduct: Record<string, NatalGalleryItem[]> = {};
  for (const row of data) {
    (byProduct[row.product_id] ??= []).push({ id: row.id, photo_url: row.photo_url });
  }
  return byProduct;
}
