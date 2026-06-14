import { Clock, Loader2, CheckCircle, Package, CreditCard } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { DashboardStats } from '@/types';

interface StatsMatrixProps {
  stats: DashboardStats;
}

export function StatsMatrix({ stats: s }: StatsMatrixProps) {
  const items = [
    { label: 'Pending', value: s.pending, icon: Clock, color: 'text-yellow-600 bg-yellow-50' },
    { label: 'Processing', value: s.processing, icon: Loader2, color: 'text-blue-600 bg-blue-50' },
    { label: 'Finished', value: s.finished, icon: CheckCircle, color: 'text-green-600 bg-green-50' },
    { label: 'Picked Up', value: s.pickedUp, icon: Package, color: 'text-purple-600 bg-purple-50' },
    { label: 'Unpaid', value: s.unpaid, icon: CreditCard, color: 'text-red-600 bg-red-50' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.label}>
            <CardContent className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${item.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                <p className="text-xs text-gray-500">{item.label}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
