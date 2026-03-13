
import React from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { Link } from 'react-router-dom';
import { Service } from '../types';
import { ArrowRight } from 'lucide-react';

interface ServicesProps {
  services: Service[];
}

const Services: React.FC<ServicesProps> = ({ services }) => {
  const IconComponent = ({ name, className }: { name: string; className?: string }) => {
    const Icon = (LucideIcons as any)[name] || LucideIcons.Layers;
    return <Icon className={className} />;
  };

  const getServiceMeta = (title: string) => {
    const t = title.trim().toLowerCase();
    if (t.includes('graphic')) {
      return { bestFor: 'Brand identity, ads, social creatives', outcome: 'Consistent visuals that convert' };
    }
    if (t.includes('motion')) {
      return { bestFor: 'Promos, explainers, social reels', outcome: 'Scroll-stopping movement & clarity' };
    }
    if (t.includes('video')) {
      return { bestFor: 'YouTube, shorts, commercials', outcome: 'Clean pacing, polish, and retention' };
    }
    if (t.includes('cgi') || t.includes('vfx') || t.includes('3d')) {
      return { bestFor: 'Product visuals, renders, VFX shots', outcome: 'Premium realism & cinematic feel' };
    }
    return { bestFor: 'Custom creative needs', outcome: 'A high-end finish, delivered fast' };
  };

  return (
    <section
      id="services"
      className="py-20 sm:py-24 lg:py-28 border-y border-white/[0.06]"
      style={{ backgroundColor: 'var(--_theme---base--surface--surface)' }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-10 sm:mb-12">
          <div className="max-w-2xl">
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 rounded-full border text-[11px] font-semibold tracking-widest uppercase mb-6"
              style={{ borderColor: 'var(--_theme---accent--secondary)', backgroundColor: 'var(--_theme---accent--secondary--muted)', color: 'var(--_theme---accent--secondary)' }}
            >
              What I offer
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-title text-4xl md:text-5xl font-bold tracking-tight"
              style={{ color: 'var(--_theme---base--text--primary)' }}
            >
              Visual & motion solutions for <span style={{ color: 'var(--_theme---accent)' }}>brands.</span>
            </motion.h2>
          </div>
          <div className="max-w-sm">
            <p className="text-sm leading-relaxed" style={{ color: 'var(--_theme---base--text--secondary)' }}>
              From static and motion design to video editing and brand visibility—crafted to elevate your identity and make your content feel premium.
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {['Premium finish', 'On-brand consistency', 'Social-first delivery'].map((pill) => (
                <span
                  key={pill}
                  className="px-3 py-1.5 rounded-full text-[11px] font-medium border"
                  style={{
                    borderColor: 'var(--_theme---base--border--subtle)',
                    backgroundColor: 'var(--_theme---base--surface--raised)',
                    color: 'var(--_theme---base--text--muted)',
                  }}
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const featureList = service.features?.split(',').map((f) => f.trim()).filter(Boolean) || [];
            const meta = getServiceMeta(service.title);
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
                className="group relative p-8 rounded-2xl transition-all duration-500 overflow-hidden flex flex-col h-full border hover:-translate-y-0.5"
                style={{ backgroundColor: 'var(--_theme---base--surface--raised)', borderColor: 'var(--_theme---base--border--subtle)' }}
              >
                <div className="absolute -right-8 -bottom-8 w-28 h-28 blur-2xl rounded-full transition-all duration-500 group-hover:opacity-100 opacity-60" style={{ backgroundColor: 'var(--_theme---accent--muted)' }} />
                <div className="relative z-10 flex-1">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 border"
                    style={{
                      backgroundColor: 'var(--_theme---base--surface--overlay)',
                      borderColor: 'var(--_theme---base--border--subtle)',
                      color: 'var(--_theme---accent)',
                      boxShadow: '0 0 0 1px rgba(0,208,132,0.08), 0 10px 30px -18px rgba(0,208,132,0.22)',
                    }}
                  >
                    <IconComponent name={service.icon} className="w-7 h-7" />
                  </div>
                  <h3 className="font-title text-xl font-semibold mb-3 transition-colors group-hover:[color:var(--_theme---accent)]" style={{ color: 'var(--_theme---base--text--primary)' }}>
                    {service.title}
                  </h3>
                  <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--_theme---base--text--muted)' }}>
                    {service.description}
                  </p>

                  {featureList.length > 0 && (
                    <div className="space-y-2.5 mb-6 border-t pt-6" style={{ borderColor: 'var(--_theme---base--border--subtle)' }}>
                      <p className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--_theme---base--text--muted)' }}>Included</p>
                      {featureList.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <LucideIcons.Check className="shrink-0" size={14} style={{ color: 'var(--_theme---accent)' }} />
                          <span className="text-xs" style={{ color: 'var(--_theme---base--text--secondary)' }}>{feature}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-auto border-t pt-5 space-y-2" style={{ borderColor: 'var(--_theme---base--border--subtle)' }}>
                    <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--_theme---base--text--muted)' }}>
                      Best for
                    </div>
                    <div className="text-xs leading-snug" style={{ color: 'var(--_theme---base--text--secondary)' }}>
                      {meta.bestFor}
                    </div>
                    <div className="text-[10px] font-semibold uppercase tracking-wider pt-2" style={{ color: 'var(--_theme---base--text--muted)' }}>
                      Outcome
                    </div>
                    <div className="text-xs leading-snug" style={{ color: 'var(--_theme---base--text--secondary)' }}>
                      {meta.outcome}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 sm:mt-14 flex flex-wrap gap-4 justify-center md:justify-end"
        >
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border text-sm font-medium transition-colors hover:opacity-90"
            style={{ borderColor: 'var(--_theme---base--border--subtle)', color: 'var(--_theme---base--text--secondary)' }}
          >
            View all services
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--_theme---accent)', color: 'var(--_theme---base--surface--surface)' }}
          >
            Start a project <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
