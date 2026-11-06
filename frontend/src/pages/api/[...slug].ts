import type { NextApiRequest, NextApiResponse } from 'next';

// In-memory data store for serverless execution
interface UserRecord {
  id: number;
  username: string;
  email: string;
  password?: string;
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
  token: string;
  created_at: string;
}

const USERS: UserRecord[] = [
  {
    id: 1,
    username: 'admin',
    email: 'japhetcheremo@gmai.com',
    password: 'AdminPassword2026!',
    first_name: 'Japhet',
    last_name: 'Cheremo',
    phone: '0719678760',
    whatsapp_number: '+254719678760',
    headline: 'Founder & Lead Administrator at CheremoSphere',
    bio: 'Connecting talent, employers, and business ecosystems across Kenya and Africa.',
    location: 'Nairobi, Kenya',
    company_name: 'CheremoSphere HQ',
    website: 'https://cheremosphere.com',
    avatar: null,
    skills: ['Leadership', 'Business Strategy', 'Platform Governance', 'Full-Stack'],
    cv_file: null,
    is_verified: true,
    is_job_seeker: true,
    is_employer: true,
    is_recruiter: true,
    is_freelancer: true,
    is_business_owner: true,
    is_seller: true,
    is_customer: true,
    is_moderator: true,
    is_staff: true,
    active_roles: ['Admin', 'Employer', 'Job Seeker', 'Freelancer', 'Seller'],
    token: 'token_admin_2026',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 2,
    username: 'safari_tech',
    email: 'recruiting@safaritech.co.ke',
    password: 'Password123!',
    first_name: 'Safari',
    last_name: 'Ventures',
    phone: '0712345678',
    whatsapp_number: '+254712345678',
    headline: 'Hiring top tech talent across East Africa',
    bio: 'Innovative technology hub building digital solutions for Africa.',
    location: 'Westlands, Nairobi',
    company_name: 'Safari Tech Hub',
    website: 'https://safaritech.co.ke',
    avatar: null,
    skills: ['Recruitment', 'Tech Talent', 'Software Engineering'],
    cv_file: null,
    is_verified: true,
    is_job_seeker: false,
    is_employer: true,
    is_recruiter: true,
    is_freelancer: false,
    is_business_owner: true,
    is_seller: false,
    is_customer: true,
    is_moderator: false,
    is_staff: false,
    active_roles: ['Employer', 'Business Owner'],
    token: 'token_safari_tech',
    created_at: '2026-01-02T00:00:00Z',
  },
  {
    id: 3,
    username: 'kevin_dev',
    email: 'kevin@cheremosphere.com',
    password: 'Password123!',
    first_name: 'Kevin',
    last_name: 'Mwangi',
    phone: '0722334455',
    whatsapp_number: '+254722334455',
    headline: 'Full-stack React & Django Engineer',
    bio: 'Over 5 years building scalable web and mobile applications.',
    location: 'Nairobi, Kenya',
    company_name: 'Kevin Dev Studio',
    website: 'https://github.com/japhetcheremo-cloud',
    avatar: null,
    skills: ['React', 'Next.js', 'Django', 'TypeScript', 'PostgreSQL', 'Python'],
    cv_file: null,
    is_verified: true,
    is_job_seeker: true,
    is_employer: false,
    is_recruiter: false,
    is_freelancer: true,
    is_business_owner: false,
    is_seller: false,
    is_customer: true,
    is_moderator: false,
    is_staff: false,
    active_roles: ['Job Seeker', 'Freelancer'],
    token: 'token_kevin_dev',
    created_at: '2026-01-03T00:00:00Z',
  },
  {
    id: 4,
    username: 'mama_mboga_direct',
    email: 'seller@cheremosphere.com',
    password: 'Password123!',
    first_name: 'Grace',
    last_name: 'Wanjiku',
    phone: '0733445566',
    whatsapp_number: '+254733445566',
    headline: 'Wholesale & Retail Organic Produce & Agro-inputs',
    bio: 'Supplying fresh vegetables, fruits, and organic farm produce directly to homes and restaurants.',
    location: 'Kiambu & Nairobi, Kenya',
    company_name: 'Green Highlands Agribusiness',
    website: 'https://mamamboga.co.ke',
    avatar: null,
    skills: ['Agribusiness', 'Farm Logistics', 'Produce Quality'],
    cv_file: null,
    is_verified: true,
    is_job_seeker: false,
    is_employer: false,
    is_recruiter: false,
    is_freelancer: false,
    is_business_owner: true,
    is_seller: true,
    is_customer: true,
    is_moderator: false,
    is_staff: false,
    active_roles: ['Seller', 'Business Owner'],
    token: 'token_mama_mboga',
    created_at: '2026-01-04T00:00:00Z',
  },
];

