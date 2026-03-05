import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      // Register custom font-size tokens so they don't conflict with text-* color utilities
      'font-size': [
        'text-display',
        'text-kanji-lg',
        'text-kanji',
        'text-page-title',
        'text-subtitle',
        'text-section',
        'text-title-sm',
        'text-body',
        'text-reading',
        'text-caption',
        'text-badge',
        'text-overline',
        'text-micro',
        'text-nav',
      ],
      // Register custom border-radius tokens
      'rounded': [
        'rounded-cta',
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
