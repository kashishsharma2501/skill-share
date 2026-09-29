import React, { useState } from 'react';
import { Bell, Calendar, MessageSquare, Star, AlertCircle, Check } from 'lucide-react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { mockNotifications } from '@/data/mockNotifications';
import { formatRelativeTime } from '@/utils/format';
import { cn } from '@/utils/cn';
import type { Notification } from '@/types';

const typeIcons: Record<string, React.ReactNode> = {
  booking_request: <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />,
  booking_accepted: <Check className="w-4 h-4 text-green-600 dark:text-green-400" />,
  booking_declined: <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />,
  new_message: <MessageSquare className="w-4 h-4 text-teal-600 dark:text-teal-400" />,
  session_reminder: <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
  new_review: <Star className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
  system: <Bell className="w-4 h-4 text-slate-500" />,
};

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const unread = notifications.filter(n => !n.isRead);
  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  const markRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));

  return (
    <DashboardLayout
      title="Notifications"
      subtitle={unread.length > 0 ? `${unread.length} unread` : 'All caught up'}
      actions={
        unread.length > 0
          ? <Button size="sm" variant="secondary" onClick={markAllRead}>Mark all as read</Button>
          : undefined
      }
    >
      <div className="max-w-2xl">
        {notifications.length === 0 ? (
          <EmptyState
            icon={<Bell className="w-6 h-6" />}
            title="No notifications"
            description="You're all caught up! Notifications about bookings, messages, and sessions will appear here."
          />
        ) : (
          <div className="card overflow-hidden divide-y divide-[#E2E8F0] dark:divide-[#1E293B]">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={cn(
                  'flex items-start gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer',
                  !n.isRead && 'bg-indigo-50/40 dark:bg-indigo-950/10'
                )}
                onClick={() => markRead(n.id)}
              >
                {/* Icon or avatar */}
                {n.avatarUrl ? (
                  <Avatar src={n.avatarUrl} name={n.actorName || ''} size="md" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                    {typeIcons[n.type] || <Bell className="w-4 h-4 text-slate-400" />}
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className={cn('text-sm', !n.isRead ? 'font-semibold text-[#0F172A] dark:text-slate-100' : 'font-medium text-slate-700 dark:text-slate-300')}>
                    {n.title}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{n.body}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{formatRelativeTime(n.timestamp)}</p>
                </div>

                {/* Unread dot */}
                {!n.isRead && (
                  <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0 mt-1.5" aria-label="Unread" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
