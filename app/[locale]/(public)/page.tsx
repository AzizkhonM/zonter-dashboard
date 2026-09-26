import type { Metadata } from "next";
import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import Problem from "@/components/landing/Problem";
import TournamentLifecycle from "@/components/landing/TournamentLifecycle";
import TournamentManagement from "@/components/landing/TournamentManagement";
import TeamsPlayers from "@/components/landing/TeamsPlayers";
import MatchCenter from "@/components/landing/MatchCenter";
import MapVeto from "@/components/landing/MapVeto";
import Statistics from "@/components/landing/Statistics";
import Organization from "@/components/landing/Organization";
import PublicPages from "@/components/landing/PublicPages";
import Audience from "@/components/landing/Audience";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { locale } = await params;

  const metadata = {
    uz: {
      title: "Zonter — CS2 turnirlarini boshqarish platformasi",
      description:
        "CS2 turnir tashkilotchilari uchun turnirlar, jamoalar, o'yinlar va statistikalarni boshqarish platformasi.",
    },
    en: {
      title: "Zonter — CS2 Tournament Management",
      description:
        "A tournament operating system for CS2 organizers, teams, matches, and statistics.",
    },
    ru: {
      title: "Zonter — управление CS2-турнирами",
      description:
        "Платформа для организаторов CS2-турниров: управление турнирами, командами, матчами и статистикой.",
    },
  };

  return metadata[locale as keyof typeof metadata] ?? metadata.uz;
}

export default function Home() {
  return (
    <>
      <Header />

      <main>
        <Hero />
        <Problem />
        <TournamentLifecycle />
        <TournamentManagement />
        <TeamsPlayers />
        <MatchCenter />
        <MapVeto />
        <Statistics />
        <Organization />
        <PublicPages />
        <Audience />
        <FinalCTA />
      </main>
      
      <Footer />
    </>
  );
}