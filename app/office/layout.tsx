"use client";

import Link from "next/link";
import { ReactNode, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type OfficeLayoutProps = {
  children: ReactNode;
};

type NavigationItem = {
  label: string;
  href: string;
  description: string;
  active?: boolean;
};

const navigationItems: NavigationItem[] = [
  {
    label: "Dashboard",
    href: "/office",
    description: "Ringkasan Office",
  },
  {
    label: "Partnership",
    href: "/office/partnership",
    description: "Pipeline kerja sama",
  },
  {
    label: "AI Secretary",
    href: "/",
    description: "AI assistant",
    active: false,
  },
  {
    label: "Trading Intelligence",
    href: "/trader",
    description: "APLIFIX Trader AI",
    active: false,
  },
];

const comingSoonItems = [
  {
    label: "Risk Management",
    description: "Risk & capital control",
  },
  {
    label: "AI Team",
    description: "Digital AI employees",
  },
  {
    label: "System",
    description: "System & audit",
  },
];

export default function OfficeLayout({
  children,
}: OfficeLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  if (pathname === "/office/login") {
    return <>{children}</>;
  }

  async function handleLogout() {
    if (loggingOut) {
      return;
    }

    setLoggingOut(true);

    try {
      await fetch("/api/office/logout", {
        method: "POST",
      });
    } finally {
      router.push("/office/login");
      router.refresh();
    }
  }

  function isActive(href: string): boolean {
    if (href === "/office") {
      return pathname === "/office";
    }

    return pathname.startsWith(href);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">
        {mobileOpen && (
          <button
            type="button"
            aria-label="Tutup menu"
            className="fixed inset-0 z-30 bg-black/70 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        <aside
          className={[
            "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-800 bg-slate-950 transition-transform duration-200 lg:static lg:translate-x-0",
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full",
          ].join(" ")}
        >
          <div className="flex h-20 items-center border-b border-slate-800 px-6">
            <Link
              href="/office"
              onClick={() => setMobileOpen(false)}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400">
                APLIFIX
              </p>

              <p className="mt-1 text-sm font-semibold text-white">
                Digital Office
              </p>
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-6">
            <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              Workspace
            </p>

            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const active =
                  item.active !== false &&
                  isActive(item.href);

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={[
                      "block rounded-xl border px-3 py-3 transition",
                      active
                        ? "border-emerald-500/20 bg-emerald-500/10"
                        : "border-transparent hover:border-slate-800 hover:bg-slate-900/60",
                    ].join(" ")}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span
                        className={[
                          "text-sm font-medium",
                          active
                            ? "text-white"
                            : "text-slate-300",
                        ].join(" ")}
                      >
                        {item.label}
                      </span>

                      {active && (
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      )}
                    </div>

                    <p className="mt-1 text-[11px] text-slate-500">
                      {item.description}
                    </p>
                  </Link>
                );
              })}
            </nav>

            <p className="mb-3 mt-8 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              Coming Soon
            </p>

            <div className="space-y-2">
              {comingSoonItems.map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-transparent px-3 py-3 opacity-60"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-slate-400">
                      {item.label}
                    </span>

                    <span className="rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5 text-[9px] uppercase tracking-wider text-slate-500">
                      Soon
                    </span>
                  </div>

                  <p className="mt-1 text-[11px] text-slate-600">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-800 p-4">
            <div className="mb-3 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-3">
              <p className="text-[10px] uppercase tracking-wider text-slate-500">
                Internal Workspace
              </p>

              <p className="mt-1 text-xs text-slate-400">
                APLIFIX Digital Office
              </p>
            </div>

            <button
              type="button"
              disabled={loggingOut}
              onClick={() => {
                void handleLogout();
              }}
              className="w-full rounded-xl border border-slate-800 px-3 py-2.5 text-left text-sm text-slate-400 transition hover:bg-slate-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loggingOut ? "Keluar..." : "Keluar dari Office"}
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex h-16 items-center border-b border-slate-800 bg-slate-950/95 px-4 backdrop-blur lg:hidden">
            <button
              type="button"
              aria-label="Buka menu"
              onClick={() => setMobileOpen(true)}
              className="rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-300 transition hover:border-emerald-500/40 hover:text-white"
            >
              ☰
            </button>

            <div className="ml-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                APLIFIX
              </p>

              <p className="text-xs text-slate-500">
                Digital Office
              </p>
            </div>
          </header>

          <div className="min-w-0 flex-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
