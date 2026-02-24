
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Profile } from '../types';
import toast from 'react-hot-toast';

interface ContactProps {
  profile: Profile | null;
}

const Contact: React.FC<ContactProps> = ({ profile }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([formData]);

      if (error) throw error;

      toast.success("Message sent successfully!");
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      toast.error("Failed to send message.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { 
      icon: <Mail className="text-primary-500" />, 
      label: 'Email', 
      value: profile?.email || 'Synchronizing...' 
    },
    { 
      icon: <Phone className="text-primary-500" />, 
      label: 'Phone', 
      value: profile?.phone || 'Synchronizing...' 
    },
    { 
      icon: <MapPin className="text-primary-500" />, 
      label: 'Location', 
      value: profile?.location || 'Synchronizing...' 
    },
  ];

  return (
    <section id="contact" className="py-32 bg-background border-t border-white/5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-primary-500/5 blur-[80px] md:blur-[160px] rounded-full -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full border border-primary-500/20 bg-primary-500/5 text-primary-500 text-[10px] font-black tracking-[0.4em] uppercase mb-8"
          >
            Connectivity
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-6"
          >
            Get In <span className="text-primary-500">Touch.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto text-slate-500 text-lg leading-relaxed font-medium"
          >
            Have a project in mind or just want to say hi? I'm always open to new opportunities and interesting conversations.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Info Side */}
          <div className="lg:col-span-4 space-y-4">
            {contactInfo.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group flex items-center gap-6 p-8 bg-white/[0.02] border border-white/5 rounded-[40px] hover:border-primary-500/30 transition-all duration-500 shadow-xl"
              >
                <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-primary-500 group-hover:text-black transition-all duration-500 group-hover:shadow-[0_0_20px_rgba(0,208,132,0.3)]">
                  {item.icon}
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-1">{item.label}</h4>
                  <p className="text-white font-bold text-lg break-all truncate group-hover:text-primary-500 transition-colors">{item.value}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Form Side */}
          <div className="lg:col-span-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white/[0.02] p-10 md:p-14 rounded-[56px] border border-white/5 shadow-3xl backdrop-blur-sm"
            >
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Full Name</label>
                    <input 
                      required
                      type="text" 
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-6 py-5 bg-black/40 border border-white/10 rounded-2xl focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all text-white placeholder:text-slate-700 font-medium"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Email Address</label>
                    <input 
                      required
                      type="email" 
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-6 py-5 bg-black/40 border border-white/10 rounded-2xl focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all text-white placeholder:text-slate-700 font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Subject</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Project Inquiry"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-6 py-5 bg-black/40 border border-white/10 rounded-2xl focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all text-white placeholder:text-slate-700 font-medium"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Your Message</label>
                  <textarea 
                    required
                    rows={5}
                    placeholder="Write your message here..."
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full px-6 py-5 bg-black/40 border border-white/10 rounded-2xl focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all text-white placeholder:text-slate-700 font-medium resize-none h-40"
                  ></textarea>
                </div>
                
                <button 
                  disabled={loading}
                  className={`w-full py-6 px-10 rounded-3xl font-black uppercase tracking-[0.3em] text-[11px] flex items-center justify-center gap-3 transition-all shadow-2xl relative overflow-hidden group/btn ${
                    success 
                      ? 'bg-green-500 text-white' 
                      : 'bg-primary-500 text-black hover:bg-primary-400 active:scale-95'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                  ) : success ? (
                    <>Message Sent <CheckCircle size={20} /></>
                  ) : (
                    <>Send Message <Send size={20} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" /></>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
