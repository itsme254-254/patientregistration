import { PatientRegistrationForm } from '@/components/patient-registration-form'
import { SiteHeader } from '@/components/site-header'

export default function Page() {
  return (
    <div className="min-h-svh font-sans">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Patient registration
        </h1>

        <div className="mt-3">
          <PatientRegistrationForm />
        </div>
      </main>
      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Northbridge Medical Center &middot; 482 Harbour Lane, Northbridge, OR
            97209 &middot; (555) 019-0100
          </p>
        </div>
      </footer>
    </div>
  )
}
