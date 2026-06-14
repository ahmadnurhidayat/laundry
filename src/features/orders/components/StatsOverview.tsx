import { Clock, Loader2, CheckCircle, Package, CreditCard } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { DashboardStats } from '@/types';

const statsConfig = [
  { key: 'pending' as const, label: 'Menunggu', icon: Clock, color: 'text-amber-600 bg-amber-50' },
  { key: 'processing' as const, label: 'Diproses', icon: Loader2, color: 'text-blue-600 bg-blue-50' },
  { key: 'finished' as const, label: 'Selesai', icon: CheckCircle, color: 'text-green-600 bg-green-50' },
  { key: 'pickedUp' as const, label: 'Diambil', icon: Package, color: 'text-purple-600 bg-purple-50' },
  { key: 'unpaid' as const, label: 'Belum Bayar', icon: CreditCard, color: 'text-red-600 bg-red-50' },
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
          <Card key={item.key}>
            <CardContent className="flex items-center gap-3 py-4">
              <div className={`p-2 rounded-lg ${item.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats[item.key]}</p>
                <p className="text-xs text-gray-500">{item.label}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
