
export interface Profile {
  id: string;
  name: string;
  title: string;
  bio: string;
  avatar_url: string;
  resume_url: string;
  video_url?: string; // New field for the YouTube embed link
  email: string;
  phone: string;
  location: string;
}

export interface Skill {
  id: string;
  name: string;
  percentage: number;
  category: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  tech_stack: string[];
  live_url: string;
  github_url: string;
  featured: boolean;
  category: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
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
