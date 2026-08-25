import type * as React from 'react'

interface FormSectionProps {
  id: string
  step: string
  title: string
  description: string
  children: React.ReactNode
}

export function FormSection({
  id,
  step,
  title,
  description,
  children,
}: FormSectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="scroll-mt-24 lg:grid lg:grid-cols-[14rem_1fr] lg:gap-10"
    >
      <div className="mb-5 lg:mb-0">
        <span className="font-mono text-xs text-primary">{step}</span>
        <h2
          id={`${id}-heading`}
          className="mt-1 text-base font-semibold tracking-tight text-balance"
        >
          {title}
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground text-pretty">
          {description}
        </p>
      </div>
      <div className="rounded-lg border border-border bg-card p-5 sm:p-6">
        {children}
      </div>
    </section>
  )
}
