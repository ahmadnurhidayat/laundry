'use client';

import { useState, useRef } from 'react';
import { Camera, Upload, Trash2 } from 'lucide-react';

interface Photo {
  id: string;
  url: string;
  caption: string | null;
  sortOrder: number;
}

interface PhotoUploadProps {
  orderId: string;
  initialPhotos?: Photo[];
}

export function PhotoUpload({ orderId, initialPhotos = [] }: PhotoUploadProps) {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('orderId', orderId);
      formData.append('file', file);

      const response = await fetch('/api/orders/photos', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data: { photo: Photo } = await response.json();
        setPhotos((prev) => [...prev, data.photo]);
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (photoId: string) => {
    try {
      const response = await fetch(`/api/orders/photos?id=${photoId}&orderId=${orderId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPhotos((prev) => prev.filter((p) => p.id !== photoId));
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink flex items-center gap-2">
          <Camera className="h-4 w-4 text-ink-muted" />
          Foto Pesanan
        </h3>
        <span className="text-xs text-ink-muted">{photos.length} foto</span>
      </div>

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`border border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          dragActive
            ? 'border-brand bg-brand-subtle'
            : 'border-border-subtle hover:border-border-strong hover:bg-canvas'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleUpload(e.target.files[0]);
            }
          }}
          className="hidden"
        />
        <Upload className="h-8 w-8 text-ink-muted mx-auto mb-2" />
        <p className="text-sm text-ink-muted">
          {uploading ? 'Mengunggah...' : 'Klik atau seret foto ke sini'}
        </p>
        <p className="text-xs text-ink-muted mt-1">JPG, PNG, WebP (maks 5MB)</p>
      </div>

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group aspect-square rounded-lg overflow-hidden bg-canvas border border-border-subtle">
              <img
                src={photo.url}
                alt={photo.caption || 'Foto pesanan'}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => handleDelete(photo.id)}
                  className="p-2 bg-status-alert rounded-lg text-white hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              {photo.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-ink/60 text-white text-xs p-1 truncate">
                  {photo.caption}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
