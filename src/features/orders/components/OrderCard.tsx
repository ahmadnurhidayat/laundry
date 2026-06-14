import Link from 'next/link';
import { Clock, Loader2, CheckCircle, Package } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDateShort } from '@/lib/utils';
import type { Order } from '@/types';

interface OrderCardProps {
  order: Order;
  customerName?: string;
}

const statusConfig = {
  PENDING: { label: 'Menunggu', variant: 'warning' as const, icon: Clock },
  PROCESSING: { label: 'Diproses', variant: 'info' as const, icon: Loader2 },
  FINISHED: { label: 'Selesai', variant: 'success' as const, icon: CheckCircle },
  PICKED_UP: { label: 'Diambil', variant: 'neutral' as const, icon: Package },
};

const paymentConfig = {
  UNPAID: { label: 'Belum Bayar', variant: 'danger' as const },
  PAID: { label: 'Lunas', variant: 'success' as const },
};

export function OrderCard({ order, customerName }: OrderCardProps) {
  const status = statusConfig[order.orderStatus];
  const payment = paymentConfig[order.paymentStatus];
  const StatusIcon = status.icon;

  return (
    <Link href={`/dashboard/orders/${order.id}`}>
      <Card hover>
        <CardContent className="py-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="font-semibold text-gray-900 text-sm">{order.invoiceNumber}</p>
              <p className="text-sm text-gray-500 mt-0.5">{customerName || 'Pelanggan'}</p>
            </div>
            <Badge variant={payment.variant} dot>
              {payment.label}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <StatusIcon className={`h-4 w-4 ${
                order.orderStatus === 'PENDING' ? 'text-amber-500' :
                order.orderStatus === 'PROCESSING' ? 'text-blue-500' :
                order.orderStatus === 'FINISHED' ? 'text-green-500' : 'text-gray-400'
              }`} />
              <span className="text-xs font-medium text-gray-600">{status.label}</span>
            </div>
            <p className="font-semibold text-gray-900">{formatCurrency(order.totalAmount)}</p>
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-400">{formatDateShort(order.dateIn)}</span>
            <span className="text-xs text-gray-400">Est: {formatDateShort(order.dateEstimated)}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
