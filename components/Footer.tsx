
import React, { useEffect, useState } from 'react';
import { Profile, SocialLink } from '../types';
import * as LucideIcons from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

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
    // @ts-ignore
    const Icon = LucideIcons[name] || LucideIcons.Link2;
    return <Icon size={20} />;
  };

  return (
    <footer className="py-20 bg-background border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col items-center space-y-12">
        <div className="text-center">
          <span className="text-3xl font-extrabold tracking-tighter text-white">
            {profile?.name || 'Md Abdul Hai'}<span className="text-primary-500">.</span>
          </span>
          <p className="text-slate-500 mt-4 text-sm max-w-md mx-auto leading-relaxed">
            Pushing boundaries and creating high-end digital solutions that leave a lasting impact.
          </p>
        </div>

        <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center">
          {socials.map(s => (
            <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 hover:text-primary-500 hover:bg-white/10 transition-all duration-300 border border-white/5">
               <SocialIcon name={s.icon || s.platform} />
            </a>
          ))}
        </div>

        <div className="w-full max-w-xl h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

        <div className="flex flex-col md:flex-row justify-between w-full text-[11px] font-bold text-slate-600 uppercase tracking-[0.3em] gap-6 text-center">
          <p>© {new Date().getFullYear()} {profile?.name || 'Hai'}. All rights reserved.</p>
          <div className="flex gap-8 justify-center items-center flex-wrap">
             <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
             <a href="#" className="hover:text-white transition-colors">Terms</a>
             <Link to="/admin" className="hover:text-primary-500 transition-colors flex items-center gap-2">
                <LucideIcons.Lock size={12} className="opacity-50" /> Admin
             </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
