import { DashboardShell } from "@/components/layout/dashboard-shell";
import { SettingsContent } from "@/components/settings/settings-content";
import { getSafeProviderConfig } from "@/lib/provider-config";
import { getSystemProvider } from "@/providers/system-provider-factory";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const config = getSafeProviderConfig();
  const result = await getSystemProvider().getSystemStats();
  return <DashboardShell activeItem="Settings">
    <SettingsContent config={config} metadata={result.meta} />
  </DashboardShell>;
}
