import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export function Modal({ isOpen, onClose, title, description, children, size = 'md', className }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={cn(
          'relative w-full bg-white dark:bg-[#111827] rounded-2xl shadow-modal',
          'border border-[#E2E8F0] dark:border-[#1E293B]',
          'animate-scale-in',
          sizeClasses[size],
          className
        )}
      >
        {/* Header */}
        {(title || description) && (
          <div className="flex items-start justify-between p-6 pb-4">
            <div>
              {title && (
                <h2 id="modal-title" className="text-lg font-semibold text-[#0F172A] dark:text-slate-100">
                  {title}
                </h2>
              )}
              {description && (
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="btn-ghost p-2 -mt-1 -mr-1 shrink-0"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {!title && !description && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 btn-ghost p-2 z-10"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <div className={cn('px-6 pb-6', title || description ? '' : 'pt-6')}>
          {children}
        </div>
      </div>
    </div>
  );
}

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  confirmVariant?: 'danger' | 'primary';
  loading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  confirmVariant = 'danger',
  loading,
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} description={description} size="sm">
      <div className="flex gap-3 justify-end mt-2">
        <button onClick={onClose} className="btn-secondary">
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className={cn('btn-primary', confirmVariant === 'danger' && 'bg-red-600 hover:bg-red-700 focus:ring-red-500/30')}
        >
          {loading ? 'Processing...' : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
