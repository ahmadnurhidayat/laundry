import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { NewOrderForm } from '@/components/orders/new-order-form';

export default function NewOrderPage() {
  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <Link href="/dashboard" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Dashboard
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Order</h1>
      <NewOrderForm />
    </div>
  );
}
