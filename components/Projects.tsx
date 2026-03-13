
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, ArrowUpRight, X, ChevronLeft, ChevronRight, Youtube, Maximize2, Image as ImageIcon, ArrowRight, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Project } from '../types';
import { Dialog, DialogContent } from './ui/dialog';

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
    <section id="projects" className="py-20 sm:py-24 lg:py-28 bg-background border-y border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-10 sm:mb-12">
          <div className="max-w-2xl">
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 rounded-full border border-primary-500/25 bg-primary-500/10 text-primary-500 text-[11px] font-semibold tracking-widest uppercase mb-6"
            >
              Portfolio
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-title text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight"
            >
              Featured work
            </motion.h2>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-300/90 max-w-xl">
              Selected projects across graphics, motion, video, and CGI—crafted for clarity, polish, and brand impact.
            </p>
          </div>

          <div className="w-full lg:w-auto">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 -mb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {categories.map((cat, idx) => (
                <motion.button
                  key={cat}
                  initial={{ opacity: 0, scale: 0.96 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.03 }}
                  onClick={() => setFilter(cat)}
                  className={`shrink-0 px-5 py-2.5 rounded-full text-[11px] font-semibold uppercase tracking-wider transition-all duration-300 border whitespace-nowrap ${
                    filter === cat
                      ? 'bg-white text-black border-white shadow-[0_10px_30px_-18px_rgba(255,255,255,0.35)]'
                      : 'bg-surface text-slate-400 border-white/[0.06] hover:border-white/15 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
          {displayedProjects.map((project, index) => (
            <motion.button
              type="button"
              key={project.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.42, ease: 'easeOut' }}
              onClick={() => {
                setSelectedProject(project);
                setCurrentImgIndex(0);
              }}
              className="group mb-6 w-full break-inside-avoid rounded-2xl overflow-hidden bg-surface border border-white/[0.06] hover:border-primary-500/30 transition-all duration-500 relative text-left"
            >
              <div className="relative w-full overflow-hidden bg-surface-elevated">
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  loading="lazy"
                />

                {project.video_url && (
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    <span className="px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-black/55 text-white border border-white/10 backdrop-blur-md">
                      Video
                    </span>
                    <div className="h-10 w-10 rounded-full bg-primary-500 text-black grid place-items-center shadow-lg">
                      <Play size={16} className="ml-0.5" />
                    </div>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-background/98 via-background/65 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="transform translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="rounded-2xl bg-black/55 backdrop-blur-md border border-white/10 p-5 sm:p-6 shadow-[0_18px_50px_-30px_rgba(0,0,0,0.85)]">
                      <span className="text-[10px] font-semibold uppercase text-primary-400 tracking-wider">
                        {project.category}
                      </span>
                      <h3 className="mt-2 font-title text-2xl sm:text-[1.7rem] font-semibold text-white leading-tight">
                        {project.title}
                      </h3>
                      <div className="mt-3 inline-flex items-center gap-2 text-primary-300 text-[11px] font-semibold uppercase tracking-wider">
                        View details <ArrowUpRight size={14} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 sm:mt-14 flex flex-wrap gap-4 justify-center md:justify-end"
        >
          {isHomePage && hasMore && (
            <button
              onClick={() => navigate('/portfolio')}
              className="group px-6 py-3 bg-surface border border-white/10 text-white rounded-xl font-semibold text-sm flex items-center gap-2 hover:border-primary-500/40 hover:text-primary-500 transition-all"
            >
              View all projects <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}
          <button
            onClick={() => navigate('/contact')}
            className="px-6 py-3 bg-white text-black rounded-xl font-semibold text-sm flex items-center gap-2 hover:bg-white/90 transition-colors shadow-[0_18px_60px_-28px_rgba(255,255,255,0.35)] border border-white/10"
          >
            Start a project <ArrowRight size={16} />
          </button>
        </motion.div>
      </div>

      <Dialog open={!!selectedProject} onOpenChange={(open) => !open && closeModals()}>
        <DialogContent hideCloseButton className="max-w-6xl p-0 bg-slate-900 border border-white/10 overflow-hidden">
          {selectedProject && (
            <div className="relative">
              <button
                onClick={closeModals}
                className="absolute top-4 right-4 md:top-6 md:right-6 p-3 bg-black/60 text-white rounded-full hover:bg-primary-500 hover:text-black transition-all z-[50] border border-white/10 backdrop-blur-md"
              >
                <X size={18} />
              </button>

              <div className="flex flex-col lg:flex-row items-stretch">
                {/* Left: media */}
                <div className="w-full lg:w-[60%] bg-black relative group/media overflow-hidden border-r border-white/5 flex items-center justify-center min-h-[360px]">
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
                            <img src={url} className="absolute inset-0 w-full h-full object-cover blur-xl md:blur-3xl opacity-20 scale-110" alt="" loading="lazy" />
                            <img src={url} className="relative z-10 max-w-full max-h-full object-contain" alt={`${selectedProject.title} ${i + 1}`} loading="lazy" />
                          </div>
                        ))}
                      </div>

                      {projectImages.length > 1 && (
                        <>
                          <button
                            onClick={handlePrev}
                            className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 p-3 md:p-4 bg-black/40 text-white rounded-full backdrop-blur-md lg:opacity-0 lg:group-hover/media:opacity-100 transition-all hover:bg-primary-500 hover:text-black z-20 border border-white/10"
                          >
                            <ChevronLeft size={22} />
                          </button>
                          <button
                            onClick={handleNext}
                            className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 p-3 md:p-4 bg-black/40 text-white rounded-full backdrop-blur-md lg:opacity-0 lg:group-hover/media:opacity-100 transition-all hover:bg-primary-500 hover:text-black z-20 border border-white/10"
                          >
                            <ChevronRight size={22} />
                          </button>

                          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                            {projectImages.map((_, i) => (
                              <button
                                key={i}
                                onClick={() => scrollToImage(i)}
                                className={`h-2 rounded-full transition-all ${currentImgIndex === i ? 'bg-primary-500 w-8' : 'bg-white/20 w-2'}`}
                                aria-label={`Go to image ${i + 1}`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* View toggles */}
                  {selectedProject.video_url && (
                    <div className="absolute top-4 left-4 md:top-6 md:left-6 flex gap-2 z-30">
                      <button
                        onClick={() => setActiveTab('gallery')}
                        className={`px-4 py-2 rounded-full flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider transition-all border ${
                          activeTab === 'gallery'
                            ? 'bg-primary-500 text-black border-primary-500'
                            : 'bg-black/60 text-white hover:bg-black/75 border-white/10 backdrop-blur-md'
                        }`}
                      >
                        <ImageIcon size={14} /> Gallery
                      </button>
                      <button
                        onClick={() => setActiveTab('video')}
                        className={`px-4 py-2 rounded-full flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider transition-all border ${
                          activeTab === 'video'
                            ? 'bg-primary-500 text-black border-primary-500'
                            : 'bg-black/60 text-white hover:bg-black/75 border-white/10 backdrop-blur-md'
                        }`}
                      >
                        <Youtube size={14} /> Video
                      </button>
                    </div>
                  )}

                  {/* Fullscreen button (gallery only) */}
                  {activeTab === 'gallery' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsLightboxOpen(true);
                      }}
                      className="absolute bottom-4 right-4 md:top-6 md:right-6 md:bottom-auto p-3 md:p-4 bg-black/60 text-white rounded-full backdrop-blur-md transition-all hover:bg-primary-500 hover:text-black z-30 border border-white/10 pointer-events-auto"
                      aria-label="Open fullscreen"
                    >
                      <Maximize2 size={18} />
                    </button>
                  )}
                </div>

                {/* Right: details (no thumbnails) */}
                <div className="w-full lg:w-[40%] p-8 sm:p-10 lg:p-12 overflow-y-auto custom-scrollbar flex flex-col">
                  <div className="flex-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-500 text-[10px] font-semibold uppercase tracking-wider mb-5">
                      {selectedProject.category}
                    </div>
                    <h2 className="font-title text-3xl sm:text-4xl font-bold text-white leading-tight tracking-tight">
                      {selectedProject.title}
                    </h2>

                    <div className="mt-6 space-y-7">
                      <div>
                        <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-3">Overview</h4>
                        <p className="text-slate-300/90 text-sm leading-relaxed">
                          {selectedProject.description}
                        </p>
                      </div>

                      {selectedProject.tech_stack && selectedProject.tech_stack.length > 0 && (
                        <div>
                          <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-3">Tools / Stack</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedProject.tech_stack.map((tech) => (
                              <span key={tech} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[11px] font-medium text-slate-300/80">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-8 border-t border-white/10">
                    {selectedProject.live_url && (
                      <a
                        href={selectedProject.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 py-3.5 bg-primary-500 text-black rounded-xl font-semibold text-sm hover:bg-primary-400 transition-colors"
                      >
                        Visit live <ExternalLink size={16} />
                      </a>
                    )}
                    {selectedProject.github_url && (
                      <a
                        href={selectedProject.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 py-3.5 bg-white/5 border border-white/10 text-white rounded-xl font-semibold text-sm hover:bg-white/10 transition-colors"
                      >
                        Source code <Github size={16} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Lightbox / Fullscreen Image */}
      <AnimatePresence>
        {isLightboxOpen && selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black/98 flex flex-col items-center justify-center p-6"
          >
             {/* Full Screen Close Button */}
             <button 
               onClick={(e) => {
                 e.stopPropagation();
                 setIsLightboxOpen(false);
               }}
               className="absolute top-10 right-10 p-5 bg-black/60 text-white rounded-full hover:bg-primary-500 hover:text-black transition-all z-[350] border border-white/10 pointer-events-auto shadow-2xl backdrop-blur-xl"
             >
               <X size={24} />
             </button>

             <div className="relative w-full h-full flex items-center justify-center group/lightbox z-10">
                {projectImages.length > 1 && (
                  <>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                      className="absolute left-6 md:left-10 p-6 bg-black/40 text-white rounded-full hover:bg-primary-500 hover:text-black transition-all z-[320] pointer-events-auto backdrop-blur-md"
                    >
                      <ChevronLeft size={32} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleNext(); }}
                      className="absolute right-6 md:right-10 p-6 bg-black/40 text-white rounded-full hover:bg-primary-500 hover:text-black transition-all z-[320] pointer-events-auto backdrop-blur-md"
                    >
                      <ChevronRight size={32} />
                    </button>
                  </>
                )}

                <motion.img 
                  key={currentImgIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  src={projectImages[currentImgIndex]} 
                  className="max-w-full max-h-full object-contain shadow-[0_0_100px_rgba(0,208,132,0.1)] relative z-[310]" 
                  onClick={(e) => e.stopPropagation()}
                />

                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 px-6 py-3 bg-black/60 border border-white/10 rounded-full text-[11px] font-black uppercase tracking-[0.4em] text-white backdrop-blur-md z-[320]">
                   {currentImgIndex + 1} / {projectImages.length}
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;
