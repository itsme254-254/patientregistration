'use client'

import * as React from 'react'
import { CheckCircle2, Clock, Loader2, UserRound } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { FormSection } from '@/components/form-section'

const BLOOD_GROUPS = [
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
  'O+',
  'O-',
  'Unknown',
]

const GENDERS = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: 'non-binary', label: 'Non-binary' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
]

type FormErrors = Record<string, string>

function RequiredLabel({
  children,
  ...props
}: React.ComponentProps<typeof FieldLabel>) {
  return (
    <FieldLabel {...props}>
      <span>
        {children}
        <span aria-hidden="true" className="ml-0.5 text-destructive">
          *
        </span>
        <span className="sr-only">(required)</span>
      </span>
    </FieldLabel>
  )
}

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {}
  const get = (key: string) => String(data.get(key) ?? '').trim()

  if (!get('fullName')) {
    errors.fullName = "Please enter the patient's full name."
  }

  const dob = get('dateOfBirth')
  if (!dob) {
    errors.dateOfBirth = 'Please enter a date of birth.'
  } else if (new Date(dob) > new Date()) {
    errors.dateOfBirth = 'Date of birth cannot be in the future.'
  }

  if (!get('gender')) {
    errors.gender = 'Please select a gender.'
  }

  const phone = get('phone')
  if (!phone) {
    errors.phone = 'Please enter a phone number.'
  } else if (phone.replace(/\D/g, '').length < 10) {
    errors.phone = 'Enter a phone number with at least 10 digits.'
  }

  const email = get('email')
  if (!email) {
    errors.email = 'Please enter an email address.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    errors.email = 'Enter a valid email address.'
  }

  if (!get('address')) {
    errors.address = 'Please enter a home address.'
  }

  if (!get('bloodGroup')) {
    errors.bloodGroup = 'Please select a blood group.'
  }

  if (!get('emergencyName')) {
    errors.emergencyName = 'Please enter an emergency contact name.'
  }

  const emergencyPhone = get('emergencyPhone')
  if (!emergencyPhone) {
    errors.emergencyPhone = 'Please enter an emergency contact phone number.'
  } else if (emergencyPhone.replace(/\D/g, '').length < 10) {
    errors.emergencyPhone = 'Enter a phone number with at least 10 digits.'
  } else if (
    emergencyPhone.replace(/\D/g, '') === phone.replace(/\D/g, '') &&
    phone
  ) {
    errors.emergencyPhone =
      "Emergency contact must differ from the patient's number."
  }

  return errors
}

