import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import HelpClient from "./HelpClient";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Dashboard");

  return {
    title: `${t("help.title")} | Zonter`,
    description: t("help.description"),
  };
}

export default function HelpPage() {
  return <HelpClient />;
}
