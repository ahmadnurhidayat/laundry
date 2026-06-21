'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Package } from 'lucide-react';
import { ServiceCard } from './ServiceCard';
import { AddServiceForm } from './AddServiceForm';

interface Service {
  id: string;
  serviceName: string;
  description: string | null;
  type: string;
  pricePerUnit: number;
  minWeight: number | null;
  isActive: number | null;
  sortOrder: number | null;
}

export function ServicesList() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services');
      const data: { services?: Service[] } = await res.json();
      setServices(data.services || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleUpdate = async (id: string, data: Partial<Service>) => {
    const res = await fetch('/api/services', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...data }),
    });
    if (!res.ok) throw new Error('Gagal memperbarui');
    await fetchServices();
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/services?id=${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Gagal menghapus');
    await fetchServices();
  };

  const filtered = services.filter((s) =>
    s.serviceName.toLowerCase().includes(search.toLowerCase()) ||
    s.description?.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = services.filter((s) => s.isActive).length;

  return (
    <div className="min-h-[calc(100dvh-64px)] pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-ink">Layanan & Harga</h1>
          <p className="text-sm text-ink-muted mt-0.5">
            {services.length} layanan · {activeCount} aktif
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="h-10 px-4 text-sm font-semibold text-white bg-brand hover:bg-brand-hover rounded-xl transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Tambah Layanan</span>
        </button>
      </div>

      {/* Search */}
      {services.length > 3 && (
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
          <input
            type="text"
            placeholder="Cari layanan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 pl-9 pr-4 text-sm bg-canvas-soft border border-border-subtle rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-brand-subtle"
          />
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-canvas-soft rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && services.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 bg-brand-subtle rounded-full flex items-center justify-center mb-4">
            <Package className="h-8 w-8 text-brand" />
          </div>
          <h3 className="font-semibold text-ink mb-1">Belum ada layanan</h3>
          <p className="text-sm text-ink-muted mb-4">
            Tambahkan layanan pertama untuk mulai mengatur harga
          </p>
          <button
            onClick={() => setShowAdd(true)}
            className="h-10 px-4 text-sm font-semibold text-white bg-brand hover:bg-brand-hover rounded-xl transition-colors"
          >
            Tambah Layanan
          </button>
        </div>
      )}

      {/* Services Grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* No Results */}
      {!loading && services.length > 0 && filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm text-ink-muted">Tidak ada layanan yang cocok</p>
        </div>
      )}

      {/* Add Service Modal */}
      {showAdd && (
        <AddServiceForm
          onClose={() => setShowAdd(false)}
          onCreated={async () => {
            await fetchServices();
            setShowAdd(false);
          }}
        />
      )}
    </div>
  );
}
