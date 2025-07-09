// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import RegisterModal from './components/RegisterModal';
import LoginModal from './components/LoginModal';
import DonorDashboard from './pages/DonorDashboard';
import NeedyDashboard from './pages/NeedyDashboard';
import { AuthProvider, AuthContext } from './context/AuthContext';

function App() {
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  return (
    <AuthProvider>
      <Router>

        {showRegister && <RegisterModal onClose={() => setShowRegister(false)} />}
        {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}

        <AuthContext.Consumer>
          {({ auth }) => (
            <Routes>
              <Route path="/" element={<LandingPage onRegister={() => setShowRegister(true)} onLogin={() => setShowLogin(true)} />} />
              <Route path="/donor-dashboard" element={auth.role === 'donor' ? <DonorDashboard /> : <Navigate to="/" />} />
              {/* <Route path="/donor-dashboard"  element = {<DonorDashboard />} /> */}
              <Route path="/needy-dashboard" element={auth.role === 'needy' ? <NeedyDashboard /> : <Navigate to="/" />} />
              {/* <Route path="/needy-dashboard"  element = {<NeedyDashboard />} /> */}
            </Routes>
          )}
        </AuthContext.Consumer>
      </Router>
    </AuthProvider>
  );
}

export default App;
