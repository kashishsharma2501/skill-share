import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Search, SlidersHorizontal, X, MapPin, Sparkles, ChevronDown,
  Bot, Send, BookOpen,
} from 'lucide-react';
import { PublicLayout } from '@/layouts/PublicLayout';
import { ProviderCard } from '@/components/ui/ProviderCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState, SkeletonList } from '@/components/ui/EmptyState';
import { cn } from '@/utils/cn';
import { mockProviders } from '@/data/mockProviders';
import { skillCategories } from '@/data/mockSkills';
import { activeSkills } from '@/data/skillCatalogue';
import type { Provider } from '@/types';

const distanceOptions = [2, 5, 10, 25];
const priceOptions = [
  { label: 'Under ₹400', max: 400 },
  { label: '₹400–₹600', min: 400, max: 600 },
  { label: '₹600–₹800', min: 600, max: 800 },
  { label: '₹800+', min: 800 },
];
const modeOptions = ['Offline', 'Online', 'Either'];
const ratingOptions = ['4.5+', '4.0+', 'Any'];
const experienceOptions = ['Beginner', 'Intermediate', 'Advanced'];

// Simple AI chatbot responses
const aiResponses: Record<string, string> = {
  default: "Based on your preferences, here are some nearby providers that match well.",
  photography: "I found 2 photography providers near Ludhiana. Simran Sharma (4.9★, 3.2 km) is highly recommended for beginners, and Riya Kapoor (4.8★, 4.1 km) is great for graphic design too.",
  design: "Riya Kapoor specialises in Graphic Design and has excellent reviews. She's 4.1 km from you and teaches both online and offline.",
  coding: "Arjun Mehta is your best match for web development — 4.7★, experienced with React and Python. He's in Chandigarh, ~8.7 km away.",
  guitar: "Priya Nair is an expert guitar teacher with 4.9★ and 67 reviews. She teaches offline and has sessions on weekends.",
  music: "Priya Nair teaches guitar with a music degree from Chandigarh University. She's highly recommended with 210+ completed sessions.",
};

function getAIResponse(query: string): string {
  const q = query.toLowerCase();
  if (q.includes('photo')) return aiResponses.photography;
  if (q.includes('design') || q.includes('figma') || q.includes('graphic')) return aiResponses.design;
  if (q.includes('cod') || q.includes('web') || q.includes('python') || q.includes('react')) return aiResponses.coding;
  if (q.includes('guitar')) return aiResponses.guitar;
  if (q.includes('music') || q.includes('piano') || q.includes('sing')) return aiResponses.music;
  return aiResponses.default;
}

interface Filters {
  query: string;
  category: string;
  distance: number;
  maxPrice: number;
  mode: string;
  rating: string;
  experience: string;
}

