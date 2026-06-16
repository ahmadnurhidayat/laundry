'use client';

import { useState } from 'react';
import { OrderCard } from './OrderCard';
import { Search } from 'lucide-react';

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

const statusFilters = ['SEMUA', 'PENDING', 'PROCESSING', 'FINISHED', 'PICKED_UP'] as const;

export function OrdersList({ orders }: OrdersPageProps) {
  const [filter, setFilter] = useState<string>('SEMUA');
  const [search, setSearch] = useState('');

  const filtered = orders
    .filter((o) => filter === 'SEMUA' || o.orderStatus === filter)
    .filter((o) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        o.invoiceNumber.toLowerCase().includes(q) ||
        o.customerName?.toLowerCase().includes(q)
      );
    });

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari invoice atau nama pelanggan..."
          className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {statusFilters.map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {status === 'SEMUA' ? 'Semua' : status.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((order) => (
          <OrderCard key={order.id} order={order as any} customerName={order.customerName} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          Tidak ada pesanan ditemukan
        </div>
      )}
    </div>
  );
}
