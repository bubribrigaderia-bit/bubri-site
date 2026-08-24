import { createClient } from "@/lib/supabase/server";
import type { SiteSettings } from "@/types/database";

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .limit(1)
    .single();

  if (error) {
    throw new Error(`Falha ao carregar configurações do site: ${error.message}`);
  }

  return data;
}
