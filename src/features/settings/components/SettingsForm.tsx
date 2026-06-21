'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Building2, Phone, FileText, Save, Loader2 } from 'lucide-react';

interface Tenant {
  id: string;
  businessName: string;
  slug: string;
  address: string | null;
  phone: string | null;
  termsAndConditions: string | null;
  status: string;
}

export function SettingsForm({ initialTenant }: { initialTenant: Tenant }) {
  const router = useRouter();
  const [tenant, setTenant] = useState(initialTenant);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSave = async (field: keyof Tenant, value: string) => {
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      });

      if (response.ok) {
        setTenant((prev) => ({ ...prev, [field]: value || null }));
        setMessage({ type: 'success', text: 'Berhasil disimpan' });
        router.refresh();
      } else {
        setMessage({ type: 'error', text: 'Gagal menyimpan' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Gagal menyimpan' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Pengaturan</h1>
        <p className="text-ink-muted text-sm mt-1">Informasi bisnis Anda</p>
      </div>

      {message && (
        <div className={`p-3 rounded-lg text-sm font-medium ${
          message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-brand" />
              <h2 className="font-semibold text-ink">Informasi Bisnis</h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs font-medium text-ink-muted uppercase tracking-wider">Nama Bisnis</label>
              <input
                type="text"
                defaultValue={tenant.businessName}
                onBlur={(e) => handleSave('businessName', e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-border-subtle rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-ink-muted uppercase tracking-wider">Slug</label>
              <p className="text-ink font-medium mt-1">{tenant.slug}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-ink-muted uppercase tracking-wider">Status</label>
              <p className="mt-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  tenant.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {tenant.status === 'ACTIVE' ? 'Aktif' : 'Suspensi'}
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-brand" />
              <h2 className="font-semibold text-ink">Kontak</h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs font-medium text-ink-muted uppercase tracking-wider">Telepon</label>
              <input
                type="tel"
                defaultValue={tenant.phone || ''}
                onBlur={(e) => handleSave('phone', e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-border-subtle rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-ink-muted uppercase tracking-wider">Alamat</label>
              <textarea
                defaultValue={tenant.address || ''}
                onBlur={(e) => handleSave('address', e.target.value)}
                rows={2}
                className="mt-1 w-full px-3 py-2 border border-border-subtle rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand resize-none"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-brand" />
            <h2 className="font-semibold text-ink">Syarat & Ketentuan</h2>
          </div>
          <p className="text-sm text-ink-muted">Tampilkan di halaman tracking pelanggan</p>
        </CardHeader>
        <CardContent>
          <textarea
            defaultValue={tenant.termsAndConditions || ''}
            onBlur={(e) => handleSave('termsAndConditions', e.target.value)}
            rows={6}
            placeholder="Masukkan syarat dan ketentuan laundry Anda..."
            className="w-full px-3 py-2 border border-border-subtle rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand resize-none"
          />
          <p className="text-xs text-ink-muted mt-2">
            Contoh: &quot;1. Pengambilan barang harap disertai nota. 2. Barang yang tidak diambil selama 1 bulan, hilang/rusak tidak diganti.&quot;
          </p>
        </CardContent>
      </Card>

      {saving && (
        <div className="fixed bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-ink text-white rounded-lg shadow-premium-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Menyimpan...</span>
        </div>
      )}
    </div>
  );
}
