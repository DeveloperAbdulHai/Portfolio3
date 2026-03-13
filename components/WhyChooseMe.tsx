
import React from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { Link } from 'react-router-dom';
import { WhyChooseMe as WhyChooseMeType } from '../types';

interface WhyChooseMeProps {
  items: WhyChooseMeType[];
}

const WhyChooseMe: React.FC<WhyChooseMeProps> = ({ items }) => {
  const IconComponent = ({ name, className }: { name: string; className?: string }) => {
    const Icon = (LucideIcons as any)[name] || LucideIcons.Award;
    return <Icon className={className} />;
  };

  const sortedItems = [...items].sort((a, b) => (a.order_index || 0) - (b.order_index || 0));

  return (
    <section
      id="why-me"
      className="py-20 sm:py-24 lg:py-28 bg-background border-y border-white/[0.06] relative overflow-hidden"
    >
      <div className="absolute -top-24 -right-16 w-[520px] h-[520px] bg-primary-500/[0.07] blur-[110px] rounded-full -z-10" />
      <div className="absolute -bottom-32 -left-24 w-[520px] h-[520px] bg-blue-500/[0.06] blur-[120px] rounded-full -z-10" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-16 items-center mx-auto">
          <div className="lg:col-span-6">
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 rounded-full border border-primary-500/25 bg-primary-500/10 text-primary-500 text-[11px] font-semibold tracking-widest uppercase mb-6"
            >
              Why work with me
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-title text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6"
            >
              Precision meets <span className="text-primary-500">creative flair.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-slate-300/90 text-base leading-relaxed max-w-xl mb-8"
            >
              I combine technical precision with creative flair to deliver visuals that feel premium, communicate fast, and stay consistent across every touchpoint.
            </motion.p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-6 bg-surface border border-white/[0.08] rounded-2xl"
              >
                <div className="font-display text-2xl font-bold text-white mb-1">99%</div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Project success</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 }}
                className="p-6 bg-surface border border-white/[0.08] rounded-2xl"
              >
                <div className="font-display text-2xl font-bold text-white mb-1">24/7</div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Global support</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="p-6 bg-surface border border-white/[0.08] rounded-2xl"
              >
                <div className="font-display text-2xl font-bold text-white mb-1">50+</div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Projects delivered</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 }}
                className="p-6 bg-surface border border-white/[0.08] rounded-2xl"
              >
                <div className="font-display text-2xl font-bold text-white mb-1">5+</div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Years experience</div>
              </motion.div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-xl font-semibold text-sm hover:bg-accent-hover hover:text-white transition-colors shadow-glow whitespace-nowrap shrink-0"
              >
                Start a project →
              </Link>
              <Link
                to="/portfolio"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20 rounded-xl font-semibold text-sm hover:bg-white/15 transition-colors whitespace-nowrap shrink-0 text-white"
              >
                View portfolio →
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="grid grid-cols-1 gap-4">
              {/* What you get card */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-3xl border border-white/[0.08] bg-surface p-6 sm:p-7"
              >
                <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-200">
                  What you get
                </div>
                <div className="mt-2 font-title text-2xl sm:text-3xl font-semibold text-white leading-tight">
                  A premium, consistent visual system—built for attention.
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {['Clear direction', 'Fast iterations', 'Production-ready files'].map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 rounded-full text-[11px] font-medium border border-white/20 bg-black/30 text-white"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Detail cards — full width, no image */}
              <div className="grid grid-cols-1 gap-4">
                {sortedItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: Math.min(index, 3) * 0.04 }}
                    className="group flex h-full w-full gap-5 p-6 bg-surface border border-white/[0.08] rounded-2xl hover:border-accent/25 transition-all duration-300"
                  >
                    <div className="w-12 h-12 bg-surface-raised border border-white/10 text-accent rounded-xl flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:text-white transition-all duration-300">
                      <IconComponent name={item.icon} className="w-6 h-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-title text-base font-semibold text-white mb-1.5 group-hover:text-accent transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseMe;
