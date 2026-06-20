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
  { value: 'PENDING', label: 'Menunggu', dotColor: 'bg-amber-500' },
  { value: 'PROCESSING', label: 'Diproses', dotColor: 'bg-blue-500' },
  { value: 'FINISHED', label: 'Selesai', dotColor: 'bg-emerald-500' },
  { value: 'PICKED_UP', label: 'Diambil', dotColor: 'bg-purple-500' },
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
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-body-mid" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari invoice atau nama pelanggan..."
          className="w-full h-12 pl-11 pr-10 rounded-xl bg-canvas border border-muted text-sm text-ink placeholder:text-body-mid focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-canvas-soft transition-colors"
          >
            <X className="h-4 w-4 text-body-mid" />
          </button>
        )}
      </div>

      {/* Status Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        {statusFilters.map((status) => {
          const isActive = filter === status.value;
          return (
            <button
              key={status.value}
              onClick={() => setFilter(status.value)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-canvas border border-muted text-body hover:border-primary/30 hover:text-ink'
              }`}
            >
              {'dotColor' in status && status.dotColor && (
                <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-white' : status.dotColor}`} />
              )}
              {status.label}
            </button>
          );
        })}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-body-mid">
          {filtered.length} pesanan{activeFilter && activeFilter.value !== 'SEMUA' && ` · ${activeFilter.label}`}
        </p>
        {filter !== 'SEMUA' && (
          <button
            onClick={() => setFilter('SEMUA')}
            className="text-sm text-primary hover:text-primary-hover font-medium"
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
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-canvas-soft rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-7 w-7 text-muted" />
          </div>
          <p className="text-ink font-medium mb-1">Tidak ada pesanan ditemukan</p>
          <p className="text-sm text-body-mid">
            {search ? 'Coba kata kunci lain' : 'Belum ada pesanan dengan status ini'}
          </p>
        </div>
      )}
    </div>
  );
}
