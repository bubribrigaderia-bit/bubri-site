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

export type Occasion = {
  value: ProductCategory;
  /** segmento da URL: /presentes, /eventos, ... */
  path: string;
  /** rótulo curto usado no menu e nos cards */
  menuLabel: string;
};

export const OCCASIONS: Occasion[] = [
  { value: "presentes", path: "presentes", menuLabel: "Presente" },
  { value: "casamentos_eventos", path: "eventos", menuLabel: "Eventos" },
  { value: "corporativo", path: "corporativo", menuLabel: "Corporativo" },
  { value: "degustacao", path: "degustacao", menuLabel: "Degustação" },
];

export function occasionByPath(path: string): Occasion | undefined {
  return OCCASIONS.find((o) => o.path === path);
}

export function occasionByValue(value: ProductCategory): Occasion | undefined {
  return OCCASIONS.find((o) => o.value === value);
}

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
  intro: string;
  photo_url: string | null;
  display_order: number;
};

export type OccasionPhoto = {
  id: string;
  occasion_slug: ProductCategory;
  photo_url: string;
  caption: string;
  display_order: number;
  active: boolean;
  created_at: string;
};

export type CorporateClient = {
  id: string;
  name: string;
  logo_url: string | null;
  display_order: number;
  active: boolean;
  created_at: string;
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

export type Testimonial = {
  id: string;
  author_name: string;
  text: string;
  rating: number;
  display_order: number;
  active: boolean;
  created_at: string;
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
      testimonials: {
        Row: Testimonial;
        Insert: Partial<Testimonial>;
        Update: Partial<Testimonial>;
        Relationships: [];
      };
      occasion_photos: {
        Row: OccasionPhoto;
        Insert: Partial<OccasionPhoto>;
        Update: Partial<OccasionPhoto>;
        Relationships: [];
      };
      corporate_clients: {
        Row: CorporateClient;
        Insert: Partial<CorporateClient>;
        Update: Partial<CorporateClient>;
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
