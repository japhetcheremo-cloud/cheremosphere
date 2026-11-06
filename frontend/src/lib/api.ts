/**
 * CheremoSphere API Client
 * Official Backend Communication Layer
 */

export const getApiBaseUrl = (): string => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  return '/api';
};

const API_BASE_URL = getApiBaseUrl();

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  whatsapp_number: string;
  headline: string;
  bio: string;
  location: string;
  company_name: string;
  website: string;
  avatar: string | null;
  skills: string[];
  cv_file: string | null;
  is_verified: boolean;
  is_job_seeker: boolean;
  is_employer: boolean;
  is_recruiter: boolean;
  is_freelancer: boolean;
  is_business_owner: boolean;
  is_seller: boolean;
  is_customer: boolean;
  is_moderator: boolean;
  is_staff: boolean;
  active_roles: string[];
  created_at: string;
}

export interface CompanyInfo {
  company_name: string;
  owner_name: string;
  tagline: string;
  brand_slogan: string;
  phone_number: string;
  international_whatsapp: string;
  official_email: string;
  physical_office: string;
  facebook_url: string;
  github_username: string;
  github_profile_url: string;
  twitter_x_url: string;
  about_text: string;
  hero_headline: string;
  hero_subheadline: string;
}

export interface PlatformStats {
  total_users: number;
  active_jobs: number;
  job_applications: number;
  job_requests: number;
  freelance_services: number;
  marketplace_products: number;
  registered_businesses: number;
  community_posts: number;
}

export interface JobVacancy {
  id: number;
  title: string;
  slug: string;
  employer: User;
  company_name: string;
  company_logo: string | null;
  category: number;
  category_name: string;
  location: string;
  employment_type: string;
  experience_level: string;
  qualifications: string;
  description: string;
  salary_min: string | null;
  salary_max: string | null;
  is_salary_negotiable: boolean;
  currency: string;
  deadline: string | null;
  status: string;
  is_featured: boolean;
  views_count: number;
  applications_count: number;
  is_saved: boolean;
  created_at: string;
}

export interface JobRequest {
  id: number;
  user: User;
  job_sought: string;
  category: string;
  personal_introduction: string;
  skills: string;
  experience_summary: string;
  qualifications: string;
  preferred_location: string;
  employment_type: string;
  availability: string;
  expected_salary: string;
  portfolio_url: string;
  cv_file: string | null;
  is_fulfilled: boolean;
  views_count: number;
  created_at: string;
}

export interface FreelanceService {
  id: number;
  provider: User;
  title: string;
  slug: string;
  category: number;
  category_name: string;
  description: string;
  skills: string;
  pricing_type: string;
  price: string | null;
  currency: string;
  location: string;
  availability: string;
  cover_image: string | null;
  portfolio_links: string[];
  is_active: boolean;
  is_featured: boolean;
  rating: string;
  reviews_count: number;
  created_at: string;
}

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
  icon: string;
  description: string;
  products_count?: number;
}

export interface ProductListing {
  id: number;
  seller: User;
  business: any | null;
  title: string;
  slug: string;
  category: number;
  category_name: string;
  description: string;
  price: string;
  currency: string;
  location: string;
  condition: string;
  stock_quantity: number;
  status: string;
  is_promoted: boolean;
  views_count: number;
  images: { id: number; image: string; is_cover: boolean }[];
  created_at: string;
}

export interface NetworkPost {
  id: number;
  author: User;
  content: string;
  post_type: string;
  image: string | null;
  likes_count: number;
  comments_count: number;
  comments: { id: number; author: User; content: string; created_at: string }[];
  is_liked: boolean;
  created_at: string;
}

export interface NotificationItem {
  id: number;
  recipient: number;
  sender: User | null;
  notification_type: string;
  title: string;
  message: string;
  action_url: string;
  is_read: boolean;
  created_at: string;
}

export interface Conversation {
  id: number;
  subject: string;
  participants: User[];
  latest_message: { id: number; text: string; sender: User; created_at: string; is_read: boolean } | null;
  unread_count: number;
  created_at: string;
  updated_at: string;
}

// Token storage helper
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('cheremo_token');
};

export const setToken = (token: string) => {
  if (typeof window !== 'undefined') localStorage.setItem('cheremo_token', token);
};

export const removeToken = () => {
  if (typeof window !== 'undefined') localStorage.removeItem('cheremo_token');
};

export const getStoredUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('cheremo_user');
  return user ? JSON.parse(user) : null;
};

export const setStoredUser = (user: User) => {
  if (typeof window !== 'undefined') localStorage.setItem('cheremo_user', JSON.stringify(user));
};

export const removeStoredUser = () => {
  if (typeof window !== 'undefined') localStorage.removeItem('cheremo_user');
};

// Generic fetcher
export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers = new Headers(options.headers || {});
  
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Token ${token}`);
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    let errorMsg = 'An error occurred';
    try {
      const errData = await response.json();
      errorMsg = typeof errData === 'object' ? JSON.stringify(errData) : errData;
    } catch {
      errorMsg = response.statusText;
    }
    throw new Error(errorMsg);
  }

  return response.json();
}
