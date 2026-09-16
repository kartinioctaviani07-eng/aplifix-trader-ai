import Link from "next/link";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db/postgres";
import { getOfficeSession } from "@/lib/office/session";

const PARTNERSHIP_STATUSES = [
  "NEW",
  "REVIEWING",
  "CONTACTED",
  "QUALIFIED",
  "PROPOSAL_SENT",
  "AGREEMENT",
  "COMPLETED",
] as const;

const STATUS_LABELS: Record<string, string> = {
  NEW: "New",
  REVIEWING: "Reviewing",
  CONTACTED: "Contacted",
  QUALIFIED: "Qualified",
  PROPOSAL_SENT: "Proposal Sent",
  AGREEMENT: "Agreement",
  COMPLETED: "Completed",
};

type PartnershipStatus =
  (typeof PARTNERSHIP_STATUSES)[number];

type StatusCount = {
  status: PartnershipStatus;
  count: number;
};

type RecentPartnership = {
  id: string;
  name: string;
  email: string;
  interest: string;
  status: PartnershipStatus;
  created_at: string | number | Date;
};

type DashboardData = {
  totalPartnership: number;
  statusCounts: StatusCount[];
  recentPartnerships: RecentPartnership[];
};

async function getDashboardData(): Promise<DashboardData> {
  const totalRows = await sql`
    SELECT COUNT(*)::int AS count
    FROM partnership_interests
  `;

  const totalRow = totalRows[0] as
    | { count: number }
    | undefined;

  const statusRows = await sql`
    SELECT
      status,
      COUNT(*)::int AS count
    FROM partnership_interests
    GROUP BY status
  `;

  const statusMap = new Map(
    statusRows.map((row) => [
      String(row.status),
      Number(row.count),
    ]),
  );

  const statusCounts: StatusCount[] =
    PARTNERSHIP_STATUSES.map((status) => ({
      status,
      count: statusMap.get(status) ?? 0,
    }));

  const recentRows = await sql`
    SELECT
      id,
      name,
      email,
      interest,
      status,
      created_at
    FROM partnership_interests
    ORDER BY created_at DESC
    LIMIT 5
  `;

  const recentPartnerships =
    recentRows as unknown as RecentPartnership[];

  return {
    totalPartnership: Number(totalRow?.count ?? 0),
    statusCounts,
    recentPartnerships,
  };
}

