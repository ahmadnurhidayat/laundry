'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const orderStatusConfig = {
  PENDING: 'Menunggu',
  PROCESSING: 'Diproses',
  FINISHED: 'Selesai',
  PICKED_UP: 'Diambil',
} as const;

const paymentStatusConfig = {
  UNPAID: 'Belum Bayar',
  PAID: 'Lunas',
} as const;

interface StatusToggleProps {
  orderId: string;
  currentStatus: string;
  type: 'order' | 'payment';
}

export function StatusToggle({ orderId, currentStatus, type }: StatusToggleProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const endpoint = type === 'order' ? '/api/orders' : '/api/orders/payment';
  const config = type === 'order' ? orderStatusConfig : paymentStatusConfig;
  const statuses = Object.keys(config) as Array<keyof typeof config>;

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true);
    try {
      await fetch(endpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      router.refresh();
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {statuses.map((status) => {
        const isActive = currentStatus === status;
        return (
          <button
            key={status}
            onClick={() => handleStatusChange(status)}
            disabled={loading || isActive}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              isActive
                ? 'bg-gray-900 text-white cursor-default'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            } ${loading ? 'opacity-50' : ''}`}
          >
            {config[status]}
          </button>
        );
      })}
    </div>
  );
}
