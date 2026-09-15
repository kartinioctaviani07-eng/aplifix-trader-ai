"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

type Action = {
  label: string;
  href: string;
};

type ChatMessage = {
  role: "assistant" | "user";
  text: string;
  actions?: Action[];
};

const initialMessage: ChatMessage = {
  role: "assistant",
  text:
    "Halo 👋 Saya APLIFIX AI Assistant. Saya bisa membantu menjelaskan PT APLIFIX DIGITAL INDONESIA, APLIFIX Trader AI, teknologi yang kami bangun, proposal, dan peluang kerja sama. Silakan tanya dengan bahasa biasa saja.",
};

export default function AIFloatingAssistant() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const text = message.trim();

    if (!text || loading) {
      return;
    }

    setMessages((current) => [
      ...current,
      {
        role: "user",
        text,
      },
    ]);
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai-secretary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
        }),
      });

      const data = (await response.json()) as {
        success?: boolean;
        answer?: string;
        message?: string;
        actions?: Action[];
      };

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text:
            data.answer ??
            data.message ??
            "Maaf, saya belum dapat menjawab pertanyaan tersebut.",
          actions: data.actions,
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text:
            "Maaf, koneksi ke APLIFIX AI Assistant sedang bermasalah. Silakan coba lagi.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open ? (
        <div className="flex w-[min(390px,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-emerald-500/20 bg-slate-950 shadow-2xl shadow-black/50">
          <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-5 py-4">
            <div>
              <p className="text-sm font-semibold text-white">
                APLIFIX AI Assistant
              </p>
              <p className="mt-1 text-xs text-emerald-400">
                Digital Secretary
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-1 text-slate-400 transition hover:bg-slate-800 hover:text-white"
              aria-label="Tutup AI Assistant"
            >
              ×
            </button>
          </div>

          <div className="max-h-[430px] space-y-4 overflow-y-auto p-4">
            {messages.map((item, index) => (
              <div
                key={`${item.role}-${index}`}
                className={
                  item.role === "user"
                    ? "ml-8 rounded-2xl rounded-br-md bg-emerald-500 p-3 text-sm text-slate-950"
                    : "mr-4 rounded-2xl rounded-bl-md border border-slate-800 bg-slate-900 p-4 text-sm leading-6 text-slate-300"
                }
              >
                <p>{item.text}</p>

                {item.actions && item.actions.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.actions.map((action) => (
                      <Link
                        key={`${action.href}-${action.label}`}
                        href={action.href}
                        onClick={() => setOpen(false)}
                        className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500/20"
                      >
                        {action.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}

            {loading ? (
              <div className="mr-4 rounded-2xl rounded-bl-md border border-slate-800 bg-slate-900 p-4 text-sm text-slate-500">
                APLIFIX Assistant sedang berpikir...
              </div>
            ) : null}
          </div>

          <form
            onSubmit={sendMessage}
            className="border-t border-slate-800 bg-slate-900/70 p-3"
          >
            <div className="flex gap-2">
              <input
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Tanyakan tentang APLIFIX..."
                className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={loading || !message.trim()}
                className="rounded-xl bg-emerald-500 px-4 text-sm font-bold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Kirim
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-3 rounded-full border border-emerald-500/30 bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-xl shadow-black/30 transition hover:border-emerald-400 hover:bg-slate-800"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-lg text-slate-950">
            AI
          </span>
          <span>
            <span className="block">APLIFIX AI</span>
            <span className="block text-xs font-normal text-emerald-400">
              Ask our digital secretary
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
