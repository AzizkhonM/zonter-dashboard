import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

type Props = {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { locale, slug } = await params;

  const organization = await prisma.organization.findUnique({
    where: { slug },
    select: {
      name: true,
    },
  });

  if (!organization) {
    return {
      title: "Organization | Zonter",
    };
  }

  const title =
    locale === "ru"
      ? `Организация «${organization.name}» | Zonter`
      : locale === "en"
        ? `Organization "${organization.name}" | Zonter`
        : `"${organization.name}" tashkiloti | Zonter`;

  return {
    title,
  };
}

export default function OrganizationLayout({ children }: Props) {
  return children;
}
