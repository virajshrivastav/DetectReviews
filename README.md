# FakeDetector - AI-Powered Fake Review Detection

FakeDetector is a web application that uses AI to analyze product reviews and identify potentially fake ones. The system allows users to upload Excel files containing reviews, processes them using Microsoft's free AI model, and provides a detailed report of the analysis.

## Features

- Upload Excel files containing product reviews
- AI-powered analysis of reviews to detect fake ones
- Visual report with statistics and identified fake reviews
- Modern, responsive UI with animations

## Project Structure

- `app/` - Next.js frontend application
- `components/` - React components for the UI
- `api/` - Backend API for review analysis
- `review_data/` - Sample review data for testing
- `review_analyzer.py` - Core module for analyzing reviews
- `run_api_server.py` - Script to run the API server

## Local Setup Instructions

### Prerequisites

- Node.js (for the frontend)
- Python 3.8+ (for the backend)
- OpenRouter API key (for accessing AI models)

### Installation

1. Install frontend dependencies:
   ```
   npm install
   ```

2. Install backend dependencies:
   ```
   pip install pandas requests
   ```

3. Set up your OpenRouter API key:
   ```
   set OPENROUTER_API_KEY=your_api_key
   ```

### Running the Application Locally

#### Option 1: Start both services with a single command

1. Run the combined startup script:
   ```
   npm run start-all
   ```

   This will start both the API server and the frontend in a single process.

#### Option 2: Start services separately

1. Start the API server:
   ```
   python run_api_server.py
   ```

2. In a separate terminal, start the frontend:
   ```
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Deployment Instructions

### Option 1: Deploy Both Frontend and Backend on Render (Recommended)

This project includes a `render.yaml` file that allows you to deploy both the frontend and backend on Render with a single click using Render Blueprints.

1. Push your code to GitHub
2. Go to https://dashboard.render.com/blueprints
3. Click "New Blueprint Instance"
4. Connect your GitHub repository
5. Click "Apply Blueprint"

Render will automatically create and deploy both services with the correct configuration and environment variables.

For more detailed instructions, see the [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md) file.

### Option 2: Deploy Frontend and Backend Separately

#### Deploying the Python Backend

You can deploy the Python backend to services like Heroku, Render, or PythonAnywhere:

##### Deploying to Heroku

1. Create a Heroku account and install the Heroku CLI
2. Login to Heroku:
   ```
   heroku login
   ```
3. Create a new Heroku app:
   ```
   heroku create your-app-name
   ```
4. Set the required environment variables:
   ```
   heroku config:set OPENROUTER_API_KEY=your_api_key
   heroku config:set ALLOWED_ORIGINS=https://your-netlify-app.netlify.app
   ```
5. Deploy the backend:
   ```
   git push heroku main
   ```

##### Deploying to Render Manually

1. Create a Render account
2. Create a new Web Service
3. Connect your GitHub repository
4. Set the following:
   - Environment: Python 3
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python run_api_server.py`
5. Add environment variables:
   - `OPENROUTER_API_KEY`: Your OpenRouter API key
   - `ALLOWED_ORIGINS`: Your frontend URL

#### Deploying the Next.js Frontend

##### Deploying to Netlify

1. Create a Netlify account
2. Connect your GitHub repository
3. Set the following build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. Add environment variables:
   - `NEXT_PUBLIC_API_URL`: URL of your deployed Python backend
5. Deploy the site

##### Deploying to Render Manually

1. Create a Render account
2. Create a new Web Service
3. Connect your GitHub repository
4. Set the following:
   - Environment: Node
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
5. Add environment variables:
   - `NEXT_PUBLIC_API_URL`: URL of your deployed Python backend
6. Deploy the site

## Using the Application

1. Click the "Scan Reviews" button on the home page
2. Upload an Excel file containing reviews
3. Wait for the AI to analyze the reviews
4. View the report showing real vs. fake reviews and a list of identified fake reviews

## Testing

You can test the review analyzer with a sample file:

```
python test_review_analyzer.py --file review_data/Product_1_Smartphone_Electronics.xlsx --api-key your_api_key
```

## Excel File Format

The application expects Excel files with the following columns:
- Reviewer Name
- Star Rating
- Review Text

## AI Model

The application uses a free AI model (`thudm/glm-4-9b:free`) through the OpenRouter API. This model provides good general performance and faster analysis for detecting fake reviews.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
