from rest_framework import serializers
from .models import CompanyProfile, ModerationReport


class CompanyProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyProfile
        fields = '__all__'


class ModerationReportSerializer(serializers.ModelSerializer):
    reporter_username = serializers.ReadOnlyField(source='reporter.username')

    class Meta:
        model = ModerationReport
        fields = [
            'id', 'reporter', 'reporter_username', 'report_type', 'target_id',
            'reason', 'details', 'status', 'moderator_notes', 'created_at', 'resolved_at'
        ]
        read_only_fields = ['id', 'reporter', 'created_at', 'resolved_at']
