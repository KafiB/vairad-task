"""
Production-only overrides.
Activated via DJANGO_SETTINGS_MODULE=config.settings.production
"""

from .base import *  # noqa

DEBUG = False

ALLOWED_HOSTS = env.list('ALLOWED_HOSTS', default=[])

# Force HTTPS in production
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True