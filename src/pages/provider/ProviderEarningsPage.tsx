import React from 'react';
import { TrendingUp, ArrowUpRight } from 'lucide-react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { StatCard } from '@/components/ui/StatCard';
import { formatCurrency } from '@/utils/format';

const monthlyData = [
  { month: 'Mar', sessions: 8, earnings: 4000 },
  { month: 'Apr', sessions: 11, earnings: 5500 },
  { month: 'May', sessions: 9, earnings: 4500 },
  { month: 'Jun', sessions: 14, earnings: 7000 },
  { month: 'Jul', sessions: 12, earnings: 6000 },
  { month: 'Aug', sessions: 17, earnings: 8400 },
];

const maxEarnings = Math.max(...monthlyData.map(d => d.earnings));

const recentPayments = [
  { learner: 'Naveen Kumar', skill: 'Photo Editing', date: '5 Aug 2026', amount: 400 },
  { learner: 'Meera Joshi', skill: 'Photography', date: '3 Aug 2026', amount: 500 },
  { learner: 'Tanveer Singh', skill: 'Photography', date: '28 Jul 2026', amount: 500 },
  { learner: 'Deepa Menon', skill: 'Photography', date: '21 Jul 2026', amount: 500 },
  { learner: 'Rajat Khanna', skill: 'Photography', date: '14 Jul 2026', amount: 500 },
];

export function ProviderEarningsPage() {
  return (
    <DashboardLayout title="Earnings" subtitle="Track your session income">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="This Month" value="₹8,400" icon={<TrendingUp className="w-4 h-4" />} accent="green"
          trend={{ value: 1, label: '↑ vs last month' }} />
        <StatCard title="Last Month" value="₹6,000" icon={<TrendingUp className="w-4 h-4" />} accent="teal" />
        <StatCard title="This Year" value="₹41,400" icon={<TrendingUp className="w-4 h-4" />} accent="indigo" />
        <StatCard title="Total" value="₹56,000" icon={<TrendingUp className="w-4 h-4" />} accent="amber" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Bar chart */}
        <div className="card p-6">
          <h3 className="text-sm font-semibold text-[#0F172A] dark:text-slate-100 mb-5">Monthly Earnings</h3>
          <div className="flex items-end gap-3 h-40">
            {monthlyData.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-xs font-semibold text-teal-600 dark:text-teal-400">
                  ₹{(d.earnings / 1000).toFixed(1)}k
                </span>
                <div className="w-full rounded-t-md bg-indigo-100 dark:bg-indigo-950/40 relative overflow-hidden"
                  style={{ height: `${(d.earnings / maxEarnings) * 100}%`, minHeight: '8px' }}>
                  <div className="absolute inset-0 bg-indigo-500 dark:bg-indigo-400 opacity-80" />
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent payments */}
        <div className="card p-6">
          <h3 className="text-sm font-semibold text-[#0F172A] dark:text-slate-100 mb-4">Recent Payments</h3>
          <div className="space-y-3">
            {recentPayments.map((p, i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#0F172A] dark:text-slate-100">{p.learner}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{p.skill} · {p.date}</p>
                </div>
                <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span className="text-sm font-semibold">{formatCurrency(p.amount)}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-[#E2E8F0] dark:border-[#1E293B] flex justify-between items-center">
            <span className="text-sm text-slate-500 dark:text-slate-400">August total (so far)</span>
            <span className="text-base font-bold text-green-600 dark:text-green-400">₹8,400</span>
          </div>
        </div>
      </div>

      <div className="mt-5 card p-5">
        <p className="text-xs text-slate-400 text-center">
          Earnings figures are based on mock demonstration data. Real payment processing will be integrated in Phase 2.
        </p>
      </div>
    </DashboardLayout>
  );
}
