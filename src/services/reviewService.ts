/**
 * Review service — mock implementation.
 */
import { mockReviews } from '@/data/mockReviews';
import type { Review } from '@/types';

export async function getReviewsByProvider(providerId: string): Promise<Review[]> {
  await new Promise((r) => setTimeout(r, 200));
  return mockReviews.filter((r) => r.providerId === providerId);
}

export async function getReviewsByLearner(learnerId: string): Promise<Review[]> {
  await new Promise((r) => setTimeout(r, 200));
  return mockReviews.filter((r) => r.learnerId === learnerId);
}

export async function submitReview(
  data: Omit<Review, 'id' | 'createdAt' | 'isVerified'>
): Promise<Review> {
  await new Promise((r) => setTimeout(r, 600));
  const review: Review = {
    ...data,
    id: `r-${Date.now()}`,
    createdAt: new Date().toISOString(),
    isVerified: true,
  };
  // In a real app: POST /api/reviews
  return review;
}
