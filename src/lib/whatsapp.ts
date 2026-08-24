export function buildWhatsAppLink(phoneNumber: string, message?: string): string {
  const digitsOnly = phoneNumber.replace(/\D/g, "");
  const base = `https://wa.me/${digitsOnly}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function formatPhoneForDisplay(phoneNumber: string): string {
  const digits = phoneNumber.replace(/\D/g, "");
  const match = digits.match(/^55(\d{2})(\d{5})(\d{4})$/);
  if (!match) return phoneNumber;
  const [, ddd, part1, part2] = match;
  return `+55 ${ddd} ${part1}-${part2}`;
}
