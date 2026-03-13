
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Profile, SocialLink } from '../types';
import toast from 'react-hot-toast';

const UNSPLASH_IMAGE = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80';

interface ContactProps {
  profile: Profile | null;
}

const Contact: React.FC<ContactProps> = ({ profile }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  useEffect(() => {
    supabase.from('social_links').select('*').then(({ data }) => {
      if (data) setSocials(data);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from('contact_messages').insert([formData]);
      if (error) throw error;
      toast.success('Message sent successfully!');
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      toast.error('Failed to send message.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const SocialIcon = ({ name }: { name: string }) => {
    const Icon = (LucideIcons as any)[name] || LucideIcons.Link2;
    return <Icon size={20} />;
  };

  const contactInfo = [
    { icon: <Mail size={20} className="text-primary-500" />, label: 'Email', value: profile?.email || '—' },
    { icon: <Phone size={20} className="text-primary-500" />, label: 'Phone', value: profile?.phone || '—' },
    { icon: <MapPin size={20} className="text-primary-500" />, label: 'Location', value: profile?.location || '—' },
  ];

  return (
    <section
      id="contact"
      className="py-20 sm:py-24 lg:py-28 relative overflow-hidden border-t border-white/[0.06]"
    >
      {/* Solid background */}
      <div className="absolute inset-0 -z-10 bg-background" />
      {/* BG image: very low opacity — subtle texture only */}
      {/* <div
        className="absolute inset-0 -z-[5] bg-cover bg-center bg-no-repeat opacity-[0.05]"
        style={{ backgroundImage: `url(${UNSPLASH_IMAGE})` }}
        aria-hidden
      /> */}

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-0">
        <div className="text-center mb-14 sm:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full border border-primary-500/25 bg-primary-500/10 text-primary-500 text-[11px] font-semibold tracking-widest uppercase mb-6"
          >
            Get in touch
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-title text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6"
          >
            Start your next <span className="text-primary-500">project.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="max-w-xl mx-auto text-slate-300 text-base sm:text-lg leading-relaxed"
          >
            Have a brief, a campaign idea, or just want to explore? I'm open to new projects and conversations that push visual boundaries.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-4 space-y-4">
            {contactInfo.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="group flex items-center gap-5 p-6 bg-surface border border-white/[0.08] rounded-2xl hover:border-primary-500/25 transition-all duration-300 shadow-lg shadow-black/20"
              >
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary-500/15 transition-colors border border-white/[0.06]">
                  {item.icon}
                </div>
                <div className="min-w-0">
                  <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-0.5">{item.label}</h4>
                  <p className="text-white font-medium truncate">{item.value}</p>
                </div>
              </motion.div>
            ))}

            {/* Social links */}
            {socials.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="p-6 bg-surface border border-white/[0.08] rounded-2xl shadow-lg shadow-black/20"
              >
                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-4">Connect</h4>
                <div className="flex flex-wrap gap-3">
                  {socials.map((s) => (
                    <a
                      key={s.id}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 rounded-xl bg-white/5 border border-white/[0.08] flex items-center justify-center text-slate-300 hover:text-primary-500 hover:border-primary-500/30 hover:bg-primary-500/10 transition-all duration-300"
                      aria-label={s.platform}
                    >
                      <SocialIcon name={s.icon || s.platform} />
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-surface backdrop-blur p-8 md:p-10 rounded-3xl border border-white/[0.08] shadow-xl shadow-black/30"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold text-slate-200 uppercase tracking-wider">Full name</label>
                    <input
                      required
                      type="text"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-5 py-4 bg-white/20 border border-white/20 rounded-xl focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-white placeholder:text-slate-400 font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold text-slate-200 uppercase tracking-wider">Email</label>
                    <input
                      required
                      type="email"
                      placeholder="you@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-5 py-4 bg-white/20 border border-white/20 rounded-xl focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-white placeholder:text-slate-400 font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-slate-200 uppercase tracking-wider">Subject</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Motion design project"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-5 py-4 bg-white/20 border border-white/20 rounded-xl focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-white placeholder:text-slate-400 font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-slate-200 uppercase tracking-wider">Message</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Tell me about your project..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-5 py-4 bg-white/20 border border-white/20 rounded-xl focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-white placeholder:text-slate-400 font-medium resize-none"
                  />
                </div>
                <div className="flex justify-start">
                  <button
                    disabled={loading}
                    className={`inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-sm transition-all ${
                      success
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-white text-black hover:bg-white/90 active:scale-[0.99]'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  ) : success ? (
                    <>Message sent <CheckCircle size={18} /></>
                  ) : (
                    <>Send message <Send size={18} /></>
                  )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
