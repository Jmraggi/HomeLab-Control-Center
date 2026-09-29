"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ProviderResponse } from "@/providers/system-provider";
import type { DockerContainer, HistoryPoint, Service, SystemStats } from "@/types/system";
import type { DashboardData } from "@/lib/dashboard-data";

async function read<T>(path: string, signal: AbortSignal): Promise<ProviderResponse<T>> {
  const response = await fetch(path, { cache: "no-store", signal });
  if (!response.ok) throw new Error("Dashboard request failed");
  return response.json() as Promise<ProviderResponse<T>>;
}

export function useDashboard(initialData?: DashboardData) {
  const [data, setData] = useState<DashboardData | undefined>(initialData);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState(false);
  const active = useRef<AbortController | null>(null);
  const refresh = useCallback(async () => {
    active.current?.abort();
    const controller = new AbortController();
    active.current = controller;
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const [system, services, containers, history] = await Promise.all([
        read<SystemStats>("/api/system", controller.signal),
        read<readonly Service[]>("/api/services", controller.signal),
        read<readonly DockerContainer[]>("/api/docker", controller.signal),
        read<readonly HistoryPoint[]>("/api/history", controller.signal),
      ]);
      if (active.current === controller) setData({ system, services, containers, history });
    } catch {
      if (active.current === controller) setError(true);
    } finally {
      clearTimeout(timeout);
      if (active.current === controller) setLoading(false);
    }
  }, []);
  useEffect(() => {
    const start = setTimeout(() => { void refresh(); }, 0);
    return () => { clearTimeout(start); active.current?.abort(); active.current = null; };
  }, [refresh]);
  const reload = () => {
    setLoading(true);
    setError(false);
    return refresh();
  };
  return { data, loading, error, refresh: reload };
}

