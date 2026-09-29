import type { DockerContainer, HistoryPoint, Service, SystemStats } from "@/types/system";

export type DataSource = "remote" | "mock";

export interface ProviderMetadata {
  source: DataSource;
  fallback: boolean;
  lastUpdated: string;
  error?: string;
}

export interface ProviderResponse<T> {
  data: T;
  meta: ProviderMetadata;
}

export interface SystemProvider {
  getSystemStats(): Promise<ProviderResponse<SystemStats>>;
  getServices(): Promise<ProviderResponse<readonly Service[]>>;
  getDockerContainers(): Promise<ProviderResponse<readonly DockerContainer[]>>;
  getHistory(): Promise<ProviderResponse<readonly HistoryPoint[]>>;
}
