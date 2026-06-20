import { Metadata } from 'next';
import { ServicesList } from '@/features/services/components/ServicesList';

export const metadata: Metadata = {
  title: 'Layanan & Harga | Laundry',
};

export default function ServicesPage() {
  return <ServicesList />;
}
