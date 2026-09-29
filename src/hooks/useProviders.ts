import { useState, useEffect } from 'react';
import { getProviders } from '@/services/providerService';
import type { Provider } from '@/types';

interface UseProvidersOptions {
  query?: string;
  category?: string;
  distanceKm?: number;
  maxPrice?: number;
  mode?: string;
  minRating?: number;
  experienceLevel?: string;
}

export function useProviders(options: UseProvidersOptions = {}) {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getProviders(options)
      .then(setProviders)
      .catch((e) => setError(e.message ?? 'Failed to load providers'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    options.query,
    options.category,
    options.distanceKm,
    options.maxPrice,
    options.mode,
    options.minRating,
    options.experienceLevel,
  ]);

  return { providers, loading, error };
}
