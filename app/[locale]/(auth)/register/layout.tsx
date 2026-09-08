import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Auth");

  return {
    title: `${t("registerTitle")} | Zonter`,
    description: t("registerSubtitle"),
  };
}

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}