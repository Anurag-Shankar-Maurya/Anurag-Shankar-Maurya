# Portfolio API Documentation

Django REST API for portfolio/CV management system with comprehensive endpoints for profile, projects, blog, and more.

## Installation

```bash
# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run development server
python manage.py runserver
```

## API Endpoints

Base URL: `http://localhost:8000/api/`

### Profile

- `GET /api/profiles/` - List all profiles
- `GET /api/profiles/{id}/` - Get profile details with related data
- `GET /api/profiles/{id}/resume/` - Download resume file

### Social Links & Skills

- `GET /api/social-links/` - List social links
- `GET /api/social-links/?profile={id}` - Filter by profile
- `GET /api/skills/` - List skills
- `GET /api/skills/?skill_type={type}` - Filter by skill type

### Education & Work Experience

- `GET /api/education/` - List education history
- `GET /api/education/{id}/` - Get education details
- `GET /api/work-experience/` - List work experience
- `GET /api/work-experience/{id}/` - Get work experience details
- `GET /api/work-experience/?is_current=true` - Filter current positions

### Projects

- `GET /api/projects/` - List all visible projects
- `GET /api/projects/{slug}/` - Get project by slug
- `GET /api/projects/featured/` - Get featured projects
- `GET /api/projects/?search={query}` - Search projects

### Certificates & Achievements

- `GET /api/certificates/` - List certificates
- `GET /api/certificates/{id}/` - Get certificate details
- `GET /api/achievements/` - List achievements
- `GET /api/achievements/{id}/` - Get achievement details

### Blog

- `GET /api/blog/` - List published blog posts (paginated)
- `GET /api/blog/{slug}/` - Get blog post by slug (increments view count)
- `GET /api/blog/featured/` - Get featured posts
- `GET /api/blog/category/{category_slug}/` - Filter by category
- `GET /api/blog/tag/{tag_slug}/` - Filter by tag
- `GET /api/blog/categories/` - List categories
- `GET /api/blog/tags/` - List tags

### Testimonials

- `GET /api/testimonials/` - List visible testimonials
- `GET /api/testimonials/{id}/` - Get testimonial details
- `GET /api/testimonials/featured/` - Get featured testimonials

### Contact

- `POST /api/contact/` - Submit contact form

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "subject": "Inquiry",
  "message": "Your message here"
}
```

### Images

- `GET /api/images/` - List all images
- `GET /api/images/{id}/` - Get image details
- `GET /api/images/?image_type={type}` - Filter by image type

## Query Parameters

### Filtering

- `?profile={id}` - Filter by profile
- `?status={status}` - Filter by status
- `?is_featured=true` - Show only featured items
- `?category={slug}` - Filter by category

### Search

- `?search={query}` - Search across relevant fields

### Ordering

- `?ordering=created_at` - Order by created date (ascending)
- `?ordering=-created_at` - Order by created date (descending)

### Pagination

- `?page={number}` - Page number
- `?page_size={number}` - Items per page (default: 10)

## Response Format

All list endpoints return paginated responses:

```json
{
  "count": 100,
  "next": "http://localhost:8000/api/blog/?page=2",
  "previous": null,
  "results": [...]
}
```

## Image Handling

Images are stored as BLOB in the database and returned as base64 data URIs:

```json
{
  "featured_image": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
```

For the generic Image model, you can also get separate metadata:

```json
{
  "id": 1,
  "filename": "photo.jpg",
  "mime_type": "image/jpeg",
  "file_size": 123456,
  "width": 1920,
  "height": 1080,
  "image_type": "gallery",
  "data_uri": "data:image/jpeg;base64,..."
}
```

## CORS Configuration

The API is configured to allow requests from:
- `http://localhost:3000` (Next.js frontend)
- `http://127.0.0.1:3000`

Modify `CORS_ALLOWED_ORIGINS` in `settings.py` for production.

## Admin Panel

Access the Django admin at: `http://localhost:8000/admin/`

Features:
- Upload images via file input fields
- Preview images in admin
- Inline editing for related models
- Bulk actions for blog posts and contact messages
- SEO field management

---

## Running with ASGI servers (uvicorn / gunicorn) 🔧

This project exposes an ASGI application at `portfolio.asgi:application` so you can run it with modern ASGI servers.

**Uvicorn (recommended, supports Windows and UNIX)**

```bash
# install (already added to requirements)
pip install -r requirements.txt

# development (auto-reload)
uvicorn portfolio.asgi:application --reload --host 127.0.0.1 --port 8000

# production (no reload, multiple workers)
uvicorn portfolio.asgi:application --host 0.0.0.0 --port 8000 --workers 4
```

**Gunicorn with Uvicorn worker (recommended for UNIX production servers)**

```bash
# install (already added to requirements)
pip install -r requirements.txt

# run with uvicorn worker (NOTE: Gunicorn is not supported on Windows)
gunicorn -k uvicorn.workers.UvicornWorker portfolio.asgi:application --bind 0.0.0.0:8000 --workers 4
```

> ⚠️ Note: `gunicorn` does **not** run on Windows. If you're developing on Windows, use `uvicorn` locally or run Gunicorn in a Linux container or remote server.

**Heroku / Procfile**

If deploying to Heroku or similar platforms, add a `Procfile` with:

```
web: gunicorn -k uvicorn.workers.UvicornWorker portfolio.asgi:application --bind 0.0.0.0:$PORT
```

---

If you'd like, I can also add small helper scripts (`run-uvicorn.sh`, `run-uvicorn.ps1`) to make local development easier. Let me know which you'd prefer.
