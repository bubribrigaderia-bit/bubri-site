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
