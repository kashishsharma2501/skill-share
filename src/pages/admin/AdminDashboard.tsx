import React, { useState } from 'react';
import { useNavigate, NavLink, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard, Users, Briefcase, BookOpen, CalendarCheck,
  Star, BarChart3, ShieldCheck, CheckCircle, XCircle,
  AlertCircle, Menu, X, ExternalLink, ToggleLeft, ToggleRight,
  TrendingUp, Search, Filter,
} from 'lucide-react';
import { Logo } from '@/components/layout/Logo';
import { Avatar } from '@/components/ui/Avatar';
import { StatCard } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { Tabs, TabList, Tab, TabPanel } from '@/components/ui/Tabs';
import { mockProviders } from '@/data/mockProviders';
import { mockReviews } from '@/data/mockReviews';
import { mockBookings } from '@/data/mockBookings';
import {
  skillCatalogue,
  catalogueStats,
  type CatalogueSkill,
  type EvidenceStatus,
} from '@/data/skillCatalogue';
import { formatRelativeTime, formatDate } from '@/utils/format';
import { cn } from '@/utils/cn';

// ── Admin sidebar nav ─────────────────────────────────────────────────────────

const adminNav = [
  { label: 'Dashboard', href: '/admin',           icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: 'Users',     href: '/admin/users',     icon: <Users className="w-4 h-4" /> },
  { label: 'Providers', href: '/admin/providers', icon: <Briefcase className="w-4 h-4" /> },
  { label: 'Skills',    href: '/admin/skills',    icon: <BookOpen className="w-4 h-4" /> },
  { label: 'Bookings',  href: '/admin/bookings',  icon: <CalendarCheck className="w-4 h-4" /> },
  { label: 'Reviews',   href: '/admin/reviews',   icon: <Star className="w-4 h-4" /> },
  { label: 'Reports',   href: '/admin/reports',   icon: <BarChart3 className="w-4 h-4" /> },
  { label: 'Settings',  href: '/admin/settings',  icon: <ShieldCheck className="w-4 h-4" /> },
];

// ── Mock users table ──────────────────────────────────────────────────────────

const mockAdminUsers = [
  { id: 'u1',  name: 'Aditi Singh',    email: 'aditi.singh@email.com',   role: 'learner',  city: 'Ludhiana',    joinedAt: '2026-04-10', isVerified: true  },
  { id: 'u9',  name: 'Meera Joshi',    email: 'meera.joshi@email.com',   role: 'learner',  city: 'Ludhiana',    joinedAt: '2026-06-15', isVerified: true  },
  { id: 'u10', name: 'Naveen Kumar',   email: 'naveen@email.com',        role: 'learner',  city: 'Chandigarh',  joinedAt: '2026-07-20', isVerified: false },
  { id: 'u11', name: 'Tanveer Singh',  email: 'tanveer@email.com',       role: 'learner',  city: 'Ludhiana',    joinedAt: '2026-05-01', isVerified: true  },
  { id: 'u12', name: 'Deepa Menon',    email: 'deepa.menon@email.com',   role: 'learner',  city: 'Chandigarh',  joinedAt: '2026-06-03', isVerified: true  },
  { id: 'u13', name: 'Rajat Khanna',   email: 'rajat.khanna@email.com',  role: 'learner',  city: 'Ludhiana',    joinedAt: '2026-07-14', isVerified: true  },
  { id: 'u14', name: 'Sakshi Arora',   email: 'sakshi.arora@email.com',  role: 'learner',  city: 'Amritsar',    joinedAt: '2026-05-22', isVerified: true  },
  { id: 'u15', name: 'Harpreet Kaur',  email: 'harpreet@email.com',      role: 'learner',  city: 'Chandigarh',  joinedAt: '2026-08-01', isVerified: false },
];

// ── Evidence badge ────────────────────────────────────────────────────────────

function EvidenceBadge({ status }: { status: EvidenceStatus }) {
  return status === 'verified' ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400">
      <CheckCircle className="w-3 h-3" /> Verified
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
      <AlertCircle className="w-3 h-3" /> Needs validation
    </span>
  );
}

