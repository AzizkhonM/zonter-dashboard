"use client";

import { useTranslations } from "next-intl";

export default function MatchCenter() {
  const t = useTranslations("Landing.matchCenter");

  const maps = [
    {
      name: "Mirage",
      score: "13 — 9",
      winner: "ZONTER ACADEMY",
    },
    {
      name: "Inferno",
      score: "8 — 13",
      winner: "TEAM VITALITY",
    },
    {
      name: "Nuke",
      score: "13 — 11",
      winner: "ZONTER ACADEMY",
    },
  ];

  const players = [
    {
      name: 'Dan "apEX" Madesclaire',
      kills: "61",
      deaths: "54",
      assists: "18",
      adr: "82.4",
      hs: "48%",
    },
    {
      name: 'Mathieu "ZywOo" Herbaut',
      kills: "68",
      deaths: "51",
      assists: "21",
      adr: "91.7",
      hs: "57%",
    },
    {
      name: 'Shahar "flameZ" Shushan',
      kills: "64",
      deaths: "56",
      assists: "17",
      adr: "87.2",
      hs: "52%",
    },
    {
      name: 'William "mezii" Merriman',
      kills: "57",
      deaths: "58",
      assists: "20",
      adr: "79.8",
      hs: "46%",
    },
    {
      name: 'Robin "ropz" Kool',
      kills: "63",
      deaths: "55",
      assists: "19",
      adr: "85.6",
      hs: "54%",
    },
  ];

  return (
    <section className="relative overflow-hidden border-t border-[#232a34] bg-[#0f1115]">
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-250px] top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-[#f97316]/5 blur-[160px]"
      />

      <div className="relative mx-auto max-w-[1400px] px-5 py-24 sm:px-8 sm:py-32 lg:px-10 lg:py-40">
        {/* Header */}
        <div className="max-w-3xl">
          <div className="mb-6 flex items-center gap-3">
            <span className="h-px w-8 bg-[#f97316]" />

            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f97316]">
              {t("eyebrow")}
            </span>
          </div>

          <h2 className="text-4xl font-black leading-[1] tracking-[-0.035em] text-[#f3f4f6] sm:text-5xl lg:text-6xl">
            {t("title")}
          </h2>

          <p className="mt-6 max-w-2xl text-base leading-7 text-[#9ca3af] sm:text-lg">
            {t("description")}
          </p>
        </div>

        {/* Match Center */}
        <div className="mt-16 overflow-hidden border border-[#2e3742] bg-[#09090b] shadow-2xl sm:mt-20">
          {/* Top bar */}
          <div className="flex flex-col gap-3 border-b border-[#232a34] bg-[#11151b] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[#22c55e]" />

              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#9ca3af]">
                {t("status")}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="border border-[#2e3742] px-3 py-1.5 font-semibold text-[#9ca3af]">
                BO3
              </span>

              <span className="text-[#6b7280]">
                {t("matchId")}
              </span>
            </div>
          </div>

          {/* Teams */}
          <div className="grid border-b border-[#232a34] lg:grid-cols-[1fr_auto_1fr]">
            <div className="p-7 sm:p-10 lg:p-12">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#6b7280]">
                {t("winner")}
              </p>

              <div className="mt-5 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center border border-[#f97316]/40 bg-[#f97316]/10 text-lg font-black text-[#f97316]">
                  Z
                </div>

                <div>
                  <h3 className="text-xl font-black text-[#f3f4f6] sm:text-2xl">
                    Zonter Academy
                  </h3>

                  <p className="mt-1 text-xs text-[#6b7280]">
                    {t("teamLabel")}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center border-y border-[#232a34] px-8 py-6 lg:border-x lg:border-y-0">
              <div className="text-center">
                <p className="text-4xl font-black tracking-tight text-[#f3f4f6] sm:text-5xl">
                  2 — 1
                </p>

                <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6b7280]">
                  {t("finalScore")}
                </p>
              </div>
            </div>

            <div className="p-7 sm:p-10 lg:p-12 lg:text-right">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#6b7280]">
                {t("opponent")}
              </p>

              <div className="mt-5 flex items-center gap-4 lg:flex-row-reverse">
                <div className="flex h-14 w-14 items-center justify-center border border-[#2e3742] bg-[#11151b] text-lg font-black text-[#9ca3af]">
                  V
                </div>

                <div>
                  <h3 className="text-xl font-black text-[#f3f4f6] sm:text-2xl">
                    Team Vitality
                  </h3>

                  <p className="mt-1 text-xs text-[#6b7280]">
                    {t("teamLabel")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Maps */}
          <div className="border-b border-[#232a34] p-5 sm:p-7">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#6b7280]">
                {t("maps")}
              </span>

              <span className="text-xs text-[#6b7280]">
                {t("threeMaps")}
              </span>
            </div>

            <div className="grid gap-2 md:grid-cols-3">
              {maps.map((map, index) => (
                <div
                  key={map.name}
                  className="border border-[#232a34] bg-[#11151b] p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#f97316]">
                      0{index + 1}
                    </span>

                    <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6b7280]">
                      {t("completed")}
                    </span>
                  </div>

                  <div className="mt-6 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-lg font-bold text-[#f3f4f6]">
                        {map.name}
                      </p>

                      <p className="mt-1 text-[10px] uppercase tracking-[0.1em] text-[#6b7280]">
                        {map.winner}
                      </p>
                    </div>

                    <p className="text-2xl font-black text-[#f3f4f6]">
                      {map.score}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Player performance */}
          <div className="p-5 sm:p-7">
            <div className="mb-5">
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#6b7280]">
                {t("playerPerformance")}
              </span>
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-[680px]">
                <div className="grid grid-cols-[minmax(220px,1fr)_60px_60px_60px_80px_70px] border-b border-[#232a34] px-4 pb-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6b7280]">
                  <span>{t("player")}</span>
                  <span>K</span>
                  <span>D</span>
                  <span>A</span>
                  <span>ADR</span>
                  <span>HS%</span>
                </div>

                {players.map((player) => (
                  <div
                    key={player.name}
                    className="grid grid-cols-[minmax(220px,1fr)_60px_60px_60px_80px_70px] items-center border-b border-[#232a34]/70 px-4 py-4 last:border-b-0"
                  >
                    <span className="text-sm font-medium text-[#e5e7eb]">
                      {player.name}
                    </span>

                    <span className="text-sm font-semibold text-[#f3f4f6]">
                      {player.kills}
                    </span>

                    <span className="text-sm text-[#9ca3af]">
                      {player.deaths}
                    </span>

                    <span className="text-sm text-[#9ca3af]">
                      {player.assists}
                    </span>

                    <span className="text-sm font-semibold text-[#f97316]">
                      {player.adr}
                    </span>

                    <span className="text-sm text-[#9ca3af]">
                      {player.hs}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}