import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Check, X, MessageSquare } from 'lucide-react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Tabs, TabList, Tab, TabPanel } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { StatusBadge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { useToast } from '@/components/ui/Toast';
import { mockBookings } from '@/data/mockBookings';
import { formatDate, formatTime, formatCurrency } from '@/utils/format';
import type { Booking } from '@/types';

export function ProviderBookingsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>(mockBookings.filter(b => b.providerId === 'p1'));

  const pending = bookings.filter(b => b.status === 'pending');
  const upcoming = bookings.filter(b => b.status === 'accepted');
  const completed = bookings.filter(b => b.status === 'completed');
  const cancelled = bookings.filter(b => b.status === 'cancelled' || b.status === 'declined');

  const accept = (id: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'accepted' as const } : b));
    toast('success', 'Booking accepted');
  };
  const decline = (id: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'declined' as const } : b));
    toast('info', 'Booking declined');
  };

  const BookingRow = ({ b, showActions }: { b: Booking; showActions?: boolean }) => (
    <div className="card p-4 flex items-start gap-3">
      <Avatar src={b.learnerAvatar} name={b.learnerName} size="md" />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div>
            <p className="font-semibold text-[#0F172A] dark:text-slate-100 text-sm">{b.learnerName}</p>
            <p className="text-xs text-indigo-600 dark:text-indigo-400">{b.skill}</p>
          </div>
          <StatusBadge status={b.status} />
        </div>
        <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(b.date)}</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatTime(b.time)}</span>
          <span className="font-semibold text-[#0F172A] dark:text-slate-100">{formatCurrency(b.price)}</span>
        </div>
        {showActions && (
          <div className="flex gap-2 mt-2.5">
            <Button size="xs" variant="primary" leftIcon={<Check className="w-3 h-3" />} onClick={() => accept(b.id)}>Accept</Button>
            <Button size="xs" variant="danger" leftIcon={<X className="w-3 h-3" />} onClick={() => decline(b.id)}>Decline</Button>
            <Button size="xs" variant="secondary" leftIcon={<MessageSquare className="w-3 h-3" />} onClick={() => navigate('/provider/messages')}>Message</Button>
          </div>
        )}
      </div>
    </div>
  );

  const Empty = ({ label }: { label: string }) => (
    <EmptyState icon={<Calendar className="w-6 h-6" />} title={`No ${label.toLowerCase()} bookings`} description="Bookings will appear here as learners request sessions." />
  );

  return (
    <DashboardLayout title="Bookings" subtitle="Manage all your session requests">
      <Tabs defaultTab="pending">
        <TabList>
          <Tab value="pending" count={pending.length}>Requests</Tab>
          <Tab value="upcoming" count={upcoming.length}>Upcoming</Tab>
          <Tab value="completed" count={completed.length}>Completed</Tab>
          <Tab value="cancelled" count={cancelled.length}>Cancelled</Tab>
        </TabList>
        <div className="mt-5 space-y-3">
          <TabPanel value="pending">
            {pending.length === 0 ? <Empty label="Pending" /> : pending.map(b => <BookingRow key={b.id} b={b} showActions />)}
          </TabPanel>
          <TabPanel value="upcoming">
            {upcoming.length === 0 ? <Empty label="Upcoming" /> : upcoming.map(b => <BookingRow key={b.id} b={b} />)}
          </TabPanel>
          <TabPanel value="completed">
            {completed.length === 0 ? <Empty label="Completed" /> : completed.map(b => <BookingRow key={b.id} b={b} />)}
          </TabPanel>
          <TabPanel value="cancelled">
            {cancelled.length === 0 ? <Empty label="Cancelled" /> : cancelled.map(b => <BookingRow key={b.id} b={b} />)}
          </TabPanel>
        </div>
      </Tabs>
    </DashboardLayout>
  );
}
