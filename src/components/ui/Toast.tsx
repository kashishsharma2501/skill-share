import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@/utils/cn';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  description?: string;
}

interface ToastContextValue {
  toasts: Toast[];
  toast: (type: ToastType, message: string, description?: string) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((type: ToastType, message: string, description?: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, type, message, description }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

const toastIcons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="w-4 h-4 text-green-600" />,
  error: <XCircle className="w-4 h-4 text-red-600" />,
  warning: <AlertCircle className="w-4 h-4 text-amber-600" />,
  info: <Info className="w-4 h-4 text-indigo-600" />,
};

const toastClasses: Record<ToastType, string> = {
  success: 'border-l-green-500',
  error: 'border-l-red-500',
  warning: 'border-l-amber-500',
  info: 'border-l-indigo-500',
};

function ToastContainer({ toasts, dismiss }: { toasts: Toast[]; dismiss: (id: string) => void }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            'flex items-start gap-3 min-w-[300px] max-w-sm pointer-events-auto',
            'bg-white dark:bg-slate-800 rounded-xl shadow-elevated border border-[#E2E8F0] dark:border-slate-700',
            'border-l-4 px-4 py-3 animate-slide-up'
          , toastClasses[t.type])}
        >
          <div className="shrink-0 mt-0.5">{toastIcons[t.type]}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#0F172A] dark:text-slate-100">{t.message}</p>
            {t.description && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t.description}</p>
            )}
          </div>
          <button
            onClick={() => dismiss(t.id)}
            className="shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
