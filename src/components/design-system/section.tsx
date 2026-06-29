import * as React from 'react'

import { cn } from '@/lib/utils'
import { DesignContainer } from './container'

export function DesignSection({ className, children, ...props }: React.ComponentProps<'section'>) {
  return (
    <section className={cn('py-16 md:py-24', className)} {...props}>
      <DesignContainer>{children}</DesignContainer>
    </section>
  )
}

export function DesignSectionHeader({
  badge,
  title,
  subtitle,
  align = 'center',
  className,
}: {
  badge?: React.ReactNode
  title: React.ReactNode
  subtitle?: React.ReactNode
  align?: 'left' | 'center'
  className?: string
}) {
  return (
    <div className={cn('mx-auto max-w-2xl', align === 'left' ? 'mr-auto ml-0 text-left' : 'text-center', className)}>
      {badge ? <div className="mb-4 flex justify-center text-[0.75rem] font-semibold uppercase tracking-[0.24em] text-[var(--primary)] sm:justify-start">{badge}</div> : null}
      <h2 className="text-[clamp(1.75rem,2.5vw,2.4rem)] font-bold tracking-[-0.02em] text-[var(--text-primary)] leading-[1.1]">{title}</h2>
      {subtitle ? <p className="mt-4 text-[0.95rem] leading-[1.7] text-[var(--text-secondary)]">{subtitle}</p> : null}
    </div>
  )
}
