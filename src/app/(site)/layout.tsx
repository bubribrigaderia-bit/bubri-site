import { getSiteSettings } from "@/lib/data/settings";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { WhatsAppFloatingButton } from "@/components/site/WhatsAppFloatingButton";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { JsonLd } from "@/components/site/JsonLd";
import { bakeryJsonLd } from "@/lib/seo";
import { MetaPixel } from "@/components/site/MetaPixel";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  const whatsappHref = buildWhatsAppLink(
    settings.whatsapp_number,
    "Oi! Vim pelo site da Bubri."
  );

  return (
    <>
      <JsonLd data={bakeryJsonLd(settings)} />
      <MetaPixel />
      <Nav whatsappHref={whatsappHref} />
      <main className="flex-1">{children}</main>
      <Footer
        whatsappNumber={settings.whatsapp_number}
        instagramHandle={settings.instagram_handle}
      />
      <WhatsAppFloatingButton href={whatsappHref} />
    </>
  );
}
