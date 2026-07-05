"""
Development-only overrides.
Activated via DJANGO_SETTINGS_MODULE=config.settings.development
"""

from .base import *  # noqa

DEBUG = True

ALLOWED_HOSTS = ['localhost', '127.0.0.1']