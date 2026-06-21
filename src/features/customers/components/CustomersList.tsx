'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, X, Users, Phone, User, Eye, Plus, ShoppingBag } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface Customer {
  id: string;
  name: string;
  phoneNumber: string;
  address: string | null;
  notes: string | null;
  createdAt: string | null;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string | null;
}

interface CustomersListProps {
  customers: Customer[];
}

export function CustomersList({ customers }: CustomersListProps) {
  const [search, setSearch] = useState('');

  const filtered = customers.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.phoneNumber.includes(q) ||
      c.address?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama, telepon, atau alamat..."
          className="w-full h-12 pl-11 pr-10 rounded-xl bg-canvas-elevated border border-border-subtle text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-canvas transition-colors"
          >
            <X className="h-4 w-4 text-ink-muted" />
          </button>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-muted">
          {filtered.length} pelanggan{search && ` · Hasil pencarian`}
        </p>
        {search && (
          <button
            onClick={() => setSearch('')}
            className="text-sm text-brand hover:text-brand-hover font-medium"
          >
            Reset
          </button>
        )}
      </div>

      {/* Customer Cards - 3 Column Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((customer) => {
            const isActive = customer.lastOrderDate && 
              new Date(customer.lastOrderDate).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000;
            return (
              <div
                key={customer.id}
                className="bg-canvas-elevated rounded-2xl border border-border-subtle p-4 hover:shadow-premium-sm transition-all duration-200"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="h-12 w-12 rounded-full bg-brand/10 flex items-center justify-center border border-brand/20 flex-shrink-0">
                    <User className="h-6 w-6 text-brand" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-ink truncate">{customer.name}</h3>
                      <div className="h-2 w-2 bg-emerald-500 rounded-full flex-shrink-0"></div>
                    </div>
                    <p className="text-sm text-ink-muted flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {customer.phoneNumber}
                    </p>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-2 mb-3 p-2 bg-canvas rounded-lg">
                  <div className="text-center">
                    <p className="text-xs text-ink-muted">Order</p>
                    <p className="font-semibold text-ink">{customer.totalOrders}</p>
                  </div>
                  <div className="text-center border-x border-border-subtle">
                    <p className="text-xs text-ink-muted">Total</p>
                    <p className="font-semibold text-ink">Rp {(customer.totalSpent / 1000).toFixed(0)}k</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-ink-muted">Terakhir</p>
                    <p className="font-semibold text-ink text-xs">
                      {customer.lastOrderDate 
                        ? new Date(customer.lastOrderDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
                        : '-'
                      }
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Link href={`/dashboard/customers/${customer.id}`} className="flex-1">
                    <button className="w-full h-9 bg-brand/10 text-brand rounded-xl text-sm font-medium hover:bg-brand/20 active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-1.5">
                      <Eye className="h-4 w-4" />
                      Lihat
                    </button>
                  </Link>
                  <Link href={`/dashboard/orders/new?customerId=${customer.id}`} className="flex-1">
                    <button className="w-full h-9 bg-brand text-white rounded-xl text-sm font-medium hover:bg-brand-hover active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-1.5">
                      <Plus className="h-4 w-4" />
                      Order
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-canvas rounded-full flex items-center justify-center mx-auto mb-4 border border-border-subtle">
            <Users className="h-7 w-7 text-ink-muted" />
          </div>
          <p className="text-ink font-medium mb-1">Tidak ada pelanggan ditemukan</p>
          <p className="text-sm text-ink-muted">
            {search ? 'Coba kata kunci lain' : 'Belum ada pelanggan terdaftar'}
          </p>
        </div>
      )}
    </div>
  );
}
