/**
 * mockSkills.ts
 *
 * Platform-facing skill and category data.
 * Core catalogue with research metadata lives in skillCatalogue.ts.
 * This file exposes the leaner Skill/SkillCategory shapes used by the UI.
 */

import type { Skill, SkillCategory } from '@/types';
import { activeSkills } from './skillCatalogue';

// ── Categories ───────────────────────────────────────────────────────────────

export const skillCategories: SkillCategory[] = [
  { id: 'cat1', name: 'Technology',        icon: '💻', count: 156 },
  { id: 'cat2', name: 'Creative Arts',     icon: '🎨', count: 134 },
  { id: 'cat3', name: 'Business',          icon: '📊', count: 89  },
  { id: 'cat4', name: 'Music',             icon: '🎵', count: 76  },
  { id: 'cat5', name: 'Health & Wellness', icon: '🏋️', count: 63  },
  { id: 'cat6', name: 'Culinary Arts',     icon: '🍳', count: 52  },
  { id: 'cat7', name: 'Languages',         icon: '🌐', count: 38  },
  { id: 'cat8', name: 'Education',         icon: '📚', count: 71  },
];

// ── Derive Skill[] from the verified catalogue ────────────────────────────────
// Maps the richer CatalogueSkill shape → the leaner Skill type the UI uses.

const catalogueDerived: Skill[] = activeSkills
  .sort((a, b) => a.popularityRank - b.popularityRank)
  .map((s) => ({
    id: s.id,
    name: s.name,
    category: s.category,
    icon: s.icon,
    description: s.description,
    popularityRank: s.popularityRank,
  }));

// ── Platform supplements ──────────────────────────────────────────────────────
// Strong local demand; not in the research Excel but well-established in India.

const platformSupplements: Skill[] = [
  {
    id: 'ms_yoga',
    name: 'Yoga',
    category: 'Health & Wellness',
    icon: '🧘',
    description: 'Mindful movement and breathing practices for body and mind.',
    popularityRank: 40,
  },
  {
    id: 'ms_english',
    name: 'English Speaking',
    category: 'Languages',
    icon: '🗣️',
    description: 'Build fluency and confidence in spoken English.',
    popularityRank: 41,
  },
  {
    id: 'ms_dance',
    name: 'Classical Dance',
    category: 'Creative Arts',
    icon: '💃',
    description: 'Bharatanatyam, Kathak, and folk dance forms.',
    popularityRank: 42,
  },
  {
    id: 'ms_piano',
    name: 'Piano / Keyboard',
    category: 'Music',
    icon: '🎹',
    description: 'Keyboard fundamentals to advanced piano repertoire.',
    popularityRank: 43,
  },
  {
    id: 'ms_drawing',
    name: 'Drawing & Sketching',
    category: 'Creative Arts',
    icon: '✏️',
    description: 'Pencil, charcoal, and digital illustration fundamentals.',
    popularityRank: 44,
  },
  {
    id: 'ms_maths',
    name: 'Mathematics',
    category: 'Education',
    icon: '📐',
    description: 'School and competitive exam maths preparation.',
    popularityRank: 45,
  },
  {
    id: 'ms_photo_editing',
    name: 'Photo Editing',
    category: 'Creative Arts',
    icon: '🖼️',
    description: 'Lightroom, Photoshop, and colour grading workflows.',
    popularityRank: 46,
  },
];

// ── Merge, deduplicate by name, re-sort ───────────────────────────────────────

const merged = [...catalogueDerived, ...platformSupplements];
const seenNames = new Set<string>();

export const popularSkills: Skill[] = merged
  .filter((s) => {
    if (seenNames.has(s.name)) return false;
    seenNames.add(s.name);
    return true;
  })
  .sort((a, b) => a.popularityRank - b.popularityRank);

export const allSkillNames = popularSkills.map((s) => s.name);
