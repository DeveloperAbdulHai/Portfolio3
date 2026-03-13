
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
      <main className="pt-28">
        <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-section">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <span className="inline-block px-4 py-1.5 rounded-full border border-primary-500/25 bg-primary-500/10 text-primary-500 text-[11px] font-semibold tracking-widest uppercase mb-6">About me</span>
              <h1 className="font-display text-display-xl font-bold text-white mb-6 leading-tight">
                {profile?.about_headline || "Visualizer bridging ideas and execution."}
              </h1>
              <div className="space-y-5 text-slate-500 text-base leading-relaxed whitespace-pre-wrap">
                <p>{profile?.bio || "I turn brand stories into striking visuals—static and motion design, video editing, and campaigns that boost visibility."}</p>
                <p>Based in {profile?.location || "Global"}, I focus on visual storytelling and user experience to create work that resonates and gets noticed.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
                {stats.map((stat, i) => (
                  <div key={i} className="p-5 bg-surface border border-white/[0.06] rounded-2xl hover:border-primary-500/20 transition-all">
                    <div className="mb-3">{stat.icon}</div>
                    <div className="font-display text-xl font-bold text-white mb-0.5">{stat.value}</div>
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{stat.label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-10">
                <a href="#contact" className="inline-flex items-center gap-2 text-primary-500 text-sm font-semibold hover:text-primary-400 transition-colors">
                  Start a project →
                </a>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden border border-white/[0.06] bg-surface relative group">
                <img src={displayImage} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={profile?.name || "Profile"} />
                <div className="absolute inset-0 bg-primary-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          </div>
        </section>

        <Skills skills={skills} />

        <section className="py-section bg-surface-muted border-y border-white/[0.06]">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
              <div className="space-y-10">
                <span className="text-primary-500 text-[11px] font-semibold uppercase tracking-widest block mb-4">Milestones</span>
                <h2 className="font-display text-display-lg font-bold text-white">
                  Professional <span className="text-primary-500">path</span>
                </h2>
                <div className="space-y-6">
                  {experience.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.08 }}
                      className="relative pl-10 group"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-px bg-white/10" />
                      <div className="absolute left-[-3px] top-2 w-2 h-2 rounded-full bg-primary-500" />
                      <div className="bg-surface border border-white/[0.06] p-6 rounded-2xl group-hover:border-primary-500/20 transition-all">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary-500/10 text-primary-500 rounded-xl flex items-center justify-center shrink-0">
                              <Building2 size={18} />
                            </div>
                            <div>
                              <h4 className="font-semibold text-white">{item.title}</h4>
                              <p className="text-slate-500 text-sm">{item.institution}</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 shrink-0">{item.period}</span>
                        </div>
                        {item.description && <p className="text-slate-500 text-sm leading-relaxed">{item.description}</p>}
                      </div>
                    </motion.div>
                  ))}
                  {experience.length === 0 && <p className="text-slate-600 text-sm">Experience coming soon.</p>}
                </div>
              </div>
              <div className="space-y-10">
                <span className="text-primary-500 text-[11px] font-semibold uppercase tracking-widest block mb-4">Knowledge</span>
                <h2 className="font-display text-display-lg font-bold text-white">
                  Academic <span className="text-primary-500">history</span>
                </h2>
                <div className="space-y-6">
                  {education.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.08 }}
                      className="relative pl-10 group"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-px bg-white/10" />
                      <div className="absolute left-[-3px] top-2 w-2 h-2 rounded-full bg-primary-500" />
                      <div className="bg-surface border border-white/[0.06] p-6 rounded-2xl group-hover:border-primary-500/20 transition-all">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary-500/10 text-primary-500 rounded-xl flex items-center justify-center shrink-0">
                              <GraduationCap size={18} />
                            </div>
                            <div>
                              <h4 className="font-semibold text-white">{item.title}</h4>
                              <p className="text-slate-500 text-sm">{item.institution}</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 shrink-0">{item.period}</span>
                        </div>
                        {item.description && <p className="text-slate-500 text-sm leading-relaxed">{item.description}</p>}
                      </div>
                    </motion.div>
                  ))}
                  {education.length === 0 && <p className="text-slate-600 text-sm">Education coming soon.</p>}
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
