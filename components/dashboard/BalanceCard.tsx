import Card from "@/components/ui/Card";

export default function BalanceCard() {
  return (
    <Card title="Total Balance">
      <h2 className="text-3xl font-bold text-white">
        Rp 10.000.000
      </h2>

      <p className="mt-2 text-sm text-slate-400">
        Demo Trading Account
      </p>
    </Card>
  );
}
