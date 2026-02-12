
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Services from '../components/Services';
import WhyChooseMe from '../components/WhyChooseMe';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';
import { Profile, Skill, Project, SocialLink, Service, Testimonial, WhyChooseMe as WhyChooseMeType } from '../types';

const Home: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [whyChooseMe, setWhyChooseMe] = useState<WhyChooseMeType[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const results = await Promise.all([
          supabase.from('profile').select('*').order('updated_at', { ascending: false }).limit(1).maybeSingle(),
          supabase.from('skills').select('*').order('percentage', { ascending: false }),
          supabase.from('projects').select('*').order('created_at', { ascending: false }),
          supabase.from('social_links').select('*'),
          supabase.from('services').select('*'),
          supabase.from('why_choose_me').select('*').order('order_index', { ascending: true }),
          supabase.from('testimonials').select('*'),
          supabase.from('project_images').select('*') // Fetch gallery images
        ]);

        const [prof, sk, proj, soc, serv, why, test, imgs] = results;

        if (prof.data) setProfile(prof.data);
        if (sk.data) setSkills(sk.data);
        if (soc.data) setSocials(soc.data);
        if (serv.data) setServices(serv.data);
        if (why.data) setWhyChooseMe(why.data);
        if (test.data) setTestimonials(test.data);

        if (proj.data) {
          const galleryImgs = imgs.data || [];
          const projsWithGallery = proj.data.map((p: any) => ({
            ...p,
            gallery: galleryImgs.filter((img: any) => img.project_id === p.id)
          }));
          setProjects(projsWithGallery);
        }

      } catch (err) {
        console.error("Critical Sync Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-primary-500">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  return (
    <div className="bg-background overflow-hidden scroll-smooth selection:bg-primary-500 selection:text-black">
      <Navbar />
      <Hero profile={profile} socials={socials} />
      {skills.length > 0 && <Skills skills={skills} />}
      {services.length > 0 && <Services services={services} />}
      {projects.length > 0 && <Projects projects={projects} />}
      {testimonials.length > 0 && <Testimonials testimonials={testimonials} />}
      {whyChooseMe.length > 0 && <WhyChooseMe items={whyChooseMe} />}
      <Contact profile={profile} />
      <Footer profile={profile} />
    </div>
  );
};

// Helper Loader for loading state
const Loader2: React.FC<{className?: string, size?: number}> = ({className, size}) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export default Home;