const COMPANY_PROFILE = {
  company_name: 'CheremoSphere',
  owner_name: 'Japhet Cheremo',
  tagline: 'Your skills. Your opportunities. All in one place.',
  brand_slogan: 'Jobs. Connect. Market. Grow.',
  phone_number: '0719678760',
  international_whatsapp: '+254719678760',
  official_email: 'japhetcheremo@gmai.com',
  physical_office: 'Cheremo Plaza, Nairobi Mombasa Road, Kenya.',
  facebook_url: 'https://www.facebook.com/profile.php?id=61564247063691',
  github_username: 'japhetcheremo-cloud',
  github_profile_url: 'https://github.com/japhetcheremo-cloud',
  twitter_x_url: '',
  about_text: 'CheremoSphere is Kenya and Africa\'s unified multi-role digital ecosystem connecting talent, employers, freelancers, and businesses in one place.',
  hero_headline: 'Discover Opportunities. Connect with People. Grow Your Future.',
  hero_subheadline: 'Find your next job, hire talented people, promote your business, discover products and connect with opportunities through one powerful platform.',
};

const JOBS = [
  {
    id: 1,
    title: 'Senior Full-Stack Django/React Engineer',
    slug: 'senior-full-stack-engineer-safari-tech',
    employer: USERS[1],
    company_name: 'Safari Tech Hub',
    company_logo: null,
    category: 1,
    category_name: 'Software & Technology',
    location: 'Nairobi, Kenya (Hybrid)',
    employment_type: 'full_time',
    experience_level: '3-5 Years',
    qualifications: 'BSc in Computer Science or equivalent. Strong proficiency with Python, Django, REST Framework, React, and PostgreSQL.',
    description: 'We are looking for an experienced Senior Full-Stack Engineer to lead development of high-impact fintech and e-commerce platforms.',
    salary_min: '150000',
    salary_max: '250000',
    is_salary_negotiable: true,
    currency: 'KES',
    deadline: '2026-12-31',
    status: 'active',
    is_featured: true,
    views_count: 248,
    applications_count: 14,
    is_saved: false,
    created_at: '2026-02-01T08:00:00Z',
  },
  {
    id: 2,
    title: 'Certified Public Accountant (CPA-K)',
    slug: 'certified-public-accountant-green-highlands',
    employer: USERS[3],
    company_name: 'Green Highlands Agribusiness',
    company_logo: null,
    category: 2,
    category_name: 'Accounting & Finance',
    location: 'Nairobi CBD, Kenya',
    employment_type: 'full_time',
    experience_level: '2-4 Years',
    qualifications: 'CPA-K completion, proficiency in QuickBooks, ERP systems, and KRA iTax compliance.',
    description: 'Managing day-to-day financial bookkeeping, tax filings, payroll processing, and quarterly financial statements.',
    salary_min: '75000',
    salary_max: '110000',
    is_salary_negotiable: false,
    currency: 'KES',
    deadline: '2026-12-15',
    status: 'active',
    is_featured: true,
    views_count: 182,
    applications_count: 9,
    is_saved: false,
    created_at: '2026-02-03T10:00:00Z',
  },
  {
    id: 3,
    title: 'Digital Marketing & Content Specialist',
    slug: 'digital-marketing-specialist-cheremosphere',
    employer: USERS[0],
    company_name: 'CheremoSphere',
    company_logo: null,
    category: 3,
    category_name: 'Sales & Marketing',
    location: 'Mombasa Road, Nairobi',
    employment_type: 'contract',
    experience_level: '1-3 Years',
    qualifications: 'Diploma/Degree in Marketing, Communications, or PR. Proven portfolio in social media growth and SEO copywriting.',
    description: 'Drive growth and community engagement across Facebook, LinkedIn, TikTok, and search engines for CheremoSphere.',
    salary_min: '50000',
    salary_max: '85000',
    is_salary_negotiable: true,
    currency: 'KES',
    deadline: '2026-12-20',
    status: 'active',
    is_featured: false,
    views_count: 310,
    applications_count: 22,
    is_saved: false,
    created_at: '2026-02-05T12:00:00Z',
  },
];

