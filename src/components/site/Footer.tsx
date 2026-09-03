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
          width={1000}
          height={509}
          className="h-7 w-auto dark:[filter:brightness(0)_invert(0.92)]"
        />
        <span>
          Instagram @{instagramHandle} · WhatsApp {formatPhoneForDisplay(whatsappNumber)}
        </span>
      </div>
    </footer>
  );
}
