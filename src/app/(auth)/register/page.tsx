'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Step = 1 | 2;

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [businessName, setBusinessName] = useState('');
  const [address, setAddress] = useState('');

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) {
      setError('Nama usaha wajib diisi');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !phone.trim() || !password) {
      setError('Semua field wajib diisi');
      return;
    }
    if (password.length < 8) {
      setError('Password minimal 8 karakter');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessName, phone, address, name, password }),
      });

      const data = await res.json() as { error?: string };

      if (!res.ok) {
        setError(data.error || 'Registration failed');
        return;
      }

      router.push('/dashboard');
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center mb-8">
          <div className="h-10 w-10 bg-brand rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">L</span>
          </div>
        </div>

        <div className="bg-canvas-elevated rounded-xl border border-border-subtle shadow-premium-sm p-6">
          <h1 className="text-lg font-semibold text-ink text-center mb-1">Daftar Akun Baru</h1>
          <p className="text-sm text-ink-muted text-center mb-6">
            {step === 1 ? 'Informasi usaha laundry' : 'Buat akun login Anda'}
          </p>

          {/* Progress */}
          <div className="flex items-center gap-2 mb-6">
            <div className={`h-1.5 flex-1 rounded-full transition-colors ${step >= 1 ? 'bg-brand' : 'bg-border-subtle'}`} />
            <div className={`h-1.5 flex-1 rounded-full transition-colors ${step >= 2 ? 'bg-brand' : 'bg-border-subtle'}`} />
          </div>

          {error && (
            <div className="bg-red-50 text-status-alert text-xs p-3 rounded-lg border border-red-200 mb-4">{error}</div>
          )}

          {step === 1 ? (
            <form onSubmit={handleStep1} className="space-y-4">
              <Input
                label="Nama Usaha *"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Contoh: Laundry Bersih"
                required
              />
              <Input
                label="Alamat"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Alamat usaha"
              />
              <Button type="submit" className="w-full">
                Lanjut
              </Button>
            </form>
          ) : (
            <form onSubmit={handleStep2} className="space-y-4">
              <Input
                label="Nama Lengkap *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama pemilik/akun"
                required
              />
              <Input
                label="Nomor Telepon *"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="08123456789"
                required
              />
              <Input
                label="Password *"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 karakter"
                required
                minLength={8}
              />
              <div className="flex gap-3">
                <Button type="button" variant="secondary" className="flex-1" onClick={() => setStep(1)}>
                  Kembali
                </Button>
                <Button type="submit" className="flex-1" loading={loading}>
                  Daftar
                </Button>
              </div>
            </form>
          )}

          <p className="text-center text-sm text-ink-muted mt-6">
            Sudah punya akun?{' '}
            <Link href="/login" className="text-brand hover:text-brand-hover font-medium">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
