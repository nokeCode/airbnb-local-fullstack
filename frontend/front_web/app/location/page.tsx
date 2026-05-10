'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';

export default function LocationPage() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState('');

  const syncFromParams = useCallback(() => {
    const q = searchParams?.get('q') ?? '';
    setQuery(q);
  }, [searchParams]);

  useEffect(() => {
    syncFromParams();
  }, [syncFromParams]);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-900">Location</h1>
        <p className="mt-2 text-sm text-gray-600">
          Page de recherche location (placeholder).
        </p>

        <div className="mt-6 rounded-2xl border border-gray-200 p-4">
          <div className="text-sm text-gray-700">
            Recherche actuelle (param `q`) :{' '}
            <span className="font-semibold">{query || '—'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
