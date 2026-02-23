
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, Briefcase, MessageSquare, LogOut, Plus, Trash2, Edit, X, Upload, Loader2, Share2, Award, FileText, Globe, History, Layers, Cpu, Star, AlertCircle, ExternalLink, Calendar, MapPin, Video, Image as ImageIcon, Tag, Link as LinkIcon, AlertTriangle
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
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
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
    if (deleteConfirmId !== id) {
      setDeleteConfirmId(id);
      toast("Click again to confirm delete", { icon: '⚠️' });
      setTimeout(() => setDeleteConfirmId(null), 3000);
      return;
    }

    setIsProcessing(true);
    try {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      
      toast.success("Record deleted");
      setDeleteConfirmId(null);
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
      const bucketName = activeTab === 'blogs' ? 'Blog' : 'Portfolio';
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        const { error: uploadError } = await supabase.storage.from(bucketName).upload(filePath, file);
        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
        uploadedUrls.push(data.publicUrl);
      }

      if (isProfile && profile) {
        setProfile({ ...profile, [field]: uploadedUrls[0] });
      } else if (isGallery) {
        setGalleryImages(prev => [...prev, ...uploadedUrls]);
      } else {
        setCurrentItem((prev: any) => ({ ...prev, [field]: uploadedUrls[0] }));
      }
      toast.success("Assets uploaded.");
    } catch (error: any) {
      toast.error(`Upload failed: ${error.message}`);
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
        const { error } = await supabase.from(tableMap[activeTab]).update(savePayload).eq('id', id);
        if (error) throw error;
        
        if (activeTab === 'projects' && savePayload.gallery_type === 'image') {
          await supabase.from('project_images').delete().eq('project_id', id);
          if (galleryImages.length > 0) {
            const galleryPayload = galleryImages.map(url => ({ project_id: id, image_url: url }));
            await supabase.from('project_images').insert(galleryPayload);
          }
        }
      } else {
        const { data, error } = await supabase.from(tableMap[activeTab]).insert([savePayload]).select().single();
        if (error) throw error;
        
        if (activeTab === 'projects' && savePayload.gallery_type === 'image' && galleryImages.length > 0) {
          const galleryPayload = galleryImages.map(url => ({ project_id: data.id, image_url: url }));
          await supabase.from('project_images').insert(galleryPayload);
        }
      }
      
      toast.success("Synchronized successfully");
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
  };

  const openModal = (item: any = {}) => {
    setCurrentItem({ gallery_type: 'image', ...item });
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
    
    switch(activeTab) {
      case 'profile':
        return profile && (
          <form onSubmit={(e) => { e.preventDefault(); supabase.from('profile').upsert(profile).then(() => toast.success("Identity Saved")); }} className="bg-[#0a0a0a] p-12 rounded-[40px] border border-white/5 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block ml-1">NAME</label>
                <input className="w-full bg-[#111] p-5 rounded-xl border-none text-white outline-none font-medium" placeholder="Full Name" value={profile.name || ''} onChange={e => setProfile({...profile, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block ml-1">TITLE</label>
                <input className="w-full bg-[#111] p-5 rounded-xl border-none text-white outline-none font-medium" placeholder="Professional Title" value={profile.title || ''} onChange={e => setProfile({...profile, title: e.target.value})} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block ml-1">BIO</label>
              <textarea className="w-full bg-[#111] p-6 rounded-2xl border-none text-white h-48 outline-none resize-none font-medium" placeholder="Tell your story..." value={profile.bio || ''} onChange={e => setProfile({...profile, bio: e.target.value})} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block ml-1">AVATAR IMAGE</label>
                 <label className="w-full cursor-pointer bg-[#111] border border-white/5 text-slate-400 p-5 rounded-xl flex items-center justify-between transition-all hover:bg-white/5">
                    <div className="flex items-center gap-3">
                      {uploading ? <Loader2 size={16} className="animate-spin text-primary-500" /> : <Upload size={16} />}
                      <span className="text-[10px] font-black uppercase tracking-widest">{profile.avatar_url ? 'IMAGE READY' : 'UPLOAD PHOTO'}</span>
                    </div>
                    {profile.avatar_url && <img src={profile.avatar_url} className="w-8 h-8 rounded-lg object-cover border border-white/10" />}
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'avatar_url', true)} />
                 </label>
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block ml-1">ABOUT PAGE IMAGE</label>
                 <label className="w-full cursor-pointer bg-[#111] border border-white/5 text-slate-400 p-5 rounded-xl flex items-center justify-between transition-all hover:bg-white/5">
                    <div className="flex items-center gap-3">
                      {uploading ? <Loader2 size={16} className="animate-spin text-primary-500" /> : <Upload size={16} />}
                      <span className="text-[10px] font-black uppercase tracking-widest">{profile.about_image_url ? 'IMAGE READY' : 'UPLOAD PHOTO'}</span>
                    </div>
                    {profile.about_image_url && <img src={profile.about_image_url} className="w-8 h-8 rounded-lg object-cover border border-white/10" />}
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'about_image_url', true)} />
                 </label>
               </div>
            </div>
            <button type="submit" className="px-12 py-6 bg-primary-500 text-black rounded-3xl font-black uppercase tracking-widest text-[11px] shadow-lg shadow-primary-500/30 transition-all active:scale-95">SAVE IDENTITY</button>
          </form>
        );

      case 'skills':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map(skill => (
              <div key={skill.id} className="bg-slate-900 p-8 rounded-[40px] border border-white/5 flex items-center justify-between group hover:border-primary-500/20 transition-all">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-primary-500">
                    <Cpu size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{skill.name}</h4>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">{skill.category}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openModal(skill)} className="p-2 text-slate-500 hover:text-white"><Edit size={18}/></button>
                  <button onClick={() => deleteItem('skills', skill.id)} className={`p-2 transition-colors ${deleteConfirmId === skill.id ? 'text-red-500' : 'text-slate-500 hover:text-red-400'}`}><Trash2 size={18}/></button>
                </div>
              </div>
            ))}
          </div>
        );

      case 'socials':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {socials.map(link => (
              <div key={link.id} className="bg-slate-900 p-8 rounded-[40px] border border-white/5 flex items-center justify-between group hover:border-primary-500/20 transition-all">
                <div className="flex items-center gap-5">
                  <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-primary-500">
                    <LinkIcon size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{link.platform}</h4>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest truncate max-w-[120px]">{link.url}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openModal(link)} className="p-2 text-slate-500 hover:text-white"><Edit size={18}/></button>
                  <button onClick={() => deleteItem('social_links', link.id)} className={`p-2 transition-colors ${deleteConfirmId === link.id ? 'text-red-500' : 'text-slate-500 hover:text-red-400'}`}><Trash2 size={18}/></button>
                </div>
              </div>
            ))}
          </div>
        );

      case 'blogs':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogs.map(post => (
              <div key={post.id} className="bg-slate-900 p-8 rounded-[40px] border border-white/5 flex flex-col group transition-all">
                <div className="w-full h-40 bg-black rounded-3xl overflow-hidden mb-6">
                  <img src={post.image_url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4 line-clamp-1">{post.title}</h3>
                <div className="flex justify-between items-center mt-auto">
                   <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{post.category}</span>
                   <div className="flex gap-2">
                      <button onClick={() => openModal(post)} className="p-3 bg-white/5 rounded-xl text-slate-400 hover:text-white"><Edit size={16}/></button>
                      <button onClick={() => deleteItem('blogs', post.id)} className={`p-3 rounded-xl transition-all ${deleteConfirmId === post.id ? 'bg-red-500 text-white' : 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white'}`}><Trash2 size={16}/></button>
                   </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'services':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(service => (
              <div key={service.id} className="bg-slate-900 p-8 rounded-[40px] border border-white/5 flex flex-col group transition-all">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-primary-500 mb-6">
                  <Layers size={22} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
                <p className="text-slate-500 text-xs line-clamp-2 mb-6">{service.description}</p>
                <div className="flex gap-2 mt-auto">
                  <button onClick={() => openModal(service)} className="p-2 text-slate-500 hover:text-white"><Edit size={18}/></button>
                  <button onClick={() => deleteItem('services', service.id)} className={`p-2 transition-colors ${deleteConfirmId === service.id ? 'text-red-500' : 'text-slate-500 hover:text-red-400'}`}><Trash2 size={18}/></button>
                </div>
              </div>
            ))}
          </div>
        );

      case 'timeline':
        return (
          <div className="space-y-4">
            {timeline.map(entry => (
              <div key={entry.id} className="bg-slate-900 p-6 rounded-3xl border border-white/5 flex items-center justify-between group">
                <div className="flex items-center gap-5">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${entry.type === 'experience' ? 'bg-primary-500/10 text-primary-500' : 'bg-blue-500/10 text-blue-500'}`}>
                    {entry.type === 'experience' ? <Briefcase size={18}/> : <History size={18}/>}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{entry.title}</h4>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">{entry.institution} | {entry.period}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openModal(entry)} className="p-2 text-slate-500 hover:text-white"><Edit size={18}/></button>
                  <button onClick={() => deleteItem('timeline', entry.id)} className={`p-2 transition-colors ${deleteConfirmId === entry.id ? 'text-red-500' : 'text-slate-500 hover:text-red-400'}`}><Trash2 size={18}/></button>
                </div>
              </div>
            ))}
          </div>
        );

      case 'why':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {whyChooseMe.map(item => (
              <div key={item.id} className="bg-slate-900 p-8 rounded-[40px] border border-white/5 group">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-primary-500 mb-6">
                  <Award size={22} />
                </div>
                <h4 className="font-bold text-white mb-2">{item.title}</h4>
                <p className="text-slate-500 text-xs mb-6">{item.description}</p>
                <div className="flex gap-2">
                  <button onClick={() => openModal(item)} className="p-2 text-slate-500 hover:text-white"><Edit size={18}/></button>
                  <button onClick={() => deleteItem('why_choose_me', item.id)} className={`p-2 transition-colors ${deleteConfirmId === item.id ? 'text-red-500' : 'text-slate-500 hover:text-red-400'}`}><Trash2 size={18}/></button>
                </div>
              </div>
            ))}
          </div>
        );

      case 'testimonials':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <div key={t.id} className="bg-slate-900 p-8 rounded-[40px] border border-white/5 flex flex-col group transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <img src={t.photo_url} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <h4 className="font-bold text-white text-sm">{t.name}</h4>
                    <p className="text-[10px] text-primary-500 uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
                <p className="text-slate-500 text-xs italic mb-8 line-clamp-3">"{t.text}"</p>
                <div className="flex gap-2 mt-auto">
                  <button onClick={() => openModal(t)} className="p-2 text-slate-500 hover:text-white"><Edit size={18}/></button>
                  <button onClick={() => deleteItem('testimonials', t.id)} className={`p-2 transition-colors ${deleteConfirmId === t.id ? 'text-red-500' : 'text-slate-500 hover:text-red-400'}`}><Trash2 size={18}/></button>
                </div>
              </div>
            ))}
          </div>
        );

      case 'messages':
        return (
          <div className="space-y-4">
            {messages.map(msg => (
              <div key={msg.id} className={`p-8 rounded-[40px] border transition-all ${msg.is_read ? 'bg-slate-950 border-white/5' : 'bg-slate-900 border-primary-500/20'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-bold text-white">{msg.name}</h4>
                    <p className="text-xs text-primary-500">{msg.email}</p>
                  </div>
                  <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{new Date(msg.created_at).toLocaleDateString()}</span>
                </div>
                <h5 className="text-sm font-bold text-slate-300 mb-2">{msg.subject}</h5>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">{msg.message}</p>
                <button onClick={() => deleteItem('contact_messages', msg.id)} className="text-red-500 hover:text-red-400 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                  <Trash2 size={14} /> Remove Message
                </button>
              </div>
            ))}
          </div>
        );

      case 'categories':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map(cat => (
              <div key={cat.id} className="bg-slate-900 p-8 rounded-[40px] border border-white/5 flex items-center justify-between group hover:border-primary-500/20 transition-all">
                <div className="flex items-center gap-5">
                  <Tag size={20} className="text-primary-500" />
                  <h4 className="font-bold text-white">{cat.name}</h4>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openModal(cat)} className="p-2 text-slate-500 hover:text-white"><Edit size={18}/></button>
                  <button onClick={() => deleteItem('project_categories', cat.id)} className={`p-2 transition-colors ${deleteConfirmId === cat.id ? 'text-red-500' : 'text-slate-500 hover:text-red-400'}`}><Trash2 size={18}/></button>
                </div>
              </div>
            ))}
          </div>
        );

      case 'projects':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map(p => (
              <div key={p.id} className="bg-slate-900 p-8 rounded-[40px] border border-white/5 flex flex-col group transition-all">
                <div className="w-full h-48 bg-black rounded-3xl overflow-hidden mb-6">
                  <img src={p.image_url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt={p.title} />
                </div>
                <h3 className="text-2xl font-black text-white mb-4">{p.title}</h3>
                <div className="flex justify-between items-center mt-auto">
                   <div className="flex gap-2">
                      <button onClick={() => openModal(p)} className="p-3 bg-white/5 rounded-xl text-slate-400 hover:text-white"><Edit size={18}/></button>
                      <button onClick={() => deleteItem('projects', p.id)} className={`p-3 rounded-xl transition-all ${deleteConfirmId === p.id ? 'bg-red-500 text-white' : 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white'}`}><Trash2 size={18}/></button>
                   </div>
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
          <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center font-black text-black text-sm">A</div>
          <h1 className="text-xl font-black text-white uppercase tracking-tighter">Admin Panel</h1>
        </div>
        <nav className="flex-1 space-y-2 overflow-y-auto pr-2">
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
        <div className="mt-8 pt-8 border-t border-white/5">
           <Link to="/" className="w-full flex items-center gap-4 px-5 py-4 text-slate-400 font-bold text-[10px] uppercase tracking-widest"><Globe size={18}/> View Site</Link>
           <button onClick={handleLogout} className="w-full px-5 py-4 text-red-500 font-bold flex items-center gap-3 text-[10px] uppercase tracking-widest"><LogOut size={18}/> Disconnect</button>
        </div>
      </aside>

      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-5xl font-black capitalize text-white tracking-tighter">{activeTab.replace('_', ' ')}</h2>
          {activeTab !== 'profile' && activeTab !== 'messages' && (
            <button onClick={() => openModal()} className="px-8 py-4 bg-primary-500 text-black rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-3 hover:shadow-primary-500/20 shadow-xl">
              <Plus size={18} /> New Entry
            </button>
          )}
        </div>
        {renderContent()}
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
           <div className="bg-[#0a0a0a] w-full max-w-lg rounded-[40px] border border-white/10 p-12 relative shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 p-3 bg-white/5 text-slate-500 hover:text-white rounded-full"><X size={20}/></button>
              
              <div className="mb-10">
                <span className="text-primary-500 text-[10px] font-black uppercase tracking-[0.3em] block mb-2">SYSTEM MODAL</span>
                <h3 className="text-3xl font-black text-white">{isEditing ? 'Modify' : 'Create'} {activeTab === 'projects' ? 'Project' : activeTab.replace('s', '')}</h3>
              </div>

              <form onSubmit={handleSubmitItem} className="space-y-6">
                 {activeTab === 'projects' && (
                    <div className="space-y-6">
                       <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block ml-1">PROJECT TITLE</label>
                         <input required className="w-full bg-[#111] p-5 rounded-xl text-white border-none outline-none font-medium" placeholder="Project Title" value={currentItem.title || ''} onChange={e => setCurrentItem({...currentItem, title: e.target.value})} />
                       </div>
                       
                       <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block ml-1">CATEGORY</label>
                         <select required className="w-full bg-[#111] p-5 rounded-xl text-white border-none outline-none appearance-none font-medium" value={currentItem.category || ''} onChange={e => setCurrentItem({...currentItem, category: e.target.value})}>
                            <option value="">Select Category</option>
                            {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                         </select>
                       </div>

                       <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block ml-1">MEDIA TYPE</label>
                         <select required className="w-full bg-[#111] p-5 rounded-xl text-white border-none outline-none appearance-none font-medium" value={currentItem.gallery_type || 'image'} onChange={e => setCurrentItem({...currentItem, gallery_type: e.target.value})}>
                            <option value="image">Image</option>
                            <option value="video">Video</option>
                         </select>
                       </div>

                       <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block ml-1">THUMBNAIL</label>
                         <label className="w-full cursor-pointer bg-[#111] border border-white/5 text-slate-400 p-5 rounded-xl flex items-center justify-between transition-all hover:bg-white/5">
                            <div className="flex items-center gap-3">
                              {uploading ? <Loader2 size={16} className="animate-spin text-primary-500" /> : <Upload size={16} />}
                              <span className="text-[10px] font-black uppercase tracking-widest">{currentItem.image_url ? 'IMAGE READY' : 'UPLOAD FILE'}</span>
                            </div>
                            {currentItem.image_url && <img src={currentItem.image_url} className="w-8 h-8 rounded-lg object-cover border border-white/10" />}
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'image_url')} />
                         </label>
                       </div>

                       {currentItem.gallery_type === 'video' && (
                         <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block ml-1">VIDEO URL</label>
                           <input required className="w-full bg-[#111] p-5 rounded-xl text-white border-none outline-none font-medium" placeholder="YouTube or Vimeo URL" value={currentItem.video_url || ''} onChange={e => setCurrentItem({...currentItem, video_url: e.target.value})} />
                         </div>
                       )}

                       {currentItem.gallery_type === 'image' && (
                         <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block ml-1">GALLERY IMAGES (OPTIONAL)</label>
                           <label className="w-full cursor-pointer bg-[#111] border border-white/5 text-slate-400 p-5 rounded-xl flex items-center justify-center gap-3 hover:bg-white/5 transition-all">
                              {uploading ? <Loader2 size={16} className="animate-spin text-primary-500" /> : <Plus size={16} />}
                              <span className="text-[10px] font-black uppercase tracking-widest">{galleryImages.length > 0 ? `${galleryImages.length} FILES READY` : 'ADD GALLERY IMAGES'}</span>
                              <input type="file" className="hidden" accept="image/*" multiple onChange={(e) => handleFileUpload(e, 'gallery', false, true)} />
                           </label>
                         </div>
                       )}

                       <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block ml-1">PROJECT DESCRIPTION</label>
                         <textarea required className="w-full bg-[#111] p-6 rounded-2xl text-white border-none outline-none h-32 resize-none font-medium" placeholder="Project Description" value={currentItem.description || ''} onChange={e => setCurrentItem({...currentItem, description: e.target.value})} />
                       </div>
                    </div>
                 )}

                 {activeTab === 'blogs' && (
                    <div className="space-y-6">
                       <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block ml-1">BLOG TITLE</label>
                         <input required className="w-full bg-[#111] p-5 rounded-xl text-white border-none outline-none font-medium" placeholder="Article Title" value={currentItem.title || ''} onChange={e => setCurrentItem({...currentItem, title: e.target.value})} />
                       </div>
                       
                       <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block ml-1">CATEGORY</label>
                           <input required className="w-full bg-[#111] p-5 rounded-xl text-white border-none outline-none font-medium" placeholder="e.g. Design" value={currentItem.category || ''} onChange={e => setCurrentItem({...currentItem, category: e.target.value})} />
                         </div>
                         <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block ml-1">READ TIME</label>
                           <input required className="w-full bg-[#111] p-5 rounded-xl text-white border-none outline-none font-medium" placeholder="e.g. 5 min read" value={currentItem.read_time || ''} onChange={e => setCurrentItem({...currentItem, read_time: e.target.value})} />
                         </div>
                       </div>

                       <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block ml-1">COVER IMAGE</label>
                         <label className="w-full cursor-pointer bg-[#111] border border-white/5 text-slate-400 p-5 rounded-xl flex items-center justify-between transition-all hover:bg-white/5">
                            <div className="flex items-center gap-3">
                              {uploading ? <Loader2 size={16} className="animate-spin text-primary-500" /> : <Upload size={16} />}
                              <span className="text-[10px] font-black uppercase tracking-widest">{currentItem.image_url ? 'IMAGE READY' : 'UPLOAD COVER'}</span>
                            </div>
                            {currentItem.image_url && <img src={currentItem.image_url} className="w-8 h-8 rounded-lg object-cover border border-white/10" />}
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'image_url')} />
                         </label>
                       </div>

                       <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block ml-1">CONTENT</label>
                         <textarea required className="w-full bg-[#111] p-6 rounded-2xl text-white border-none outline-none h-48 resize-none font-medium" placeholder="Write your article content..." value={currentItem.content || ''} onChange={e => setCurrentItem({...currentItem, content: e.target.value})} />
                       </div>
                    </div>
                 )}

                 {activeTab !== 'projects' && activeTab !== 'blogs' && (
                    <div className="space-y-5">
                       <input required className="w-full bg-[#111] p-5 rounded-xl text-white border-none outline-none" placeholder="Name/Title" value={currentItem.name || currentItem.title || currentItem.platform || ''} onChange={e => setCurrentItem({...currentItem, [activeTab === 'socials' ? 'platform' : (activeTab === 'skills' || activeTab === 'categories' ? 'name' : 'title')]: e.target.value})} />
                       {activeTab === 'socials' && <input className="w-full bg-[#111] p-5 rounded-xl text-white border-none outline-none" placeholder="URL" value={currentItem.url || ''} onChange={e => setCurrentItem({...currentItem, url: e.target.value})} />}
                    </div>
                 )}

                 <button type="submit" disabled={isProcessing || uploading} className="w-full py-6 bg-primary-500 text-black rounded-3xl font-black uppercase tracking-widest text-[11px] shadow-lg shadow-primary-500/30 transition-all active:scale-95 disabled:opacity-50 mt-4">
                    {isProcessing ? 'Syncing...' : 'CONFIRM CHANGES'}
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
