# 🚀 CredNex Live Cloud Deployment Guide (Render + Vercel)

This guide provides the exact, production-tested steps to deploy **CredNex** live on **Render** (FastAPI backend + Managed PostgreSQL) and **Vercel** (React frontend).

---

## 📋 Pre-Deployment Checklist (Already Completed in Codebase)

| Item | Status | Details |
|---|---|---|
| **Git Repository** | ✅ Ready | Clean commit on `main` branch with author credentials set |
| **Render Blueprint** | ✅ Ready | [backend/render.yaml](file:///d:/SIH%20ps2/backend/render.yaml) created for 1-click database & service provisioning |
| **Backend Entrypoint** | ✅ Ready | [backend/Procfile](file:///d:/SIH%20ps2/backend/Procfile) with `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |
| **Vercel SPA Routing** | ✅ Ready | [frontend/vercel.json](file:///d:/SIH%20ps2/frontend/vercel.json) configured to prevent nested 404s on browser refresh |
| **CORS Configuration** | ✅ Ready | [backend/app/main.py](file:///d:/SIH%20ps2/backend/app/main.py) allows requests from `https://*.vercel.app` & production domains |
| **Environment URLs** | ✅ Ready | [frontend/src/services/api.ts](file:///d:/SIH%20ps2/frontend/src/services/api.ts) dynamically reads `VITE_API_BASE_URL` |
| **Secrets Security** | ✅ Ready | [.gitignore](file:///d:/SIH%20ps2/.gitignore) excludes `.env`, `*.db`, `venv/`, and uploaded test documents |

---

## Step 1: Push Code to Your GitHub Account

1. Open your browser and go to: **[github.com/new](https://github.com/new)**
2. Set **Repository name**: `crednex`
3. Choose **Public** or **Private**.
4. Leave **"Add a README file"**, **".gitignore"**, and **"license"** **UNCHECKED** (we already have them).
5. Click **Create repository**.
6. In your local terminal, run the following commands (replace `YOUR_GITHUB_USERNAME` with your actual username):

```powershell
cd "d:\SIH ps2"
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/crednex.git
git push -u origin main
```

---

## Step 2: Deploy Backend & PostgreSQL on Render (Free)

1. Go to: **[dashboard.render.com](https://dashboard.render.com)** and log in.
2. Click **New +** at the top right and select **Blueprint**.
3. Connect your GitHub account and select your **`crednex`** repository.
4. Render will automatically detect the **[backend/render.yaml](file:///d:/SIH%20ps2/backend/render.yaml)** file and show:
   - **Database**: `crednex-db` (Free PostgreSQL instance)
   - **Web Service**: `crednex-backend` (Python 3.11 web service)
5. Click **Apply**.
6. Render will automatically:
   - Spin up the managed PostgreSQL database.
   - Build and install all dependencies from `requirements.txt`.
   - Start the FastAPI application on `0.0.0.0:$PORT`.
7. Once deployed, note down your live backend URL from the top of the service page:
   - Example: `https://crednex-backend.onrender.com`
8. Verify it by opening:
   - `https://YOUR_BACKEND_URL/api/health` ➡️ Should return `{"status": "ok", "service": "CredNex Portal", "version": "1.0.0"}`
   - `https://YOUR_BACKEND_URL/api/docs` ➡️ Interactive Swagger UI

### (Optional) Seed Initial Demo Records on Render:
In Render's dashboard for `crednex-backend`, go to the **Shell** tab and run:
```bash
python seed.py
```
This will populate the cloud database with the 7 realistic users, 5 technical institutions, and 11 FDR records.

---

## Step 3: Deploy Frontend on Vercel (Free)

1. Go to: **[vercel.com/new](https://vercel.com/new)** and log in with GitHub.
2. Under **Import Git Repository**, find and select your **`crednex`** repository.
3. In the **Configure Project** screen:
   - **Framework Preset**: `Vite` (automatically detected)
   - **Root Directory**: Click **Edit** and select **`frontend`**
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `dist` (default)
4. Expand **Environment Variables** and add:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: `https://YOUR_BACKEND_URL` *(e.g. `https://crednex-backend.onrender.com` without trailing slash)*
5. Click **Deploy**.
6. Within 60 seconds, Vercel will complete the build and assign your live production URL:
   - Example: `https://crednex.vercel.app`

---

## Step 4: Update Backend CORS with Your Vercel Domain

1. In **Render** ➡️ `crednex-backend` ➡️ **Environment**.
2. Find or add:
   - **`FRONTEND_URL`**: `https://YOUR_VERCEL_DOMAIN.vercel.app`
3. Click **Save Changes** (Render will automatically redeploy with the updated CORS rule).

---

## Step 5: Test Live Application in Browser

Open your public Vercel link (`https://crednex.vercel.app`):

1. **Login Test**:
   - Use the **1-Click Demo Buttons** (System Admin, AICTE Officer, Bank Officer, Institution Admin).
   - Click **Sign In to Portal**.
2. **Dashboard Test**:
   - Check that operational stats, bank charts, and recent FDR table load live data from your Render backend.
3. **FDR Submission & Verification**:
   - Click **Submit New FDR** to test the 3-step submission modal.
   - Switch to **Bank Officer** using the top navigation role dropdown to test the Core Banking lien endorsement.
4. **Browser Refresh**:
   - Navigate to `/fdrs`, `/verification`, or `/reports` and press **F5 (Refresh)** to verify that SPA routes load without 404s.

---

## 👥 Demo Credentials for Evaluators & SIH Judges

| Role | Email | Password |
|---|---|---|
| **System Administrator** | `admin@aicte.gov.in` | `Admin@12345` |
| **AICTE Bureau Officer** | `officer@aicte.gov.in` | `Officer@12345` |
| **Bank Officer (SBI)** | `bank@sbi.co.in` | `Bank@12345` |
| **Institution Admin (MIT Pune)** | `inst@mit.edu.in` | `Inst@12345` |
