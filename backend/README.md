# TaskAnnotate Backend

A Django REST API backend for TaskAnnotate — a task management and image annotation platform built with Django, Django REST Framework, JWT authentication, and MySQL.

## Why this backend stands out

- Clean modular architecture with separate apps for `authentication`, `tasks`, and `annotation`
- JWT-based authentication and refresh token support with token blacklisting
- Custom user model using email as the primary identifier
- Task management with Kanban-friendly status, priority, due date filtering, and shared tag support
- Image upload and annotation management with polygon geometry support and file metadata tracking
- Nested API resources connecting images and annotations for a robust annotation workflow

## Tech stack

- Python 3.x
- Django 5.1.4
- Django REST Framework 3.15.2
- Simple JWT for authentication
- MySQL via `mysqlclient`
- Pillow for image metadata extraction
- django-filter for request filtering
- django-cors-headers for frontend integration

## Project structure

- `apps/authentication/` — JWT auth endpoints, custom user model, registration/login/profile/logout
- `apps/tasks/` — task CRUD, task tagging, filtering by status, priority, due date
- `apps/annotation/` — image upload, annotation polygons, image tag management, nested annotation routes
- `config/` — Django settings, URL routing, ASGI/WGI configuration
- `media/` — uploaded annotation images

## Live deployment

The backend is currently deployed and running on PythonAnywhere.

- API base URL: `https://kafiboss.pythonanywhere.com/api/`
- Admin panel: `https://kafiboss.pythonanywhere.com/admin/`
- Live health check: `https://kafiboss.pythonanywhere.com/`

### Deployment notes

- Deployed using PythonAnywhere with a dedicated virtual environment
- Production settings were adapted for free-tier hosting
- Resolved deployment issues related to Python environment wiring and dependency loading
- Successfully tested authentication and protected API endpoints against the live server

## API overview

### Authentication

- `POST /api/auth/register/` — register a new user
- `POST /api/auth/login/` — obtain access and refresh tokens
- `POST /api/auth/logout/` — blacklist refresh token
- `GET /api/auth/profile/` — get current user profile

### Tasks

- `GET /api/tasks/` — list tasks for authenticated user
- `POST /api/tasks/` — create a task
- `GET /api/tasks/<id>/` — retrieve a task
- `PUT/PATCH /api/tasks/<id>/` — update a task
- `DELETE /api/tasks/<id>/` — delete a task
- `GET /api/tasks/tags/` — list tags

Supports query filtering on:
- `status`
- `priority`
- `due_date`

### Annotation

- `GET /api/annotation/images/` — list authenticated user images
- `POST /api/annotation/images/` — upload a new image
- `GET /api/annotation/images/<id>/` — retrieve image details + annotations
- `DELETE /api/annotation/images/<id>/` — delete an image and its annotations
- `GET /api/annotation/tags/` — list shared image tags
- `GET /api/annotation/images/<image_id>/annotations/` — list polygons for an image
- `POST /api/annotation/images/<image_id>/annotations/` — add a polygon
- `PATCH /api/annotation/images/<image_id>/annotations/<id>/` — update a polygon
- `DELETE /api/annotation/images/<image_id>/annotations/<id>/` — delete a single polygon
- `POST /api/annotation/images/<image_id>/annotations/bulk-save/` — replace all annotations for an image atomically

## Setup instructions

1. Clone the repository and move into the backend folder:
   ```bash
   cd /path/to/vairad-task/backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Copy environment variables from `.env.example` and update values:
   ```bash
   cp .env.example .env
   ```

5. Configure database values in `.env`:
   - `DB_ENGINE`
   - `DB_NAME`
   - `DB_USER`
   - `DB_PASSWORD`
   - `DB_HOST`
   - `DB_PORT`

6. Run migrations:
   ```bash
   python manage.py migrate
   ```

7. Create a superuser (optional):
   ```bash
   python manage.py createsuperuser
   ```

8. Start the development server:
   ```bash
   python manage.py runserver
   ```

9. Access media files during development:
   - Media is served automatically when `DEBUG=True`

## Environment variables

The backend reads configuration from `.env` using `django-environ`.

Required values:
- `DJANGO_SECRET_KEY`
- `DJANGO_DEBUG`
- `DJANGO_ENV`
- `DB_ENGINE`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `DB_HOST`
- `DB_PORT`
- `CORS_ALLOWED_ORIGINS`

## Notable implementation details

- Custom `User` model with email-based login and user profile endpoints
- Task tags are normalized and created automatically from task payloads
- Image upload path is customized per user to keep media organized
- Uploaded image metadata is extracted automatically with Pillow
- Annotation status auto-updates when polygons are added or removed
- Nested DRF routers maintain clean REST principles for image-specific annotations

## How this project demonstrates my backend strengths

- Designed a scalable, maintainable Django project with clear app separation
- Built secure JWT authentication and logout handling with token blacklisting
- Implemented robust RESTful APIs for both task management and image annotation
- Used DRF serializers for complex nested validation and cross-model consistency
- Optimized user scope and security by filtering data per authenticated user
- Prepared backend to support a modern frontend application through CORS and media handling
- Solved real production deployment challenges, including environment configuration and hosting compatibility issues

## Future enhancements

- Add automated tests for authentication, tasks, and annotation endpoints
- Implement pagination and sorting for annotation results
- Add file size validation and image type restrictions during upload
- Support WebSocket updates for real-time annotation collaboration

---

Thank you for reviewing this backend. It is designed for a strong full-stack workflow and ready to support a production-quality annotation platform.
