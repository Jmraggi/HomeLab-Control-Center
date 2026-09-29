"use client";

import { useId, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { HistoryPoint } from "@/types/system";
import type { ProviderMetadata } from "@/providers/system-provider";
import { SourceBadge } from "./source-badge";
import { useI18n } from "@/components/layout/language-provider";

export function HistoryChart({ history, metadata }: { history: readonly HistoryPoint[]; metadata?: ProviderMetadata }) {
  const id = useId().replaceAll(":", "");
  const [metric, setMetric] = useState("both");
  const { t } = useI18n();
  return <section className="panel min-w-0">
    <div className="panel-heading flex-wrap"><div><h2 className="text-sm font-medium">{t("resourceHistory")}</h2><p className="mt-1 text-[11px] text-slate-400">{t("cpuMemory")}</p></div><div className="flex items-center gap-2">{metadata && <SourceBadge metadata={metadata} />}<span className="pill text-slate-400">{t("hours24")}</span></div></div>
    <div className="flex flex-wrap items-center justify-between gap-3 px-5 sm:px-6"><div className="flex gap-4 text-[11px]"><span className="text-[#87e5c1]">● CPU</span><span className="text-[#ac9af5]">● {t("memory")}</span></div><select aria-label={t("chartMetric")} value={metric} onChange={event => setMetric(event.target.value)} className="rounded border border-[#303944] bg-[#12171e] px-2 py-1 text-[11px] text-slate-400"><option value="both">{t("bothMetrics")}</option><option value="cpu">{t("cpuOnly")}</option><option value="memory">{t("memoryOnly")}</option></select></div>
    <div className="h-[255px] px-3 pb-4 pt-6" role="img" aria-label={t("cpuMemory")}>
      {history.length ? <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <AreaChart data={history} margin={{ top: 5, right: 15, left: -12, bottom: 0 }}>
          <defs>{[["cpu", "#87e5c1"], ["ram", "#ac9af5"]].map(([key, color]) => <linearGradient key={key} id={id + key} x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity={.16} /><stop offset="100%" stopColor={color} stopOpacity={0} /></linearGradient>)}</defs>
          <CartesianGrid vertical={false} stroke="#29303a" strokeDasharray="3 5" />
          <XAxis dataKey="time" tick={{ fill: "#a0adbd", fontSize: 12 }} tickLine={false} axisLine={false} minTickGap={35} />
          <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tick={{ fill: "#a0adbd", fontSize: 12 }} tickLine={false} axisLine={false} unit="%" />
          <Tooltip formatter={(value) => `${value}%`} contentStyle={{ background: "#19212b", border: "1px solid #36414e", borderRadius: 10, fontSize: 12 }} labelStyle={{ color: "#dce5ed", marginBottom: 6 }} />
          {metric !== "memory" && <Area isAnimationActive={false} type="monotone" dataKey="cpuPercent" name="CPU" stroke="#87e5c1" fill={`url(#${id}cpu)`} strokeWidth={2} />}
          {metric !== "cpu" && <Area isAnimationActive={false} type="monotone" dataKey="memoryPercent" name={t("memory")} stroke="#ac9af5" fill={`url(#${id}ram)`} strokeWidth={2} />}
        </AreaChart>
      </ResponsiveContainer> : <p className="p-10 text-center text-sm text-slate-400">{t("noHistory")}</p>}
    </div>
  </section>;
}
