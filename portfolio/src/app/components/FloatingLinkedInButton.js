'use client'

import { usePathname } from 'next/navigation'

export default function FloatingLinkedInButton() {
  const pathname = usePathname()
  const shouldHide = pathname?.startsWith('/flappy-bird')

  if (shouldHide) return null

  return (
    <a
      href="https://linkedin.com/in/alphonse-schwartz-613479294"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="LinkedIn"
      className="fixed bottom-4 right-4 z-50 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/80 shadow-lg backdrop-blur transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/30"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
        <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM0 8h5v16H0V8zm7.5 0h4.8v2.2h.07c.67-1.2 2.3-2.46 4.73-2.46C22.4 7.74 24 10.2 24 14.2V24h-5v-8.6c0-2.05-.04-4.7-2.86-4.7-2.86 0-3.3 2.23-3.3 4.54V24h-5V8z" />
      </svg>
    </a>
  )
}


