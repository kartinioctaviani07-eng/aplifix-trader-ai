"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

type PaymentStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

type MemberPayment = {
  id: string;
  member_id: string;
  name: string;
  email: string;
  member_status: string;
  amount: number;
  payment_method: string;
  proof_path: string | null;
  payment_status: string;
  submitted_at: number | null;
  reviewed_at: number | null;
  reviewed_by: string | null;
  rejection_reason: string | null;
};

type MemberPaymentsResponse = {
  success?: boolean;
  message?: string;
  data?: {
    payments?: MemberPayment[];
  };
};

type ReviewResponse = {
  success?: boolean;
  message?: string;
};

function formatDate(
  timestamp: number | null,
): string {
  if (!timestamp) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestamp));
}

function formatRupiah(
  amount: number,
): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function isPaymentStatus(
  value: string,
): value is PaymentStatus {
  return (
    value === "PENDING" ||
    value === "APPROVED" ||
    value === "REJECTED"
  );
}

function formatPaymentStatus(
  status: string,
): string {
  switch (status) {
    case "PENDING":
      return "Pending";
    case "APPROVED":
      return "Approved";
    case "REJECTED":
      return "Rejected";
    default:
      return status;
  }
}

function paymentStatusClasses(
  status: string,
): string {
  if (!isPaymentStatus(status)) {
    return "border-slate-400/20 bg-slate-400/10 text-slate-300";
  }

  switch (status) {
    case "PENDING":
      return "border-amber-400/20 bg-amber-400/10 text-amber-300";

    case "APPROVED":
      return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";

    case "REJECTED":
      return "border-red-400/20 bg-red-400/10 text-red-300";
  }
}

