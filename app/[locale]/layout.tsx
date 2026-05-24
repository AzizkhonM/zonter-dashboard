import { NextIntlClientProvider } from "next-intl"
import { notFound } from "next/navigation"

const locales = ["uz", "en", "ru"]

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!locales.includes(locale)) {
    notFound()
  }

  return (
    <NextIntlClientProvider>
      {children}
    </NextIntlClientProvider>
  )
}