'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Minus, ShoppingBag, Search, UserPlus, X, Check } from 'lucide-react';
import { formatCurrency, calculateEstimatedDate } from '@/lib/utils';

interface Service {
  id: string;
  serviceName: string;
  description: string | null;
  type: string;
  pricePerUnit: number;
  minWeight: number | null;
  isActive: number | null;
}

interface Customer {
  id: string;
  name: string;
  phoneNumber: string;
  address: string | null;
  notes: string | null;
}

interface OrderItem {
  id: string;
  serviceId: string;
  qty: number;
}

export function NewOrderForm() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Customer state
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerSearch, setCustomerSearch] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const customerDropdownRef = useRef<HTMLDivElement>(null);

  // New customer fields
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Order state
  const [items, setItems] = useState<OrderItem[]>([{ id: crypto.randomUUID(), serviceId: '', qty: 1 }]);
  const [notes, setNotes] = useState('');
  const [daysEstimate, setDaysEstimate] = useState('3');

  useEffect(() => {
    fetch('/api/services')
      .then((res) => res.json())
      .then((data: unknown) => {
        const d = data as { services?: Service[] };
        setServices(d.services || []);
      })
      .catch(() => {});
    fetch('/api/customers')
      .then((res) => res.json())
      .then((data: unknown) => {
        const d = data as { customers?: Customer[] };
        setCustomers(d.customers || []);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (customerDropdownRef.current && !customerDropdownRef.current.contains(e.target as Node)) {
        setShowCustomerDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.phoneNumber.includes(customerSearch)
  );

  const selectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setCustomerSearch(`${customer.name} — ${customer.phoneNumber}`);
    setShowCustomerDropdown(false);
    setIsNewCustomer(false);
    setNewName('');
    setNewPhone('');
    setNewAddress('');
    setNewNotes('');
  };

  const startNewCustomer = () => {
    setSelectedCustomer(null);
    setIsNewCustomer(true);
    setCustomerSearch('');
    setShowCustomerDropdown(false);
    setNewPhone(customerSearch);
  };

  const clearCustomer = () => {
    setSelectedCustomer(null);
    setIsNewCustomer(false);
    setCustomerSearch('');
    setNewName('');
    setNewPhone('');
    setNewAddress('');
    setNewNotes('');
  };

  const getServiceDetails = useCallback(
    (serviceId: string) => services.find((s) => s.id === serviceId),
    [services]
  );

  const updateItem = (id: string, field: 'serviceId' | 'qty', value: string | number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        if (field === 'serviceId') {
          const service = getServiceDetails(value as string);
          const minWeight = service?.minWeight || 0;
          updated.qty = minWeight > 0 ? minWeight : 1;
        }
        return updated;
      })
    );
  };

  const addItem = () => setItems([...items, { id: crypto.randomUUID(), serviceId: '', qty: 1 }]);
  const removeItem = (id: string) => {
    if (items.length > 1) setItems(items.filter((item) => item.id !== id));
  };

  const calculateSubtotal = (item: OrderItem) => {
    const service = getServiceDetails(item.serviceId);
    return service ? service.pricePerUnit * item.qty : 0;
  };

  const totalAmount = items.reduce((sum, item) => sum + calculateSubtotal(item), 0);
  const estimatedDate = calculateEstimatedDate(parseInt(daysEstimate) || 3);

  const customerName = selectedCustomer ? selectedCustomer.name : newName;
  const customerPhone = selectedCustomer ? selectedCustomer.phoneNumber : newPhone;
  const customerAddress = selectedCustomer ? selectedCustomer.address : newAddress;
  const customerNotes = selectedCustomer ? selectedCustomer.notes : newNotes;

  const canSubmit =
    customerName.trim() &&
    customerPhone.trim() &&
    items.some((item) => item.serviceId) &&
    /^[0-9]{10,15}$/.test(customerPhone);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          customerAddress: customerAddress?.trim() || '',
          customerNotes: customerNotes?.trim() || '',
          items: items.filter((item) => item.serviceId).map((item) => ({
            serviceId: item.serviceId,
            qty: item.qty,
          })),
          notes: notes.trim(),
          daysEstimate: parseInt(daysEstimate) || 3,
        }),
      });

      if (!res.ok) {
        const data = await res.json() as { error?: string };
        throw new Error(data.error || 'Gagal membuat pesanan');
      }

      router.push('/dashboard/orders');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-3xl">
      {/* Customer Section */}
      <div className="bg-canvas-elevated rounded-xl border border-border-subtle shadow-premium-sm p-5">
        <h2 className="text-sm font-semibold text-ink mb-4">Pelanggan</h2>

        {!selectedCustomer && !isNewCustomer ? (
          <div className="space-y-3">
            <div className="relative" ref={customerDropdownRef}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
              <input
                type="text"
                value={customerSearch}
                onChange={(e) => {
                  setCustomerSearch(e.target.value);
                  setShowCustomerDropdown(true);
                  setIsNewCustomer(false);
                }}
                onFocus={() => setShowCustomerDropdown(true)}
                placeholder="Cari nama atau nomor telepon..."
                className="h-10 pl-9 pr-4 text-sm bg-canvas-elevated border border-border-subtle rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
              />
              {showCustomerDropdown && customerSearch && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-canvas-elevated border border-border-subtle rounded-lg shadow-premium-lg z-20 max-h-60 overflow-y-auto">
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((customer) => (
                      <button
                        key={customer.id}
                        type="button"
                        onClick={() => selectCustomer(customer)}
                        className="w-full px-4 py-3 text-left hover:bg-canvas transition-colors border-b border-border-subtle last:border-0"
                      >
                        <p className="text-sm font-medium text-ink">{customer.name}</p>
                        <p className="text-xs text-ink-muted">{customer.phoneNumber}</p>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3">
                      <p className="text-xs text-ink-muted mb-2">Tidak ditemukan</p>
                      <button
                        type="button"
                        onClick={startNewCustomer}
                        className="w-full h-9 text-xs font-medium text-brand bg-brand-subtle hover:bg-brand/10 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <UserPlus className="h-3.5 w-3.5" />
                        Tambah Pelanggan Baru
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={startNewCustomer}
              className="w-full h-10 text-xs font-medium text-ink-muted hover:text-ink bg-canvas hover:bg-canvas-soft rounded-lg flex items-center justify-center gap-1.5 transition-colors border border-border-subtle"
            >
              <UserPlus className="h-3.5 w-3.5" />
              Pelanggan Baru
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {selectedCustomer && (
              <div className="flex items-center gap-2 p-3 bg-brand-subtle border border-brand/20 rounded-lg">
                <Check className="h-4 w-4 text-brand shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink truncate">{selectedCustomer.name}</p>
                  <p className="text-xs text-ink-muted">{selectedCustomer.phoneNumber}</p>
                </div>
                <button
                  type="button"
                  onClick={clearCustomer}
                  className="p-1 text-ink-muted hover:text-ink rounded-lg"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {isNewCustomer && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-ink mb-1.5 block">Nama</label>
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Nama pelanggan"
                      className="h-10 px-3 text-sm bg-canvas-elevated border border-border-subtle rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-ink mb-1.5 block">Telepon</label>
                    <input
                      type="text"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      placeholder="08xxx"
                      className="h-10 px-3 text-sm bg-canvas-elevated border border-border-subtle rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-ink mb-1.5 block">Alamat (opsional)</label>
                  <input
                    type="text"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    placeholder="Alamat pelanggan"
                    className="h-10 px-3 text-sm bg-canvas-elevated border border-border-subtle rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-ink mb-1.5 block">Catatan (opsional)</label>
                  <input
                    type="text"
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    placeholder="Preferensi, alergi, dll."
                    className="h-10 px-3 text-sm bg-canvas-elevated border border-border-subtle rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                  />
                </div>
              </>
            )}

            {selectedCustomer && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-ink mb-1.5 block">Alamat</label>
                  <input
                    type="text"
                    value={selectedCustomer.address || ''}
                    readOnly
                    className="h-10 px-3 text-sm bg-canvas border border-border-subtle rounded-lg w-full text-ink-muted"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-ink mb-1.5 block">Catatan</label>
                  <input
                    type="text"
                    value={selectedCustomer.notes || ''}
                    readOnly
                    className="h-10 px-3 text-sm bg-canvas border border-border-subtle rounded-lg w-full text-ink-muted"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Order Items Table */}
      <div className="bg-canvas-elevated rounded-xl border border-border-subtle shadow-premium-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-ink">Item Pesanan</h2>
          <button
            type="button"
            onClick={addItem}
            className="h-8 px-3 text-xs font-medium text-brand bg-brand-subtle hover:bg-brand/10 rounded-lg flex items-center gap-1 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Tambah
          </button>
        </div>

        <div className="hidden sm:grid sm:grid-cols-12 gap-3 mb-2 px-1">
          <div className="col-span-5 text-xs font-medium text-ink-muted">Layanan</div>
          <div className="col-span-2 text-xs font-medium text-ink-muted text-center">Qty</div>
          <div className="col-span-2 text-xs font-medium text-ink-muted text-right">Harga</div>
          <div className="col-span-2 text-xs font-medium text-ink-muted text-right">Subtotal</div>
          <div className="col-span-1"></div>
        </div>

        <div className="space-y-2">
          {items.map((item) => {
            const service = getServiceDetails(item.serviceId);
            const isKiloan = service?.type === 'KILOAN';
            const minWeight = service?.minWeight || 0;
            const subtotal = calculateSubtotal(item);

            return (
              <div
                key={item.id}
                className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-3 items-center p-3 bg-canvas rounded-lg border border-border-subtle"
              >
                <div className="sm:col-span-5">
                  <label className="text-xs font-medium text-ink mb-1.5 block sm:hidden">Layanan</label>
                  <select
                    value={item.serviceId}
                    onChange={(e) => updateItem(item.id, 'serviceId', e.target.value)}
                    className="h-10 px-3 text-sm bg-canvas-elevated border border-border-subtle rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                  >
                    <option value="">Pilih layanan</option>
                    {services
                      .filter((s) => s.isActive !== 0)
                      .map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.serviceName} — {formatCurrency(s.pricePerUnit)}/{s.type === 'KILOAN' ? 'kg' : 'item'}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-ink mb-1.5 block sm:hidden">
                    {isKiloan ? 'Berat (kg)' : 'Qty'}
                  </label>
                  <div className="flex items-center h-10 border border-border-subtle rounded-lg bg-canvas-elevated">
                    <button
                      type="button"
                      onClick={() => updateItem(item.id, 'qty', Math.max(minWeight > 0 ? minWeight : 1, item.qty - 1))}
                      className="h-full px-2.5 text-ink-muted hover:bg-canvas transition-colors"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <input
                      type="number"
                      min={minWeight > 0 ? minWeight : 1}
                      step={isKiloan ? 1 : 1}
                      value={item.qty}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 1;
                        const min = minWeight > 0 ? minWeight : 1;
                        updateItem(item.id, 'qty', Math.max(min, val));
                      }}
                      className="h-full flex-1 text-center text-sm font-medium border-x border-border-subtle focus:outline-none bg-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => updateItem(item.id, 'qty', item.qty + 1)}
                      className="h-full px-2.5 text-ink-muted hover:bg-canvas transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="sm:col-span-2 text-left sm:text-right">
                  <label className="text-xs font-medium text-ink mb-1.5 block sm:hidden">Harga</label>
                  <p className="h-10 flex items-center sm:justify-end text-sm text-ink-muted">
                    {service ? (
                      <>
                        <span className="sm:hidden mr-1">:</span>
                        <span className="font-mono">{formatCurrency(service.pricePerUnit)}</span>
                        <span className="text-xs ml-0.5">/{isKiloan ? 'kg' : 'item'}</span>
                      </>
                    ) : (
                      <span className="text-border-subtle">—</span>
                    )}
                  </p>
                </div>

                <div className="sm:col-span-2 text-left sm:text-right">
                  <label className="text-xs font-medium text-ink mb-1.5 block sm:hidden">Subtotal</label>
                  <p className="h-10 flex items-center sm:justify-end text-sm font-mono font-medium text-ink">
                    {item.serviceId ? formatCurrency(subtotal) : <span className="text-border-subtle font-normal">—</span>}
                  </p>
                </div>

                <div className="sm:col-span-1 flex justify-end">
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-status-alert hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {service && isKiloan && minWeight > 0 && (
                  <div className="sm:col-span-12">
                    <p className="text-xs text-amber-600">
                      Min. {minWeight} kg · {item.qty} kg × {formatCurrency(service.pricePerUnit)} = {formatCurrency(subtotal)}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Details & Total */}
      <div className="bg-canvas-elevated rounded-xl border border-border-subtle shadow-premium-sm p-5">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs font-medium text-ink mb-1.5 block">Estimasi</label>
            <select
              value={daysEstimate}
              onChange={(e) => setDaysEstimate(e.target.value)}
              className="h-10 px-3 text-sm bg-canvas-elevated border border-border-subtle rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
            >
              <option value="1">1 Hari (Express)</option>
              <option value="2">2 Hari</option>
              <option value="3">3 Hari (Standar)</option>
              <option value="5">5 Hari</option>
              <option value="7">7 Hari</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-ink mb-1.5 block">Selesai</label>
            <input
              type="text"
              value={estimatedDate}
              readOnly
              className="h-10 px-3 text-sm bg-canvas border border-border-subtle rounded-lg w-full text-ink-muted"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="text-xs font-medium text-ink mb-1.5 block">Catatan (opsional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Catatan khusus untuk pesanan ini..."
            rows={2}
            className="px-3 py-2 text-sm bg-canvas-elevated border border-border-subtle rounded-lg w-full resize-none focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-canvas rounded-lg border border-border-subtle">
          <div>
            <p className="text-sm text-ink-muted">Total</p>
            <p className="text-2xl font-bold font-mono text-brand">{formatCurrency(totalAmount)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-ink-muted">{items.filter((i) => i.serviceId).length} item</p>
            <p className="text-xs text-ink-muted">Est. {estimatedDate}</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-status-alert">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !canSubmit}
        className="h-11 w-full text-sm font-medium text-white bg-brand hover:bg-brand-hover rounded-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-premium-sm active:scale-[0.98]"
      >
        <ShoppingBag className="h-5 w-5" />
        {loading ? 'Membuat Pesanan...' : 'Buat Pesanan'}
      </button>
    </form>
  );
}
