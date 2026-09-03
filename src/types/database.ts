export type ProductCategory =
  | "presentes"
  | "casamentos_eventos"
  | "corporativo"
  | "degustacao";

export const PRODUCT_CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: "presentes", label: "Para presentear" },
  { value: "casamentos_eventos", label: "Casamentos & Eventos" },
  { value: "corporativo", label: "Corporativo" },
  { value: "degustacao", label: "Kit degustação" },
];

export type PageKey = "home" | "sobre" | "contato";

// Nota: essas entidades usam `type` (não `interface`) de propósito. O
// postgrest-js valida cada tabela contra `Record<string, unknown>`
// internamente, e uma `interface` não satisfaz esse "extends" (não ganha
// index signature implícita), o que colapsa Insert/Update para `never` em
// tempo de tipo. Com `type`, funciona corretamente.

export type SiteSettings = {
  id: string;
  whatsapp_number: string;
  business_hours: string;
  instagram_handle: string;
  google_reviews_url: string;
  delivery_text: string;
  updated_at: string;
};

export type Pillar = {
  id: string;
  slug: ProductCategory;
  title: string;
  description: string;
  photo_url: string | null;
  display_order: number;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price_label: string;
  categories: ProductCategory[];
  photo_url: string | null;
  active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  display_order: number;
  active: boolean;
};

export type PageContent = {
  page: PageKey;
  section_key: string;
  content: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      site_settings: {
        Row: SiteSettings;
        Insert: Partial<SiteSettings>;
        Update: Partial<SiteSettings>;
        Relationships: [];
      };
      pillars: {
        Row: Pillar;
        Insert: Partial<Pillar>;
        Update: Partial<Pillar>;
        Relationships: [];
      };
      products: {
        Row: Product;
        Insert: Partial<Product>;
        Update: Partial<Product>;
        Relationships: [];
      };
      faq_items: {
        Row: FaqItem;
        Insert: Partial<FaqItem>;
        Update: Partial<FaqItem>;
        Relationships: [];
      };
      page_content: {
        Row: PageContent;
        Insert: Partial<PageContent>;
        Update: Partial<PageContent>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
