'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, X, Users, Phone, MapPin, ChevronRight } from 'lucide-react';
import { formatCurrency, formatDateShort, isRecentlyActive } from '@/lib/utils';

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

      {/* Customer Table */}
      {filtered.length > 0 ? (
        <div className="bg-canvas rounded-xl border border-muted overflow-hidden">
          {/* Table Header */}
          <div className="hidden md:grid md:grid-cols-12 gap-4 px-4 py-3 bg-canvas-soft border-b border-muted text-xs font-medium text-body-mid uppercase tracking-wider">
            <div className="col-span-3">Pelanggan</div>
            <div className="col-span-2">Telepon</div>
            <div className="col-span-2">Alamat</div>
            <div className="col-span-1 text-center">Pesanan</div>
            <div className="col-span-2 text-right">Total Belanja</div>
            <div className="col-span-1 text-center">Status</div>
            <div className="col-span-1"></div>
          </div>

          {/* Table Body */}
          {filtered.map((customer) => {
            const isActive = customer.lastOrderDate && isRecentlyActive(customer.lastOrderDate);
            return (
              <Link
                key={customer.id}
                href={`/dashboard/customers/${customer.id}`}
                className="block hover:bg-canvas-soft/50 transition-colors border-b border-muted/50 last:border-b-0"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-4 py-3">
                  {/* Name + Avatar */}
                  <div className="md:col-span-3 flex items-center gap-3">
                    <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-primary font-bold text-sm">
                        {customer.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-ink text-sm truncate">{customer.name}</p>
                      {customer.notes && (
                        <p className="text-xs text-body-mid truncate mt-0.5">{customer.notes}</p>
                      )}
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="md:col-span-2 flex items-center gap-1.5 text-sm text-body">
                    <Phone className="h-3.5 w-3.5 text-body-mid md:hidden" />
                    {customer.phoneNumber}
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2 flex items-center gap-1.5 text-sm text-body truncate">
                    <MapPin className="h-3.5 w-3.5 text-body-mid shrink-0 md:hidden" />
                    <span className="truncate">{customer.address || '-'}</span>
                  </div>

                  {/* Orders Count */}
                  <div className="md:col-span-1 flex items-center justify-start md:justify-center text-sm">
                    <span className="font-medium text-ink">{customer.totalOrders}</span>
                  </div>

                  {/* Total Spent */}
                  <div className="md:col-span-2 flex items-center justify-start md:justify-end text-sm font-semibold text-ink">
                    {formatCurrency(customer.totalSpent)}
                  </div>

                  {/* Status */}
                  <div className="md:col-span-1 flex items-center justify-start md:justify-center">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
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

                  {/* Arrow */}
                  <div className="hidden md:flex md:col-span-1 items-center justify-end">
                    <ChevronRight className="h-4 w-4 text-muted group-hover:text-primary transition-colors" />
                  </div>
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
