import Card from "@/components/ui/Card";

export default function ProfitCard() {
  return (
    <Card title="Profit Hari Ini">
      <h2 className="text-3xl font-bold text-emerald-400">
        + Rp 250.000
      </h2>

      <p className="mt-2 text-sm text-slate-400">
        Daily Performance
      </p>
    </Card>
  );
}
