
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, ArrowUpRight } from 'lucide-react';
import { Project } from '../types';

interface ProjectsProps {
  projects: Project[];
}

const Projects: React.FC<ProjectsProps> = ({ projects }) => {
  const [filter, setFilter] = useState('All');
  const categories = ['All', ...Array.from(new Set(projects.map(p => p.category)))];

  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <section id="projects" className="py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20">
          <div>
            <div className="inline-block px-4 py-1.5 rounded-full border border-primary-500/20 bg-primary-500/5 text-primary-500 text-[10px] font-bold tracking-widest uppercase mb-6">Portfolio</div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white">Featured Creations</h2>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all duration-300 border ${
                  filter === cat 
                    ? 'bg-primary-500 text-black border-primary-500 shadow-[0_0_20px_rgba(0,208,132,0.3)]' 
                    : 'bg-white/5 text-slate-400 border-white/10 hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence mode='popLayout'>
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-white/5 border border-white/10 rounded-[40px] overflow-hidden hover:border-primary-500/50 transition-all duration-500 flex flex-col h-full"
              >
                <div className="relative aspect-video overflow-hidden p-3">
                  <div className="w-full h-full rounded-[30px] overflow-hidden relative">
                    <img 
                      src={project.image_url} 
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-6 z-20">
                      <a href={project.github_url} className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black hover:bg-primary-500 transition-colors"><Github size={20}/></a>
                      <a href={project.live_url} className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black hover:bg-primary-500 transition-colors"><ArrowUpRight size={20}/></a>
                    </div>
                  </div>
                </div>

                <div className="p-8 space-y-4 flex-1 flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-primary-500 uppercase tracking-widest">{project.category}</span>
                    <span className="text-slate-600 text-xs font-bold">2024</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-primary-500 transition-colors">{project.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed flex-1">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-4">
                    {project.tech_stack.map((tech) => (
                      <span key={tech} className="text-[9px] px-3 py-1 bg-white/5 text-slate-400 rounded-full font-bold uppercase tracking-widest border border-white/5">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Projects;
