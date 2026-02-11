
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Skills from '../components/Skills';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';
import { Profile, Skill } from '../types';
import { motion } from 'framer-motion';

const About: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [p, s] = await Promise.all([
          supabase.from('profile').select('*').maybeSingle(),
          supabase.from('skills').select('*').order('percentage', { ascending: false })
        ]);
        if (p.data) setProfile(p.data);
        if (s.data) setSkills(s.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <main className="pt-32">
        <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="inline-block px-4 py-1.5 rounded-full border border-primary-500/20 bg-primary-500/5 text-primary-500 text-[10px] font-bold tracking-widest uppercase mb-6">About Me</div>
              <h1 className="text-5xl font-extrabold text-white mb-8 leading-tight">My journey as a <span className="text-primary-500">Creative Technologist.</span></h1>
              <div className="space-y-6 text-slate-400 text-lg leading-relaxed">
                <p>{profile?.bio || "Tell your story in the admin dashboard. This area describes your professional journey and passion for creation."}</p>
                <p>Based in {profile?.location || "Global Workspace"}, I bridge the gap between imagination and execution. With a deep focus on user experience and visual storytelling, I create digital solutions that don't just work—they resonate.</p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative">
               <div className="aspect-square rounded-[60px] overflow-hidden border border-white/10 p-4 bg-white/5">
                  <img src={profile?.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1000'} className="w-full h-full object-cover rounded-[50px]" alt={profile?.name || "Profile"} />
               </div>
            </motion.div>
          </div>
        </section>
        <Skills skills={skills} />
      </main>
      <Footer profile={profile} />
    </div>
  );
};

export default About;
