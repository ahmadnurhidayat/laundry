import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4">
        <div className="text-2xl font-bold text-blue-600">Daya Laundry</div>
        <div className="flex gap-3">
          <Link href="/login" className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg">Login</Link>
          <Link href="/register" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg">Daftar Sekarang</Link>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Kelola Laundry B2B<br />
            <span className="text-blue-600">Lebih Mudah & Cepat</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Platform SaaS untuk pengelolaan laundry. Pantau pesanan, kelola pembayaran, dan berikan pengalaman terbaik untuk pelanggan Anda.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register" className="px-8 py-3 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg">
              Mulai Gratis
            </Link>
            <Link href="/track/TRACKING_TOKEN" className="px-8 py-3 text-lg font-semibold text-blue-600 border border-blue-600 hover:bg-blue-50 rounded-lg">
              Cek Status Pesanan
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white p-8 rounded-2xl shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Manajemen Pesanan</h3>
            <p className="text-gray-600">Buat, pantau, dan selesaikan pesanan dengan mudah. Status real-time untuk Anda dan pelanggan.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Pembayaran</h3>
            <p className="text-gray-600">Catat dan lacak status pembayaran. Rekap otomatis untuk laporan keuangan.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Tracking Pelanggan</h3>
            <p className="text-gray-600">Pelanggan bisa cek status pesanan langsung tanpa login. Link tracking unik per pesanan.</p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-blue-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Siap Mengelola Laundry?</h2>
          <p className="text-blue-100 mb-6">Daftar gratis sekarang dan mulai kelola dalam hitungan menit.</p>
          <Link href="/register" className="inline-block px-8 py-3 text-lg font-semibold text-blue-600 bg-white hover:bg-blue-50 rounded-lg">
            Daftar Sekarang
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-500 text-sm">
        &copy; 2026 Daya Laundry SaaS. All rights reserved.
      </footer>
    </div>
  );
}
