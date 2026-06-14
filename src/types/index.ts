export interface Customer {
  id: string;
  name: string;
  phoneNumber: string;
}

export interface Service {
  id: string;
  serviceName: string;
  type: 'KILOAN' | 'SATUAN';
  pricePerUnit: number;
}

export interface Order {
  id: string;
  invoiceNumber: string;
  customerId: string;
  dateIn: string;
  dateEstimated: string;
  orderStatus: 'PENDING' | 'PROCESSING' | 'FINISHED' | 'PICKED_UP';
  paymentStatus: 'UNPAID' | 'PAID';
  totalAmount: number;
  notes: string | null;
  trackingToken: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  serviceId: string;
  qty: number;
  subtotal: number;
}

export interface OrderWithItems extends Order {
  customer: Customer;
  items: (OrderItem & { serviceName: string; serviceType: string; pricePerUnit: number })[];
}

export interface CreateOrderInput {
  customerName: string;
  customerPhone: string;
  items: { serviceId: string; qty: number }[];
  notes?: string;
  daysEstimate: number;
}

export interface DashboardStats {
  pending: number;
  processing: number;
  finished: number;
  pickedUp: number;
  unpaid: number;
}
