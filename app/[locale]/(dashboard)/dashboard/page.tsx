import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";

export default async function Dashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return <div>Not authorized</div>;
  }

  try {
    const payload = await verifyToken(token);

    const userId = payload.userId as string;

    if (!userId) {
      return <div>Invalid token</div>;
    }

    return (
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div>
          <p className="text-sm text-white/50">Dashboard</p>

          <h1 className="mt-2 text-4xl font-semibold tracking-tight">
            Welcome to Zonter 👋
          </h1>

          <p className="mt-3 max-w-2xl text-white/50">
            Create or join an organization to start managing
            tournaments, teams, players and more.
          </p>
        </div>

        {/* Main action */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {/* Create organization */}
          <div className="group rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition hover:border-white/20 hover:bg-white/[0.05]">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-xl text-black">
              +
            </div>

            <h2 className="mt-6 text-xl font-semibold">
              Create an organization
            </h2>

            <p className="mt-2 text-sm leading-6 text-white/50">
              Create your organization and manage tournaments,
              teams, players and members from one place.
            </p>

            <a
              href="/dashboard/organizations/create"
              className="mt-6 inline-flex items-center rounded-lg bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-white/90"
            >
              Create organization
              <span className="ml-2">→</span>
            </a>
          </div>

          {/* Join organization */}
          <div className="group rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition hover:border-white/20 hover:bg-white/[0.05]">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-xl">
              ↗
            </div>

            <h2 className="mt-6 text-xl font-semibold">
              Join an organization
            </h2>

            <p className="mt-2 text-sm leading-6 text-white/50">
              Have an invitation? Join an existing organization
              and start working with its team.
            </p>

            <a
              href="/dashboard/invitations"
              className="mt-6 inline-flex items-center rounded-lg border border-white/15 px-5 py-3 text-sm font-medium transition hover:bg-white/10"
            >
              View invitations
              <span className="ml-2">→</span>
            </a>
          </div>
        </div>

        {/* Empty state */}
        <div className="mt-10 rounded-2xl border border-dashed border-white/10 p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/5 text-2xl">
            ◇
          </div>

          <h2 className="mt-5 text-lg font-medium">
            No organizations yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/40">
            Once you create or join an organization, it will
            appear here.
          </p>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Token verification failed:", error);

    return <div>Invalid token</div>;
  }
}