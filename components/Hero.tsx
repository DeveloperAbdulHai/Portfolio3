
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Play, X, Download } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Profile, SocialLink } from '../types';

interface HeroProps {
  profile: Profile | null;
  socials: SocialLink[];
}

const Hero: React.FC<HeroProps> = ({ profile, socials }) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const navigate = useNavigate();

  const displayName = profile?.name?.trim() || "Md Abdul Hai";
  const displayTitle = profile?.title?.trim() || "Creative Visualizer & Developer";
  const displayBio = profile?.bio?.trim() || "Transforming complex ideas into cinematic digital experiences with precision and passion.";

  const SocialIcon = ({ name }: { name: string }) => {
    // @ts-ignore
    const Icon = LucideIcons[name] || LucideIcons.Link2;
    return <Icon size={20} />;
  };

  const handleResumeDownload = () => {
    if (profile?.resume_url) {
      window.open(profile.resume_url, '_blank');
    }
  };

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-background">
      {/* Background Ambience */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary-500/10 blur-[140px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-[10%] left-[-5%] w-[400px] h-[400px] bg-primary-500/5 blur-[100px] rounded-full"></div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
        
        {/* Left Content */}
        <div className="lg:col-span-7 space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-300">Available for Projects</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter mb-8">
              {displayName.split(' ').map((word, i) => (
                <span key={i} className={i === displayName.split(' ').length - 1 ? "text-primary-500 block" : "block"}>
                  {word}
                </span>
              ))}
            </h1>

            <p className="text-xl md:text-2xl font-medium text-slate-400 max-w-xl leading-relaxed">
              {displayTitle}
            </p>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-slate-500 text-lg max-w-lg leading-relaxed border-l-2 border-primary-500/30 pl-6"
          >
            {displayBio}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="flex flex-wrap gap-10 items-center"
          >
            {/* Primary Action */}
            <button 
              onClick={() => navigate('/contact')}
              className="px-10 py-5 bg-primary-500 text-black font-black rounded-2xl flex items-center gap-3 hover:bg-primary-400 transition-all shadow-[0_20px_40px_rgba(0,208,132,0.2)] active:scale-95 uppercase tracking-widest text-[11px]"
            >
              Start Project <ArrowRight size={18} />
            </button>
            
            {/* Animated Video Button */}
            {profile?.video_url && (
              <button 
                onClick={() => setIsVideoOpen(true)}
                className="group flex items-center gap-5 text-white hover:text-primary-500 transition-all"
              >
                <div className="relative w-14 h-14 flex items-center justify-center">
                  {/* Pulsing rings */}
                  <div className="absolute inset-0 rounded-full border border-primary-500 animate-[ping_2.5s_infinite] opacity-30"></div>
                  <div className="absolute inset-[-4px] rounded-full border border-white/10 animate-[pulse_4s_infinite]"></div>
                  
                  <div className="w-12 h-12 rounded-full border border-white/20 bg-white/5 backdrop-blur-md flex items-center justify-center relative group-hover:bg-primary-500 group-hover:border-primary-500 transition-all duration-500">
                    <Play size={20} className="fill-current ml-1 group-hover:text-black transition-colors" />
                  </div>
                </div>
                <div className="flex flex-col items-start text-left">
                   <span className="text-[10px] font-black uppercase tracking-[0.4em] mb-0.5">Watch Showreel</span>
                   <span className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em] group-hover:text-primary-400/70 transition-colors">Play Motion</span>
                </div>
              </button>
            )}
          </motion.div>

          {/* Social Links & Resume */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.6 }}
            className="flex items-center gap-6 pt-10"
          >
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mr-2">Follow</span>
              {socials.map((s) => (
                <a 
                  key={s.id} 
                  href={s.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center text-slate-500 hover:text-primary-500 hover:border-primary-500/50 transition-all"
                  title={s.platform}
                >
                  <SocialIcon name={s.icon || s.platform} />
                </a>
              ))}
            </div>

            {profile?.resume_url && (
              <button 
                onClick={handleResumeDownload}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-white transition-all pl-6 border-l border-white/10"
              >
                <Download size={14} className="text-primary-500" /> Resume
              </button>
            )}
          </motion.div>
        </div>

        {/* Right Visual Section */}
        <div className="lg:col-span-5 relative hidden lg:block">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative z-10"
          >
            <div className="aspect-[4/5] rounded-[60px] overflow-hidden border-[12px] border-slate-900 bg-slate-900 shadow-3xl relative">
              <img 
                src={profile?.avatar_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1000"} 
                alt={displayName}
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60"></div>
            </div>

            {/* Floating Info Cards */}
            <div className="absolute -right-8 top-1/4 p-6 bg-slate-800/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl animate-[bounce_5s_infinite]">
              <div className="text-primary-500 font-black text-2xl mb-1">05+</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 whitespace-nowrap">Years Exp.</div>
            </div>

            <div className="absolute -left-8 bottom-1/4 p-6 bg-slate-800/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl animate-[pulse_6s_infinite]">
              <div className="text-white font-black text-2xl mb-1">100%</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 whitespace-nowrap">Satisfaction</div>
            </div>
          </motion.div>

          {/* Background Branding Mark */}
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[25rem] font-black text-white/5 select-none pointer-events-none uppercase italic">
            {displayName.charAt(0)}
          </div>
        </div>
      </div>

      {/* Video Pop-up Modal */}
      <AnimatePresence>
        {isVideoOpen && profile?.video_url && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-12"
          >
            <motion.button 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={() => setIsVideoOpen(false)}
              className="absolute top-10 right-10 p-4 bg-white/10 text-white rounded-full hover:bg-primary-500 hover:text-black transition-all z-10"
            >
              <X size={24} />
            </motion.button>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-5xl aspect-video rounded-[40px] overflow-hidden border border-white/10 shadow-3xl bg-black"
            >
              <iframe 
                src={profile.video_url} 
                className="w-full h-full"
                title="Portfolio Showreel"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Hero;