const JOB_REQUESTS = [
  {
    id: 1,
    user: USERS[2],
    job_sought: 'Frontend or Full-Stack Software Developer',
    category: 'Software & Technology',
    personal_introduction: 'Certified React & TypeScript engineer seeking full-time or contract roles. Experienced with building high-converting landing pages and SaaS apps.',
    skills: 'React, Next.js, TypeScript, Tailwind CSS, Python, Django, REST APIs',
    experience_summary: '5+ years building production applications for Kenyan and international clients.',
    qualifications: 'BSc Computer Science, AWS Certified Cloud Practitioner',
    preferred_location: 'Nairobi or Remote',
    employment_type: 'Full-time / Contract',
    availability: 'Immediate (within 2 weeks)',
    expected_salary: '120,000 - 180,000 KES',
    portfolio_url: 'https://github.com/japhetcheremo-cloud',
    cv_file: null,
    is_fulfilled: false,
    views_count: 142,
    created_at: '2026-02-02T14:00:00Z',
  },
  {
    id: 2,
    user: {
      ...USERS[0],
      first_name: 'Samuel',
      last_name: 'Otieno',
      username: 'samuel_otieno',
      phone: '0719678760',
    },
    job_sought: 'Professional Heavy Commercial & Executive Driver',
    category: 'Logistics & Transport',
    personal_introduction: 'Reliable, disciplined professional driver with clean BCA license and over 8 years experience across Kenya and East Africa.',
    skills: 'Defensive Driving, Vehicle Maintenance, Route Planning, Customer Service',
    experience_summary: '8 years corporate and executive fleet chauffeuring with zero incident record.',
    qualifications: 'NTSA Class BCE License, First Aid Certificate, Police Clearance',
    preferred_location: 'Nairobi / Bungoma / Eldoret',
    employment_type: 'Full-time',
    availability: 'Available immediately',
    expected_salary: '45,000 - 65,000 KES',
    portfolio_url: '',
    cv_file: null,
    is_fulfilled: false,
    views_count: 98,
    created_at: '2026-02-04T09:30:00Z',
  },
];

const SERVICES = [
  {
    id: 1,
    provider: USERS[2],
    title: 'Custom Web & Mobile Application Development',
    slug: 'custom-web-mobile-app-dev',
    category: 1,
    category_name: 'Web & App Development',
    description: 'End-to-end development of modern responsive websites, mobile apps, and administrative dashboards using React, Next.js, and Django.',
    pricing_type: 'fixed',
    starting_price: '25000',
    currency: 'KES',
    delivery_time_days: 5,
    revisions_allowed: 3,
    location: 'Nairobi, Kenya',
    is_remote: true,
    rating: '5.0',
    reviews_count: 18,
    created_at: '2026-02-01T10:00:00Z',
  },
];

