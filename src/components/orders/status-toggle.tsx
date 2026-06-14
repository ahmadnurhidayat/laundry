'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface StatusToggleProps {
  orderId: string;
  currentStatus: string;
  type: 'order' | 'payment';
}

const orderStatuses = ['PENDING', 'PROCESSING', 'FINISHED', 'PICKED_UP'];
const paymentStatuses = ['UNPAID', 'PAID'];

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
  PROCESSING: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  FINISHED: 'bg-green-100 text-green-800 hover:bg-green-200',
  PICKED_UP: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
  UNPAID: 'bg-red-100 text-red-800 hover:bg-red-200',
  PAID: 'bg-green-100 text-green-800 hover:bg-green-200',
};

export function StatusToggle({ orderId, currentStatus, type }: StatusToggleProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const statuses = type === 'order' ? orderStatuses : paymentStatuses;

  const handleUpdate = async (newStatus: string) => {
    setLoading(true);
    try {
      const endpoint = type === 'order' ? '/api/orders' : '/api/orders/payment';
      await fetch(endpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {statuses.map((status) => (
        <Button
          key={status}
          variant="ghost"
          size="sm"
          onClick={() => handleUpdate(status)}
          disabled={loading || currentStatus === status}
          className={cn(
            currentStatus === status && 'ring-2 ring-offset-2 ring-blue-500',
            statusColors[status]
          )}
        >
          {loading && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
          {status.replace('_', ' ')}
        </Button>
      ))}
    </div>
  );
}
