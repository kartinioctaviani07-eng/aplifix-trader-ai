"use client";

import {
  ChangeEvent,
  useState,
} from "react";
import Link from "next/link";

type UploadResponse = {
  success: boolean;
  message: string;
  data?: {
    paymentId: string;
    status: string;
  };
};

export default function MemberPaymentPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    setError("");
    setMessage("");

    const selectedFile =
      event.target.files?.[0] ?? null;

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setFile(null);
      setError("Ukuran file maksimal 5 MB.");
      event.target.value = "";
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "application/pdf",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setFile(null);
      setError(
        "Format file harus JPG, PNG, atau PDF.",
      );
      event.target.value = "";
      return;
    }

    setFile(selectedFile);
  }

  async function handleUpload() {
    if (!file) {
      setError(
        "Pilih bukti pembayaran terlebih dahulu.",
      );
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const formData = new FormData();

      formData.append("proof", file);

      const response = await fetch(
        "/api/member/payment",
        {
          method: "POST",
          body: formData,
        },
      );

      const result =
        (await response.json()) as UploadResponse;

      if (!response.ok || !result.success) {
        setError(
          result.message ||
            "Upload bukti pembayaran gagal.",
        );
        return;
      }

      setMessage(
        "Bukti pembayaran berhasil dikirim. Pembayaran sedang menunggu verifikasi Office APLIFIX.",
      );

      setFile(null);
    } catch {
      setError(
        "Tidak dapat terhubung ke server.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          <Link
            href="/member/register"
            className="text-sm text-slate-500 transition hover:text-white"
          >
            ← Kembali ke pendaftaran
          </Link>

          <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
              Member Activation
            </p>

            <h1 className="mt-4 text-3xl font-bold sm:text-4xl">
              Aktivasi Member APLIFIX
            </h1>

            <p className="mt-4 leading-7 text-slate-400">
              Selesaikan pembayaran aktivasi Member
              sebesar Rp10.000. Setelah melakukan
              transfer, unggah bukti pembayaran melalui
              halaman ini.
            </p>

            <div className="mt-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
              <p className="text-sm text-slate-400">
                Biaya Aktivasi
              </p>

              <p className="mt-2 text-4xl font-bold text-white">
                Rp10.000
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-6">
              <p className="text-sm font-semibold text-slate-300">
                Transfer ke rekening
              </p>

              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    Bank
                  </p>

                  <p className="mt-1 text-lg font-semibold">
                    BCA
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    Nomor Rekening
                  </p>

                  <p className="mt-1 text-2xl font-bold tracking-wide text-emerald-400">
                    7753289820
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    Atas Nama
                  </p>

                  <p className="mt-1 text-lg font-semibold">
                    KARTINI OCTAVIANI
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950 p-6">
              <p className="text-sm font-semibold text-slate-300">
                Setelah transfer
              </p>

              <ol className="mt-4 space-y-3 text-sm leading-6 text-slate-400">
                <li>
                  <span className="font-semibold text-white">
                    1.
                  </span>{" "}
                  Transfer tepat Rp10.000 ke rekening
                  BCA di atas.
                </li>

                <li>
                  <span className="font-semibold text-white">
                    2.
                  </span>{" "}
                  Simpan bukti transfer.
                </li>

                <li>
                  <span className="font-semibold text-white">
                    3.
                  </span>{" "}
                  Pilih dan upload bukti pembayaran
                  pada halaman ini.
                </li>

                <li>
                  <span className="font-semibold text-white">
                    4.
                  </span>{" "}
                  Office APLIFIX akan melakukan verifikasi.
                </li>
              </ol>
            </div>

            <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950 p-6">
              <p className="text-sm font-semibold text-slate-300">
                Upload Bukti Pembayaran
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Format yang diterima: JPG, PNG, atau PDF.
                Maksimal 5 MB.
              </p>

              <label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-900 px-6 py-10 text-center transition hover:border-emerald-500 hover:bg-slate-800">
                <span className="text-4xl">
                  📄
                </span>

                <span className="mt-4 text-sm font-semibold text-white">
                  Pilih Bukti Pembayaran
                </span>

                <span className="mt-2 text-xs text-slate-500">
                  Klik area ini untuk memilih file
                </span>

                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </label>

              {file && (
                <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    File dipilih
                  </p>

                  <p className="mt-1 break-all text-sm font-semibold text-emerald-400">
                    {file.name}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {(file.size / 1024 / 1024).toFixed(
                      2,
                    )}{" "}
                    MB
                  </p>
                </div>
              )}

              {error && (
                <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
                  {error}
                </div>
              )}

              {message && (
                <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm leading-6 text-emerald-400">
                  {message}
                </div>
              )}

              <button
                type="button"
                onClick={handleUpload}
                disabled={!file || loading}
                className="mt-5 w-full rounded-xl bg-emerald-500 px-5 py-3.5 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500"
              >
                {loading
                  ? "Mengirim Bukti..."
                  : "Kirim Bukti Pembayaran"}
              </button>
            </div>

            <p className="mt-8 text-xs leading-5 text-slate-500">
              Aktivasi Member bukan investasi, bukan
              pembelian saham, dan tidak menjanjikan
              keuntungan. Saldo Rp10.000.000 merupakan
              saldo demo/simulasi.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
