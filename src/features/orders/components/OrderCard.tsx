import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { formatCurrency, formatDateShort } from '@/lib/utils';
import type { Order } from '@/types';

interface OrderCardProps {
  order: Order;
  customerName?: string;
}

const statusConfig = {
  PENDING: { label: 'Pending', badgeClass: 'bg-zinc-100 text-zinc-800 border border-zinc-200' },
  PROCESSING: { label: 'Processing', badgeClass: 'bg-blue-50 text-blue-700 border border-blue-200' },
  FINISHED: { label: 'Selesai', badgeClass: 'bg-green-50 text-green-700 border border-green-200' },
  PICKED_UP: { label: 'Diambil', badgeClass: 'bg-zinc-100 text-zinc-600 border border-zinc-200' },
};

const paymentConfig = {
  UNPAID: { label: 'Belum Bayar', badgeClass: 'bg-red-50 text-red-700 border border-red-200' },
  PAID: { label: 'Lunas', badgeClass: 'bg-green-50 text-green-700 border border-green-200' },
};

export function OrderCard({ order, customerName }: OrderCardProps) {
  const status = statusConfig[order.orderStatus];
  const payment = paymentConfig[order.paymentStatus];

  return (
    <Link href={`/dashboard/orders/${order.id}`}>
      <div className="bg-canvas-elevated rounded-xl border border-border-subtle shadow-premium-sm p-4 hover:shadow-premium-md transition-shadow duration-200 cursor-pointer group relative">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <p className="font-mono text-sm font-medium text-ink truncate">{order.invoiceNumber}</p>
            <p className="text-sm text-ink-muted mt-0.5 truncate">{customerName || 'Pelanggan'}</p>
          </div>
          <span className={`inline-flex items-center font-mono text-xs px-2.5 py-0.5 rounded-full ${payment.badgeClass}`}>
            {payment.label}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs text-ink-muted">
          <span className="font-mono">{status.label}</span>
          <span className="text-border-subtle">·</span>
          <span>{formatDateShort(order.dateIn)}</span>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border-subtle">
          <span className="text-xs text-ink-muted">Est: {formatDateShort(order.dateEstimated)}</span>
          <span className="font-mono text-sm font-semibold text-ink">{formatCurrency(order.totalAmount)}</span>
        </div>

        <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </Link>
  );
}
