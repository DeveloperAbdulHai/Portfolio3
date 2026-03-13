
import React, { useEffect, useState } from 'react';
import { Profile, SocialLink } from '../types';
import * as LucideIcons from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, Phone, MapPin } from 'lucide-react';

interface FooterProps {
  profile: Profile | null;
}

const Footer: React.FC<FooterProps> = ({ profile }) => {
  const [socials, setSocials] = useState<SocialLink[]>([]);

  useEffect(() => {
    supabase.from('social_links').select('*').then(({ data }) => {
      if (data) setSocials(data);
    });
  }, []);

  const SocialIcon = ({ name }: { name: string }) => {
    const Icon = (LucideIcons as any)[name] || LucideIcons.Link2;
    return <Icon size={20} />;
  };

  const quickLinks = [
    { label: 'Home', to: '/' },
    { label: 'About', to: '/about' },
    { label: 'Services', to: '/services' },
    { label: 'Portfolio', to: '/portfolio' },
    { label: 'Blog', to: '/blog' },
    { label: 'Contact', to: '/contact' },
  ];

  const services = [
    { label: 'Graphics design', to: '/services' },
    { label: 'Motion graphics', to: '/services' },
    { label: 'Video editing', to: '/services' },
    { label: 'Brand identity', to: '/services' },
  ];

  return (
    <footer className="border-t border-white/[0.06] bg-[var(--_theme---base--surface--raised)]">
      {/* CTA strip */}
      <div className="border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 rounded-2xl p-8 md:p-10 border border-primary-500/20 bg-surface"
          >
            <div>
              <h3 className="font-title text-xl md:text-2xl font-bold text-white mb-2">
                Ready to elevate your brand?
              </h3>
              <p className="text-slate-400 text-sm max-w-lg">
                Let's create static and motion work that gets noticed.
              </p>
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm shrink-0 bg-white text-black hover:bg-white/90 transition-colors"
            >
              Start a project <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Main footer grid — 4 equal columns, no empty space */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-14">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-8 text-left">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-block">
              <span className="font-title text-2xl font-bold tracking-tight text-white">
                {profile?.name || 'Md Abdul Hai'}<span className="text-primary-500">.</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm mt-4 max-w-[260px] leading-relaxed">
              Visualizer — static & motion design, video editing, and brand visibility for forward-thinking brands.
            </p>
            <div className="flex items-center gap-3 mt-6 flex-wrap">
              {socials.map((s) => (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-primary-500 hover:border-primary-500/30 transition-all duration-300"
                  aria-label={s.platform}
                >
                  <SocialIcon name={s.icon || s.platform} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-4">Quick links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-slate-400 text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-4">Services</h4>
            <ul className="space-y-3">
              {services.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-slate-400 text-sm hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 sm:col-span-1">
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-4">Get in touch</h4>
            <ul className="space-y-4">
              {profile?.email && (
                <li className="flex items-start gap-3">
                  <Mail size={16} className="text-primary-500 shrink-0 mt-0.5" />
                  <a href={`mailto:${profile.email}`} className="text-slate-400 text-sm hover:text-white transition-colors break-all">
                    {profile.email}
                  </a>
                </li>
              )}
              {profile?.phone && (
                <li className="flex items-start gap-3">
                  <Phone size={16} className="text-primary-500 shrink-0 mt-0.5" />
                  <a href={`tel:${profile.phone.replace(/\s/g, '')}`} className="text-slate-400 text-sm hover:text-white transition-colors">
                    {profile.phone}
                  </a>
                </li>
              )}
              {profile?.location && (
                <li className="flex items-start gap-3">
                  <MapPin size={16} className="text-primary-500 shrink-0 mt-0.5" />
                  <span className="text-slate-400 text-sm">{profile.location}</span>
                </li>
              )}
              {!profile?.email && !profile?.phone && !profile?.location && (
                <li className="text-slate-500 text-sm">Contact details in profile.</li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] font-medium text-slate-500">
          <p>© {new Date().getFullYear()} {profile?.name || 'Md Abdul Hai'}. All rights reserved.</p>
          <div className="flex gap-6 items-center flex-wrap justify-center">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <Link to="/admin" className="hover:text-primary-500 transition-colors flex items-center gap-1.5">
              <LucideIcons.Lock size={12} className="opacity-60" /> Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