const PRODUCTS = [
  {
    id: 1,
    seller: USERS[3],
    title: 'Fresh Organic Farm Avocado Box (Pack of 20)',
    slug: 'fresh-organic-avocado-box',
    category: 6,
    category_name: 'Agriculture & Food',
    description: 'Export-grade Hass avocados directly harvested from Kiambu highlands. Naturally ripened, high oil content, delivered fresh.',
    price: '1200',
    currency: 'KES',
    condition: 'brand_new',
    stock_quantity: 45,
    location: 'Kiambu & Nairobi CBD',
    status: 'active',
    is_promoted: true,
    views_count: 215,
    images: [{ id: 1, image: '/hero-placeholder.svg', is_cover: true }],
    created_at: '2026-02-02T11:00:00Z',
  },
  {
    id: 2,
    seller: USERS[0],
    title: 'HP ProBook 450 G8 (Core i7, 16GB RAM, 512GB SSD)',
    slug: 'hp-probook-450-g8-core-i7',
    category: 2,
    category_name: 'Phones & Computers',
    description: 'Clean enterprise laptop, 11th Gen Core i7, 16GB DDR4, 512GB NVMe SSD, Backlit keyboard, Pristine battery life (6+ hours).',
    price: '58000',
    currency: 'KES',
    condition: 'used_like_new',
    stock_quantity: 3,
    location: 'Cheremo Plaza, Nairobi',
    status: 'active',
    is_promoted: true,
    views_count: 380,
    images: [{ id: 2, image: '/hero-placeholder.svg', is_cover: true }],
    created_at: '2026-02-04T15:00:00Z',
  },
];

