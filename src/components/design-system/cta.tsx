import * as React from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function CTAButton({ className, children, ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button
      className={cn(
        'h-12 rounded-[12px] bg-[var(--primary)] px-6 text-[0.95rem] font-semibold text-[var(--background)] shadow-[var(--shadow-soft)] hover:bg-[var(--primary-hover)]',
        className
      )}
      {...props}
    >
      {children}
    </Button>
  )
}
