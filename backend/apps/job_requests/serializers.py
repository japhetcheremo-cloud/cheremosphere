from rest_framework import serializers
from .models import JobRequest
from accounts.serializers import UserSerializer


class JobRequestSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = JobRequest
        fields = [
            'id', 'user', 'job_sought', 'category', 'personal_introduction',
            'skills', 'experience_summary', 'qualifications', 'preferred_location',
            'employment_type', 'availability', 'expected_salary', 'portfolio_url',
            'cv_file', 'is_fulfilled', 'is_active', 'views_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'views_count', 'created_at', 'updated_at']
