import { Clock, Loader2, CheckCircle, Package, CreditCard } from 'lucide-react';
import Link from 'next/link';
import type { DashboardStats } from '@/types';

const statsConfig = [
  { key: 'pending' as const, label: 'Menunggu', icon: Clock, color: 'bg-amber-500', lightColor: 'bg-amber-50', textColor: 'text-amber-700', href: '/dashboard/orders?status=PENDING' },
  { key: 'processing' as const, label: 'Diproses', icon: Loader2, color: 'bg-blue-500', lightColor: 'bg-blue-50', textColor: 'text-blue-700', href: '/dashboard/orders?status=PROCESSING' },
  { key: 'finished' as const, label: 'Selesai', icon: CheckCircle, color: 'bg-emerald-500', lightColor: 'bg-emerald-50', textColor: 'text-emerald-700', href: '/dashboard/orders?status=FINISHED' },
  { key: 'pickedUp' as const, label: 'Diambil', icon: Package, color: 'bg-purple-500', lightColor: 'bg-purple-50', textColor: 'text-purple-700', href: '/dashboard/orders?status=PICKED_UP' },
  { key: 'unpaid' as const, label: 'Belum Bayar', icon: CreditCard, color: 'bg-red-500', lightColor: 'bg-red-50', textColor: 'text-red-700', href: '/dashboard/orders?status=UNPAID' },
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
            <div className="bg-canvas rounded-xl border border-muted p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${item.lightColor} group-hover:scale-110 transition-transform`}>
                  <Icon className={`h-4 w-4 ${item.textColor}`} />
                </div>
                <span className={`text-2xl font-bold ${item.textColor}`}>
                  {stats[item.key]}
                </span>
              </div>
              <p className="text-xs font-medium text-body">{item.label}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
