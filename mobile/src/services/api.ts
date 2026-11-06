import { Company } from '../config/tokens';

// Default API URL: can be overridden via window/env or falls back to localhost:8000
// Note: For Android Emulator, use 10.0.2.2:8000. For physical devices on WiFi, use your machine's LAN IP.
export const API_BASE_URL = 'http://127.0.0.1:8000/api';

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

export const getAuthToken = () => authToken;

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  phone_number: string;
  headline: string;
  bio: string;
  location: string;
  is_verified: boolean;
  is_job_seeker: boolean;
  is_employer: boolean;
  is_freelancer: boolean;
  is_seller: boolean;
  is_business_owner: boolean;
}

export interface JobVacancy {
  id: number;
  employer_name: string;
  employer_company: string;
  title: string;
  category_name: string;
  job_type: string;
  location: string;
  is_remote: boolean;
  salary_min?: number;
  salary_max?: number;
  salary_is_negotiable?: boolean;
  description: string;
  requirements?: string;
  responsibilities?: string;
  deadline?: string;
  status: string;
  created_at: string;
}

export interface JobRequest {
  id: number;
  user_name: string;
  user_phone: string;
  title: string;
  skills: string;
  qualifications: string;
  preferred_location: string;
  employment_type: string;
  availability: string;
  expected_salary?: number;
  personal_introduction: string;
  is_fulfilled: boolean;
  created_at: string;
}

export interface FreelanceService {
  id: number;
  provider_name: string;
  title: string;
  category_name: string;
  description: string;
  starting_price: number;
  pricing_type: string;
  delivery_time_days?: number;
  skills: string;
  rating: number;
  reviews_count: number;
  created_at: string;
}

export interface ProductListing {
  id: number;
  seller_name: string;
  seller_phone: string;
  title: string;
  category_name: string;
  description: string;
  price: number;
  condition: string;
  location: string;
  stock_quantity: number;
  status: string;
  created_at: string;
}

export interface NetworkPost {
  id: number;
  author_name: string;
  author_headline?: string;
  content: string;
  post_type: string;
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
  created_at: string;
}

export interface PlatformStats {
  total_users: number;
  total_jobs: number;
  total_job_requests: number;
  total_services: number;
  total_products: number;
  active_vacancies: number;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (authToken) {
    headers['Authorization'] = `Token ${authToken}`;
  }

  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || errData.error || `HTTP error ${res.status}`);
    }
    return await res.json();
  } catch (err: any) {
    console.warn(`API request error on ${url}:`, err.message);
    throw err;
  }
}

export const api = {
  // Auth
  login: (data: any) => request<{ token: string; user: User }>('/auth/login/', { method: 'POST', body: JSON.stringify(data) }),
  register: (data: any) => request<{ token: string; user: User }>('/auth/register/', { method: 'POST', body: JSON.stringify(data) }),
  getProfile: () => request<User>('/profile/'),

  // Platform
  getStats: () => request<PlatformStats>('/platform/stats/'),
  search: (q: string) => request<any>(`/search/?q=${encodeURIComponent(q)}`),

  // Jobs
  getJobs: () => request<JobVacancy[]>('/jobs/vacancies/'),
  getJobCategories: () => request<any[]>('/jobs/categories/'),
  applyJob: (data: any) => request<any>('/jobs/applications/apply/', { method: 'POST', body: JSON.stringify(data) }),
  createJob: (data: any) => request<JobVacancy>('/jobs/vacancies/', { method: 'POST', body: JSON.stringify(data) }),

  // Ask for a Job
  getJobRequests: () => request<JobRequest[]>('/job-seeking/requests/'),
  createJobRequest: (data: any) => request<JobRequest>('/job-seeking/requests/', { method: 'POST', body: JSON.stringify(data) }),

  // Services
  getServices: () => request<FreelanceService[]>('/freelance/services/'),
  createService: (data: any) => request<FreelanceService>('/freelance/services/', { method: 'POST', body: JSON.stringify(data) }),

  // Marketplace
  getProducts: () => request<ProductListing[]>('/marketplace/products/'),
  getProductCategories: () => request<any[]>('/marketplace/categories/'),
  createProduct: (data: any) => request<ProductListing>('/marketplace/products/', { method: 'POST', body: JSON.stringify(data) }),

  // Network Feed
  getFeed: () => request<NetworkPost[]>('/network/feed/'),
  createPost: (data: any) => request<NetworkPost>('/network/feed/', { method: 'POST', body: JSON.stringify(data) }),
  likePost: (postId: number) => request<any>(`/network/posts/${postId}/like/`, { method: 'POST' }),

  // Chat
  getConversations: () => request<any[]>('/chat/conversations/'),
  sendMessage: (conversationId: number, content: string) =>
    request<any>(`/chat/conversations/${conversationId}/send/`, { method: 'POST', body: JSON.stringify({ content }) }),
};
