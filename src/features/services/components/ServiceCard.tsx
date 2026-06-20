'use client';

import { useState } from 'react';
import { Pencil, Trash2, GripVertical, ToggleLeft, ToggleRight, X, Save } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

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

interface ServiceCardProps {
  service: Service;
  onUpdate: (id: string, data: Partial<Service>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function ServiceCard({ service, onUpdate, onDelete }: ServiceCardProps) {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [name, setName] = useState(service.serviceName);
  const [description, setDescription] = useState(service.description || '');
  const [type, setType] = useState(service.type);
  const [price, setPrice] = useState(service.pricePerUnit);
  const [minWeight, setMinWeight] = useState(service.minWeight || 0);

  const hasChanges =
    name !== service.serviceName ||
    description !== (service.description || '') ||
    type !== service.type ||
    price !== service.pricePerUnit ||
    minWeight !== (service.minWeight || 0);

  const handleSave = async () => {
    if (!name.trim() || price <= 0) return;
    setLoading(true);
    try {
      await onUpdate(service.id, {
        serviceName: name.trim(),
        description: description.trim() || null,
        type,
        pricePerUnit: price,
        minWeight,
      });
      setEditing(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setName(service.serviceName);
    setDescription(service.description || '');
    setType(service.type);
    setPrice(service.pricePerUnit);
    setMinWeight(service.minWeight || 0);
    setEditing(false);
  };

  const handleToggleActive = async () => {
    await onUpdate(service.id, { isActive: service.isActive ? 0 : 1 });
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onDelete(service.id);
    } finally {
      setLoading(false);
    }
  };

  const isKiloan = (editing ? type : service.type) === 'KILOAN';
  const currentPrice = editing ? price : service.pricePerUnit;
  const currentMinWeight = editing ? minWeight : (service.minWeight || 0);

  return (
    <div className={`bg-canvas rounded-xl border transition-all ${
      service.isActive ? 'border-muted' : 'border-muted opacity-60'
    }`}>
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <GripVertical className="h-4 w-4 text-muted cursor-grab" />
            <div>
              {editing ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="font-semibold text-ink text-sm bg-canvas-soft border border-muted rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              ) : (
                <h3 className="font-semibold text-ink text-sm">{service.serviceName}</h3>
              )}
              {editing ? (
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Deskripsi singkat"
                  className="text-xs text-body-mid bg-canvas-soft border border-muted rounded-lg px-2 py-1 w-full mt-1 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              ) : service.description ? (
                <p className="text-xs text-body-mid mt-0.5">{service.description}</p>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-1">
            {editing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="p-1.5 text-body-mid hover:bg-canvas-soft rounded-lg transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading || !hasChanges}
                  className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleToggleActive}
                  className="p-1.5 text-body-mid hover:bg-canvas-soft rounded-lg transition-colors"
                  title={service.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                >
                  {service.isActive ? (
                    <ToggleRight className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <ToggleLeft className="h-5 w-5 text-muted" />
                  )}
                </button>
                <button
                  onClick={() => setEditing(true)}
                  className="p-1.5 text-body-mid hover:bg-canvas-soft rounded-lg transition-colors"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setShowDelete(true)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Type & Price */}
        <div className="flex items-center gap-3 mb-3">
          {editing ? (
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="h-8 px-2 text-xs font-medium bg-canvas-soft border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="KILOAN">Kiloan</option>
              <option value="SATUAN">Satuan</option>
            </select>
          ) : (
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              isKiloan ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
            }`}>
              {isKiloan ? 'Kiloan' : 'Satuan'}
            </span>
          )}

          <div className="flex items-baseline gap-1">
            {editing ? (
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-24 h-8 px-2 text-sm font-bold text-ink bg-canvas-soft border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            ) : (
              <span className="text-lg font-bold text-ink">{formatCurrency(service.pricePerUnit)}</span>
            )}
            <span className="text-xs text-body-mid">/ {isKiloan ? 'kg' : 'item'}</span>
          </div>
        </div>

        {/* Min Weight (Kiloan only) */}
        {isKiloan && (
          <div className="flex items-center gap-2 text-xs text-body-mid">
            <span>Min:</span>
            {editing ? (
              <input
                type="number"
                value={minWeight}
                onChange={(e) => setMinWeight(Number(e.target.value))}
                className="w-16 h-7 px-2 text-xs bg-canvas-soft border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            ) : (
              <span className="font-medium text-body">{currentMinWeight} kg</span>
            )}
          </div>
        )}

        {/* Price Preview */}
        {isKiloan && currentMinWeight > 0 && (
          <div className="mt-3 p-2 bg-canvas-soft rounded-lg">
            <p className="text-xs text-body-mid mb-1">Contoh perhitungan:</p>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-body">{currentMinWeight} kg × {formatCurrency(currentPrice)}</span>
              <span className="text-muted">=</span>
              <span className="font-bold text-ink">{formatCurrency(currentMinWeight * currentPrice)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      {showDelete && (
        <div className="px-4 pb-4">
          <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
            <p className="text-xs text-red-700 mb-2">Hapus layanan ini?</p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDelete(false)}
                className="px-3 py-1 text-xs font-medium text-body hover:bg-canvas-soft rounded-lg"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-3 py-1 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-50"
              >
                {loading ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
