"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Layers,
  CalendarDays,
  CalendarRange,
  Mic,
  Trophy,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";

function TrendBadge({ value }) {
  if (value == null) return null;

  if (value > 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
        <TrendingUp className="h-3 w-3" />
        +{value}
      </span>
    );
  }

  if (value < 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs font-medium text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full">
        <TrendingDown className="h-3 w-3" />
        {value}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-0.5 text-xs font-medium text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded-full">
      <Minus className="h-3 w-3" />
      0
    </span>
  );
}

const STAT_CARDS = [
  {
    key: "total",
    label: "Total Applications",
    icon: Layers,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    getValue: (d) => d.total,
    getTrend: (d) => d.thisMonth,
    trendLabel: "this month",
  },
  {
    key: "thisWeek",
    label: "This Week",
    icon: CalendarDays,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
    getValue: (d) => d.thisWeek,
    getTrend: null,
    trendLabel: null,
  },
  {
    key: "thisMonth",
    label: "This Month",
    icon: CalendarRange,
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
    getValue: (d) => d.thisMonth,
    getTrend: null,
    trendLabel: null,
  },
  {
    key: "interviews",
    label: "Active Interviews",
    icon: Mic,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    getValue: (d) =>
      (d.byStatus.interview || 0) + (d.byStatus.phone_screen || 0),
    getTrend: (d) =>
      (d.byStatus.interview || 0) + (d.byStatus.phone_screen || 0),
    trendLabel: "in pipeline",
  },
  {
    key: "offers",
    label: "Offers Received",
    icon: Trophy,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    getValue: (d) => d.byStatus.offer || 0,
    getTrend: (d) => d.byStatus.offer || 0,
    trendLabel: "total",
  },
  {
    key: "responseRate",
    label: "Response Rate",
    icon: TrendingUp,
    iconBg: "bg-rose-50",
    iconColor: "text-rose-600",
    getValue: (d) => {
      const responded =
        (d.byStatus.phone_screen || 0) +
        (d.byStatus.interview || 0) +
        (d.byStatus.offer || 0);
      const submitted = d.total - (d.byStatus.wishlist || 0);
      if (submitted === 0) return "0%";
      return `${Math.round((responded / submitted) * 100)}%`;
    },
    getTrend: null,
    trendLabel: null,
  },
];

function StatsOverview({ userId }) {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    fetchStats();
  }, [userId]);

  async function fetchStats() {
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/applications/stats?userId=${encodeURIComponent(userId)}`
      );
      const result = await res.json();
      if (result.success) {
        setStats(result.data);
      }
    } catch {
      // Silently fail — cards will stay in skeleton state briefly then show zeros
      setStats({ total: 0, byStatus: {}, thisWeek: 0, thisMonth: 0 });
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="flex items-start gap-4">
              <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-7 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {STAT_CARDS.map((card) => {
        const value = stats ? card.getValue(stats) : 0;
        const trend = card.getTrend && stats ? card.getTrend(stats) : null;

        return (
          <Card
            key={card.key}
            className="transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div
                  className={`flex items-center justify-center h-10 w-10 rounded-lg shrink-0 ${card.iconBg}`}
                >
                  <card.icon className={`h-5 w-5 ${card.iconColor}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground truncate">
                    {card.label}
                  </p>
                  <p className="text-2xl font-bold mt-0.5">{value}</p>
                  {trend != null && card.trendLabel && (
                    <div className="flex items-center gap-1.5 mt-1">
                      <TrendBadge value={trend} />
                      <span className="text-xs text-muted-foreground">
                        {card.trendLabel}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default StatsOverview;
