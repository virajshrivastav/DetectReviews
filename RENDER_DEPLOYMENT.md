# Deploying FakeDetector on Render

This guide explains how to deploy both the frontend and backend of the FakeDetector application on Render.

## Prerequisites

- A GitHub account with your FakeDetector code repository
- A Render account (you can sign up at https://render.com/)

## Deployment Options

### Option 1: Blueprint Deployment (Recommended)

Render Blueprints allow you to deploy multiple services at once using a `render.yaml` file.

1. **Fork or push your code to GitHub**
   - Make sure your repository includes the `render.yaml` file

2. **Deploy using Blueprint**
   - Go to https://dashboard.render.com/blueprints
   - Click "New Blueprint Instance"
   - Connect your GitHub account if you haven't already
   - Select your FakeDetector repository
   - Click "Apply Blueprint"
   - Render will automatically create and deploy both services

3. **Verify Environment Variables**
   - After deployment, check that the environment variables are correctly set:
     - Backend: `OPENROUTER_API_KEY` and `ALLOWED_ORIGINS`
     - Frontend: `NEXT_PUBLIC_API_URL`

### Option 2: Manual Deployment

If you prefer to deploy the services manually:

#### Deploy the Backend

1. **Create a new Web Service**
   - Go to https://dashboard.render.com/
   - Click "New" and select "Web Service"
   - Connect your GitHub repository
   - Configure the service:
     - Name: `fakedetector-api`
     - Environment: `Python 3`
     - Build Command: `pip install -r requirements.txt`
     - Start Command: `python run_api_server.py`
   - Add environment variables:
     - `OPENROUTER_API_KEY`: Your OpenRouter API key
   - Click "Create Web Service"

2. **Note the API URL**
   - Once deployed, note the URL (e.g., `https://fakedetector-api.onrender.com`)

#### Deploy the Frontend

1. **Create another Web Service**
   - Go to https://dashboard.render.com/
   - Click "New" and select "Web Service"
   - Connect your GitHub repository (same as before)
   - Configure the service:
     - Name: `fakedetector-frontend`
     - Environment: `Node`
     - Build Command: `npm install && npm run build`
     - Start Command: `npm start`
   - Add environment variables:
     - `NEXT_PUBLIC_API_URL`: The URL of your backend service
   - Click "Create Web Service"

2. **Update Backend CORS Settings**
   - Go back to your backend service
   - Add/update the environment variable:
     - `ALLOWED_ORIGINS`: The URL of your frontend service

## Testing Your Deployment

1. Wait for both services to finish deploying
2. Open your frontend URL in a browser
3. Click "Scan Reviews" and upload an Excel file
4. Verify that the analysis works correctly

## Troubleshooting

- **CORS Issues**: Make sure the `ALLOWED_ORIGINS` variable on the backend includes your frontend URL
- **Connection Issues**: Check that the `NEXT_PUBLIC_API_URL` on the frontend is correct
- **Deployment Failures**: Check the build logs for any errors

## Updating Your Deployment

When you push changes to your GitHub repository, Render will automatically rebuild and redeploy your services.
