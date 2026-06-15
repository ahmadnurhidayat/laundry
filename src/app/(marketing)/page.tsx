'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, BarChart3, Users, Receipt, Smartphone, Check, Zap, Clock, Star, ChevronDown, MessageSquare, Shield, TrendingUp } from 'lucide-react';

const features = [
  {
    icon: Receipt,
    title: 'Manajemen Pesanan',
    desc: 'Buat dan pantau pesanan dengan mudah. Status real-time untuk Anda dan pelanggan.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: BarChart3,
    title: 'Dashboard Analitik',
    desc: 'Pantau performa bisnis dengan grafik pendapatan dan statistik harian.',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: Users,
    title: 'Database Pelanggan',
    desc: 'Kelola data pelanggan, riwayat pesanan, dan hubungi mereka langsung.',
    color: 'bg-green-50 text-green-600',
  },
  {
    icon: Smartphone,
    title: 'Tracking Pelanggan',
    desc: 'Pelanggan cek status pesanan tanpa login melalui link unik.',
    color: 'bg-orange-50 text-orange-600',
  },
];

const steps = [
  {
    num: '01',
    title: 'Daftar Akun',
    desc: 'Buat akun gratis dalam 30 detik. Tanpa kartu kredit.',
    icon: Zap,
  },
  {
    num: '02',
    title: 'Atur Laundry',
    desc: 'Tambah layanan, harga, dan preferensi bisnis Anda.',
    icon: Settings,
  },
  {
    num: '03',
    title: 'Mulai Operasi',
    desc: 'Buat pesanan, pantau status, dan kelola pembayaran.',
    icon: TrendingUp,
  },
];

const testimonials = [
  {
    name: 'Budi Santoso',
    role: 'Owner, Laundry Bersih',
    content: 'Sejak pakai Laundry, omzet naik 40% karena pelanggan bisa tracking sendiri. Admin juga lebih mudah.',
    rating: 5,
  },
  {
    name: 'Siti Rahayu',
    role: 'Manager, King Laundry',
    content: 'Dashboard analitiknya luar biasa. Saya bisa lihat jam sibuk dan atur staf dengan lebih efisien.',
    rating: 5,
  },
  {
    name: 'Andi Wijaya',
    role: 'Owner, Clean Pro',
    content: 'Multi-cabang jadi gampang. Semua data terpusat dan real-time. Recommended banget!',
    rating: 5,
  },
];

const faqs = [
  {
    q: 'Berapa biaya untuk mulai?',
    a: 'Gratis selamanya untuk paket Starter. Tidak perlu kartu kredit.',
  },
  {
    q: 'Apakah bisa digunakan di HP?',
    a: 'Ya! Laundry dirancang mobile-first. Akses dari browser HP tanpa install aplikasi.',
  },
  {
    q: 'Bagaimana dengan keamanan data?',
    a: 'Data dienkripsi dan tersimpan di Cloudflare global network. Uptime 99.9%.',
  },
  {
    q: 'Bisa integrasi dengan sistem lain?',
    a: 'Saat ini fokus sebagai standalone SaaS. API akses tersedia di paket Enterprise.',
  },
];

function Settings(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function useCountUp(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [started, end, duration]);

  return { count, ref };
}

function StatCounter({ value, label, suffix = '' }: { value: number; label: string; suffix?: string }) {
  const { count, ref } = useCountUp(value);
  return (
    <div ref={ref} className="text-center">
      <p className="text-4xl font-bold text-gray-900">{count.toLocaleString()}{suffix}</p>
      <p className="mt-1 text-sm text-gray-500">{label}</p>
    </div>
  );
}

