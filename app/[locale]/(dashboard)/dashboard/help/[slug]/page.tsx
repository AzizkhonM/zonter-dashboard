import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ArticleClient from "./ArticleClient";

type Props = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const t = await getTranslations("Dashboard");

  const articleMap: Record<string, string> = {
    "getting-started": "gettingStarted",
    "create-organization": "createOrganization",
    members: "members",
    roles: "roles",
    "create-tournament": "createTournament",
    formats: "formats",
    profile: "profile",
    security: "security",
  };

  const articleKey = articleMap[slug];

  if (!articleKey) {
    return {
      title: "Article not found | Zonter",
    };
  }

  return {
    title: `${t(`help.articles.${articleKey}.title`)} | Zonter`,
    description: t(`help.articles.${articleKey}.description`),
  };
}

export default async function HelpArticlePage({ params }: Props) {
  const { slug } = await params;

  return <ArticleClient slug={slug} />;
}