function formatDate(
  timestamp: string | number | Date,
): string {
  const date =
    timestamp instanceof Date
      ? timestamp
      : new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default async function OfficePage() {
  const session = await getOfficeSession();

  if (!session) {
    redirect("/office/login");
  }

  const dashboard = await getDashboardData();

  const newCount =
    dashboard.statusCounts.find(
      (item) => item.status === "NEW",
    )?.count ?? 0;

  const reviewingCount =
    dashboard.statusCounts.find(
      (item) => item.status === "REVIEWING",
    )?.count ?? 0;

  const qualifiedCount =
    dashboard.statusCounts.find(
      (item) => item.status === "QUALIFIED",
    )?.count ?? 0;

  const proposalCount =
    dashboard.statusCounts.find(
      (item) => item.status === "PROPOSAL_SENT",
    )?.count ?? 0;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <header className="mb-10 flex flex-col gap-5 border-b border-slate-800 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.25em] text-emerald-400">
              APLIFIX DIGITAL OFFICE
            </p>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Office Dashboard
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              Pusat kendali internal APLIFIX untuk
              memantau aktivitas bisnis, partnership,
              AI, dan sistem digital.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3">
            <p className="text-xs uppercase tracking-wider text-emerald-400">
              Office Account
            </p>
            <p className="mt-1 text-sm text-slate-300">
              {session.email}
            </p>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Total Partnership"
            value={dashboard.totalPartnership}
            description="Semua minat kerja sama"
          />

          <MetricCard
            label="New"
            value={newCount}
            description="Prospek baru masuk"
          />

          <MetricCard
            label="Reviewing"
            value={reviewingCount}
            description="Sedang ditinjau"
          />

          <MetricCard
            label="Qualified"
            value={qualifiedCount}
            description="Prospek terqualifikasi"
          />
        </section>

        <section className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                  Partnership Pipeline
                </p>

                <h2 className="mt-2 text-xl font-semibold">
                  Status Partnership
                </h2>
              </div>

              <Link
                href="/office/partnership"
                className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-emerald-500/50 hover:text-emerald-300"
              >
                Buka Desk
              </Link>
            </div>

            <div className="mt-6 space-y-3">
              {dashboard.statusCounts.map(
                (item) => (
                  <div
                    key={item.status}
                    className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3"
                  >
                    <span className="text-sm text-slate-300">
                      {STATUS_LABELS[item.status] ??
                        item.status}
                    </span>

                    <span className="min-w-9 rounded-full bg-slate-800 px-2 py-1 text-center text-xs font-semibold text-slate-300">
                      {item.count}
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Pipeline Snapshot
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              Progress
            </h2>

            <div className="mt-6 space-y-5">
              <ProgressItem
                label="Qualified"
                value={qualifiedCount}
                total={dashboard.totalPartnership}
              />

              <ProgressItem
                label="Proposal Sent"
                value={proposalCount}
                total={dashboard.totalPartnership}
              />

              <ProgressItem
                label="New"
                value={newCount}
                total={dashboard.totalPartnership}
              />
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Activity
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                Partnership Terbaru
              </h2>
            </div>

            <Link
              href="/office/partnership"
              className="text-sm text-emerald-400 transition hover:text-emerald-300"
            >
              Lihat semua →
            </Link>
          </div>

          {dashboard.recentPartnerships.length ===
          0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-slate-700 px-5 py-10 text-center text-sm text-slate-500">
              Belum ada partnership masuk.
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[700px] text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500">
                    <th className="px-3 py-3">
                      Nama
                    </th>

                    <th className="px-3 py-3">
                      Interest
                    </th>

                    <th className="px-3 py-3">
                      Status
                    </th>

                    <th className="px-3 py-3">
                      Masuk
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {dashboard.recentPartnerships.map(
                    (item) => (
                      <tr
                        key={item.id}
                        className="border-b border-slate-800 last:border-0"
                      >
                        <td className="px-3 py-4">
                          <p className="text-sm font-medium text-white">
                            {item.name}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {item.email}
                          </p>
                        </td>

                        <td className="px-3 py-4 text-sm text-slate-300">
                          {item.interest}
                        </td>

                        <td className="px-3 py-4">
                          <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300">
                            {STATUS_LABELS[
                              item.status
                            ] ?? item.status}
                          </span>
                        </td>

                        <td className="px-3 py-4 text-xs text-slate-500">
                          {formatDate(
                            item.created_at,
                          )}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <OfficeAction
            title="Partnership Desk"
            description="Kelola prospek dan pipeline kerja sama."
            href="/office/partnership"
          />

          <OfficeAction
            title="AI Secretary"
            description="Pantau intelligence dan komunikasi AI."
            href="/"
          />

          <OfficeAction
            title="Trading Intelligence"
            description="Menuju sistem analisis APLIFIX Trader AI."
            href="/trader"
          />
        </section>
      </div>
    </main>
  );
}

function MetricCard({
  label,
  value,
  description,
}: {
  label: string;
  value: number;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400/80">
        {label}
      </p>

      <p className="mt-4 text-3xl font-bold text-white">
        {value}
      </p>

      <p className="mt-2 text-xs text-slate-500">
        {description}
      </p>
    </div>
  );
}

function ProgressItem({
  label,
  value,
  total,
}: {
  label: string;
  value: number;
  total: number;
}) {
  const percentage =
    total > 0
      ? Math.round((value / total) * 100)
      : 0;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="text-slate-300">
          {label}
        </span>

        <span className="text-emerald-400">
          {value} / {total}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}

function OfficeAction({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition hover:-translate-y-0.5 hover:border-emerald-500/30 hover:bg-slate-900"
    >
      <h3 className="font-semibold text-white transition group-hover:text-emerald-300">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        {description}
      </p>

      <span className="mt-4 inline-block text-xs font-medium text-emerald-400">
        Buka →
      </span>
    </Link>
  );
}
