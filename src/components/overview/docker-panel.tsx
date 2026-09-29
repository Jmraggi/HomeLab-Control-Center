"use client";

import { Box, Search } from "lucide-react";
import { useState } from "react";
import type { DockerContainer } from "@/types/system";
import type { ProviderMetadata } from "@/providers/system-provider";
import { SourceBadge } from "./source-badge";
import { useI18n } from "@/components/layout/language-provider";

export function DockerPanel({ containers, metadata, searchable = false }: { containers: readonly DockerContainer[]; metadata?: ProviderMetadata; searchable?: boolean }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const filtered = containers.filter(container => container.name.toLowerCase().includes(query.toLowerCase()) && (status === "all" || container.status === status));
  const { t } = useI18n();
  return <section className="panel">
    <div className="panel-heading"><div><h2 className="text-sm font-medium">{t("containers")} <span className="ml-2 rounded bg-white/5 px-2 py-0.5 text-[10px] text-slate-400">{containers.length}</span></h2><p className="mt-1 text-[11px] text-slate-400">{t("resourceUsage")}</p></div>{metadata && <SourceBadge metadata={metadata} />}</div>
    {searchable && <div className="flex flex-wrap gap-3 px-6 pb-5"><label className="field flex items-center gap-2"><Search size={14} className="text-slate-400" /><input aria-label={t("searchContainers")} className="w-40 bg-transparent outline-none sm:w-60" placeholder={t("searchContainers")} value={query} onChange={event => setQuery(event.target.value)} /></label><select className="field" aria-label={t("filterStatus")} value={status} onChange={event => setStatus(event.target.value)}><option value="all">{t("allStatuses")}</option><option value="running">{t("running")}</option><option value="stopped">{t("stopped")}</option></select></div>}
    <div className="divide-y divide-[#262d37] sm:hidden">
      {filtered.map(container => <article key={container.name} className="px-5 py-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="flex min-w-0 items-center gap-2 text-base font-medium"><Box size={18} className="shrink-0 text-slate-400" /><span className="break-all">{container.name}</span></h3>
          <span className={`pill ${container.status === "running" ? "pill-green" : "text-slate-400"}`}><span className="size-1.5 rounded-full bg-current" />{container.status === "running" ? t("running") : t("stopped")}</span>
        </div>
        <dl className="mt-5 grid grid-cols-3 gap-3">
          <div><dt className="text-xs text-slate-400">{t("uptime")}</dt><dd className="mt-1 text-base">{container.uptime ?? "—"}</dd></div>
          <div><dt className="text-xs text-slate-400">CPU</dt><dd className="mt-1 text-base tabular-nums">{container.cpuPercent === undefined ? "—" : `${container.cpuPercent}%`}</dd></div>
          <div><dt className="text-xs text-slate-400">Memory</dt><dd className="mt-1 text-base tabular-nums">{container.memoryPercent === undefined ? "—" : `${container.memoryPercent}%`}</dd></div>
        </dl>
      </article>)}
    </div>
    <div className="hidden overflow-x-auto sm:block"><table className="data-table"><caption className="sr-only">{t("resourceUsage")}</caption><thead><tr>{[t("container"), t("status"), t("uptime"), "CPU", t("memory")].map(title => <th key={title} scope="col">{title}</th>)}</tr></thead><tbody>{filtered.map(container => <tr key={container.name}><td><span className="flex items-center gap-3"><Box size={16} className="text-slate-500" /><span className="font-mono text-xs">{container.name}</span></span></td><td><span className={`pill ${container.status === "running" ? "pill-green" : "text-slate-400"}`}><span className="size-1.5 rounded-full bg-current" />{container.status === "running" ? t("running") : t("stopped")}</span></td><td className="text-slate-400">{container.uptime ?? "—"}</td><td className="tabular-nums">{container.cpuPercent === undefined ? "—" : `${container.cpuPercent}%`}</td><td className="tabular-nums">{container.memoryPercent === undefined ? "—" : `${container.memoryPercent}%`}</td></tr>)}</tbody></table></div>
    {!filtered.length && <p role="status" className="p-10 text-center text-sm text-slate-400">{t("noContainers")}</p>}
    <div className="border-t border-[#262d37] px-6 py-3 text-[10px] text-slate-500">{t("readOnly")}</div>
  </section>;
}
