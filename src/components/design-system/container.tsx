import * as React from 'react'

import { cn } from '@/lib/utils'

export function DesignContainer({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('mx-auto w-full max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8', className)}
      {...props}
    />
  )
}