// ── Admin sidebar ─────────────────────────────────────────────────────────────

function AdminSidebar({ mobileOpen, onClose }: { mobileOpen?: boolean; onClose?: () => void }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const content = (
    <div className="flex flex-col h-full bg-[#0B1220] w-56 shrink-0">
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800">
        <Logo light size="sm" />
        {onClose && (
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
        <p className="px-3 py-1 text-[10px] font-semibold text-slate-600 uppercase tracking-widest mb-1">
          Admin Panel
        </p>
        {adminNav.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.href === '/admin'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
              )
            }
            onClick={onClose}
          >
            {item.icon} {item.label}
          </NavLink>
        ))}
      </nav>
      {user && (
        <div className="p-3 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <Avatar name={user.name} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-200 truncate">{user.name}</p>
              <p className="text-[10px] text-slate-500">Administrator</p>
            </div>
            <button
              onClick={() => { logout(); navigate('/'); }}
              className="text-slate-500 hover:text-red-400 transition-colors"
              aria-label="Logout"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex h-screen sticky top-0 shrink-0">{content}</aside>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={onClose} />
          <aside className="relative flex h-full animate-slide-in-right">{content}</aside>
        </div>
      )}
    </>
  );
}

// ── Skills tab ────────────────────────────────────────────────────────────────

