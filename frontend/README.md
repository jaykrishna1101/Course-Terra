# Course Terra Frontend

## Deployment on Vercel

1. Connect the repository to Vercel.
2. Set the Root Directory to `frontend`.
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_API_BASE_URL` (Points to Render backend URL, e.g., `https://course-terra-api.onrender.com/api/v1`)
