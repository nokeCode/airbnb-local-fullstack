import { Header } from "@/components/dashboard/Header";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { RecentPayments } from "@/components/dashboard/RecentPayments";
import { AIBanner } from "@/components/dashboard/AIBanner";
import { MyProperties } from "@/components/dashboard/MyProperties";
import { MaintenanceAlerts } from "@/components/dashboard/MaintenanceAlerts";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Header />
      
      <div className="p-6 max-w-7xl mx-auto">
        <StatsOverview />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <AIBanner />
            <RecentPayments />
            <MyProperties />
          </div>
          
          <div className="space-y-6">
            <MaintenanceAlerts />
          </div>
        </div>
      </div>
    </div>
  );
}