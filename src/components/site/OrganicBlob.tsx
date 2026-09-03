export function OrganicBlob({
  className = "",
  color = "var(--accent-soft)",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 800"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M0,0 H400 V620 C 320,700 260,560 190,650 C 120,740 60,760 0,700 Z"
        fill={color}
      />
    </svg>
  );
}
