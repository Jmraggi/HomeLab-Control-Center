"use client";

import Link from "next/link";
import { ArrowUpRight, RefreshCw, ShieldCheck, Network, Server, Cable, CircleAlert } from "lucide-react";
import { useDashboard } from "@/features/dashboard/use-dashboard";
import { DockerPanel } from "./docker-panel";
import { HistoryChart } from "./history-chart";
import { MetricCard } from "./metric-card";
import { ServicesPanel } from "./services-panel";
import { SystemStatusCard } from "./system-status-card";
import { SourceBadge } from "./source-badge";
import type { DashboardData } from "@/lib/dashboard-data";
import { useI18n } from "@/components/layout/language-provider";

export type DashboardView = "Overview" | "System" | "Docker" | "Services" | "Network";
const viewKeys: Record<DashboardView, "overview" | "system" | "docker" | "services" | "network"> = {
  Overview: "overview", System: "system", Docker: "docker", Services: "services", Network: "network",
};
const descriptionKeys: Record<DashboardView, "overviewDescription" | "systemDescription" | "dockerDescription" | "servicesDescription" | "networkDescription"> = {
  Overview: "overviewDescription", System: "systemDescription", Docker: "dockerDescription", Services: "servicesDescription", Network: "networkDescription",
};

function formatSnapshotTime(timestamp: string): string {
  const date = new Date(timestamp);
  const pad = (value: number) => value.toString().padStart(2, "0");
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())} UTC`;
}
export function OverviewContent({ view = "Overview", initialData }: { view?: DashboardView; initialData?: DashboardData }) {
  const { data, loading, error, refresh } = useDashboard(initialData);
  const { t } = useI18n();
  return <div className="space-y-6">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow mb-3">{t("infrastructure")} / {t(viewKeys[view])}</p><h1 className="text-[28px] font-semibold tracking-tight">{view === "Overview" ? t("overviewTitle") : t(viewKeys[view])}</h1><p className="mt-2 text-sm text-slate-400">{t(descriptionKeys[view])}</p></div><button onClick={() => void refresh()} disabled={loading} className="control"><RefreshCw size={14} className={loading ? "animate-spin" : ""} />{loading ? t("refreshing") : t("refreshData")}</button></div>
    {error && <div role="alert" className="flex items-center gap-3 rounded-xl border border-amber-300/20 bg-amber-300/5 p-4 text-sm text-amber-200"><CircleAlert size={18} />{data ? t("updateFailed") : t("loadFailed")}</div>}
    {!data && !error && <div role="status" aria-label={t("loading")} className="grid gap-5 sm:grid-cols-2"><span className="sr-only">{t("loading")}</span>{[0,1,2,3].map(key => <div key={key} className="panel h-44 animate-pulse bg-[#171e27]" />)}</div>}
    {data && <>
      {(view === "Overview" || view === "System") && <>
        <SystemStatusCard system={data.system.data} metadata={data.system.meta} />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label={t("cpuUsage")} value={`${data.system.data.cpu.usagePercent}%`} detail={`${data.system.data.cpu.cores} ${t("cores")} · ${data.system.data.cpu.loadAverage} ${t("loadAverage")}`} progress={data.system.data.cpu.usagePercent} tone="cyan" />
          <MetricCard label={t("memory")} value={`${data.system.data.memory.usedGb} GB`} detail={`${data.system.data.memory.usagePercent}% ${t("of")} ${data.system.data.memory.totalGb} GB ${t("allocated")}`} progress={data.system.data.memory.usagePercent} tone="violet" />
          <MetricCard label={t("storage")} value={`${data.system.data.storage.usedGb} GB`} detail={`${data.system.data.storage.usagePercent}% ${t("of")} ${data.system.data.storage.totalGb} GB ${t("used")}`} progress={data.system.data.storage.usagePercent} tone="emerald" />
          <MetricCard label={t("cpuTemperature")} value={`${data.system.data.temperatureCelsius} °C`} detail={t("sensorReading")} progress={data.system.data.temperatureCelsius} tone="amber" />
        </div>
      </>}
      {view === "Overview" && <>
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.8fr)_minmax(300px,1fr)]"><HistoryChart history={data.history.data} metadata={data.history.meta} /><ServicesPanel services={data.services.data} metadata={data.services.meta} /></div>
        <DockerPanel containers={data.containers.data} metadata={data.containers.meta} />
        <div className="flex flex-wrap justify-between gap-3 text-[11px] text-slate-500"><span className="flex items-center gap-2"><ShieldCheck size={14} />{t("eachPanel")}</span><Link href="/settings" className="flex items-center gap-1 text-[#87e5c1]">{t("dataSourceSettings")} <ArrowUpRight size={13} /></Link></div>
      </>}
      {view === "System" && <HistoryChart history={data.history.data} metadata={data.history.meta} />}
      {view === "Docker" && <><div className="grid gap-4 sm:grid-cols-3">{[[t("totalContainers"), data.containers.data.length], [t("running"), data.containers.data.filter(c => c.status === "running").length], [t("stopped"), data.containers.data.filter(c => c.status === "stopped").length]].map(([label, value]) => <div key={label} className="panel p-6"><p className="eyebrow">{label}</p><p className="mt-4 text-3xl">{value}</p></div>)}</div><DockerPanel containers={data.containers.data} metadata={data.containers.meta} searchable /></>}
      {view === "Services" && <div className="grid items-start gap-6 lg:grid-cols-2"><ServicesPanel services={data.services.data} metadata={data.services.meta} /><div className="panel p-6"><ShieldCheck className="mb-5 text-[#87e5c1]" size={24} /><h2 className="text-sm font-medium">{t("availabilityTitle")}</h2><p className="mt-3 text-sm leading-7 text-slate-400">{t("availabilityCopy")}</p></div></div>}
      {view === "Network" && <><div className="panel p-6"><div className="flex flex-wrap items-center justify-between gap-4"><div className="flex items-center gap-3"><Network className="text-[#87e5c1]" size={22} /><div><h2 className="text-sm font-medium">{t("endpointDirectory")}</h2><p className="mt-1 text-xs text-slate-400">{t("portsReported")}</p></div></div><SourceBadge metadata={data.services.meta} /></div><div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{data.services.data.map(service => <div key={service.name} className="rounded-xl border border-[#303944] p-5"><Cable size={18} className="mb-4 text-slate-400" /><h3 className="text-sm">{service.name}</h3><p className="mt-3 font-mono text-lg">{service.port ?? "—"}<span className="ml-2 font-sans text-xs text-slate-500">{t("port")}</span></p></div>)}</div></div><div className="panel flex items-start gap-4 p-6"><Server size={20} className="shrink-0 text-slate-400" /><div><h2 className="text-sm font-medium">{t("trafficUnavailable")}</h2><p className="mt-2 text-xs leading-6 text-slate-400">{t("trafficCopy")}</p></div></div></>}
      <p className="text-right text-[10px] text-slate-500">{t("snapshotLoaded")} · {formatSnapshotTime(data.system.meta.lastUpdated)}</p>
    </>}
  </div>;
}
