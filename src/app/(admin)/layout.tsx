'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const navItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/orders/new', label: 'Pesanan Baru' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">DL</span>
              </div>
              <span className="font-bold text-gray-900">Daya Laundry</span>
            </Link>
            <nav className="flex items-center gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm ${
                    pathname === item.href
                      ? 'text-blue-600 font-medium'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="text-sm text-gray-500 hover:text-red-600 ml-4"
              >
                {loggingOut ? 'Logout...' : 'Logout'}
              </button>
            </nav>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
