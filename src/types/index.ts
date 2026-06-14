export interface Tenant {
  id: string;
  businessName: string;
  slug: string;
  address: string | null;
  phone: string | null;
  status: 'ACTIVE' | 'SUSPENDED';
  createdAt: string;
}

export interface User {
  id: string;
  tenantId: string;
  email: string;
  name: string;
  role: 'OWNER' | 'CASHIER';
}

export interface Customer {
  id: string;
  tenantId: string;
  name: string;
  phoneNumber: string;
}

export interface Service {
  id: string;
  tenantId: string;
  serviceName: string;
  type: 'KILOAN' | 'SATUAN';
  pricePerUnit: number;
}

export interface Order {
  id: string;
  tenantId: string;
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
  customerName?: string;
  items?: OrderItemWithService[];
}

export interface OrderItemWithService extends OrderItem {
  serviceName?: string;
  serviceType?: string;
  pricePerUnit?: number;
}

export interface DashboardStats {
  pending: number;
  processing: number;
  finished: number;
  pickedUp: number;
  unpaid: number;
}
