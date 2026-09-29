import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, User, MapPin, ArrowRight } from 'lucide-react';
import { Logo } from '@/components/layout/Logo';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/utils/cn';

const indianCities = [
  'Ludhiana', 'Chandigarh', 'Amritsar', 'Jalandhar', 'Delhi',
  'Patiala', 'Mohali', 'Gurugram', 'Noida', 'Jaipur',
];

export function SignupPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  const defaultRole = searchParams.get('role') === 'provider' ? 'provider' : 'learner';

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    city: 'Ludhiana',
    role: defaultRole as 'learner' | 'provider',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState<'form' | 'verify'>('form');

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required.';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Enter a valid email address.';
    if (form.password.length < 8) e.password = 'Password must be at least 8 characters.';
    if (!form.city) e.city = 'Please select your city.';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setStep('verify');
  };

  const handleVerified = async () => {
    setLoading(true);
    await login(form.email, form.password, form.role);
    setLoading(false);
    navigate('/onboarding', { replace: true });
  };

  if (step === 'verify') {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1220] flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 flex items-center justify-center mx-auto mb-6">
            <Mail className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-2xl font-bold text-[#0F172A] dark:text-slate-100 mb-2">Check your email</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-2">
            We sent a verification link to
          </p>
          <p className="font-semibold text-[#0F172A] dark:text-slate-100 mb-6">{form.email}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
            Click the link in the email to verify your account. For this demo, you can skip verification.
          </p>
          <div className="space-y-3">
            <Button variant="primary" className="w-full" onClick={handleVerified} loading={loading}>
              Continue to Onboarding <ArrowRight className="w-4 h-4" />
            </Button>
            <Button variant="ghost" className="w-full text-sm" onClick={() => setStep('form')}>
              Back to signup
            </Button>
          </div>
          <p className="text-xs text-slate-400 mt-6">
            Didn't receive it? Check your spam folder or{' '}
            <button className="text-indigo-600 dark:text-indigo-400 hover:underline">resend email</button>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1220] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Logo size="md" />
        </div>

        <div className="card p-8">
          <h1 className="text-2xl font-bold text-[#0F172A] dark:text-slate-100 mb-1">Create your account</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
              Sign in
            </Link>
          </p>

          {/* Role selection */}
          <div className="mb-6">
            <p className="text-sm font-medium text-[#0F172A] dark:text-slate-200 mb-2">I want to…</p>
            <div className="grid grid-cols-2 gap-3">
              {([
                { value: 'learner', label: 'Learn a skill', icon: '📚', desc: 'Find local teachers' },
                { value: 'provider', label: 'Teach a skill', icon: '🎓', desc: 'Share your expertise' },
              ] as const).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, role: opt.value }))}
                  className={cn(
                    'flex flex-col items-center gap-1 p-4 rounded-xl border-2 text-center transition-all',
                    form.role === opt.value
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 dark:border-indigo-500'
                      : 'border-[#E2E8F0] dark:border-[#1E293B] hover:border-slate-300 dark:hover:border-slate-600'
                  )}
                >
                  <span className="text-2xl">{opt.icon}</span>
                  <span className={cn('text-sm font-semibold', form.role === opt.value ? 'text-indigo-700 dark:text-indigo-300' : 'text-[#0F172A] dark:text-slate-100')}>
                    {opt.label}
                  </span>
                  <span className="text-xs text-slate-500">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <Input
              label="Full name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Aditi Singh"
              autoComplete="name"
              leftIcon={<User className="w-4 h-4" />}
              error={errors.name}
            />
            <Input
              label="Email address"
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="you@example.com"
              autoComplete="email"
              leftIcon={<Mail className="w-4 h-4" />}
              error={errors.email}
            />
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              leftIcon={<Lock className="w-4 h-4" />}
              error={errors.password}
              rightIcon={
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-400 hover:text-slate-600 transition-colors" aria-label={showPassword ? 'Hide' : 'Show'}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              hint="Minimum 8 characters"
            />
            <div>
              <label className="block text-sm font-medium text-[#0F172A] dark:text-slate-200 mb-1.5">Your city</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <select
                  value={form.city}
                  onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                  className="input-base pl-10 appearance-none"
                >
                  {indianCities.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city}</p>}
            </div>

            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input type="checkbox" required className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  I agree to the{' '}
                  <Link to="/terms" className="text-indigo-600 dark:text-indigo-400 hover:underline">Terms of Use</Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-indigo-600 dark:text-indigo-400 hover:underline">Privacy Policy</Link>
                </span>
              </label>
            </div>

            <Button type="submit" variant="primary" className="w-full h-11" loading={loading}>
              {!loading && <>Create Account <ArrowRight className="w-4 h-4" /></>}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
