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
      className="fixed bottom-4 right-4 z-50 inline-flex items-center justify-center text-white/80 hover:text-white transition-colors text-xl sm:text-2xl font-semibold tracking-tight focus:outline-none focus:ring-2 focus:ring-white/30"
    >
      in
    </a>
  )
}


