import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Phone, Package, Clock, CheckCircle } from 'lucide-react';

interface TrackingViewProps {
  order: {
    id: string;
    status: string;
    paymentStatus: string;
    totalAmount: number;
    trackingToken: string;
    createdAt: string;
    dueDate: string | null;
    notes: string | null;
  };
  customer: {
    name: string;
    phone: string;
  };
  items: {
    quantity: number;
    subtotal: number;
    serviceName?: string;
    serviceType?: string;
  }[];
  tenant?: {
    name: string;
    phone: string;
  };
}

const STATUS_STEPS = [
  { key: 'pending', label: 'Diterima', icon: Package },
  { key: 'processing', label: 'Dicuci', icon: Clock },
  { key: 'ready', label: 'Siap Diambil', icon: CheckCircle },
  { key: 'picked_up', label: 'Diambil', icon: CheckCircle },
];

export function TrackingView({ order, customer, items, tenant }: TrackingViewProps) {
  const currentStepIndex = STATUS_STEPS.findIndex((s) => s.key === order.status);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-6">
        <div className="max-w-lg mx-auto text-center">
          {tenant && (
            <>
              <h1 className="text-xl font-bold text-gray-900">{tenant.name}</h1>
              {tenant.phone && (
                <a href={`tel:${tenant.phone}`} className="inline-flex items-center gap-1 text-sm text-gray-500 mt-1">
                  <Phone className="w-3 h-3" /> {tenant.phone}
                </a>
              )}
            </>
          )}
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4 space-y-4">
        {/* Order Status */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Status Pesanan</h2>
              <Badge variant={order.status === 'picked_up' ? 'success' : 'info'}>
                {STATUS_STEPS[currentStepIndex]?.label || order.status}
              </Badge>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center gap-1 mb-4">
              {STATUS_STEPS.map((step, i) => {
                const Icon = step.icon;
                const isActive = i <= currentStepIndex;
                return (
                  <div key={step.key} className="flex-1 flex flex-col items-center gap-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isActive ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className={`text-xs ${isActive ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Order Info */}
            <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Pesanan</span>
                <span className="font-medium">{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tanggal Masuk</span>
                <span>{formatDate(order.createdAt)}</span>
              </div>
              {order.dueDate && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Jadwal Selesai</span>
                  <span>{formatDate(order.dueDate)}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Customer Info */}
        <Card>
          <CardContent className="p-4">
            <h2 className="font-semibold text-gray-900 mb-3">Penerima</h2>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-medium text-sm">
                  {customer.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{customer.name}</p>
                <a href={`tel:${customer.phone}`} className="flex items-center gap-1 text-sm text-gray-500">
                  <Phone className="w-3 h-3" /> {customer.phone}
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Items */}
        <Card>
          <CardContent className="p-4">
            <h2 className="font-semibold text-gray-900 mb-3">Detail Layanan</h2>
            <div className="space-y-2">
              {items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <div>
                    <p className="font-medium text-gray-900">{item.serviceName}</p>
                    <p className="text-gray-500">{item.quantity} item</p>
                  </div>
                  <span className="font-medium">{formatCurrency(item.subtotal)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 mt-3 pt-3 flex justify-between">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="font-bold text-gray-900">{formatCurrency(order.totalAmount)}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-500">Pembayaran</span>
              <Badge variant={order.paymentStatus === 'paid' ? 'success' : 'warning'}>
                {order.paymentStatus === 'paid' ? 'Lunas' : 'Belum Bayar'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 py-4">
          Lacak pesanan Anda secara real-time
        </p>
      </div>
    </div>
  );
}
