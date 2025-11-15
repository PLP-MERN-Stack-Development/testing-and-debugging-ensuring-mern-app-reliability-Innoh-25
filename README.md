# MERN Bug Tracker

> A comprehensive Bug Tracker application built with the MERN stack featuring full testing suite implementation and debugging capabilities.

## ✨ Features

- **Bug Management**: Create, read, update, and delete bug reports with detailed tracking
- **Project Organization**: Organize bugs by projects and assign team members efficiently
- **Status Tracking**: Monitor bug lifecycle (open, in-progress, resolved, closed)
- **Priority System**: Categorize bugs by priority levels (low, medium, high, critical)
- **User Authentication**: Secure JWT-based authentication with registration and login
- **Comprehensive Testing**: Full test coverage including unit, integration, and E2E tests
- **Error Handling**: Robust error boundaries and middleware for better debugging
- **Responsive Design**: Mobile-friendly interface for tracking bugs on any device

## 🛠️ Tech Stack

**Frontend:**
- React 18+
- React Router for navigation
- Axios for API calls
- Cypress for E2E testing
- Jest & React Testing Library

**Backend:**
- Node.js & Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- Jest & Supertest for testing
- bcrypt for password hashing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **npm** or **yarn** package manager
- **Git** for version control

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/mern-bug-tracker.git
cd mern-bug-tracker
```

### 2. Install Dependencies

Install all dependencies for both client and server:

```bash
npm run install-all
```

Or install separately:

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in the **root directory**:

```env
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-in-production
MONGODB_URI=mongodb://localhost:27017/mern-bug-tracker
PORT=5000
```

**Important:** Change `JWT_SECRET` to a strong, random string in production!

### Frontend Environment Variables

Create a `client/.env` file:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### MongoDB Setup

**Option 1: Local MongoDB**
```bash
# Start MongoDB service
sudo systemctl start mongod

# Verify MongoDB is running
sudo systemctl status mongod
```

**Option 2: MongoDB Atlas**
1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get your connection string
3. Update `MONGODB_URI` in `.env` with your Atlas connection string

## 🏃 Running the Application

### Option 1: Run Both Client and Server (Recommended)

```bash
npm run dev
```

### Option 2: Run Separately

**Terminal 1 - Backend Server:**
```bash
npm run server
```

**Terminal 2 - Frontend Client:**
```bash
npm run client
```

### Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 🧪 Testing

This project follows the testing pyramid approach with comprehensive test coverage.

### Test Coverage Summary

| Component | Statements | Branch | Functions | Lines |
|-----------|-----------|---------|-----------|-------|
| Backend   | 71.21%    | 38.57%  | 51.85%    | 72.5% |
| Frontend  | 56.31%    | 55.93%  | 53.57%    | 56.7% |

### Running Tests

#### Backend Tests

```bash
cd server

# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Generate coverage report
npm run coverage

# Run tests in watch mode (for development)
npm run test:watch
```

#### Frontend Tests

```bash
cd client

# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Generate coverage report
npm run coverage

# Run E2E tests with Cypress
npm run test:e2e

# Open Cypress test runner (interactive)
npm run test:e2e:open
```

#### Run All Tests from Root

```bash
# Run all tests (backend + frontend)
npm test

# Run specific test types
npm run test:unit
npm run test:integration
npm run test:e2e
```

### Test Structure

```
mern-bug-tracker/
├── server/
│   └── tests/
│       ├── unit/                    # Unit tests
│       │   ├── middleware/
│       │   │   └── auth.test.js
│       │   ├── controllers/
│       │   │   └── authController.test.js
│       │   └── utils/
│       │       └── auth.test.js
│       ├── integration/             # API integration tests
│       │   └── bugs.test.js
│       └── setup.js                 # Test configuration
└── client/
    └── src/
        └── tests/
            ├── unit/                # Component unit tests
            │   ├── components/
            │   ├── hooks/
            │   └── services/
            ├── integration/         # Component integration tests
            ├── e2e/                # End-to-end tests
            │   └── user-auth.cy.js
            └── setup.js            # Test configuration
```

## 🐛 Debugging

### Backend Debugging

#### 1. Console Logging

Strategic logging is implemented throughout the application:

```javascript
console.log('Create bug request:', { body: req.body, user: req.user?.id });
```

#### 2. Node.js Inspector

Debug with Chrome DevTools:

```bash
# Start with debugger
node --inspect src/index.js

# With auto-restart
npx nodemon --inspect src/index.js
```

Then open `chrome://inspect` in Chrome and connect to the debugger.

#### 3. Error Handling Middleware

Comprehensive error logging and handling is available in `server/src/middleware/errorHandler.js`.

### Frontend Debugging

#### 1. React Error Boundaries

Error boundaries catch and log component errors throughout the application.

#### 2. Browser DevTools

- **React DevTools**: Inspect component state and props
- **Network Tab**: Monitor API calls and responses
- **Console**: View logs and errors
- **Redux DevTools**: Debug state management (if applicable)

#### 3. Debug Logging

Console logging is strategically placed in components for tracking state changes and user interactions.

### Intentional Bugs

The codebase includes intentional bugs for educational and debugging practice:

**Backend:**
- Missing null checks in utility functions
- Async/await mismatches
- Validation edge cases

**Frontend:**
- State update race conditions
- Missing error boundaries in specific areas
- API response handling edge cases

## 📁 Project Structure

```
mern-bug-tracker/
├── client/                      # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── services/           # API service layer
│   │   ├── tests/              # Frontend tests
│   │   ├── utils/              # Utility functions
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── .env
├── server/                      # Express backend
│   ├── src/
│   │   ├── controllers/        # Route controllers
│   │   ├── middleware/         # Custom middleware
│   │   ├── models/             # Mongoose models
│   │   ├── routes/             # API routes
│   │   ├── utils/              # Utility functions
│   │   └── index.js
│   ├── tests/                  # Backend tests
│   ├── package.json
│   └── .env
├── package.json                # Root package.json
└── README.md
```

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

### Bug Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bugs` | Get all bugs |
| GET | `/api/bugs/:id` | Get single bug |
| POST | `/api/bugs` | Create new bug |
| PUT | `/api/bugs/:id` | Update bug |
| DELETE | `/api/bugs/:id` | Delete bug |

### Project Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | Get all projects |
| GET | `/api/projects/:id` | Get single project |
| POST | `/api/projects` | Create new project |
| PUT | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |

*For detailed request/response schemas, see API documentation in `/docs/api.md`*

## 🚨 Common Issues

### Database Connection Issues

**Problem**: Cannot connect to MongoDB

**Solutions**:
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod

# Or with custom data directory
mongod --dbpath /path/to/data/directory
```

### Test Timeout Issues

**Problem**: Tests timing out

**Solution**:
```bash
# Increase timeout
npm test -- --testTimeout=10000
```

### Port Already in Use

**Problem**: Port 5000 or 3000 already in use

**Solutions**:
```bash
# Find process using port
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or change port in .env file
PORT=5001
```

### Coverage Reporting Issues

**Problem**: Jest cache causing issues

**Solution**:
```bash
# Clear Jest cache
npx jest --clearCache
```

## 🎯 Performance Optimization

### Test Performance

- Use `--maxWorkers=4` for parallel execution
- Implement test data factories
- Use `jest --runInBand` for debugging

### Application Performance

- Database indexing on frequently queried fields
- React.memo() for expensive components
- API response caching
- Code splitting for faster load times