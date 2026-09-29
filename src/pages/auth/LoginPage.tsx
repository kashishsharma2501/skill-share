import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react';
import { Logo } from '@/components/layout/Logo';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/utils/cn';

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [email, setEmail] = useState('aditi.singh@email.com');
  const [password, setPassword] = useState('demo1234');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [role, setRole] = useState<'learner' | 'provider' | 'admin'>('learner');

  const redirectTo = searchParams.get('redirect') || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setError('');
    setLoading(true);
    try {
      await login(email, password, role);
      const dest = role === 'provider' ? '/provider' : role === 'admin' ? '/admin' : redirectTo;
      navigate(dest, { replace: true });
    } catch {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1220] flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0B1220] flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-indigo-600/10 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-teal-600/10 blur-3xl" />
        </div>
        <Logo light size="md" />
        <div>
          <blockquote className="text-white text-xl font-medium leading-relaxed mb-4">
            "I found a photography teacher 3 km from my home. Three sessions in and I can already see the difference."
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold">A</div>
            <div>
              <p className="text-white text-sm font-medium">Aditi Singh</p>
              <p className="text-slate-400 text-xs">Learner · Ludhiana</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: '680+ Providers', sub: 'Across Punjab & Delhi' },
            { label: '4.8/5 Rating', sub: 'Average session rating' },
            { label: '2,400+ Sessions', sub: 'Completed to date' },
            { label: '1,250+ Skills', sub: 'Available to learn' },
          ].map((s) => (
            <div key={s.label} className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-white font-semibold text-sm">{s.label}</p>
              <p className="text-slate-400 text-xs">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo + theme */}
          <div className="flex items-center justify-between mb-8 lg:hidden">
            <Logo size="sm" />
            <button onClick={toggleTheme} className="btn-ghost p-2" aria-label="Toggle theme">
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
          </div>
          <div className="hidden lg:flex justify-end mb-6">
            <button onClick={toggleTheme} className="btn-ghost p-2" aria-label="Toggle theme">
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
          </div>

          <h1 className="text-2xl font-bold text-[#0F172A] dark:text-slate-100 mb-1">Welcome back</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
            Don't have an account?{' '}
            <Link to="/signup" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
              Sign up free
            </Link>
          </p>

          {/* Demo role switcher */}
          <div className="mb-6 p-3 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 rounded-xl">
            <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-2">Demo — choose a role to explore:</p>
            <div className="flex gap-2">
              {(['learner', 'provider', 'admin'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={cn(
                    'flex-1 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors',
                    role === r
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-[#E2E8F0] dark:border-slate-700 hover:border-indigo-300'
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              required
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                <span className="text-sm text-slate-600 dark:text-slate-400">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                Forgot password?
              </Link>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-sm text-red-700 dark:text-red-400">
                {error}
              </div>
            )}

            <Button type="submit" variant="primary" className="w-full h-11" loading={loading}>
              {!loading && <>Sign In <ArrowRight className="w-4 h-4" /></>}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#E2E8F0] dark:border-[#1E293B]">
            <p className="text-xs text-center text-slate-400">
              This is a private application. Unauthorised access is prohibited.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
