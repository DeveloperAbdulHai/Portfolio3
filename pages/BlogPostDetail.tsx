
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { BlogPost, Profile } from '../types';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { Loader2, Calendar, Clock, ArrowLeft, Share2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';

const BlogPostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      
      try {
        const [postRes, profileRes] = await Promise.all([
          supabase.from('blogs').select('*').eq('id', id).maybeSingle(),
          supabase.from('profile').select('*').maybeSingle()
        ]);

        if (postRes.error) throw postRes.error;
        if (!postRes.data) {
          setError('Article not found');
          return;
        }

        setPost(postRes.data);
        if (profileRes.data) setProfile(profileRes.data);
      } catch (err: any) {
        console.error('Error fetching post:', err);
        setError(err.message || 'Failed to load article');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary-500" size={48} />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="bg-background min-h-screen">
        <Navbar />
        <main className="pt-40 pb-20 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-white mb-6">{error || 'Article not found'}</h1>
            <button 
              onClick={() => navigate('/blog')}
              className="px-8 py-4 bg-primary-500 text-black font-black rounded-2xl uppercase tracking-widest text-[10px] inline-flex items-center gap-2"
            >
              <ArrowLeft size={16} /> Back to Blog
            </button>
          </div>
        </main>
        <Footer profile={profile} />
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      
      <main className="pt-40 pb-20">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <button 
              onClick={() => navigate('/blog')}
              className="group flex items-center gap-2 text-slate-500 hover:text-primary-500 transition-colors mb-12 font-bold uppercase tracking-widest text-[10px]"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
              Back to Insights
            </button>

            <div className="space-y-8 mb-16">
              <div className="flex items-center gap-4 text-xs font-bold text-primary-500 uppercase tracking-widest">
                <span>{post.category}</span>
                <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                <span className="flex items-center gap-1"><Clock size={12} /> {post.read_time}</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tighter">
                {post.title}
              </h1>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
                    <img src={profile?.avatar_url || "https://picsum.photos/seed/avatar/100"} alt={profile?.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{profile?.name || 'Author'}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                      {new Date(post.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>
                
                <button 
                  onClick={handleShare}
                  className="p-3 bg-white/5 rounded-xl text-slate-400 hover:text-primary-500 hover:bg-white/10 transition-all"
                  title="Share Article"
                >
                  <Share2 size={18} />
                </button>
              </div>
            </div>

            <div className="aspect-video rounded-[40px] overflow-hidden mb-16 border border-white/5 bg-white/5">
              <img 
                src={post.image_url || `https://picsum.photos/seed/${post.id}/1200/675`} 
                className="w-full h-full object-cover" 
                alt={post.title} 
              />
            </div>

            <div className="prose prose-invert prose-primary max-w-none">
              <div className="markdown-body text-slate-300 text-lg leading-relaxed space-y-6">
                <ReactMarkdown>{post.content}</ReactMarkdown>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer profile={profile} />
    </div>
  );
};

export default BlogPostDetail;
