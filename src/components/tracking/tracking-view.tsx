'use client';

import { Clock, CheckCircle, Package, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { formatCurrency, formatDate } from '@/lib/utils';

interface TrackingViewProps {
  order: any;
  customer: any;
  items: any[];
  tenant?: {
    name: string;
    phone?: string | null;
  };
}

const statusSteps = [
  { key: 'PENDING', label: 'Diterima', icon: Clock },
  { key: 'PROCESSING', label: 'Dicuci', icon: Loader2 },
  { key: 'FINISHED', label: 'Selesai', icon: CheckCircle },
  { key: 'PICKED_UP', label: 'Diambil', icon: Package },
];

export function TrackingView({ order, customer, items, tenant }: TrackingViewProps) {
  const currentStepIndex = statusSteps.findIndex((s) => s.key === order.orderStatus);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{tenant?.name || 'Daya Laundry'}</h1>
          <p className="text-gray-600">Lacak Pesanan Anda</p>
          {tenant?.phone && <p className="text-sm text-gray-500">Telp: {tenant.phone}</p>}
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-semibold">#{order.invoiceNumber}</h2>
                <p className="text-sm text-gray-600">{customer.name}</p>
              </div>
              <Badge variant={order.paymentStatus === 'PAID' ? 'success' : 'danger'}>
                {order.paymentStatus === 'PAID' ? 'Lunas' : 'Belum Bayar'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-1">
                <span>Tanggal Masuk</span>
                <span>{formatDate(order.dateIn)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Estimasi Selesai</span>
                <span>{formatDate(order.dateEstimated)}</span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-3">Status Pesanan</h3>
              <div className="flex justify-between">
                {statusSteps.map((step, i) => {
                  const Icon = step.icon;
                  const isCompleted = i <= currentStepIndex;
                  const isCurrent = i === currentStepIndex;
                  return (
                    <div key={step.key} className="flex flex-col items-center flex-1">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${
                          isCompleted
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-400'
                        } ${isCurrent ? 'ring-2 ring-blue-400 ring-offset-2' : ''}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-xs text-center">{step.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Detail Pesanan</h3>
              {items.map((item: any, i: number) => (
                <div key={i} className="flex justify-between text-sm py-1">
                  <span>
                    {item.serviceName} x{item.qty}
                  </span>
                  <span>{formatCurrency(item.subtotal)}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold pt-2 mt-2 border-t">
                <span>Total</span>
                <span>{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
