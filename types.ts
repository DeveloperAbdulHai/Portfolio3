
export interface Profile {
  id: string;
  name: string;
  title: string;
  bio: string;
  about_headline?: string;
  avatar_url: string;
  about_image_url?: string;
  resume_url: string;
  video_url?: string;
  email: string;
  phone: string;
  location: string;
}

export interface TimelineEntry {
  id: string;
  type: 'experience' | 'education';
  title: string;
  institution: string;
  period: string;
  description?: string;
  order_index: number;
}

export interface Skill {
  id: string;
  name: string;
  percentage: number;
  category: string;
  icon?: string;
  icon_url?: string;
}

export interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  video_url?: string;
  gallery_type: 'image' | 'video';
  tech_stack: string[];
  live_url: string;
  github_url: string;
  featured: boolean;
  category: string;
  gallery?: ProjectImage[];
}

export interface ProjectCategory {
  id: string;
  name: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features?: string; // Comma separated string of features
}

export interface WhyChooseMe {
  id: string;
  title: string;
  description: string;
  icon: string;
  order_index: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  photo_url: string;
  text: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
}

// Added BlogPost interface to fix the module import error in Dashboard.tsx
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  image_url: string;
  category: string;
  read_time: string;
  created_at: string;
}
