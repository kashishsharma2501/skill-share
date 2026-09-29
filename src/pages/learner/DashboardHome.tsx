import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Calendar, MapPin, Star, Sparkles, TrendingUp, Clock } from 'lucide-react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { StatCard } from '@/components/ui/StatCard';
import { MatchScore } from '@/components/ui/MatchScore';
import { StatusBadge } from '@/components/ui/Badge';
import { useAuth } from '@/context/AuthContext';
import { mockProviders } from '@/data/mockProviders';
import { mockBookings } from '@/data/mockBookings';
import { popularSkills } from '@/data/mockSkills';
import { formatDate, formatTime, formatCurrency } from '@/utils/format';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export function LearnerDashboardHome() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const upcomingBookings = mockBookings.filter(
    (b) => b.learnerId === 'u1' && (b.status === 'accepted' || b.status === 'pending')
  );
  const recommendedProviders = mockProviders.slice(0, 4);
  const firstName = user?.name.split(' ')[0] || 'there';

  return (
    <DashboardLayout>
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0F172A] dark:text-slate-100 tracking-tight">
          {getGreeting()}, {firstName}.
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-0.5">Here's what's happening with your learning journey.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Sessions Booked" value="3" icon={<Calendar className="w-4 h-4" />} accent="indigo"
          trend={{ value: 1, label: '1 this month' }} />
        <StatCard title="Completed" value="1" icon={<TrendingUp className="w-4 h-4" />} accent="teal"
          trend={{ value: 1, label: 'Guitar completed' }} />
        <StatCard title="Skills Exploring" value="3" icon={<Sparkles className="w-4 h-4" />} accent="green" />
        <StatCard title="Providers Met" value="3" icon={<Star className="w-4 h-4" />} accent="amber"
          trend={{ value: 0, label: '4.9 avg rating' }} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left — main content */}
        <div className="lg:col-span-2 space-y-6">

          {/* Upcoming bookings */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-[#0F172A] dark:text-slate-100">Upcoming Sessions</h2>
              <button onClick={() => navigate('/dashboard/bookings')} className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                All bookings <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {upcomingBookings.length === 0 ? (
              <div className="card p-8 text-center">
                <Calendar className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-[#0F172A] dark:text-slate-100">No upcoming sessions</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">Explore skills and book your first session</p>
                <Button size="sm" variant="primary" onClick={() => navigate('/explore')}>Explore Skills</Button>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingBookings.map((b) => (
                  <div key={b.id} className="card p-4 flex items-start gap-3 hover:shadow-card transition-shadow cursor-pointer" onClick={() => navigate('/dashboard/bookings')}>
                    <Avatar src={b.providerAvatar} name={b.providerName} size="md" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-[#0F172A] dark:text-slate-100">{b.skill}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">with {b.providerName}</p>
                        </div>
                        <StatusBadge status={b.status} />
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(b.date)}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatTime(b.time)}</span>
                        {b.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{b.location}</span>}
                      </div>
                    </div>
                    <p className="text-sm font-bold text-[#0F172A] dark:text-slate-100 shrink-0">{formatCurrency(b.price)}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Recommended providers */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-[#0F172A] dark:text-slate-100">Recommended for You</h2>
              <button onClick={() => navigate('/explore')} className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                See all <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {recommendedProviders.map((p) => (
                <div
                  key={p.id}
                  className="card p-4 hover:shadow-card transition-all cursor-pointer group"
                  onClick={() => navigate(`/providers/${p.id}`)}
                >
                  <div className="flex items-start gap-3">
                    <Avatar src={p.avatar} name={p.name} size="md" online={p.isOnline} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <p className="text-sm font-semibold text-[#0F172A] dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                          {p.name}
                        </p>
                        {p.isVerified && (
                          <svg className="w-3.5 h-3.5 text-indigo-600 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <p className="text-xs text-indigo-600 dark:text-indigo-400">{p.primarySkill}</p>
                      <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-0.5"><Star className="w-3 h-3 fill-amber-400 text-amber-400" />{p.rating}</span>
                        <span>·</span>
                        <span>{p.distanceKm} km</span>
                        <span>·</span>
                        <span>{formatCurrency(p.skills[0].pricePerSession)}</span>
                      </div>
                    </div>
                    {p.matchScore && <MatchScore score={p.matchScore} />}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right — sidebar widgets */}
        <div className="space-y-5">
          {/* Quick search */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-[#0F172A] dark:text-slate-100 mb-3">Explore skills</h3>
            <div className="grid grid-cols-2 gap-2">
              {popularSkills.slice(0, 6).map((s) => (
                <button
                  key={s.id}
                  onClick={() => navigate(`/explore?q=${s.name}`)}
                  className="flex items-center gap-2 p-2.5 rounded-lg border border-[#E2E8F0] dark:border-[#1E293B] hover:border-indigo-200 dark:hover:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 transition-all text-left group"
                >
                  <span className="text-base">{s.icon}</span>
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate">{s.name}</span>
                </button>
              ))}
            </div>
            <Button variant="outline" size="sm" className="w-full mt-3" onClick={() => navigate('/explore')}>
              Browse all skills
            </Button>
          </div>

          {/* AI Assistant teaser */}
          <div className="card p-5 border-indigo-100 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-950/20">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">Skill Assistant</h3>
              <span className="badge bg-indigo-100 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 text-[10px]">Preview</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
              Tell the assistant what you want to learn and get personalised provider recommendations.
            </p>
            <Button variant="primary" size="sm" className="w-full" onClick={() => navigate('/explore?assistant=true')}>
              Try AI Assistant
            </Button>
          </div>

          {/* Location indicator */}
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <p className="text-sm font-medium text-[#0F172A] dark:text-slate-100">Your location</p>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Ludhiana, Punjab</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Showing providers within 10 km</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
