
import React from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { WhyChooseMe as WhyChooseMeType } from '../types';

interface WhyChooseMeProps {
  items: WhyChooseMeType[];
}

const WhyChooseMe: React.FC<WhyChooseMeProps> = ({ items }) => {
  const IconComponent = ({ name, className }: { name: string; className?: string }) => {
    // @ts-ignore
    const Icon = LucideIcons[name] || LucideIcons.Award;
    return <Icon className={className} />;
  };

  // Safe sorting to prevent crashes if data is malformed
  const sortedItems = [...items].sort((a, b) => (a.order_index || 0) - (b.order_index || 0));

  return (
    <section id="why-me" className="py-32 bg-slate-950 border-t border-white/5 relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/5 blur-[120px] rounded-full -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <div className="inline-block px-4 py-1.5 rounded-full border border-primary-500/20 bg-primary-500/5 text-primary-500 text-[10px] font-bold tracking-[0.4em] uppercase mb-8">
              Core Values
            </div>
            <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-tight tracking-tighter mb-8">
              Why partner with <span className="text-primary-500">me?</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed max-w-lg mb-10">
              I combine technical precision with creative flair to deliver digital experiences that don't just exist—they excel.
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="p-8 bg-white/5 border border-white/5 rounded-3xl">
                <div className="text-3xl font-black text-white mb-2">99%</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Project Success</div>
              </div>
              <div className="p-8 bg-white/5 border border-white/5 rounded-3xl">
                <div className="text-3xl font-black text-white mb-2">24/7</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Global Support</div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {sortedItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group flex gap-8 p-8 bg-white/5 border border-white/5 rounded-[40px] hover:border-primary-500/30 transition-all duration-500"
              >
                <div className="w-16 h-16 bg-slate-900 border border-white/10 text-primary-500 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-primary-500 group-hover:text-black transition-all duration-500">
                  <IconComponent name={item.icon} className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary-500 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseMe;
