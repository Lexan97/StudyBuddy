interface LogoProps {
  size?: number
  className?: string
}

export function LogoIcon({ size = 36, className = '' }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      fill="none"
      width={size}
      height={size}
      className={className}
    >
      <rect x="4" y="4" width="26" height="22" rx="6" fill="url(#lg1)" />
      <circle cx="12" cy="15" r="2.2" fill="white" />
      <circle cx="17" cy="15" r="2.2" fill="white" />
      <circle cx="22" cy="15" r="2.2" fill="white" />
      <rect x="34" y="6" width="24" height="20" rx="6" fill="url(#lg2)" />
      <path d="M46 12l-6 3 6 3 6-3z" fill="white" />
      <path d="M42 16v4c0 1.5 1.8 3 4 3s4-1.5 4-3v-4" stroke="white" strokeWidth="1.5" fill="none" />
      <rect x="4" y="32" width="24" height="22" rx="6" fill="url(#lg3)" />
      <circle cx="16" cy="43" r="7" stroke="white" strokeWidth="1.8" fill="none" />
      <path d="M16 39v4.5l3 2" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      <rect x="32" y="34" width="28" height="26" rx="6" fill="url(#lg4)" />
      <path d="M44 44h-2a4 4 0 000 8h2m6-8h2a4 4 0 010 8h-2m-7-4h8" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <defs>
        <linearGradient id="lg1" x1="4" y1="4" x2="30" y2="26" gradientUnits="userSpaceOnUse">
          <stop stopColor="#34d399" /><stop offset="1" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="lg2" x1="34" y1="6" x2="58" y2="26" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f59e0b" /><stop offset="1" stopColor="#ea580c" />
        </linearGradient>
        <linearGradient id="lg3" x1="4" y1="32" x2="28" y2="54" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38bdf8" /><stop offset="1" stopColor="#2563eb" />
        </linearGradient>
        <linearGradient id="lg4" x1="32" y1="34" x2="60" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2dd4bf" /><stop offset="1" stopColor="#059669" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function LogoFull({ iconSize = 32, className = '' }: LogoProps & { iconSize?: number }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoIcon size={iconSize} />
      <span className="text-lg font-extrabold tracking-tight">
        <span className="text-emerald-600 dark:text-emerald-400">Study</span>
        <span className="text-amber-500 dark:text-amber-400">Buddy</span>
      </span>
    </div>
  )
}
