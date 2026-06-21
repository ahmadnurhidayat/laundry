'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowRight, BarChart3, Users, Receipt, Smartphone, Zap, Clock, Star, ChevronDown, MessageSquare, TrendingUp, Check, Shield, Headphones } from 'lucide-react';

const businessTypes = [
  'Laundry Kiloan',
  'Laundry Satuan',
  'Dry Cleaning',
  'Laundry Sepatu',
  'Laundry Sprei',
  'Laundry Besar',
];

const features = [
  {
    icon: Receipt,
    title: 'Manajemen Pesanan',
    desc: 'Buat dan pantau pesanan dengan mudah. Status real-time untuk Anda dan pelanggan.',
    image: '/features/orders.png',
  },
  {
    icon: BarChart3,
    title: 'Dashboard Analitik',
    desc: 'Pantau performa bisnis dengan grafik pendapatan dan statistik harian.',
    image: '/features/dashboard.png',
  },
  {
    icon: Users,
    title: 'Database Pelanggan',
    desc: 'Kelola data pelanggan, riwayat pesanan, dan hubungi mereka langsung.',
    image: '/features/customers.png',
  },
  {
    icon: Smartphone,
    title: 'Tracking Pelanggan',
    desc: 'Pelanggan cek status pesanan tanpa login melalui link unik.',
    image: '/features/tracking.png',
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
    icon: SettingsIcon,
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

const partners = [
  'Laundry Bersih',
  'King Laundry',
  'Clean Pro',
  'Wash & Fold',
  'Fresh Clean',
  'Laundry Express',
];

function SettingsIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <p className="text-4xl font-bold text-ink">{count.toLocaleString()}{suffix}</p>
      <p className="mt-2 text-sm text-ink-muted">{label}</p>
    </div>
  );
}

