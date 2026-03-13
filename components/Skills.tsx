
import React from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { Link } from 'react-router-dom';
import { Skill } from '../types';
import adobePhotoshopIcon from '../assets/brand-icons/adobe-photoshop.svg';
import adobeIllustratorIcon from '../assets/brand-icons/adobe-illustrator.svg';
import adobeAfterEffectsIcon from '../assets/brand-icons/adobe-after-effects.svg';
import adobePremiereProIcon from '../assets/brand-icons/adobe-premiere-pro.svg';
import figmaIcon from '../assets/brand-icons/figma.svg';
import sketchIcon from '../assets/brand-icons/sketch.svg';
import blenderIcon from '../assets/brand-icons/blender.svg';
import cinema4dIcon from '../assets/brand-icons/cinema4d.svg';
import davinciResolveIcon from '../assets/brand-icons/davinci-resolve.svg';

interface SkillsProps {
  skills: Skill[];
}

const Skills: React.FC<SkillsProps> = ({ skills }) => {
  const curatedTools: Skill[] = [
    // Keep it short + industry-standard only (and guaranteed icons)
    { id: 'curated-photoshop', name: 'Adobe Photoshop', percentage: 0, category: 'Creative', icon: 'adobephotoshop' },
    { id: 'curated-illustrator', name: 'Adobe Illustrator', percentage: 0, category: 'Creative', icon: 'adobeillustrator' },
    { id: 'curated-figma', name: 'Figma', percentage: 0, category: 'Creative', icon: 'figma' },
    { id: 'curated-sketch', name: 'Sketch', percentage: 0, category: 'Creative', icon: 'sketch' },
    { id: 'curated-aftereffects', name: 'Adobe After Effects', percentage: 0, category: 'Motion', icon: 'adobeaftereffects' },
    { id: 'curated-premiere', name: 'Adobe Premiere Pro', percentage: 0, category: 'Motion', icon: 'adobepremierepro' },
    { id: 'curated-davinci', name: 'DaVinci Resolve', percentage: 0, category: 'Motion', icon: 'davinciresolve' },
    { id: 'curated-blender', name: 'Blender', percentage: 0, category: '3D', icon: 'blender' },
    { id: 'curated-c4d', name: 'Cinema 4D', percentage: 0, category: '3D', icon: 'cinema4d' },
  ];

  const normalize = (value: string) => value.trim().toLowerCase();

  const mergedSkills = (() => {
    const byName = new Map<string, Skill>();
    for (const s of curatedTools) byName.set(normalize(s.name), s);
    for (const s of skills) byName.set(normalize(s.name), s);
    const excluded = new Set([
      'canva',
      'capcut',
      'filmora',
      'picsart',
      'snapseed',
    ]);
    return Array.from(byName.values()).filter((s) => !excluded.has(normalize(s.name)));
  })();

  const IconComponent = ({ skill }: { skill: Skill }) => {
    if (skill.icon_url) {
      return (
        <img
          src={skill.icon_url}
          alt={skill.name}
          className="w-6 h-6 object-contain brightness-0 invert opacity-90"
          loading="lazy"
        />
      );
    }

    const name = normalize(skill.name);
    const brandMap: Record<string, { src: string }> = {
      'adobe photoshop': { src: adobePhotoshopIcon },
      'photoshop': { src: adobePhotoshopIcon },
      'adobe illustrator': { src: adobeIllustratorIcon },
      'illustrator': { src: adobeIllustratorIcon },
      'adobe after effects': { src: adobeAfterEffectsIcon },
      'after effects': { src: adobeAfterEffectsIcon },
      'adobe premiere pro': { src: adobePremiereProIcon },
      'premiere pro': { src: adobePremiereProIcon },
      'figma': { src: figmaIcon },
      'sketch': { src: sketchIcon },
      'blender': { src: blenderIcon },
      'cinema 4d': { src: cinema4dIcon },
      'davinci resolve': { src: davinciResolveIcon },
    };

    const brand = brandMap[name];
    if (brand) {
      return (
        <img
          src={brand.src}
          alt={skill.name}
          className="w-6 h-6 object-contain brightness-0 invert opacity-90"
          loading="lazy"
        />
      );
    }

    const Icon = (LucideIcons as any)[skill.icon || ''] || LucideIcons.AppWindow;
    return <Icon className="w-6 h-6" />;
  };

  const hasGuaranteedIcon = (skill: Skill) => {
    if (skill.icon_url) return true;
    const name = normalize(skill.name);
    return (
      name === 'adobe photoshop' ||
      name === 'photoshop' ||
      name === 'adobe illustrator' ||
      name === 'illustrator' ||
      name === 'adobe after effects' ||
      name === 'after effects' ||
      name === 'adobe premiere pro' ||
      name === 'premiere pro' ||
      name === 'figma' ||
      name === 'sketch' ||
      name === 'blender' ||
      name === 'cinema 4d' ||
      name === 'davinci resolve'
    );
  };

  const visibleSkills = mergedSkills.filter(hasGuaranteedIcon);

  return (
    <section
      id="expertise"
      className="bg-background border-y border-white/[0.06] py-14 sm:py-16 lg:py-20"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div className="max-w-2xl">
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 rounded-full border border-primary-500/30 bg-primary-500/10 text-primary-500 text-[11px] font-semibold tracking-widest uppercase mb-4"
            >
              Expertise
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-display-xl font-bold text-white tracking-tight"
            >
              Tools & disciplines
            </motion.h2>
            <p className="mt-3 text-slate-300/90 text-sm leading-relaxed max-w-xl">
              A focused stack of industry-standard tools—kept short and relevant.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {visibleSkills.map((skill, idx) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.03 }}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-surface-raised px-4 py-3 hover:bg-surface-overlay hover:border-primary-500/25 transition-all duration-300"
            >
              <div className="pointer-events-none absolute -right-10 -top-12 h-20 w-20 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity bg-primary-500/20" />
              <div className="relative z-10 flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface border border-white/[0.08] text-slate-200 group-hover:text-primary-500 transition-colors overflow-hidden shrink-0">
                  <IconComponent skill={skill} />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-white group-hover:text-primary-500 transition-colors leading-snug whitespace-nowrap">
                    {skill.name}
                  </div>
                  <div className="text-xs text-slate-300/75 leading-relaxed whitespace-nowrap">
                    {skill.category}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 text-primary-500 text-sm font-semibold hover:text-primary-400 transition-colors"
          >
            See my work in action <LucideIcons.ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
