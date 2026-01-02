# DevPortfolio (React + Vite) — Modern, fast, and production-ready ⚡️

DevPortfolio is a polished, high-performance React portfolio template built with Vite and TypeScript-ready tooling. It ships with responsive UI components, mock data, and built-in integration with a companion Django REST API so you can deploy a modern, content-driven portfolio quickly.

---

## Why use this? 💡
- **Lightning-fast dev experience** — Vite + React gives near-instant HMR and snappy builds. 🔥
- **Production-ready** — Optimized builds, preview script, and easy deploy to Vercel/Netlify. 🚀
- **API-first** — Works seamlessly with the project's Django backend (or any REST API) via VITE_API_URL. 🔗
- **TypeScript-friendly** — Types live in `types.ts` so you can iterate confidently. 🛡️
- **Beautiful, accessible UI** — Responsive design, icon sets, and reusable components for a professional presentation. 🎨

---

## Live demo & Showcase ✨
You can hook this frontend to the included backend to preview live content managed via the Django admin. The frontend fetches content (profile, projects, blog posts, testimonials, images, etc.) from the API and renders it dynamically — change content in the admin and the site updates immediately on the next request.

---

## What’s inside 🚀
- React 19 + React Router for fast client routing
- Vite for development and production builds
- Icon support via `lucide-react` and `react-icons`
- Integration helpers in `services/api.ts` and mock data in `services/mockData.ts`
- Centralized data hook `hooks/usePortfolioData.ts` that bootstraps the site with profile, projects, blog posts, experience, certificates, testimonials, and images

---

## Quickstart (developer friendly) 🛠️
1. Install dependencies:

```bash
# from project root
cd react_frontend
npm install
```

2. Run locally (dev server):

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
npm run preview    # test production build locally
```

---

## Configure API (connect to backend) 🔌
This frontend detects API configuration via Vite env variables. Create a `.env.local` in `react_frontend/` with the values below:

```
VITE_API_URL=http://127.0.0.1:8000
VITE_API_BASE_PATH=/api
```

- `VITE_API_URL` — root URL of your backend (defaults to `http://127.0.0.1:8000`)
- `VITE_API_BASE_PATH` — base path for API endpoints (defaults to `/api`)

Tip: If you want to preview without a backend, the app ships with `services/mockData.ts` to get you started quickly.

---

## Customize & Brand it 🎨
- Replace images and content in the Django admin (if using the companion backend) or swap out the mock data files for your own content.
- Update styles and layout under `components/` and global styles as needed.
- Add or remove sections by editing `hooks/usePortfolioData.ts` and the corresponding routes/components.

---

## Deployment notes 🔧
- Deploy static assets to Vercel, Netlify, or any static host. For Vercel, add the same `VITE_API_URL` env var in the project settings.
- Ensure CORS is configured on the backend to allow your frontend origin.

---

## Contributing & community 🤝
Contributions are welcome. Open PRs for bug fixes, accessibility improvements, or new features. Please add tests where appropriate and keep changes focused.

---

## License & contact 📄
See the repository `LICENSE` at the project root for license details. For feedback or feature requests, open an issue in the repository.

---

Want me to add a polished demo screenshot, automated CI (test + build), or a quick deployment guide for Vercel/Netlify? Pick one and I'll add it next. ✅
