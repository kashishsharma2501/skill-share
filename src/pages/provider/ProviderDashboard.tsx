import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Star, TrendingUp, Users, Clock, Check, X, MessageSquare } from 'lucide-react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { StatCard } from '@/components/ui/StatCard';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import { mockBookings } from '@/data/mockBookings';
import { mockReviews } from '@/data/mockReviews';
import { formatDate, formatTime, formatCurrency } from '@/utils/format';
import type { Booking } from '@/types';

export function ProviderDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>(mockBookings.filter((b) => b.providerId === 'p1'));

  const pending = bookings.filter((b) => b.status === 'pending');
  const upcoming = bookings.filter((b) => b.status === 'accepted');
  const completed = bookings.filter((b) => b.status === 'completed');
  const providerReviews = mockReviews.filter((r) => r.providerId === 'p1');

  const handleAccept = (id: string) => {
    setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: 'accepted' as const } : b));
    toast('success', 'Booking accepted', 'The learner has been notified.');
  };

  const handleDecline = (id: string) => {
    setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: 'declined' as const } : b));
    toast('info', 'Booking declined');
  };

  const avgRating = providerReviews.length
    ? (providerReviews.reduce((s, r) => s + r.rating, 0) / providerReviews.length).toFixed(1)
    : '4.9';

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0F172A] dark:text-slate-100 tracking-tight">Provider Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-0.5">Manage your sessions, skills, and earnings.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Upcoming Sessions" value={upcoming.length} icon={<Calendar className="w-4 h-4" />} accent="indigo"
          trend={{ value: 1, label: 'This week' }} />
        <StatCard title="Pending Requests" value={pending.length} icon={<Clock className="w-4 h-4" />} accent="amber"
          trend={{ value: pending.length, label: 'Need response' }} />
        <StatCard title="Avg Rating" value={avgRating} icon={<Star className="w-4 h-4" />} accent="green"
          trend={{ value: 1, label: `${providerReviews.length} reviews` }} />
        <StatCard title="Total Sessions" value="112" icon={<TrendingUp className="w-4 h-4" />} accent="teal"
          trend={{ value: 8, label: '+8 this month' }} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Pending requests */}
        <div className="lg:col-span-2 space-y-5">
          <section>
            <h2 className="text-base font-semibold text-[#0F172A] dark:text-slate-100 mb-3">
              Pending Requests
              {pending.length > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 rounded-full">
                  {pending.length}
                </span>
              )}
            </h2>
            {pending.length === 0 ? (
              <div className="card p-6 text-center text-sm text-slate-500 dark:text-slate-400">
                No pending requests right now.
              </div>
            ) : (
              <div className="space-y-3">
                {pending.map((b) => (
                  <div key={b.id} className="card p-4 border-l-4 border-l-amber-400">
                    <div className="flex items-start gap-3">
                      <Avatar src={b.learnerAvatar} name={b.learnerName} size="md" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[#0F172A] dark:text-slate-100 text-sm">{b.learnerName}</p>
                        <p className="text-xs text-indigo-600 dark:text-indigo-400">{b.skill}</p>
                        <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(b.date)}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatTime(b.time)}</span>
                          <span className="font-semibold text-[#0F172A] dark:text-slate-100">{formatCurrency(b.price)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3 pt-3 border-t border-[#E2E8F0] dark:border-[#1E293B]">
                      <Button size="xs" variant="primary" leftIcon={<Check className="w-3 h-3" />}
                        onClick={() => handleAccept(b.id)}>
                        Accept
                      </Button>
                      <Button size="xs" variant="danger" leftIcon={<X className="w-3 h-3" />}
                        onClick={() => handleDecline(b.id)}>
                        Decline
                      </Button>
                      <Button size="xs" variant="secondary" leftIcon={<MessageSquare className="w-3 h-3" />}
                        onClick={() => navigate('/provider/messages')}>
                        Message
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#0F172A] dark:text-slate-100 mb-3">Upcoming Sessions</h2>
            {upcoming.length === 0 ? (
              <div className="card p-6 text-center text-sm text-slate-500 dark:text-slate-400">No upcoming sessions.</div>
            ) : (
              <div className="space-y-3">
                {upcoming.map((b) => (
                  <div key={b.id} className="card p-4 flex items-start gap-3">
                    <Avatar src={b.learnerAvatar} name={b.learnerName} size="md" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#0F172A] dark:text-slate-100 text-sm">{b.learnerName}</p>
                      <p className="text-xs text-indigo-600 dark:text-indigo-400">{b.skill}</p>
                      <div className="flex flex-wrap gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400">
                        <span>{formatDate(b.date)}</span>
                        <span>{formatTime(b.time)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <StatusBadge status={b.status} />
                      <p className="text-sm font-bold text-[#0F172A] dark:text-slate-100 mt-1">{formatCurrency(b.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right widgets */}
        <div className="space-y-5">
          {/* Earnings snapshot */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-[#0F172A] dark:text-slate-100 mb-4">Earnings</h3>
            <div className="space-y-3">
              {[
                { label: 'This month', value: '₹8,400', highlight: true },
                { label: 'Last month', value: '₹11,200', highlight: false },
                { label: 'Total earned', value: '₹56,000', highlight: false },
              ].map((e) => (
                <div key={e.label} className="flex justify-between items-center">
                  <span className="text-sm text-slate-500 dark:text-slate-400">{e.label}</span>
                  <span className={`text-sm font-bold ${e.highlight ? 'text-green-600 dark:text-green-400' : 'text-[#0F172A] dark:text-slate-100'}`}>
                    {e.value}
                  </span>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="w-full mt-4" onClick={() => navigate('/provider/earnings')}>
              View Full Report
            </Button>
          </div>

          {/* Recent reviews */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-[#0F172A] dark:text-slate-100">Recent Reviews</h3>
              <button onClick={() => navigate('/provider/reviews')} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">See all</button>
            </div>
            <div className="space-y-3">
              {providerReviews.slice(0, 2).map((r) => (
                <div key={r.id} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Avatar src={r.learnerAvatar} name={r.learnerName} size="xs" />
                    <span className="text-xs font-medium text-[#0F172A] dark:text-slate-100">{r.learnerName}</span>
                    <div className="ml-auto flex items-center gap-0.5">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">"{r.comment}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-[#0F172A] dark:text-slate-100 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { label: 'Manage Skills', path: '/provider/skills' },
                { label: 'View Profile', path: '/providers/p1' },
                { label: 'All Bookings', path: '/provider/bookings' },
                { label: 'Earnings Report', path: '/provider/earnings' },
              ].map((l) => (
                <button key={l.label} onClick={() => navigate(l.path)}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-[#0F172A] dark:hover:text-slate-100 transition-colors flex items-center justify-between">
                  {l.label}
                  <span className="text-slate-300 dark:text-slate-600">›</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
