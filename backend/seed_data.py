"""
CheremoSphere Database Seeder.
Initializes official company information, admin superuser,
categories, and realistic sample data for testing all modules.
"""

import os
import sys
import django
from decimal import Decimal
from datetime import date, timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cheremosphere_backend.settings')
django.setup()

from accounts.models import User
from company.models import CompanyProfile
from jobs.models import JobCategory, JobVacancy, JobApplication
from job_requests.models import JobRequest
from services.models import ServiceCategory, FreelanceService
from marketplace.models import ProductCategory, ProductListing, BusinessProfile
from networking.models import NetworkPost, PostComment


def seed():
    print("[*] Initializing CheremoSphere Database Seeding...")

    # 1. Company Profile
    company, created = CompanyProfile.objects.get_or_create(
        id=1,
        defaults={
            'company_name': 'CheremoSphere',
            'owner_name': 'Japhet Cheremo',
            'tagline': 'Your skills. Your opportunities. All in one place.',
            'brand_slogan': 'Jobs. Connect. Market. Grow.',
            'phone_number': '0719678760',
            'international_whatsapp': '+254719678760',
            'official_email': 'japhetcheremo@gmai.com',
            'physical_office': 'Cheremo Plaza, Nairobi Mombasa Road, Kenya.',
            'facebook_url': 'https://www.facebook.com/profile.php?id=61564247063691',
            'github_username': 'japhetcheremo-cloud',
            'github_profile_url': 'https://github.com/japhetcheremo-cloud',
            'twitter_x_url': '',
        }
    )
    print(f"[+] Company Profile initialized: {company.company_name} ({company.owner_name})")

    # 2. Superuser / Admin
    admin_user, created = User.objects.get_or_create(
        username='admin',
        defaults={
            'email': 'japhetcheremo@gmai.com',
            'first_name': 'Japhet',
            'last_name': 'Cheremo',
            'is_staff': True,
            'is_superuser': True,
            'is_verified': True,
            'phone': '0719678760',
            'whatsapp_number': '+254719678760',
            'headline': 'Founder & Lead Administrator at CheremoSphere',
            'bio': 'Passionate about connecting talent and business ecosystems across Kenya and Africa.',
            'location': 'Nairobi, Kenya',
        }
    )
    if created:
        admin_user.set_password('AdminPassword2026!')
        admin_user.save()
        print("[+] Superuser 'admin' created with password: AdminPassword2026!")

    # 3. Demo Users
    employer_user, _ = User.objects.get_or_create(
        username='safari_tech',
        defaults={
            'email': 'recruiting@safaritech.co.ke',
            'first_name': 'Safari',
            'last_name': 'Ventures',
            'company_name': 'Safari Tech Hub',
            'is_employer': True,
            'is_verified': True,
            'headline': 'Hiring top tech talent across East Africa',
            'location': 'Westlands, Nairobi',
            'phone': '0712345678',
        }
    )
    if _:
        employer_user.set_password('Password123!')
        employer_user.save()

    freelancer_user, _ = User.objects.get_or_create(
        username='kevin_dev',
        defaults={
            'email': 'kevin@cheremosphere.com',
            'first_name': 'Kevin',
            'last_name': 'Mwangi',
            'is_freelancer': True,
            'is_job_seeker': True,
            'is_verified': True,
            'headline': 'Full-stack React & Django Engineer',
            'bio': 'Over 5 years building scalable web and mobile applications.',
            'skills': ['React', 'Next.js', 'Django', 'TypeScript', 'PostgreSQL'],
            'location': 'Nairobi, Kenya',
            'phone': '0722334455',
            'whatsapp_number': '+254722334455',
        }
    )
    if _:
        freelancer_user.set_password('Password123!')
        freelancer_user.save()

    seller_user, _ = User.objects.get_or_create(
        username='mama_mboga_direct',
        defaults={
            'email': 'seller@cheremosphere.com',
            'first_name': 'Grace',
            'last_name': 'Wanjiku',
            'company_name': 'Green Highlands Agribusiness',
            'is_seller': True,
            'is_business_owner': True,
            'is_verified': True,
            'headline': 'Wholesale & Retail Organic Produce & Agro-inputs',
            'location': 'Kiambu & Nairobi, Kenya',
            'phone': '0733445566',
        }
    )
    if _:
        seller_user.set_password('Password123!')
        seller_user.save()

    # 4. Job Categories
    job_categories = [
        ('Software & Technology', 'laptop', 'Software engineering, web, cloud & AI'),
        ('Accounting & Finance', 'calculator', 'Bookkeeping, audit, financial analysis'),
        ('Sales & Marketing', 'trending-up', 'Digital marketing, sales, brand growth'),
        ('Logistics & Transport', 'truck', 'Driving, dispatch, supply chain'),
        ('Healthcare & Medical', 'activity', 'Nursing, medicine, pharmacy'),
        ('Education & Teaching', 'book-open', 'Tutoring, lecturing, school administration'),
        ('Hospitality & Tourism', 'coffee', 'Hotels, catering, tour operations'),
        ('Engineering & Construction', 'hard-hat', 'Civil, electrical, mechanical'),
    ]
    job_cat_objs = {}
    for name, icon, desc in job_categories:
        obj, _ = JobCategory.objects.get_or_create(name=name, defaults={'icon': icon, 'description': desc})
        job_cat_objs[name] = obj
    print(f"[+] {len(job_cat_objs)} Job Categories ready.")

    # 5. Product Categories
    prod_categories = [
        ('Electronics', 'cpu', 'Audio, television, cameras, and gear'),
        ('Phones & Computers', 'smartphone', 'Laptops, tablets, smartphones & accessories'),
        ('Fashion & Clothing', 'watch', 'Men and women apparel, suits, casual'),
        ('Shoes & Accessories', 'shopping-bag', 'Shoes, bags, belts, watches'),
        ('Home & Furniture', 'home', 'Living room, kitchen, bedroom furniture'),
        ('Agriculture & Food', 'feather', 'Farm fresh produce, seeds, agribusiness goods'),
        ('Beauty & Personal Care', 'smile', 'Skincare, haircare, cosmetics'),
        ('Vehicles & Accessories', 'truck', 'Cars, motorbikes, spare parts'),
        ('Business & Digital Services', 'briefcase', 'Software licenses, legal, consultancy'),
        ('Education & Books', 'book', 'School books, novels, exam revision'),
    ]
    prod_cat_objs = {}
    for name, icon, desc in prod_categories:
        obj, _ = ProductCategory.objects.get_or_create(name=name, defaults={'icon': icon, 'description': desc})
        prod_cat_objs[name] = obj
    print(f"[+] {len(prod_cat_objs)} Product Categories ready.")

    # 6. Service Categories
    srv_categories = [
        ('Web & App Development', 'code'),
        ('Graphic Design & Branding', 'pen-tool'),
        ('Programming & Scripts', 'terminal'),
        ('Writing & Translation', 'file-text'),
        ('Photography & Video Editing', 'camera'),
        ('Digital Marketing & SEO', 'globe'),
        ('Plumbing & Electrical', 'tool'),
        ('Repairs & Maintenance', 'wrench'),
        ('Business Consultancy', 'briefcase'),
        ('Tutoring & Lessons', 'book-open'),
    ]
    srv_cat_objs = {}
    for name, icon in srv_categories:
        obj, _ = ServiceCategory.objects.get_or_create(name=name, defaults={'icon': icon})
        srv_cat_objs[name] = obj
    print(f"[+] {len(srv_cat_objs)} Service Categories ready.")

    # 7. Sample Job Vacancies
    j1, _ = JobVacancy.objects.get_or_create(
        title='Senior Full-Stack Django/React Engineer',
        employer=employer_user,
        defaults={
            'company_name': 'Safari Tech Hub',
            'category': job_cat_objs['Software & Technology'],
            'location': 'Nairobi, Kenya (Hybrid)',
            'employment_type': 'full_time',
            'experience_level': '3-5 Years',
            'qualifications': 'BSc in Computer Science or equivalent. Strong proficiency with Python, Django, REST Framework, React, and PostgreSQL.',
            'description': 'We are looking for an experienced Senior Full-Stack Engineer to lead development of high-impact fintech and e-commerce platforms.',
            'salary_min': Decimal('150000'),
            'salary_max': Decimal('250000'),
            'is_salary_negotiable': True,
            'currency': 'KES',
            'deadline': date.today() + timedelta(days=30),
            'status': 'active',
            'is_featured': True,
        }
    )

    j2, _ = JobVacancy.objects.get_or_create(
        title='Finance Officer & Accountant',
        employer=employer_user,
        defaults={
            'company_name': 'Safari Tech Hub',
            'category': job_cat_objs['Accounting & Finance'],
            'location': 'Mombasa Road, Nairobi',
            'employment_type': 'full_time',
            'experience_level': '2-4 Years',
            'qualifications': 'CPA-K / ACCA qualified. Experience in QuickBooks, KRA iTax, payroll management.',
            'description': 'Responsible for daily bookkeeping, monthly financial reporting, tax compliance, and payroll management.',
            'salary_min': Decimal('75000'),
            'salary_max': Decimal('110000'),
            'is_salary_negotiable': True,
            'currency': 'KES',
            'deadline': date.today() + timedelta(days=21),
            'status': 'active',
            'is_featured': True,
        }
    )

    j3, _ = JobVacancy.objects.get_or_create(
        title='Commercial Driver (Class BCE)',
        employer=employer_user,
        defaults={
            'company_name': 'Safari Logistics East Africa',
            'category': job_cat_objs['Logistics & Transport'],
            'location': 'Bungoma & Western Region, Kenya',
            'employment_type': 'contract',
            'experience_level': '3+ Years',
            'qualifications': 'Valid Driving License (Class BCE), clean driving record, defensive driving certification.',
            'description': 'Safe transport of goods and supplies between regional distribution hubs.',
            'salary_min': Decimal('45000'),
            'salary_max': Decimal('60000'),
            'is_salary_negotiable': False,
            'currency': 'KES',
            'deadline': date.today() + timedelta(days=14),
            'status': 'active',
        }
    )
    print("[+] Sample Job Vacancies seeded.")

    # 8. Sample "Ask for a Job" Requests (Reverse Job-Seeking)
    jr1, _ = JobRequest.objects.get_or_create(
        job_sought='Senior Accountant & Bookkeeper seeking Employment in Nairobi',
        user=freelancer_user,
        defaults={
            'category': 'Accounting & Finance',
            'personal_introduction': 'CPA-K holder with 5+ years handling balance sheets, auditing, and tax compliance for growing SMEs.',
            'skills': 'QuickBooks, Sage, KRA iTax, Financial Auditing, Financial Reporting',
            'experience_summary': 'Formerly Assistant Auditor at Horizon Consulting. Available for full-time or contract roles.',
            'qualifications': 'B.Com Accounting, CPA Part 3',
            'preferred_location': 'Nairobi or Remote',
            'employment_type': 'full_time',
            'availability': 'immediately',
            'expected_salary': 'KES 70,000 - 90,000 / month',
            'is_fulfilled': False,
        }
    )

    jr2, _ = JobRequest.objects.get_or_create(
        job_sought='Professional Driver Available for Long-Distance or Corporate Logistics',
        user=admin_user,
        defaults={
            'category': 'Logistics & Transport',
            'personal_introduction': 'Disciplined, certified driver with 8 years accident-free record in Nairobi and Western Kenya corridors.',
            'skills': 'Defensive driving, vehicle maintenance, GPS navigation, cargo logistics',
            'experience_summary': '5 years commercial fleet driver, 3 years executive transport.',
            'qualifications': 'BCE Driving License, NTSA Certified',
            'preferred_location': 'Bungoma, Eldoret or Nairobi',
            'employment_type': 'contract',
            'availability': 'immediately',
            'expected_salary': 'KES 45,000',
            'is_fulfilled': False,
        }
    )
    print("[+] Sample 'Ask for a Job' Requests seeded.")

    # 9. Sample Freelance Services
    s1, _ = FreelanceService.objects.get_or_create(
        title='Custom Web & Mobile App Development with Next.js & Django',
        provider=freelancer_user,
        defaults={
            'category': srv_cat_objs['Web & App Development'],
            'description': 'I develop responsive, ultra-fast web platforms and mobile apps with clean code, secure APIs, and responsive UI.',
            'skills': 'Next.js, React Native, Django, REST APIs, Tailwind CSS',
            'pricing_type': 'starting_at',
            'price': Decimal('40000'),
            'currency': 'KES',
            'location': 'Nairobi, Kenya',
            'availability': 'Available for New Projects',
            'rating': Decimal('5.0'),
            'reviews_count': 12,
            'is_featured': True,
        }
    )
    print("[+] Sample Freelance Services seeded.")

    # 10. Sample Business Profile & Marketplace Products
    biz, _ = BusinessProfile.objects.get_or_create(
        business_name='Cheremo Digital & Agro Mart',
        owner=seller_user,
        defaults={
            'tagline': 'Certified Quality Tech and High-Yield Agro Goods',
            'description': 'Direct distribution of certified electronics and high-quality agribusiness goods serving retail and bulk clients.',
            'category': 'Retail & Distribution',
            'phone': '0719678760',
            'whatsapp': '+254719678760',
            'email': 'japhetcheremo@gmai.com',
            'physical_location': 'Cheremo Plaza, Nairobi Mombasa Road, Kenya.',
            'is_verified': True,
            'is_featured': True,
        }
    )

    p1, _ = ProductListing.objects.get_or_create(
        title='Dell Latitude 7490 Core i7 (16GB RAM, 512GB SSD)',
        seller=seller_user,
        defaults={
            'business': biz,
            'category': prod_cat_objs['Phones & Computers'],
            'description': 'Excellent condition business laptop. Intel Core i7, 16GB DDR4 RAM, 512GB NVMe SSD, backlit keyboard, 6hr battery.',
            'price': Decimal('46500'),
            'currency': 'KES',
            'location': 'Nairobi CBD & Delivery Countrywide',
            'condition': 'like_new',
            'stock_quantity': 5,
            'status': 'active',
            'is_promoted': True,
        }
    )

    p2, _ = ProductListing.objects.get_or_create(
        title='Grade A Hass Avocado (Bulk & Export Packaging)',
        seller=seller_user,
        defaults={
            'business': biz,
            'category': prod_cat_objs['Agriculture & Food'],
            'description': 'Freshly harvested organically grown Hass Avocados from Central Highlands. High oil content, export grade.',
            'price': Decimal('120'),
            'currency': 'KES',
            'location': 'Kiambu & Nairobi delivery',
            'condition': 'brand_new',
            'stock_quantity': 500,
            'status': 'active',
        }
    )
    print("[+] Sample Marketplace Products seeded.")

    # 11. Sample Professional Network Post
    post, _ = NetworkPost.objects.get_or_create(
        author=admin_user,
        content="Excited to announce the official launch of CheremoSphere! A full digital ecosystem designed to connect job seekers, employers, freelancers, and businesses in Kenya and across Africa. Jobs. Connect. Market. Grow! 🚀🇰🇪",
        defaults={
            'post_type': 'business',
            'likes_count': 18,
            'comments_count': 1,
        }
    )
    if _:
        PostComment.objects.create(
            post=post,
            author=freelancer_user,
            content="Congratulations Japhet! A truly comprehensive ecosystem that Africa needs."
        )
    print("[+] Sample Network Posts seeded.")

    print("[***] Database Seeding Complete! CheremoSphere backend is ready.")


if __name__ == '__main__':
    seed()
