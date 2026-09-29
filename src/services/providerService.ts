/**
 * Provider service — mock implementation.
 * Replace each function body with a real API call (fetch/axios) when the backend is ready.
 * All signatures are intentionally preserved for easy swap-out.
 */
import { mockProviders } from '@/data/mockProviders';
import type { Provider } from '@/types';

export async function getProviders(filters?: {
  query?: string;
  category?: string;
  distanceKm?: number;
  maxPrice?: number;
  mode?: string;
  minRating?: number;
  experienceLevel?: string;
}): Promise<Provider[]> {
  await new Promise((r) => setTimeout(r, 300)); // simulate latency
  let results = [...mockProviders];

  if (filters?.query) {
    const q = filters.query.toLowerCase();
    results = results.filter(
      (p) =>
        p.primarySkill.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.skills.some((s) => s.skillName.toLowerCase().includes(q))
    );
  }
  if (filters?.category) {
    results = results.filter((p) => p.primaryCategory === filters.category);
  }
  if (filters?.distanceKm !== undefined) {
    results = results.filter((p) => p.distanceKm <= filters.distanceKm!);
  }
  if (filters?.maxPrice !== undefined) {
    results = results.filter((p) =>
      p.skills.some((s) => s.pricePerSession <= filters.maxPrice!)
    );
  }
  if (filters?.mode && filters.mode !== 'Either') {
    const mode = filters.mode.toLowerCase();
    results = results.filter((p) =>
      p.skills.some((s) => s.learningMode === mode || s.learningMode === 'either')
    );
  }
  if (filters?.minRating !== undefined) {
    results = results.filter((p) => p.rating >= filters.minRating!);
  }
  if (filters?.experienceLevel) {
    const exp = filters.experienceLevel.toLowerCase() as Provider['skills'][0]['experienceLevel'];
    results = results.filter((p) => p.skills.some((s) => s.experienceLevel === exp));
  }

  return results;
}

export async function getProviderById(id: string): Promise<Provider | null> {
  await new Promise((r) => setTimeout(r, 150));
  return mockProviders.find((p) => p.id === id) ?? null;
}

export async function getRecommendedProviders(
  _userId: string,
  _skillPreferences: string[]
): Promise<Provider[]> {
  await new Promise((r) => setTimeout(r, 400));
  // Future: call AI matching engine /api/match?userId=...
  return mockProviders.slice(0, 4);
}
