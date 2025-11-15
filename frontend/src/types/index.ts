export interface User {
  id: number;
  email: string;
  name: string;
  created_at: string;
}

export interface HeroContent {
  id: number;
  title: string;
  subtitle: string;
  cta_text: string;
  background_image?: string;
  background_video?: string;
  overlay_color: string;
  overlay_opacity: number;
  updated_at: string;
}

export interface AboutContent {
  id: number;
  title: string;
  description: string;
  mission: string;
  vision: string;
  values: string[];
  main_image?: string;
  updated_at: string;
}

export interface Statistics {
  id: number;
  years_experience: number;
  projects_completed: number;
  happy_clients: number;
  square_meters: number;
  updated_at: string;
}

export interface Service {
  id: number;
  name: string;
  short_description: string;
  full_description: string;
  icon?: string;
  image?: string;
  color: string;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProjectImage {
  id: number;
  project_id: number;
  image_url: string;
  caption?: string;
  order: number;
  created_at: string;
}

export interface Project {
  id: number;
  name: string;
  client?: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  category: 'Residencial' | 'Comercial' | 'Industrial';
  status: 'En curso' | 'Completado';
  description: string;
  main_image?: string;
  square_meters?: number;
  budget?: number;
  youtube_video?: string;
  is_featured: boolean;
  order: number;
  images?: ProjectImage[];
  created_at: string;
  updated_at: string;
}

export interface ContactInfo {
  id: number;
  address: string;
  phone_primary: string;
  phone_secondary?: string;
  email_general: string;
  email_sales?: string;
  whatsapp?: string;
  schedule: string;
  map_latitude?: number;
  map_longitude?: number;
  facebook_url?: string;
  instagram_url?: string;
  linkedin_url?: string;
  youtube_url?: string;
  updated_at: string;
}

export interface SiteConfig {
  id: number;
  company_name: string;
  logo_main?: string;
  logo_footer?: string;
  favicon?: string;
  slogan: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  footer_copyright?: string;
  cookie_message?: string;
  meta_description?: string;
  meta_keywords?: string;
  enable_3d_animations: boolean;
  particle_speed: number;
  particle_color: string;
  updated_at: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}
