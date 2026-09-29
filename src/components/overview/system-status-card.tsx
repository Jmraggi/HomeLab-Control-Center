"use client";

import { Clock3, Server } from "lucide-react";
import { useI18n } from "@/components/layout/language-provider";
import type { ProviderMetadata } from "@/providers/system-provider";
import type { SystemStats } from "@/types/system";
import { SourceBadge } from "./source-badge";

export function SystemStatusCard({ system, metadata }: { system: SystemStats; metadata: ProviderMetadata }) {
  const { t } = useI18n();
  return <section className="panel relative flex flex-col justify-between gap-5 p-6 sm:flex-row sm:items-center">
    <div className="flex min-w-0 items-center gap-4">
      <span className="grid size-13 shrink-0 place-items-center rounded-xl border border-[#87e5c12b] bg-[#87e5c108] text-[#87e5c1]"><Server size={25} /></span>
      <div className="min-w-0"><p className="eyebrow mb-2">{t("primaryHost")}</p><h2 className="truncate text-lg font-medium">{system.machineName}</h2><p className="mt-1 font-mono text-[11px] text-slate-400">{system.hostname}</p></div>
    </div>
    <div className="flex flex-wrap items-center gap-4">
      <div className="mr-2"><p className="eyebrow mb-2 flex items-center gap-2"><Clock3 size={12} />{t("uptime")}</p><p className="text-sm tabular-nums">{system.uptime.days}d <span className="text-slate-400">{system.uptime.hours}h</span></p></div>
      <span className={`pill ${system.status === "online" ? "pill-green" : "pill-amber"}`}><span className="size-1.5 rounded-full bg-current" />{system.status === "online" ? t("online") : t("offline")}</span>
      <SourceBadge metadata={metadata} />
    </div>
  </section>;
}
