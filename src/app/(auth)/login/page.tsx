'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      });

      const data = await res.json() as { error?: string };

      if (!res.ok) {
        setError(data.error || 'Login gagal');
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
          <h1 className="text-lg font-semibold text-ink text-center mb-1">Masuk ke Dashboard</h1>
          <p className="text-sm text-ink-muted text-center mb-6">Kelola pesanan laundry Anda</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-status-alert text-xs p-3 rounded-lg border border-red-200">{error}</div>
            )}

            <Input
              label="Nomor Telepon"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="08123456789"
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 karakter"
              required
            />

            <Button type="submit" className="w-full" loading={loading}>
              Masuk
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
