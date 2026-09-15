"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

const PARTNERSHIP_STATUSES = [
  "NEW",
  "REVIEWING",
  "CONTACTED",
  "QUALIFIED",
  "PROPOSAL_SENT",
  "AGREEMENT",
  "COMPLETED",
] as const;

type PartnershipStatus =
  (typeof PARTNERSHIP_STATUSES)[number];

type PartnershipInterest = {
  id: string;
  name: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
  status: string;
  created_at: number;
  updated_at: number;
};

type PartnershipResponse = {
  success?: boolean;
  message?: string;
  user?: {
    email: string;
  };
  data?: PartnershipInterest[];
};

type StatusUpdateResponse = {
  success?: boolean;
  message?: string;
};

function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestamp));
}

function isPartnershipStatus(
  value: string,
): value is PartnershipStatus {
  return PARTNERSHIP_STATUSES.includes(
    value as PartnershipStatus,
  );
}

function formatStatus(
  status: PartnershipStatus,
): string {
  switch (status) {
    case "NEW":
      return "New";
    case "REVIEWING":
      return "Reviewing";
    case "CONTACTED":
      return "Contacted";
    case "QUALIFIED":
      return "Qualified";
    case "PROPOSAL_SENT":
      return "Proposal Sent";
    case "AGREEMENT":
      return "Agreement";
    case "COMPLETED":
      return "Completed";
  }
}

function statusClasses(
  status: PartnershipStatus,
): string {
  switch (status) {
    case "NEW":
      return "border-sky-400/20 bg-sky-400/10 text-sky-300";
    case "REVIEWING":
      return "border-amber-400/20 bg-amber-400/10 text-amber-300";
    case "CONTACTED":
      return "border-violet-400/20 bg-violet-400/10 text-violet-300";
    case "QUALIFIED":
      return "border-cyan-400/20 bg-cyan-400/10 text-cyan-300";
    case "PROPOSAL_SENT":
      return "border-orange-400/20 bg-orange-400/10 text-orange-300";
    case "AGREEMENT":
      return "border-pink-400/20 bg-pink-400/10 text-pink-300";
    case "COMPLETED":
      return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
  }
}

