import { useState, useEffect } from 'react';
import { getBookingsByLearner, getBookingsByProvider } from '@/services/bookingService';
import type { Booking } from '@/types';

export function useLearnerBookings(learnerId: string) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!learnerId) return;
    setLoading(true);
    getBookingsByLearner(learnerId)
      .then(setBookings)
      .finally(() => setLoading(false));
  }, [learnerId]);

  return { bookings, setBookings, loading };
}

export function useProviderBookings(providerId: string) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!providerId) return;
    setLoading(true);
    getBookingsByProvider(providerId)
      .then(setBookings)
      .finally(() => setLoading(false));
  }, [providerId]);

  return { bookings, setBookings, loading };
}
