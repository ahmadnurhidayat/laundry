import { headers } from 'next/headers';

export interface TenantContext {
  tenantId: string;
  userId: string;
  role: 'OWNER' | 'CASHIER';
  name: string;
  email: string;
}

export async function getTenantContext(): Promise<TenantContext> {
  const h = await headers();
  return {
    tenantId: h.get('x-tenant-id') || '',
    userId: h.get('x-user-id') || '',
    role: (h.get('x-user-role') as 'OWNER' | 'CASHIER') || 'CASHIER',
    name: h.get('x-user-name') || '',
    email: h.get('x-user-email') || '',
  };
}
