import type { FaqItem, Product, SiteSettings } from "@/types/database";
import { NATAL_PRODUCTS, NATAL_YEAR } from "@/lib/data/natal";

// Fonte única da URL pública e dos textos de busca. Usados pelos metadados,
// sitemap/robots, llms.txt e pelos dados estruturados (JSON-LD) que buscadores
// e assistentes de IA (ChatGPT, Perplexity, Google) leem para entender a Bubri.
export const SITE_URL = "https://www.bubriconfeitaria.com";
export const SITE_NAME = "Bubri Confeitaria";
export const SITE_DESCRIPTION =
  "Confeitaria 100% artesanal em São Paulo. Doces finos para presentear, casamentos, eventos e brindes corporativos personalizados com a marca da sua empresa.";

export const OCCASION_DESCRIPTIONS: Record<string, string> = {
  presentes:
    "Presentes com doces finos artesanais em São Paulo: caixas de doces finos, gift box, cestas de café da manhã e kits para presentear com entrega.",
  eventos:
    "Doces finos artesanais para casamentos e eventos em São Paulo: mesa de doces, bem-casados e lembrancinhas personalizadas com o tema da festa.",
  corporativo:
    "Brindes corporativos com doces finos em São Paulo: kits personalizados com a logo da empresa para clientes, parceiros e colaboradores, com nota fiscal e envio para todo o Brasil.",
  degustacao:
    "Caixa degustação de doces finos artesanais entregue em até 24h em São Paulo, para conhecer os sabores antes do evento ou só para se presentear.",
};

function instagramUrl(handle: string): string | null {
  const clean = handle.replace(/^@/, "").trim();
  return clean ? `https://www.instagram.com/${clean}/` : null;
}

export function bakeryJsonLd(settings: SiteSettings) {
  const sameAs = [instagramUrl(settings.instagram_handle), settings.google_reviews_url].filter(
    (u): u is string => Boolean(u)
  );

  return {
    "@context": "https://schema.org",
    "@type": "Bakery",
    "@id": `${SITE_URL}/#bubri`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.png`,
    image: `${SITE_URL}/opengraph-image.png`,
    description: SITE_DESCRIPTION,
    telephone: settings.whatsapp_number,
    priceRange: "R$",
    servesCuisine: "Confeitaria artesanal",
    address: {
      "@type": "PostalAddress",
      addressLocality: "São Paulo",
      addressRegion: "SP",
      addressCountry: "BR",
    },
    areaServed: [
      { "@type": "City", name: "São Paulo" },
      { "@type": "Country", name: "Brasil" },
    ],
    knowsAbout: [
      "doces finos",
      "brindes corporativos",
      "kits corporativos personalizados",
      "doces para casamento",
      "mesa de doces",
      "brigadeiro gourmet",
      "presentes com doces",
      "pão de mel",
      "cookies personalizados",
    ],
    paymentAccepted: "Pix, transferência, cartão",
    sameAs,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: settings.whatsapp_number,
      contactType: "customer service",
      availableLanguage: "Portuguese",
      hoursAvailable: settings.business_hours,
    },
  };
}

export function faqJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function catalogJsonLd(name: string, path: string, products: Product[]) {
  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name,
    url: `${SITE_URL}/${path}`,
    seller: { "@id": `${SITE_URL}/#bubri` },
    itemListElement: products.map((p) => ({
      "@type": "Offer",
      priceCurrency: "BRL",
      description: p.price_label,
      seller: { "@id": `${SITE_URL}/#bubri` },
      itemOffered: {
        "@type": "Product",
        name: p.name,
        description: p.description,
        ...(p.photo_url ? { image: p.photo_url } : {}),
        brand: { "@type": "Brand", name: SITE_NAME },
      },
    })),
  };
}

export const NATAL_DESCRIPTION =
  "Natal corporativo em São Paulo: chocotone, bombons, caixas e kits de Natal artesanais personalizados com a marca da sua empresa, para equipes, clientes e parceiros. Nota fiscal e envio para todo o Brasil.";

export function natalCatalogJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: `Natal Corporativo ${NATAL_YEAR} — Bubri Confeitaria`,
    url: `${SITE_URL}/natal-corporativo`,
    seller: { "@id": `${SITE_URL}/#bubri` },
    itemListElement: NATAL_PRODUCTS.flatMap((p) =>
      p.variants.map((v) => ({
        "@type": "Offer",
        price: v.price,
        priceCurrency: "BRL",
        seller: { "@id": `${SITE_URL}/#bubri` },
        itemOffered: {
          "@type": "Product",
          name: v.label,
          description: p.description,
          image: `${SITE_URL}${p.photo}`,
          brand: { "@type": "Brand", name: SITE_NAME },
        },
      }))
    ),
  };
}
