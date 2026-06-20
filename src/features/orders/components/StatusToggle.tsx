'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface StatusConfig {
  label: string;
  color: string;
  lightColor: string;
  textColor: string;
}

const orderStatusConfig: Record<string, StatusConfig> = {
  PENDING: { label: 'Menunggu', color: 'bg-amber-500', lightColor: 'bg-amber-50', textColor: 'text-amber-700' },
  PROCESSING: { label: 'Diproses', color: 'bg-blue-500', lightColor: 'bg-blue-50', textColor: 'text-blue-700' },
  FINISHED: { label: 'Selesai', color: 'bg-emerald-500', lightColor: 'bg-emerald-50', textColor: 'text-emerald-700' },
  PICKED_UP: { label: 'Diambil', color: 'bg-purple-500', lightColor: 'bg-purple-50', textColor: 'text-purple-700' },
};

const paymentStatusConfig: Record<string, StatusConfig> = {
  UNPAID: { label: 'Belum Bayar', color: 'bg-red-500', lightColor: 'bg-red-50', textColor: 'text-red-700' },
  PAID: { label: 'Lunas', color: 'bg-emerald-500', lightColor: 'bg-emerald-50', textColor: 'text-emerald-700' },
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
            className={`relative flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              isActive
                ? `${cfg.lightColor} ${cfg.textColor} ring-2 ring-offset-1 ring-current/20 cursor-default`
                : 'bg-canvas-soft text-body hover:bg-muted/50 hover:text-ink'
            } ${loading ? 'opacity-50' : ''}`}
          >
            {isActive && (
              <span className={`w-2 h-2 rounded-full ${cfg.color}`} />
            )}
            {cfg.label}
          </button>
        );
      })}
    </div>
  );
}
