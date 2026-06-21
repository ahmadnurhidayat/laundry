import { Clock, Loader2, CheckCircle, Package, CreditCard } from 'lucide-react';
import Link from 'next/link';
import type { DashboardStats } from '@/types';

const statsConfig = [
  { key: 'pending' as const, label: 'Menunggu', icon: Clock, color: 'text-amber-700', bg: 'bg-amber-100', href: '/dashboard/orders?status=PENDING' },
  { key: 'processing' as const, label: 'Diproses', icon: Loader2, color: 'text-blue-700', bg: 'bg-blue-100', href: '/dashboard/orders?status=PROCESSING' },
  { key: 'finished' as const, label: 'Selesai', icon: CheckCircle, color: 'text-emerald-700', bg: 'bg-emerald-100', href: '/dashboard/orders?status=FINISHED' },
  { key: 'pickedUp' as const, label: 'Diambil', icon: Package, color: 'text-slate-600', bg: 'bg-slate-100', href: '/dashboard/orders?status=PICKED_UP' },
  { key: 'unpaid' as const, label: 'Belum Bayar', icon: CreditCard, color: 'text-rose-700', bg: 'bg-rose-100', href: '/dashboard/orders?status=UNPAID' },
];

interface StatsOverviewProps {
  stats: DashboardStats;
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {statsConfig.map((item) => {
        const Icon = item.icon;
        return (
          <Link key={item.key} href={item.href}>
            <div className="bg-canvas-elevated rounded-2xl border border-border-subtle p-4 hover:shadow-premium-md transition-shadow duration-200 cursor-pointer group">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${item.bg}`}>
                  <Icon className={`h-5 w-5 ${item.color}`} />
                </div>
                <span className={`font-mono text-2xl font-semibold ${item.color}`}>
                  {stats[item.key]}
                </span>
              </div>
              <p className="text-xs font-medium text-ink-muted uppercase tracking-wider">{item.label}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
