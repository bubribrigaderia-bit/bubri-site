"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const CATEGORY_VALUES = ["presentes", "casamentos_eventos", "corporativo", "degustacao"] as const;

const productSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1, "Informe o nome do produto").max(120),
  description: z.string().trim().max(400).default(""),
  price_label: z.string().trim().max(60).default(""),
  category: z.enum(CATEGORY_VALUES),
  photo_url: z.string().url().nullable().default(null),
  active: z.boolean().default(true),
  display_order: z.number().int().default(0),
});

export type ActionResult = { success: true } | { success: false; error: string };

export async function upsertProduct(input: unknown): Promise<ActionResult> {
  const parsed = productSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { id, ...values } = parsed.data;

  const { error } = id
    ? await supabase.from("products").update(values).eq("id", id)
    : await supabase.from("products").insert(values);

  if (error) return { success: false, error: error.message };

  revalidatePath("/cardapio");
  return { success: true };
}

export async function toggleProductActive(id: string, active: boolean): Promise<ActionResult> {
  if (!z.string().uuid().safeParse(id).success) {
    return { success: false, error: "ID de produto inválido" };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("products").update({ active }).eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/cardapio");
  return { success: true };
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  if (!z.string().uuid().safeParse(id).success) {
    return { success: false, error: "ID de produto inválido" };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/cardapio");
  return { success: true };
}

const pillarSchema = z.object({
  id: z.string().uuid(),
  title: z.string().trim().min(1).max(80),
  description: z.string().trim().min(1).max(300),
  photo_url: z.string().url().nullable().default(null),
});

export async function updatePillar(input: unknown): Promise<ActionResult> {
  const parsed = pillarSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { id, ...values } = parsed.data;
  const supabase = await createClient();
  const { error } = await supabase.from("pillars").update(values).eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/");
  return { success: true };
}

const faqSchema = z.object({
  id: z.string().uuid().optional(),
  question: z.string().trim().min(1, "Informe a pergunta").max(200),
  answer: z.string().trim().min(1, "Informe a resposta").max(600),
  display_order: z.number().int().default(0),
  active: z.boolean().default(true),
});

export async function upsertFaqItem(input: unknown): Promise<ActionResult> {
  const parsed = faqSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { id, ...values } = parsed.data;

  const { error } = id
    ? await supabase.from("faq_items").update(values).eq("id", id)
    : await supabase.from("faq_items").insert(values);

  if (error) return { success: false, error: error.message };

  revalidatePath("/contato");
  return { success: true };
}

export async function deleteFaqItem(id: string): Promise<ActionResult> {
  if (!z.string().uuid().safeParse(id).success) {
    return { success: false, error: "ID de pergunta inválido" };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("faq_items").delete().eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/contato");
  return { success: true };
}

const pageContentEntrySchema = z.object({
  page: z.enum(["home", "sobre", "contato"]),
  section_key: z.string().trim().min(1).max(60),
  content: z.string().trim().max(2000),
});

export async function updatePageContent(entries: unknown): Promise<ActionResult> {
  const parsed = z.array(pageContentEntrySchema).min(1).safeParse(entries);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("page_content")
    .upsert(parsed.data, { onConflict: "page,section_key" });

  if (error) return { success: false, error: error.message };

  revalidatePath(`/${parsed.data[0].page === "home" ? "" : parsed.data[0].page}`);
  return { success: true };
}

const settingsSchema = z.object({
  whatsapp_number: z
    .string()
    .trim()
    .regex(/^\d{10,13}$/, "Use só números, com DDI e DDD (ex: 5511999999999)"),
  business_hours: z.string().trim().min(1).max(120),
  instagram_handle: z.string().trim().min(1).max(60),
  google_reviews_url: z.string().trim().url("Informe uma URL válida"),
  delivery_text: z.string().trim().min(1).max(300),
});

export async function updateSiteSettings(input: unknown): Promise<ActionResult> {
  const parsed = settingsSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { data: existing } = await supabase.from("site_settings").select("id").limit(1).single();

  if (!existing) return { success: false, error: "Configurações do site não encontradas" };

  const { error } = await supabase
    .from("site_settings")
    .update(parsed.data)
    .eq("id", existing.id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/", "layout");
  return { success: true };
}

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export async function uploadImage(formData: FormData): Promise<
  { success: true; url: string } | { success: false; error: string }
> {
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return { success: false, error: "Nenhum arquivo enviado" };
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { success: false, error: "Envie um arquivo JPG, PNG ou WEBP" };
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return { success: false, error: "O arquivo deve ter até 5MB" };
  }

  const supabase = await createClient();
  const extension = file.name.split(".").pop() ?? "jpg";
  const path = `${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage.from("bubri-media").upload(path, file, {
    contentType: file.type,
    upsert: false,
  });

  if (error) return { success: false, error: error.message };

  const { data } = supabase.storage.from("bubri-media").getPublicUrl(path);
  return { success: true, url: data.publicUrl };
}
