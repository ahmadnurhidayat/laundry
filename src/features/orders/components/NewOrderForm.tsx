'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Minus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { formatCurrency, calculateEstimatedDate } from '@/lib/utils';

interface Service {
  id: string;
  serviceName: string;
  type: string;
  pricePerUnit: number;
}

interface OrderItem {
  serviceId: string;
  qty: number;
  subtotal: number;
}

export function NewOrderForm() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [items, setItems] = useState<OrderItem[]>([{ serviceId: '', qty: 1, subtotal: 0 }]);
  const [notes, setNotes] = useState('');
  const [daysEstimate, setDaysEstimate] = useState('3');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/services')
      .then((res) => res.json())
      .then((data: any) => setServices(data.services || []))
      .catch(() => {});
  }, []);

  const getServicePrice = useCallback(
    (serviceId: string) => services.find((s) => s.id === serviceId)?.pricePerUnit || 0,
    [services]
  );

  const updateItemQty = (index: number, qty: number) => {
    const newQty = Math.max(0.5, qty);
    const newItems = [...items];
    newItems[index].qty = newQty;
    newItems[index].subtotal = newQty * getServicePrice(newItems[index].serviceId);
    setItems(newItems);
  };

  const updateItemService = (index: number, serviceId: string) => {
    const newItems = [...items];
    newItems[index].serviceId = serviceId;
    newItems[index].subtotal = newItems[index].qty * getServicePrice(serviceId);
    setItems(newItems);
  };

  const addItem = () => setItems([...items, { serviceId: '', qty: 1, subtotal: 0 }]);
  const removeItem = (index: number) => {
    if (items.length > 1) setItems(items.filter((_, i) => i !== index));
  };

  const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);
  const estimatedDate = calculateEstimatedDate(parseInt(daysEstimate) || 3);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerPhone,
          customerAddress,
          customerNotes,
          items: items.filter((item) => item.serviceId),
          notes,
          daysEstimate: parseInt(daysEstimate) || 3,
        }),
      });

      if (!res.ok) {
        const data = await res.json() as { error?: string };
        throw new Error(data.error || 'Failed to create order');
      }

      router.push('/dashboard/orders');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Customer Info */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Informasi Pelanggan</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Nama Pelanggan"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Masukkan nama pelanggan"
            required
          />
          <Input
            label="Nomor Telepon"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            placeholder="Masukkan nomor telepon"
            required
          />
          <Input
            label="Alamat (Opsional)"
            value={customerAddress}
            onChange={(e) => setCustomerAddress(e.target.value)}
            placeholder="Alamat pelanggan"
          />
          <Input
            label="Catatan Pelanggan (Opsional)"
            value={customerNotes}
            onChange={(e) => setCustomerNotes(e.target.value)}
            placeholder="Preferensi, alergi, dll."
          />
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Item Pesanan</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="flex gap-3 items-end">
              <div className="flex-1">
                <Select
                  label={index === 0 ? 'Layanan' : undefined}
                  value={item.serviceId}
                  onChange={(e) => updateItemService(index, e.target.value)}
                  options={services.map((s) => ({
                    value: s.id,
                    label: `${s.serviceName} (${s.type === 'KILOAN' ? 'per kg' : 'per item'}) - ${formatCurrency(s.pricePerUnit)}`,
                  }))}
                  placeholder="Pilih layanan"
                />
              </div>

              {/* Quantity Counter */}
              <div className="w-28">
                {index === 0 && <label className="block text-sm font-medium text-gray-700 mb-1.5">Qty</label>}
                <div className="flex items-center h-10 border border-gray-300 rounded-lg">
                  <button
                    type="button"
                    onClick={() => updateItemQty(index, item.qty - 0.5)}
                    className="h-full px-2 text-gray-500 hover:bg-gray-50 transition-colors"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={item.qty}
                    onChange={(e) => updateItemQty(index, parseFloat(e.target.value) || 0.5)}
                    className="h-full w-12 text-center text-sm font-medium border-x border-gray-300 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => updateItemQty(index, item.qty + 0.5)}
                    className="h-full px-2 text-gray-500 hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="w-28 text-right">
                {index === 0 && <label className="block text-sm font-medium text-gray-700 mb-1.5">Subtotal</label>}
                <p className="h-10 flex items-center justify-end text-sm font-medium">{formatCurrency(item.subtotal)}</p>
              </div>

              {items.length > 1 && (
                <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(index)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              )}
            </div>
          ))}
          <Button type="button" variant="tertiary" onClick={addItem}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Item
          </Button>
        </CardContent>
      </Card>

      {/* Order Details */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Detail Pesanan</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select
            label="Estimasi Hari"
            value={daysEstimate}
            onChange={(e) => setDaysEstimate(e.target.value)}
            options={[
              { value: '1', label: '1 Hari (Express)' },
              { value: '2', label: '2 Hari' },
              { value: '3', label: '3 Hari (Standar)' },
              { value: '5', label: '5 Hari' },
              { value: '7', label: '7 Hari' },
            ]}
          />
          <Input label="Estimasi Selesai" value={estimatedDate} disabled />
          <Input
            label="Catatan (Opsional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Catatan khusus..."
          />
        </CardContent>
      </Card>

      {/* Total & Submit */}
      <Card>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-2xl font-bold text-blue-600">{formatCurrency(totalAmount)}</span>
          </div>
          {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
          <Button type="submit" className="w-full" size="lg" loading={loading}>
            <ShoppingBag className="h-5 w-5 mr-2" />
            Buat Pesanan
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
