import { MockSystemProvider } from "@/providers/mock-system-provider";
import type { SystemProvider } from "@/providers/system-provider";

/** Keeps the dashboard available when a configured remote agent cannot be used. */
export class FallbackSystemProvider implements SystemProvider {
  private readonly fallback = new MockSystemProvider("Remote agent unavailable; showing mock data.");
  constructor(private readonly primary: SystemProvider) {}
  async getSystemStats() { try { return await this.primary.getSystemStats(); } catch { return this.fallback.getSystemStats(); } }
  async getServices() { try { return await this.primary.getServices(); } catch { return this.fallback.getServices(); } }
  async getDockerContainers() { try { return await this.primary.getDockerContainers(); } catch { return this.fallback.getDockerContainers(); } }
  async getHistory() { try { return await this.primary.getHistory(); } catch { return this.fallback.getHistory(); } }
}
