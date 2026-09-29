export type OperationalStatus = "online" | "offline";
export type ContainerStatus = "running" | "stopped";
export interface SystemStats { machineName: string; hostname: string; status: OperationalStatus; cpu: { usagePercent: number; cores: number; loadAverage: number }; memory: { totalGb: number; usedGb: number; usagePercent: number }; storage: { totalGb: number; usedGb: number; usagePercent: number }; temperatureCelsius: number; uptime: { days: number; hours: number }; }
export interface Service { name: string; status: OperationalStatus; port?: number; }
export interface DockerContainer { name: string; status: ContainerStatus; uptime?: string; cpuPercent?: number; memoryPercent?: number; }
export interface HistoryPoint { time: string; cpuPercent: number; memoryPercent: number; }
