import { DashboardShell } from "@/components/layout/dashboard-shell";
import { OverviewContent } from "@/components/overview/overview-content";
import { getDashboardData } from "@/lib/dashboard-data";

export default async function SystemPage() {
  const initialData = await getDashboardData();
  return <DashboardShell activeItem="System"><OverviewContent view="System" initialData={initialData} /></DashboardShell>;
}
