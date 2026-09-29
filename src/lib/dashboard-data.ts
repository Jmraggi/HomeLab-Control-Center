import { getSystemProvider } from "@/providers/system-provider-factory";
import type { ProviderResponse } from "@/providers/system-provider";
import type { DockerContainer, HistoryPoint, Service, SystemStats } from "@/types/system";

export type DashboardData = {
  system: ProviderResponse<SystemStats>;
  services: ProviderResponse<readonly Service[]>;
  containers: ProviderResponse<readonly DockerContainer[]>;
  history: ProviderResponse<readonly HistoryPoint[]>;
};

export async function getDashboardData(): Promise<DashboardData> {
  const provider = getSystemProvider();
  const [system, services, containers, history] = await Promise.all([
    provider.getSystemStats(),
    provider.getServices(),
    provider.getDockerContainers(),
    provider.getHistory(),
  ]);
  return { system, services, containers, history };
}
