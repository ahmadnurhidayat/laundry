import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { NewOrderForm } from '@/features/orders/components/NewOrderForm';

export default function NewOrderPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/orders"
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Kembali ke Pesanan
      </Link>
      <h1 className="text-2xl font-bold text-gray-900">Buat Pesanan Baru</h1>
      <NewOrderForm />
    </div>
  );
}