export default function PartnershipDeskPage() {
  const [items, setItems] = useState<
    PartnershipInterest[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState("");

  const [updatingId, setUpdatingId] =
    useState<string | null>(null);

  async function loadPartnerships(): Promise<void> {
    try {
      setLoading(true);
      setStatus("");

      const response = await fetch(
        "/api/office/partnership",
        {
          cache: "no-store",
        },
      );

      const data =
        (await response.json()) as PartnershipResponse;

      if (response.status === 401) {
        window.location.href = "/office/login";
        return;
      }

      if (!response.ok || !data.success) {
        setStatus(
          data.message ??
            "Data belum dapat dimuat.",
        );
        return;
      }

      setItems(data.data ?? []);
    } catch {
      setStatus(
        "Koneksi bermasalah saat mengambil data.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadPartnerships();
  }, []);

  async function updateStatus(
    partnershipId: string,
    nextStatus: PartnershipStatus,
  ): Promise<void> {
    const currentItem = items.find(
      (item) => item.id === partnershipId,
    );

    if (
      !currentItem ||
      currentItem.status === nextStatus
    ) {
      return;
    }

    setUpdatingId(partnershipId);
    setStatus("");

    try {
      const response = await fetch(
        "/api/office/partnership",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: partnershipId,
            status: nextStatus,
          }),
        },
      );

      const data =
        (await response.json()) as StatusUpdateResponse;

      if (response.status === 401) {
        window.location.href = "/office/login";
        return;
      }

      if (!response.ok || !data.success) {
        setStatus(
          data.message ??
            "Status belum dapat diperbarui.",
        );
        return;
      }

      setItems((currentItems) =>
        currentItems.map((item) =>
          item.id === partnershipId
            ? {
                ...item,
                status: nextStatus,
                updated_at: Date.now(),
              }
            : item,
        ),
      );
    } catch {
      setStatus(
        "Koneksi bermasalah saat memperbarui status.",
      );
    } finally {
      setUpdatingId(null);
    }
  }

  const counts = useMemo(() => {
    return {
      new: items.filter(
        (item) => item.status === "NEW",
      ).length,
      reviewing: items.filter(
        (item) => item.status === "REVIEWING",
      ).length,
      contacted: items.filter(
        (item) => item.status === "CONTACTED",
      ).length,
      qualified: items.filter(
        (item) => item.status === "QUALIFIED",
      ).length,
      proposalSent: items.filter(
        (item) => item.status === "PROPOSAL_SENT",
      ).length,
      agreement: items.filter(
        (item) => item.status === "AGREEMENT",
      ).length,
      completed: items.filter(
        (item) => item.status === "COMPLETED",
      ).length,
    };
  }, [items]);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/office"
          className="text-sm font-medium text-emerald-400 hover:text-emerald-300"
        >
          ← Kembali ke Office
        </Link>

        <div className="mt-6">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
            PARTNERSHIP DESK
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight">
            Minat Kerja Sama
          </h1>

          <p className="mt-3 max-w-3xl text-slate-400">
            Kelola pipeline kerja sama APLIFIX dari
            satu tempat. Setiap perubahan status
            tercatat sebagai audit trail internal.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="New"
            value={counts.new}
          />

          <StatCard
            label="Reviewing"
            value={counts.reviewing}
          />

          <StatCard
            label="Contacted"
            value={counts.contacted}
          />

          <StatCard
            label="Qualified"
            value={counts.qualified}
          />

          <StatCard
            label="Proposal Sent"
            value={counts.proposalSent}
          />

          <StatCard
            label="Agreement"
            value={counts.agreement}
          />

          <StatCard
            label="Completed"
            value={counts.completed}
          />

          <StatCard
            label="Total"
            value={items.length}
          />
        </div>

        {status ? (
          <div className="mt-8 rounded-2xl border border-red-400/20 bg-red-400/10 px-5 py-4 text-sm text-red-200">
            {status}
          </div>
        ) : null}

        <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
          {loading ? (
            <div className="p-8 text-slate-400">
              Memuat data partnership...
            </div>
          ) : items.length === 0 ? (
            <div className="p-8 text-slate-400">
              Belum ada minat kerja sama yang masuk.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] text-left text-sm">
                <thead className="border-b border-white/10 bg-white/[0.03]">
                  <tr>
                    <th className="px-5 py-4">
                      Nama
                    </th>

                    <th className="px-5 py-4">
                      Kontak
                    </th>

                    <th className="px-5 py-4">
                      Interest
                    </th>

                    <th className="px-5 py-4">
                      Pipeline
                    </th>

                    <th className="px-5 py-4">
                      Masuk
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {items.map((item) => {
                    const validStatus =
                      isPartnershipStatus(
                        item.status,
                      )
                        ? item.status
                        : "NEW";

                    const updating =
                      updatingId === item.id;

                    return (
                      <tr
                        key={item.id}
                        className="border-b border-white/5 last:border-0"
                      >
                        <td className="px-5 py-5 align-top">
                          <p className="font-semibold">
                            {item.name}
                          </p>

                          {item.message ? (
                            <p className="mt-1 max-w-sm text-slate-500">
                              {item.message}
                            </p>
                          ) : null}
                        </td>

                        <td className="px-5 py-5 align-top text-slate-400">
                          <p>{item.email}</p>

                          {item.phone ? (
                            <p className="mt-1">
                              {item.phone}
                            </p>
                          ) : null}
                        </td>

                        <td className="px-5 py-5 align-top text-slate-300">
                          {item.interest}
                        </td>

                        <td className="px-5 py-5 align-top">
                          <div className="flex items-center gap-3">
                            <span
                              className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusClasses(
                                validStatus,
                              )}`}
                            >
                              {formatStatus(
                                validStatus,
                              )}
                            </span>

                            <select
                              value={validStatus}
                              disabled={updating}
                              onChange={(event) => {
                                const nextStatus =
                                  event.target.value;

                                if (
                                  isPartnershipStatus(
                                    nextStatus,
                                  )
                                ) {
                                  void updateStatus(
                                    item.id,
                                    nextStatus,
                                  );
                                }
                              }}
                              className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white outline-none transition hover:border-emerald-400/30 focus:border-emerald-400 disabled:cursor-wait disabled:opacity-50"
                            >
                              {PARTNERSHIP_STATUSES.map(
                                (option) => (
                                  <option
                                    key={option}
                                    value={option}
                                  >
                                    {formatStatus(
                                      option,
                                    )}
                                  </option>
                                ),
                              )}
                            </select>

                            {updating ? (
                              <span className="text-xs text-slate-500">
                                Menyimpan...
                              </span>
                            ) : null}
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-5 py-5 align-top text-slate-500">
                          {formatDate(
                            item.created_at,
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <p className="text-sm text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-3xl font-bold">
        {value}
      </p>
    </div>
  );
}