function FAQ({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#E1E3E3]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left hover:text-[#1286E1] transition-colors"
      >
        <span className="font-semibold text-[#333333]">{q}</span>
        <ChevronDown className={`h-5 w-5 text-[#6C6C6C] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all ${open ? 'max-h-40' : 'max-h-0'}`}>
        <p className="pb-5 text-[#6C6C6C]">{a}</p>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activeBusinessType, setActiveBusinessType] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBusinessType((prev) => (prev + 1) % businessTypes.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-[#E1E3E3]">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 h-[70px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-[#1286E1] rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <span className="font-bold text-[#333333] text-xl">Laundry</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#fitur" className="text-sm font-medium text-[#6C6C6C] hover:text-[#1286E1] transition-colors">Fitur</a>
            <a href="#cara-kerja" className="text-sm font-medium text-[#6C6C6C] hover:text-[#1286E1] transition-colors">Cara Kerja</a>
            <a href="#testimoni" className="text-sm font-medium text-[#6C6C6C] hover:text-[#1286E1] transition-colors">Testimoni</a>
            <a href="#faq" className="text-sm font-medium text-[#6C6C6C] hover:text-[#1286E1] transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-[#6C6C6C] hover:text-[#1286E1] px-4 py-2 transition-colors">
              Login
            </Link>
            <Link
              href="/register"
              className="text-sm font-semibold text-white bg-[#1286E1] hover:bg-[#0E65A9] px-5 py-2.5 rounded-lg transition-all"
            >
              Daftar Gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#EAF5FF] to-white">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 py-16 lg:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 bg-white text-[#1286E1] text-sm font-medium px-4 py-2 rounded-full mb-6 border border-[#1286E1]/20">
                <Zap className="h-4 w-4" />
                <span>Gratis Selamanya untuk Starter</span>
              </div>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-[56px] font-bold text-[#333333] leading-[1.1]"
            >
              Sistem Operasional Laundry{' '}
              <span className="text-[#1286E1]">
                No. 1
              </span>
              <br />di Indonesia
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-lg text-[#6C6C6C] max-w-2xl mx-auto"
            >
              Aplikasi kasir, sistem ERP, hingga tracking pelanggan yang terbukti membantu ribuan laundry di Indonesia berhasil #BebasCemas.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-[#1286E1] hover:bg-[#0E65A9] rounded-lg transition-all shadow-lg shadow-[#1286E1]/25"
              >
                Jadwalkan Demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <a
                href="https://wa.me/6285643858412?text=Halo,%20saya%20mau%20demo%20Laundry%20SaaS"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-[#333333] bg-white border border-[#D9D9D9] hover:bg-[#F2F2F2] rounded-lg transition-all"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Hubungi Tim
              </a>
            </motion.div>
          </div>

          {/* Product Screenshot */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-16 relative"
          >
            <div className="relative mx-auto max-w-[900px]">
              <div className="bg-white rounded-2xl shadow-2xl border border-[#E1E3E3] overflow-hidden">
                <div className="bg-[#F2F2F2] px-4 py-3 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                  <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                </div>
                <div className="p-6 bg-[#FAFAFA]">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1 bg-white rounded-xl p-4 border border-[#E1E3E3]">
                      <div className="w-full h-8 bg-[#EAF5FF] rounded-lg mb-3" />
                      <div className="space-y-2">
                        <div className="w-full h-4 bg-[#F2F2F2] rounded" />
                        <div className="w-3/4 h-4 bg-[#F2F2F2] rounded" />
                        <div className="w-5/6 h-4 bg-[#F2F2F2] rounded" />
                      </div>
                    </div>
                    <div className="col-span-2 bg-white rounded-xl p-4 border border-[#E1E3E3]">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-[#EAF5FF] rounded-lg p-3">
                          <div className="text-2xl font-bold text-[#1286E1]">Rp 12.5M</div>
                          <div className="text-xs text-[#6C6C6C]">Pendapatan Bulan Ini</div>
                        </div>
                        <div className="bg-[#EAF5FF] rounded-lg p-3">
                          <div className="text-2xl font-bold text-[#1286E1]">156</div>
                          <div className="text-xs text-[#6C6C6C]">Pesanan Aktif</div>
                        </div>
                      </div>
                      <div className="h-32 bg-[#F2F2F2] rounded-lg" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Business Types */}
      <section className="py-12 bg-white border-b border-[#E1E3E3]">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6">
          <p className="text-center text-sm text-[#6C6C6C] mb-6">Dirancang untuk Beragam Tipe Laundry</p>
          <div className="flex flex-wrap justify-center gap-3">
            {businessTypes.map((type, i) => (
              <button
                key={type}
                onClick={() => setActiveBusinessType(i)}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all border ${
                  i === activeBusinessType
                    ? 'bg-[#EAF5FF] border-[#1286E1] text-[#1286E1]'
                    : 'bg-white border-[#D9D9D9] text-[#6C6C6C] hover:border-[#1286E1] hover:text-[#1286E1]'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-[#FAFAFA]">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCounter value={2500} suffix="+" label="Laundry Aktif" />
            <StatCounter value={1000000} suffix="+" label="Pesanan Diproses" />
            <StatCounter value={99} suffix=".9%" label="Uptime" />
            <StatCounter value={49} suffix="/50" label="Rating Pengguna" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="fitur" className="py-20 bg-white">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-medium text-[#1286E1] uppercase tracking-wider mb-3">Produk</p>
            <h2 className="text-3xl font-bold text-[#333333]">Ekosistem Terlengkap & Terintegrasi untuk Laundry</h2>
            <p className="mt-4 text-[#6C6C6C]">
              Dengan sistem laundry yang tepat, semua proses operasional bisa saling terhubung.
            </p>
          </div>
          <div className="space-y-16">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              const isEven = i % 2 === 0;
              return (
                <div key={feature.title} className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-center`}>
                  <div className="flex-1">
                    <div className="w-14 h-14 bg-[#EAF5FF] rounded-xl flex items-center justify-center mb-6">
                      <Icon className="h-7 w-7 text-[#1286E1]" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#333333] mb-4">{feature.title}</h3>
                    <p className="text-[#6C6C6C] text-lg mb-6">{feature.desc}</p>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3 text-[#484848]">
                        <Check className="h-5 w-5 text-[#1286E1]" />
                        <span>Real-time updates</span>
                      </li>
                      <li className="flex items-center gap-3 text-[#484848]">
                        <Check className="h-5 w-5 text-[#1286E1]" />
                        <span>Mudah digunakan</span>
                      </li>
                      <li className="flex items-center gap-3 text-[#484848]">
                        <Check className="h-5 w-5 text-[#1286E1]" />
                        <span>Integrasi lengkap</span>
                      </li>
                    </ul>
                  </div>
                  <div className="flex-1">
                    <div className="bg-[#FAFAFA] rounded-2xl border border-[#E1E3E3] p-8">
                      <div className="bg-white rounded-xl shadow-lg border border-[#E1E3E3] p-6">
                        <div className="w-full h-48 bg-gradient-to-br from-[#EAF5FF] to-[#F2F2F2] rounded-lg flex items-center justify-center">
                          <Icon className="h-16 w-16 text-[#1286E1]/30" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="cara-kerja" className="py-20 bg-[#FAFAFA]">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-medium text-[#1286E1] uppercase tracking-wider mb-3">Cara Kerja</p>
            <h2 className="text-3xl font-bold text-[#333333]">3 Langkah Sederhana</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.num} className="relative text-center">
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-[#1286E1]/20 to-transparent" />
                  )}
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-2xl border border-[#E1E3E3] mb-6 relative z-10 shadow-sm">
                    <Icon className="h-10 w-10 text-[#1286E1]" />
                  </div>
                  <p className="text-sm font-bold text-[#1286E1] mb-2">{step.num}</p>
                  <h3 className="text-xl font-bold text-[#333333] mb-2">{step.title}</h3>
                  <p className="text-[#6C6C6C]">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-16 bg-white border-y border-[#E1E3E3]">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6">
          <p className="text-center text-sm text-[#6C6C6C] mb-8">Brand Laundry yang Menggunakan Laundry</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {partners.map((partner) => (
              <div key={partner} className="text-lg font-bold text-[#D9D9D9] hover:text-[#6C6C6C] transition-colors cursor-pointer">
                {partner}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimoni" className="py-20 bg-[#FAFAFA]">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-medium text-[#1286E1] uppercase tracking-wider mb-3">Testimoni</p>
            <h2 className="text-3xl font-bold text-[#333333]">Dipercaya Ribuan Laundry</h2>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="bg-white p-8 rounded-2xl relative border border-[#E1E3E3] shadow-sm">
              <div className="absolute -top-4 left-8 bg-[#1286E1] text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                <Star className="h-4 w-4 fill-current" />
                Testimoni
              </div>
              <div className="min-h-[140px] pt-4">
                <p className="text-lg text-[#333333] mb-6">&ldquo;{testimonials[activeTestimonial].content}&rdquo;</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#EAF5FF] rounded-full flex items-center justify-center">
                    <span className="text-[#1286E1] font-bold">{testimonials[activeTestimonial].name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-[#333333]">{testimonials[activeTestimonial].name}</p>
                    <p className="text-sm text-[#6C6C6C]">{testimonials[activeTestimonial].role}</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-3 mt-8">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTestimonial(i)}
                    className={`w-3 h-3 rounded-full transition-all ${i === activeTestimonial ? 'bg-[#1286E1] w-8' : 'bg-[#D9D9D9]'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-medium text-[#1286E1] uppercase tracking-wider mb-3">Keunggulan</p>
            <h2 className="text-3xl font-bold text-[#333333]">Kenapa Harus Memilih Laundry?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#FAFAFA] p-8 rounded-2xl border border-[#E1E3E3] text-center">
              <div className="w-16 h-16 bg-[#EAF5FF] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-[#1286E1]" />
              </div>
              <h3 className="text-xl font-bold text-[#333333] mb-3">Aman & Terpercaya</h3>
              <p className="text-[#6C6C6C]">Data terenkripsi dan tersimpan di Cloudflare global network.</p>
            </div>
            <div className="bg-[#FAFAFA] p-8 rounded-2xl border border-[#E1E3E3] text-center">
              <div className="w-16 h-16 bg-[#EAF5FF] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="h-8 w-8 text-[#1286E1]" />
              </div>
              <h3 className="text-xl font-bold text-[#333333] mb-3">Cepat & Mudah</h3>
              <p className="text-[#6C6C6C]">Setup dalam 30 detik. Tanpa install aplikasi.</p>
            </div>
            <div className="bg-[#FAFAFA] p-8 rounded-2xl border border-[#E1E3E3] text-center">
              <div className="w-16 h-16 bg-[#EAF5FF] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Headphones className="h-8 w-8 text-[#1286E1]" />
              </div>
              <h3 className="text-xl font-bold text-[#333333] mb-3">Support 24/7</h3>
              <p className="text-[#6C6C6C]">Tim support siap membantu kapan saja.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-[#FAFAFA]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-[#1286E1] uppercase tracking-wider mb-3">FAQ</p>
            <h2 className="text-3xl font-bold text-[#333333]">Pertanyaan Umum</h2>
          </div>
          <div className="bg-white rounded-2xl border border-[#E1E3E3] p-6 shadow-sm">
            {faqs.map((faq, i) => (
              <FAQ key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-[#1286E1] py-20">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full mix-blend-overlay filter blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/10 rounded-full mix-blend-overlay filter blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Sekarang saatnya #BebasCemas kelola bisnis laundry!</h2>
          <p className="mt-4 text-white/80 text-lg">
            Hubungi kami untuk informasi lebih lanjut atau mulai gunakan layanan ini.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/6285643858412?text=Halo,%20saya%20tertarik%20dengan%20Laundry%20SaaS"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-[#1286E1] bg-white rounded-lg hover:bg-[#F2F2F2] transition-all shadow-lg"
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Hubungi Tim
            </a>
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white border-2 border-white/30 rounded-lg hover:bg-white/10 transition-all"
            >
              Jadwalkan Demo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#333333] py-12">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-10 h-10 bg-[#1286E1] rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">L</span>
                </div>
                <span className="font-bold text-white text-xl">Laundry</span>
              </div>
              <p className="text-white/60 text-sm">Sistem operasional laundry No. 1 di Indonesia.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Produk</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><a href="#" className="hover:text-white transition-colors">Laundry POS</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Laundry Core</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Laundry Order</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tracking</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Informasi</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><a href="#" className="hover:text-white transition-colors">Artikel</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Testimoni</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tentang Kami</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Karir</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Kontak</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li>WhatsApp: 085643858412</li>
                <li>Email: hello@laundry.id</li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms & Conditions</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center">
            <p className="text-sm text-white/40">&copy; 2026 Laundry SaaS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
