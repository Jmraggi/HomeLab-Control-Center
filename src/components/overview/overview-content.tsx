"use client";

import { useEffect, useState } from "react";
import { DockerPanel } from "@/components/overview/docker-panel";
import { HistoryChart } from "@/components/overview/history-chart";
import { MetricCard } from "@/components/overview/metric-card";
import { ServicesPanel } from "@/components/overview/services-panel";
import { SystemStatusCard } from "@/components/overview/system-status-card";
import type { ProviderResponse } from "@/providers/system-provider";
import type { DockerContainer, HistoryPoint, Service, SystemStats } from "@/types/system";

type DashboardData = { system: ProviderResponse<SystemStats>; services: ProviderResponse<readonly Service[]>; containers: ProviderResponse<readonly DockerContainer[]>; history: ProviderResponse<readonly HistoryPoint[]> };

async function getApiData<T>(endpoint: string): Promise<ProviderResponse<T>> {
  const response = await fetch(endpoint, { cache: "no-store" });
  if (!response.ok) throw new Error("Unable to load dashboard data.");
  return response.json() as Promise<ProviderResponse<T>>;
}

export function OverviewContent() {
  const [dashboard, setDashboard] = useState<DashboardData>();
  const [error, setError] = useState(false);

  useEffect(() => {
    Promise.all([getApiData<SystemStats>("/api/system"), getApiData<readonly Service[]>("/api/services"), getApiData<readonly DockerContainer[]>("/api/docker"), getApiData<readonly HistoryPoint[]>("/api/history")])
      .then(([system, services, containers, history]) => setDashboard({ system, services, containers, history }))
      .catch(() => setError(true));
  }, []);

  if (!dashboard) return <div className="grid min-h-96 place-items-center rounded-2xl border border-white/7 bg-[#0d1420] text-sm text-slate-500">{error ? "Dashboard data could not be loaded." : "Loading dashboard…"}</div>;
  const { system, services, containers, history } = dashboard;
  return <><div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-medium text-cyan-300">Home Lab overview</p><h1 className="mt-1 text-3xl font-semibold tracking-tight text-white">Good morning, operator.</h1><p className="mt-2 text-sm text-slate-400">A calm view of your local infrastructure.</p></div><p className="text-sm text-slate-500">Updated {new Date(system.meta.lastUpdated).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p></div><SystemStatusCard system={system.data} metadata={system.meta} /><section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="System metrics"><MetricCard label="CPU usage" value={`${system.data.cpu.usagePercent}%`} detail={`${system.data.cpu.cores} cores · load ${system.data.cpu.loadAverage}`} progress={system.data.cpu.usagePercent} tone="cyan" /><MetricCard label="Memory" value={`${system.data.memory.usedGb} GB`} detail={`of ${system.data.memory.totalGb} GB`} progress={system.data.memory.usagePercent} tone="violet" /><MetricCard label="Storage" value={`${system.data.storage.usedGb} GB`} detail={`of ${system.data.storage.totalGb} GB`} progress={system.data.storage.usagePercent} tone="emerald" /><MetricCard label="Temperature" value={`${system.data.temperatureCelsius}°C`} detail="Within normal range" progress={54} tone="amber" /></section><section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.85fr)]"><HistoryChart history={history.data} /><ServicesPanel services={services.data} /></section><section className="mt-6"><DockerPanel containers={containers.data} /></section></>;
}
