# PillShare - Medicine Donation Platform

PillShare is a community-driven platform that connects medicine donors with those in need, ensuring that surplus medicines reach people who require them most. The platform facilitates safe, verified medicine donations within local communities.

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
\`\`\`bash
git clone https://github.com/yourusername/pillshare.git
cd pillshare
\`\`\`

### 2. Install Dependencies
\`\`\`bash
# Install backend dependencies
npm install

# Install frontend dependencies (if separate)
cd client
npm install
cd ..
\`\`\`

### 3. Environment Setup
Create a `.env` file in the root directory:

\`\`\`env
# Database
MONGODB_URI=mongodb://localhost:27017/pillshare
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pillshare

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here

# Server Configuration
PORT=5000
NODE_ENV=development

# File Upload
UPLOAD_PATH=uploads/
MAX_FILE_SIZE=5242880

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
\`\`\`

### 4. Database Setup
Make sure MongoDB is running on your system, or configure MongoDB Atlas connection in the `.env` file.

### 5. Start the Application
\`\`\`bash
# Start backend server
npm run server

# Start frontend (if separate)
npm run client

# Start both concurrently
npm run dev
\`\`\`

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 📁 Project Structure

\`\`\`
pillshare/
├── client/                     # Frontend React application
│   ├── public/
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   │   ├── donor/         # Donor-specific components
│   │   │   ├── needy/         # Needy user components
│   │   │   ├── ui/            # UI components
│   │   │   ├── AuthModal.jsx
│   │   │   └── Footer.jsx
│   │   ├── context/           # React context providers
│   │   │   └── AuthContext.jsx
│   │   ├── pages/             # Page components
│   │   │   ├── DonorDashboard.jsx
│   │   │   ├── NeedyDashboard.jsx
│   │   │   └── LandingPage.jsx
│   │   ├── services/          # API service functions
│   │   │   ├── authService.js
│   │   │   ├── donorService.js
│   │   │   └── needyService.js
│   │   └── App.jsx
├── server/                     # Backend Node.js application
│   ├── controllers/           # Route controllers
│   │   ├── authController.js
│   │   ├── donorController.js
│   │   └── needyController.js
│   ├── models/               # MongoDB models
│   │   ├── User.js
│   │   ├── Medicine.js
│   │   └── DonationRequest.js
│   ├── routes/               # API routes
│   │   ├── authRoutes.js
│   │   ├── donorRoutes.js
│   │   └── needyRoutes.js
│   ├── middleware/           # Custom middleware
│   ├── uploads/              # File uploads directory
│   └── server.js             # Main server file
├── .env.example              # Environment variables template
├── package.json
└── README.md
\`\`\`

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

## 🎯 Usage Guide

### For Donors

1. **Registration**: Sign up as a donor with your details
2. **Profile Setup**: Complete your profile with contact information and location
3. **Add Medicines**: List medicines you want to donate with:
   - Medicine name and category
   - Quantity available
   - Expiry date
   - Optional description
4. **Manage Requests**: 
   - Review incoming requests
   - Approve/reject requests
   - Mark completed donations
5. **Track Impact**: View your donation history and ratings

### For Needy Users

1. **Registration**: Sign up as a needy user
2. **Profile Completion**: Fill in all required profile information
3. **Search Medicines**: 
   - Upload prescription (required)
   - Search by medicine name and location
4. **Make Requests**: Send requests to donors
5. **Connect**: Get donor contact details after approval
6. **Rate Experience**: Rate donors after receiving medicines

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **File Upload Validation**: Secure file upload with type and size restrictions
- **Prescription Verification**: Required prescription upload for medicine requests
- **Profile Verification**: Complete profile required for platform access
- **Data Sanitization**: Input validation and sanitization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/pillshare/issues) page
2. Create a new issue with detailed description
3. Contact the development team

## 🚧 Roadmap

- [ ] Real-time chat between donors and recipients
- [ ] Email notifications for request updates
- [ ] Mobile application (React Native)
- [ ] Advanced search filters
- [ ] Medicine expiry alerts
- [ ] Donation analytics dashboard
- [ ] Multi-language support
- [ ] Integration with pharmacy APIs

## 👥 Team

- **Frontend Development**: React.js, Tailwind CSS
- **Backend Development**: Node.js, Express.js, MongoDB
- **UI/UX Design**: Modern, responsive design
- **Security**: JWT authentication, data validation

## 📊 Statistics

- **Total Medicines Donated**: Track community impact
- **Active Donors**: Number of registered donors
- **Successful Connections**: Completed medicine transfers
- **Cities Covered**: Geographic reach of the platform

---

**Made with ❤️ for the community**

*PillShare - Connecting hearts, sharing health*
