from rest_framework import serializers
from .models import JobCategory, JobVacancy, JobApplication, SavedJob
from accounts.serializers import UserSerializer


class JobCategorySerializer(serializers.ModelSerializer):
    jobs_count = serializers.IntegerField(source='jobs.count', read_only=True)

    class Meta:
        model = JobCategory
        fields = ['id', 'name', 'slug', 'icon', 'description', 'jobs_count']


class JobVacancySerializer(serializers.ModelSerializer):
    employer = UserSerializer(read_only=True)
    category_name = serializers.ReadOnlyField(source='category.name')
    applications_count = serializers.IntegerField(source='applications.count', read_only=True)
    is_saved = serializers.SerializerMethodField()

    class Meta:
        model = JobVacancy
        fields = [
            'id', 'title', 'slug', 'employer', 'company_name', 'company_logo',
            'category', 'category_name', 'location', 'employment_type',
            'experience_level', 'qualifications', 'description', 'salary_min',
            'salary_max', 'is_salary_negotiable', 'currency', 'deadline',
            'status', 'is_featured', 'views_count', 'applications_count',
            'is_saved', 'created_at', 'updated_at'
        ]

    def get_is_saved(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.saved_by_users.filter(user=request.user).exists()
        return False


class JobVacancyCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobVacancy
        fields = [
            'id', 'title', 'company_name', 'category', 'location',
            'employment_type', 'experience_level', 'qualifications',
            'description', 'salary_min', 'salary_max', 'is_salary_negotiable',
            'currency', 'deadline', 'status'
        ]


class JobApplicationSerializer(serializers.ModelSerializer):
    applicant = UserSerializer(read_only=True)
    vacancy_title = serializers.ReadOnlyField(source='vacancy.title')
    company_name = serializers.ReadOnlyField(source='vacancy.company_name')

    class Meta:
        model = JobApplication
        fields = [
            'id', 'vacancy', 'vacancy_title', 'company_name', 'applicant',
            'cover_letter', 'cv_file', 'status', 'employer_notes',
            'applied_at', 'updated_at'
        ]
        read_only_fields = ['id', 'applicant', 'applied_at', 'updated_at']


class SavedJobSerializer(serializers.ModelSerializer):
    vacancy = JobVacancySerializer(read_only=True)

    class Meta:
        model = SavedJob
        fields = ['id', 'vacancy', 'saved_at']
