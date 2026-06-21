'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface StatusConfig {
  label: string;
  badgeClass: string;
}

const orderStatusConfig: Record<string, StatusConfig> = {
  PENDING: { label: 'Pending', badgeClass: 'bg-zinc-100 text-zinc-800 border border-zinc-200' },
  PROCESSING: { label: 'Processing', badgeClass: 'bg-blue-50 text-blue-700 border border-blue-200' },
  FINISHED: { label: 'Selesai', badgeClass: 'bg-green-50 text-green-700 border border-green-200' },
  PICKED_UP: { label: 'Diambil', badgeClass: 'bg-zinc-100 text-zinc-600 border border-zinc-200' },
};

const paymentStatusConfig: Record<string, StatusConfig> = {
  UNPAID: { label: 'Belum Bayar', badgeClass: 'bg-red-50 text-red-700 border border-red-200' },
  PAID: { label: 'Lunas', badgeClass: 'bg-green-50 text-green-700 border border-green-200' },
};

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
  const statuses = Object.keys(config);

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === currentStatus) return;
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
    <div className="grid grid-cols-2 gap-2">
      {statuses.map((status) => {
        const isActive = currentStatus === status;
        const cfg = config[status];
        return (
          <button
            key={status}
            onClick={() => handleStatusChange(status)}
            disabled={loading || isActive}
            className={`relative flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150 ${
              isActive
                ? 'bg-brand text-white shadow-premium-sm cursor-default'
                : 'bg-canvas text-ink-muted border border-border-subtle hover:bg-canvas hover:text-ink hover:border-border-strong'
            } ${loading ? 'opacity-50' : ''}`}
          >
            {cfg.label}
          </button>
        );
      })}
    </div>
  );
}
