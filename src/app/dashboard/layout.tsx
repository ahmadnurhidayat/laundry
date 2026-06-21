'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Plus,
  Package,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Beranda', icon: LayoutDashboard },
  { href: '/dashboard/orders', label: 'Pesanan', icon: ShoppingCart },
  { href: '/dashboard/customers', label: 'Pelanggan', icon: Users },
  { href: '/dashboard/services', label: 'Layanan', icon: Package },
  { href: '/dashboard/settings', label: 'Pengaturan', icon: Settings },
];

const mobileNavItems = [
  { href: '/dashboard', label: 'Beranda', icon: LayoutDashboard },
  { href: '/dashboard/orders', label: 'Pesanan', icon: ShoppingCart },
  { href: '/dashboard/customers', label: 'Pelanggan', icon: Users },
  { href: '/dashboard/services', label: 'Layanan', icon: Package },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <div className="min-h-screen bg-canvas">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-40 h-screen bg-canvas-elevated border-r border-border-subtle transition-all duration-300 hidden lg:flex lg:flex-col',
          collapsed ? 'w-[68px]' : 'w-60'
        )}
      >
        {/* Logo */}
        <div className={cn('flex items-center h-16 border-b border-border-subtle', collapsed ? 'justify-center px-2' : 'px-5')}>
          {!collapsed && (
            <Link href="/dashboard" className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <span className="font-semibold text-ink text-sm">Laundry</span>
            </Link>
          )}
          {collapsed && (
            <Link href="/dashboard" className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </Link>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                  active
                    ? 'bg-brand-subtle text-brand'
                    : 'text-ink-muted hover:bg-canvas hover:text-ink',
                  collapsed && 'justify-center px-2'
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={cn('h-5 w-5 shrink-0', active ? 'text-brand' : 'text-ink-muted')} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Collapse Toggle + Logout */}
        <div className="border-t border-border-subtle p-3 space-y-1">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              'flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-ink-muted hover:bg-canvas hover:text-ink transition-colors',
              collapsed && 'justify-center px-2'
            )}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            {!collapsed && <span>Tutup Sidebar</span>}
          </button>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className={cn(
              'flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-status-alert hover:bg-red-50 transition-colors',
              collapsed && 'justify-center px-2'
            )}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{loggingOut ? 'Logout...' : 'Logout'}</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={cn('transition-all duration-300', collapsed ? 'lg:ml-[68px]' : 'lg:ml-60')}>
        {/* Top bar (mobile) */}
        <header className="sticky top-0 z-30 bg-canvas-elevated border-b border-border-subtle h-14 flex items-center justify-between px-4 lg:hidden">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-brand rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">L</span>
            </div>
            <span className="font-semibold text-ink text-sm">Laundry</span>
          </Link>
        </header>

        {/* Page content */}
        <main className="p-4 md:p-6 lg:p-8 pb-24 lg:pb-8">{children}</main>
      </div>

      {/* Mobile FAB - New Order */}
      <Link
        href="/dashboard/orders/new"
        className="fixed bottom-20 right-4 z-50 lg:hidden h-12 w-12 bg-brand rounded-full flex items-center justify-center shadow-premium-md hover:bg-brand-hover active:scale-95 transition-all"
      >
        <Plus className="h-5 w-5 text-white" />
      </Link>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-canvas-elevated border-t border-border-subtle lg:hidden">
        <div className="grid grid-cols-5 h-16">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors',
                  active ? 'text-brand' : 'text-ink-muted hover:text-ink'
                )}
              >
                <Icon className={cn('h-5 w-5', active && 'text-brand')} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
