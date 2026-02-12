
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Services from '../components/Services';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';
import { Profile, Service } from '../types';
import { motion } from 'framer-motion';
import { Search, PenTool, Terminal, Rocket, CheckCircle2, Zap, Shield, Target } from 'lucide-react';

const ServicesPage: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [p, s] = await Promise.all([
          supabase.from('profile').select('*').order('updated_at', { ascending: false }).limit(1).maybeSingle(),
          supabase.from('services').select('*').order('title', { ascending: true })
        ]);
        if (p.data) setProfile(p.data);
        if (s.data) setServices(s.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div></div>;

  const steps = [
    { icon: <Search />, title: "Discovery", desc: "Understanding your vision, target audience, and project goals to build a solid foundation." },
    { icon: <PenTool />, title: "Design", desc: "Crafting wireframes and visual prototypes that prioritize high-end aesthetics and UX." },
    { icon: <Terminal />, title: "Execution", desc: "Turning designs into high-performance digital reality using cutting-edge technology." },
    { icon: <Rocket />, title: "Delivery", desc: "Rigorous testing and optimization followed by a seamless launch and transition." }
  ];

  const benefits = [
    { icon: <Zap className="text-primary-500" />, title: "Fast Turnaround", desc: "Optimized workflows ensuring your projects are delivered on time without compromising quality." },
    { icon: <Shield className="text-primary-500" />, title: "Secure & Scalable", desc: "Building with industry-standard security practices and future-proof architectures." },
    { icon: <Target className="text-primary-500" />, title: "Result Oriented", desc: "Focusing on measurable outcomes that drive engagement and business growth." }
  ];

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <main className="pt-32">
        <Services services={services} />

        {/* Extended Details Section */}
        <section className="py-32 bg-slate-950/30">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div>
                <span className="text-primary-500 text-[10px] font-black uppercase tracking-[0.4em] block mb-4">Core Benefits</span>
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-8">Elevating your <span className="text-primary-500">Digital Identity.</span></h2>
                <div className="space-y-10">
                  {benefits.map((benefit, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex gap-6"
                    >
                      <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center shrink-0">
                        {benefit.icon}
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-lg mb-2">{benefit.title}</h4>
                        <p className="text-slate-500 text-sm leading-relaxed">{benefit.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-[64px] bg-gradient-to-br from-primary-500/20 to-transparent p-px">
                  <div className="w-full h-full bg-slate-950 rounded-[64px] p-12 flex flex-col justify-center">
                    <CheckCircle2 className="text-primary-500 w-16 h-16 mb-8" />
                    <h3 className="text-3xl font-black text-white mb-6">Quality Guaranteed</h3>
                    <p className="text-slate-400 leading-relaxed mb-8">Every project undergoes a rigorous review process to ensure it meets the highest standards of performance, accessibility, and visual fidelity.</p>
                    <div className="flex flex-wrap gap-3">
                      {['Clean Code', 'SEO Optimized', 'Responsive', 'High Performance'].map(tag => (
                        <span key={tag} className="px-4 py-2 bg-white/5 border border-white/5 rounded-full text-[10px] font-bold uppercase tracking-widest text-slate-500">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-32 bg-slate-950/50 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="text-center mb-24">
              <span className="text-primary-500 text-[10px] font-black uppercase tracking-[0.4em] block mb-4">Workflow</span>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">My Working <span className="text-primary-500">Process.</span></h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {steps.map((step, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative group text-center lg:text-left"
                >
                  <div className="absolute -top-6 -left-4 text-7xl font-black text-white/[0.03] group-hover:text-primary-500/[0.05] transition-colors pointer-events-none">0{idx + 1}</div>
                  
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-primary-500 mb-8 mx-auto lg:mx-0 group-hover:scale-110 group-hover:bg-primary-500 group-hover:text-black transition-all">
                      {step.icon}
                    </div>
                    <h4 className="text-xl font-bold text-white mb-4">{step.title}</h4>
                    <p className="text-slate-500 text-sm leading-relaxed font-medium">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Functional Contact Section */}
        <Contact profile={profile} />
      </main>
      <Footer profile={profile} />
    </div>
  );
};

export default ServicesPage;
