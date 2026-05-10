'use client';

import { useEffect, useState } from "react";
import { StatsCards } from "@/components/admin/StatsCards";
import { RevenueOverview } from "@/components/admin/RevenueOverview";
import { RecentActivity } from "@/components/admin/RecentActivity";
import { UserDistribution } from "@/components/admin/UserDistribution";
import { SubscriptionChart } from "@/components/admin/SubscriptionChart";
import { AlertsPanel } from "@/components/admin/AlertsPanel";
import { getAdminDashboard } from "@/services/adminService";
import type { AdminDashboardData } from "@/services/adminService";

export default function AdminDashboard() {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getAdminDashboard()
      .then((res) => {
        if (!mounted) return;
        setData(res);
      })
      .catch(() => {
        if (!mounted) return;
        setData(null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Tableau de bord administrateur</h1>
          <p className="text-gray-400">Vue d'ensemble de la plateforme ImmoGestion</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">Dernière mise à jour: {new Date().toLocaleString('fr-FR')}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={data?.stats} loading={loading} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueOverview data={data?.revenue} loading={loading} />
        </div>
        <div>
          <UserDistribution data={data?.user_distribution} loading={loading} />
        </div>
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SubscriptionChart data={data?.subscriptions} loading={loading} />
        </div>
        <div>
          <AlertsPanel alerts={data?.alerts} loading={loading} />
        </div>
      </div>

      {/* Bottom Row */}
      <RecentActivity items={data?.activity} loading={loading} />
    </div>
  );
}
