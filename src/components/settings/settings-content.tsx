"use client";

import Link from "next/link";
import { ArrowUpRight, Database, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { useI18n } from "@/components/layout/language-provider";
import { SourceBadge } from "@/components/overview/source-badge";
import type { ProviderMetadata } from "@/providers/system-provider";

type SettingsContentProps = {
  config: { provider: string; remoteAgentConfigured: boolean; timeoutMs: number };
  metadata: ProviderMetadata;
};

export function SettingsContent({ config, metadata }: SettingsContentProps) {
  const { t } = useI18n();
  const connection = metadata.fallback ? t("unavailable") : metadata.source === "remote" ? t("connected") : t("demoMode");

  return <>
    <div className="mb-8"><p className="eyebrow mb-3">{t("workspace")} / {t("settings")}</p><h1 className="text-[28px] font-semibold tracking-tight">{t("settingsTitle")}</h1><p className="mt-2 text-sm text-slate-400">{t("settingsDescription")}</p></div>
    <div className="grid items-start gap-6 xl:grid-cols-[1.5fr_1fr]">
      <section className="panel"><div className="panel-heading"><div className="flex items-center gap-3"><Database size={19} className="text-[#87e5c1]" /><h2 className="text-sm font-medium">{t("dataSource")}</h2></div><SourceBadge metadata={metadata} /></div>
        <dl className="px-6">
          <SettingRow label={t("selectedProvider")} value={config.provider} />
          <SettingRow label={t("remoteConfigured")} value={config.remoteAgentConfigured ? t("yes") : t("no")} />
          <SettingRow label={t("requestTimeout")} value={`${config.timeoutMs} ms`} />
          <SettingRow label={t("connectionStatus")} value={connection} />
          <SettingRow label={t("snapshotUtc")} value={metadata.lastUpdated.replace("T", " ").replace(/\.\d+Z$/, "")} />
        </dl>
        <p className="border-t border-[#262d37] bg-[#0e131a] px-6 py-4 text-[11px] leading-6 text-slate-400">{t("readOnlyConfig")}</p>
      </section>
      <div className="space-y-5"><section className="panel p-6"><ShieldCheck size={23} className="mb-5 text-[#87e5c1]" /><h2 className="text-sm font-medium">{t("privateTitle")}</h2><p className="mt-3 text-xs leading-7 text-slate-400">{t("privateCopy")}</p></section>
      <section className="panel p-6"><SlidersHorizontal size={22} className="mb-5 text-[#ac9af5]" /><h2 className="text-sm font-medium">{t("workspaceTitle")}</h2><p className="mt-3 text-xs leading-7 text-slate-400">{t("workspaceCopy")}<br />{t("mockCopy")}</p><Link href="/" className="mt-5 inline-flex items-center gap-2 text-xs text-[#87e5c1]">{t("backOverview")} <ArrowUpRight size={13} /></Link></section></div>
    </div>
    {metadata.fallback && <p role="status" className="mt-5 rounded-xl border border-amber-300/20 bg-amber-300/5 p-4 text-xs text-amber-200">{t("fallbackCopy")}</p>}
  </>;
}

function SettingRow({ label, value }: { label: string; value: string }) {
  return <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#262d37] py-5"><dt className="text-xs text-slate-400">{label}</dt><dd className="text-xs text-slate-200">{value}</dd></div>;
}
