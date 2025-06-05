# AutoApply Pro

A full-stack web application that helps users automate job application form filling by storing resume data and auto-filling application forms.

## Tech Stack

- **Frontend**: React.js with Tailwind CSS
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Local storage with Multer

## Features

- User authentication (signup/login) with JWT
- Resume upload and storage (PDF and Word documents)
- Dashboard with user profile management
- Multiple resume management with primary resume selection
- AI-powered cover letter generation based on job descriptions
- JD Analyzer tool to match job descriptions with your resume
- Autofill history tracking
- Responsive design for mobile and desktop
- Chrome extension for one-click form filling

## UI/UX Features

- **Consistent Toast Notifications**: Centralized notification system using ToastService
- **Tooltips**: Helpful context-based tooltips throughout the interface
- **Subscription Plan Badge**: Clearly displays current plan status and remaining credits
- **Feedback Button**: Easy way for users to provide feedback
- **What's New Feature**: Modal that showcases recent updates and improvements
- **Pro Badge**: Subtle indicator of premium status next to user avatars
- **Mobile Responsive**: Optimized for all device sizes from 320px up

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local instance or MongoDB Atlas)

### Installation

#### Quick Install (Using Root Scripts)

1. Clone the repository
2. Install all dependencies at once from the root:
   ```
   npm run install-all
   ```

3. Set up environment variables (create `.env` file in the backend directory with the following variables):
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/autoapplypro
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=30d
   FILE_UPLOAD_PATH=./uploads
   MAX_FILE_SIZE=5000000
   OPENAI_API_KEY=your_openai_api_key
   ```

4. Start both frontend and backend concurrently:
   ```
   npm run dev
   ```

#### Manual Installation

1. Clone the repository
2. Install backend dependencies:
   ```
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```
   cd frontend
   npm install
   ```

4. Set up environment variables (create `.env` file in the backend directory)

5. Start the backend server:
   ```
   cd backend
   npm run dev
   ```

6. Start the frontend development server:
   ```
   cd frontend
   npm start
   ```

## Project Structure

### Backend Structure

- `/backend` - Express server with API endpoints
  - `/controllers` - Request handlers for each route
  - `/models` - Mongoose schemas for database models
  - `/middleware` - Custom middleware (auth, error handling)
  - `/routes` - API route definitions
  - `/config` - Configuration files
  - `/uploads` - Directory for storing uploaded files

### Frontend Structure

- `/frontend` - React.js client application
  - `/src/components` - Reusable UI components
  - `/src/pages` - Main page components
  - `/src/context` - React context providers (Auth)
  - `/src/utils` - Utility functions and API service
  - `/src/assets` - Static assets

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get token
- `GET /api/auth/me` - Get current user (protected)

### User Management

- `PUT /api/users/profile` - Update user profile (protected)
- `PUT /api/users/password` - Update user password (protected)

### Resume Management

- `POST /api/resumes` - Upload a new resume (protected)
- `GET /api/resumes` - Get all user resumes (protected)
- `GET /api/resumes/:id` - Get a specific resume (protected)
- `DELETE /api/resumes/:id` - Delete a resume (protected)
- `PUT /api/resumes/:id/primary` - Set a resume as primary (protected)

### History Management

- `POST /api/history` - Create a new history entry (protected)
- `GET /api/history` - Get all user history entries (protected)
- `GET /api/history/:id` - Get a specific history entry (protected)
- `DELETE /api/history/:id` - Delete a history entry (protected)

### AI Cover Letter

- `POST /api/ai/cover-letter` - Generate a cover letter based on job description (protected)
- `GET /api/ai/cover-letters` - Get all user cover letters (protected)
- `GET /api/ai/cover-letters/:id` - Get a specific cover letter (protected)
- `PUT /api/ai/cover-letters/:id` - Update a cover letter (protected)
- `DELETE /api/ai/cover-letters/:id` - Delete a cover letter (protected)

## Deployment

### Backend Deployment

1. Ensure MongoDB is accessible from your deployment environment
2. Set up environment variables for production
3. Build and deploy the Node.js application

### Frontend Deployment

1. Build the React application:
   ```
   cd frontend
   npm run build
   ```

2. Deploy the static files from the `build` directory to your hosting service
