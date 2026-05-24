import { getRequestConfig } from "next-intl/server"

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale

  const finalLocale =
    locale && ["uz", "en", "ru"].includes(locale)
      ? locale
      : "uz"

  return {
    locale: finalLocale,
    messages: (
      await import(`../messages/${finalLocale}.json`)
    ).default,
  }
})