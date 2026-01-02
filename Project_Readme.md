# DevPortfolio — A Complete, Deployable Portfolio Platform (Frontend + Backend) 🚀

**Made by Anurag Shankar Maurya** — crafted for professionals who want to showcase their work with confidence.

DevPortfolio is a full-stack, production-ready portfolio platform combining a modern React frontend (Vite) with a lightweight Django REST backend. It’s designed for developers, designers, and professionals who want a beautiful online presence that’s easy to manage, extend, and deploy.

---

## Why DevPortfolio? 💡
- **Ship faster** — Prebuilt UI, data models, and API integration let you launch a professional portfolio in minutes. ⏱️
- **Edit without redeploys** — Admin-managed content via Django admin means you can add or update projects, posts, and testimonials instantly. 🔁
- **Performance-first** — Vite + React for a snappy frontend; optimized backend with caching-friendly read-only endpoints. ⚡️
- **Extensible & Developer-friendly** — TypeScript-ready frontend types, modular components, and a small, well-documented Django API. 🧩
- **Ready for production** — Examples and configurations for Vercel, Netlify, and WSGI-backed deployments. ✅

---

## Key Features ✨
- Read-only API endpoints for profile, projects, blog posts, certificates, achievements, testimonials, images, and site settings
- Public contact endpoint to capture messages from visitors
- Filtering, searching, ordering and pagination for lists
- OpenAPI/Swagger + Redoc docs via drf-spectacular
- Django admin mounted at `/admin` for dynamic content management (no redeploys required)
- Vite-powered React frontend with centralized data hook and mock data for quick previews
- Whitenoise-ready static serving and simple Postgres support for production

---

## What’s Included 📦
- `backend/` — Django project with REST API (DRF), admin, migrations, and tests
- `react_frontend/` — Vite + React app, components, and API integration helpers
- `react_frontend/services/mockData.ts` — Local mock data to preview the UI without a backend
- Configs for deployment: `vercel.json`, `package.json` scripts, and environment guidance

---

## Quickstart (Local Development) 🛠️
1. Backend (Django):
   ```bash
   cd backend
   python -m venv venv
   venv\Scripts\activate  # Windows
   pip install -r requirements.txt
   cp .env.example .env
   python manage.py migrate
   python manage.py createsuperuser
   python manage.py runserver
   ```
   - Visit `127.0.0.1:8000/admin/` for the Django admin. Use it to add/update projects, posts, images, and site settings — the frontend will pick up changes on the next API fetch.

2. Frontend (React + Vite):
   ```bash
   cd react_frontend
   npm install
   # set VITE_API_URL in `.env.local` to http://127.0.0.1:8000
   npm run dev
   ```
   - The frontend loads profile, projects, blog, testimonials, and images from the API automatically via `hooks/usePortfolioData.ts`.

---

## Config & Environment Variables 🔧
- Backend: `.env` controls SECRET_KEY, DEBUG, ALLOWED_HOSTS, DB config (USE_POSTGRES / DATABASE_URL), and CORS
- Frontend: `.env.local` supports `VITE_API_URL` and `VITE_API_BASE_PATH` (defaults are `http://127.0.0.1:8000` and `/api`)

Tip: Use `services/mockData.ts` for quick frontend-only demos or to develop UIs without the backend running.

---

## API Docs & Useful Endpoints 📚
- OpenAPI schema: `GET /api/schema/`
- Swagger UI: `GET /api/swagger/`
- Redoc: `GET /api/redoc/`

Common read endpoints:
- `GET /api/profiles/`
- `GET /api/projects/` and `GET /api/projects/{slug}/`
- `GET /api/blog/` and `GET /api/blog/{slug}/`
- `POST /api/contact/` — contact form endpoint

---

## Testing & Quality 🧪
- Backend: `python manage.py test` (see `api/tests.py` for patterns)
- Frontend: add React testing (Jest/React Testing Library) or E2E (Cypress) for full coverage
- CI suggestion: run linting, backend tests, and `npm run build` for the frontend on each PR

---

## Deployment Notes 🚀
- Vercel: Set `VITE_API_URL` in the Vercel project environment variables and deploy the `react_frontend` build. Backend can be deployed as a Python server (Vercel WSGI) or to any host (Heroku, Fly, Dokku, Render).
- Static server: Build frontend and serve via Netlify or S3 + CloudFront. Configure backend CORS accordingly.
- Production checklist: `DEBUG=False`, valid `SECRET_KEY`, proper DB configuration, run migrations, and `collectstatic` before launch.

---

## How content flows (simple + powerful) 🔁
- Author uses Django admin (mounted at `/admin`) to add or edit content (projects, blog posts, images). No code changes needed.
- The frontend fetches the latest data from the read-only API endpoints and renders updated content on next visit.

---

## Customize & Extend 🛠️
- Add new API resources by creating models/serializers/views in `backend/api/` and register them in `api/urls.py`
- Build new frontend sections by adding components and wiring them into `hooks/usePortfolioData.ts` and routes
- Replace mock data or wire new endpoints via `react_frontend/services/api.ts`

---

## Contributing & Support 🤝
Contributions are welcome! Please open issues for bugs or feature requests and submit PRs with focused changes. Include tests and update docs when behavior changes.

---

## Acknowledgements 🙏
- The original **Next.js** `frontend/` directory (not the Vite-based `react_frontend/` directory) was adapted from the **Magic Portfolio** template by **Once UI** (https://once-ui.com/, https://github.com/once-ui-system/magic-portfolio). This repository customizes and extends that template to integrate with a Django + DRF backend to power a full-stack portfolio. Big thanks to the Once UI team for the excellent foundation.

---

## License & Contact 📬
- This project is licensed under the **MIT License** — see the `LICENSE` file for details.
- **Made by Anurag Shankar Maurya**.
- Questions, feature requests, or help with deployment? Open an issue or reach out via the project issue tracker.
