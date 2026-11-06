# CheremoSphere

> **Your skills. Your opportunities. All in one place.**  
> *Jobs. Connect. Market. Grow.*

CheremoSphere is an all-in-one digital ecosystem connecting job seekers, employers, recruiters, freelancers, professional service providers, business owners, product sellers, and customers.

---

## Official Company Information

- **Company:** CheremoSphere
- **Project Owner:** Japhet Cheremo
- **WhatsApp / Phone:** `0719678760`
- **International WhatsApp:** `+254719678760`
- **Official Email:** `japhetcheremo@gmai.com`
- **Physical Office:** Cheremo Plaza, Nairobi Mombasa Road, Kenya
- **Facebook:** [https://www.facebook.com/profile.php?id=61564247063691](https://www.facebook.com/profile.php?id=61564247063691)
- **GitHub:** [https://github.com/japhetcheremo-cloud](https://github.com/japhetcheremo-cloud)

---

## Platform Architecture

```
cheremosphere/
├── assets/                  # Official SVGs & vector brand tokens
│   ├── branding/            # Logo horizontal, dark mode, symbol mark, app icon, tokens
│   └── hero/                # Hero visual assets and specifications
├── backend/                 # Django 6.0 REST & Channels Backend
│   ├── apps/
│   │   ├── accounts/        # Custom multi-role User model & Token Auth
│   │   ├── company/         # Official company profile, moderation, analytics
│   │   ├── jobs/            # Vacancies, categories, application pipeline
│   │   ├── job_requests/    # "Ask for a Job" reverse recruitment section
│   │   ├── services/        # Freelance and professional service listings
│   │   ├── marketplace/     # Products, categories, verified business profiles
│   │   ├── networking/      # Social timeline feed, posts, likes, reactions
│   │   ├── chat/            # Real-time WebSocket messaging & REST inbox
│   │   └── notifications/   # Multi-event notifications system
│   └── seed_data.py         # Automated database population script
├── frontend/                # Next.js 16.4.3 Web Application (TypeScript & Tailwind)
│   ├── src/pages/           # 25 production pages covering all ecosystem modules
│   ├── src/components/      # Responsive Navbar, Footer, MobileNav, CreateModal
│   └── src/lib/api.ts       # Typed REST API client
└── mobile/                  # Expo SDK 52 / React Native Mobile Application
    ├── assets/              # App icon, splash screen, adaptive icons
    ├── src/config/tokens.ts # Brand palette (#0D2A5C navy, #FF7A00 orange)
    ├── src/screens/         # Home, Jobs, Ask-for-a-Job, Market, Freelance, Feed, Dashboard
    └── App.tsx              # Universal mobile tab navigation (iOS & Android)
```

---

## Main Modules

1. **Jobs & Recruitment:** Employers post vacancies with salary in KES; job seekers search, filter, and track applications through 7 status stages.
2. **"Ask for a Job":** A dedicated reverse job-seeking section where candidates broadcast their skills, experience, and availability for employers to contact directly.
3. **Freelance & Services:** Service providers advertise skills with fixed/hourly rates, turnaround time, and direct WhatsApp contact.
4. **Marketplace & Business Marketing:** Sellers publish products with condition tags, stock counts, and verified business profiles.
5. **Professional Networking:** Community feed with thought leadership, opportunities, achievements, likes, and comments.
6. **Unified Chat:** Real-time communication between employers, job seekers, buyers, and sellers.
7. **Multi-Role Dashboard:** One account enables seamless switching between Job Seeker, Employer, Freelancer, and Seller.

---

## Getting Started

### 1. Backend Setup (Django)

```bash
cd backend
python -m venv venv
venv\Scripts\activate       # On Linux/macOS: source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python seed_data.py
python manage.py runserver 0.0.0.0:8000
```

### 2. Frontend Setup (Next.js)

```bash
cd frontend
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### 3. Mobile Setup (Expo / React Native)

```bash
cd mobile
npm install
npx expo start
```

---

## Demo Accounts

| Role | Username | Password |
|---|---|---|
| **Administrator** | `admin` | `AdminPassword2026!` |
| **Employer** | `safari_tech` | `Password123!` |
| **Freelancer / Job Seeker** | `kevin_dev` | `Password123!` |
| **Seller** | `mama_mboga_direct` | `Password123!` |

---

## License

© 2026 Japhet Cheremo. CheremoSphere. All rights reserved.
