# Deployment Guide for LMS Client

## Prerequisites
- A Vercel account
- Your backend API deployed and accessible (get the URL)
- Clipdrop API key (if using AI image generation features)

## Environment Variables

Before deploying to Vercel, you need to set the following environment variables:

### Required:
- `VITE_API_URL` - Your backend API URL (e.g., `https://your-api.vercel.app`)

### Optional:
- `VITE_CLIPDROP_API_KEY` - Your Clipdrop API key for AI image generation

## Deployment Steps

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Navigate to the client directory:
   ```bash
   cd client
   ```

3. Run the deployment command:
   ```bash
   vercel
   ```

4. Follow the prompts and set environment variables when asked

### Option 2: Deploy via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository
4. Set the **Root Directory** to `client`
5. Framework Preset: Vite
6. Build Command: `npm run build`
7. Output Directory: `dist`
8. Add Environment Variables:
   - `VITE_API_URL`: Your backend API URL
   - `VITE_CLIPDROP_API_KEY`: Your Clipdrop API key (if needed)
9. Click "Deploy"

### Option 3: Deploy via Git Push (Recommended)

1. Connect your repository to Vercel
2. In Vercel Dashboard, go to your project settings
3. Set Environment Variables:
   - `VITE_API_URL`: Your backend API URL
   - `VITE_CLIPDROP_API_KEY`: Your Clipdrop API key (if needed)
4. Push to your main branch - Vercel will automatically deploy

## Post-Deployment

After deployment:
1. Test all API endpoints to ensure backend connectivity
2. Verify authentication flows work correctly
3. Check that environment variables are correctly loaded
4. Test payment integrations (if applicable)

## Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Ensure Node version compatibility (Node 18+ recommended)
- Verify environment variables are set correctly

### API Connection Issues
- Verify `VITE_API_URL` is set correctly
- Ensure backend CORS settings allow your frontend domain
- Check backend API is accessible and running

### Blank Page After Deployment
- Check browser console for errors
- Verify all import paths use correct casing
- Ensure environment variables start with `VITE_`

## Important Notes

- All environment variables in Vite must be prefixed with `VITE_`
- Environment variables are embedded at build time
- Changes to environment variables require a rebuild/redeploy
- Never commit `.env` files to version control
