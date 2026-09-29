export type ProviderMode = "mock" | "remote";

export interface ProviderConfig {
  mode: ProviderMode;
  agentUrl?: string;
  agentToken?: string;
  timeoutMs: number;
}

const DEFAULT_TIMEOUT_MS = 5_000;

function getTimeout(value: string | undefined): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 100 && parsed <= 30_000 ? parsed : DEFAULT_TIMEOUT_MS;
}

export function getProviderConfig(): ProviderConfig {
  return {
    mode: process.env.HOMELAB_PROVIDER === "remote" ? "remote" : "mock",
    agentUrl: process.env.HOMELAB_AGENT_URL?.trim() || undefined,
    agentToken: process.env.HOMELAB_AGENT_TOKEN || undefined,
    timeoutMs: getTimeout(process.env.HOMELAB_AGENT_TIMEOUT_MS),
  };
}

export function getSafeProviderConfig() {
  const config = getProviderConfig();
  return { provider: config.mode, remoteAgentConfigured: Boolean(config.agentUrl), timeoutMs: config.timeoutMs };
}
