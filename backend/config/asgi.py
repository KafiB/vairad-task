"""
ASGI config for the project.

ASGI is the async equivalent of WSGI — needed if you ever add
WebSockets or async views (e.g. real-time features, similar to
how you used Socket.IO with Express). Not required for this
assignment's REST endpoints, but Django generates it by default
and it costs nothing to keep correct.
"""

import os
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')

application = get_asgi_application()