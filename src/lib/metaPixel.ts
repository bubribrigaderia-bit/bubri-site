// Pixel do Meta (conjunto de dados da conta de anúncios Bianca Robles).
export const META_PIXEL_ID = "1513320215683660";

type Fbq = (command: "track" | "trackCustom", event: string, params?: Record<string, unknown>) => void;

/** Dispara um evento do pixel. Não faz nada se o script ainda não carregou ou foi bloqueado. */
export function trackPixel(event: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const fbq = (window as unknown as { fbq?: Fbq }).fbq;
  if (typeof fbq === "function") fbq("track", event, params);
}
