"use client";

import { useTranslations } from "next-intl";

export default function TeamsPlayers() {
  const t = useTranslations("Landing.teamsPlayers");

  const stats = [
    {
      value: "12",
      label: t("stats.teams"),
    },
    {
      value: "64",
      label: t("stats.players"),
    },
    {
      value: "18",
      label: t("stats.tournaments"),
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

        {/* Main visual */}
        <div className="mt-16 grid overflow-hidden border border-[#2e3742] bg-[#0f1115] lg:grid-cols-[1.1fr_0.9fr]">
          {/* Team */}
          <div className="border-b border-[#232a34] p-6 sm:p-8 lg:border-b-0 lg:border-r lg:p-10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6b7280]">
                {t("teamLabel")}
              </span>

              <span className="text-xs font-medium text-[#f97316]">
                {t("active")}
              </span>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center border border-[#2e3742] bg-[#11151b] text-lg font-black text-[#f3f4f6]">
                Z
              </div>

              <div>
                <h3 className="text-2xl font-bold tracking-tight text-[#f3f4f6]">
                  {t("teamName")}
                </h3>

                <p className="mt-1 text-sm text-[#6b7280]">
                  {t("teamMeta")}
                </p>
              </div>
            </div>

            <div className="mt-10 border-t border-[#232a34] pt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#6b7280]">
                {t("playersLabel")}
              </p>

              <div className="mt-4 grid gap-2">
                {["player1", "player2", "player3", "player4", "player5"].map(
                  (player, index) => (
                    <div
                      key={player}
                      className="flex items-center justify-between border border-[#232a34] bg-[#11151b] px-4 py-3"
                    >
                      <span className="text-sm font-medium text-[#e5e7eb]">
                        {t(`players.${player}`)}
                      </span>

                      <span className="text-[7px] font-bold uppercase tracking-[0.12em] text-[#6b7280]">
                        {index === 0 ? "IGL" : "PLAYER"}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Tournament history */}
          <div className="p-6 sm:p-8 lg:p-10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6b7280]">
                {t("historyLabel")}
              </span>

              <span className="text-xs text-[#6b7280]">
                {t("historyCount")}
              </span>
            </div>

            <div className="mt-8 space-y-2">
              {["tournament1", "tournament2", "tournament3"].map(
                (tournament, index) => (
                  <div
                    key={tournament}
                    className="flex items-center justify-between border border-[#232a34] bg-[#11151b] px-4 py-4"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-bold text-[#f97316]">
                        0{index + 1}
                      </span>

                      <div>
                        <p className="text-sm font-semibold text-[#f3f4f6]">
                          {t(`tournaments.${tournament}.name`)}
                        </p>

                        <p className="mt-1 text-xs text-[#6b7280]">
                          {t(`tournaments.${tournament}.date`)}
                        </p>
                      </div>
                    </div>

                    <span className="text-xs font-semibold text-[#9ca3af] text-right">
                      {t(`tournaments.${tournament}.result`)}
                    </span>
                  </div>
                )
              )}
            </div>

            <div className="mt-8 grid grid-cols-3 border-t border-[#232a34] pt-6">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center sm:text-left">
                  <p className="text-2xl font-black text-[#f3f4f6]">
                    {stat.value}
                  </p>

                  <p className="mt-1 text-xs text-[#6b7280]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}