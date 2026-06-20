'use client';

import { formatCurrency, formatDate } from '@/lib/utils';
import { Phone, MessageCircle, MessageSquare, ChevronDown, ChevronUp, MapPin, Calendar, Clock, Camera, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface TrackingViewProps {
  order: {
    id: string;
    invoiceNumber: string;
    orderStatus: string;
    paymentStatus: string;
    totalAmount: number;
    trackingToken: string;
    dateIn: string;
    dateEstimated: string;
    notes: string | null;
  };
  customer: {
    name: string;
    phone: string;
  };
  items: {
    id: string;
    qty: number;
    subtotal: number;
    serviceName: string;
    serviceType: string;
    pricePerUnit: number;
  }[];
  tenant?: {
    name: string;
    phone?: string | null;
    address?: string | null;
    termsAndConditions?: string | null;
  };
  statusHistory?: {
    status: string;
    note: string | null;
    updatedBy: string | null;
    createdAt: string;
  }[];
  photos?: {
    id: string;
    url: string;
    caption: string | null;
    sortOrder: number;
  }[];
}

const STATUS_CONFIG = {
  PENDING: { label: 'Diterima', color: 'bg-amber-500', dotColor: 'bg-amber-500', progress: 25 },
  PROCESSING: { label: 'Diproses', color: 'bg-blue-500', dotColor: 'bg-blue-500', progress: 50 },
  FINISHED: { label: 'Selesai', color: 'bg-green-500', dotColor: 'bg-green-500', progress: 75 },
  PICKED_UP: { label: 'Diambil', color: 'bg-emerald-600', dotColor: 'bg-emerald-600', progress: 100 },
};

const STATUS_STEPS = [
  { key: 'PENDING', label: 'Diterima' },
  { key: 'PROCESSING', label: 'Diproses' },
  { key: 'FINISHED', label: 'Selesai' },
  { key: 'PICKED_UP', label: 'Diambil' },
];

function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }) + ' / ' + date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function formatDateGroup(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

function getWhatsAppLink(phone: string, message: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const formattedPhone = cleanPhone.startsWith('62') ? cleanPhone : `62${cleanPhone.replace(/^0/, '')}`;
  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
}

function getSmsLink(phone: string, message: string): string {
  return `sms:${phone}?&body=${encodeURIComponent(message)}`;
}

function PhotoLightbox({ photos, initialIndex, onClose }: { photos: { url: string; caption: string | null }[]; initialIndex: number; onClose: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const goNext = () => setCurrentIndex((prev) => (prev + 1) % photos.length);
  const goPrev = () => setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 text-white p-2 hover:bg-white/20 rounded-full">
        <X className="w-6 h-6" />
      </button>

      {photos.length > 1 && (
        <>
          <button onClick={(e) => { e.stopPropagation(); goPrev(); }} className="absolute left-4 text-white p-2 hover:bg-white/20 rounded-full">
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); goNext(); }} className="absolute right-4 text-white p-2 hover:bg-white/20 rounded-full">
            <ChevronRight className="w-8 h-8" />
          </button>
        </>
      )}

      <div className="max-w-4xl max-h-[90vh] px-12" onClick={(e) => e.stopPropagation()}>
        <img
          src={photos[currentIndex].url}
          alt={photos[currentIndex].caption || `Photo ${currentIndex + 1}`}
          className="max-w-full max-h-[85vh] object-contain rounded-lg"
        />
        {photos[currentIndex].caption && (
          <p className="text-white text-center mt-3 text-sm">{photos[currentIndex].caption}</p>
        )}
        <p className="text-white/60 text-center mt-2 text-xs">{currentIndex + 1} / {photos.length}</p>
      </div>
    </div>
  );
}