const POSTS = [
  {
    id: 1,
    author: USERS[0],
    content: 'Welcome to CheremoSphere! Our mission is to empower professionals, businesses, and job seekers across Kenya and Africa to discover opportunities, advertise skills, and thrive in one connected ecosystem. Jobs. Connect. Market. Grow.',
    post_type: 'announcement',
    image: null,
    likes_count: 42,
    comments_count: 5,
    comments: [
      {
        id: 1,
        author: USERS[1],
        content: 'Congratulations Japhet Cheremo! Looking forward to hiring great Kenyan engineers through CheremoSphere.',
        created_at: '2026-02-02T12:00:00Z',
      },
      {
        id: 2,
        author: USERS[2],
        content: 'The "Ask for a Job" reverse hiring feature is revolutionary for freelancers and candidates!',
        created_at: '2026-02-02T12:30:00Z',
      },
    ],
    is_liked: false,
    created_at: '2026-02-01T09:00:00Z',
  },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Extract route path from query
  const slug = req.query.slug;
  const path = Array.isArray(slug) ? slug.join('/') : (slug || '');

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Auth helper
  const authHeader = req.headers.authorization;
  const token = authHeader ? authHeader.replace(/^(Token|Bearer)\s+/, '') : null;
  const currentUser = token ? USERS.find(u => u.token === token) || USERS[0] : null;

  // 1. POST /api/auth/login or /api/auth/login/
  if (path === 'auth/login' && req.method === 'POST') {
    const { username, password } = req.body || {};
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const uLower = username.toLowerCase().trim();
    const user = USERS.find(u => u.username.toLowerCase() === uLower || u.email.toLowerCase() === uLower);

    if (!user) {
      // Allow dynamic sign-in for demo convenience
      const demoUser = USERS[0];
      return res.status(200).json({
        token: demoUser.token,
        user: demoUser,
      });
    }

    if (user.password && password && user.password !== password) {
      // In demo mode, if matching standard demo password, let in
      if (password !== 'AdminPassword2026!' && password !== 'Password123!') {
        return res.status(400).json({ error: 'Invalid password. Check demo credentials on the page.' });
      }
    }

    return res.status(200).json({
      token: user.token,
      user,
    });
  }

  // 2. POST /api/auth/register
  if (path === 'auth/register' && req.method === 'POST') {
    const data = req.body || {};
    if (!data.username || !data.email) {
      return res.status(400).json({ error: 'Username and email are required' });
    }

    const newUser: UserRecord = {
      id: USERS.length + 1,
      username: data.username.toLowerCase().trim(),
      email: data.email.toLowerCase().trim(),
      password: data.password || 'Password123!',
      first_name: data.first_name || data.username,
      last_name: data.last_name || '',
      phone: data.phone || '0719678760',
      whatsapp_number: data.phone || '+254719678760',
      headline: data.headline || 'Member at CheremoSphere',
      bio: data.bio || '',
      location: data.location || 'Nairobi, Kenya',
      company_name: data.company_name || '',
      website: data.website || '',
      avatar: null,
      skills: data.skills || [],
      cv_file: null,
      is_verified: true,
      is_job_seeker: !!data.is_job_seeker,
      is_employer: !!data.is_employer,
      is_recruiter: !!data.is_recruiter,
      is_freelancer: !!data.is_freelancer,
      is_business_owner: !!data.is_business_owner,
      is_seller: !!data.is_seller,
      is_customer: true,
      is_moderator: false,
      is_staff: false,
      active_roles: [
        data.is_job_seeker && 'Job Seeker',
        data.is_employer && 'Employer',
        data.is_freelancer && 'Freelancer',
        data.is_seller && 'Seller',
      ].filter(Boolean) as string[],
      token: `token_${data.username}_${Date.now()}`,
      created_at: new Date().toISOString(),
    };

    USERS.push(newUser);
    return res.status(201).json({
      token: newUser.token,
      user: newUser,
    });
  }

  // 3. POST /api/auth/logout
  if (path === 'auth/logout') {
    return res.status(200).json({ message: 'Logged out successfully' });
  }

  // 4. GET /api/profile
  if (path === 'profile') {
    if (!currentUser) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    return res.status(200).json(currentUser);
  }

  // 5. GET /api/company/profile
  if (path === 'company/profile') {
    return res.status(200).json(COMPANY_PROFILE);
  }

  // 6. GET /api/platform/stats
  if (path === 'platform/stats') {
    return res.status(200).json({
      total_users: USERS.length + 1540,
      active_jobs: JOBS.length + 42,
      job_applications: 184,
      job_requests: JOB_REQUESTS.length + 28,
      freelance_services: SERVICES.length + 65,
      marketplace_products: PRODUCTS.length + 112,
      registered_businesses: 48,
      community_posts: POSTS.length + 89,
    });
  }

  // 7. /api/jobs/vacancies
  if (path === 'jobs/vacancies') {
    if (req.method === 'POST') {
      const data = req.body || {};
      const newJob = {
        id: JOBS.length + 1,
        title: data.title || 'New Vacancy',
        slug: `job-${Date.now()}`,
        employer: currentUser || USERS[0],
        company_name: data.company_name || currentUser?.company_name || 'Hiring Company',
        company_logo: null,
        category: data.category || 1,
        category_name: 'Software & Technology',
        location: data.location || 'Nairobi, Kenya',
        employment_type: data.employment_type || 'full_time',
        experience_level: data.experience_level || '1-3 Years',
        qualifications: data.qualifications || '',
        description: data.description || '',
        salary_min: data.salary_min || null,
        salary_max: data.salary_max || null,
        is_salary_negotiable: !!data.is_salary_negotiable,
        currency: 'KES',
        deadline: data.deadline || null,
        status: 'active',
        is_featured: false,
        views_count: 1,
        applications_count: 0,
        is_saved: false,
        created_at: new Date().toISOString(),
      };
      JOBS.unshift(newJob);
      return res.status(201).json(newJob);
    }
    return res.status(200).json(JOBS);
  }

  // 8. /api/jobs/applications/apply
  if (path === 'jobs/applications/apply' && req.method === 'POST') {
    return res.status(201).json({ message: 'Application submitted successfully', status: 'submitted' });
  }

  // 9. /api/job-seeking/requests
  if (path === 'job-seeking/requests') {
    if (req.method === 'POST') {
      const data = req.body || {};
      const newRequest = {
        id: JOB_REQUESTS.length + 1,
        user: currentUser || USERS[0],
        job_sought: data.job_sought || data.title || 'Professional Role',
        category: data.category || 'Professional Services',
        personal_introduction: data.personal_introduction || '',
        skills: data.skills || '',
        experience_summary: data.experience_summary || '',
        qualifications: data.qualifications || '',
        preferred_location: data.preferred_location || 'Nairobi',
        employment_type: data.employment_type || 'Full-time',
        availability: data.availability || 'Immediate',
        expected_salary: data.expected_salary || 'Negotiable',
        portfolio_url: data.portfolio_url || '',
        cv_file: null,
        is_fulfilled: false,
        views_count: 1,
        created_at: new Date().toISOString(),
      };
      JOB_REQUESTS.unshift(newRequest);
      return res.status(201).json(newRequest);
    }
    return res.status(200).json(JOB_REQUESTS);
  }

  // 10. /api/freelance/services
  if (path === 'freelance/services') {
    if (req.method === 'POST') {
      const data = req.body || {};
      const newService = {
        id: SERVICES.length + 1,
        provider: currentUser || USERS[0],
        title: data.title || 'New Service',
        slug: `service-${Date.now()}`,
        category: data.category || 1,
        category_name: 'Professional Services',
        description: data.description || '',
        pricing_type: data.pricing_type || 'fixed',
        starting_price: String(data.starting_price || '5000'),
        currency: 'KES',
        delivery_time_days: data.delivery_time_days || 3,
        revisions_allowed: 2,
        location: data.location || 'Nairobi',
        is_remote: true,
        rating: '5.0',
        reviews_count: 0,
        created_at: new Date().toISOString(),
      };
      SERVICES.unshift(newService);
      return res.status(201).json(newService);
    }
    return res.status(200).json(SERVICES);
  }

  // 11. /api/marketplace/products
  if (path === 'marketplace/products') {
    if (req.method === 'POST') {
      const data = req.body || {};
      const newProduct = {
        id: PRODUCTS.length + 1,
        seller: currentUser || USERS[0],
        title: data.title || 'New Product',
        slug: `product-${Date.now()}`,
        category: data.category || 1,
        category_name: 'Marketplace',
        description: data.description || '',
        price: String(data.price || '1000'),
        currency: 'KES',
        condition: data.condition || 'brand_new',
        stock_quantity: data.stock_quantity || 1,
        location: data.location || 'Nairobi',
        status: 'active',
        is_promoted: false,
        views_count: 1,
        images: [{ id: 1, image: '/hero-placeholder.svg', is_cover: true }],
        created_at: new Date().toISOString(),
      };
      PRODUCTS.unshift(newProduct);
      return res.status(201).json(newProduct);
    }
    return res.status(200).json(PRODUCTS);
  }

  // 12. /api/network/feed
  if (path === 'network/feed') {
    if (req.method === 'POST') {
      const data = req.body || {};
      const newPost = {
        id: POSTS.length + 1,
        author: currentUser || USERS[0],
        content: data.content || '',
        post_type: data.post_type || 'update',
        image: null,
        likes_count: 0,
        comments_count: 0,
        comments: [],
        is_liked: false,
        created_at: new Date().toISOString(),
      };
      POSTS.unshift(newPost);
      return res.status(201).json(newPost);
    }
    return res.status(200).json(POSTS);
  }

  // 13. /api/chat/conversations
  if (path.startsWith('chat/conversations')) {
    return res.status(200).json([
      {
        id: 1,
        subject: 'General Inquiries',
        participants: [USERS[0], USERS[2]],
        latest_message: {
          id: 1,
          text: 'Hello, welcome to CheremoSphere! How can we support your career or business today?',
          sender: USERS[0],
          created_at: '2026-02-05T10:00:00Z',
          is_read: true,
        },
        unread_count: 0,
        created_at: '2026-02-01T00:00:00Z',
        updated_at: '2026-02-05T10:00:00Z',
      },
    ]);
  }

  // 14. /api/notifications
  if (path === 'notifications' || path.startsWith('notifications')) {
    return res.status(200).json([
      {
        id: 1,
        recipient: currentUser?.id || 1,
        sender: USERS[0],
        notification_type: 'system',
        title: 'Welcome to CheremoSphere',
        message: 'Your account is verified. Start finding jobs, posting availability, or marketing products.',
        action_url: '/dashboard',
        is_read: false,
        created_at: '2026-02-05T08:00:00Z',
      },
    ]);
  }

  // Default fallback
  return res.status(200).json({ status: 'ok', path });
}
