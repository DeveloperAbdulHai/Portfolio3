
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Play, X, Download, ChevronDown } from 'lucide-react';
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

  // Helper to convert standard video URLs to embed URLs
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    
    // YouTube
    const ytMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/\s]+)/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`;
    
    // Vimeo
    const vimeoMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
    
    return url;
  };

  const nameParts = displayName.split(' ');
  const lastName = nameParts.pop();
  const firstName = nameParts.join(' ');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const scrollToNextSection = () => {
    const nextSection = document.getElementById('expertise');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-background">
      <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-primary-500/10 blur-[100px] md:blur-[160px] rounded-full animate-pulse" style={{ willChange: 'opacity' }}></div>
      <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] bg-blue-500/5 blur-[80px] md:blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[10%] left-[-5%] w-[400px] h-[400px] bg-primary-500/5 blur-[80px] md:blur-[100px] rounded-full"></div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
        <motion.div 
          className="lg:col-span-7 space-y-10 order-1 lg:order-1"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-lg border border-white/10 bg-white/5 backdrop-blur-md mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-300">Available for Projects</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-tight tracking-tighter mb-8">
              {firstName} <span className="text-primary-500">{lastName}</span>
            </h1>

            <p className="text-xl md:text-2xl font-medium text-slate-400 max-w-xl leading-relaxed">
              {displayTitle}
            </p>
          </motion.div>

          <motion.p 
            variants={itemVariants}
            className="text-slate-500 text-lg max-w-lg leading-relaxed border-l-2 border-primary-500/30 pl-6"
          >
            {displayBio}
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap gap-10 items-center">
            <button 
              onClick={() => navigate('/contact')}
              className="px-10 py-5 bg-primary-500 text-black font-black rounded-xl flex items-center gap-3 hover:bg-primary-400 transition-all shadow-[0_20px_40px_rgba(0,208,132,0.2)] active:scale-95 uppercase tracking-widest text-[11px]"
            >
              Start Project <ArrowRight size={18} />
            </button>
            
            {profile?.video_url && (
              <button 
                onClick={() => setIsVideoOpen(true)}
                className="group flex items-center gap-5 text-white hover:text-primary-500 transition-all"
              >
                <div className="relative w-14 h-14 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border border-primary-500 animate-[ping_2.5s_infinite] opacity-30"></div>
                  <div className="absolute inset-[-4px] rounded-full border border-white/10 animate-[pulse_4s_infinite]"></div>
                  <div className="w-12 h-12 rounded-xl border border-white/20 bg-white/5 backdrop-blur-md flex items-center justify-center relative group-hover:bg-primary-500 group-hover:text-black transition-all duration-500">
                    <Play size={20} className="fill-current ml-1 group-hover:text-black transition-colors" />
                  </div>
                </div>
                <div className="flex flex-col items-start text-left">
                   <span className="text-[10px] font-black uppercase tracking-[0.4em] mb-0.5">Watch Intro</span>
                   <span className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em] group-hover:text-primary-400/70 transition-colors">Play Motion</span>
                </div>
              </button>
            )}
          </motion.div>

          <motion.div variants={itemVariants} className="flex items-center gap-6 pt-10">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mr-2">Follow</span>
              {socials.map((s) => (
                <a 
                  key={s.id} 
                  href={s.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center text-slate-400 hover:text-primary-500 hover:border-primary-500/50 transition-all"
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
        </motion.div>

        <div className="lg:col-span-5 relative order-2 lg:order-2 mt-12 lg:mt-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
            className="relative z-10"
          >
            <div className="aspect-[4/5] rounded-3xl overflow-hidden border-[12px] border-slate-900 bg-slate-900 shadow-3xl relative">
              <img 
                src={profile?.avatar_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1000"} 
                alt={displayName}
                className="w-full h-full object-cover transition-all duration-700"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60"></div>
              
              {/* Animated Experience Badge */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.8 }}
                className="absolute bottom-10 left-8 right-8 z-30"
              >
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="glass-effect p-6 rounded-2xl flex items-center gap-6 border border-white/10 shadow-2xl"
                  style={{ willChange: 'transform' }}
                >
                  <div className="text-4xl font-black text-primary-500 drop-shadow-[0_0_10px_rgba(0,208,132,0.4)]">5+</div>
                  <div className="h-10 w-px bg-white/10"></div>
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 leading-relaxed">
                    Years of Digital<br/>Experience
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4 cursor-pointer"
        onClick={scrollToNextSection}
      >
        <span className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-500 rotate-180 [writing-mode:vertical-lr] mb-2">Scroll</span>
        <motion.div 
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-primary-500 shadow-lg backdrop-blur-sm"
          style={{ willChange: 'transform' }}
        >
          <ChevronDown size={20} />
        </motion.div>
      </motion.div>

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
              className="w-full max-w-5xl aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-3xl bg-black"
            >
              <iframe 
                src={getEmbedUrl(profile.video_url)} 
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
