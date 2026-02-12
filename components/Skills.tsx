
import React from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { Skill } from '../types';

interface SkillsProps {
  skills: Skill[];
}

const Skills: React.FC<SkillsProps> = ({ skills }) => {
  const categories = Array.from(new Set(skills.map(s => s.category)));

  const IconComponent = ({ skill, className }: { skill: Skill; className?: string }) => {
    if (skill.icon_url) {
      return <img src={skill.icon_url} alt={skill.name} className={`${className} object-contain`} />;
    }
    // @ts-ignore
    const Icon = LucideIcons[skill.icon || ''] || LucideIcons.Cpu;
    return <Icon className={className} />;
  };

  return (
    <section id="expertise" className="py-32 bg-background border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Expertise Badge & Title */}
        <div className="mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full border border-primary-500/20 bg-primary-500/5 text-primary-500 text-[9px] font-black tracking-[0.2em] uppercase mb-8"
          >
            Expertise
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-black text-white tracking-tighter"
          >
            Technical Proficiency
          </motion.h2>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-24 gap-y-24">
          {categories.map((category, catIndex) => (
            <div key={category} className="space-y-10">
              <motion.h3 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: catIndex * 0.1 }}
                className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.5em] border-b border-white/5 pb-4"
              >
                {category}
              </motion.h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {skills.filter(s => s.category === category).map((skill, skillIndex) => (
                  <motion.div 
                    key={skill.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (catIndex * 0.1) + (skillIndex * 0.05) }}
                    className="group flex items-center gap-4 p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-primary-500/[0.03] hover:border-primary-500/20 transition-all duration-300"
                  >
                    <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 text-slate-400 group-hover:text-primary-500 group-hover:bg-primary-500/10 transition-all duration-300 overflow-hidden">
                      <IconComponent skill={skill} className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white group-hover:text-primary-500 transition-colors duration-300">
                        {skill.name}
                      </h4>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
