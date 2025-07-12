# PeopleHub 👥

![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![Node.js](https://img.shields.io/badge/Node.js-v16.x-43853d)
![Express](https://img.shields.io/badge/Express-v4.x-000000)

A comprehensive HR management platform designed to automate department tasks, streamline employee management, and centralize all HR-related functions in one place.

## 📌 Table of Contents
- [Features](#-features)
- [System Requirements](#-system-requirements)
- [Project Structure](#-project-structure)
- [Setup & Installation](#%EF%B8%8F-setup--installation)
- [Environment Variables](#-environment-variables)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Deployment](#%EF%B8%8F-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features
- ✅ **Employee Management** - Complete employee lifecycle management
- ✅ **Attendance Tracking** - Time tracking and attendance management
- ✅ **Leave Management** - Request, approve, and monitor employee leave
- ✅ **Performance Reviews** - Conduct and track employee evaluations
- ✅ **Document Management** - Store and manage HR documents securely
- ✅ **Reporting & Analytics** - Generate insights from HR data
- ✅ **Onboarding & Offboarding** - Streamline employee transitions
- ✅ **Role-based Access Control** - Secure, permission-based system

## 💻 System Requirements
- Node.js (v16.x or higher)
- MongoDB (v5.x or higher)
- npm or Yarn package manager

## 📂 Project Structure
```
peopleHub/  
├── client/                   # Frontend React application  
│   ├── public/               # Static files  
│   └── src/                  # React components & logic  
├── server/  
│   ├── src/                  # Backend source code  
│   │   ├── controllers/      # Business logic  
│   │   ├── models/           # Database models  
│   │   ├── routes/           # API routes  
│   │   ├── middleware/       # Custom middleware  
│   │   ├── services/         # Service layer  
│   │   ├── utils/            # Helper functions  
│   │   ├── config/           # Configuration files  
│   │   └── app.js            # Express app setup  
│   ├── tests/                # Backend tests  
│   └── server.js             # Entry point  
├── .env.example              # Example environment variables  
├── package.json              # Dependencies & scripts  
└── README.md                 # This documentation  
```

## ⚙️ Setup & Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/peopleHub.git
cd peopleHub
```

### 2. Install Dependencies
```bash
# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### 3. Set Up Environment Variables
Create a `.env` file in the root directory using `.env.example` as a template:
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/peopleHub
JWT_SECRET=your_jwt_secret_key
EMAIL_SERVICE=smtp.example.com
EMAIL_USER=notifications@yourcompany.com
EMAIL_PASS=your_email_password
```

## 🔐 Environment Variables
| Variable | Description |
|----------|-------------|
| PORT | Server port (default: 5000) |
| NODE_ENV | Environment (development/production) |
| MONGODB_URI | MongoDB connection string |
| JWT_SECRET | Secret key for JWT authentication |
| EMAIL_SERVICE | SMTP service for email notifications |
| EMAIL_USER | Email address for sending notifications |
| EMAIL_PASS | Password for email account |

## 🚀 Running the Application

### Development Mode
```bash
# Run backend with hot-reloading
npm run dev:server

# Run frontend with hot-reloading
npm run dev:client

# Run both concurrently
npm run dev
```

### Production Mode
```bash
# Build the client
npm run build

# Start production server
npm start
```

### Testing
```bash
# Run backend tests
npm run test:server

# Run frontend tests
npm run test:client

# Run all tests
npm test
```

## 📚 API Documentation

### Authentication Endpoints
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/login` | User login | Public |
| POST | `/api/auth/register` | Register new user | Admin |
| GET | `/api/auth/me` | Get current user | Authenticated |

### Employee Endpoints
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/employees` | Fetch all employees | HR, Admin |
| POST | `/api/employees` | Create a new employee | HR, Admin |
| GET | `/api/employees/:id` | Fetch a single employee | HR, Admin, Self |
| PUT | `/api/employees/:id` | Update an employee | HR, Admin, Self |
| DELETE | `/api/employees/:id` | Delete an employee | Admin |

### Leave Management Endpoints
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/leaves/request` | Request leave | All |
| PUT | `/api/leaves/:id/approve` | Approve leave request | HR, Admin |
| GET | `/api/leaves/pending` | View pending requests | HR, Admin |
| GET | `/api/leaves/my` | View own leave requests | All |

*Additional endpoints for attendance, performance reviews, etc. are available.*

## ☁️ Deployment

### 1. Using PM2 (Production Process Manager)
```bash
npm install pm2 -g
pm2 start server/server.js --name "peopleHub"
pm2 save
pm2 startup
```

### 2. Using Docker
```dockerfile
FROM node:16
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

Build & run:
```bash
docker build -t people-hub .
docker run -p 5000:5000 -d people-hub
```

### 3. Cloud Deployment
PeopleHub can be deployed to various cloud platforms:
- AWS Elastic Beanstalk
- Heroku
- Google Cloud Run
- Microsoft Azure

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License
This project is licensed under the MIT License - see the LICENSE file for details.

---

Developed with ❤️ for improving HR workflows | © 2025 Your Company