export function PatientRegistrationForm() {
  const [errors, setErrors] = React.useState<FormErrors>({})
  const [status, setStatus] = React.useState<'idle' | 'saving' | 'done'>('idle')
  const formRef = React.useRef<HTMLFormElement>(null)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const nextErrors = validate(data)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      const firstKey = Object.keys(nextErrors)[0]
      const field = event.currentTarget.querySelector<HTMLElement>(
        `[name="${firstKey}"]`
      )
      field?.focus()
      field?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setStatus('saving')
    window.setTimeout(() => setStatus('done'), 900)
  }

  if (status === 'done') {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center sm:p-12">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-accent text-primary">
          <CheckCircle2 className="size-6" aria-hidden="true" />
        </span>
        <h2 className="mt-5 text-xl font-semibold tracking-tight text-balance">
          Registration submitted
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground text-pretty">
          The patient record has been created. A confirmation email with the
          appointment scheduling link is on its way.
        </p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => {
            formRef.current?.reset()
            setErrors({})
            setStatus('idle')
          }}
        >
          Register another patient
        </Button>
      </div>
    )
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col gap-8">
        <div className="max-w-2xl pt-2 pb-2">
          <p className="text-base leading-relaxed text-muted-foreground text-pretty">
            Complete the four sections below to create a new patient record.
            Fields marked with an asterisk are required before submission.
          </p>
          <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="size-4 text-primary" aria-hidden="true" />
            <span>Takes about 5 minutes</span>
          </div>
        </div>

        <FormSection
          id="personal"
          step="01"
          title="Personal details"
          description="Legal name and identifying information as it appears on the patient's ID."
        >
          <FieldGroup>
            <Field data-invalid={errors.fullName ? true : undefined}>
              <RequiredLabel htmlFor="fullName">Full name</RequiredLabel>
              <Input
                id="fullName"
                name="fullName"
                autoComplete="name"
                placeholder="Jordan Avery Mitchell"
                aria-invalid={errors.fullName ? true : undefined}
                aria-describedby={
                  errors.fullName ? 'fullName-error' : undefined
                }
              />
              {errors.fullName ? (
                <FieldDescription id="fullName-error" className="text-destructive">
                  {errors.fullName}
                </FieldDescription>
              ) : null}
            </Field>

            <div className="grid gap-6 sm:grid-cols-2">
              <Field data-invalid={errors.dateOfBirth ? true : undefined}>
                <RequiredLabel htmlFor="dateOfBirth">Date of birth</RequiredLabel>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  autoComplete="bday"
                  aria-invalid={errors.dateOfBirth ? true : undefined}
                  aria-describedby={
                    errors.dateOfBirth ? 'dateOfBirth-error' : undefined
                  }
                />
                {errors.dateOfBirth ? (
                  <FieldDescription
                    id="dateOfBirth-error"
                    className="text-destructive"
                  >
                    {errors.dateOfBirth}
                  </FieldDescription>
                ) : null}
              </Field>

              <Field data-invalid={errors.bloodGroup ? true : undefined}>
                <RequiredLabel htmlFor="bloodGroup">Blood group</RequiredLabel>
                <Select name="bloodGroup">
                  <SelectTrigger
                    id="bloodGroup"
                    aria-invalid={errors.bloodGroup ? true : undefined}
                    aria-describedby={
                      errors.bloodGroup ? 'bloodGroup-error' : undefined
                    }
                  >
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {BLOOD_GROUPS.map((group) => (
                        <SelectItem key={group} value={group}>
                          {group}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.bloodGroup ? (
                  <FieldDescription
                    id="bloodGroup-error"
                    className="text-destructive"
                  >
                    {errors.bloodGroup}
                  </FieldDescription>
                ) : null}
              </Field>
            </div>

            <FieldSet data-invalid={errors.gender ? true : undefined}>
              <FieldLegend variant="label">
                Gender
                <span aria-hidden="true" className="ml-0.5 text-destructive">
                  *
                </span>
                <span className="sr-only">(required)</span>
              </FieldLegend>
              <RadioGroup
                name="gender"
                aria-invalid={errors.gender ? true : undefined}
                aria-describedby={errors.gender ? 'gender-error' : undefined}
                className="grid gap-3 sm:grid-cols-2"
              >
                {GENDERS.map((option) => (
                  <Field
                    key={option.value}
                    orientation="horizontal"
                    className="rounded-md border border-border bg-card px-3 py-2.5"
                  >
                    <RadioGroupItem
                      id={`gender-${option.value}`}
                      value={option.value}
                    />
                    <FieldLabel
                      htmlFor={`gender-${option.value}`}
                      className="font-normal"
                    >
                      {option.label}
                    </FieldLabel>
                  </Field>
                ))}
              </RadioGroup>
              {errors.gender ? (
                <FieldDescription id="gender-error" className="text-destructive">
                  {errors.gender}
                </FieldDescription>
              ) : null}
            </FieldSet>
          </FieldGroup>
        </FormSection>

        <Separator />

        <FormSection
          id="contact"
          step="02"
          title="Contact information"
          description="Used for appointment reminders, test results, and billing correspondence."
        >
          <FieldGroup>
            <div className="grid gap-6 sm:grid-cols-2">
              <Field data-invalid={errors.phone ? true : undefined}>
                <RequiredLabel htmlFor="phone">Phone number</RequiredLabel>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="0712 345 678"
                  aria-invalid={errors.phone ? true : undefined}
                  aria-describedby={errors.phone ? 'phone-error' : undefined}
                />
                {errors.phone ? (
                  <FieldDescription id="phone-error" className="text-destructive">
                    {errors.phone}
                  </FieldDescription>
                ) : null}
              </Field>

              <Field data-invalid={errors.email ? true : undefined}>
                <RequiredLabel htmlFor="email">Email address</RequiredLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="jordan.mitchell@example.com"
                  aria-invalid={errors.email ? true : undefined}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email ? (
                  <FieldDescription id="email-error" className="text-destructive">
                    {errors.email}
                  </FieldDescription>
                ) : null}
              </Field>
            </div>

            <Field data-invalid={errors.address ? true : undefined}>
              <RequiredLabel htmlFor="address">Home address</RequiredLabel>
              <Textarea
                id="address"
                name="address"
                rows={3}
                autoComplete="street-address"
                placeholder={'House 24, Ravine Road\nEldama Ravine, Baringo County'}
                aria-invalid={errors.address ? true : undefined}
                aria-describedby={errors.address ? 'address-error' : undefined}
              />
              {errors.address ? (
                <FieldDescription id="address-error" className="text-destructive">
                  {errors.address}
                </FieldDescription>
              ) : (
                <FieldDescription>
                  Include street, city, state, and postal code.
                </FieldDescription>
              )}
            </Field>
          </FieldGroup>
        </FormSection>

        <Separator />

        <FormSection
          id="medical"
          step="03"
          title="Medical history"
          description="Share anything that could affect treatment or prescribing decisions."
        >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="allergies">Allergies</FieldLabel>
              <Textarea
                id="allergies"
                name="allergies"
                rows={3}
                placeholder="Penicillin, latex, peanuts…"
              />
              <FieldDescription>
                List medication, food, and environmental allergies. Enter
                &quot;None&quot; if not applicable.
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="conditions">
                Existing medical conditions
              </FieldLabel>
              <Textarea
                id="conditions"
                name="conditions"
                rows={4}
                placeholder="Type 2 diabetes, asthma, hypertension…"
              />
              <FieldDescription>
                Include ongoing diagnoses, past surgeries, and current
                medications.
              </FieldDescription>
            </Field>
          </FieldGroup>
        </FormSection>

        <Separator />

        <FormSection
          id="emergency"
          step="04"
          title="Emergency contact"
          description="The person we should reach if the patient cannot be contacted directly."
        >
          <FieldGroup>
            <div className="grid gap-6 sm:grid-cols-2">
              <Field data-invalid={errors.emergencyName ? true : undefined}>
                <RequiredLabel htmlFor="emergencyName">Contact name</RequiredLabel>
                <Input
                  id="emergencyName"
                  name="emergencyName"
                  placeholder="Riley Mitchell"
                  aria-invalid={errors.emergencyName ? true : undefined}
                  aria-describedby={
                    errors.emergencyName ? 'emergencyName-error' : undefined
                  }
                />
                {errors.emergencyName ? (
                  <FieldDescription
                    id="emergencyName-error"
                    className="text-destructive"
                  >
                    {errors.emergencyName}
                  </FieldDescription>
                ) : null}
              </Field>

              <Field data-invalid={errors.emergencyPhone ? true : undefined}>
                <RequiredLabel htmlFor="emergencyPhone">Contact phone</RequiredLabel>
                <Input
                  id="emergencyPhone"
                  name="emergencyPhone"
                  type="tel"
                  inputMode="tel"
                  placeholder="0723 456 789"
                  aria-invalid={errors.emergencyPhone ? true : undefined}
                  aria-describedby={
                    errors.emergencyPhone ? 'emergencyPhone-error' : undefined
                  }
                />
                {errors.emergencyPhone ? (
                  <FieldDescription
                    id="emergencyPhone-error"
                    className="text-destructive"
                  >
                    {errors.emergencyPhone}
                  </FieldDescription>
                ) : null}
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="emergencyRelationship">
                Relationship to patient
              </FieldLabel>
              <Input
                id="emergencyRelationship"
                name="emergencyRelationship"
                placeholder="Spouse, parent, sibling…"
              />
            </Field>
          </FieldGroup>
        </FormSection>

        <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-relaxed text-muted-foreground text-pretty">
            By submitting, you confirm the information is accurate and consent to
            its use for treatment and billing.
          </p>
          <Button
            type="submit"
            size="lg"
            disabled={status === 'saving'}
            className="w-full shrink-0 sm:w-auto"
          >
            {status === 'saving' ? (
              <Loader2 className="animate-spin" data-icon="inline-start" />
            ) : (
              <UserRound data-icon="inline-start" />
            )}
            {status === 'saving' ? 'Registering…' : 'Register Patient'}
          </Button>
        </div>
      </div>
    </form>
  )
}
