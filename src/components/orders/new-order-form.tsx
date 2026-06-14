'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Loader2 } from 'lucide-react';
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
    (serviceId: string) => {
      const service = services.find((s) => s.id === serviceId);
      return service?.pricePerUnit || 0;
    },
    [services]
  );

  const updateItemQty = (index: number, qty: number) => {
    const newItems = [...items];
    newItems[index].qty = qty;
    newItems[index].subtotal = qty * getServicePrice(newItems[index].serviceId);
    setItems(newItems);
  };

  const updateItemService = (index: number, serviceId: string) => {
    const newItems = [...items];
    newItems[index].serviceId = serviceId;
    newItems[index].subtotal = newItems[index].qty * getServicePrice(serviceId);
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { serviceId: '', qty: 1, subtotal: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
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
          items: items.filter((item) => item.serviceId),
          notes,
          daysEstimate: parseInt(daysEstimate) || 3,
        }),
      });

      if (!res.ok) {
        const data = await res.json() as any;
        throw new Error(data.error || 'Failed to create order');
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Customer Information</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            id="customerName"
            label="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Enter customer name"
            required
          />
          <Input
            id="customerPhone"
            label="Phone Number"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            placeholder="Enter phone number"
            required
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Order Items</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="flex gap-3 items-end">
              <div className="flex-1">
                <Select
                  id={`service-${index}`}
                  label={index === 0 ? 'Service' : undefined}
                  value={item.serviceId}
                  onChange={(e) => updateItemService(index, e.target.value)}
                  options={services.map((s) => ({
                    value: s.id,
                    label: `${s.serviceName} (${s.type === 'KILOAN' ? 'per kg' : 'per item'}) - ${formatCurrency(s.pricePerUnit)}`,
                  }))}
                  placeholder="Select service"
                />
              </div>
              <div className="w-24">
                <Input
                  id={`qty-${index}`}
                  label={index === 0 ? 'Qty' : undefined}
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={item.qty || ''}
                  onChange={(e) => updateItemQty(index, parseFloat(e.target.value) || 0)}
                  placeholder="Qty"
                />
              </div>
              <div className="w-28 text-right">
                {index === 0 && <label className="block text-sm font-medium text-gray-700 mb-1">Subtotal</label>}
                <p className="py-2 text-sm font-medium">{formatCurrency(item.subtotal)}</p>
              </div>
              {items.length > 1 && (
                <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(index)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              )}
            </div>
          ))}
          <Button type="button" variant="secondary" onClick={addItem}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Order Details</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select
            id="daysEstimate"
            label="Estimated Days"
            value={daysEstimate}
            onChange={(e) => setDaysEstimate(e.target.value)}
            options={[
              { value: '1', label: '1 Day (Express)' },
              { value: '2', label: '2 Days' },
              { value: '3', label: '3 Days (Standard)' },
              { value: '5', label: '5 Days' },
              { value: '7', label: '7 Days' },
            ]}
          />
          <Input
            id="estimatedDate"
            label="Estimated Completion"
            value={estimatedDate}
            disabled
          />
          <Input
            id="notes"
            label="Notes (Optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Special instructions..."
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">Total Amount</span>
            <span className="text-2xl font-bold text-blue-600">{formatCurrency(totalAmount)}</span>
          </div>
          {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Creating Order...
              </>
            ) : (
              'Create Order'
            )}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
