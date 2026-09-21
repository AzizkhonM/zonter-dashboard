"use client";

import { useTranslations } from "next-intl";

export default function Statistics() {
  const t = useTranslations("Landing.statistics");

  const players = [
    {
      name: 'Dan "apEX" Madesclaire',
      kd: "1.13",
      adr: "82.4",
      hs: "48%",
      kast: "74%",
    },
    {
      name: 'Mathieu "ZywOo" Herbaut',
      kd: "1.33",
      adr: "91.7",
      hs: "57%",
      kast: "81%",
    },
    {
      name: 'Shahar "flameZ" Shushan',
      kd: "1.14",
      adr: "87.2",
      hs: "52%",
      kast: "76%",
    },
    {
      name: 'William "mezii" Merriman',
      kd: "0.98",
      adr: "79.8",
      hs: "46%",
      kast: "72%",
    },
    {
      name: 'Robin "ropz" Kool',
      kd: "1.15",
      adr: "85.6",
      hs: "54%",
      kast: "78%",
    },
  ];

  return (
    <section className="relative overflow-hidden border-t border-[#232a34] bg-[#09090b]">
      <div
        aria-hidden
        className="pointer-events-none absolute left-[-250px] top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-[#f97316]/5 blur-[160px]"
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

        {/* Statistics dashboard */}
        <div className="mt-16 overflow-hidden border border-[#2e3742] bg-[#0f1115] shadow-2xl sm:mt-20">
          {/* Top bar */}
          <div className="flex flex-col gap-4 border-b border-[#232a34] bg-[#11151b] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div>
              <p className="text-sm font-bold text-[#f3f4f6]">
                Zonter Academy
              </p>

              <p className="mt-1 text-xs text-[#6b7280]">
                {t("tournamentName")}
              </p>
            </div>

            <div className="flex gap-2">
              <span className="border border-[#f97316]/30 bg-[#f97316]/10 px-3 py-1.5 text-xs font-semibold text-[#f97316]">
                {t("overview")}
              </span>

              <span className="border border-[#2e3742] px-3 py-1.5 text-xs font-medium text-[#6b7280]">
                {t("players")}
              </span>
            </div>
          </div>

          {/* KPI cards */}
          <div className="grid border-b border-[#232a34] sm:grid-cols-2 lg:grid-cols-5">
            <StatCard label={t("kpis.damage")} value="4,821" />
            <StatCard label={t("kpis.adr")} value="85.6" />
            <StatCard label={t("kpis.kd")} value="1.14" />
            <StatCard label={t("kpis.hs")} value="51.4%" />
            <StatCard label={t("kpis.kast")} value="76.2%" />
          </div>

          {/* Player table */}
          <div className="p-5 sm:p-7">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#6b7280]">
                {t("playerPerformance")}
              </span>

              <span className="text-xs text-[#6b7280]">
                {t("fivePlayers")}
              </span>
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-[700px]">
                {/* Table header */}
                <div className="grid grid-cols-[minmax(250px,1fr)_80px_90px_80px_80px] border-b border-[#232a34] px-4 pb-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6b7280]">
                  <span>{t("player")}</span>
                  <span>K/D</span>
                  <span>ADR</span>
                  <span>HS%</span>
                  <span>KAST</span>
                </div>

                {players.map((player, index) => (
                  <div
                    key={player.name}
                    className="grid grid-cols-[minmax(250px,1fr)_80px_90px_80px_80px] items-center border-b border-[#232a34]/70 px-4 py-4 last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-5 text-xs font-bold text-[#f97316]">
                        0{index + 1}
                      </span>

                      <span className="text-sm font-medium text-[#e5e7eb]">
                        {player.name}
                      </span>
                    </div>

                    <span className="text-sm font-semibold text-[#f3f4f6]">
                      {player.kd}
                    </span>

                    <span className="text-sm font-semibold text-[#f97316]">
                      {player.adr}
                    </span>

                    <span className="text-sm text-[#9ca3af]">
                      {player.hs}
                    </span>

                    <span className="text-sm text-[#9ca3af]">
                      {player.kast}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* MVP */}
          <div className="border-t border-[#232a34] bg-[#11151b] p-5 sm:p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#f97316]">
                  {t("mvpLabel")}
                </p>

                <h3 className="mt-2 text-2xl font-black tracking-tight text-[#f3f4f6]">
                  Mathieu "ZywOo" Herbaut
                </h3>

                <p className="mt-1 text-sm text-[#6b7280]">
                  {t("mvpDescription")}
                </p>
              </div>

              <div className="flex gap-6">
                <MvpStat label="K/D" value="1.33" />
                <MvpStat label="ADR" value="91.7" />
                <MvpStat label="HS%" value="57%" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border-b border-[#232a34] p-5 last:border-b-0 sm:border-r lg:border-b-0 lg:last:border-r-0">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6b7280]">
        {label}
      </p>

      <p className="mt-3 text-2xl font-black tracking-tight text-[#f3f4f6]">
        {value}
      </p>
    </div>
  );
}

function MvpStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6b7280]">
        {label}
      </p>

      <p className="mt-1 text-lg font-black text-[#f3f4f6]">
        {value}
      </p>
    </div>
  );
}