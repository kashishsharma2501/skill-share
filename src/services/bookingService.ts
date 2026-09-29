/**
 * Booking service — mock implementation.
 * Replace with real API calls when backend is ready.
 */
import { mockBookings } from '@/data/mockBookings';
import type { Booking, BookingStatus } from '@/types';

export async function getBookingsByLearner(learnerId: string): Promise<Booking[]> {
  await new Promise((r) => setTimeout(r, 200));
  return mockBookings.filter((b) => b.learnerId === learnerId);
}

export async function getBookingsByProvider(providerId: string): Promise<Booking[]> {
  await new Promise((r) => setTimeout(r, 200));
  return mockBookings.filter((b) => b.providerId === providerId);
}

export async function createBooking(
  data: Omit<Booking, 'id' | 'status' | 'createdAt' | 'updatedAt'>
): Promise<Booking> {
  await new Promise((r) => setTimeout(r, 800));
  const booking: Booking = {
    ...data,
    id: `b-${Date.now()}`,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  // In a real app: POST /api/bookings
  return booking;
}

export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus
): Promise<Booking> {
  await new Promise((r) => setTimeout(r, 300));
  const booking = mockBookings.find((b) => b.id === bookingId);
  if (!booking) throw new Error('Booking not found');
  // In a real app: PATCH /api/bookings/:id
  return { ...booking, status, updatedAt: new Date().toISOString() };
}
