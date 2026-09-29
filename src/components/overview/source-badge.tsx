"use client";

import { useI18n } from "@/components/layout/language-provider";
import type { ProviderMetadata } from "@/providers/system-provider";

export function SourceBadge({ metadata }: { metadata: ProviderMetadata }) {
  const { t } = useI18n();
  return <span className={`pill ${metadata.fallback ? "pill-amber" : metadata.source === "remote" ? "pill-green" : "text-slate-300"}`} title={metadata.fallback ? t("fallbackTitle") : undefined}>
    <span className="size-1.5 rounded-full bg-current" />
    {metadata.fallback ? t("fallback") : metadata.source === "remote" ? t("live") : t("mockData")}
  </span>;
}

