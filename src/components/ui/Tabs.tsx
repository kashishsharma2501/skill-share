import React, { createContext, useContext, useState } from 'react';
import { cn } from '@/utils/cn';

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

interface TabsProps {
  defaultTab: string;
  children: React.ReactNode;
  className?: string;
  onChange?: (tab: string) => void;
}

export function Tabs({ defaultTab, children, className, onChange }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleChange = (tab: string) => {
    setActiveTab(tab);
    onChange?.(tab);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

interface TabListProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'underline' | 'pill';
}

export function TabList({ children, className, variant = 'underline' }: TabListProps) {
  return (
    <div
      role="tablist"
      className={cn(
        variant === 'underline'
          ? 'flex gap-0 border-b border-[#E2E8F0] dark:border-[#1E293B]'
          : 'flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg',
        className
      )}
    >
      {children}
    </div>
  );
}

interface TabProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  count?: number;
  variant?: 'underline' | 'pill';
}

export function Tab({ value, children, className, count, variant = 'underline' }: TabProps) {
  const ctx = useContext(TabsContext);
  if (!ctx) return null;

  const isActive = ctx.activeTab === value;

  if (variant === 'pill') {
    return (
      <button
        role="tab"
        aria-selected={isActive}
        onClick={() => ctx.setActiveTab(value)}
        className={cn(
          'px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-150',
          isActive
            ? 'bg-white dark:bg-slate-700 text-[#0F172A] dark:text-slate-100 shadow-sm'
            : 'text-slate-500 dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-slate-200',
          className
        )}
      >
        {children}
        {count !== undefined && (
          <span className={cn('ml-1.5 px-1.5 py-0.5 text-xs rounded-full', isActive ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-500')}>
            {count}
          </span>
        )}
      </button>
    );
  }

  return (
    <button
      role="tab"
      aria-selected={isActive}
      onClick={() => ctx.setActiveTab(value)}
      className={cn(
        'px-4 py-3 text-sm font-medium border-b-2 transition-all duration-150 -mb-px',
        isActive
          ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
          : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-slate-200 hover:border-slate-300',
        className
      )}
    >
      {children}
      {count !== undefined && (
        <span className={cn('ml-1.5 px-1.5 py-0.5 text-xs rounded-full', isActive ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-300' : 'bg-slate-100 text-slate-500 dark:bg-slate-800')}>
          {count}
        </span>
      )}
    </button>
  );
}

interface TabPanelProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function TabPanel({ value, children, className }: TabPanelProps) {
  const ctx = useContext(TabsContext);
  if (!ctx || ctx.activeTab !== value) return null;

  return (
    <div role="tabpanel" className={cn('animate-fade-in', className)}>
      {children}
    </div>
  );
}
