import { mockDockerContainers, mockHistory, mockServices, mockSystemStats } from "@/data/mock-data";
import type { ProviderMetadata, ProviderResponse, SystemProvider } from "@/providers/system-provider";

export class MockSystemProvider implements SystemProvider {
  constructor(private readonly fallbackError?: string) {}

  private metadata(): ProviderMetadata {
    return { source: "mock", fallback: Boolean(this.fallbackError), lastUpdated: new Date().toISOString(), ...(this.fallbackError ? { error: this.fallbackError } : {}) };
  }

  private response<T>(data: T): ProviderResponse<T> { return { data, meta: this.metadata() }; }

  async getSystemStats() { return this.response(mockSystemStats); }
  async getServices() { return this.response(mockServices); }
  async getDockerContainers() { return this.response(mockDockerContainers); }
  async getHistory() { return this.response(mockHistory); }
}

export const mockSystemProvider = new MockSystemProvider();
