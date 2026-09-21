import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import CreateOrganizationClient from "./CreateOrganizationClient";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Dashboard");

  return {
    title: `${t("organization.create")} | Zonter`,
    description: t("organization.create"),
  };
}

export default function CreateOrganizationPage() {
  return <CreateOrganizationClient />;
}