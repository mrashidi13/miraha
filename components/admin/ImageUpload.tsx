'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

interface Props {
  name: string;
  initialUrl?: string;
  label?: string;
}

export function ImageUpload({ name, initialUrl, label = 'Photo' }: Props) {
  const [url, setUrl] = useState(initialUrl ?? '');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? 'Upload failed');
      }
      const { url: newUrl } = await res.json();
      setUrl(newUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs text-text-muted font-body font-medium uppercase tracking-wider">
        {label}
      </label>

      {url && (
        <div className="relative w-full h-40 rounded-xl overflow-hidden border border-primary/20 bg-primary-light">
          <Image src={url} alt="Preview" fill className="object-cover" />
          <button
            type="button"
            onClick={() => setUrl('')}
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 text-white text-xs flex items-center justify-center hover:bg-black/70"
            aria-label="Remove image"
          >
            ×
          </button>
        </div>
      )}

      <div className="flex gap-2 items-center">
        <input type="hidden" name={name} value={url} />
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="sr-only"
          id={`file-${name}`}
        />
        <label
          htmlFor={`file-${name}`}
          className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-primary/30 bg-bg text-sm font-body text-text hover:border-primary hover:bg-primary-light transition-colors"
        >
          {uploading ? (
            <>
              <span className="animate-spin inline-block w-3 h-3 border-2 border-primary border-t-transparent rounded-full" />
              Uploading…
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {url ? 'Change image' : 'Upload image'}
            </>
          )}
        </label>

        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="or paste URL…"
          className="flex-1 rounded-lg border border-primary/30 px-3 py-2 font-body text-sm bg-bg focus:outline-none focus:border-primary text-text placeholder:text-text-muted"
        />
      </div>

      {error && <p className="text-xs text-red-500 font-body">{error}</p>}
    </div>
  );
}
