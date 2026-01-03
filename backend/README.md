# Portfolio Backend (Django + DRF) 🔧

A lightweight REST API powering the portfolio site. It provides read-only endpoints for the public content (profiles, projects, blog posts, certificates, testimonials, images, etc.) and a public contact endpoint to accept messages from the frontend. OpenAPI/Swagger docs are available.

### Content management (Admin) 🛠️
- The Django admin interface is mounted at the site root (`/`) in this project — use it to **dynamically add, update, or remove** profiles, projects, blog posts, certificates, testimonials, images, and site settings.
- The frontend fetches the latest data from the API endpoints, so changes made in the admin are reflected by the frontend on next API requests (no code deploy needed for content changes).
---

## Table of Contents
1. Features ✅
2. Tech stack 🔧
3. Quickstart (dev) 💡
4. Environment variables (.env)
5. Database 🗄️
6. Running locally ▶️
7. API docs & endpoints 📚
8. Tests 🧪
9. Deployment notes 🚀
10. Contributing & License 🤝

---

## Features ✅
- Read-only API endpoints for profile, projects, blog, certificates, achievements, testimonials, images, and site config.
- Public contact POST endpoint to submit messages from the frontend.
- Pagination, filtering, searching & ordering via DRF and django-filter.
- OpenAPI schema with Swagger and Redoc (drf-spectacular).
- Static file serving via WhiteNoise for simple deployments.

---

## Tech stack 🔧
- Python 3.11+ (recommended), Django 5.x, Django REST Framework
- drf-spectacular (OpenAPI), django-filter, django-cors-headers
- Whitenoise for static assets
- Optional: PostgreSQL (psycopg2). Default dev DB is SQLite.

---

## Quickstart (dev) 💡
1. Clone repository and change into backend folder:
   ```bash
   cd backend
   ```
2. Create & activate a virtual environment:
   - Windows (CMD/PowerShell):
     ```powershell
     python -m venv venv
     venv\Scripts\activate
     ```
     ```bash
     python -m venv venv
     source venv/bin/activate
    ```
   - Bash (Git Bash / WSL):
     ```bash
     python -m venv venv
     source venv/bin/activate
     ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file (see example below).
5. Run migrations and create a superuser:
   ```bash
   python manage.py migrate
   python manage.py createsuperuser
   ```
6. Run development server:
   ```bash
   python manage.py runserver
   ```

---

## Environment variables (.env) — example

Copy the `.env.example` to `.env` and customize values as needed:
```bash
cp .env.example .env
```
> Keep it as it for local development with SQLite. Modify DB settings for Postgres if needed.

> ⚠️ **Security note:** Keep `SECRET_KEY` private and set `DEBUG=False` in production.

---

## Database 🗄️
- Development default: SQLite (`db.sqlite3`).
- Production: use Postgres by setting `DATABASE_URL` or toggling `USE_POSTGRES`.
> Setting `DATABASE_URL` will **override** individual Postgres settings. You can say it is most prioritized. So, unset `DATABASE_URL` to use individual settings.
- To switch to Postgres locally, set `USE_POSTGRES=True` and provide DB settings in `.env`.
> For `SQLITE`, no additional setup is needed. Set `USE_POSTGRES=False` and `DATABASE_URL` should be unset.
- Apply migrations:
  ```bash
  python manage.py migrate
  ```

---

## Running locally ▶️
- Start dev server:
  ```bash
  python manage.py runserver
  ```
- Collect static files (for production):
  ```bash
  python manage.py collectstatic
  ```
- Django admin: create a superuser and visit `127.0.0.1:8000/`.

---

## Media migration & cleanup (BinaryField → FileField / Cloudinary) 🔁
This project historically stored images and other binary files as BLOBs in the database (BinaryField). To use cloud storage (Cloudinary, Supabase, Backblaze, etc.) we added File/ImageFields and provide two management commands to migrate and clean up safely.

Important: Always back up your database before performing destructive operations.

### 1) Migrate blobs to FileFields (uploads to configured storage)
- Ensure you have Cloudinary (or your chosen storage) configured in `.env` and enabled via `USE_CLOUDINARY=True` and `CLOUDINARY_URL` set.
- Install required packages if using Cloudinary:
  ```bash
  pip install cloudinary django-cloudinary-storage
  ```
- Run the migration command to copy binary bytes into FileFields (uploads to the configured storage backend):
  ```bash
  python manage.py migrate_binary_to_cloudinary -b 50
  ```
  Options:
  - `-b N` / `--batch-size N`: set iterator chunk size for processing (default 50 in the command). The command is idempotent and safe to re-run.

### 2) Clear migrated BLOB values (keeps columns, removes BLOB data)
- After verifying files uploaded and FileFields populated, remove the large binary values from the DB to reduce DB size while keeping the schema intact.
- Available flags:
  - `--dry-run` (default): shows which rows would be cleared without applying changes.
  - `--verify`: checks that the file exists in the configured storage before clearing the DB blob.
  - `--confirm`: apply the clears (required to make changes).
- Example dry-run / verify:
  ```bash
  python manage.py clear_migrated_blobs --dry-run --verify
  ```
- Example apply (do a DB backup first):
  ```bash
  python manage.py clear_migrated_blobs --confirm --verify
  ```

Both commands live in `api/management/commands/`:
- `migrate_binary_to_cloudinary.py` — copies existing binary data into FileFields (uploads to configured storage)
- `clear_migrated_blobs.py` — clears BinaryField values for rows that have a valid FileField (dry-run and confirm flows)

If you'd like, I can add small internal tests that exercise these commands in dry-run mode to avoid regressions. Let me know if you want that added.

---

## API docs & endpoints 📚
- OpenAPI schema: `GET /api/schema/`
- Swagger UI: `GET /api/swagger/`
- Redoc: `GET /api/redoc/`

Common endpoints (examples):
- `GET /api/profiles/`
- `GET /api/projects/` and `GET /api/projects/{slug}/`
- `GET /api/blog/` and `GET /api/blog/{slug}/`
- `POST /api/contact/` — submit a contact message

Example contact POST:
```bash
curl -X POST http://127.0.0.1:8000/api/contact/ \
  -H "Content-Type: application/json" \
  -d '{"name":"Test", "email":"you@example.com", "message":"Hello"}'
```

Notes:
- Most endpoints are public/read-only. Authentication is required only for admin operations.
- Filtering, searching, and ordering are enabled where applicable.

---

## Tests 🧪
- Run the test suite:
  ```bash
  python manage.py test
  ```
- See `api/tests.py` for existing test examples and patterns.

---

## Deployment notes 🚀
- Vercel support is provided via `vercel.json` (WSGI). Ensure environment variables are set in the deployment platform.
- For production: set `DEBUG=False`, configure a proper DB, run `collectstatic`, and serve with a WSGI server (gunicorn/uvicorn) or the platform's runtime.
- Whitenoise is configured for static files.

---

## Contributing & License 🤝
- Contributions are welcome — open PRs for bug fixes and enhancements.
- Add tests and update docs with any behavior changes.
- See the repository `LICENSE` at the project root for license details.

---

If you'd like, I can add code examples, CI notes, or expand the endpoints list with each route and example responses. Would you like me to commit further changes or add integration/test scripts? 🚀
