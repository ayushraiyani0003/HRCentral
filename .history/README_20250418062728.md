# PeopleHub - HR Management System

![Version](https://img.shields.io/badge/version-1.0.0-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![React](https://img.shields.io/badge/React-18.x-61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-18.x-339933)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0-47A248)

## 🌟 Overview

PeopleHub is a comprehensive HR management platform designed to streamline your company's human resources operations. This full-stack application centralizes employee management, automates HR workflows, and provides powerful analytics to support data-driven decision making.

![PeopleHub Dashboard](https://via.placeholder.com/800x400?text=PeopleHub+Dashboard)

## 🚀 Key Features

- **Employee Management** - Complete employee lifecycle from onboarding to offboarding
- **Attendance Tracking** - Digital check-in/out with reporting
- **Leave Management** - Request, approve, and track time off
- **Performance Reviews** - Conduct and manage evaluations
- **Document Management** - Securely store and manage HR files
- **Role-based Access** - Tailored views and permissions for different roles
- **Reporting & Analytics** - Actionable insights from your HR data
- **Mobile Responsive** - Access from any device

## 💻 Tech Stack

### Frontend
- **React** - UI library
- **Redux** - State management
- **React Router** - Navigation
- **Material UI** - Component library
- **Chart.js** - Data visualization
- **Formik & Yup** - Form handling and validation

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Multer** - File uploads
- **Nodemailer** - Email functionality

## 📋 Prerequisites

- Node.js (v18.x or higher)
- MongoDB (v6.0 or higher)
- npm or yarn

## 🔧 Installation

### Clone the repository
```bash
git clone https://github.com/your-username/peopleHub.git
cd peopleHub
```

### Install dependencies
```bash
# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### Configure environment variables
Create `.env` files in both the root and client directories.

Root `.env`:
```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/peopleHub
JWT_SECRET=your_jwt_secret
EMAIL_SERVICE=smtp.yourservice.com
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

Client `.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 🏃 Running the Application

### Development mode
```bash
# Run the full stack application (both frontend and backend)
npm run dev

# Run backend only
npm run server

# Run frontend only
npm run client
```

### Production mode
```bash
# Build the client
npm run build

# Run in production mode
npm start
```

## 📱 Application Structure

```
peopleHub/
├── client/                    # React frontend
│   ├── public/                # Static files
│   └── src/                   # React components & logic
│       ├── components/        # Reusable components
│       ├── pages/             # Page components
│       ├── redux/             # State management
│       ├── services/          # API services
│       ├── utils/             # Helper functions
│       ├── App.js             # Main component
│       └── index.js           # Entry point
├── server/                    # Node.js backend
│   ├── config/                # Configuration
│   ├── controllers/           # Request handlers
│   ├── middleware/            # Custom middleware
│   ├── models/                # Database models
│   ├── routes/                # API routes
│   ├── services/              # Business logic
│   └── utils/                 # Helper functions
├── uploads/                   # Uploaded files
├── .gitignore                 # Git ignore file
├── package.json               # Project dependencies
└── README.md                  # Project documentation
```

## 🔒 Authentication & Authorization

PeopleHub implements JWT-based authentication with role-based access control:

- **Admin** - Full system access
- **HR Manager** - HR operations management
- **Department Manager** - Team-specific access
- **Employee** - Self-service access

## 🚢 Deployment

### Using Docker
```bash
# Build the Docker image
docker build -t peoplehub .

# Run the container
docker run -p 5000:5000 -d peoplehub
```

### Deployment Options
- **Heroku** - Easy deployment with Procfile included
- **AWS** - EC2 or Elastic Beanstalk recommended
- **Digital Ocean** - Droplets or App Platform

## 📊 Demo Data

To populate your development database with sample data:
```bash
npm run seed
```

This will create demo accounts with the following credentials:
- Admin: admin@example.com / password123
- HR Manager: hr@example.com / password123
- Employee: employee@example.com / password123

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📧 Contact

Your Name - your.email@example.com

Project Link: [https://github.com/your-username/peopleHub](https://github.com/your-username/peopleHub)

---

Made with ❤️ by Sunchaser Structure pvt. ltd.