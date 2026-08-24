export function PhotoOrPlaceholder({
  src,
  alt,
  className = "",
}: {
  src: string | null;
  alt: string;
  className?: string;
}) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} className={`object-cover ${className}`} loading="lazy" />;
  }

  return (
    <div
      className={`flex items-center justify-center border border-dashed border-line bg-paper-raised text-graphite text-xs ${className}`}
      role="img"
      aria-label={alt}
    >
      foto em breve
    </div>
  );
}
