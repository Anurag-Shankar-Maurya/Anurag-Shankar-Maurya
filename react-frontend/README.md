<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1dlqElnonLiFUW-2d3LxElu82F61g2pw5

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

### Environment variables ⚙️

Copy `.env.example` to `.env.local` and edit the variables for your environment. The frontend expects Vite-prefixed variables so they are available at build/runtime:

- `VITE_API_URL` (default: `http://127.0.0.1:8000`)
- `VITE_API_BASE_PATH` (default: `/api`)

Example `.env.local`:
```
VITE_API_URL=http://127.0.0.1:8000
VITE_API_BASE_PATH=/api
```
