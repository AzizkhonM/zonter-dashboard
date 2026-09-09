import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ProfileClient from "./ProfileClient";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Dashboard");

  return {
    title: `${t("sidebar.profile")} | Zonter`,
    description: t("sidebar.profile"),
  };
}

export default function ProfilePage() {
  return <ProfileClient />;
}