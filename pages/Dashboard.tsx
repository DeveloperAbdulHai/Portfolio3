
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, Code, Briefcase, MessageSquare, LogOut, Plus, Trash2, Edit, Save, 
  Settings, Star, LayoutGrid, CheckCircle, XCircle, X, Image as ImageIcon, Upload, Loader2, Link as LinkIcon, Share2, ExternalLink, Globe, Award, FileText, Youtube, Image
} from 'lucide-react';
import { Project, Skill, Profile, ContactMessage, Service, Testimonial, SocialLink, WhyChooseMe } from '../types';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [whyChooseMe, setWhyChooseMe] = useState<WhyChooseMe[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [currentItem, setCurrentItem] = useState<any>({});

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/admin');
        return;
      }

      const fetchMap: any = {
        profile: () => supabase.from('profile').select('*').eq('id', user.id).maybeSingle(),
        socials: () => supabase.from('social_links').select('*'),
        skills: () => supabase.from('skills').select('*').order('name', { ascending: true }),
        services: () => supabase.from('services').select('*'),
        projects: () => supabase.from('projects').select('*').order('created_at', { ascending: false }),
        testimonials: () => supabase.from('testimonials').select('*'),
        messages: () => supabase.from('contact_messages').select('*').order('created_at', { ascending: false }),
        why: () => supabase.from('why_choose_me').select('*').order('order_index', { ascending: true }),
      };

      if (fetchMap[activeTab]) {
        const { data, error } = await fetchMap[activeTab]();
        if (error) throw error;
        
        if (activeTab === 'profile') setProfile(data || { id: user.id, name: '', title: '', bio: '', avatar_url: '', resume_url: '', video_url: '', email: user.email || '', phone: '', location: '' });
        if (activeTab === 'socials') setSocials(data || []);
        if (activeTab === 'skills') setSkills(data || []);
        if (activeTab === 'services') setServices(data || []);
        if (activeTab === 'projects') setProjects(data || []);
        if (activeTab === 'testimonials') setTestimonials(data || []);
        if (activeTab === 'messages') setMessages(data || []);
        if (activeTab === 'why') setWhyChooseMe(data || []);
      }
    } catch (err: any) {
      console.error("Fetch error:", err);
      toast.error("Sync failure: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const uploadToStorage = async (file: File, folder: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;
    const { error: uploadError } = await supabase.storage.from('Site Media').upload(filePath, file);
    if (uploadError) throw uploadError;
    const { data: { publicUrl } } = supabase.storage.from('Site Media').getPublicUrl(filePath);
    return publicUrl;
  };

  const handleSkillIconUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files?.length) return;
      const file = event.target.files[0];
      const publicUrl = await uploadToStorage(file, 'skills');
      setCurrentItem({ ...currentItem, icon_url: publicUrl });
      toast.success("Skill Icon Staged");
    } catch (err: any) { 
      toast.error("Upload failed: " + err.message); 
    } finally { 
      setUploading(false); 
    }
  };

  const handleProfileImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files?.length) return;
      const file = event.target.files[0];
      const publicUrl = await uploadToStorage(file, 'hero');
      if (profile) {
        const updatedProfile = { ...profile, avatar_url: publicUrl };
        const { error } = await supabase.from('profile').upsert(updatedProfile);
        if (error) throw error;
        setProfile(updatedProfile);
        toast.success("Identity Asset Updated");
      }
    } catch (err: any) { 
      toast.error("Upload failed: " + err.message); 
    } finally { 
      setUploading(false); 
    }
  };

  const saveProfileChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Authentication required");

      const payload = { 
        ...profile,
        id: user.id 
      };
      
      const { error } = await supabase.from('profile').upsert(payload);
      
      if (error) throw error;
      toast.success("Neural Records Synchronized");
    } catch (err: any) {
      console.error("Profile save error:", err);
      const msg = err.message || "Update failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const tableMap: any = { 
        skills: 'skills', 
        projects: 'projects', 
        services: 'services', 
        testimonials: 'testimonials', 
        socials: 'social_links',
        why: 'why_choose_me'
      };
      const payload = { ...currentItem };
      if (activeTab === 'projects' && typeof payload.tech_stack === 'string') {
        payload.tech_stack = payload.tech_stack.split(',').map((s: string) => s.trim());
      }
      
      const { error } = isEditing 
        ? await supabase.from(tableMap[activeTab]).update(payload).eq('id', payload.id)
        : await supabase.from(tableMap[activeTab]).insert([payload]);
      
      if (error) throw error;
      toast.success("Memory Updated");
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) { toast.error(err.message); }
  };

  const deleteItem = async (table: string, id: string) => {
    if (!window.confirm("Purge this record?")) return;
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (!error) { toast.success("Record Erased"); fetchData(); }
  };

  const renderSidebar = () => (
    <aside className="w-full md:w-72 bg-slate-900 border-r border-white/5 p-8 flex flex-col h-screen sticky top-0 z-40">
      <div className="mb-12 px-2 flex items-center gap-4">
        <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center font-black text-black text-sm shadow-[0_0_20px_rgba(0,208,132,0.3)]">A</div>
        <h1 className="text-xl font-black bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent tracking-tighter">Portfolio OS</h1>
      </div>
      
      <nav className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
        {[
          { id: 'profile', label: 'Identity', icon: <User size={18} /> },
          { id: 'socials', label: 'Network', icon: <Share2 size={18} /> },
          { id: 'skills', label: 'Abilities', icon: <Code size={18} /> },
          { id: 'services', label: 'Offerings', icon: <LayoutGrid size={18} /> },
          { id: 'why', label: 'Why Me', icon: <Award size={18} /> },
          { id: 'projects', label: 'Portfolio', icon: <Briefcase size={18} /> },
          { id: 'testimonials', label: 'Vouches', icon: <Star size={18} /> },
          { id: 'messages', label: 'Inquiries', icon: <MessageSquare size={18} /> },
        ].map(item => (
          <button 
            key={item.id} 
            onClick={() => setActiveTab(item.id)} 
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${activeTab === item.id ? 'bg-primary-500 text-black font-bold shadow-lg shadow-primary-500/20' : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'}`}
          >
            {item.icon} {item.label}
          </button>
        ))}
      </nav>
      
      <div className="mt-8 pt-8 border-t border-white/5 space-y-2">
        <Link to="/" className="w-full flex items-center gap-4 px-5 py-4 text-slate-400 hover:text-primary-500 hover:bg-primary-500/5 rounded-2xl transition-all font-bold group">
          <Globe size={18} className="transition-transform group-hover:rotate-12" /> Visit Live
        </Link>
        <button onClick={handleLogout} className="w-full flex items-center gap-4 px-5 py-4 text-red-500 hover:bg-red-500/10 rounded-2xl transition-all font-bold">
          <LogOut size={18} /> Disconnect
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row text-slate-100 antialiased selection:bg-primary-500 selection:text-black">
      {renderSidebar()}
      <main className="flex-1 p-8 md:p-12 pb-32 overflow-x-hidden">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary-500 mb-2 block">Management Hub</span>
            <h2 className="text-4xl font-black capitalize tracking-tight text-white">{activeTab === 'why' ? 'Why Me' : activeTab}</h2>
          </div>
          {['skills', 'projects', 'services', 'testimonials', 'socials', 'why'].includes(activeTab) && (
            <button onClick={() => { setCurrentItem({}); setIsEditing(false); setIsModalOpen(true); }} className="flex items-center gap-3 px-8 py-4 bg-primary-500 text-black rounded-2xl font-black hover:bg-primary-400 transition-all shadow-xl active:scale-95 uppercase tracking-widest text-[10px]">
              <Plus size={18} /> Add Entry
            </button>
          )}
        </div>

        {loading && !profile ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <Loader2 className="animate-spin text-primary-500" size={48} />
            <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.6em]">Establishing Neural Link...</p>
          </div>
        ) : (
          <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            {activeTab === 'profile' && profile && (
              <form onSubmit={saveProfileChanges} className="space-y-8">
                <div className="bg-slate-900/50 p-12 rounded-[56px] border border-white/5 flex flex-col items-center gap-10 shadow-3xl backdrop-blur-sm">
                   <div className="relative group cursor-pointer">
                      <div className="w-44 h-56 overflow-hidden rounded-[40px] border-4 border-slate-800 bg-slate-800 flex items-center justify-center shadow-2xl transition-all duration-500 group-hover:border-primary-500/40">
                        {uploading ? (
                          <Loader2 className="animate-spin text-primary-500" size={40} />
                        ) : (
                          <img 
                            src={profile.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1000'} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                            alt="Avatar" 
                          />
                        )}
                      </div>
                      <label className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center rounded-[40px] cursor-pointer backdrop-blur-sm">
                        <Upload size={32} className="text-primary-500 mb-3" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Change Avatar</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleProfileImageUpload} disabled={uploading} />
                      </label>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                        <input className="w-full bg-slate-800/40 border border-white/5 p-5 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-bold text-white" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Professional Headline</label>
                        <input className="w-full bg-slate-800/40 border border-white/5 p-5 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-bold text-white" value={profile.title} onChange={e => setProfile({...profile, title: e.target.value})} />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2"><Youtube size={12}/> YouTube Embed Link</label>
                        <input className="w-full bg-slate-800/40 border border-white/5 p-5 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-bold text-white" placeholder="https://www.youtube.com/embed/..." value={profile.video_url || ''} onChange={e => setProfile({...profile, video_url: e.target.value})} />
                        <p className="text-[9px] text-slate-600 font-bold ml-1">Use the "Embed" URL from YouTube Share options.</p>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2"><FileText size={12}/> CV / Resume URL</label>
                        <input className="w-full bg-slate-800/40 border border-white/5 p-5 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-bold text-white" placeholder="Direct link to PDF" value={profile.resume_url || ''} onChange={e => setProfile({...profile, resume_url: e.target.value})} />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Current Base</label>
                        <input className="w-full bg-slate-800/40 border border-white/5 p-5 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-bold text-white" value={profile.location || ''} onChange={e => setProfile({...profile, location: e.target.value})} />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Public Email</label>
                        <input className="w-full bg-slate-800/40 border border-white/5 p-5 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-bold text-white" value={profile.email || ''} onChange={e => setProfile({...profile, email: e.target.value})} />
                      </div>
                   </div>
                   <textarea rows={6} className="w-full bg-slate-800/40 border border-white/5 p-5 rounded-2xl outline-none resize-none focus:ring-2 focus:ring-primary-500/50 transition-all font-medium text-slate-300" placeholder="Biographical data..." value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} />
                   <button type="submit" disabled={loading} className="w-full py-6 bg-primary-500 text-black rounded-3xl font-black shadow-2xl hover:bg-primary-400 hover:-translate-y-1 transition-all uppercase tracking-[0.3em] text-[11px] disabled:opacity-50">
                     {loading ? 'Synchronizing...' : 'Deploy Global Updates'}
                   </button>
                </div>
              </form>
            )}

            {activeTab === 'skills' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {skills.map(skill => (
                  <div key={skill.id} className="bg-slate-900 p-8 rounded-[32px] border border-white/5 flex justify-between items-center group hover:border-primary-500/20 transition-all duration-300 shadow-xl">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-primary-500 group-hover:bg-primary-500 group-hover:text-black transition-all overflow-hidden">
                         {skill.icon_url ? (
                           <img src={skill.icon_url} alt={skill.name} className="w-8 h-8 object-contain" />
                         ) : (
                           <Code size={22} />
                         )}
                      </div>
                      <div>
                        <h4 className="font-black text-white text-lg tracking-tight mb-0.5">{skill.name}</h4>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{skill.category}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setCurrentItem(skill); setIsEditing(true); setIsModalOpen(true); }} className="p-4 text-slate-500 hover:text-primary-500 transition-colors bg-white/5 rounded-2xl"><Edit size={20}/></button>
                      <button onClick={() => deleteItem('skills', skill.id)} className="p-4 text-red-500/50 hover:text-red-500 transition-colors bg-red-500/5 rounded-2xl"><Trash2 size={20}/></button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Other tabs follow the same list pattern... */}
            {activeTab === 'socials' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {socials.map(s => (
                  <div key={s.id} className="bg-slate-900 p-6 rounded-[32px] border border-white/5 flex justify-between items-center group hover:border-primary-500/20 transition-all duration-300">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-primary-500 group-hover:bg-primary-500 group-hover:text-black transition-all">
                         <Share2 size={20} />
                      </div>
                      <p className="font-black text-white text-sm tracking-tight">{s.platform}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setCurrentItem(s); setIsEditing(true); setIsModalOpen(true); }} className="p-3 text-slate-500 hover:text-primary-500 transition-colors bg-white/5 rounded-xl"><Edit size={16}/></button>
                      <button onClick={() => deleteItem('social_links', s.id)} className="p-3 text-red-500/50 hover:text-red-500 transition-colors bg-red-500/5 rounded-xl"><Trash2 size={16}/></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/98 backdrop-blur-xl">
          <div className="bg-slate-900 w-full max-w-xl rounded-[56px] border border-white/10 shadow-3xl p-12 space-y-8 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300">
             <div className="flex justify-between items-center mb-4">
               <h3 className="text-3xl font-black text-white tracking-tighter">{isEditing ? 'Modify' : 'New'} Data</h3>
               <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-white/10 rounded-full transition-colors text-slate-500"><X size={24}/></button>
             </div>
             <form onSubmit={handleSubmitItem} className="space-y-6">
                {activeTab === 'skills' && (
                   <div className="space-y-5">
                    <input required className="w-full bg-slate-800 p-5 rounded-2xl outline-none border border-white/5 focus:ring-2 focus:ring-primary-500 font-bold" placeholder="Skill Name (e.g. React)" value={currentItem.name || ''} onChange={e => setCurrentItem({...currentItem, name: e.target.value})} />
                    <input required className="w-full bg-slate-800 p-5 rounded-2xl outline-none border border-white/5 focus:ring-2 focus:ring-primary-500 font-bold" placeholder="Category (e.g. Frontend)" value={currentItem.category || ''} onChange={e => setCurrentItem({...currentItem, category: e.target.value})} />
                    
                    <div className="flex flex-col gap-4">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Icon Source</label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <input className="w-full bg-slate-800 p-5 rounded-2xl outline-none border border-white/5 focus:ring-2 focus:ring-primary-500 font-bold" placeholder="Lucide Name" value={currentItem.icon || ''} onChange={e => setCurrentItem({...currentItem, icon: e.target.value})} />
                        </div>
                        <div className="relative group flex items-center justify-center bg-slate-800/50 border border-white/5 rounded-2xl p-4 overflow-hidden min-h-[64px]">
                          {uploading ? (
                            <Loader2 className="animate-spin text-primary-500" size={20} />
                          ) : currentItem.icon_url ? (
                            <img src={currentItem.icon_url} className="w-8 h-8 object-contain" alt="Staged" />
                          ) : (
                            <ImageIcon className="text-slate-600" size={24} />
                          )}
                          <label className="absolute inset-0 bg-primary-500/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                             <Upload size={16} className="text-primary-500" />
                             <input type="file" className="hidden" accept="image/*" onChange={handleSkillIconUpload} disabled={uploading} />
                          </label>
                        </div>
                      </div>
                      {currentItem.icon_url && (
                        <button type="button" onClick={() => setCurrentItem({...currentItem, icon_url: null})} className="text-[9px] font-black text-red-500 uppercase tracking-widest self-end">Clear Uploaded Icon</button>
                      )}
                    </div>
                  </div>
                )}
                {/* Other forms follow similar logic... */}
                {activeTab === 'socials' && (
                  <div className="space-y-5">
                    <input required className="w-full bg-slate-800 p-5 rounded-2xl outline-none border border-white/5 focus:ring-2 focus:ring-primary-500 font-bold" placeholder="Platform (e.g. GitHub)" value={currentItem.platform || ''} onChange={e => setCurrentItem({...currentItem, platform: e.target.value})} />
                    <input required className="w-full bg-slate-800 p-5 rounded-2xl outline-none border border-white/5 focus:ring-2 focus:ring-primary-500 font-bold" placeholder="URL" value={currentItem.url || ''} onChange={e => setCurrentItem({...currentItem, url: e.target.value})} />
                    <input className="w-full bg-slate-800 p-5 rounded-2xl outline-none border border-white/5 focus:ring-2 focus:ring-primary-500 font-bold" placeholder="Lucide Icon Name" value={currentItem.icon || ''} onChange={e => setCurrentItem({...currentItem, icon: e.target.value})} />
                  </div>
                )}
                <button type="submit" className="w-full py-6 bg-primary-500 text-black font-black rounded-3xl hover:bg-primary-400 transition-all uppercase tracking-[0.3em] text-[11px] shadow-2xl">
                  Commit Record
                </button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
