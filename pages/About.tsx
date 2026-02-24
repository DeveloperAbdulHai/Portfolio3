
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Skills from '../components/Skills';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';
import { Profile, Skill, TimelineEntry } from '../types';
import { motion } from 'framer-motion';
import { Building2, GraduationCap, Briefcase, Calendar, Award, Users, Coffee } from 'lucide-react';

const About: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [p, s, t] = await Promise.all([
          supabase.from('profile').select('*').order('updated_at', { ascending: false }).limit(1).maybeSingle(),
          supabase.from('skills').select('*').order('percentage', { ascending: false }),
          supabase.from('timeline').select('*').order('order_index', { ascending: true })
        ]);
        if (p.data) setProfile(p.data);
        if (s.data) setSkills(s.data);
        if (t.data) setTimeline(t.data);
      } catch (err) {
        console.error("About Page Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div></div>;

  const experience = timeline.filter(item => item.type === 'experience');
  const education = timeline.filter(item => item.type === 'education');

  const stats = [
    { icon: <Award className="text-primary-500" />, value: "50+", label: "Projects Completed" },
    { icon: <Users className="text-primary-500" />, value: "30+", label: "Happy Clients" },
    { icon: <Coffee className="text-primary-500" />, value: "5k+", label: "Hours Worked" }
  ];

  // Priority: about_image_url -> avatar_url -> placeholder
  const displayImage = profile?.about_image_url || profile?.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1000';

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <main className="pt-32">
        {/* Intro Section */}
        <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="inline-block px-4 py-1.5 rounded-full border border-primary-500/20 bg-primary-500/5 text-primary-500 text-[10px] font-bold tracking-widest uppercase mb-6">About Me</div>
              <h1 className="text-5xl font-extrabold text-white mb-8 leading-tight">
                {profile?.about_headline || "My journey as a Creative Technologist."}
              </h1>
              <div className="space-y-6 text-slate-400 text-lg leading-relaxed whitespace-pre-wrap">
                <p>{profile?.bio || "Tell your story in the admin dashboard. This area describes your professional journey and passion for creation."}</p>
                <p>Based in {profile?.location || "Global Workspace"}, I bridge the gap between imagination and execution. With a deep focus on user experience and visual storytelling, I create digital solutions that don't just work—they resonate.</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
                {stats.map((stat, i) => (
                  <div key={i} className="p-6 bg-white/5 border border-white/5 rounded-3xl group hover:border-primary-500/30 transition-all will-change-transform">
                    <div className="mb-4">{stat.icon}</div>
                    <div className="text-2xl font-black text-white mb-1">{stat.value}</div>
                    <div className="text-[9px] font-bold uppercase tracking-widest text-slate-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative">
               <div className="aspect-square rounded-[40px] md:rounded-[60px] overflow-hidden border border-white/10 p-4 bg-white/5 shadow-xl md:shadow-2xl relative group">
                  <div className="absolute inset-0 bg-primary-500/10 opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                  <img src={displayImage} className="w-full h-full object-cover rounded-[30px] md:rounded-[50px] transition-all duration-1000" alt={profile?.name || "Profile About Portrait"} />
               </div>
            </motion.div>
          </div>
        </section>

        <Skills skills={skills} />

        {/* Timeline Section */}
        <section className="py-32 bg-slate-950/50">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
                {/* Experience Column */}
                <div className="space-y-12">
                   <div>
                      <span className="text-primary-500 text-[10px] font-black uppercase tracking-[0.4em] block mb-4">Milestones</span>
                      <h2 className="text-4xl font-black text-white tracking-tighter flex items-center gap-4">
                        Professional <span className="text-primary-500">Path.</span>
                      </h2>
                   </div>
                   
                   <div className="space-y-8 relative">
                      {experience.map((item, idx) => (
                        <motion.div 
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.1 }}
                          className="relative pl-12 group"
                        >
                          <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-white/5"></div>
                          <div className="absolute left-[-4px] top-2 w-2 h-2 rounded-full bg-primary-500 group-hover:scale-150 transition-transform"></div>
                          
                          <div className="bg-white/5 border border-white/5 p-8 rounded-3xl group-hover:border-primary-500/30 transition-all">
                             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                <div className="flex items-center gap-3">
                                   <div className="w-10 h-10 bg-primary-500/10 text-primary-500 rounded-xl flex items-center justify-center shrink-0">
                                      <Building2 size={18}/>
                                   </div>
                                   <div>
                                      <h4 className="font-bold text-white text-lg">{item.title}</h4>
                                      <p className="text-slate-500 text-sm font-medium">{item.institution}</p>
                                   </div>
                                </div>
                                <span className="px-4 py-1.5 bg-black/40 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 border border-white/5 shrink-0 whitespace-nowrap self-start sm:self-center">
                                   {item.period}
                                </span>
                             </div>
                             {item.description && <p className="text-slate-500 text-sm leading-relaxed">{item.description}</p>}
                          </div>
                        </motion.div>
                      ))}
                      {experience.length === 0 && <p className="text-slate-600 uppercase text-[10px] font-bold tracking-widest">Experience logs coming soon.</p>}
                   </div>
                </div>

                {/* Education Column */}
                <div className="space-y-12">
                   <div>
                      <span className="text-blue-500 text-[10px] font-black uppercase tracking-[0.4em] block mb-4">Knowledge</span>
                      <h2 className="text-4xl font-black text-white tracking-tighter flex items-center gap-4">
                        Academic <span className="text-blue-500">History.</span>
                      </h2>
                   </div>

                   <div className="space-y-8 relative">
                      {education.map((item, idx) => (
                        <motion.div 
                          key={item.id}
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.1 }}
                          className="relative pl-12 group"
                        >
                          <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-white/5"></div>
                          <div className="absolute left-[-4px] top-2 w-2 h-2 rounded-full bg-blue-500 group-hover:scale-150 transition-transform"></div>

                          <div className="bg-white/5 border border-white/5 p-8 rounded-3xl group-hover:border-blue-500/30 transition-all">
                             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                <div className="flex items-center gap-3">
                                   <div className="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center shrink-0">
                                      <GraduationCap size={18}/>
                                   </div>
                                   <div>
                                      <h4 className="font-bold text-white text-lg">{item.title}</h4>
                                      <p className="text-slate-500 text-sm font-medium">{item.institution}</p>
                                   </div>
                                </div>
                                <span className="px-4 py-1.5 bg-black/40 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 border border-white/5 shrink-0 whitespace-nowrap self-start sm:self-center">
                                   {item.period}
                                </span>
                             </div>
                             {item.description && <p className="text-slate-500 text-sm leading-relaxed">{item.description}</p>}
                          </div>
                        </motion.div>
                      ))}
                      {education.length === 0 && <p className="text-slate-600 uppercase text-[10px] font-bold tracking-widest">Education history coming soon.</p>}
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* Contact Form Integration */}
        <Contact profile={profile} />
      </main>
      <Footer profile={profile} />
    </div>
  );
};

export default About;
