"""
WSGI config for the project.

WSGI is what synchronous production servers (gunicorn, uWSGI) use
to talk to Django. Express equivalent: this is roughly your
`app.listen()` entrypoint, except the actual server (gunicorn)
lives outside this file and just imports `application` from here.
"""

import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')

application = get_wsgi_application()