
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
      <main className="pt-28">
        <Services services={services} />

        <section className="py-section bg-surface-muted border-y border-white/[0.06]">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="text-primary-500 text-[11px] font-semibold uppercase tracking-widest block mb-4">Core benefits</span>
                <h2 className="font-display text-display-xl font-bold text-white mb-8">Elevating your <span className="text-primary-500">brand.</span></h2>
                <div className="space-y-8">
                  {benefits.map((benefit, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      className="flex gap-5"
                    >
                      <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center shrink-0 text-primary-500">
                        {benefit.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-1">{benefit.title}</h4>
                        <p className="text-slate-500 text-sm leading-relaxed">{benefit.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-8 bg-surface border border-white/[0.06] rounded-3xl"
              >
                <CheckCircle2 className="text-primary-500 w-14 h-14 mb-6" />
                <h3 className="font-display text-2xl font-bold text-white mb-4">Quality guaranteed</h3>
                <p className="text-slate-500 leading-relaxed mb-6">Every project is reviewed for performance, accessibility, and visual impact.</p>
                <div className="flex flex-wrap gap-2">
                  {['Clean deliverables', 'On-brand', 'Responsive', 'On time'].map((tag) => (
                    <span key={tag} className="px-3 py-1.5 bg-surface-elevated rounded-lg text-[11px] font-medium text-slate-500">{tag}</span>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-section bg-background">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="text-center mb-14">
              <span className="text-primary-500 text-[11px] font-semibold uppercase tracking-widest block mb-4">Workflow</span>
              <h2 className="font-display text-display-lg font-bold text-white">My working <span className="text-primary-500">process</span></h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className="relative group text-center lg:text-left p-6 bg-surface border border-white/[0.06] rounded-2xl hover:border-primary-500/20 transition-all"
                >
                  <div className="text-5xl font-display font-bold text-white/[0.04] group-hover:text-primary-500/[0.08] pointer-events-none">0{idx + 1}</div>
                  <div className="w-14 h-14 bg-surface-elevated rounded-xl flex items-center justify-center text-primary-500 mb-6 mx-auto lg:mx-0 group-hover:bg-primary-500 group-hover:text-black transition-all">
                    {step.icon}
                  </div>
                  <h4 className="font-display text-lg font-semibold text-white mb-3">{step.title}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
            <div className="mt-14 text-center">
              <a href="#contact" className="inline-flex items-center gap-2 text-primary-500 text-sm font-semibold hover:text-primary-400 transition-colors">
                Start a project →
              </a>
            </div>
          </div>
        </section>

        <Contact profile={profile} />
      </main>
      <Footer profile={profile} />
    </div>
  );
};

export default ServicesPage;
