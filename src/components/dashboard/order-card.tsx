'use client';

import Link from 'next/link';
import { Clock, CheckCircle, Package, User, Calendar, CreditCard } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { formatDate, formatCurrency } from '@/lib/utils';
import type { Order } from '@/types';

interface OrderCardProps {
  order: Order;
  customerName?: string;
}

const statusConfig: Record<string, { color: 'warning' | 'info' | 'success' | 'default'; icon: typeof Clock }> = {
  PENDING: { color: 'warning', icon: Clock },
  PROCESSING: { color: 'info', icon: Package },
  FINISHED: { color: 'success', icon: CheckCircle },
  PICKED_UP: { color: 'default', icon: Package },
};

export function OrderCard({ order, customerName }: OrderCardProps) {
  const config = statusConfig[order.orderStatus] || statusConfig.PENDING;
  const Icon = config.icon;

  return (
    <Link href={`/orders/${order.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent>
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-semibold text-gray-900">#{order.invoiceNumber}</h3>
              {customerName && (
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <User className="h-3 w-3 mr-1" />
                  {customerName}
                </div>
              )}
            </div>
            <Badge variant={config.color}>
              <Icon className="h-3 w-3 mr-1" />
              {order.orderStatus}
            </Badge>
          </div>

          <div className="space-y-1 text-sm text-gray-600">
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-2" />
              Est: {formatDate(order.dateEstimated)}
            </div>
            <div className="flex items-center">
              <CreditCard className="h-3 w-3 mr-2" />
              <Badge variant={order.paymentStatus === 'PAID' ? 'success' : 'danger'}>
                {order.paymentStatus}
              </Badge>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-lg font-bold text-gray-900">{formatCurrency(order.totalAmount)}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
