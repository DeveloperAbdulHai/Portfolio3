
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
          supabase.from('testimonials').select('*')
        ]);

        const [prof, sk, proj, soc, serv, why, test] = results;

        if (prof.data) setProfile(prof.data);
        if (sk.data) setSkills(sk.data);
        if (proj.data) setProjects(proj.data);
        if (soc.data) setSocials(soc.data);
        if (serv.data) setServices(serv.data);
        if (why.data) setWhyChooseMe(why.data);
        if (test.data) setTestimonials(test.data);

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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-6">
          <div className="w-12 h-12 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">Synchronizing Data</p>
        </div>
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
      
      {/* 
          Moved WhyChooseMe to appear right above the Contact section.
          Note: Ensure you have added entries to the 'why_choose_me' table 
          via the Admin Panel to see this content.
      */}
      {whyChooseMe.length > 0 && <WhyChooseMe items={whyChooseMe} />}
      
      <Contact profile={profile} />
      <Footer profile={profile} />
    </div>
  );
};

export default Home;
