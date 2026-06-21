'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { OrderCard } from './OrderCard';
import { Search, X } from 'lucide-react';

interface Order {
  id: string;
  invoiceNumber: string;
  customerId: string;
  orderStatus: string;
  paymentStatus: string;
  totalAmount: number;
  dateIn: string;
  dateEstimated: string;
  customerName?: string;
}

interface OrdersPageProps {
  orders: Order[];
}

const statusFilters = [
  { value: 'SEMUA', label: 'Semua' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'FINISHED', label: 'Selesai' },
  { value: 'PICKED_UP', label: 'Diambil' },
] as const;

export function OrdersList({ orders }: OrdersPageProps) {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get('status') || 'SEMUA';
  const [filter, setFilter] = useState<string>(initialStatus);
  const [search, setSearch] = useState('');

  const filtered = orders
    .filter((o) => {
      if (filter === 'SEMUA') return true;
      if (filter === 'UNPAID') return o.paymentStatus === 'UNPAID';
      return o.orderStatus === filter;
    })
    .filter((o) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        o.invoiceNumber.toLowerCase().includes(q) ||
        o.customerName?.toLowerCase().includes(q)
      );
    });

  const activeFilter = statusFilters.find((f) => f.value === filter);

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari invoice atau nama pelanggan..."
          className="w-full h-10 pl-9 pr-10 text-sm bg-canvas-elevated text-ink border border-border-subtle rounded-lg placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-canvas transition-colors"
          >
            <X className="h-4 w-4 text-ink-muted" />
          </button>
        )}
      </div>

      {/* Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {statusFilters.map((status) => {
          const isActive = filter === status.value;
          return (
            <button
              key={status.value}
              onClick={() => setFilter(status.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-brand text-white shadow-premium-sm'
                  : 'bg-canvas-elevated border border-border-subtle text-ink-muted hover:bg-canvas hover:text-ink'
              }`}
            >
              {status.label}
            </button>
          );
        })}
      </div>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-ink-muted">
          {filtered.length} pesanan{activeFilter && activeFilter.value !== 'SEMUA' && ` · ${activeFilter.label}`}
        </p>
        {filter !== 'SEMUA' && (
          <button
            onClick={() => setFilter('SEMUA')}
            className="text-xs text-brand hover:text-brand-hover font-medium"
          >
            Reset filter
          </button>
        )}
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {filtered.map((order) => (
          <OrderCard key={order.id} order={order as any} customerName={order.customerName} />
        ))}
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-14 w-14 bg-canvas rounded-full flex items-center justify-center mb-4 border border-border-subtle">
            <Search className="h-7 w-7 text-ink-muted" />
          </div>
          <p className="text-sm font-semibold text-ink mb-1">Tidak ada pesanan ditemukan</p>
          <p className="text-sm text-ink-muted">
            {search ? 'Coba kata kunci lain' : 'Belum ada pesanan dengan status ini'}
          </p>
        </div>
      )}
    </div>
  );
}
