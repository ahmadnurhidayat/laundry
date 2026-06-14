'use client';

import { formatCurrency, formatDateShort } from '@/lib/utils';
import { TERMS_AND_CONDITIONS } from '@/lib/constants';

interface ReceiptItem {
  serviceName: string;
  qty: number;
  subtotal: number;
}

interface ReceiptPreviewProps {
  order: {
    invoiceNumber: string;
    dateIn: string;
    dateEstimated: string;
    orderStatus: string;
    paymentStatus: string;
    totalAmount: number;
    trackingToken: string;
  };
  customer: {
    name: string;
    phoneNumber: string;
  };
  items: ReceiptItem[];
  tenant?: {
    name: string;
    phone?: string | null;
    address?: string | null;
  };
}

export function ReceiptPreview({ order, customer, items, tenant }: ReceiptPreviewProps) {
  const shopName = tenant?.name || 'Daya Laundry';
  const shopPhone = tenant?.phone || '';

  return (
    <div className="mx-auto max-w-[320px]">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {/* Receipt Header */}
        <div className="p-4 text-center border-b border-dashed border-gray-300">
          <h3 className="font-bold text-gray-900">{shopName}</h3>
          {shopPhone && <p className="text-xs text-gray-500 mt-0.5">Telp: {shopPhone}</p>}
        </div>

        {/* Order Info */}
        <div className="p-4 border-b border-dashed border-gray-300 space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">No. Invoice</span>
            <span className="font-medium text-gray-900">{order.invoiceNumber}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Tanggal Masuk</span>
            <span className="text-gray-900">{formatDateShort(order.dateIn)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Estimasi Selesai</span>
            <span className="text-gray-900">{formatDateShort(order.dateEstimated)}</span>
          </div>
        </div>

        {/* Customer */}
        <div className="p-4 border-b border-dashed border-gray-300">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Pelanggan</p>
          <p className="text-sm font-medium text-gray-900">{customer.name}</p>
          <p className="text-xs text-gray-500">{customer.phoneNumber}</p>
        </div>

        {/* Items */}
        <div className="p-4 border-b border-dashed border-gray-300">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Detail Pesanan</p>
          <div className="space-y-1.5">
            {items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {item.serviceName} x{item.qty}
                </span>
                <span className="font-medium text-gray-900">{formatCurrency(item.subtotal)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-bold text-base mt-3 pt-3 border-t border-gray-200">
            <span className="text-gray-900">TOTAL</span>
            <span className="text-gray-900">{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>

        {/* Status */}
        <div className="p-4 border-b border-dashed border-gray-300">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Status Pembayaran</span>
            <span className={`font-bold ${order.paymentStatus === 'PAID' ? 'text-green-600' : 'text-red-600'}`}>
              {order.paymentStatus === 'PAID' ? 'LUNAS' : 'BELUM BAYAR'}
            </span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-500">Status Pesanan</span>
            <span className="font-medium text-gray-900">{order.orderStatus.replace('_', ' ')}</span>
          </div>
        </div>

        {/* Tracking */}
        <div className="p-4 text-center">
          <p className="text-xs font-medium text-gray-500 mb-1">LACAK PESANAN</p>
          <p className="text-xs text-blue-600 break-all">{`/track/${order.trackingToken}`}</p>
        </div>

        {/* Footer */}
        <div className="px-4 pb-4 text-center">
          <p className="text-[10px] text-gray-400">Terima kasih atas kepercayaan Anda!</p>
        </div>
      </div>
    </div>
  );
}
