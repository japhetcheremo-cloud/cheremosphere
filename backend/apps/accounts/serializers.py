from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User


class UserSerializer(serializers.ModelSerializer):
    active_roles = serializers.ReadOnlyField()

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'phone', 'whatsapp_number', 'headline', 'bio', 'location',
            'company_name', 'website', 'avatar', 'skills', 'cv_file',
            'is_verified', 'is_job_seeker', 'is_employer', 'is_recruiter',
            'is_freelancer', 'is_business_owner', 'is_seller', 'is_customer',
            'is_moderator', 'is_staff', 'active_roles', 'created_at'
        ]
        read_only_fields = ['id', 'is_verified', 'is_staff', 'created_at']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'first_name', 'last_name',
            'phone', 'headline', 'location', 'is_job_seeker', 'is_employer',
            'is_recruiter', 'is_freelancer', 'is_business_owner', 'is_seller'
        ]

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')
        user = authenticate(username=username, password=password)
        if not user:
            raise serializers.ValidationError("Invalid username or password.")
        if not user.is_active:
            raise serializers.ValidationError("Account is deactivated.")
        data['user'] = user
        return data
