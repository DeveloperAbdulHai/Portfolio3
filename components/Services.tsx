
import React from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { Service } from '../types';

interface ServicesProps {
  services: Service[];
}

const Services: React.FC<ServicesProps> = ({ services }) => {
  const IconComponent = ({ name, className }: { name: string; className?: string }) => {
    // @ts-ignore
    const Icon = LucideIcons[name] || LucideIcons.Layers;
    return <Icon className={className} />;
  };

  return (
    <section id="services" className="py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div className="max-w-2xl">
            <div className="inline-block px-4 py-1.5 rounded-lg border border-primary-500/20 bg-primary-500/5 text-primary-500 text-[10px] font-bold tracking-[0.3em] uppercase mb-6"> 
              Solutions 
            </div>
            <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tighter">
              Professional <span className="text-primary-500">Expertise.</span>
            </h2>
          </div>
          <p className="text-slate-500 max-w-sm text-sm leading-relaxed font-medium">
            Transforming complex ideas into cinematic realities through specialized technical skillsets and creative storytelling.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const featureList = service.features?.split(',').map(f => f.trim()).filter(Boolean) || [];
            
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="group relative p-10 bg-white/5 border border-white/5 rounded-3xl hover:border-primary-500/30 transition-all duration-500 overflow-hidden flex flex-col h-full"
              >
                {/* Background Accent */}
                <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-primary-500/5 blur-3xl group-hover:bg-primary-500/10 transition-all duration-500 rounded-full"></div>
                
                <div className="relative z-10 flex-1">
                  <div className="w-16 h-16 bg-white/5 border border-white/10 text-primary-500 rounded-xl flex items-center justify-center mb-10 group-hover:bg-primary-500 group-hover:text-black transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(0,208,132,0.3)]">
                    <IconComponent name={service.icon} className="w-8 h-8" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-primary-500 transition-colors">
                    {service.title}
                  </h3>
                  
                  <p className="text-slate-500 text-sm leading-relaxed font-medium mb-8">
                    {service.description}
                  </p>

                  {/* Feature Details */}
                  {featureList.length > 0 && (
                    <div className="space-y-3 mb-10 border-t border-white/5 pt-8">
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-4">What's Included</p>
                      {featureList.map((feature, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <LucideIcons.Check className="text-primary-500 shrink-0" size={14} />
                          <span className="text-[11px] font-bold text-slate-400 group-hover:text-slate-200 transition-colors">{feature}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative z-10 flex items-center gap-2 text-primary-500 text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0 mt-auto">
                  Explore Service <LucideIcons.ArrowRight size={14} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
