import * as React from 'react'

import { cn } from '@/lib/utils'

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4'

export function DesignHeading({
  as = 'h2',
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<HeadingTag> & { as?: HeadingTag }) {
  const Component = as

  return (
    <Component
      className={cn(
        'font-bold tracking-[-0.02em] text-[var(--text-primary)] leading-[1.1]',
        as === 'h1' && 'text-[clamp(2rem,3.5vw,2.8rem)]',
        as === 'h2' && 'text-[clamp(1.75rem,2.5vw,2.3rem)]',
        as === 'h3' && 'text-[clamp(1.25rem,1.8vw,1.5rem)]',
        as === 'h4' && 'text-[1.125rem]',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}
