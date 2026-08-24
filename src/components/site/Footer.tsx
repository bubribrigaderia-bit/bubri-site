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
        <span>© {new Date().getFullYear()} Bubri Confeitaria</span>
        <span>
          Instagram @{instagramHandle} · WhatsApp {formatPhoneForDisplay(whatsappNumber)}
        </span>
      </div>
    </footer>
  );
}
