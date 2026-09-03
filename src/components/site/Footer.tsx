import { formatPhoneForDisplay } from "@/lib/whatsapp";

export function Footer({
  whatsappNumber,
  instagramHandle,
}: {
  whatsappNumber: string;
  instagramHandle: string;
}) {
  return (
    <footer className="border-t border-line-soft mt-16">
      <div className="mx-auto max-w-5xl px-6 py-8 flex flex-wrap items-center justify-between gap-3 text-sm text-graphite">
        <img
          src="/logo-bubri.png"
          alt="Bubri Confeitaria"
          width={469}
          height={230}
          className="h-8 w-auto"
        />
        <span>
          Instagram @{instagramHandle} · WhatsApp {formatPhoneForDisplay(whatsappNumber)}
        </span>
      </div>
    </footer>
  );
}
