
import React from 'react';
import { motion } from 'framer-motion';
import { Skill } from '../types';

interface SkillsProps {
  skills: Skill[];
}

const Skills: React.FC<SkillsProps> = ({ skills }) => {
  const categories = Array.from(new Set(skills.map(s => s.category)));

  return (
    <section id="about" className="py-32 bg-slate-950 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="mb-20">
          <div className="inline-block px-4 py-1.5 rounded-full border border-primary-500/20 bg-primary-500/5 text-primary-500 text-[10px] font-bold tracking-widest uppercase mb-6"> Expertise </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white">Technical Proficiency</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
          {categories.map((category) => (
            <div key={category} className="space-y-10">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-[0.4em]">
                {category}
              </h3>
              <div className="space-y-8">
                {skills.filter(s => s.category === category).map((skill) => (
                  <div key={skill.id} className="group">
                    <div className="flex justify-between items-end mb-4">
                      <span className="text-lg font-bold text-white/80 group-hover:text-primary-500 transition-colors">{skill.name}</span>
                      <span className="text-sm font-bold text-slate-500">{skill.percentage}%</span>
                    </div>
                    <div className="w-full h-[3px] bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.percentage}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                        className="h-full bg-primary-500 shadow-[0_0_10px_#00d084]"
                      ></motion.div>
                    </div>
                  </div>
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
