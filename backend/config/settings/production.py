"""
Production-only overrides.
Activated via DJANGO_SETTINGS_MODULE=config.settings.production
"""

from .base import *  # noqa

DEBUG = False

ALLOWED_HOSTS = env.list('ALLOWED_HOSTS', default=[])

# Using SQLite in production since PythonAnywhere's free tier
# no longer includes MySQL/Postgres. Local development still
# uses MySQL (see development.py) — the ORM abstraction means
# zero model/view/serializer code changes were needed for this.
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}



# Force HTTPS in production
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True