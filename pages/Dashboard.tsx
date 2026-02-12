
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, Briefcase, MessageSquare, LogOut, Plus, Trash2, Edit, X, Upload, Loader2, Share2, Award, FileText, Globe, History, Layers, Cpu, Star, AlertCircle, ExternalLink, Calendar, MapPin, Video, Image as ImageIcon, Tag
} from 'lucide-react';
import { Project, Skill, Profile, ContactMessage, Service, Testimonial, SocialLink, WhyChooseMe, TimelineEntry, BlogPost, ProjectCategory } from '../types';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [tableMissing, setTableMissing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [whyChooseMe, setWhyChooseMe] = useState<WhyChooseMe[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  
  const [currentItem, setCurrentItem] = useState<any>({});
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
    if (activeTab === 'projects' || activeTab === 'categories') {
       fetchCategories();
    }
  }, [activeTab]);

  const fetchCategories = async () => {
    const { data } = await supabase.from('project_categories').select('*').order('name');
    if (data) setCategories(data);
  };

  const fetchData = async () => {
    setLoading(true);
    setTableMissing(false);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        navigate('/admin');
        return;
      }

      const fetchMap: any = {
        profile: () => supabase.from('profile').select('*').order('updated_at', { ascending: false }).limit(1).maybeSingle(),
        socials: () => supabase.from('social_links').select('*'),
        skills: () => supabase.from('skills').select('*').order('name', { ascending: true }),
        services: () => supabase.from('services').select('*').order('title', { ascending: true }),
        projects: () => supabase.from('projects').select('*, gallery:project_images(*)').order('created_at', { ascending: false }),
        categories: () => supabase.from('project_categories').select('*').order('name', { ascending: true }),
        blogs: () => supabase.from('blogs').select('*').order('created_at', { ascending: false }),
        testimonials: () => supabase.from('testimonials').select('*'),
        messages: () => supabase.from('contact_messages').select('*').order('created_at', { ascending: false }),
        why: () => supabase.from('why_choose_me').select('*').order('order_index', { ascending: true }),
        timeline: () => supabase.from('timeline').select('*').order('order_index', { ascending: true }),
      };

      if (fetchMap[activeTab]) {
        const { data, error } = await fetchMap[activeTab]();
        if (error) {
          if (error.code === '42P01') setTableMissing(true);
          else throw error;
        }
        if (activeTab === 'profile') setProfile(data || {} as Profile);
        if (activeTab === 'socials') setSocials(data || []);
        if (activeTab === 'skills') setSkills(data || []);
        if (activeTab === 'services') setServices(data || []);
        if (activeTab === 'timeline') setTimeline(data || []);
        if (activeTab === 'blogs') setBlogs(data || []);
        if (activeTab === 'projects') setProjects(data || []);
        if (activeTab === 'categories') setCategories(data || []);
        if (activeTab === 'testimonials') setTestimonials(data || []);
        if (activeTab === 'messages') setMessages(data || []);
        if (activeTab === 'why') setWhyChooseMe(data || []);
      }
    } catch (err: any) {
      toast.error(err.message || "Fetch failed");
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (table: string, id: string) => {
    if (!window.confirm("Are you sure you want to delete this record? This action cannot be undone.")) return;
    
    setIsProcessing(true);
    try {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      
      toast.success("Record deleted successfully");
      fetchData();
      if (table === 'project_categories') fetchCategories();
    } catch (err: any) {
      toast.error(`Delete failed: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, field: string, isProfile: boolean = false, isGallery: boolean = false) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        const { error: uploadError } = await supabase.storage.from('Portfolio').upload(filePath, file);
        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('Portfolio').getPublicUrl(filePath);
        uploadedUrls.push(data.publicUrl);
      }

      if (isProfile && profile) {
        setProfile({ ...profile, [field]: uploadedUrls[0] });
      } else if (isGallery) {
        setGalleryImages([...galleryImages, ...uploadedUrls]);
      } else {
        setCurrentItem({ ...currentItem, [field]: uploadedUrls[0] });
      }
      toast.success("Upload successful");
    } catch (error: any) {
      toast.error(`Upload error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const tableMap: any = { 
        skills: 'skills', projects: 'projects', blogs: 'blogs',
        services: 'services', testimonials: 'testimonials', socials: 'social_links', 
        why: 'why_choose_me', timeline: 'timeline', categories: 'project_categories'
      };
      
      const payload = { ...currentItem };
      const { id, created_at, gallery, ...savePayload } = payload;
      
      if (activeTab === 'projects' && typeof savePayload.tech_stack === 'string') {
        savePayload.tech_stack = (savePayload.tech_stack as string).split(',').map(s => s.trim()).filter(Boolean);
      }

      if (isEditing) {
        await supabase.from(tableMap[activeTab]).update(savePayload).eq('id', id);
      } else {
        const { data, error } = await supabase.from(tableMap[activeTab]).insert([savePayload]).select().single();
        if (error) throw error;
        
        if (activeTab === 'projects' && savePayload.gallery_type === 'image' && galleryImages.length > 0) {
          const galleryPayload = galleryImages.map(url => ({ project_id: data.id, image_url: url }));
          await supabase.from('project_images').insert(galleryPayload);
        }
      }
      
      toast.success("Sync successful");
      setIsModalOpen(false);
      setGalleryImages([]);
      fetchData();
      if (activeTab === 'categories') fetchCategories();
    } catch (err: any) { 
      toast.error(err.message); 
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
    toast.success("Logged out");
  };

  const openModal = (item: any = {}) => {
    setCurrentItem(item);
    setIsEditing(!!item.id);
    if (activeTab === 'projects' && item.gallery) {
      setGalleryImages(item.gallery.map((g: any) => g.image_url));
    } else {
      setGalleryImages([]);
    }
    setIsModalOpen(true);
  };

  const renderContent = () => {
    if (loading && !uploading && !isModalOpen) return <div className="flex justify-center py-40"><Loader2 className="animate-spin text-primary-500" size={64} /></div>;
    
    if (tableMissing) return (
      <div className="max-w-2xl mx-auto bg-slate-900 border border-red-500/20 p-12 rounded-[40px] text-center mt-20">
         <AlertCircle size={64} className="text-red-500 mx-auto mb-6 opacity-50" />
         <h3 className="text-2xl font-bold mb-4 text-white">Database Link Broken</h3>
         <button onClick={fetchData} className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all text-white">Retry Connection</button>
      </div>
    );

    switch(activeTab) {
      case 'profile':
        return profile && (
          <form onSubmit={(e) => { e.preventDefault(); supabase.from('profile').upsert(profile).then(() => toast.success("Profile Updated")); }} className="bg-[#0a0a0a] p-12 rounded-[40px] border border-white/5 space-y-12 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-3">Full Name</label>
                  <input className="w-full bg-[#111] p-5 rounded-xl border-none text-white focus:ring-1 focus:ring-primary-500/50 outline-none" value={profile.name || ''} onChange={e => setProfile({...profile, name: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-3">Professional Title</label>
                  <input className="w-full bg-[#111] p-5 rounded-xl border-none text-white focus:ring-1 focus:ring-primary-500/50 outline-none" value={profile.title || ''} onChange={e => setProfile({...profile, title: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-3">Location</label>
                  <input className="w-full bg-[#111] p-5 rounded-xl border-none text-white focus:ring-1 focus:ring-primary-500/50 outline-none" value={profile.location || ''} onChange={e => setProfile({...profile, location: e.target.value})} />
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-3">Avatar Image</label>
                  <label className="w-full cursor-pointer bg-[#111] hover:bg-primary-500/10 border border-white/5 group text-slate-400 p-5 rounded-xl transition-all flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {uploading ? <Loader2 size={18} className="animate-spin text-primary-500" /> : <Upload size={18} />}
                      <span className="text-xs font-bold uppercase tracking-widest">{profile.avatar_url ? 'Update Photo' : 'Choose Photo'}</span>
                    </div>
                    {profile.avatar_url && <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10"><img src={profile.avatar_url} className="w-full h-full object-cover" /></div>}
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'avatar_url', true)} />
                  </label>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-3">Resume Link</label>
                  <input className="w-full bg-[#111] p-5 rounded-xl border-none text-white focus:ring-1 focus:ring-primary-500/50 outline-none" value={profile.resume_url || ''} onChange={e => setProfile({...profile, resume_url: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-3">About Page Image</label>
                  <label className="w-full cursor-pointer bg-[#111] hover:bg-primary-500/10 border border-white/5 group text-slate-400 p-5 rounded-xl transition-all flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {uploading ? <Loader2 size={18} className="animate-spin text-primary-500" /> : <Upload size={18} />}
                      <span className="text-xs font-bold uppercase tracking-widest">{profile.about_image_url ? 'Update Image' : 'Choose Image'}</span>
                    </div>
                    {profile.about_image_url && <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10"><img src={profile.about_image_url} className="w-full h-full object-cover" /></div>}
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'about_image_url', true)} />
                  </label>
                </div>
              </div>
            </div>
            <textarea className="w-full bg-[#111] p-6 rounded-2xl border-none text-white h-48 focus:ring-1 focus:ring-primary-500/50 outline-none resize-none" value={profile.bio || ''} onChange={e => setProfile({...profile, bio: e.target.value})} />
            <button type="submit" className="px-12 py-5 bg-primary-500 text-black rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-primary-400 transition-all shadow-xl shadow-primary-500/20">Update Profile</button>
          </form>
        );

      case 'categories':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map(cat => (
              <div key={cat.id} className="bg-slate-900 p-8 rounded-[40px] border border-white/5 flex items-center justify-between group hover:border-primary-500/20 transition-all">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-primary-500"><Tag size={20}/></div>
                  <h4 className="font-bold text-white text-lg">{cat.name}</h4>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openModal(cat)} className="p-3 text-slate-500 hover:text-primary-500 transition-all"><Edit size={18}/></button>
                  <button onClick={() => deleteItem('project_categories', cat.id)} className="p-3 text-slate-500 hover:text-red-500 transition-all"><Trash2 size={18}/></button>
                </div>
              </div>
            ))}
          </div>
        );

      case 'projects':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map(p => (
              <div key={p.id} className="bg-slate-900 p-8 rounded-[40px] border border-white/5 flex flex-col group hover:border-primary-500/20 transition-all shadow-2xl">
                <div className="w-full h-48 bg-black rounded-3xl overflow-hidden mb-6 relative">
                  <img src={p.image_url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={p.title} />
                  <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 backdrop-blur-md rounded-lg text-[9px] font-black uppercase text-primary-500 border border-white/10">{p.category}</div>
                </div>
                <h3 className="text-2xl font-black text-white mb-4 line-clamp-1">{p.title}</h3>
                <div className="flex justify-between items-center mt-auto">
                   <div className="flex gap-2">
                      <button onClick={() => openModal(p)} className="p-3 bg-white/5 rounded-xl text-slate-400 hover:text-primary-500 transition-all"><Edit size={18}/></button>
                      <button onClick={() => deleteItem('projects', p.id)} className="p-3 bg-red-500/10 rounded-xl text-red-500 hover:bg-red-500 transition-all"><Trash2 size={18}/></button>
                   </div>
                   {p.gallery_type === 'video' ? <Video size={18} className="text-slate-500"/> : <ImageIcon size={18} className="text-slate-500"/>}
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return <div className="py-20 text-center text-slate-600 font-bold uppercase tracking-widest text-xs">Accessing System...</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row text-slate-100 antialiased font-sans">
      <aside className="w-full md:w-72 bg-slate-900 border-r border-white/5 p-8 flex flex-col h-screen sticky top-0 z-40">
        <div className="mb-12 px-2 flex items-center gap-4">
          <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center font-black text-black text-sm shadow-lg shadow-primary-500/20">A</div>
          <h1 className="text-xl font-black text-white tracking-tighter uppercase">Admin Panel</h1>
        </div>
        <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-2">
          {[
            { id: 'profile', icon: <User size={18}/>, label: 'Identity' },
            { id: 'socials', icon: <Share2 size={18}/>, label: 'Links' },
            { id: 'categories', icon: <Tag size={18}/>, label: 'Categories' },
            { id: 'skills', icon: <Cpu size={18}/>, label: 'Skills' },
            { id: 'projects', icon: <Briefcase size={18}/>, label: 'Portfolio' },
            { id: 'blogs', icon: <FileText size={18}/>, label: 'Blog' },
            { id: 'services', icon: <Layers size={18}/>, label: 'Services' },
            { id: 'timeline', icon: <History size={18}/>, label: 'Timeline' },
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
           <Link to="/" className="w-full flex items-center gap-4 px-5 py-4 text-slate-400 font-bold hover:text-primary-500 transition-all text-[10px] uppercase tracking-widest"><Globe size={18}/> View Site</Link>
           <button onClick={handleLogout} className="w-full px-5 py-4 text-red-500 font-bold flex items-center gap-3 hover:bg-red-500/5 rounded-2xl transition-all text-[10px] uppercase tracking-widest"><LogOut size={18}/> Disconnect</button>
        </div>
      </aside>

      <main className="flex-1 p-8 md:p-12 pb-32 overflow-y-auto relative">
        {isProcessing && (
          <div className="absolute top-10 right-10 bg-primary-500/10 border border-primary-500/50 p-4 rounded-2xl flex items-center gap-3 z-50">
            <Loader2 size={16} className="animate-spin text-primary-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-primary-500">Processing...</span>
          </div>
        )}
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-5xl font-black capitalize text-white tracking-tighter">{activeTab.replace('_', ' ')}</h2>
          {activeTab !== 'profile' && activeTab !== 'messages' && !tableMissing && (
            <button onClick={() => openModal()} className="px-8 py-4 bg-primary-500 text-black rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-3 hover:bg-primary-400 transition-all shadow-xl shadow-primary-500/20 active:scale-95">
              <Plus size={18} /> New Entry
            </button>
          )}
        </div>
        {renderContent()}
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl overflow-y-auto">
           <div className="bg-[#0a0a0a] w-full max-w-2xl rounded-[40px] border border-white/10 p-12 my-10 relative shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 p-3 bg-white/5 text-slate-500 hover:text-white rounded-full transition-all"><X size={24}/></button>
              
              <div className="mb-10">
                <span className="text-primary-500 text-[10px] font-black uppercase tracking-[0.3em] block mb-2">System Modal</span>
                <h3 className="text-3xl font-black text-white capitalize">{isEditing ? 'Modify' : 'Create'} {activeTab.replace('s', '')}</h3>
              </div>

              <form onSubmit={handleSubmitItem} className="space-y-6">
                 {activeTab === 'projects' && (
                    <div className="space-y-5">
                       <input required className="w-full bg-[#111] p-5 rounded-xl text-white border-none focus:ring-1 focus:ring-primary-500/50 outline-none font-medium" placeholder="Project Title" value={currentItem.title || ''} onChange={e => setCurrentItem({...currentItem, title: e.target.value})} />
                       <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block ml-2">Category</label>
                         <select required className="w-full bg-[#111] p-5 rounded-xl text-white border-none focus:ring-1 focus:ring-primary-500/50 outline-none font-medium appearance-none" value={currentItem.category || ''} onChange={e => setCurrentItem({...currentItem, category: e.target.value})}>
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                              <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                         </select>
                       </div>
                       <div>
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-3">Thumbnail</label>
                         <label className="w-full cursor-pointer bg-[#111] hover:bg-primary-500/10 border border-white/5 group text-slate-400 p-5 rounded-xl transition-all flex items-center justify-center gap-4">
                            {uploading ? <Loader2 size={18} className="animate-spin text-primary-500" /> : <Upload size={18} />}
                            <span className="text-xs font-black uppercase tracking-widest">{currentItem.image_url ? 'File Ready' : 'Upload File'}</span>
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'image_url')} />
                         </label>
                       </div>
                       <textarea required className="w-full bg-[#111] p-6 rounded-2xl text-white border-none focus:ring-1 focus:ring-primary-500/50 outline-none h-32 resize-none font-medium" placeholder="Project Description" value={currentItem.description || ''} onChange={e => setCurrentItem({...currentItem, description: e.target.value})} />
                    </div>
                 )}

                 {activeTab === 'categories' && (
                    <div className="space-y-5">
                       <input required className="w-full bg-[#111] p-5 rounded-xl text-white focus:ring-1 focus:ring-primary-500/50 outline-none font-medium" placeholder="Category Name" value={currentItem.name || ''} onChange={e => setCurrentItem({...currentItem, name: e.target.value})} />
                    </div>
                 )}

                 <button type="submit" disabled={isProcessing || uploading} className="w-full py-6 bg-primary-500 text-black rounded-3xl font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-primary-500/20 active:scale-95 transition-all mt-4 disabled:opacity-50">
                    {isProcessing ? 'Syncing...' : uploading ? 'Uploading...' : 'Confirm Changes'}
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
