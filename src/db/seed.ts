import { drizzle } from 'drizzle-orm/d1';
import { services } from './schema';

function generateId(): string {
  return crypto.randomUUID();
}

async function seed() {
  console.log('Seeding database...');

  const db = drizzle(process.env.DB as any);

  const defaultServices = [
    { id: generateId(), serviceName: 'Cuci Kiloan', type: 'KILOAN', pricePerUnit: 8000 },
    { id: generateId(), serviceName: 'Cuci Setrika Kiloan', type: 'KILOAN', pricePerUnit: 12000 },
    { id: generateId(), serviceName: 'Dry Clean Satuan', type: 'SATUAN', pricePerUnit: 25000 },
    { id: generateId(), serviceName: 'Cuci Sepatu', type: 'SATUAN', pricePerUnit: 35000 },
    { id: generateId(), serviceName: 'Cuci Selimut', type: 'SATUAN', pricePerUnit: 20000 },
  ];

  for (const service of defaultServices) {
    await db.insert(services).values(service).onConflictDoNothing();
  }

  console.log('Seed completed!');
}

seed().catch(console.error);
