import { createClient } from "@/lib/supabase/server";
import type { PageContent, PageKey } from "@/types/database";

export async function getPageContent(page: PageKey): Promise<Record<string, string>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("page_content")
    .select("*")
    .eq("page", page);

  if (error) {
    throw new Error(`Falha ao carregar os textos da página "${page}": ${error.message}`);
  }

  return Object.fromEntries(
    (data as PageContent[]).map((row) => [row.section_key, row.content])
  );
}
