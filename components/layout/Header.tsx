"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Contact", href: "/contact" },
  { label: "Trader AI", href: "/trader" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b border-slate-800 bg-slate-950">
      <div className="flex items-center justify-between gap-8 px-8 py-4">
        {/* Brand */}
        <Link href="/trader" className="shrink-0">
          <h1 className="text-xl font-bold text-white">
            APLIFIX AI
          </h1>

          <p className="text-sm text-slate-400">
            Trader Intelligence Platform
          </p>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navigation.map((item) => {
            const isActive =
              item.href === "/trader"
                ? pathname === "/trader"
                : pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Platform Status */}
        <div className="flex items-center gap-4">
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2">
            <p className="text-xs text-slate-400">
              AI Engine
            </p>

            <p className="font-semibold text-emerald-400">
              ● Online
            </p>
          </div>

          <div className="hidden rounded-xl border border-slate-800 px-4 py-2 sm:block">
            <p className="text-xs text-slate-400">
              Market Status
            </p>

            <p className="font-semibold text-white">
              Active
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800">
            <span className="font-bold text-white">
              AI
            </span>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      <nav className="flex gap-1 overflow-x-auto border-t border-slate-800 px-6 py-2 lg:hidden">
        {navigation.map((item) => {
          const isActive =
            item.href === "/trader"
              ? pathname === "/trader"
              : pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition ${
                isActive
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
