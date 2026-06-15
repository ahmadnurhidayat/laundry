import Link from 'next/link';
import { ArrowRight, BarChart3, Users, Receipt, Smartphone } from 'lucide-react';

const features = [
  {
    icon: Receipt,
    title: 'Manajemen Pesanan',
    desc: 'Buat dan pantau pesanan dengan mudah. Status real-time untuk Anda dan pelanggan.',
  },
  {
    icon: BarChart3,
    title: 'Dashboard Analitik',
    desc: 'Pantau performa bisnis Anda dengan grafik pendapatan dan statistik harian.',
  },
  {
    icon: Users,
    title: 'Database Pelanggan',
    desc: 'Kelola data pelanggan, riwayat pesanan, dan hubungi mereka langsung.',
  },
  {
    icon: Smartphone,
    title: 'Tracking Pelanggan',
    desc: 'Pelanggan bisa cek status pesanan tanpa login melalui link unik.',
  },
];

const stats = [
  { value: '2,500+', label: 'Laundry Aktif' },
  { value: '1M+', label: 'Pesanan Diproses' },
  { value: '99.9%', label: 'Uptime' },
  { value: '4.9/5', label: 'Rating Pengguna' },
];

export default function LandingPage() {
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
              className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
            >
              Daftar Gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 lg:py-28">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Kelola Laundry <span className="text-blue-600">Lebih Mudah</span> & Cepat
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
            Platform SaaS all-in-one untuk pengelolaan laundry. Pantau pesanan, kelola pembayaran, dan berikan pengalaman terbaik untuk pelanggan Anda.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Mulai Gratis
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Lihat Demo
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Fitur Lengkap untuk Laundry Anda</h2>
            <p className="mt-4 text-gray-600">
              Semua yang Anda butuhkan untuk mengelola laundry dalam satu platform.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="bg-white p-6 rounded-2xl border border-gray-100">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-white">Siap Mengelola Laundry?</h2>
          <p className="mt-4 text-blue-100">
            Hubungi kami untuk informasi lebih lanjut atau mulai gunakan layanan ini.
          </p>
          <a
            href="https://wa.me/6285643858412?text=Halo,%20saya%20tertarik%20dengan%20Laundry%20SaaS"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center px-6 py-3 text-base font-medium text-blue-600 bg-white rounded-lg hover:bg-blue-50 transition-colors"
          >
            Hubungi Kami
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center text-sm text-gray-500">
          &copy; 2026 Laundry SaaS. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
