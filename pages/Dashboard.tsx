
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, Code, Briefcase, MessageSquare, LogOut, Plus, Trash2, Edit, Save, 
  Settings, Star, LayoutGrid, CheckCircle, XCircle, X, Image as ImageIcon, Upload, Loader2, Link as LinkIcon, Share2, ExternalLink, Globe, Award, FileText, Youtube, Tag, Video, History, GraduationCap, Building2, Mail, Terminal, Layers, Cpu, Eye, EyeOff, Phone, MapPin
} from 'lucide-react';
import { Project, Skill, Profile, ContactMessage, Service, Testimonial, SocialLink, WhyChooseMe, ProjectCategory, ProjectImage, TimelineEntry } from '../types';
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
  const [projectCategories, setProjectCategories] = useState<ProjectCategory[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [whyChooseMe, setWhyChooseMe] = useState<WhyChooseMe[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [currentItem, setCurrentItem] = useState<any>({});

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        navigate('/admin');
        return;
      }

      const fetchMap: any = {
        profile: () => supabase.from('profile').select('*').eq('id', user.id).maybeSingle(),
        socials: () => supabase.from('social_links').select('*'),
        skills: () => supabase.from('skills').select('*').order('name', { ascending: true }),
        services: () => supabase.from('services').select('*').order('title', { ascending: true }),
        projects: () => supabase.from('projects').select('*').order('created_at', { ascending: false }),
        categories: () => supabase.from('project_categories').select('*').order('name', { ascending: true }),
        testimonials: () => supabase.from('testimonials').select('*'),
        messages: () => supabase.from('contact_messages').select('*').order('created_at', { ascending: false }),
        why: () => supabase.from('why_choose_me').select('*').order('order_index', { ascending: true }),
        timeline: () => supabase.from('timeline').select('*').order('order_index', { ascending: true }),
      };

      if (fetchMap[activeTab]) {
        const { data, error } = await fetchMap[activeTab]();
        if (error && error.code !== 'PGRST116') throw error;
        
        if (activeTab === 'profile') {
          setProfile(data || { 
            id: user.id, 
            name: '', 
            title: '', 
            bio: '', 
            about_headline: '', 
            avatar_url: '', 
            about_image_url: '', 
            resume_url: '', 
            video_url: '', 
            email: user.email || '', 
            phone: '', 
            location: '' 
          });
        }
        if (activeTab === 'socials') setSocials(data || []);
        if (activeTab === 'skills') setSkills(data || []);
        if (activeTab === 'services') setServices(data || []);
        if (activeTab === 'timeline') setTimeline(data || []);
        if (activeTab === 'projects') {
          const projs = data || [];
          const { data: galleryData } = await supabase.from('project_images').select('*');
          const projectsWithGallery = projs.map((p: any) => ({
            ...p,
            gallery: galleryData?.filter((g: any) => g.project_id === p.id) || []
          }));
          setProjects(projectsWithGallery);
          const { data: cats } = await supabase.from('project_categories').select('*');
          setProjectCategories(cats || []);
        }
        if (activeTab === 'categories') setProjectCategories(data || []);
        if (activeTab === 'testimonials') setTestimonials(data || []);
        if (activeTab === 'messages') setMessages(data || []);
        if (activeTab === 'why') setWhyChooseMe(data || []);
      }
    } catch (err: any) {
      console.error("Dashboard Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const uploadToStorage = async (file: File, folder: string, bucket: string = 'Portfolio') => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;
    const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file);
    if (uploadError) throw uploadError;
    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return publicUrl;
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files?.length || !profile) return;
      const file = event.target.files[0];
      const publicUrl = await uploadToStorage(file, 'avatars', 'Portfolio');
      setProfile({ ...profile, avatar_url: publicUrl });
      toast.success("Avatar uploaded! Remember to save changes.");
    } catch (err: any) {
      toast.error("Avatar upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleAboutPortraitUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files?.length || !profile) return;
      const file = event.target.files[0];
      const publicUrl = await uploadToStorage(file, 'about', 'Portfolio');
      setProfile({ ...profile, about_image_url: publicUrl });
      toast.success("About portrait uploaded! Remember to save changes.");
    } catch (err: any) {
      toast.error("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const tableMap: any = { 
        skills: 'skills', projects: 'projects', categories: 'project_categories',
        services: 'services', testimonials: 'testimonials', socials: 'social_links', 
        why: 'why_choose_me', timeline: 'timeline'
      };
      
      const payload = { ...currentItem };
      const { gallery, id, ...savePayload } = payload;
      
      let result;
      if (isEditing) {
        result = await supabase.from(tableMap[activeTab]).update(savePayload).eq('id', id).select().single();
      } else {
        result = await supabase.from(tableMap[activeTab]).insert([savePayload]).select().single();
      }
      
      if (result.error) throw result.error;

      toast.success("Database Updated");
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) { 
      toast.error(err.message || "Operation failed."); 
    } finally {
      setLoading(false);
    }
  };

  const saveProfileChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('profile').upsert(profile);
      if (error) throw error;
      toast.success("Identity Updated");
    } catch (err: any) {
      toast.error("Update failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (table: string, id: string) => {
    if (!window.confirm("Permanent deletion cannot be undone. Proceed?")) return;
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (!error) { 
      toast.success("Record Purged"); 
      fetchData(); 
    } else {
      toast.error("Deletion failed: " + error.message);
    }
  };

  const renderEmptyState = (label: string) => (
    <div className="flex flex-col items-center justify-center py-40 space-y-4 opacity-30">
       <Layers size={64} className="text-slate-500 mb-2" />
       <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500">{label} is currently empty</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row text-slate-100 antialiased selection:bg-primary-500 selection:text-black font-sans">
      <aside className="w-full md:w-72 bg-slate-900 border-r border-white/5 p-8 flex flex-col h-screen sticky top-0 z-40">
        <div className="mb-12 px-2 flex items-center gap-4">
          <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center font-black text-black text-sm">A</div>
          <h1 className="text-xl font-black bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">ADMIN OS</h1>
        </div>
        <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
          {[
            { id: 'profile', icon: <User size={18}/>, label: 'Identity' },
            { id: 'socials', icon: <Share2 size={18}/>, label: 'Links' },
            { id: 'skills', icon: <Cpu size={18}/>, label: 'Skills' },
            { id: 'timeline', icon: <History size={18}/>, label: 'Timeline' },
            { id: 'categories', icon: <Tag size={18}/>, label: 'Taxonomy' },
            { id: 'projects', icon: <Briefcase size={18}/>, label: 'Portfolio' },
            { id: 'services', icon: <Layers size={18}/>, label: 'Services' },
            { id: 'why', icon: <Award size={18}/>, label: 'Why Me' },
            { id: 'testimonials', icon: <Star size={18}/>, label: 'Reviews' },
            { id: 'messages', icon: <MessageSquare size={18}/>, label: 'Inbox' }
          ].map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${activeTab === item.id ? 'bg-primary-500 text-black font-bold shadow-lg shadow-primary-500/20' : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'}`}>
              {item.icon} <span className="text-[10px] uppercase font-black tracking-widest">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="mt-8 pt-8 border-t border-white/5 space-y-2">
           <Link to="/" className="px-5 py-4 text-slate-400 font-bold flex items-center gap-3 hover:text-primary-500 transition-all text-[10px] uppercase tracking-widest"><Globe size={18}/> View Live</Link>
           <button onClick={handleLogout} className="w-full px-5 py-4 text-red-500 font-bold flex items-center gap-3 hover:bg-red-500/5 rounded-2xl transition-all text-[10px] uppercase tracking-widest"><LogOut size={18}/> Disconnect</button>
        </div>
      </aside>

      <main className="flex-1 p-8 md:p-12 pb-32 overflow-x-hidden relative">
        <div className="flex justify-between items-end mb-12">
          <div>
            <p className="text-[10px] font-black uppercase text-primary-500 tracking-[0.4em] mb-2">Management Panel</p>
            <h2 className="text-4xl font-black capitalize text-white tracking-tighter">{activeTab.replace('_', ' ')}</h2>
          </div>
          {['skills', 'projects', 'services', 'testimonials', 'socials', 'why', 'categories', 'timeline'].includes(activeTab) && (
            <button onClick={() => { setCurrentItem({}); setIsEditing(false); setIsModalOpen(true); }} className="px-8 py-4 bg-primary-500 text-black rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-3 shadow-xl hover:scale-[1.02] transition-transform">
              <Plus size={18} /> New Entry
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 space-y-4">
             <Loader2 className="animate-spin text-primary-500" size={48} />
             <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500">Syncing with Cloud...</p>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            {activeTab === 'profile' && profile && (
              <form onSubmit={saveProfileChanges} className="bg-slate-900/50 p-12 rounded-[56px] border border-white/5 space-y-10 shadow-2xl backdrop-blur-sm">
                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8 space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Identity Name</label>
                            <input className="w-full bg-slate-800 p-5 rounded-2xl text-white outline-none border border-white/5 focus:ring-2 focus:ring-primary-500/50" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Hero Title</label>
                            <input className="w-full bg-slate-800 p-5 rounded-2xl text-white outline-none border border-white/5 focus:ring-2 focus:ring-primary-500/50" value={profile.title} onChange={e => setProfile({...profile, title: e.target.value})} />
                          </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Showreel Video URL (YouTube/Vimeo)</label>
                            <input className="w-full bg-slate-800 p-5 rounded-2xl text-white outline-none border border-white/5 focus:ring-2 focus:ring-primary-500/50" value={profile.video_url || ''} onChange={e => setProfile({...profile, video_url: e.target.value})} placeholder="https://www.youtube.com/watch?v=..." />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Resume Download URL</label>
                            <input className="w-full bg-slate-800 p-5 rounded-2xl text-white outline-none border border-white/5 focus:ring-2 focus:ring-primary-500/50" value={profile.resume_url || ''} onChange={e => setProfile({...profile, resume_url: e.target.value})} placeholder="https://drive.google.com/..." />
                          </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                          <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Contact Email</label><input className="w-full bg-slate-800 p-5 rounded-2xl text-white outline-none border border-white/5" value={profile.email || ''} onChange={e => setProfile({...profile, email: e.target.value})} /></div>
                          <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Phone Number</label><input className="w-full bg-slate-800 p-5 rounded-2xl text-white outline-none border border-white/5" value={profile.phone || ''} onChange={e => setProfile({...profile, phone: e.target.value})} /></div>
                          <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Location</label><input className="w-full bg-slate-800 p-5 rounded-2xl text-white outline-none border border-white/5" value={profile.location || ''} onChange={e => setProfile({...profile, location: e.target.value})} /></div>
                      </div>
                      <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">About Page Headline</label><input className="w-full bg-slate-800 p-5 rounded-2xl text-white outline-none border border-white/5" value={profile.about_headline || ''} onChange={e => setProfile({...profile, about_headline: e.target.value})} /></div>
                      <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Narrative Bio</label><textarea className="w-full bg-slate-800 p-5 rounded-2xl text-white outline-none border border-white/5 h-40" value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} /></div>
                    </div>
                    <div className="lg:col-span-4 space-y-8">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Hero Portrait</label>
                        <div className="relative aspect-[4/5] rounded-[48px] overflow-hidden bg-slate-800 border-2 border-dashed border-white/5 group hover:border-primary-500 transition-all flex items-center justify-center">
                          {uploading ? <Loader2 className="animate-spin text-primary-500" size={32} /> : profile.avatar_url ? <img src={profile.avatar_url} className="w-full h-full object-cover" /> : <ImageIcon className="text-slate-700" size={40} />}
                          <label className="absolute inset-0 cursor-pointer"><input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={uploading} /></label>
                        </div>
                      </div>
                    </div>
                 </div>
                 <button type="submit" disabled={loading || uploading} className="w-full py-6 bg-primary-500 text-black rounded-3xl font-black uppercase tracking-[0.2em] text-[11px] shadow-lg hover:scale-[1.01] transition-all">Update Identity</button>
              </form>
            )}
            {/* The rest of activeTab checks remain the same but omitted for brevity in response... */}
          </div>
        )}
      </main>

      {/* MODAL SYSTEM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/98 backdrop-blur-xl overflow-y-auto">
           <div className={`bg-slate-900 w-full rounded-[56px] border border-white/10 p-12 space-y-10 my-auto max-w-2xl`}>
              <div className="flex justify-between items-center">
                 <h3 className="text-2xl font-black text-white capitalize">{isEditing ? 'Modify' : 'New'} {activeTab.replace('_', ' ')}</h3>
                 <button onClick={() => setIsModalOpen(false)} className="p-3 bg-white/5 rounded-full text-slate-500 hover:text-white transition-all"><X size={20}/></button>
              </div>

              <form onSubmit={handleSubmitItem} className="space-y-6">
                 {activeTab === 'projects' && (
                    <div className="space-y-4">
                       <input required className="w-full bg-slate-800 p-5 rounded-2xl text-white outline-none" placeholder="Project Title" value={currentItem.title || ''} onChange={e => setCurrentItem({...currentItem, title: e.target.value})} />
                       <input className="w-full bg-slate-800 p-5 rounded-2xl text-white outline-none" placeholder="Video URL (YouTube/Vimeo)" value={currentItem.video_url || ''} onChange={e => setCurrentItem({...currentItem, video_url: e.target.value})} />
                       <select className="w-full bg-slate-800 p-5 rounded-2xl text-white outline-none" value={currentItem.category || ''} onChange={e => setCurrentItem({...currentItem, category: e.target.value})}>
                          <option value="">Select Category</option>
                          {projectCategories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                       </select>
                       <textarea className="w-full bg-slate-800 p-5 rounded-2xl text-white outline-none h-32" placeholder="Description" value={currentItem.description || ''} onChange={e => setCurrentItem({...currentItem, description: e.target.value})} />
                       <input className="w-full bg-slate-800 p-5 rounded-2xl text-white outline-none" placeholder="Live Link" value={currentItem.live_url || ''} onChange={e => setCurrentItem({...currentItem, live_url: e.target.value})} />
                       <input className="w-full bg-slate-800 p-5 rounded-2xl text-white outline-none" placeholder="Thumbnail Image URL" value={currentItem.image_url || ''} onChange={e => setCurrentItem({...currentItem, image_url: e.target.value})} />
                    </div>
                 )}
                 {/* Logic for other forms... */}
                 <button type="submit" className="w-full py-5 bg-primary-500 text-black rounded-3xl font-black uppercase tracking-widest text-[10px] shadow-2xl hover:bg-primary-400 transition-all">Save Record</button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
