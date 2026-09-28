import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type Props = {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "Admin.organizationRequests",
  });

  return {
    title: `${t("title")} | Zonter`,
  };
}

export default function OrganizationRequestsLayout({
  children,
}: Props) {
  return children;
}
