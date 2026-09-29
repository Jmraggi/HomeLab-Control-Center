import { getProviderConfig, type ProviderConfig } from "@/lib/provider-config";
import type { ProviderResponse, SystemProvider } from "@/providers/system-provider";
import { agentDockerSchema, agentHistorySchema, agentServicesSchema, agentSystemSchema, type AgentDockerResponse, type AgentHistoryResponse, type AgentServicesResponse, type AgentSystemResponse } from "@/types/agent-contract";
import type { DockerContainer, HistoryPoint, Service, SystemStats } from "@/types/system";
import type { z } from "zod";

export class RemoteProviderError extends Error {
  constructor() { super("Remote agent is unavailable."); }
}

export class RemoteSystemProvider implements SystemProvider {
  constructor(private readonly config: ProviderConfig = getProviderConfig()) {}

  private async request<T>(path: string, schema: z.ZodType<T>): Promise<T> {
    if (!this.config.agentUrl) throw new RemoteProviderError();
    let url: URL;
    try { url = new URL(path, this.config.agentUrl.endsWith("/") ? this.config.agentUrl : `${this.config.agentUrl}/`); } catch { throw new RemoteProviderError(); }
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.config.timeoutMs);
    try {
      const response = await fetch(url, { headers: this.config.agentToken ? { Authorization: `Bearer ${this.config.agentToken}` } : undefined, signal: controller.signal, cache: "no-store" });
      if (!response.ok) throw new RemoteProviderError();
      const payload: unknown = await response.json();
      const parsed = schema.safeParse(payload);
      if (!parsed.success) throw new RemoteProviderError();
      return parsed.data;
    } catch { throw new RemoteProviderError(); } finally { clearTimeout(timeout); }
  }

  private response<T>(data: T): ProviderResponse<T> { return { data, meta: { source: "remote", fallback: false, lastUpdated: new Date().toISOString() } }; }

  async getSystemStats() { return this.response(mapSystem(await this.request("v1/system", agentSystemSchema))); }
  async getServices() { return this.response(mapServices(await this.request("v1/services", agentServicesSchema))); }
  async getDockerContainers() { return this.response(mapDocker(await this.request("v1/docker", agentDockerSchema))); }
  async getHistory() { return this.response(mapHistory(await this.request("v1/history?range=24h", agentHistorySchema))); }
}

function toGigabytes(bytes: number) { return Number((bytes / 1_073_741_824).toFixed(1)); }
function mapSystem(agent: AgentSystemResponse): SystemStats {
  return { machineName: agent.hostname, hostname: agent.hostname, status: "online", cpu: { usagePercent: agent.cpu.usagePercent, cores: agent.cpu.cores, loadAverage: 0 }, memory: { totalGb: toGigabytes(agent.memory.total), usedGb: toGigabytes(agent.memory.used), usagePercent: agent.memory.usagePercent }, storage: { totalGb: toGigabytes(agent.disk.total), usedGb: toGigabytes(agent.disk.used), usagePercent: agent.disk.usagePercent }, temperatureCelsius: Math.round(agent.temperature.cpu ?? 0), uptime: { days: Math.floor(agent.uptimeSeconds / 86_400), hours: Math.floor((agent.uptimeSeconds % 86_400) / 3_600) } };
}
function mapServices(services: AgentServicesResponse): readonly Service[] { return services.map((service) => ({ name: service.displayName, status: service.status === "running" ? "online" : "offline", ...(service.port ? { port: service.port } : {}) })); }
function mapDocker(docker: AgentDockerResponse): readonly DockerContainer[] { return docker.containers.map((container) => ({ name: container.name, status: container.state === "running" ? "running" : "stopped", uptime: container.uptime })); }
function mapHistory(history: AgentHistoryResponse): readonly HistoryPoint[] { return history.map((point) => ({ time: new Date(point.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), cpuPercent: point.cpuUsagePercent, memoryPercent: point.memoryUsagePercent })); }
