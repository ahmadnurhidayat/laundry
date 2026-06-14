export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;
export const SHOP_NAME = process.env.NEXT_PUBLIC_SHOP_NAME!;
export const SHOP_PHONE = process.env.NEXT_PUBLIC_SHOP_PHONE!;
export const SHOP_TAGLINE = process.env.NEXT_PUBLIC_SHOP_TAGLINE!;

export const ORDER_STATUSES = ['PENDING', 'PROCESSING', 'FINISHED', 'PICKED_UP'] as const;
export const PAYMENT_STATUSES = ['UNPAID', 'PAID'] as const;
export const SERVICE_TYPES = ['KILOAN', 'SATUAN'] as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  FINISHED: 'Finished',
  PICKED_UP: 'Picked Up',
};

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  UNPAID: 'Unpaid',
  PAID: 'Paid',
};

export const TERMS_AND_CONDITIONS = [
  'Barang yang hilang atau rusak karena kesalahan laundry, maksimal ganti 10x harga cucian (maks Rp60.000).',
  'Barang yang tidak diambil setelah 20 hari tidak menjadi tanggung jawab laundry.',
  'Komplain maksimal 3 hari setelah barang diambil.',
  'Bukti struk harus ditunjukkan saat pengambilan barang.',
];
