from django.contrib.auth import authenticate
from rest_framework import serializers
from .models import User


class RegisterSerializer(serializers.ModelSerializer):
    """
    Handles validation + creation of a new User during registration.
    Matches the Figma design's password rules: 8+ chars, uppercase,
    lowercase, number/special character.
    """

    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ('full_name', 'email', 'password', 'confirm_password')

    def validate_email(self, value):
        value = value.lower().strip()
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('A user with this email already exists.')
        return value

    def validate_password(self, value):
        has_upper = any(c.isupper() for c in value)
        has_lower = any(c.islower() for c in value)
        has_number_or_special = any(not c.isalnum() or c.isdigit() for c in value)

        if not has_upper:
            raise serializers.ValidationError('Password must contain at least one uppercase letter.')
        if not has_lower:
            raise serializers.ValidationError('Password must contain at least one lowercase letter.')
        if not has_number_or_special:
            raise serializers.ValidationError('Password must contain at least one number or special character.')

        return value

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({'confirm_password': 'Passwords do not match.'})
        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = User.objects.create_user(
            email=validated_data['email'],
            full_name=validated_data['full_name'],
            password=validated_data['password'],
        )
        return user


class LoginSerializer(serializers.Serializer):
    """
    Validates email/password credentials for login.
    Does NOT touch the database directly for user creation —
    only authenticates. Token generation happens in the view.
    """

    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get('email', '').lower().strip()
        password = attrs.get('password')

        user = authenticate(email=email, password=password)

        if not user:
            raise serializers.ValidationError('Invalid email or password.')
        if not user.is_active:
            raise serializers.ValidationError('This account has been deactivated.')

        attrs['user'] = user
        return attrs


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Read-only representation of a User for the /profile/ endpoint.
    """

    class Meta:
        model = User
        fields = ('id', 'email', 'full_name', 'is_active', 'created_at')
        read_only_fields = fields