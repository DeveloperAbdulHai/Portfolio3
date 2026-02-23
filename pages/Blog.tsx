import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Profile, BlogPost } from '../types';
import { Loader2, Calendar, Clock } from 'lucide-react';

const Blog: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, blogsRes] = await Promise.all([
          supabase.from('profile').select('*').maybeSingle(),
          supabase.from('blogs').select('*').order('created_at', { ascending: false })
        ]);

        if (profileRes.data) setProfile(profileRes.data);
        if (blogsRes.data) setBlogs(blogsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-primary-500" size={48} />
            </div>
          ) : blogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {blogs.map((post) => (
                <motion.article 
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  onClick={() => navigate(`/blog/${post.id}`)}
                  className="group cursor-pointer"
                >
                  <div className="aspect-video rounded-[40px] overflow-hidden mb-6 border border-white/5 relative bg-white/5">
                    <div className="absolute inset-0 bg-primary-500/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center font-bold text-black uppercase tracking-widest text-sm z-10">Read Article</div>
                    <img 
                      src={post.image_url || `https://picsum.photos/seed/${post.id}/800/450`} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                      alt={post.title} 
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-xs font-bold text-primary-500 uppercase tracking-widest">
                      <span>{post.category}</span>
                      <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {post.read_time}</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white group-hover:text-primary-500 transition-colors">{post.title}</h2>
                    <p className="text-slate-500 leading-relaxed line-clamp-3">{post.content}</p>
                    <div className="pt-2 text-[10px] text-slate-600 font-bold uppercase tracking-widest flex items-center gap-2">
                      <Calendar size={12} /> {new Date(post.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">No articles published yet.</p>
            </div>
          )}
        </div>
      </main>
      <Footer profile={profile} />
    </div>
  );
};

export default Blog;
