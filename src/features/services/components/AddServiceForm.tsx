'use client';

import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';

interface AddServiceFormProps {
  onClose: () => void;
  onCreated: () => void;
}

export function AddServiceForm({ onClose, onCreated }: AddServiceFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('KILOAN');
  const [price, setPrice] = useState<number>(0);
  const [minWeight, setMinWeight] = useState<number>(0);

  const isKiloan = type === 'KILOAN';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Nama layanan wajib diisi');
      return;
    }
    if (price <= 0) {
      setError('Harga harus lebih dari 0');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceName: name.trim(),
          description: description.trim() || null,
          type,
          pricePerUnit: price,
          minWeight: isKiloan ? minWeight : 0,
        }),
      });

      if (!res.ok) {
        const data: { error?: string } = await res.json();
        throw new Error(data.error || 'Gagal membuat layanan');
      }

      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink/20 backdrop-blur-sm">
      <div className="w-full sm:max-w-md bg-canvas-elevated rounded-xl shadow-premium-lg p-6 animate-slide-up max-h-[90dvh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-ink">Tambah Layanan</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-ink-muted hover:bg-canvas-soft rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="text-xs font-medium text-ink mb-1 block">Nama Layanan</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Cuci Setrika"
              className="h-10 px-3 text-sm bg-canvas-soft border border-border-subtle rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-brand-subtle"
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-medium text-ink mb-1 block">Deskripsi (opsional)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Contoh: Cuci + Setrika + Lipat"
              className="h-10 px-3 text-sm bg-canvas-soft border border-border-subtle rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-brand-subtle"
            />
          </div>

          {/* Type */}
          <div>
            <label className="text-xs font-medium text-ink mb-1 block">Tipe</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType('KILOAN')}
                className={`h-10 text-sm font-medium rounded-xl border transition-colors ${
                  type === 'KILOAN'
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'bg-canvas-soft border-border-subtle text-ink-muted hover:bg-canvas-soft'
                }`}
              >
                Kiloan (per kg)
              </button>
              <button
                type="button"
                onClick={() => setType('SATUAN')}
                className={`h-10 text-sm font-medium rounded-xl border transition-colors ${
                  type === 'SATUAN'
                    ? 'bg-purple-50 border-purple-200 text-purple-700'
                    : 'bg-canvas-soft border-border-subtle text-ink-muted hover:bg-canvas-soft'
                }`}
              >
                Satuan (per item)
              </button>
            </div>
          </div>

          {/* Price */}
          <div>
              <label className="text-xs font-medium text-ink mb-1 block">
              Harga per {isKiloan ? 'kg' : 'item'}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-ink-muted">Rp</span>
              <input
                type="number"
                value={price || ''}
                onChange={(e) => setPrice(Number(e.target.value))}
                placeholder="0"
                min={1}
                className="h-10 pl-10 pr-3 text-sm bg-canvas-soft border border-border-subtle rounded-xl w-full font-mono focus:outline-none focus:ring-2 focus:ring-brand-subtle"
              />
            </div>
          </div>

          {/* Min Weight (Kiloan only) */}
          {isKiloan && (
            <div>
            <label className="text-xs font-medium text-ink mb-1 block">
                Berat Minimum (kg)
              </label>
              <input
                type="number"
                value={minWeight || ''}
                onChange={(e) => setMinWeight(Number(e.target.value))}
                placeholder="0"
                min={0}
              className="h-10 px-3 text-sm bg-canvas-soft border border-border-subtle rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-brand-subtle"
              />
              <p className="text-xs text-ink-muted mt-1">0 = tanpa minimum</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
              <p className="text-xs text-red-700">{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="h-11 w-full text-sm font-semibold text-white bg-brand hover:bg-brand-hover rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              'Simpan Layanan'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
