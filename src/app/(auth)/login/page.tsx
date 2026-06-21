'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Phone, Lock, Eye, EyeOff, ArrowRight, Zap, CheckCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Branding (Desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1286E1] to-[#0E65A9] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full mix-blend-overlay filter blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full mix-blend-overlay filter blur-3xl" />
        </div>
        
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16">
          <Link href="/" className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <span className="text-[#1286E1] font-bold text-xl">L</span>
            </div>
            <span className="font-bold text-white text-2xl">Laundry</span>
          </Link>

          <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
            Kelola Laundry<br />
            <span className="text-white/80">Lebih Mudah</span>
          </h1>
          
          <p className="text-lg text-white/80 mb-8 max-w-md">
            Sistem operasional laundry No. 1 di Indonesia. Pantau pesanan, kelola pembayaran, dan berikan pengalaman terbaik untuk pelanggan Anda.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-white" />
              <span className="text-white/90">Gratis selamanya untuk paket Starter</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-white" />
              <span className="text-white/90">Setup dalam 30 detik</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-white" />
              <span className="text-white/90">Tanpa kartu kredit</span>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/20">
            <p className="text-white/60 text-sm mb-4">Dipercaya oleh 2,500+ laundry di Indonesia</p>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-white/20 border-2 border-[#1286E1] flex items-center justify-center">
                    <span className="text-white text-xs font-medium">{String.fromCharCode(64 + i)}</span>
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <span className="text-white font-semibold">4.9/5</span>
                <span className="text-white/60 ml-1">rating pengguna</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex items-center justify-center mb-8 lg:hidden">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-[#1286E1] rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className="font-bold text-[#333333] text-xl">Laundry</span>
            </Link>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#333333] mb-2">Masuk ke Dashboard</h1>
            <p className="text-[#6C6C6C]">Kelola pesanan laundry Anda</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl border border-red-200 flex items-center gap-3">
                <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-red-600 text-xs font-bold">!</span>
                </div>
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">Nomor Telepon</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-[#909090]" />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="08123456789"
                  required
                  className="w-full h-12 pl-12 pr-4 text-[#333333] bg-[#FAFAFA] border border-[#E1E3E3] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1286E1]/20 focus:border-[#1286E1] transition-all placeholder:text-[#909090]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[#909090]" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  required
                  className="w-full h-12 pl-12 pr-12 text-[#333333] bg-[#FAFAFA] border border-[#E1E3E3] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1286E1]/20 focus:border-[#1286E1] transition-all placeholder:text-[#909090]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#909090] hover:text-[#6C6C6C] transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-[#E1E3E3] text-[#1286E1] focus:ring-[#1286E1]/20" />
                <span className="text-sm text-[#6C6C6C]">Ingat saya</span>
              </label>
              <a href="#" className="text-sm text-[#1286E1] hover:text-[#0E65A9] font-medium transition-colors">
                Lupa password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#1286E1] hover:bg-[#0E65A9] text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Masuk
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-[#6C6C6C]">
              Belum punya akun?{' '}
              <Link href="/register" className="text-[#1286E1] hover:text-[#0E65A9] font-semibold transition-colors">
                Daftar Gratis
              </Link>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-[#E1E3E3]">
            <div className="flex items-center justify-center gap-2 text-[#909090]">
              <Zap className="h-4 w-4" />
              <span className="text-xs">Gratis selamanya untuk paket Starter</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
