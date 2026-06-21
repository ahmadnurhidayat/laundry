'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Building2, MapPin, User, Phone, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, CheckCircle, Zap } from 'lucide-react';

type Step = 1 | 2;

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
            Mulai Kelola Laundry<br />
            <span className="text-white/80">Sekarang juga</span>
          </h1>
          
          <p className="text-lg text-white/80 mb-8 max-w-md">
            Daftar gratis dan mulai kelola bisnis laundry Anda dalam 30 detik. Tanpa kartu kredit.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-white" />
              <span className="text-white/90">Setup dalam 30 detik</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-white" />
              <span className="text-white/90">Tanpa kartu kredit</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-white" />
              <span className="text-white/90">Support 24/7</span>
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
            <h1 className="text-2xl sm:text-3xl font-bold text-[#333333] mb-2">Daftar Akun Baru</h1>
            <p className="text-[#6C6C6C]">
              {step === 1 ? 'Informasi usaha laundry' : 'Buat akun login Anda'}
            </p>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step >= 1 ? 'bg-[#1286E1] text-white' : 'bg-[#E1E3E3] text-[#6C6C6C]'
              }`}>
                1
              </div>
              <span className={`text-sm font-medium hidden sm:block ${step >= 1 ? 'text-[#1286E1]' : 'text-[#6C6C6C]'}`}>
                Usaha
              </span>
            </div>
            <div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-[#1286E1]' : 'bg-[#E1E3E3]'}`} />
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step >= 2 ? 'bg-[#1286E1] text-white' : 'bg-[#E1E3E3] text-[#6C6C6C]'
              }`}>
                2
              </div>
              <span className={`text-sm font-medium hidden sm:block ${step >= 2 ? 'text-[#1286E1]' : 'text-[#6C6C6C]'}`}>
                Akun
              </span>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl border border-red-200 flex items-center gap-3 mb-6">
              <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-red-600 text-xs font-bold">!</span>
              </div>
              {error}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleStep1} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#333333] mb-2">Nama Usaha *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-[#909090]" />
                  </div>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Contoh: Laundry Bersih"
                    required
                    className="w-full h-12 pl-12 pr-4 text-[#333333] bg-[#FAFAFA] border border-[#E1E3E3] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1286E1]/20 focus:border-[#1286E1] transition-all placeholder:text-[#909090]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#333333] mb-2">Alamat (opsional)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-[#909090]" />
                  </div>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Alamat usaha"
                    className="w-full h-12 pl-12 pr-4 text-[#333333] bg-[#FAFAFA] border border-[#E1E3E3] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1286E1]/20 focus:border-[#1286E1] transition-all placeholder:text-[#909090]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-12 bg-[#1286E1] hover:bg-[#0E65A9] text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                Lanjut
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleStep2} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#333333] mb-2">Nama Lengkap *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-[#909090]" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama pemilik/akun"
                    required
                    className="w-full h-12 pl-12 pr-4 text-[#333333] bg-[#FAFAFA] border border-[#E1E3E3] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1286E1]/20 focus:border-[#1286E1] transition-all placeholder:text-[#909090]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#333333] mb-2">Nomor Telepon *</label>
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
                <label className="block text-sm font-medium text-[#333333] mb-2">Password *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-[#909090]" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 8 karakter"
                    required
                    minLength={8}
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

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 h-12 bg-[#F2F2F2] hover:bg-[#E1E3E3] text-[#333333] font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Kembali
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 h-12 bg-[#1286E1] hover:bg-[#0E65A9] text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Daftar
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          <div className="mt-8 text-center">
            <p className="text-sm text-[#6C6C6C]">
              Sudah punya akun?{' '}
              <Link href="/login" className="text-[#1286E1] hover:text-[#0E65A9] font-semibold transition-colors">
                Login
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
