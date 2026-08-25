import { Activity, ShieldCheck } from 'lucide-react'

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Activity className="size-5" aria-hidden="true" />
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight">
              Eldama Ravine Hospital
            </span>
            <span className="text-xs text-muted-foreground">
              Patient Services
            </span>
          </div>
        </div>
        <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
          <ShieldCheck className="size-4 text-primary" aria-hidden="true" />
          <span>HIPAA-compliant intake</span>
        </div>
      </div>
    </header>
  )
}
