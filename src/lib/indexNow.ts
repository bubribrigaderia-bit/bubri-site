import { after } from "next/server";
import sitemap from "@/app/sitemap";
import { SITE_URL } from "@/lib/seo";

// Chave do IndexNow. O arquivo public/<chave>.txt prova aos buscadores que o
// site é nosso; se trocar a chave, renomeie o arquivo junto.
export const INDEXNOW_KEY = "394780592f98b2c803485acbda42263d";

/**
 * Avisa Bing e demais buscadores do IndexNow que o conteúdo mudou, para eles
 * voltarem ao site sem esperar a próxima visita. Manda todas as URLs do
 * sitemap: um produto aparece em várias páginas (ocasião, cardápio, llms.txt)
 * e a lista é pequena. Roda depois da resposta, então nunca atrasa o admin.
 */
export function notifyIndexNow() {
  // Só no site publicado (produção ou preview, que gravam no mesmo banco).
  if (!process.env.VERCEL) return;

  after(async () => {
    try {
      const res = await fetch("https://api.indexnow.org/indexnow", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          host: new URL(SITE_URL).host,
          key: INDEXNOW_KEY,
          keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
          urlList: sitemap().map((entry) => entry.url),
        }),
      });
      if (!res.ok) console.error(`IndexNow respondeu ${res.status}`);
    } catch (error) {
      console.error("IndexNow falhou", error);
    }
  });
}
