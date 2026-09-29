import { getProviderConfig } from "@/lib/provider-config";
import { FallbackSystemProvider } from "@/providers/fallback-system-provider";
import { mockSystemProvider } from "@/providers/mock-system-provider";
import { RemoteSystemProvider } from "@/providers/remote-system-provider";
import type { SystemProvider } from "@/providers/system-provider";

export function getSystemProvider(): SystemProvider {
  const config = getProviderConfig();
  return config.mode === "remote" ? new FallbackSystemProvider(new RemoteSystemProvider(config)) : mockSystemProvider;
}