function FAQ({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left hover:text-blue-600 transition-colors"
      >
        <span className="font-medium text-gray-900">{q}</span>
        <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all ${open ? 'max-h-40' : 'max-h-0'}`}>
        <p className="pb-4 text-gray-600">{a}</p>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="font-bold text-gray-900">Laundry</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2">
              Login
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-all active:scale-[0.98]"
            >
              Daftar Gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }} />
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 lg:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 text-sm font-medium px-4 py-2 rounded-full mb-6">
              <Zap className="h-4 w-4" />
              <span>Gratis Selamanya untuk Starter</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Kelola Laundry{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Lebih Mudah
              </span>
              <br />& Cepat
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
              Platform SaaS all-in-one untuk pengelolaan laundry. Pantau pesanan, kelola pembayaran, dan berikan pengalaman terbaik untuk pelanggan Anda.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all active:scale-[0.98] shadow-lg shadow-blue-600/25"
              >
                Mulai Gratis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <a
                href="https://wa.me/6285643858412?text=Halo,%20saya%20mau%20demo%20Laundry%20SaaS"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-all active:scale-[0.98]"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Chat Demo
              </a>
            </div>
            <p className="mt-4 text-sm text-gray-500">Tanpa kartu kredit. Setup 30 detik.</p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-gray-100 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCounter value={2500} suffix="+" label="Laundry Aktif" />
            <StatCounter value={1000000} suffix="+" label="Pesanan Diproses" />
            <StatCounter value={99} suffix=".9%" label="Uptime" />
            <StatCounter value={49} suffix="/50" label="Rating Pengguna" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Fitur Lengkap untuk Laundry Anda</h2>
            <p className="mt-4 text-gray-600">
              Semua yang Anda butuhkan untuk mengelola laundry dalam satu platform.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group relative bg-white p-8 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                  <ArrowRight className="absolute right-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Cara Kerja</h2>
            <p className="mt-4 text-gray-600">
              Mulai kelola laundry dalam 3 langkah sederhana.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.num} className="relative text-center">
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-blue-200 to-transparent" />
                  )}
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 relative z-10">
                    <Icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <p className="text-sm font-bold text-blue-600 mb-2">{step.num}</p>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Dipercaya Ribuan Laundry</h2>
            <p className="mt-4 text-gray-600">
              Lihat apa kata pengguna kami.
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative">
              <div className="absolute -top-4 left-8 bg-yellow-400 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                <Star className="h-4 w-4 fill-current" />
                Testimoni
              </div>
              <div className="min-h-[120px]">
                <p className="text-lg text-gray-700 mb-6">&ldquo;{testimonials[activeTestimonial].content}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium">{testimonials[activeTestimonial].name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{testimonials[activeTestimonial].name}</p>
                    <p className="text-sm text-gray-500">{testimonials[activeTestimonial].role}</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-2 mt-6">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTestimonial(i)}
                    className={`w-2 h-2 rounded-full transition-all ${i === activeTestimonial ? 'bg-blue-600 w-6' : 'bg-gray-300'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Pertanyaan Umum</h2>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            {faqs.map((faq, i) => (
              <FAQ key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-purple-600 py-20">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full mix-blend-overlay filter blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/10 rounded-full mix-blend-overlay filter blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Siap Mengelola Laundry?</h2>
          <p className="mt-4 text-blue-100 text-lg">
            Hubungi kami untuk informasi lebih lanjut atau mulai gunakan layanan ini.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/6285643858412?text=Halo,%20saya%20tertarik%20dengan%20Laundry%20SaaS"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-blue-600 bg-white rounded-lg hover:bg-blue-50 transition-all active:scale-[0.98] shadow-lg"
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Hubungi Kami
            </a>
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white border-2 border-white/30 rounded-lg hover:bg-white/10 transition-all active:scale-[0.98]"
            >
              Daftar Gratis
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <span className="font-bold text-gray-900">Laundry</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-gray-900 transition-colors">Kebijakan Privasi</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Syarat & Ketentuan</a>
              <a href="https://wa.me/6285643858412" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">Kontak</a>
            </div>
            <p className="text-sm text-gray-500">&copy; 2026 Laundry SaaS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
