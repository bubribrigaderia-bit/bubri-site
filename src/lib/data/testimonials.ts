import { createClient } from "@/lib/supabase/server";
import type { Testimonial } from "@/types/database";

export async function getActiveTestimonials(): Promise<Testimonial[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("active", true)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    // A tabela pode ainda não existir (antes da migração) — o site não deve cair por isso.
    if (error.code === "42P01") return [];
    throw new Error(`Falha ao carregar os depoimentos: ${error.message}`);
  }

  return data;
}

export async function getAllTestimonialsForAdmin(): Promise<Testimonial[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    if (error.code === "42P01") return [];
    throw new Error(`Falha ao carregar os depoimentos: ${error.message}`);
  }

  return data;
}
