export const formatDateTime = (
  date: string | Date,
  locale: "uz" | "en" | "ru",
) => {
  const value = new Date(date);

  if (locale === "uz") {
    const parts = new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Tashkent",
    }).formatToParts(value);

    const get = (type: string) =>
      parts.find((part) => part.type === type)?.value ?? "";

    return `${get("day")}.${get("month")}.${get("year")}, ${get("hour")}:${get("minute")} UTC+5`;
  }

  return (
    new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: locale === "en",
      timeZone: "Asia/Tashkent",
    }).format(value) + " UTC+5"
  );
};
