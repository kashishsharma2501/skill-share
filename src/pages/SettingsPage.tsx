import React, { useState } from 'react';
import { User, Lock, Bell, Palette, MapPin, Save } from 'lucide-react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Tabs, TabList, Tab, TabPanel } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/utils/cn';

const indianCities = ['Ludhiana', 'Chandigarh', 'Amritsar', 'Jalandhar', 'Delhi', 'Patiala', 'Mohali', 'Gurugram'];

export function SettingsPage() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    city: user?.city || 'Ludhiana',
    bio: 'Curious learner exploring creative and tech skills in Ludhiana.',
    languages: 'Hindi, Punjabi, English',
  });

  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [notifPrefs, setNotifPrefs] = useState({
    bookingUpdates: true,
    messages: true,
    sessionReminders: true,
    reviews: true,
    marketing: false,
  });

  const saveProfile = () => toast('success', 'Profile updated');
  const savePassword = () => {
    if (!passwords.current || !passwords.newPass) { toast('warning', 'Please fill in all password fields.'); return; }
    if (passwords.newPass !== passwords.confirm) { toast('error', 'New passwords do not match.'); return; }
    if (passwords.newPass.length < 8) { toast('error', 'Password must be at least 8 characters.'); return; }
    toast('success', 'Password changed successfully');
    setPasswords({ current: '', newPass: '', confirm: '' });
  };

  return (
    <DashboardLayout title="Settings">
      <div className="max-w-2xl">
        <Tabs defaultTab="profile">
          <TabList>
            <Tab value="profile">Profile</Tab>
            <Tab value="security">Security</Tab>
            <Tab value="notifications">Notifications</Tab>
            <Tab value="appearance">Appearance</Tab>
          </TabList>

          <div className="mt-6">
            {/* Profile */}
            <TabPanel value="profile">
              <div className="card p-6 space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <Avatar src={user?.avatar} name={user?.name || 'User'} size="xl" />
                  <div>
                    <p className="text-sm font-medium text-[#0F172A] dark:text-slate-100">Profile photo</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 mb-2">Auto-generated from your name</p>
                    <Button size="xs" variant="secondary">Change Photo</Button>
                  </div>
                </div>

                <div className="divider" />

                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="Full name" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} leftIcon={<User className="w-4 h-4" />} />
                  <Input label="Email address" type="email" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0F172A] dark:text-slate-200 mb-1.5">City</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <select value={profile.city} onChange={e => setProfile(p => ({ ...p, city: e.target.value }))}
                      className="input-base pl-10 appearance-none">
                      {indianCities.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0F172A] dark:text-slate-200 mb-1.5">Bio</label>
                  <textarea value={profile.bio} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                    rows={3} className="input-base resize-none" placeholder="Tell learners or providers a bit about yourself." />
                </div>

                <Input label="Languages" value={profile.languages} onChange={e => setProfile(p => ({ ...p, languages: e.target.value }))} hint="Comma-separated" />

                <div className="flex justify-end">
                  <Button variant="primary" leftIcon={<Save className="w-4 h-4" />} onClick={saveProfile}>Save Changes</Button>
                </div>
              </div>
            </TabPanel>

            {/* Security */}
            <TabPanel value="security">
              <div className="card p-6 space-y-5">
                <div>
                  <h3 className="text-base font-semibold text-[#0F172A] dark:text-slate-100 mb-1">Change Password</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Use a strong password of at least 8 characters.</p>
                  <div className="space-y-4">
                    <Input label="Current password" type="password" value={passwords.current}
                      onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))}
                      leftIcon={<Lock className="w-4 h-4" />} />
                    <Input label="New password" type="password" value={passwords.newPass}
                      onChange={e => setPasswords(p => ({ ...p, newPass: e.target.value }))} />
                    <Input label="Confirm new password" type="password" value={passwords.confirm}
                      onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))} />
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button variant="primary" onClick={savePassword}>Update Password</Button>
                  </div>
                </div>

                <div className="divider" />

                <div>
                  <h3 className="text-base font-semibold text-[#0F172A] dark:text-slate-100 mb-4">Login Sessions</h3>
                  <div className="p-4 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-800 dark:text-green-300">Current session</p>
                        <p className="text-xs text-green-600 dark:text-green-500">Chrome · Ludhiana, India · Active now</p>
                      </div>
                      <span className="badge bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>

            {/* Notifications */}
            <TabPanel value="notifications">
              <div className="card p-6">
                <h3 className="text-base font-semibold text-[#0F172A] dark:text-slate-100 mb-5">Email Notifications</h3>
                <div className="space-y-4">
                  {(Object.entries(notifPrefs) as [keyof typeof notifPrefs, boolean][]).map(([key, val]) => {
                    const labels: Record<string, { title: string; desc: string }> = {
                      bookingUpdates: { title: 'Booking updates', desc: 'When a booking is confirmed, declined, or cancelled' },
                      messages: { title: 'New messages', desc: 'When you receive a new message from a provider or learner' },
                      sessionReminders: { title: 'Session reminders', desc: '24 hours before an upcoming session' },
                      reviews: { title: 'Reviews', desc: 'When someone leaves you a review' },
                      marketing: { title: 'Tips & announcements', desc: 'Platform updates, tips, and community news' },
                    };
                    const label = labels[key];
                    return (
                      <div key={key} className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium text-[#0F172A] dark:text-slate-100">{label.title}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{label.desc}</p>
                        </div>
                        <button
                          role="switch"
                          aria-checked={val}
                          onClick={() => setNotifPrefs(p => ({ ...p, [key]: !p[key] }))}
                          className={cn(
                            'relative shrink-0 w-10 h-5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/30',
                            val ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'
                          )}
                        >
                          <span className={cn('absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform', val && 'translate-x-5')} />
                        </button>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-end mt-6">
                  <Button variant="primary" leftIcon={<Save className="w-4 h-4" />} onClick={() => toast('success', 'Preferences saved')}>Save Preferences</Button>
                </div>
              </div>
            </TabPanel>

            {/* Appearance */}
            <TabPanel value="appearance">
              <div className="card p-6">
                <h3 className="text-base font-semibold text-[#0F172A] dark:text-slate-100 mb-1">Theme</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Choose how SkillShare Local looks for you.</p>
                <div className="grid grid-cols-3 gap-3">
                  {([
                    { value: 'light', label: 'Light', preview: 'bg-white border-slate-200' },
                    { value: 'dark', label: 'Dark', preview: 'bg-slate-900 border-slate-700' },
                  ] as const).map((opt) => (
                    <button key={opt.value} onClick={() => setTheme(opt.value)}
                      className={cn(
                        'p-4 rounded-xl border-2 text-center transition-all',
                        theme === opt.value ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/30' : 'border-[#E2E8F0] dark:border-[#1E293B] hover:border-slate-300'
                      )}>
                      <div className={cn('w-full h-12 rounded-lg border mb-2 mx-auto', opt.preview)} />
                      <p className={cn('text-sm font-medium', theme === opt.value ? 'text-indigo-700 dark:text-indigo-300' : 'text-[#0F172A] dark:text-slate-100')}>{opt.label}</p>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-4">Your theme preference is saved locally to your browser.</p>
              </div>
            </TabPanel>
          </div>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
