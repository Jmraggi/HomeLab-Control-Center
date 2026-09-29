import { Cpu, MemoryStick, HardDrive, Thermometer } from "lucide-react";

const tones = {
  cyan: { color: "#87e5c1", icon: Cpu },
  violet: { color: "#ac9af5", icon: MemoryStick },
  emerald: { color: "#7dbcf3", icon: HardDrive },
  amber: { color: "#e7b56b", icon: Thermometer },
};

export function MetricCard({ label, value, detail, progress, tone }: {
  label: string; value: string; detail: string; progress: number; tone: keyof typeof tones;
}) {
  const { color, icon: Icon } = tones[tone];
  return <article className="panel p-5">
    <div className="flex items-center justify-between"><span className="text-xs text-slate-400">{label}</span><Icon size={16} style={{ color }} /></div>
    <p className="mt-5 text-[30px] font-medium tracking-tight tabular-nums">{value}</p>
    <p className="mt-1 text-[11px] text-slate-400">{detail}</p>
    <div className="mt-5 h-1 overflow-hidden rounded-full bg-[#29313c]" aria-hidden="true"><div className="h-full rounded-full" style={{ width: `${Math.min(100, Math.max(0, progress))}%`, background: color }} /></div>
  </article>;
}