export function TrackingView({ order, customer, items, tenant, statusHistory = [], photos = [] }: TrackingViewProps) {
  const [showStatusDetail, setShowStatusDetail] = useState(false);
  const [showPriceDetail, setShowPriceDetail] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const statusConfig = STATUS_CONFIG[order.orderStatus as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.PENDING;
  const currentStepIndex = STATUS_STEPS.findIndex((s) => s.key === order.orderStatus);
  const shopName = tenant?.name || 'Laundry';
  const shopPhone = tenant?.phone || '';
  const shopAddress = tenant?.address || '';
  const termsAndConditions = tenant?.termsAndConditions || '';

  const whatsappMessage = `Halo Admin ${shopName}`;

  // Group status history by date
  const groupedHistory = statusHistory.reduce((groups, item) => {
    const dateGroup = formatDateGroup(item.createdAt);
    if (!groups[dateGroup]) {
      groups[dateGroup] = [];
    }
    groups[dateGroup].push(item);
    return groups;
  }, {} as Record<string, typeof statusHistory>);

  return (
    <div className="min-h-screen bg-gray-50">
      {lightboxIndex !== null && (
        <PhotoLightbox
          photos={photos.map((p) => ({ url: p.url, caption: p.caption }))}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}

      {/* Header - Outlet Identity */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-lg mx-auto px-4 py-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-bold text-xl">
                {shopName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-bold text-gray-900 text-lg truncate">{shopName}</h1>
              {shopAddress && (
                <p className="text-sm text-gray-500 truncate flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 flex-shrink-0" />
                  {shopAddress}
                </p>
              )}
              {shopPhone && (
                <p className="text-sm text-gray-500 mt-0.5">{shopPhone}</p>
              )}
            </div>
          </div>

          {/* Contact Buttons */}
          {shopPhone && (
            <div className="flex gap-2 mt-4">
              <a
                href={`tel:${shopPhone}`}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Phone className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Telepon</span>
              </a>
              <a
                href={getWhatsAppLink(shopPhone, whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-green-500 hover:bg-green-600 rounded-lg transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-white" />
                <span className="text-sm font-medium text-white">WhatsApp</span>
              </a>
              <a
                href={getSmsLink(shopPhone, whatsappMessage)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">SMS</span>
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4 space-y-4">
        {/* Invoice Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 text-center border-b border-gray-100">
            <h2 className="font-bold text-gray-900 text-lg">{customer.name}</h2>
            <div className="mt-3 inline-flex items-center justify-center p-3 bg-white rounded-lg border border-gray-200">
              <QRCodeSVG
                value={`${typeof window !== 'undefined' ? window.location.origin : ''}/track/${order.trackingToken}`}
                size={80}
                level="M"
                includeMargin={false}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2 font-mono">{order.invoiceNumber}</p>
            <p className="text-xs text-gray-400 mt-1">Transaksi Reguler</p>
          </div>

          <div className="p-4 space-y-3">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Alamat</p>
              <p className="text-sm text-gray-900">{customer.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{customer.phone}</p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-gray-400" />
              <div>
                <span className="text-gray-500">Terima:</span>
                <span className="ml-2 text-gray-900 font-medium">{formatDateTime(order.dateIn)}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-gray-400" />
              <div>
                <span className="text-gray-500">Selesai:</span>
                <span className="ml-2 text-gray-900 font-medium">{formatDateTime(order.dateEstimated)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Status Pengerjaan */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <button
            onClick={() => setShowStatusDetail(!showStatusDetail)}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-gray-900">Status Pengerjaan</h3>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${statusConfig.color} text-white`}>
                <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                {statusConfig.label}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-900">{statusConfig.progress}%</span>
              {showStatusDetail ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </div>
          </button>

          {showStatusDetail && (
            <div className="px-4 pb-4 border-t border-gray-100">
              <p className="text-sm text-gray-500 mt-3 mb-4">
                {currentStepIndex + 1} dari {STATUS_STEPS.length} tahap telah selesai
              </p>

              {/* Progress Bar */}
              <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${statusConfig.color}`}
                  style={{ width: `${statusConfig.progress}%` }}
                ></div>
              </div>

              {/* Status Steps */}
              <div className="flex justify-between mb-4">
                {STATUS_STEPS.map((step, i) => {
                  const isActive = i <= currentStepIndex;
                  return (
                    <div key={step.key} className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full mb-1 ${isActive ? statusConfig.dotColor : 'bg-gray-200'}`}></div>
                      <span className={`text-xs ${isActive ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Timeline */}
              {Object.keys(groupedHistory).length > 0 && (
                <div className="space-y-4 mt-4 pt-4 border-t border-gray-100">
                  {Object.entries(groupedHistory).map(([date, events]) => (
                    <div key={date}>
                      <p className="text-sm font-semibold text-gray-900 mb-2">{date}</p>
                      <div className="space-y-2">
                        {events.map((event, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <div className="flex flex-col items-center">
                              <div className={`w-2.5 h-2.5 rounded-full ${
                                event.status === 'PENDING' ? 'bg-amber-500' :
                                event.status === 'PROCESSING' ? 'bg-blue-500' :
                                event.status === 'FINISHED' ? 'bg-green-500' :
                                'bg-emerald-600'
                              }`}></div>
                              {i < events.length - 1 && (
                                <div className="w-0.5 h-6 bg-gray-200 mt-1"></div>
                              )}
                            </div>
                            <div className="flex-1 pb-2">
                              <p className="text-xs text-gray-500">{formatTime(event.createdAt)}</p>
                              <p className="text-sm text-gray-900">
                                {event.updatedBy ? `${event.updatedBy} ` : ''}
                                Mengubah status ke <span className="font-medium">{STATUS_CONFIG[event.status as keyof typeof STATUS_CONFIG]?.label || event.status}</span>
                              </p>
                              {event.note && (
                                <p className="text-xs text-gray-500 mt-0.5">{event.note}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {Object.keys(groupedHistory).length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">Belum ada riwayat perubahan status</p>
              )}
            </div>
          )}
        </div>

        {/* Galeri Foto */}
        {photos.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Galeri</h3>
              </div>
              <span className="text-sm text-gray-500">{photos.length} Foto</span>
            </div>
            <div className="px-4 pb-4">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {photos.map((photo, index) => (
                  <button
                    key={photo.id}
                    onClick={() => setLightboxIndex(index)}
                    className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-gray-100 hover:opacity-80 transition-opacity"
                  >
                    <img
                      src={photo.url}
                      alt={photo.caption || `Photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">Geser untuk melihat foto selengkapnya</p>
            </div>
          </div>
        )}

        {/* Rincian Harga */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <button
            onClick={() => setShowPriceDetail(!showPriceDetail)}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-semibold text-gray-900">Rincian Layanan</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-900">{formatCurrency(order.totalAmount)}</span>
              {showPriceDetail ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </div>
          </button>

          {showPriceDetail && (
            <div className="px-4 pb-4 border-t border-gray-100">
              {/* Service Items */}
              <div className="space-y-3 mt-3">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.serviceName}</p>
                      <p className="text-xs text-gray-500">{item.qty} {item.serviceType === 'KILOAN' ? 'Kg' : 'Item'}</p>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{formatCurrency(item.subtotal)}</span>
                  </div>
                ))}
              </div>

              {/* Subtotal */}
              <div className="border-t border-gray-100 mt-3 pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium text-gray-900">{formatCurrency(order.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Diskon</span>
                  <span className="text-gray-900">Rp0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Pajak</span>
                  <span className="text-gray-900">Rp0</span>
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 mt-3 pt-3">
                <div className="flex justify-between">
                  <span className="font-bold text-gray-900">Total Biaya</span>
                  <span className="font-bold text-gray-900">{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>

              {/* Payment Status */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pembayaran</span>
                  <span className="text-sm font-medium text-gray-900">{formatCurrency(order.totalAmount)}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${
                    order.paymentStatus === 'PAID'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {order.paymentStatus === 'PAID' ? 'Lunas' : 'Belum Bayar'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Catatan */}
        {order.notes && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Catatan</h3>
            <p className="text-sm text-gray-600">{order.notes}</p>
          </div>
        )}

        {/* Syarat & Ketentuan */}
        {termsAndConditions && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Syarat & Ketentuan</h3>
            <div className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
              {termsAndConditions}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center py-4 border-t border-gray-100 mt-4">
          <p className="text-sm font-medium text-gray-600">
            {shopName} - {new Date().getFullYear()}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Powered by BeyondYou
          </p>
        </div>
      </div>
    </div>
  );
}
