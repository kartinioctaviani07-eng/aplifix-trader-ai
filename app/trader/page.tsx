import Layout from "@/components/layout/Layout";

import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

import SignalCard from "@/components/dashboard/SignalCard";
import MarketCard from "@/components/dashboard/MarketCard";
import Watchlist from "@/components/dashboard/Watchlist";
import MarketChart from "@/components/dashboard/MarketChart";
import AIScanner from "@/components/dashboard/AIScanner";
import AIBrainCard from "@/components/dashboard/AIBrainCard";
import AIFocusSelector from "@/components/dashboard/AIFocusSelector";
import AIIntelligenceCenter from "@/components/dashboard/AIIntelligenceCenter";
import CEOCard from "@/components/dashboard/CEOCard";
import TradingActivityPanel from "@/components/dashboard/TradingActivityPanel";

import { AIFocusProvider } from "@/context/AIFocusContext";
import { SchedulerProvider } from "@/context/SchedulerContext";

export default function Home() {
  return (
    <AIFocusProvider>
      <SchedulerProvider>
        <Layout>
          <Header />

          <div className="flex">
            <Sidebar />

            <main className="min-h-screen flex-1 bg-slate-950 p-8">
              <div>
                <h1 className="text-3xl font-bold text-white">
                  APLIFIX Trader AI
                </h1>

                <p className="mt-2 text-slate-400">
                  AI Powered Trading Intelligence
                </p>
              </div>

              {/* MARKET CHART */}
              <section className="mt-8">
                <MarketChart />
              </section>

              {/* MARKET OVERVIEW */}
              <section className="mt-8">
                <MarketCard />
              </section>

              {/* APLIFIX AI */}
              <section className="mt-8">
                <div className="mb-5">
                  <h2 className="text-2xl font-bold text-white">
                    APLIFIX AI
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    Trader Intelligence — AI departments working together
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <CEOCard />
                  <AIFocusSelector />
                  <AIIntelligenceCenter />
                  <SignalCard />
                  <AIBrainCard />
                </div>
              </section>

              {/* AI SCANNER + WATCHLIST */}
              <section className="mt-8">
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                  <AIScanner />
                  <Watchlist />
                </div>
              </section>

              {/* TRADING ACTIVITY */}
              <section className="mt-8">
                <TradingActivityPanel />
              </section>
            </main>
          </div>
        </Layout>
      </SchedulerProvider>
    </AIFocusProvider>
  );
}
