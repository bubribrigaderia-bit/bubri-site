import { createClient } from "@/lib/supabase/server";
import type { Pillar } from "@/types/database";

export async function getPillars(): Promise<Pillar[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pillars")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    throw new Error(`Falha ao carregar os pilares da Home: ${error.message}`);
  }

  return data;
}
