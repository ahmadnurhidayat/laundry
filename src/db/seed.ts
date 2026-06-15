import { drizzle } from 'drizzle-orm/d1';
import { tenants, services, users } from './schema';
import { hashPassword } from '@/lib/auth';

function generateId(): string {
  return crypto.randomUUID();
}

async function seed() {
  console.log('Seeding database...');

  const db = drizzle(process.env.DB as any);

  // Create demo tenant
  const tenantId = 'demo-tenant-001';
  await db.insert(tenants).values({
    id: tenantId,
    businessName: 'Laundry Demo',
    slug: 'laundry-demo',
    address: 'Jl. Contoh No. 123',
    phone: '08123456789',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
  }).onConflictDoNothing();

  // Create demo owner
  const passwordHash = await hashPassword('password123');
  await db.insert(users).values({
    id: generateId(),
    tenantId,
    phone: '08123456789',
    passwordHash,
    name: 'Admin Laundry',
    role: 'OWNER',
  }).onConflictDoNothing();

  // Create default services for demo tenant
  const defaultServices = [
    { id: generateId(), tenantId, serviceName: 'Cuci Komplit 3 Hari', type: 'KILOAN' as const, pricePerUnit: 8000 },
    { id: generateId(), tenantId, serviceName: 'Cuci Setrika 2 Hari', type: 'KILOAN' as const, pricePerUnit: 12000 },
    { id: generateId(), tenantId, serviceName: 'Cuci Kiloan Express', type: 'KILOAN' as const, pricePerUnit: 15000 },
    { id: generateId(), tenantId, serviceName: 'Dry Clean Satuan', type: 'SATUAN' as const, pricePerUnit: 25000 },
    { id: generateId(), tenantId, serviceName: 'Cuci Sepatu', type: 'SATUAN' as const, pricePerUnit: 35000 },
  ];

  for (const service of defaultServices) {
    await db.insert(services).values(service).onConflictDoNothing();
  }

  console.log('Seed completed!');
  console.log('Demo login: 08123456789 / password123');
}

seed().catch(console.error);
