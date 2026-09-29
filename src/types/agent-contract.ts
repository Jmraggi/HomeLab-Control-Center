import { z } from "zod";

const nonNegativeNumber = z.number().finite().nonnegative();

export const agentSystemSchema = z.object({
  hostname: z.string().min(1),
  platform: z.string().min(1),
  distro: z.string().min(1),
  kernel: z.string().min(1),
  architecture: z.string().min(1),
  uptimeSeconds: nonNegativeNumber,
  cpu: z.object({ model: z.string().min(1), cores: z.number().int().positive(), usagePercent: z.number().min(0).max(100) }),
  memory: z.object({ total: nonNegativeNumber, used: nonNegativeNumber, available: nonNegativeNumber, usagePercent: z.number().min(0).max(100) }),
  disk: z.object({ total: nonNegativeNumber, used: nonNegativeNumber, available: nonNegativeNumber, usagePercent: z.number().min(0).max(100) }),
  temperature: z.object({ cpu: nonNegativeNumber.nullable() }),
  timestamp: z.string().datetime(),
});

export const agentServiceSchema = z.object({
  name: z.string().min(1),
  displayName: z.string().min(1),
  status: z.enum(["running", "stopped", "failed", "unknown"]),
  enabled: z.boolean(),
  port: z.number().int().positive().optional(),
  url: z.string().url().optional(),
});
export const agentServicesSchema = z.array(agentServiceSchema);

export const agentDockerContainerSchema = z.object({
  id: z.string().min(1), name: z.string().min(1), image: z.string().min(1), status: z.string().min(1), state: z.string().min(1), uptime: z.string().optional(), ports: z.array(z.string()),
});
export const agentDockerSchema = z.object({ available: z.boolean(), version: z.string().nullable(), containerCount: z.number().int().nonnegative(), containers: z.array(agentDockerContainerSchema) });

export const agentHistoryPointSchema = z.object({ timestamp: z.string().datetime(), cpuUsagePercent: z.number().min(0).max(100), memoryUsagePercent: z.number().min(0).max(100), temperature: nonNegativeNumber.optional() });
export const agentHistorySchema = z.array(agentHistoryPointSchema);

export type AgentSystemResponse = z.infer<typeof agentSystemSchema>;
export type AgentServicesResponse = z.infer<typeof agentServicesSchema>;
export type AgentDockerResponse = z.infer<typeof agentDockerSchema>;
export type AgentHistoryResponse = z.infer<typeof agentHistorySchema>;
