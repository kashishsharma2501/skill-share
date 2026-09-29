import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { MapPin, Mail } from 'lucide-react';

const footerLinks = {
  Platform: [
    { label: 'Explore Skills', href: '/explore' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Become a Provider', href: '/#become-provider' },
    { label: 'Find Providers', href: '/explore' },
  ],
  Categories: [
    { label: 'Creative Arts', href: '/explore?category=creative-arts' },
    { label: 'Technology', href: '/explore?category=technology' },
    { label: 'Music', href: '/explore?category=music' },
    { label: 'Health & Wellness', href: '/explore?category=health' },
  ],
  Company: [
    { label: 'About', href: '/#about' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Use', href: '/terms' },
    { label: 'Contact', href: '/contact' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[#0B1220] text-slate-400 mt-auto">
      <div className="page-container py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Logo light size="md" className="mb-4" />
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs mb-5">
              Connecting learners with skilled local people for meaningful, in-person and online learning experiences.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                <span>Ludhiana, Punjab · India</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                <span>hello@skillsharelocal.in</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-slate-200 mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-600">
            © 2026 SkillShare Local. Academic project — B.Tech final year. Not a real product.
          </p>
          <p className="text-xs text-slate-600">
            Built with React + TypeScript + Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
