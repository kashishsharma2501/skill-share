import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, MessageSquare, Star, X, Eye } from 'lucide-react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Tabs, TabList, Tab, TabPanel } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { StatusBadge } from '@/components/ui/Badge';
import { Modal, ConfirmDialog } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import { mockBookings } from '@/data/mockBookings';
import { formatDate, formatTime, formatCurrency, formatDuration } from '@/utils/format';
import type { Booking } from '@/types';

function BookingCard({ booking, onCancel, onReview, onMessage }: {
  booking: Booking;
  onCancel?: (b: Booking) => void;
  onReview?: (b: Booking) => void;
  onMessage?: (b: Booking) => void;
}) {
  const navigate = useNavigate();
  return (
    <div className="card p-5 hover:shadow-card transition-shadow">
      <div className="flex items-start gap-3">
        <Avatar src={booking.providerAvatar} name={booking.providerName} size="lg" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <p className="font-semibold text-[#0F172A] dark:text-slate-100">{booking.skill}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">with {booking.providerName}</p>
            </div>
            <StatusBadge status={booking.status} />
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2.5 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(booking.date)}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatTime(booking.time)} · {formatDuration(booking.durationMinutes)}</span>
            <span className="flex items-center gap-1 capitalize">{booking.mode === 'either' ? 'Flexible' : booking.mode}</span>
            {booking.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{booking.location}</span>}
          </div>

          {booking.notes && (
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 italic">"{booking.notes}"</p>
          )}
        </div>

        <div className="text-right shrink-0">
          <p className="text-base font-bold text-[#0F172A] dark:text-slate-100">{formatCurrency(booking.price)}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#E2E8F0] dark:border-[#1E293B] flex-wrap">
        <Button size="xs" variant="secondary" leftIcon={<Eye className="w-3 h-3" />}
          onClick={() => navigate(`/providers/${booking.providerId}`)}>
          View Provider
        </Button>
        {(booking.status === 'accepted' || booking.status === 'pending') && onMessage && (
          <Button size="xs" variant="secondary" leftIcon={<MessageSquare className="w-3 h-3" />}
            onClick={() => onMessage(booking)}>
            Message
          </Button>
        )}
        {booking.status === 'completed' && onReview && (
          <Button size="xs" variant="teal" leftIcon={<Star className="w-3 h-3" />}
            onClick={() => onReview(booking)}>
            Leave Review
          </Button>
        )}
        {(booking.status === 'pending' || booking.status === 'accepted') && onCancel && (
          <Button size="xs" variant="danger" leftIcon={<X className="w-3 h-3" />}
            onClick={() => onCancel(booking)}
            className="ml-auto">
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
}

export function MyBookingsPage() {
  const navigate = useNavigate();
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
  const [bookings, setBookings] = useState(mockBookings.filter((b) => b.learnerId === 'u1'));

  const upcoming = bookings.filter((b) => b.status === 'accepted');
  const pending = bookings.filter((b) => b.status === 'pending');
  const completed = bookings.filter((b) => b.status === 'completed');
  const cancelled = bookings.filter((b) => b.status === 'cancelled' || b.status === 'declined');

  const handleCancel = (b: Booking) => setCancelTarget(b);
  const confirmCancel = () => {
    if (!cancelTarget) return;
    setBookings((prev) => prev.map((b) => b.id === cancelTarget.id ? { ...b, status: 'cancelled' as const } : b));
    setCancelTarget(null);
  };

  const handleMessage = (b: Booking) => navigate('/dashboard/messages');
  const handleReview = (b: Booking) => navigate('/dashboard/reviews?newReview=true&bookingId=' + b.id);

  const EmptyBookings = ({ label }: { label: string }) => (
    <EmptyState
      icon={<Calendar className="w-6 h-6" />}
      title={`No ${label.toLowerCase()} bookings`}
      description="Your bookings will appear here once you start learning."
      action={{ label: 'Explore Skills', onClick: () => navigate('/explore') }}
    />
  );

  return (
    <DashboardLayout title="My Bookings" subtitle="Track all your learning sessions">
      <Tabs defaultTab="upcoming">
        <TabList>
          <Tab value="upcoming" count={upcoming.length}>Upcoming</Tab>
          <Tab value="pending" count={pending.length}>Pending</Tab>
          <Tab value="completed" count={completed.length}>Completed</Tab>
          <Tab value="cancelled" count={cancelled.length}>Cancelled</Tab>
        </TabList>

        <div className="mt-5">
          <TabPanel value="upcoming">
            {upcoming.length === 0 ? <EmptyBookings label="Upcoming" /> : (
              <div className="space-y-4">
                {upcoming.map((b) => (
                  <BookingCard key={b.id} booking={b} onCancel={handleCancel} onMessage={handleMessage} />
                ))}
              </div>
            )}
          </TabPanel>

          <TabPanel value="pending">
            {pending.length === 0 ? <EmptyBookings label="Pending" /> : (
              <div className="space-y-4">
                {pending.map((b) => (
                  <BookingCard key={b.id} booking={b} onCancel={handleCancel} onMessage={handleMessage} />
                ))}
              </div>
            )}
          </TabPanel>

          <TabPanel value="completed">
            {completed.length === 0 ? <EmptyBookings label="Completed" /> : (
              <div className="space-y-4">
                {completed.map((b) => (
                  <BookingCard key={b.id} booking={b} onReview={handleReview} onMessage={handleMessage} />
                ))}
              </div>
            )}
          </TabPanel>

          <TabPanel value="cancelled">
            {cancelled.length === 0 ? <EmptyBookings label="Cancelled" /> : (
              <div className="space-y-4">
                {cancelled.map((b) => (
                  <BookingCard key={b.id} booking={b} />
                ))}
              </div>
            )}
          </TabPanel>
        </div>
      </Tabs>

      <ConfirmDialog
        isOpen={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={confirmCancel}
        title="Cancel booking?"
        description={`Are you sure you want to cancel your ${cancelTarget?.skill} session with ${cancelTarget?.providerName}? This cannot be undone.`}
        confirmLabel="Yes, Cancel"
        confirmVariant="danger"
      />
    </DashboardLayout>
  );
}
