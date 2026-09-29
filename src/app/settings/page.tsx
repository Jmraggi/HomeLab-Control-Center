import { CheckCircle2, Clock3, Radio, Server } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { getSafeProviderConfig } from "@/lib/provider-config";
import { getSystemProvider } from "@/providers/system-provider-factory";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const [config, result] = await Promise.all([Promise.resolve(getSafeProviderConfig()), getSystemProvider().getSystemStats()]);
  const connection = result.meta.fallback ? "Fallback active" : result.meta.source === "remote" ? "Connected" : "Mock provider";
  return <DashboardShell activeItem="Settings"><div className="mb-8"><p className="text-sm font-medium text-cyan-300">HomeLab Control Center</p><h1 className="mt-1 text-3xl font-semibold tracking-tight text-white">Settings</h1><p className="mt-2 text-sm text-slate-400">Configuration is controlled through environment variables.</p></div><section className="max-w-2xl rounded-2xl border border-white/7 bg-[#0d1420] p-5 sm:p-6"><div className="flex items-start justify-between"><div><h2 className="font-semibold text-white">Data Source</h2><p className="mt-1 text-sm text-slate-500">Read-only connection configuration.</p></div><Server size={19} className="text-cyan-300" /></div><dl className="mt-6 divide-y divide-white/6"><SettingRow icon={<Radio size={16} />} label="Provider" value={config.provider} /><SettingRow icon={<CheckCircle2 size={16} />} label="Remote Agent configured" value={config.remoteAgentConfigured ? "Yes" : "No"} /><SettingRow icon={<Clock3 size={16} />} label="Timeout" value={`${config.timeoutMs} ms`} /><SettingRow icon={<Radio size={16} />} label="Connection status" value={connection} /><SettingRow icon={<Clock3 size={16} />} label="Last updated" value={new Date(result.meta.lastUpdated).toLocaleString()} /></dl>{result.meta.fallback && <p className="mt-5 rounded-lg border border-amber-300/10 bg-amber-300/5 px-3 py-2 text-xs text-amber-200">Remote data is unavailable, so the dashboard is using safe mock data.</p>}</section></DashboardShell>;
}

function SettingRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) { return <div className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"><dt className="flex items-center gap-2 text-sm text-slate-400"><span className="text-slate-600">{icon}</span>{label}</dt><dd className="text-sm font-medium capitalize text-slate-200">{value}</dd></div>; }
