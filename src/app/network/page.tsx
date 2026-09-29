import { DashboardShell } from "@/components/layout/dashboard-shell";
import { OverviewContent } from "@/components/overview/overview-content";
import { getDashboardData } from "@/lib/dashboard-data";

export default async function NetworkPage() {
  const initialData = await getDashboardData();
  return <DashboardShell activeItem="Network"><OverviewContent view="Network" initialData={initialData} /></DashboardShell>;
}
