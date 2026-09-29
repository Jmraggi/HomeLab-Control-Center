import { DashboardShell } from "@/components/layout/dashboard-shell";
import { OverviewContent } from "@/components/overview/overview-content";
import { getDashboardData } from "@/lib/dashboard-data";

export default async function ServicesPage() {
  const initialData = await getDashboardData();
  return <DashboardShell activeItem="Services"><OverviewContent view="Services" initialData={initialData} /></DashboardShell>;
}
