'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, X, Users, Phone, MapPin, ShoppingBag, ChevronRight } from 'lucide-react';
import { formatCurrency, isRecentlyActive } from '@/lib/utils';

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
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-body-mid" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama, telepon, atau alamat..."
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

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-body-mid">
          {filtered.length} pelanggan{search && ` · Hasil pencarian`}
        </p>
        {search && (
          <button
            onClick={() => setSearch('')}
            className="text-sm text-primary hover:text-primary-hover font-medium"
          >
            Reset
          </button>
        )}
      </div>

      {/* Customer Cards */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map((customer) => {
            const isActive = customer.lastOrderDate && isRecentlyActive(customer.lastOrderDate);
            return (
              <Link
                key={customer.id}
                href={`/dashboard/customers/${customer.id}`}
                className="bg-canvas rounded-xl border border-muted p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="w-11 h-11 bg-primary/10 rounded-full flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <span className="text-primary font-bold text-base">
                      {customer.name.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-ink text-sm truncate">{customer.name}</h3>
                      <ChevronRight className="h-4 w-4 text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-body mb-1.5">
                      <Phone className="h-3 w-3 text-body-mid shrink-0" />
                      <span>{customer.phoneNumber}</span>
                    </div>

                    {customer.address && (
                      <div className="flex items-center gap-1.5 text-xs text-body mb-1.5">
                        <MapPin className="h-3 w-3 text-body-mid shrink-0" />
                        <span className="truncate">{customer.address}</span>
                      </div>
                    )}

                    {customer.notes && (
                      <p className="text-xs text-body-mid truncate mt-1">{customer.notes}</p>
                    )}
                  </div>
                </div>

                {/* Stats Row */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <ShoppingBag className="h-3.5 w-3.5 text-body-mid" />
                      <span className="text-xs font-medium text-ink">{customer.totalOrders}</span>
                    </div>
                    <span className="text-muted">·</span>
                    <span className="text-xs font-semibold text-ink">{formatCurrency(customer.totalSpent)}</span>
                  </div>

                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700'
                      : customer.totalOrders === 0
                      ? 'bg-gray-100 text-gray-500'
                      : 'bg-amber-50 text-amber-700'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      isActive ? 'bg-emerald-500' : customer.totalOrders === 0 ? 'bg-gray-400' : 'bg-amber-500'
                    }`} />
                    {isActive ? 'Aktif' : customer.totalOrders === 0 ? 'Baru' : 'Diam'}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-canvas-soft rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-7 w-7 text-muted" />
          </div>
          <p className="text-ink font-medium mb-1">Tidak ada pelanggan ditemukan</p>
          <p className="text-sm text-body-mid">
            {search ? 'Coba kata kunci lain' : 'Belum ada pelanggan terdaftar'}
          </p>
        </div>
      )}
    </div>
  );
}
