// app/(dashboard)/layout.tsx

import type { ReactNode } from "react"
import "@/app/globals.css"

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-black text-white">
      <aside className="fixed left-0 top-0 h-screen w-64 border-r border-white/10 p-6">
        <h1 className="text-2xl font-bold">Zonter</h1>

        <nav className="mt-10 flex flex-col gap-4 text-sm text-white/70">
          <a href="/dashboard">Overview</a>
          <a href="/dashboard/tournaments">Tournaments</a>
          <a href="/dashboard/teams">Teams</a>
          <a href="/dashboard/players">Players</a>
          <a href="/dashboard/announcements">Announcements</a>
          <a href="/dashboard/settings">Settings</a>
        </nav>
      </aside>

      <main className="ml-64 min-h-screen p-8">
        {children}
      </main>
    </div>
  )
}