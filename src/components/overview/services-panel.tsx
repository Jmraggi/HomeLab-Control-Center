"use client";

import { House, Play, Terminal, Radio } from "lucide-react";
import { useI18n } from "@/components/layout/language-provider";
import type { Service } from "@/types/system";
import type { ProviderMetadata } from "@/providers/system-provider";
import { SourceBadge } from "./source-badge";

export function ServicesPanel({ services, metadata }: { services: readonly Service[]; metadata?: ProviderMetadata }) {
  const online = services.filter(service => service.status === "online").length;
  const { t } = useI18n();
  return <section className="panel">
    <div className="panel-heading"><div><h2 className="text-sm font-medium">{t("services")}</h2><p className="mt-1 text-[11px] text-slate-400">{online} {t("of")} {services.length} {t("available")}</p></div>{metadata && <SourceBadge metadata={metadata} />}</div>
    <div className="px-6">{services.map(service => {
      const Icon = service.name === "Home Assistant" ? House : service.name === "Plex" ? Play : service.name === "SSH" ? Terminal : Radio;
      return <div key={service.name} className="flex items-center justify-between gap-3 border-t border-[#262d37] py-5">
        <div className="flex min-w-0 items-center gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-lg border border-[#303944] bg-[#1b232d] text-slate-300"><Icon size={16} /></span><div><p className="text-xs font-medium">{service.name}</p><p className="mt-1 font-mono text-[10px] text-slate-400">{service.port ? `PORT ${service.port}` : t("noPort")}</p></div></div>
        <span className={`flex items-center gap-1.5 text-[10px] ${service.status === "online" ? "text-[#87e5c1]" : "text-[#e7b56b]"}`}><span className="size-1.5 rounded-full bg-current" />{service.status === "online" ? t("online") : t("offline")}</span>
      </div>;
    })}{!services.length && <p className="py-10 text-sm text-slate-400">{t("noServices")}</p>}</div>
  </section>;
}