export function ExplorePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const showAssistant = searchParams.get('assistant') === 'true';

  const [filters, setFilters] = useState<Filters>({
    query: searchParams.get('q') || '',
    category: searchParams.get('category') || '',
    distance: 25,
    maxPrice: 10000,
    mode: '',
    rating: '',
    experience: '',
  });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiOpen, setAiOpen] = useState(showAssistant);
  const [aiInput, setAiInput] = useState('');
  const [aiMessages, setAiMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: "Hi! Tell me what skill you want to learn and I'll recommend the best local providers for you." }
  ]);

  const updateFilter = (key: keyof Filters, value: string | number) => {
    setLoading(true);
    setFilters((f) => ({ ...f, [key]: value }));
    setTimeout(() => setLoading(false), 300);
  };

  const clearFilter = (key: keyof Filters) => updateFilter(key, key === 'distance' ? 25 : key === 'maxPrice' ? 10000 : '');

  const activeFilterCount = [
    filters.category, filters.mode, filters.rating, filters.experience,
    filters.distance < 25 ? 'dist' : '',
    filters.maxPrice < 10000 ? 'price' : '',
  ].filter(Boolean).length;

  const filteredProviders = useMemo(() => {
    return mockProviders.filter((p) => {
      if (filters.query && !p.primarySkill.toLowerCase().includes(filters.query.toLowerCase()) &&
        !p.name.toLowerCase().includes(filters.query.toLowerCase()) &&
        !p.skills.some(s => s.skillName.toLowerCase().includes(filters.query.toLowerCase()))) return false;
      if (filters.category && p.primaryCategory !== filters.category) return false;
      if (p.distanceKm > filters.distance) return false;
      if (filters.maxPrice < 10000 && p.skills[0].pricePerSession > filters.maxPrice) return false;
      if (filters.mode && filters.mode !== 'Either') {
        const mode = filters.mode.toLowerCase();
        if (!p.skills.some(s => s.learningMode === mode || s.learningMode === 'either')) return false;
      }
      if (filters.rating === '4.5+' && p.rating < 4.5) return false;
      if (filters.rating === '4.0+' && p.rating < 4.0) return false;
      if (filters.experience) {
        const exp = filters.experience.toLowerCase() as 'beginner' | 'intermediate' | 'advanced';
        if (!p.skills.some(s => s.experienceLevel === exp)) return false;
      }
      return true;
    });
  }, [filters]);

  const sendAiMessage = () => {
    if (!aiInput.trim()) return;
    const userMsg = aiInput.trim();
    setAiMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setAiInput('');
    setTimeout(() => {
      setAiMessages(prev => [...prev, { role: 'ai', text: getAIResponse(userMsg) }]);
      // Auto-apply search filter
      setFilters(f => ({ ...f, query: userMsg.split(' ').slice(0, 2).join(' ') }));
    }, 600);
  };

  return (
    <PublicLayout hideFooter={false}>
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1220]">
        {/* Search header */}
        <div className="bg-white dark:bg-[#111827] border-b border-[#E2E8F0] dark:border-[#1E293B] sticky top-16 z-30">
          <div className="page-container py-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative max-w-2xl">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="search"
                  value={filters.query}
                  onChange={(e) => updateFilter('query', e.target.value)}
                  placeholder="Search for a skill or provider…"
                  className="input-base pl-10 h-11"
                  aria-label="Search skills"
                />
                {filters.query && (
                  <button onClick={() => updateFilter('query', '')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <Button
                variant={filtersOpen || activeFilterCount > 0 ? 'primary' : 'secondary'}
                size="md"
                leftIcon={<SlidersHorizontal className="w-4 h-4" />}
                onClick={() => setFiltersOpen(!filtersOpen)}
              >
                Filters {activeFilterCount > 0 && <span className="ml-1 bg-white/20 px-1.5 py-0.5 rounded-full text-xs">{activeFilterCount}</span>}
              </Button>

              <Button
                variant={aiOpen ? 'teal' : 'secondary'}
                size="md"
                leftIcon={<Bot className="w-4 h-4" />}
                onClick={() => setAiOpen(!aiOpen)}
              >
                <span className="hidden sm:inline">AI Assistant</span>
              </Button>
            </div>

            {/* Filter chips */}
            {filtersOpen && (
              <div className="mt-4 pt-4 border-t border-[#E2E8F0] dark:border-[#1E293B] animate-slide-up">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                  {/* Category */}
                  <div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Category</p>
                    <select value={filters.category} onChange={(e) => updateFilter('category', e.target.value)}
                      className="input-base py-2 text-sm">
                      <option value="">All Categories</option>
                      {skillCategories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>

                  {/* Distance */}
                  <div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Distance</p>
                    <select value={filters.distance} onChange={(e) => updateFilter('distance', Number(e.target.value))}
                      className="input-base py-2 text-sm">
                      {distanceOptions.map(d => <option key={d} value={d}>Within {d} km</option>)}
                    </select>
                  </div>

                  {/* Mode */}
                  <div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Mode</p>
                    <select value={filters.mode} onChange={(e) => updateFilter('mode', e.target.value)}
                      className="input-base py-2 text-sm">
                      <option value="">Any Mode</option>
                      {modeOptions.map(m => <option key={m}>{m}</option>)}
                    </select>
                  </div>

                  {/* Price */}
                  <div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Price</p>
                    <select onChange={(e) => {
                      const opt = priceOptions[Number(e.target.value)];
                      if (opt) updateFilter('maxPrice', opt.max || 10000);
                    }} className="input-base py-2 text-sm">
                      <option value="">Any Price</option>
                      {priceOptions.map((p, i) => <option key={p.label} value={i}>{p.label}</option>)}
                    </select>
                  </div>

                  {/* Rating */}
                  <div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Rating</p>
                    <select value={filters.rating} onChange={(e) => updateFilter('rating', e.target.value)}
                      className="input-base py-2 text-sm">
                      {ratingOptions.map(r => <option key={r} value={r === 'Any' ? '' : r}>{r === 'Any' ? 'Any Rating' : r}</option>)}
                    </select>
                  </div>

                  {/* Experience */}
                  <div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Level</p>
                    <select value={filters.experience} onChange={(e) => updateFilter('experience', e.target.value)}
                      className="input-base py-2 text-sm">
                      <option value="">Any Level</option>
                      {experienceOptions.map(e => <option key={e}>{e}</option>)}
                    </select>
                  </div>
                </div>

                {activeFilterCount > 0 && (
                  <button onClick={() => {
                    setFilters({ query: '', category: '', distance: 25, maxPrice: 10000, mode: '', rating: '', experience: '' });
                  }} className="mt-3 text-xs text-red-600 dark:text-red-400 hover:underline flex items-center gap-1">
                    <X className="w-3 h-3" /> Clear all filters
                  </button>
                )}
              </div>
            )}

            {/* Active filter chips */}
            {!filtersOpen && activeFilterCount > 0 && (
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                {filters.category && <Badge variant="indigo">{filters.category} <button onClick={() => clearFilter('category')} className="ml-1 hover:text-indigo-900"><X className="w-3 h-3 inline" /></button></Badge>}
                {filters.mode && <Badge variant="teal">{filters.mode} <button onClick={() => clearFilter('mode')} className="ml-1"><X className="w-3 h-3 inline" /></button></Badge>}
                {filters.distance < 25 && <Badge variant="default">Within {filters.distance}km <button onClick={() => clearFilter('distance')} className="ml-1"><X className="w-3 h-3 inline" /></button></Badge>}
                {filters.rating && <Badge variant="warning">{filters.rating} <button onClick={() => clearFilter('rating')} className="ml-1"><X className="w-3 h-3 inline" /></button></Badge>}
              </div>
            )}
          </div>
        </div>

        <div className="page-container py-6">
          <div className={cn('flex gap-6', aiOpen && 'flex-col lg:flex-row')}>
            {/* Main results */}
            <div className="flex-1 min-w-0">
              {/* Results header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-[#0F172A] dark:text-slate-100">
                    {loading ? 'Searching…' : `${filteredProviders.length} providers found`}
                  </p>
                  {filters.query && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      for "<span className="font-medium">{filters.query}</span>" near Ludhiana
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                  <MapPin className="w-3.5 h-3.5" /> Ludhiana, Punjab
                </div>
              </div>

              {/* Skill chips — all active skills from the verified catalogue */}
              <div className="flex gap-2 mb-5 flex-wrap">
                <button
                  onClick={() => updateFilter('query', '')}
                  className={cn('px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
                    !filters.query
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'border-[#E2E8F0] dark:border-[#1E293B] text-slate-600 dark:text-slate-400 hover:border-indigo-300 bg-white dark:bg-[#111827]'
                  )}
                >
                  All
                </button>
                {activeSkills
                  .sort((a, b) => a.popularityRank - b.popularityRank)
                  .map((s) => (
                    <button
                      key={s.id}
                      onClick={() => updateFilter('query', s.name)}
                      className={cn(
                        'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors flex items-center gap-1',
                        filters.query === s.name
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'border-[#E2E8F0] dark:border-[#1E293B] text-slate-600 dark:text-slate-400 hover:border-indigo-300 bg-white dark:bg-[#111827]'
                      )}
                    >
                      <span>{s.icon}</span>
                      {s.name}
                    </button>
                  ))}
              </div>

              {loading ? (
                <SkeletonList count={4} />
              ) : filteredProviders.length === 0 ? (
                (() => {
                  // Check if the searched skill exists in the catalogue
                  const catalogueMatch = filters.query
                    ? activeSkills.find((s) =>
                        s.name.toLowerCase().includes(filters.query.toLowerCase()) ||
                        filters.query.toLowerCase().includes(s.name.toLowerCase())
                      )
                    : null;

                  if (catalogueMatch) {
                    return (
                      <div className="space-y-4">
                        {/* Skill found in catalogue — show info card */}
                        <div className="card p-6 border-indigo-100 dark:border-indigo-900 bg-indigo-50/30 dark:bg-indigo-950/10">
                          <div className="flex items-start gap-4">
                            <span className="text-4xl shrink-0">{catalogueMatch.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <h3 className="text-lg font-bold text-[#0F172A] dark:text-slate-100">
                                  {catalogueMatch.name}
                                </h3>
                                <Badge variant="indigo">{catalogueMatch.category}</Badge>
                                {catalogueMatch.evidenceStatus === 'verified' && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400">
                                    ✓ Verified market demand
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                {catalogueMatch.description}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 italic mb-4">
                                {catalogueMatch.evidenceSummary}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {catalogueMatch.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="px-2 py-0.5 rounded-md text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* No providers yet */}
                        <div className="card p-10 text-center">
                          <BookOpen className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                          <p className="text-base font-semibold text-[#0F172A] dark:text-slate-100 mb-1">
                            No providers listed yet for {catalogueMatch.name}
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-5">
                            This skill is in our catalogue but no providers have registered in your area yet.
                            Try browsing all providers or adjusting your filters.
                          </p>
                          <div className="flex gap-3 justify-center flex-wrap">
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => setFilters({ query: '', category: '', distance: 25, maxPrice: 10000, mode: '', rating: '', experience: '' })}
                            >
                              Browse all providers
                            </Button>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => navigate('/signup?role=provider')}
                            >
                              Become a provider
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <EmptyState
                      icon={<Search className="w-6 h-6" />}
                      title="No providers found"
                      description="Try adjusting your filters or searching for a different skill."
                      action={{ label: 'Clear Filters', onClick: () => setFilters({ query: '', category: '', distance: 25, maxPrice: 10000, mode: '', rating: '', experience: '' }) }}
                    />
                  );
                })()
              ) : (
                <div className="grid gap-4 sm:grid-cols-1 xl:grid-cols-2">
                  {filteredProviders.map(p => (
                    <ProviderCard key={p.id} provider={p} skillFilter={filters.query} />
                  ))}
                </div>
              )}
            </div>

            {/* AI Assistant panel */}
            {aiOpen && (
              <aside className="w-full lg:w-80 shrink-0">
                <div className="card overflow-hidden sticky top-40" style={{ maxHeight: '70vh' }}>
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-[#E2E8F0] dark:border-[#1E293B] bg-teal-50 dark:bg-teal-950/20">
                    <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span className="text-sm font-semibold text-teal-700 dark:text-teal-300">Skill Assistant</span>
                    <Badge variant="teal" className="ml-auto text-[10px]">Mock AI</Badge>
                    <button onClick={() => setAiOpen(false)} className="btn-ghost p-1"><X className="w-4 h-4" /></button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: 'calc(70vh - 130px)' }}>
                    {aiMessages.map((m, i) => (
                      <div key={i} className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
                        <div className={cn(
                          'max-w-[85%] px-3 py-2 rounded-xl text-sm leading-relaxed',
                          m.role === 'user'
                            ? 'bg-indigo-600 text-white rounded-br-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-[#0F172A] dark:text-slate-100 rounded-bl-sm'
                        )}>
                          {m.text}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 border-t border-[#E2E8F0] dark:border-[#1E293B]">
                    <div className="flex gap-2">
                      <input
                        value={aiInput}
                        onChange={(e) => setAiInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') sendAiMessage(); }}
                        placeholder="E.g. beginner photography…"
                        className="input-base flex-1 py-2 text-xs"
                      />
                      <button onClick={sendAiMessage} disabled={!aiInput.trim()}
                        className="btn-primary p-2 rounded-lg disabled:opacity-40">
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1.5 text-center">Frontend demo — not a real AI model</p>
                  </div>
                </div>
              </aside>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
