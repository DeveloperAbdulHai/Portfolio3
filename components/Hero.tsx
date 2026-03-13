import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Play, Download, ChevronDown } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Profile, SocialLink } from '../types';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';

interface HeroProps {
  profile: Profile | null;
  socials: SocialLink[];
}

const Hero: React.FC<HeroProps> = ({ profile, socials }) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [roleIndex, setRoleIndex] = useState(0);
  const navigate = useNavigate();

  const displayName = profile?.name?.trim() || 'Md Abdul Hai';
  const displayTitle = profile?.title?.trim() || 'Senior Visualizer';
  const displayBio =
    profile?.bio?.trim() ||
    'Brands lose attention when their visuals look inconsistent, outdated, or “just okay.” I design premium static and motion visuals + edit video that makes your content feel high-end, improves clarity, and boosts brand visibility across socials and campaigns.';
  const rotatingRoles = useMemo(() => {
    const base = displayTitle || 'Senior Visualizer';
    const roles = [
      base,
      'Motion Graphic Designer',
      'CGI Artist',
      'Brand Visualizer',
    ];
    return Array.from(new Set(roles.filter(Boolean)));
  }, [displayTitle]);

  useEffect(() => {
    if (rotatingRoles.length <= 1) return;
    const t = window.setInterval(() => {
      setRoleIndex((i) => (i + 1) % rotatingRoles.length);
    }, 2200);
    return () => window.clearInterval(t);
  }, [rotatingRoles.length]);
  const avatarUrl = profile?.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1000';

  const SocialIcon = ({ name }: { name: string }) => {
    const Icon = (LucideIcons as any)[name] || LucideIcons.Link2;
    return <Icon size={18} />;
  };

  const handleResumeDownload = () => {
    if (profile?.resume_url) window.open(profile.resume_url, '_blank');
  };

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    const ytMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/\s]+)/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`;
    const vimeoMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
    return url;
  };

  const scrollToNextSection = () => {
    document.getElementById('expertise')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-20 bg-[var(--_theme---base--surface--surface)]">
      {/* Subtle grid lines in background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          maskImage: 'radial-gradient(circle at 25% 30%, black 0%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(circle at 25% 30%, black 0%, transparent 70%)',
        }}
      />

      {/* Background decorative word */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-end pr-0 lg:pr-[5%]">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.035 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="font-brand text-[clamp(6rem,18vw,14rem)] font-bold leading-none tracking-tighter select-none"
          style={{ color: 'var(--_theme---base--text--primary)' }}
          aria-hidden
        >
          VISUAL
        </motion.span>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 sm:px-10 lg:px-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: text block */}
          <div className="lg:col-span-6 max-w-2xl">
            <div className="flex flex-col gap-6 sm:gap-8">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="font-brand text-xl sm:text-2xl md:text-3xl font-semibold leading-[1.15] tracking-tight flex flex-wrap items-center gap-3"
                  style={{ color: 'var(--_theme---base--text--primary)' }}
                >
                  <span>{displayName}</span>
                  <span
                    className="font-body text-[9px] sm:text-[10px] font-medium rounded-full px-2.5 py-1 border"
                    style={{
                      color: 'var(--_theme---base--text--secondary)',
                      backgroundColor: 'var(--_theme---base--surface--raised)',
                      borderColor: 'var(--_theme---base--border--subtle)',
                    }}
                  >
                    Available for projects
                  </span>
                </motion.h1>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45, duration: 0.4 }}
                  className="flex items-center gap-3"
                >
                  <div className="relative h-[3.25rem] sm:h-[4rem] md:h-[4.5rem] overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={rotatingRoles[roleIndex] || 'role'}
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -18 }}
                        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="font-brand text-4xl sm:text-5xl md:text-6xl font-semibold block tracking-tight"
                        style={{ color: 'var(--_theme---base--text--primary)' }}
                      >
                        {rotatingRoles[roleIndex]}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                  className="font-body text-base sm:text-lg font-normal leading-relaxed max-w-xl"
                  style={{ color: 'var(--_theme---base--text--muted)' }}
                >
                  {displayBio}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.75, duration: 0.4 }}
                  className="flex flex-wrap items-center gap-4 sm:gap-6"
                >
                  <button
                    type="button"
                    onClick={() => navigate('/contact')}
                    className="inline-flex items-center gap-2 font-body text-sm font-semibold rounded-full px-6 py-3.5 transition-colors"
                    style={{
                      color: 'var(--_theme---base--surface--surface)',
                      backgroundColor: 'var(--_theme---accent)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--_theme---accent--hover)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--_theme---accent)';
                    }}
                  >
                    Start a project
                    <ArrowRight size={18} />
                  </button>
                  {profile?.video_url && (
                    <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
                      <DialogTrigger asChild>
                        <button
                          type="button"
                          className="inline-flex items-center gap-2 font-body text-sm font-medium transition-colors rounded-full border px-4 py-3"
                          style={{
                            color: 'var(--_theme---base--text--secondary)',
                            borderColor: 'var(--_theme---base--border--subtle)',
                            backgroundColor: 'var(--_theme---base--surface--raised)',
                          }}
                        >
                          <Play size={16} className="ml-0.5 fill-current" />
                          Watch intro
                        </button>
                      </DialogTrigger>
                      <DialogContent className="max-w-5xl p-0 bg-black border border-white/10 overflow-hidden">
                        <div className="aspect-video w-full">
                          <iframe
                            src={getEmbedUrl(profile.video_url)}
                            className="w-full h-full"
                            title="Intro reel"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.4 }}
                  className="flex flex-wrap items-center gap-6 pt-2 border-t"
                  style={{ borderColor: 'var(--_theme---base--border--subtle)' }}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-body text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--_theme---base--text--muted)' }}>Follow</span>
                    {socials.map((s) => (
                      <a
                        key={s.id}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors"
                        style={{ backgroundColor: 'var(--_theme---base--surface--raised)', color: 'var(--_theme---base--text--muted)' }}
                        title={s.platform}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = 'var(--_theme---accent)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = 'var(--_theme---base--text--muted)';
                        }}
                      >
                        <SocialIcon name={s.icon || s.platform} />
                      </a>
                    ))}
                  </div>
                  {profile?.resume_url && (
                    <button
                      type="button"
                      onClick={handleResumeDownload}
                      className="font-body text-xs font-medium flex items-center gap-2 transition-colors"
                      style={{ color: 'var(--_theme---base--text--muted)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'var(--_theme---base--text--primary)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--_theme---base--text--muted)';
                      }}
                    >
                      <Download size={14} />
                      Resume
                    </button>
                  )}
                </motion.div>
            </div>
          </div>

          {/* Right: image in organic shape + small floating badges (never on face) */}
          <div className="lg:col-span-6 relative flex justify-center lg:justify-end items-center min-h-[420px] lg:min-h-[520px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative w-full max-w-md aspect-[4/5]"
            >
              {/* Soft glow — same shape as image */}
              <div
                className="absolute -inset-2 blur-2xl"
                style={{
                  background: 'var(--_theme---accent)',
                  opacity: 0.12,
                  clipPath:
                    'polygon(6% 0%, 94% 0%, 100% 6%, 100% 94%, 94% 100%, 6% 100%, 0% 94%, 0% 6%)',
                  boxShadow: '0 0 40px -18px rgba(0,208,132,0.22)',
                }}
              />
              {/* Image — premium cut-corner frame */}
              <div
                className="relative h-full w-full overflow-hidden border-2"
                style={{
                  borderColor: 'var(--_theme---accent)',
                  clipPath:
                    'polygon(6% 0%, 94% 0%, 100% 6%, 100% 94%, 94% 100%, 6% 100%, 0% 94%, 0% 6%)',
                  boxShadow: '0 0 0 1px rgba(0,208,132,0.12)',
                }}
              >
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="h-full w-full object-cover object-top"
                  loading="eager"
                />
              </div>

            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <motion.button
        type="button"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        onClick={scrollToNextSection}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-colors"
        style={{ color: 'var(--_theme---base--text--muted)' }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = 'var(--_theme---base--text--secondary)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'var(--_theme---base--text--muted)';
        }}
      >
        <span className="font-body text-xxs uppercase tracking-widest">Scroll</span>
        <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
          <ChevronDown size={20} />
        </motion.span>
      </motion.button>

      {/* Video dialog now handled by shadcn-style Dialog */} 
    </section>
  );
};

export default Hero;
