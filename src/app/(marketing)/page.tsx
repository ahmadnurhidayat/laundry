import Link from 'next/link';
import { Check, ArrowRight, BarChart3, Users, Receipt, Smartphone } from 'lucide-react';

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

const pricingPlans = [
  {
    name: 'Starter',
    price: 'Gratis',
    period: 'Selamanya',
    desc: 'Cocok untuk laundry kecil yang baru memulai',
    features: [
      '1 pengguna',
      '50 pesanan/bulan',
      'Dashboard dasar',
      'Tracking pelanggan',
    ],
    cta: 'Mulai Gratis',
    popular: false,
  },
  {
    name: 'Growth',
    price: 'Rp 99K',
    period: '/bulan',
    desc: 'Untuk laundry yang berkembang pesat',
    features: [
      '5 pengguna',
      'Unlimited pesanan',
      'Analitik lanjutan',
      'Laporan keuangan',
      'Multi-cabang',
      'Prioritas support',
    ],
    cta: 'Upgrade ke Growth',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Rp 299K',
    period: '/bulan',
    desc: 'Solusi lengkap untuk jaringan laundry',
    features: [
      'Unlimited pengguna',
      'Unlimited pesanan',
      'White-label branding',
      'API akses',
      'Dedicated support',
      'Custom integrasi',
    ],
    cta: 'Hubungi Sales',
    popular: false,
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

      {/* Pricing */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Harga yang Transparan</h2>
            <p className="mt-4 text-gray-600">
              Pilih paket yang sesuai dengan kebutuhan bisnis Anda.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border-2 p-8 ${
                  plan.popular
                    ? 'border-blue-600 shadow-lg shadow-blue-500/10'
                    : 'border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                    Paling Populer
                  </div>
                )}
                <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{plan.desc}</p>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-sm text-gray-500">{plan.period}</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm text-gray-600">
                      <Check className="h-4 w-4 text-green-500 mr-2 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={`mt-8 block w-full text-center py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-white">Siap Mengelola Laundry?</h2>
          <p className="mt-4 text-blue-100">
            Daftar gratis sekarang dan mulai kelola dalam hitungan menit.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-flex items-center px-6 py-3 text-base font-medium text-blue-600 bg-white rounded-lg hover:bg-blue-50 transition-colors"
          >
            Daftar Sekarang
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
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
