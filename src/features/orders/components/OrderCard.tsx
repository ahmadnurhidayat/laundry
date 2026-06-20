import Link from 'next/link';
import { Clock, Loader2, CheckCircle, Package, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDateShort } from '@/lib/utils';
import type { Order } from '@/types';

interface OrderCardProps {
  order: Order;
  customerName?: string;
}

const statusConfig = {
  PENDING: { label: 'Menunggu', variant: 'warning' as const, icon: Clock, dotColor: 'bg-amber-500' },
  PROCESSING: { label: 'Diproses', variant: 'info' as const, icon: Loader2, dotColor: 'bg-blue-500' },
  FINISHED: { label: 'Selesai', variant: 'success' as const, icon: CheckCircle, dotColor: 'bg-emerald-500' },
  PICKED_UP: { label: 'Diambil', variant: 'neutral' as const, icon: Package, dotColor: 'bg-purple-500' },
};

const paymentConfig = {
  UNPAID: { label: 'Belum Bayar', variant: 'danger' as const },
  PAID: { label: 'Lunas', variant: 'success' as const },
};

export function OrderCard({ order, customerName }: OrderCardProps) {
  const status = statusConfig[order.orderStatus];
  const payment = paymentConfig[order.paymentStatus];

  return (
    <Link href={`/dashboard/orders/${order.id}`}>
      <div className="bg-canvas rounded-xl border border-muted p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-ink text-sm truncate">{order.invoiceNumber}</p>
              <ChevronRight className="h-4 w-4 text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
            </div>
            <p className="text-sm text-body mt-0.5 truncate">{customerName || 'Pelanggan'}</p>
          </div>
          <Badge variant={payment.variant} dot>
            {payment.label}
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${status.dotColor}`} />
            <span className="text-xs font-medium text-body">{status.label}</span>
          </div>
          <span className="text-muted">·</span>
          <span className="text-xs text-body-mid">{formatDateShort(order.dateIn)}</span>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-muted/50">
          <span className="text-xs text-body-mid">Est: {formatDateShort(order.dateEstimated)}</span>
          <span className="font-bold text-ink">{formatCurrency(order.totalAmount)}</span>
        </div>
      </div>
    </Link>
  );
}
