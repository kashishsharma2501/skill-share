import React, { useState } from 'react';
import { Clock, Plus, Trash2, Save, Info } from 'lucide-react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/utils/cn';
import { mockProviders } from '@/data/mockProviders';
import type { Availability } from '@/types';

// ── Types ─────────────────────────────────────────────────────────────────────

type DayKey = Availability['day'];

const ALL_DAYS: { key: DayKey; label: string; short: string }[] = [
  { key: 'monday',    label: 'Monday',    short: 'Mon' },
  { key: 'tuesday',  label: 'Tuesday',   short: 'Tue' },
  { key: 'wednesday',label: 'Wednesday', short: 'Wed' },
  { key: 'thursday', label: 'Thursday',  short: 'Thu' },
  { key: 'friday',   label: 'Friday',    short: 'Fri' },
  { key: 'saturday', label: 'Saturday',  short: 'Sat' },
  { key: 'sunday',   label: 'Sunday',    short: 'Sun' },
];

// Suggested time slots a provider can pick from
const SUGGESTED_SLOTS = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00',
];

function formatSlot(slot: string): string {
  const [h, m] = slot.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const display = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${display}:${String(m).padStart(2, '0')} ${period}`;
}

// ── Sub-components ────────────────────────────────────────────────────────────

interface DayRowProps {
  day: { key: DayKey; label: string; short: string };
  slots: string[];
  enabled: boolean;
  onToggle: () => void;
  onAddSlot: (slot: string) => void;
  onRemoveSlot: (slot: string) => void;
}

function DayRow({ day, slots, enabled, onToggle, onAddSlot, onRemoveSlot }: DayRowProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const remaining = SUGGESTED_SLOTS.filter((s) => !slots.includes(s));

  return (
    <div
      className={cn(
        'rounded-xl border transition-colors',
        enabled
          ? 'border-indigo-200 dark:border-indigo-800 bg-indigo-50/30 dark:bg-indigo-950/10'
          : 'border-[#E2E8F0] dark:border-[#1E293B] bg-white dark:bg-[#111827]'
      )}
    >
      {/* Day header */}
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Toggle */}
        <button
          role="switch"
          aria-checked={enabled}
          onClick={onToggle}
          className={cn(
            'relative shrink-0 w-10 h-5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/30',
            enabled ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'
          )}
          aria-label={`${enabled ? 'Disable' : 'Enable'} ${day.label}`}
        >
          <span
            className={cn(
              'absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform',
              enabled && 'translate-x-5'
            )}
          />
        </button>

        <span
          className={cn(
            'text-sm font-semibold w-24 shrink-0',
            enabled
              ? 'text-[#0F172A] dark:text-slate-100'
              : 'text-slate-400 dark:text-slate-500'
          )}
        >
          {day.label}
        </span>

        {/* Slot chips */}
        {enabled && (
          <div className="flex items-center gap-2 flex-wrap flex-1">
            {slots.length === 0 && (
              <span className="text-xs text-slate-400 italic">No slots added</span>
            )}
            {slots.sort().map((slot) => (
              <span
                key={slot}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-950/40 text-xs font-medium text-indigo-700 dark:text-indigo-300"
              >
                <Clock className="w-3 h-3" />
                {formatSlot(slot)}
                <button
                  onClick={() => onRemoveSlot(slot)}
                  className="ml-0.5 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  aria-label={`Remove ${formatSlot(slot)}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        {!enabled && (
          <span className="text-xs text-slate-400 dark:text-slate-500 italic">Unavailable</span>
        )}

        {/* Add slot */}
        {enabled && (
          <div className="relative shrink-0 ml-auto">
            <Button
              size="xs"
              variant="outline"
              leftIcon={<Plus className="w-3 h-3" />}
              onClick={() => setPickerOpen(!pickerOpen)}
              disabled={remaining.length === 0}
            >
              Add slot
            </Button>
            {pickerOpen && remaining.length > 0 && (
              <div className="absolute right-0 top-full mt-1 z-20 bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1E293B] rounded-xl shadow-elevated p-2 grid grid-cols-3 gap-1 w-44">
                {remaining.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => { onAddSlot(slot); setPickerOpen(false); }}
                    className="px-2 py-1.5 text-xs font-medium rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:text-indigo-600 dark:hover:text-indigo-400 text-slate-600 dark:text-slate-400 transition-colors text-center"
                  >
                    {formatSlot(slot)}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

const provider = mockProviders.find((p) => p.id === 'p1')!;

export function ProviderAvailabilityPage() {
  const { toast } = useToast();

  // Build initial state: enabled days + their slots
  const [schedule, setSchedule] = useState<Record<DayKey, string[]>>(() => {
    const initial: Record<DayKey, string[]> = {
      monday: [], tuesday: [], wednesday: [], thursday: [],
      friday: [], saturday: [], sunday: [],
    };
    provider.availability.forEach((a) => {
      initial[a.day] = [...a.slots];
    });
    return initial;
  });

  const [enabledDays, setEnabledDays] = useState<Set<DayKey>>(() => {
    const s = new Set<DayKey>();
    provider.availability.forEach((a) => s.add(a.day));
    return s;
  });

  const [saving, setSaving] = useState(false);

  const toggleDay = (day: DayKey) => {
    setEnabledDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) {
        next.delete(day);
      } else {
        next.add(day);
      }
      return next;
    });
  };

  const addSlot = (day: DayKey, slot: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: [...prev[day], slot].sort(),
    }));
  };

  const removeSlot = (day: DayKey, slot: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: prev[day].filter((s) => s !== slot),
    }));
  };

  const totalSlots = Array.from(enabledDays).reduce(
    (sum, day) => sum + schedule[day].length,
    0
  );

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    toast('success', 'Availability saved', 'Learners can now book on your available days.');
  };

  const clearAll = () => {
    setEnabledDays(new Set());
    setSchedule({
      monday: [], tuesday: [], wednesday: [], thursday: [],
      friday: [], saturday: [], sunday: [],
    });
    toast('info', 'Schedule cleared');
  };

  // Quick-fill presets
  const applyPreset = (preset: 'weekdays' | 'weekends' | 'evenings') => {
    if (preset === 'weekdays') {
      const days: DayKey[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
      setEnabledDays(new Set(days));
      setSchedule((prev) => {
        const next = { ...prev };
        days.forEach((d) => { if (next[d].length === 0) next[d] = ['09:00', '11:00', '14:00']; });
        return next;
      });
    } else if (preset === 'weekends') {
      const days: DayKey[] = ['saturday', 'sunday'];
      setEnabledDays(new Set(days));
      setSchedule((prev) => {
        const next = { ...prev };
        days.forEach((d) => { if (next[d].length === 0) next[d] = ['10:00', '12:00', '14:00', '16:00']; });
        return next;
      });
    } else {
      const days: DayKey[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
      setEnabledDays(new Set(days));
      setSchedule((prev) => {
        const next = { ...prev };
        days.forEach((d) => { if (next[d].length === 0) next[d] = ['17:00', '18:00', '19:00']; });
        return next;
      });
    }
    toast('info', 'Preset applied — adjust as needed');
  };

  return (
    <DashboardLayout
      title="Availability"
      subtitle="Set the days and times learners can book sessions with you"
      actions={
        <Button
          variant="primary"
          leftIcon={<Save className="w-4 h-4" />}
          onClick={handleSave}
          loading={saving}
        >
          {!saving && 'Save Schedule'}
        </Button>
      }
    >
      <div className="max-w-3xl space-y-6">

        {/* Info banner */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900">
          <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
          <p className="text-sm text-indigo-700 dark:text-indigo-300 leading-relaxed">
            Toggle each day on to mark it available, then add specific time slots.
            Learners see only these slots when booking. You can update your schedule anytime.
          </p>
        </div>

        {/* Summary + presets */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <span className="font-semibold text-[#0F172A] dark:text-slate-100">{enabledDays.size}</span> days enabled
              {' · '}
              <span className="font-semibold text-[#0F172A] dark:text-slate-100">{totalSlots}</span> total slots
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-500 dark:text-slate-400 shrink-0">Quick presets:</span>
            {(
              [
                { id: 'weekdays', label: 'Weekdays' },
                { id: 'weekends', label: 'Weekends' },
                { id: 'evenings', label: 'Weekday evenings' },
              ] as const
            ).map((p) => (
              <button
                key={p.id}
                onClick={() => applyPreset(p.id)}
                className="px-2.5 py-1 text-xs font-medium rounded-lg border border-[#E2E8F0] dark:border-[#1E293B] text-slate-600 dark:text-slate-400 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400 bg-white dark:bg-[#111827] transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Day rows */}
        <div className="space-y-2">
          {ALL_DAYS.map((day) => (
            <DayRow
              key={day.key}
              day={day}
              slots={schedule[day.key]}
              enabled={enabledDays.has(day.key)}
              onToggle={() => toggleDay(day.key)}
              onAddSlot={(slot) => addSlot(day.key, slot)}
              onRemoveSlot={(slot) => removeSlot(day.key, slot)}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={clearAll}
            className="text-sm text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear all
          </button>
          <Button
            variant="primary"
            leftIcon={<Save className="w-4 h-4" />}
            onClick={handleSave}
            loading={saving}
          >
            {!saving && 'Save Schedule'}
          </Button>
        </div>

        {/* Tip */}
        <div className="card p-4">
          <h3 className="text-xs font-semibold text-[#0F172A] dark:text-slate-100 mb-1">
            Tips for setting availability
          </h3>
          <ul className="space-y-1 text-xs text-slate-500 dark:text-slate-400 list-disc pl-4">
            <li>Add at least 4–6 slots per week to maximise bookings.</li>
            <li>Weekend slots tend to fill up first — add extra buffer.</li>
            <li>Evening slots (5–8 PM) are popular with working learners.</li>
            <li>Keep your schedule updated — outdated availability reduces trust.</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}
