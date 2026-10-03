# Course Terra Backend

## Deployment on Render Free

1. Connect the repository to Render.
2. Create a new "Web Service".
3. Set the Root Directory to `backend`.
4. Build Command: `pip install -r requirements.txt`
5. Start Command: `gunicorn -w 4 -b 0.0.0.0:$PORT "run:app"`
6. Environment Variables:
   - `SUPABASE_URL` (Server only)
   - `SUPABASE_SERVICE_ROLE_KEY` (Server only, secret)
   - `FRONTEND_URL` (e.g., `https://your-vercel-app.vercel.app`)
   - `PAYMENTS_ENABLED` (`false`)
   - `FLASK_CONFIG` (`production`)

Render's free tier spins down after inactivity. The frontend handles loading states appropriately.