function SkillsTab() {
  const { toast } = useToast();
  const [skills, setSkills] = useState<CatalogueSkill[]>(skillCatalogue);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | EvidenceStatus>('all');
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = ['all', ...Array.from(new Set(skillCatalogue.map((s) => s.category)))];

  const toggleActive = (id: string) => {
    setSkills((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    );
    const skill = skills.find((s) => s.id === id);
    if (skill) {
      toast('success', skill.isActive ? `"${skill.name}" deactivated` : `"${skill.name}" activated`);
    }
  };

  const filtered = skills.filter((s) => {
    const matchSearch =
      !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.field.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || s.evidenceStatus === filterStatus;
    const matchCategory = filterCategory === 'all' || s.category === filterCategory;
    return matchSearch && matchStatus && matchCategory;
  });

  const activeCount  = skills.filter((s) => s.isActive).length;
  const verifiedCount = skills.filter((s) => s.evidenceStatus === 'verified').length;
  const needsValCount = skills.filter((s) => s.evidenceStatus === 'needs_validation').length;

  return (
    <div className="space-y-5">
      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total in catalogue', value: skills.length,  color: 'text-[#0F172A] dark:text-slate-100' },
          { label: 'Active on platform', value: activeCount,    color: 'text-indigo-600 dark:text-indigo-400' },
          { label: 'Verified evidence',  value: verifiedCount,  color: 'text-green-600 dark:text-green-400'   },
          { label: 'Needs validation',   value: needsValCount,  color: 'text-amber-600 dark:text-amber-400'   },
        ].map((stat) => (
          <div key={stat.label} className="card p-4 text-center">
            <p className={cn('text-2xl font-bold', stat.color)}>{stat.value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Research note */}
      <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 text-xs text-amber-800 dark:text-amber-300">
        <strong>Research note:</strong> Evidence counts are LinkedIn India job-market snapshots (Sep 2026) and SWAYAM/NIELIT training data.
        They indicate that demand exists — they are not a precise labour-market census or guarantee of employment.
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search skills, fields…"
            className="input-base pl-9 py-2 text-sm"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
          className="input-base py-2 text-sm w-44"
        >
          <option value="all">All evidence statuses</option>
          <option value="verified">Verified only</option>
          <option value="needs_validation">Needs validation</option>
        </select>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="input-base py-2 text-sm w-44"
        >
          {categories.map((c) => (
            <option key={c} value={c}>{c === 'all' ? 'All categories' : c}</option>
          ))}
        </select>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {filtered.length} of {skills.length}
        </span>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="bg-slate-50 dark:bg-slate-800 border-b border-[#E2E8F0] dark:border-[#1E293B]">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Skill</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Field</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Evidence</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Source</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#1E293B]">
              {filtered.map((skill) => (
                <tr
                  key={skill.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  {/* Skill name */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg leading-none shrink-0">{skill.icon}</span>
                      <div>
                        <p className="font-medium text-[#0F172A] dark:text-slate-100">{skill.name}</p>
                        <p className="text-xs text-slate-400 hidden sm:block truncate max-w-[180px]">{skill.description}</p>
                      </div>
                    </div>
                  </td>

                  {/* Field */}
                  <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400 hidden md:table-cell max-w-[140px]">
                    <span className="truncate block">{skill.field}</span>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3">
                    <Badge variant="indigo">{skill.category}</Badge>
                  </td>

                  {/* Evidence */}
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <EvidenceBadge status={skill.evidenceStatus} />
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 max-w-[200px] line-clamp-2 hidden xl:block">
                        {skill.evidenceSummary}
                      </p>
                    </div>
                  </td>

                  {/* Source */}
                  <td className="px-4 py-3 hidden lg:table-cell">
                    {skill.sourceUrl ? (
                      <a
                        href={skill.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {skill.sourceLabel}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400">{skill.sourceLabel}</span>
                    )}
                  </td>

                  {/* Active toggle */}
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleActive(skill.id)}
                      className={cn(
                        'inline-flex items-center gap-1 text-xs font-medium transition-colors',
                        skill.isActive
                          ? 'text-green-600 dark:text-green-400 hover:text-red-600 dark:hover:text-red-400'
                          : 'text-slate-400 hover:text-green-600 dark:hover:text-green-400'
                      )}
                      title={skill.isActive ? 'Deactivate skill' : 'Activate skill'}
                    >
                      {skill.isActive ? (
                        <ToggleRight className="w-5 h-5" />
                      ) : (
                        <ToggleLeft className="w-5 h-5" />
                      )}
                      <span className="hidden sm:inline">{skill.isActive ? 'Active' : 'Inactive'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">
              No skills match your current filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Reports tab ───────────────────────────────────────────────────────────────

function ReportsTab() {
  const topSkills = [
    { name: 'Photography',    bookings: 24, providers: 8,  avgRating: 4.9 },
    { name: 'Web Development',bookings: 18, providers: 5,  avgRating: 4.7 },
    { name: 'Graphic Design', bookings: 15, providers: 6,  avgRating: 4.8 },
    { name: 'Guitar',         bookings: 14, providers: 4,  avgRating: 4.9 },
    { name: 'Digital Marketing', bookings: 9, providers: 3, avgRating: 4.5 },
    { name: 'Cooking',        bookings: 8,  providers: 4,  avgRating: 4.8 },
  ];
  const maxBookings = Math.max(...topSkills.map((s) => s.bookings));

  const cityStats = [
    { city: 'Ludhiana',    users: 1240, providers: 312, bookings: 1100 },
    { city: 'Chandigarh',  users: 890,  providers: 198, bookings: 820  },
    { city: 'Amritsar',    users: 420,  providers: 87,  bookings: 310  },
    { city: 'Jalandhar',   users: 310,  providers: 73,  bookings: 188  },
    { city: 'Delhi',       users: 280,  providers: 68,  bookings: 165  },
  ];

  return (
    <div className="space-y-6">
      {/* Top skills by bookings */}
      <div className="card p-6">
        <h3 className="text-sm font-semibold text-[#0F172A] dark:text-slate-100 mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-indigo-500" /> Top Skills by Bookings
        </h3>
        <div className="space-y-3">
          {topSkills.map((skill) => (
            <div key={skill.name} className="flex items-center gap-3">
              <span className="text-sm text-slate-600 dark:text-slate-400 w-36 shrink-0 truncate">
                {skill.name}
              </span>
              <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-indigo-500 dark:bg-indigo-400 h-2 rounded-full transition-all"
                  style={{ width: `${(skill.bookings / maxBookings) * 100}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-[#0F172A] dark:text-slate-100 w-6 text-right shrink-0">
                {skill.bookings}
              </span>
              <span className="text-xs text-amber-500 flex items-center gap-0.5 w-10 shrink-0">
                <Star className="w-3 h-3 fill-current" />{skill.avgRating}
              </span>
              <span className="text-xs text-slate-400 w-20 shrink-0 hidden sm:block">
                {skill.providers} providers
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-4">
          * Demonstration data for academic project. Not derived from live transactions.
        </p>
      </div>

      {/* City breakdown */}
      <div className="card p-6">
        <h3 className="text-sm font-semibold text-[#0F172A] dark:text-slate-100 mb-4">
          Activity by City
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E2E8F0] dark:border-[#1E293B]">
                <th className="text-left pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">City</th>
                <th className="text-right pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">Users</th>
                <th className="text-right pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">Providers</th>
                <th className="text-right pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">Bookings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#1E293B]">
              {cityStats.map((row) => (
                <tr key={row.city}>
                  <td className="py-2.5 font-medium text-[#0F172A] dark:text-slate-100">{row.city}</td>
                  <td className="py-2.5 text-right text-slate-600 dark:text-slate-400">{row.users.toLocaleString()}</td>
                  <td className="py-2.5 text-right text-slate-600 dark:text-slate-400">{row.providers}</td>
                  <td className="py-2.5 text-right font-semibold text-indigo-600 dark:text-indigo-400">{row.bookings.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Main dashboard ────────────────────────────────────────────────────────────

export function AdminDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [providers, setProviders] = useState(mockProviders);

  if (!user || user.role !== 'admin') return <Navigate to="/login" replace />;

  const verifyProvider = (id: string) => {
    setProviders((prev) => prev.map((p) => (p.id === id ? { ...p, isVerified: true } : p)));
    toast('success', 'Provider verified');
  };

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-[#0B1220] overflow-hidden">
      <AdminSidebar mobileOpen={mobileSidebar} onClose={() => setMobileSidebar(false)} />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-white dark:bg-[#111827] border-b border-[#E2E8F0] dark:border-[#1E293B] flex items-center gap-4 px-6 shrink-0">
          <button
            onClick={() => setMobileSidebar(true)}
            className="lg:hidden btn-ghost p-2"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="font-semibold text-[#0F172A] dark:text-slate-100">Admin Panel</h1>
          <div className="ml-auto flex items-center gap-2">
            <span className="badge bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300">
              Admin Mode
            </span>
            <Avatar name={user.name} size="sm" />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {/* Platform stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="Total Users" value="2,847"
              icon={<Users className="w-4 h-4" />} accent="indigo"
              trend={{ value: 1, label: '+124 this week' }}
            />
            <StatCard
              title="Active Providers" value={providers.length.toString()}
              icon={<Briefcase className="w-4 h-4" />} accent="teal"
              trend={{ value: 1, label: `${providers.filter(p => p.isVerified).length} verified` }}
            />
            <StatCard
              title="Total Bookings" value="2,418"
              icon={<CalendarCheck className="w-4 h-4" />} accent="green"
              trend={{ value: 1, label: '+89 this week' }}
            />
            <StatCard
              title="Skills Catalogued" value={catalogueStats.total.toString()}
              icon={<BookOpen className="w-4 h-4" />} accent="amber"
              trend={{ value: 1, label: `${catalogueStats.verified} verified` }}
            />
          </div>

          <Tabs defaultTab="providers">
            <TabList>
              <Tab value="providers">Provider Verification</Tab>
              <Tab value="users">Users</Tab>
              <Tab value="skills">Skills Catalogue</Tab>
              <Tab value="bookings">Bookings</Tab>
              <Tab value="reviews">Reviews</Tab>
              <Tab value="reports">Reports</Tab>
            </TabList>

            <div className="mt-5">
              {/* ── Provider verification ── */}
              <TabPanel value="providers">
                <div className="card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 dark:bg-slate-800 border-b border-[#E2E8F0] dark:border-[#1E293B]">
                        <tr>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Provider</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Skill</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">City</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                          <th className="px-4 py-3" />
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#1E293B]">
                        {providers.map((p) => (
                          <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <Avatar src={p.avatar} name={p.name} size="sm" />
                                <div>
                                  <p className="font-medium text-[#0F172A] dark:text-slate-100">{p.name}</p>
                                  <p className="text-xs text-slate-500 hidden sm:block">{p.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-slate-600 dark:text-slate-400 hidden sm:table-cell">{p.primarySkill}</td>
                            <td className="px-4 py-3 text-slate-600 dark:text-slate-400 hidden md:table-cell">{p.city}</td>
                            <td className="px-4 py-3">
                              {p.isVerified ? (
                                <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 font-medium">
                                  <CheckCircle className="w-3.5 h-3.5" /> Verified
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-medium">
                                  <AlertCircle className="w-3.5 h-3.5" /> Pending
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-right">
                              {!p.isVerified && (
                                <Button size="xs" variant="primary" onClick={() => verifyProvider(p.id)}>
                                  Verify
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabPanel>

              {/* ── Users ── */}
              <TabPanel value="users">
                <div className="card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 dark:bg-slate-800 border-b border-[#E2E8F0] dark:border-[#1E293B]">
                        <tr>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">User</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Role</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">City</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Joined</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Verified</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#1E293B]">
                        {mockAdminUsers.map((u) => (
                          <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <Avatar name={u.name} size="sm" />
                                <div>
                                  <p className="font-medium text-[#0F172A] dark:text-slate-100">{u.name}</p>
                                  <p className="text-xs text-slate-500 hidden sm:block">{u.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 hidden sm:table-cell">
                              <Badge variant="indigo">{u.role}</Badge>
                            </td>
                            <td className="px-4 py-3 text-slate-600 dark:text-slate-400 hidden md:table-cell">{u.city}</td>
                            <td className="px-4 py-3 text-xs text-slate-500">{formatDate(u.joinedAt)}</td>
                            <td className="px-4 py-3">
                              {u.isVerified ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <XCircle className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabPanel>

              {/* ── Skills catalogue ── */}
              <TabPanel value="skills">
                <SkillsTab />
              </TabPanel>

              {/* ── Bookings ── */}
              <TabPanel value="bookings">
                <div className="card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 dark:bg-slate-800 border-b border-[#E2E8F0] dark:border-[#1E293B]">
                        <tr>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Learner</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Provider</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Skill</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Date</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#1E293B]">
                        {mockBookings.map((b) => (
                          <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="px-4 py-3">
                              <p className="font-medium text-[#0F172A] dark:text-slate-100">{b.learnerName}</p>
                            </td>
                            <td className="px-4 py-3 text-slate-600 dark:text-slate-400 hidden sm:table-cell">{b.providerName}</td>
                            <td className="px-4 py-3 text-slate-600 dark:text-slate-400 hidden md:table-cell">{b.skill}</td>
                            <td className="px-4 py-3 text-xs text-slate-500">{formatDate(b.date)}</td>
                            <td className="px-4 py-3">
                              <Badge
                                variant={
                                  b.status === 'completed' ? 'teal'
                                  : b.status === 'accepted'  ? 'success'
                                  : b.status === 'pending'   ? 'warning'
                                  : 'danger'
                                }
                              >
                                {b.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabPanel>

              {/* ── Reviews ── */}
              <TabPanel value="reviews">
                <div className="space-y-3">
                  {mockReviews.map((r) => (
                    <div key={r.id} className="card p-4 flex items-start gap-4 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <Avatar name={r.learnerName} size="xs" />
                          <span className="text-sm font-medium text-[#0F172A] dark:text-slate-100">{r.learnerName}</span>
                          <span className="text-xs text-slate-400">→</span>
                          <span className="text-sm text-slate-600 dark:text-slate-400">{r.providerName}</span>
                          <div className="ml-auto flex items-center gap-0.5">
                            {Array.from({ length: r.rating }).map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">"{r.comment}"</p>
                        <p className="text-xs text-slate-400 mt-1">{formatRelativeTime(r.createdAt)}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Button size="xs" variant="secondary" onClick={() => toast('success', 'Review approved')}>
                          Approve
                        </Button>
                        <Button size="xs" variant="danger" onClick={() => toast('info', 'Review removed')}>
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabPanel>

              {/* ── Reports ── */}
              <TabPanel value="reports">
                <ReportsTab />
              </TabPanel>
            </div>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
