from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q
from .models import JobCategory, JobVacancy, JobApplication, SavedJob
from .serializers import (
    JobCategorySerializer, JobVacancySerializer, JobVacancyCreateSerializer,
    JobApplicationSerializer, SavedJobSerializer
)
from notifications.models import Notification


class JobCategoryListView(generics.ListAPIView):
    queryset = JobCategory.objects.all()
    serializer_class = JobCategorySerializer
    permission_classes = [permissions.AllowAny]


class JobVacancyListView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return JobVacancyCreateSerializer
        return JobVacancySerializer

    def get_queryset(self):
        queryset = JobVacancy.objects.filter(status='active').select_related('employer', 'category')
        search = self.request.query_params.get('search', '').strip()
        location = self.request.query_params.get('location', '').strip()
        category_id = self.request.query_params.get('category', '').strip()
        employment_type = self.request.query_params.get('type', '').strip()
        min_salary = self.request.query_params.get('min_salary', '').strip()

        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(company_name__icontains=search) |
                Q(description__icontains=search) |
                Q(qualifications__icontains=search)
            )
        if location:
            queryset = queryset.filter(location__icontains=location)
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        if employment_type:
            queryset = queryset.filter(employment_type=employment_type)
        if min_salary and min_salary.isdigit():
            queryset = queryset.filter(salary_max__gte=int(min_salary))

        return queryset

    def perform_create(self, serializer):
        user = self.request.user
        if not user.is_employer:
            user.is_employer = True
            user.save()
        serializer.save(employer=user)


class JobVacancyDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = JobVacancy.objects.all()
    serializer_class = JobVacancySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.views_count += 1
        instance.save(update_fields=['views_count'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def perform_update(self, serializer):
        if self.request.user != self.get_object().employer and not self.request.user.is_staff:
            raise permissions.PermissionDenied("You can only edit your own posted vacancies.")
        serializer.save()

    def perform_destroy(self, instance):
        if self.request.user != instance.employer and not self.request.user.is_staff:
            raise permissions.PermissionDenied("You can only delete your own posted vacancies.")
        instance.delete()


class EmployerJobVacanciesView(generics.ListAPIView):
    serializer_class = JobVacancySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return JobVacancy.objects.filter(employer=self.request.user).order_by('-created_at')


class JobApplicationCreateView(generics.CreateAPIView):
    serializer_class = JobApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        vacancy = serializer.validated_data['vacancy']
        user = self.request.user
        if not user.is_job_seeker:
            user.is_job_seeker = True
            user.save()

        application = serializer.save(applicant=user)

        # Notify the employer
        Notification.objects.create(
            recipient=vacancy.employer,
            sender=user,
            notification_type='job_application',
            title=f'New Application: {vacancy.title}',
            message=f'{user.get_full_name() or user.username} applied for {vacancy.title}.',
            action_url=f'/dashboard/employer/applications/{application.id}'
        )


class MyApplicationsView(generics.ListAPIView):
    serializer_class = JobApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return JobApplication.objects.filter(applicant=self.request.user).select_related('vacancy')


class VacancyApplicantsListView(generics.ListAPIView):
    serializer_class = JobApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        vacancy_id = self.kwargs.get('vacancy_id')
        return JobApplication.objects.filter(
            vacancy_id=vacancy_id,
            vacancy__employer=self.request.user
        ).select_related('applicant', 'vacancy')


class ApplicationStatusUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        try:
            application = JobApplication.objects.get(pk=pk)
        except JobApplication.DoesNotExist:
            return Response({'error': 'Application not found'}, status=status.HTTP_404_NOT_FOUND)

        if application.vacancy.employer != request.user and not request.user.is_staff:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)

        new_status = request.data.get('status')
        if new_status not in [c[0] for c in JobApplication.STATUS_CHOICES]:
            return Response({'error': f'Invalid status: {new_status}'}, status=status.HTTP_400_BAD_REQUEST)

        application.status = new_status
        application.employer_notes = request.data.get('employer_notes', application.employer_notes)
        application.save()

        # Send notification to applicant
        Notification.objects.create(
            recipient=application.applicant,
            sender=request.user,
            notification_type='application_status',
            title=f'Application Status: {application.vacancy.title}',
            message=f'Your application for {application.vacancy.title} is now: {application.get_status_display()}.',
            action_url=f'/jobs/{application.vacancy.id}'
        )

        return Response(JobApplicationSerializer(application).data)


class SaveJobToggleView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, vacancy_id):
        try:
            vacancy = JobVacancy.objects.get(id=vacancy_id)
        except JobVacancy.DoesNotExist:
            return Response({'error': 'Job not found'}, status=status.HTTP_404_NOT_FOUND)

        saved = SavedJob.objects.filter(user=request.user, vacancy=vacancy)
        if saved.exists():
            saved.delete()
            return Response({'is_saved': False, 'message': 'Job removed from saved list.'})
        else:
            SavedJob.objects.create(user=request.user, vacancy=vacancy)
            return Response({'is_saved': True, 'message': 'Job saved successfully.'})


class SavedJobsListView(generics.ListAPIView):
    serializer_class = SavedJobSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SavedJob.objects.filter(user=self.request.user).select_related('vacancy')
