import Layout from "@/components/layout/Layout";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

import BalanceCard from "@/components/dashboard/BalanceCard";
import ProfitCard from "@/components/dashboard/ProfitCard";
import SignalCard from "@/components/dashboard/SignalCard";
import MarketCard from "@/components/dashboard/MarketCard";
import Watchlist from "@/components/dashboard/Watchlist";
import MarketChart from "@/components/dashboard/MarketChart";
import AIScanner from "@/components/dashboard/AIScanner";
import AIBrainCard from "@/components/dashboard/AIBrainCard";
import AIFocusSelector from "@/components/dashboard/AIFocusSelector";
import CEOCard from "@/components/dashboard/CEOCard";

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
              <h1 className="text-3xl font-bold text-white">
                APLIFIX Trader AI
              </h1>

              <p className="mt-2 text-slate-400">
                AI Powered Trading Dashboard
              </p>

              <div className="mt-8 grid grid-cols-3 gap-6">
                <BalanceCard />
                <ProfitCard />
                <SignalCard />
              </div>

              <div className="mt-8">
                <CEOCard />
              </div>

              <div className="mt-8">
                <AIFocusSelector />
              </div>

              <div className="mt-8">
                <MarketChart />
              </div>

              <div className="mt-8 grid grid-cols-2 gap-6">
                <AIScanner />
                <AIBrainCard />
                <Watchlist />
              </div>

              <div className="mt-8">
                <MarketCard />
              </div>
            </main>
          </div>
        </Layout>
      </SchedulerProvider>
    </AIFocusProvider>
  );
}
