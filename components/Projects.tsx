
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, ArrowUpRight, X, ChevronLeft, ChevronRight, Globe, LayoutGrid, Youtube, Maximize2, Image as ImageIcon } from 'lucide-react';
import { Project } from '../types';

interface ProjectsProps {
  projects: Project[];
}

const Projects: React.FC<ProjectsProps> = ({ projects }) => {
  const [filter, setFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'gallery' | 'video'>('gallery');
  const carouselRef = useRef<HTMLDivElement>(null);

  const categories = ['All', ...Array.from(new Set(projects.map(p => p.category)))];

  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(p => p.category === filter);

  const projectImages = useMemo(() => {
    if (!selectedProject) return [];
    const gallery = selectedProject.gallery || [];
    const mainImg = selectedProject.image_url;
    const galleryUrls = gallery.map(g => g.image_url);
    
    if (mainImg && !galleryUrls.includes(mainImg)) {
      return [mainImg, ...galleryUrls];
    }
    return galleryUrls.length > 0 ? galleryUrls : [mainImg];
  }, [selectedProject]);

  useEffect(() => {
    if (selectedProject) {
      setActiveTab(selectedProject.gallery_type === 'video' ? 'video' : 'gallery');
    }
  }, [selectedProject]);

  const scrollToImage = useCallback((index: number) => {
    if (carouselRef.current) {
      const container = carouselRef.current;
      const width = container.offsetWidth;
      container.scrollTo({ left: width * index, behavior: 'smooth' });
      setCurrentImgIndex(index);
    }
  }, []);

  const handleNext = useCallback(() => {
    if (projectImages.length <= 1) return;
    const nextIndex = (currentImgIndex + 1) % projectImages.length;
    if (isLightboxOpen) {
      setCurrentImgIndex(nextIndex);
    } else {
      scrollToImage(nextIndex);
    }
  }, [projectImages, currentImgIndex, scrollToImage, isLightboxOpen]);

  const handlePrev = useCallback(() => {
    if (projectImages.length <= 1) return;
    const prevIndex = (currentImgIndex - 1 + projectImages.length) % projectImages.length;
    if (isLightboxOpen) {
      setCurrentImgIndex(prevIndex);
    } else {
      scrollToImage(prevIndex);
    }
  }, [projectImages, currentImgIndex, scrollToImage, isLightboxOpen]);

  const closeModals = () => {
    setSelectedProject(null);
    setIsLightboxOpen(false);
    setCurrentImgIndex(0);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    if (container.offsetWidth === 0) return;
    const index = Math.round(container.scrollLeft / container.offsetWidth);
    if (index !== currentImgIndex) {
      setCurrentImgIndex(index);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedProject) return;
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') {
        if (isLightboxOpen) setIsLightboxOpen(false);
        else closeModals();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject, handleNext, handlePrev, isLightboxOpen]);

  return (
    <section id="projects" className="py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20">
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 rounded-md border border-primary-500/20 bg-primary-500/5 text-primary-500 text-[10px] font-bold tracking-widest uppercase mb-6"
            >
              Portfolio
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-extrabold text-white tracking-tighter"
            >
              Featured Creations
            </motion.h2>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((cat, idx) => (
              <motion.button
                key={cat}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setFilter(cat)}
                className={`px-6 py-3 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all duration-300 border ${
                  filter === cat 
                    ? 'bg-primary-500 text-black border-primary-500 shadow-xl' 
                    : 'bg-white/5 text-slate-400 border-white/10 hover:border-white/20'
                }`}
              >
                {cat}
              </motion.button>
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
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => {
                  setSelectedProject(project);
                  setCurrentImgIndex(0);
                }}
                className="group cursor-pointer bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-primary-500/50 transition-all duration-500 relative aspect-[4/3]"
              >
                <div className="w-full h-full overflow-hidden bg-slate-900">
                  <img 
                    src={project.image_url} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0" 
                    loading="lazy"
                  />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-10 backdrop-blur-[2px]">
                   <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase text-primary-500 tracking-widest bg-black/50 px-3 py-1 rounded-md backdrop-blur-md border border-white/10">{project.category}</span>
                      </div>
                      <h3 className="text-3xl font-black text-white leading-tight">{project.title}</h3>
                      <div className="pt-4 flex items-center gap-2 text-primary-500 font-black text-[9px] uppercase tracking-[0.2em]">
                        View Details <ArrowUpRight size={14} />
                      </div>
                   </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/98 backdrop-blur-3xl p-4 md:p-8 lg:p-12 overflow-y-auto custom-scrollbar"
          >
             <motion.div 
               initial={{ y: 50, scale: 0.95 }} 
               animate={{ y: 0, scale: 1 }} 
               className="w-full max-w-6xl bg-slate-900 rounded-2xl border border-white/10 overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.6)] my-auto relative"
             >
                <button 
                  onClick={closeModals} 
                  className="absolute top-8 right-8 p-4 bg-white/5 text-white rounded-full hover:bg-primary-500 hover:text-black transition-all z-[250] shadow-2xl backdrop-blur-md border border-white/5"
                >
                  <X size={20} />
                </button>

                <div className="flex flex-col lg:flex-row items-stretch min-h-[600px]">
                   <div className="w-full lg:w-[60%] bg-black relative group/media overflow-hidden border-r border-white/5 flex items-center justify-center min-h-[400px]">
                      {activeTab === 'video' && selectedProject.video_url ? (
                        <div className="w-full h-full aspect-video flex items-center justify-center">
                          <iframe 
                            src={selectedProject.video_url} 
                            className="w-full h-full" 
                            frameBorder="0" 
                            allow="autoplay; fullscreen" 
                            allowFullScreen 
                          />
                        </div>
                      ) : (
                        <div className="w-full h-full relative">
                          <div 
                            ref={carouselRef}
                            onScroll={handleScroll}
                            className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scroll-smooth custom-scrollbar-hide"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                          >
                             {projectImages.map((url, i) => (
                               <div key={i} className="w-full h-full shrink-0 snap-center flex items-center justify-center bg-black relative">
                                  <img src={url} className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-20 scale-110" alt="blur" loading="lazy" />
                                  <img src={url} className="relative z-10 max-w-full max-h-full object-contain" alt={`${selectedProject.title} ${i}`} loading="lazy" />
                               </div>
                             ))}
                          </div>

                          <div className="absolute inset-0 pointer-events-none group-hover/media:pointer-events-auto transition-opacity">
                            {projectImages.length > 1 && (
                              <>
                                <button onClick={handlePrev} className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-black/40 hover:bg-white text-white hover:text-black rounded-full backdrop-blur-xl border border-white/10 transition-all z-30 flex items-center justify-center pointer-events-auto shadow-2xl">
                                  <ChevronLeft size={28} />
                                </button>
                                <button onClick={handleNext} className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-black/40 hover:bg-white text-white hover:text-black rounded-full backdrop-blur-xl border border-white/10 transition-all z-30 flex items-center justify-center pointer-events-auto shadow-2xl">
                                  <ChevronRight size={28} />
                                </button>
                              </>
                            )}

                            <button 
                              onClick={() => setIsLightboxOpen(true)}
                              className="absolute top-6 left-6 p-3 bg-black/40 hover:bg-white text-white hover:text-black rounded-lg backdrop-blur-xl border border-white/5 transition-all shadow-2xl z-30 flex items-center gap-3 pointer-events-auto"
                            >
                              <Maximize2 size={16} />
                              <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">Full Screen</span>
                            </button>
                            
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-5 py-2 bg-black/40 backdrop-blur-xl rounded-full border border-white/5 text-[9px] font-black uppercase tracking-[0.4em] text-white/70 z-30">
                              {currentImgIndex + 1} / {projectImages.length}
                            </div>
                          </div>
                        </div>
                      )}
                   </div>

                   <div className="w-full lg:w-[40%] flex flex-col bg-slate-900/50 overflow-y-auto custom-scrollbar">
                      <div className="p-10 lg:p-14 space-y-10">
                        <div className="space-y-4 pr-12">
                          <div className="flex items-center gap-3">
                             <span className="text-[10px] font-black uppercase text-primary-500 tracking-widest">{selectedProject.category}</span>
                             <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                             <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Project Details</span>
                          </div>
                          <h2 className="text-4xl font-black text-white tracking-tighter leading-tight">{selectedProject.title}</h2>
                          <p className="text-slate-400 text-sm leading-relaxed">{selectedProject.description}</p>
                        </div>

                        <div className="p-8 bg-black/20 rounded-2xl border border-white/5 space-y-6">
                           <div className="flex items-center justify-between">
                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Gallery Media</label>
                              <div className="flex gap-1 bg-slate-900 p-1 rounded-lg">
                                 <button 
                                   onClick={() => setActiveTab('gallery')} 
                                   className={`px-5 py-2 rounded-md text-[9px] font-black uppercase transition-all ${activeTab === 'gallery' ? 'bg-primary-500 text-black shadow-lg' : 'text-slate-500 hover:text-white'}`}
                                 >
                                   Gallery
                                 </button>
                                 {selectedProject.video_url && (
                                   <button 
                                     onClick={() => setActiveTab('video')} 
                                     className={`px-5 py-2 rounded-md text-[9px] font-black uppercase transition-all ${activeTab === 'video' ? 'bg-primary-500 text-black shadow-lg' : 'text-slate-500 hover:text-white'}`}
                                   >
                                     YouTube
                                   </button>
                                 )}
                              </div>
                           </div>

                           {activeTab === 'gallery' && projectImages.length > 0 && (
                             <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar snap-x">
                                {projectImages.map((url, i) => (
                                  <button
                                    key={i}
                                    onClick={() => scrollToImage(i)}
                                    className={`relative shrink-0 w-20 aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 snap-start ${
                                      currentImgIndex === i 
                                        ? 'border-primary-500 scale-105 ring-4 ring-primary-500/10' 
                                        : 'border-white/5 opacity-40 hover:opacity-100'
                                    }`}
                                  >
                                    <img src={url} className="w-full h-full object-cover" alt="thumb" loading="lazy" />
                                  </button>
                                ))}
                             </div>
                           )}
                           
                           {activeTab === 'video' && (
                             <div className="flex items-center gap-4 text-slate-500">
                                <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500"><Youtube size={24}/></div>
                                <span className="text-[10px] font-black uppercase tracking-widest">Video Stream Active</span>
                             </div>
                           )}
                        </div>

                        <div className="space-y-4">
                           <div className="text-[9px] font-black uppercase text-slate-500 tracking-[0.3em]">Toolbox</div>
                           <div className="flex flex-wrap gap-2">
                              {selectedProject.tech_stack?.map(tech => (
                                <span key={tech} className="px-4 py-2 bg-white/5 border border-white/5 rounded-lg text-[9px] font-bold text-slate-300 uppercase tracking-widest">{tech}</span>
                              ))}
                           </div>
                        </div>

                        <div className="flex flex-col gap-3 pt-6">
                           {selectedProject.live_url && (
                             <a href={selectedProject.live_url} target="_blank" className="w-full py-5 bg-primary-500 text-black rounded-xl font-black text-center text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-primary-400 transition-all shadow-xl"><Globe size={18}/> Launch Project</a>
                           )}
                           {selectedProject.github_url && (
                             <a href={selectedProject.github_url} target="_blank" className="w-full py-5 bg-white/5 border border-white/10 text-white rounded-xl font-black text-center text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-white/10 transition-all"><Github size={18}/> Source Code</a>
                           )}
                        </div>
                      </div>
                   </div>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isLightboxOpen && selectedProject && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[400] bg-black flex flex-col items-center justify-center p-4"
          >
            <div className="absolute top-8 left-10 flex items-center gap-6">
                <div>
                   <span className="text-primary-500 text-[10px] font-black uppercase tracking-[0.4em] block mb-1">Immersive View</span>
                   <h2 className="text-2xl font-black text-white tracking-tighter">{selectedProject.title}</h2>
                </div>
            </div>

            <button 
              onClick={() => setIsLightboxOpen(false)} 
              className="absolute top-8 right-10 p-5 bg-white/5 text-white rounded-full hover:bg-white hover:text-black transition-all border border-white/10 backdrop-blur-2xl z-[410] shadow-2xl"
            >
              <X size={28} />
            </button>

            <div className="relative w-full h-full flex items-center justify-center max-w-7xl">
               <motion.img 
                  key={currentImgIndex}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  src={projectImages[currentImgIndex]} 
                  className="max-w-full max-h-full object-contain shadow-[0_0_100px_rgba(0,0,0,0.8)]"
                  alt={`Full screen ${currentImgIndex}`} 
                  loading="lazy"
               />

               {projectImages.length > 1 && (
                 <>
                   <button onClick={handlePrev} className="absolute left-4 lg:left-0 top-1/2 -translate-y-1/2 w-20 h-20 bg-white/5 hover:bg-white text-white hover:text-black rounded-full backdrop-blur-2xl border border-white/10 transition-all flex items-center justify-center group">
                      <ChevronLeft size={48} className="group-hover:scale-110 transition-transform" />
                   </button>
                   <button onClick={handleNext} className="absolute right-4 lg:right-0 top-1/2 -translate-y-1/2 w-20 h-20 bg-white/5 hover:bg-white text-white hover:text-black rounded-full backdrop-blur-2xl border border-white/10 transition-all flex items-center justify-center group">
                      <ChevronRight size={48} className="group-hover:scale-110 transition-transform" />
                   </button>
                 </>
               )}
            </div>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
              <div className="px-8 py-3 bg-white/5 backdrop-blur-2xl rounded-full border border-white/10 text-[11px] font-black uppercase tracking-[0.5em] text-white/80">
                {currentImgIndex + 1} / {projectImages.length}
              </div>
              
              <div className="flex gap-2 overflow-x-auto max-w-[80vw] p-2 custom-scrollbar-hide">
                 {projectImages.map((url, i) => (
                   <button
                     key={i}
                     onClick={() => setCurrentImgIndex(i)}
                     className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${currentImgIndex === i ? 'border-primary-500 scale-110 shadow-lg' : 'border-transparent opacity-30 hover:opacity-100'}`}
                   >
                     <img src={url} className="w-full h-full object-cover" loading="lazy" />
                   </button>
                 ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;
