'use client';

import { useState } from 'react';
import { OrderCard } from '@/components/dashboard/order-card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Order } from '@/types';

interface OrderListProps {
  orders: (Order & { customerName?: string })[];
}

const STATUS_FILTERS = ['ALL', 'PENDING', 'PROCESSING', 'FINISHED', 'PICKED_UP'] as const;

export function OrderList({ orders }: OrderListProps) {
  const [filter, setFilter] = useState<string>('ALL');

  const filtered = filter === 'ALL' ? orders : orders.filter((o) => o.orderStatus === filter);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUS_FILTERS.map((status) => (
          <Button
            key={status}
            variant={filter === status ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFilter(status)}
          >
            {status === 'ALL' ? 'All' : status.replace('_', ' ')}
          </Button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No orders found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((order) => (
            <OrderCard key={order.id} order={order} customerName={order.customerName} />
          ))}
        </div>
      )}
    </div>
  );
}
