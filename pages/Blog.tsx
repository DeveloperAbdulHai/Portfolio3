
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Profile } from '../types';

const Blog: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    supabase.from('profile').select('*').maybeSingle().then(({ data }) => {
      if (data) setProfile(data);
    });
  }, []);

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <main className="pt-40 pb-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-20">
            <h1 className="text-6xl font-extrabold text-white mb-6">Thoughts <span className="text-primary-500">& Insights.</span></h1>
            <p className="text-slate-500 text-lg">Exploring the intersection of motion, design, and technology.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[1, 2, 3, 4].map((i) => (
              <motion.article 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <div className="aspect-video rounded-[40px] overflow-hidden mb-6 border border-white/5 relative bg-white/5">
                  <div className="absolute inset-0 bg-primary-500/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center font-bold text-black uppercase tracking-widest text-sm z-10">Read Article</div>
                  <img src={`https://picsum.photos/seed/${i}/800/450`} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Blog post" />
                </div>
                <div className="space-y-4">
                  <span className="text-xs font-bold text-primary-500 uppercase tracking-widest">Industry Trends • 5 min read</span>
                  <h2 className="text-3xl font-bold text-white group-hover:text-primary-500 transition-colors">The Future of Interactive Motion Design in 2025</h2>
                  <p className="text-slate-500 leading-relaxed">How generative AI and real-time rendering are changing the landscape of high-end digital advertising and brand storytelling...</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </main>
      <Footer profile={profile} />
    </div>
  );
};

export default Blog;
