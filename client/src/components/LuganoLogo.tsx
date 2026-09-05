export default function LuganoLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Lugano.ai Logo"
    >
      {/* L */}
      <path d="M0 0V24H14V20H4V0H0Z" fill="currentColor" />
      {/* U */}
      <path d="M18 0V16C18 18.2 19.8 20 22 20H26C28.2 20 30 18.2 30 16V0H26V16H22V0H18Z" fill="currentColor" />
      {/* G */}
      <path d="M46 10H42V14H46V20H38V4H46V0H38C35.8 0 34 1.8 34 4V20C34 22.2 35.8 24 38 24H46C48.2 24 50 22.2 50 20V10H46Z" fill="currentColor" />
      {/* A */}
      <path d="M58 0L54 24H58.5L59.5 18H66.5L67.5 24H72L68 0H58ZM60.2 14L63 3.5L65.8 14H60.2Z" fill="currentColor" />
      {/* N */}
      <path d="M76 0V24H80V8L88 24H92V0H88V16L80 0H76Z" fill="currentColor" />
      {/* O */}
      <path d="M100 0C97.8 0 96 1.8 96 4V20C96 22.2 97.8 24 100 24H104C106.2 24 108 22.2 108 20V4C108 1.8 106.2 0 104 0H100ZM104 20H100V4H104V20Z" fill="currentColor" />
      {/* . */}
      <rect x="112" y="20" width="4" height="4" fill="#A855F7" />
    </svg>
  );
}
