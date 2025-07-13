# PillShare - Medicine Donation Platform

#### Your drawers are filled with unused medicines that may soon expire. Instead of letting them go to waste, why not give them a second life? <br>
PillShare is a community-driven platform that helps you donate surplus medicines to those who can’t afford them. By sorting your medicine cabinet, you’re not only decluttering — you’re also making a real difference in someone’s life. <br>
Hosted link: https://pillshare.vercel.app/ 
## 🌟 Features

### For Donors
- **Profile Management**: Complete donor profiles with location and contact details
- **Medicine Listing**: Add medicines with details like quantity, expiry date, and category
- **Request Management**: Approve, reject, or complete donation requests
- **Expiry Alerts**: Automatic notifications for medicines nearing expiry
- **Rating System**: Receive ratings and feedback from recipients

### For Needy Users
- **Medicine Search**: Search for medicines by name and location
- **Prescription Upload**: Upload prescriptions for verification (Required)
- **Request Tracking**: Track the status of medicine requests
- **Donor Rating**: Rate and review donors after successful transactions
- **Profile Completion**: Secure profile verification system

### General Features
- **Location-Based Matching**: Find donors and recipients in your area
- **Real-time Notifications**: Get notified about request updates
- **Secure Authentication**: JWT-based authentication system
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Data Security**: Secure handling of personal and medical information

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Multer** - File upload handling
- **bcryptjs** - Password hashing

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)

## 🛠️ Installation

### 1. Clone the Repository
git clone https://github.com/Nandini80/PillShare.git <br>
cd PillShare

# Install backend dependencies
cd server <br>
npm install

# Install frontend dependencies
cd client <br>
npm install

### 3. Environment Setup
Create a `.env` file in the server directory(take reference from .env.example)

### 4. Start the Application
#### Start backend server
nodemon server.js

#### Start frontend
npm run dev

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Donor Routes
- `GET /api/donor/medicines` - Get donor's medicines
- `POST /api/donor/medicines` - Add new medicine
- `DELETE /api/donor/medicines/:id` - Delete medicine
- `GET /api/donor/requests` - Get all requests for donor
- `PUT /api/donor/requests/:id/approve` - Approve request
- `PUT /api/donor/requests/:id/reject` - Reject request
- `PUT /api/donor/requests/:id/complete` - Complete request

### Needy User Routes
- `GET /api/needy/search` - Search for medicines
- `POST /api/needy/request` - Create donation request
- `GET /api/needy/requests` - Get user's requests
- `POST /api/needy/rate` - Rate a donor
- `GET /api/needy/medicines` - Get available medicines
- `GET /api/needy/cities` - Get available cities

---

**Made with ❤️ for the community**

*PillShare - Connecting hearts, sharing health*
