import { BASE_URL, SHOP_NAME, SHOP_PHONE, SHOP_TAGLINE, TERMS_AND_CONDITIONS } from '@/lib/constants';
import { formatCurrency, formatDate, formatDateShort } from '@/lib/utils';
import type { OrderWithItems } from '@/types';

interface ReceiptProps {
  order: OrderWithItems;
}

export function Receipt({ order }: ReceiptProps) {
  const trackingUrl = `${BASE_URL}/track/${order.trackingToken}`;

  return (
    <div className="receipt">
      <style>{`
        @media print {
          .receipt {
            width: 80mm;
            padding: 5mm;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            line-height: 1.4;
          }
          .no-print { display: none !important; }
          body { margin: 0; padding: 0; }
        }
        @media screen {
          .receipt {
            max-width: 320px;
            margin: 0 auto;
            padding: 16px;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            line-height: 1.4;
            border: 1px dashed #ccc;
          }
        }
      `}</style>

      <div className="text-center mb-4">
        <h1 className="text-lg font-bold">{SHOP_NAME}</h1>
        <p className="text-xs">{SHOP_TAGLINE}</p>
        <p className="text-xs">Telp: {SHOP_PHONE}</p>
      </div>

      <div className="border-t border-b border-dashed border-gray-400 py-2 mb-3">
        <p className="font-bold">Struk Pesanan</p>
        <p>No: {order.invoiceNumber}</p>
        <p>Tanggal Masuk: {formatDateShort(order.dateIn)}</p>
        <p>Estimasi Selesai: {formatDateShort(order.dateEstimated)}</p>
      </div>

      <div className="mb-3">
        <p className="font-bold">Pelanggan:</p>
        <p>{order.customer.name}</p>
        <p>Telp: {order.customer.phoneNumber}</p>
      </div>

      <div className="mb-3">
        <p className="font-bold">Detail Pesanan:</p>
        {order.items.map((item, i) => (
          <div key={i} className="flex justify-between">
            <span>
              {item.serviceName} x{item.qty}
            </span>
            <span>{formatCurrency(item.subtotal)}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-dashed border-gray-400 pt-2 mb-3">
        <div className="flex justify-between font-bold text-base">
          <span>TOTAL</span>
          <span>{formatCurrency(order.totalAmount)}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span>Status Bayar</span>
          <span className={order.paymentStatus === 'PAID' ? 'font-bold' : 'text-red-600 font-bold'}>
            {order.paymentStatus === 'PAID' ? 'LUNAS' : 'BELUM BAYAR'}
          </span>
        </div>
      </div>

      <div className="mb-3">
        <p className="font-bold text-xs">Status Pesanan:</p>
        <p className="text-sm font-bold">{order.orderStatus.replace('_', ' ')}</p>
      </div>

      <div className="border-t border-dashed border-gray-400 pt-2 mb-3 text-center">
        <p className="text-xs font-bold">LACAK PESANAN:</p>
        <p className="text-xs break-all">{trackingUrl}</p>
      </div>

      <div className="border-t border-dashed border-gray-400 pt-2">
        <p className="text-xs font-bold mb-1">SYARAT & KETENTUAN:</p>
        {TERMS_AND_CONDITIONS.map((tc, i) => (
          <p key={i} className="text-[10px] leading-tight mb-1">
            {i + 1}. {tc}
          </p>
        ))}
      </div>

      <div className="text-center mt-4">
        <p className="text-xs">Terima kasih atas kepercayaan Anda!</p>
        <p className="text-xs">Simpan struk ini untuk pengambilan</p>
      </div>
    </div>
  );
}
