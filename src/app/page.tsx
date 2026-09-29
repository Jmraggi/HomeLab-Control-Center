import { DashboardShell } from "@/components/layout/dashboard-shell";
import { OverviewContent } from "@/components/overview/overview-content";

export default function OverviewPage() {
  return <DashboardShell activeItem="Overview"><OverviewContent /></DashboardShell>;
}
