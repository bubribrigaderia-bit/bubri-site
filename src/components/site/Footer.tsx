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
      <div className="mx-auto max-w-5xl px-6 py-10 flex flex-col items-center gap-4 text-sm text-graphite text-center">
        <img
          src="/logo-footer.png"
          alt="Bubri Confeitaria"
          width={600}
          height={464}
          className="h-16 w-auto"
        />
        <span>
          Instagram @{instagramHandle} · WhatsApp {formatPhoneForDisplay(whatsappNumber)}
        </span>
      </div>
    </footer>
  );
}
