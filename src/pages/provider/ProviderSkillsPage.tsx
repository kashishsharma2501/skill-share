import React, { useState } from 'react';
import { Plus, Edit2, Trash2, BookOpen } from 'lucide-react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Modal, ConfirmDialog } from '@/components/ui/Modal';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { useToast } from '@/components/ui/Toast';
import { mockProviders } from '@/data/mockProviders';
import { formatCurrency, formatDuration, capitalise } from '@/utils/format';
import type { ProviderSkill } from '@/types';

const provider = mockProviders.find(p => p.id === 'p1')!;

export function ProviderSkillsPage() {
  const { toast } = useToast();
  const [skills, setSkills] = useState<ProviderSkill[]>(provider.skills);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [editing, setEditing] = useState<ProviderSkill | null>(null);
  const [form, setForm] = useState<Partial<ProviderSkill>>({});

  const openAdd = () => { setEditing(null); setForm({}); setModalOpen(true); };
  const openEdit = (s: ProviderSkill) => { setEditing(s); setForm(s); setModalOpen(true); };

  const handleSave = () => {
    if (!form.skillName || !form.pricePerSession) {
      toast('warning', 'Please fill in all required fields.'); return;
    }
    if (editing) {
      setSkills(prev => prev.map(s => s.skillId === editing.skillId ? { ...s, ...form } as ProviderSkill : s));
      toast('success', 'Skill updated');
    } else {
      const newSkill: ProviderSkill = {
        skillId: `s-${Date.now()}`,
        skillName: form.skillName!,
        category: form.category || 'Other',
        experienceLevel: form.experienceLevel || 'intermediate',
        yearsOfExperience: form.yearsOfExperience || 1,
        pricePerSession: form.pricePerSession!,
        sessionDurationMinutes: form.sessionDurationMinutes || 60,
        learningMode: form.learningMode || 'either',
        description: form.description || '',
      };
      setSkills(prev => [...prev, newSkill]);
      toast('success', 'Skill added');
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setSkills(prev => prev.filter(s => s.skillId !== deleteTarget));
    setDeleteTarget(null);
    toast('info', 'Skill removed');
  };

  return (
    <DashboardLayout
      title="My Skills"
      subtitle="Manage the skills you offer to learners"
      actions={<Button variant="primary" leftIcon={<Plus className="w-4 h-4" />} onClick={openAdd}>Add Skill</Button>}
    >
      {skills.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="w-6 h-6" />}
          title="No skills added yet"
          description="Add a skill to start accepting bookings from learners."
          action={{ label: 'Add Your First Skill', onClick: openAdd }}
        />
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {skills.map((skill) => (
            <div key={skill.skillId} className="card p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className="font-semibold text-[#0F172A] dark:text-slate-100">{skill.skillName}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{skill.category}</p>
                </div>
                <p className="text-lg font-bold text-[#0F172A] dark:text-slate-100 shrink-0">{formatCurrency(skill.pricePerSession)}</p>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">{skill.description || 'No description added.'}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                <Badge variant="indigo">{capitalise(skill.experienceLevel)}</Badge>
                <Badge variant="teal">{skill.yearsOfExperience}y exp.</Badge>
                <Badge variant="default">{formatDuration(skill.sessionDurationMinutes)}</Badge>
                <Badge variant="slate">{skill.learningMode === 'either' ? 'Online/Offline' : capitalise(skill.learningMode)}</Badge>
              </div>
              <div className="flex gap-2 pt-3 border-t border-[#E2E8F0] dark:border-[#1E293B]">
                <Button size="xs" variant="secondary" leftIcon={<Edit2 className="w-3 h-3" />} onClick={() => openEdit(skill)}>Edit</Button>
                <Button size="xs" variant="danger" leftIcon={<Trash2 className="w-3 h-3" />} onClick={() => setDeleteTarget(skill.skillId)}>Remove</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Skill' : 'Add a New Skill'} size="md">
        <div className="space-y-4">
          <Input label="Skill name *" value={form.skillName || ''} onChange={e => setForm(f => ({ ...f, skillName: e.target.value }))} placeholder="e.g. Photography" />
          <Input label="Category" value={form.category || ''} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="e.g. Creative Arts" />
          <Textarea label="Description" value={form.description || ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="What will students learn in your sessions?" rows={3} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Price per session (₹) *" type="number" value={form.pricePerSession || ''} onChange={e => setForm(f => ({ ...f, pricePerSession: Number(e.target.value) }))} placeholder="500" />
            <Input label="Duration (minutes)" type="number" value={form.sessionDurationMinutes || ''} onChange={e => setForm(f => ({ ...f, sessionDurationMinutes: Number(e.target.value) }))} placeholder="60" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Select label="Experience level" value={form.experienceLevel || 'intermediate'}
              onChange={e => setForm(f => ({ ...f, experienceLevel: e.target.value as ProviderSkill['experienceLevel'] }))}
              options={[
                { value: 'beginner', label: 'Beginner' },
                { value: 'intermediate', label: 'Intermediate' },
                { value: 'advanced', label: 'Advanced' },
              ]} />
            <Select label="Learning mode" value={form.learningMode || 'either'}
              onChange={e => setForm(f => ({ ...f, learningMode: e.target.value as ProviderSkill['learningMode'] }))}
              options={[
                { value: 'offline', label: 'Offline' },
                { value: 'online', label: 'Online' },
                { value: 'either', label: 'Either' },
              ]} />
          </div>
          <div className="flex gap-3 justify-end mt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSave}>{editing ? 'Save Changes' : 'Add Skill'}</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Remove skill?"
        description="This skill and its settings will be removed from your profile. Active bookings won't be affected."
        confirmLabel="Remove"
        confirmVariant="danger"
      />
    </DashboardLayout>
  );
}
