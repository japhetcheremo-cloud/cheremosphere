from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q
from .models import CompanyProfile, ModerationReport
from .serializers import CompanyProfileSerializer, ModerationReportSerializer

# Models for live stats & universal search
from accounts.models import User
from jobs.models import JobVacancy, JobApplication
from job_requests.models import JobRequest
from services.models import FreelanceService
from marketplace.models import ProductListing, BusinessProfile
from networking.models import NetworkPost


class CompanyProfileView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        profile = CompanyProfile.objects.first()
        if not profile:
            profile = CompanyProfile.objects.create(
                company_name='CheremoSphere',
                owner_name='Japhet Cheremo',
                tagline='Your skills. Your opportunities. All in one place.',
                brand_slogan='Jobs. Connect. Market. Grow.',
                phone_number='0719678760',
                international_whatsapp='+254719678760',
                official_email='japhetcheremo@gmai.com',
                physical_office='Cheremo Plaza, Nairobi Mombasa Road, Kenya.',
                facebook_url='https://www.facebook.com/profile.php?id=61564247063691',
                github_username='japhetcheremo-cloud',
                github_profile_url='https://github.com/japhetcheremo-cloud',
                twitter_x_url='',
            )
        serializer = CompanyProfileSerializer(profile)
        return Response(serializer.data)

    def put(self, request):
        if not request.user.is_authenticated or not request.user.is_staff:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
        profile = CompanyProfile.objects.first()
        serializer = CompanyProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PlatformStatsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response({
            'total_users': User.objects.count(),
            'active_jobs': JobVacancy.objects.filter(status='active').count(),
            'job_applications': JobApplication.objects.count(),
            'job_requests': JobRequest.objects.filter(is_active=True).count(),
            'freelance_services': FreelanceService.objects.filter(is_active=True).count(),
            'marketplace_products': ProductListing.objects.filter(status='active').count(),
            'registered_businesses': BusinessProfile.objects.count(),
            'community_posts': NetworkPost.objects.count(),
        })


class UniversalSearchView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        q = request.query_params.get('q', '').strip()
        category = request.query_params.get('category', 'all').lower()

        results = {
            'query': q,
            'jobs': [],
            'people': [],
            'products': [],
            'businesses': [],
            'services': []
        }

        if not q:
            return Response(results)

        if category in ['all', 'jobs']:
            jobs = JobVacancy.objects.filter(
                Q(title__icontains=q) | Q(company_name__icontains=q) | Q(description__icontains=q),
                status='active'
            )[:6]
            results['jobs'] = [{'id': j.id, 'title': j.title, 'company': j.company_name, 'location': j.location, 'type': j.employment_type} for j in jobs]

        if category in ['all', 'people']:
            people = User.objects.filter(
                Q(username__icontains=q) | Q(first_name__icontains=q) | Q(last_name__icontains=q) | Q(headline__icontains=q)
            )[:6]
            results['people'] = [{'id': u.id, 'name': u.get_full_name() or u.username, 'headline': u.headline, 'location': u.location} for u in people]

        if category in ['all', 'products']:
            products = ProductListing.objects.filter(
                Q(title__icontains=q) | Q(description__icontains=q),
                status='active'
            )[:6]
            results['products'] = [{'id': p.id, 'title': p.title, 'price': str(p.price), 'currency': p.currency, 'location': p.location} for p in products]

        if category in ['all', 'businesses']:
            businesses = BusinessProfile.objects.filter(
                Q(business_name__icontains=q) | Q(description__icontains=q)
            )[:6]
            results['businesses'] = [{'id': b.id, 'name': b.business_name, 'category': b.category, 'location': b.physical_location} for b in businesses]

        if category in ['all', 'services']:
            services = FreelanceService.objects.filter(
                Q(title__icontains=q) | Q(description__icontains=q) | Q(skills__icontains=q),
                is_active=True
            )[:6]
            results['services'] = [{'id': s.id, 'title': s.title, 'provider': s.provider.get_full_name() or s.provider.username, 'price': str(s.price) if s.price else 'Quote', 'pricing_type': s.pricing_type} for s in services]

        return Response(results)


class ModerationReportCreateView(generics.CreateAPIView):
    serializer_class = ModerationReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(reporter=self.request.user)


class ModerationReportListView(generics.ListAPIView):
    serializer_class = ModerationReportSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = ModerationReport.objects.all().order_by('-created_at')
