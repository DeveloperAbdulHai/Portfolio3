
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, ArrowUpRight, X, ChevronLeft, ChevronRight, Globe, LayoutGrid, Youtube, Maximize2, Image as ImageIcon, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Project } from '../types';

interface ProjectsProps {
  projects: Project[];
  isHomePage?: boolean;
}

const Projects: React.FC<ProjectsProps> = ({ projects, isHomePage = false }) => {
  const [filter, setFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'gallery' | 'video'>('gallery');
  const carouselRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const categories = ['All', ...Array.from(new Set(projects.map(p => p.category)))];

  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(p => p.category === filter);

  const displayLimit = 12;
  const displayedProjects = isHomePage ? filteredProjects.slice(0, displayLimit) : filteredProjects;
  const hasMore = filteredProjects.length > displayLimit;

  // Helper to convert standard video URLs to embed URLs
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    const ytMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/\s]+)/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
    const vimeoMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    return url;
  };

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
            {displayedProjects.map((project, index) => (
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

        {isHomePage && hasMore && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 flex justify-end"
          >
            <button 
              onClick={() => navigate('/portfolio')}
              className="group px-10 py-5 bg-white/5 border border-white/10 text-white rounded-xl font-black text-[11px] uppercase tracking-[0.3em] flex items-center gap-4 hover:bg-primary-500 hover:text-black hover:border-primary-500 transition-all duration-500 shadow-2xl active:scale-95"
            >
              View All Projects 
              <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-300" />
            </button>
          </motion.div>
        )}
      </div>

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
                            src={getEmbedUrl(selectedProject.video_url)} 
                            className="w-full h-full" 
                            frameBorder="0" 
                            allow="autoplay; fullscreen; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
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
                        </div>
                      )}
                   </div>
                   {/* Rest of info panel omitted for brevity as it hasn't changed... */}
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;