function StatCard({
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

export default function MemberPaymentsDeskPage() {
  const [items, setItems] = useState<
    MemberPayment[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [status, setStatus] =
    useState("");

  const [reviewingId, setReviewingId] =
    useState<string | null>(null);

  async function loadPayments(): Promise<void> {
    try {
      setLoading(true);
      setStatus("");

      const response = await fetch(
        "/api/office/member-payments",
        {
          cache: "no-store",
        },
      );

      const data =
        (await response.json()) as MemberPaymentsResponse;

      if (response.status === 401) {
        window.location.href =
          "/office/login";
        return;
      }

      if (!response.ok || !data.success) {
        setStatus(
          data.message ??
            "Data pembayaran belum dapat dimuat.",
        );
        return;
      }

      setItems(
        data.data?.payments ?? [],
      );
    } catch {
      setStatus(
        "Koneksi bermasalah saat mengambil data pembayaran.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadPayments();
  }, []);

  const counts = useMemo(() => {
    return {
      total: items.length,

      pending: items.filter(
        (item) =>
          item.payment_status === "PENDING",
      ).length,

      approved: items.filter(
        (item) =>
          item.payment_status === "APPROVED",
      ).length,

      rejected: items.filter(
        (item) =>
          item.payment_status === "REJECTED",
      ).length,
    };
  }, [items]);

  async function reviewPayment(
    payment: MemberPayment,
    action: "APPROVE" | "REJECT",
  ): Promise<void> {
    if (payment.payment_status !== "PENDING") {
      return;
    }

    const isApprove =
      action === "APPROVE";

    const confirmationMessage = isApprove
      ? `Setujui pembayaran ${payment.name} sebesar ${formatRupiah(
          payment.amount,
        )}?\n\nMember akan menjadi ACTIVE dan Demo Account Rp10.000.000 akan dibuat.`
      : `Tolak pembayaran ${payment.name} sebesar ${formatRupiah(
          payment.amount,
        )}?\n\nMember akan menjadi REJECTED.`;

    const confirmed = window.confirm(
      confirmationMessage,
    );

    if (!confirmed) {
      return;
    }

    try {
      setReviewingId(payment.id);
      setStatus("");

      const response = await fetch(
        "/api/office/member-payments/review",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentId: payment.id,
            action,
          }),
        },
      );

      const data =
        (await response.json()) as ReviewResponse;

      if (response.status === 401) {
        window.location.href =
          "/office/login";
        return;
      }

      if (!response.ok || !data.success) {
        setStatus(
          data.message ??
            "Review pembayaran gagal diproses.",
        );
        return;
      }

      setStatus(
        data.message ??
          "Review pembayaran berhasil diproses.",
      );

      await loadPayments();
    } catch {
      setStatus(
        "Koneksi bermasalah saat memproses pembayaran.",
      );
    } finally {
      setReviewingId(null);
    }
  }

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
            MEMBER PAYMENTS DESK
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight">
            Pembayaran Member
          </h1>

          <p className="mt-3 max-w-3xl text-slate-400">
            Pantau pembayaran aktivasi Member
            APLIFIX dari satu tempat. Setiap
            pembayaran menunggu pemeriksaan Office
            sebelum Member diaktifkan.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total"
            value={counts.total}
            description="Semua pembayaran"
          />

          <StatCard
            label="Pending"
            value={counts.pending}
            description="Menunggu verifikasi"
          />

          <StatCard
            label="Approved"
            value={counts.approved}
            description="Pembayaran disetujui"
          />

          <StatCard
            label="Rejected"
            value={counts.rejected}
            description="Pembayaran ditolak"
          />
        </div>

        {status ? (
          <div className="mt-8 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-4 text-sm text-emerald-200">
            {status}
          </div>
        ) : null}

        <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
          {loading ? (
            <div className="p-8 text-slate-400">
              Memuat pembayaran Member...
            </div>
          ) : items.length === 0 ? (
            <div className="p-8 text-slate-400">
              Belum ada pembayaran Member yang masuk.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1350px] text-left text-sm">
                <thead className="border-b border-white/10 bg-white/[0.03]">
                  <tr>
                    <th className="px-5 py-4">
                      Member
                    </th>

                    <th className="px-5 py-4">
                      Pembayaran
                    </th>

                    <th className="px-5 py-4">
                      Status Member
                    </th>

                    <th className="px-5 py-4">
                      Status Pembayaran
                    </th>

                    <th className="px-5 py-4">
                      Dikirim
                    </th>

                    <th className="px-5 py-4">
                      Bukti
                    </th>

                    <th className="px-5 py-4">
                      Review
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {items.map((item) => {
                    const isPending =
                      item.payment_status ===
                      "PENDING";

                    const isReviewing =
                      reviewingId === item.id;

                    return (
                      <tr
                        key={item.id}
                        className="border-b border-white/10 last:border-0"
                      >
                        <td className="px-5 py-5">
                          <p className="font-medium text-white">
                            {item.name}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {item.email}
                          </p>
                        </td>

                        <td className="px-5 py-5">
                          <p className="font-medium text-white">
                            {formatRupiah(
                              item.amount,
                            )}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {item.payment_method}
                          </p>
                        </td>

                        <td className="px-5 py-5">
                          <span className="rounded-full border border-slate-400/20 bg-slate-400/10 px-3 py-1 text-xs font-medium text-slate-300">
                            {item.member_status}
                          </span>
                        </td>

                        <td className="px-5 py-5">
                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-medium ${paymentStatusClasses(
                              item.payment_status,
                            )}`}
                          >
                            {formatPaymentStatus(
                              item.payment_status,
                            )}
                          </span>

                          {item.reviewed_by ? (
                            <p className="mt-2 text-xs text-slate-600">
                              oleh{" "}
                              {item.reviewed_by}
                            </p>
                          ) : null}
                        </td>

                        <td className="px-5 py-5 text-xs text-slate-500">
                          {formatDate(
                            item.submitted_at,
                          )}
                        </td>

                        <td className="px-5 py-5">
                          {item.proof_path ? (
                            <a
                              href={`/api/office/member-payments/proof?id=${encodeURIComponent(
                                item.id,
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-emerald-500/40 hover:text-emerald-300"
                            >
                              Lihat Bukti
                            </a>
                          ) : (
                            <span className="text-xs text-slate-600">
                              Tidak tersedia
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-5">
                          {isPending ? (
                            <div className="flex gap-2">
                              <button
                                type="button"
                                disabled={isReviewing}
                                onClick={() =>
                                  void reviewPayment(
                                    item,
                                    "APPROVE",
                                  )
                                }
                                className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {isReviewing
                                  ? "Memproses..."
                                  : "Approve"}
                              </button>

                              <button
                                type="button"
                                disabled={isReviewing}
                                onClick={() =>
                                  void reviewPayment(
                                    item,
                                    "REJECT",
                                  )
                                }
                                className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-600">
                              Sudah diproses
                            </span>
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

        <div className="mt-8 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5">
          <p className="text-sm font-semibold text-amber-300">
            Catatan verifikasi
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            Pastikan bukti pembayaran telah diperiksa
            sebelum memilih Approve. Approval akan
            mengaktifkan Member dan membuat Demo
            Account sebesar Rp10.000.000. Reject akan
            menandai pembayaran dan Member sebagai
            ditolak.
          </p>
        </div>
      </div>
    </main>
  );
}
