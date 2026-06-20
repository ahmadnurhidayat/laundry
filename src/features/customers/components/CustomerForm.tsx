'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Save, X, Trash2, Phone, MapPin, FileText } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  phoneNumber: string;
  address: string | null;
  notes: string | null;
}

interface CustomerFormProps {
  customer: Customer;
  totalOrders: number;
}

export function CustomerForm({ customer, totalOrders }: CustomerFormProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState(customer.name);
  const [phone, setPhone] = useState(customer.phoneNumber);
  const [address, setAddress] = useState(customer.address || '');
  const [notes, setNotes] = useState(customer.notes || '');

  const hasChanges =
    name !== customer.name ||
    phone !== customer.phoneNumber ||
    address !== (customer.address || '') ||
    notes !== (customer.notes || '');

  const handleSave = async () => {
    if (!name.trim() || !phone.trim()) {
      setError('Nama dan nomor telepon wajib diisi');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/customers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: customer.id,
          name: name.trim(),
          phoneNumber: phone.trim(),
          address: address.trim() || null,
          notes: notes.trim() || null,
        }),
      });

      const data = await res.json() as { error?: string };

      if (!res.ok) {
        throw new Error(data.error || 'Gagal menyimpan');
      }

      setEditing(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setName(customer.name);
    setPhone(customer.phoneNumber);
    setAddress(customer.address || '');
    setNotes(customer.notes || '');
    setEditing(false);
    setError('');
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/customers?id=${customer.id}`, {
        method: 'DELETE',
      });

      const data = await res.json() as { error?: string };

      if (!res.ok) {
        throw new Error(data.error || 'Gagal menghapus');
      }

      router.push('/dashboard/customers');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="bg-canvas rounded-xl border border-muted p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-ink">Data Pelanggan</h2>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-body hover:bg-canvas-soft rounded-lg transition-colors"
            >
              <X className="h-4 w-4" />
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={loading || !hasChanges}
              className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium text-white bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              <Save className="h-4 w-4" />
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-body mb-1.5">Nama</label>
          {editing ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-muted text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          ) : (
            <p className="text-ink">{customer.name}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-body mb-1.5">Nomor Telepon</label>
          {editing ? (
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-muted text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          ) : (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-body-mid" />
              <span className="text-ink">{customer.phoneNumber}</span>
              <a
                href={`https://wa.me/${customer.phoneNumber.replace(/[^0-9]/g, '').replace(/^0/, '62')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
              >
                WhatsApp
              </a>
            </div>
          )}
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-body mb-1.5">Alamat</label>
          {editing ? (
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Alamat pelanggan"
              className="w-full h-10 px-3 rounded-lg border border-muted text-sm text-ink placeholder:text-body-mid focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          ) : (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-body-mid" />
              <span className="text-ink">{customer.address || '-'}</span>
            </div>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-body mb-1.5">Catatan</label>
          {editing ? (
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Preferensi, alergi, dll."
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-muted text-sm text-ink placeholder:text-body-mid focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
            />
          ) : (
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 text-body-mid mt-0.5" />
              <span className="text-ink">{customer.notes || '-'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Delete Section */}
      {!editing && totalOrders === 0 && (
        <div className="mt-6 pt-6 border-t border-muted">
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Hapus Pelanggan
            </button>
          ) : (
            <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
              <p className="text-sm text-red-700 mb-3">
                Yakin ingin menghapus pelanggan ini? Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-3 py-1.5 text-sm font-medium text-body hover:bg-canvas-soft rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-4 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-lg transition-colors"
                >
                  {deleting ? 'Menghapus...' : 'Ya, Hapus'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
