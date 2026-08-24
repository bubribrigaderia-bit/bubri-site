import { createClient } from "@/lib/supabase/server";
import type { FaqItem } from "@/types/database";

export async function getAllFaqItemsForAdmin(): Promise<FaqItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("faq_items")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    throw new Error(`Falha ao carregar as perguntas frequentes: ${error.message}`);
  }

  return data;
}

export async function getActiveFaqItems(): Promise<FaqItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("faq_items")
    .select("*")
    .eq("active", true)
    .order("display_order", { ascending: true });

  if (error) {
    throw new Error(`Falha ao carregar as perguntas frequentes: ${error.message}`);
  }

  return data;
}
