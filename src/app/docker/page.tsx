import { DashboardShell } from "@/components/layout/dashboard-shell";
import { OverviewContent } from "@/components/overview/overview-content";
import { getDashboardData } from "@/lib/dashboard-data";

export default async function DockerPage() {
  const initialData = await getDashboardData();
  return <DashboardShell activeItem="Docker"><OverviewContent view="Docker" initialData={initialData} /></DashboardShell>;
}
