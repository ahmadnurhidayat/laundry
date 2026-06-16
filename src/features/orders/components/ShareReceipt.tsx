'use client';

import { Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency, formatDateShort } from '@/lib/utils';
import { BASE_URL } from '@/lib/constants';

interface ShareReceiptProps {
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
  items: {
    serviceName: string;
    qty: number;
    subtotal: number;
  }[];
  tenantName: string;
  className?: string;
}

export function ShareReceipt({ order, customer, items, tenantName, className }: ShareReceiptProps) {
  const lines: string[] = [];

  lines.push(`*${tenantName}*`);
  lines.push('');
  lines.push(`Invoice: ${order.invoiceNumber}`);
  lines.push(`Tanggal: ${formatDateShort(order.dateIn)}`);
  lines.push(`Estimasi: ${formatDateShort(order.dateEstimated)}`);
  lines.push('');
  lines.push(`Pelanggan: ${customer.name}`);
  lines.push('');
  lines.push('--- Detail Pesanan ---');
  items.forEach((item) => {
    lines.push(`${item.serviceName} x${item.qty} = ${formatCurrency(item.subtotal)}`);
  });
  lines.push('');
  lines.push(`*TOTAL: ${formatCurrency(order.totalAmount)}*`);
  lines.push('');
  lines.push(`Status: ${order.orderStatus.replace('_', ' ')}`);
  lines.push(`Pembayaran: ${order.paymentStatus === 'PAID' ? 'LUNAS' : 'BELUM BAYAR'}`);
  lines.push('');
  lines.push(`Lacak pesanan: ${BASE_URL}/track/${order.trackingToken}`);

  const message = lines.join('\n');
  const phone = customer.phoneNumber.replace(/[^0-9]/g, '');
  const url = `https://wa.me/${phone.startsWith('62') ? phone : '62' + phone}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex items-center gap-2 px-4 py-2.5 bg-[#25D366] text-white rounded-lg text-sm font-medium hover:bg-[#1da851] transition-colors',
        className
      )}
    >
      <Share2 className="h-4 w-4" />
      Kirim ke WhatsApp
    </a>
  );
}
