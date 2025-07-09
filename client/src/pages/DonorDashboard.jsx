import React, { useState } from 'react';
import { 
  Heart, 
  User, 
  Settings, 
  Plus, 
  Package, 
  Calendar,
  MapPin,
  Pill,
  Trash2,
  Edit3,
  Phone,
  Mail,
  Shield,
  Clock,
  Bell,
  LogOut,
  Home,
  Search,
  Filter,
  AlertTriangle
} from 'lucide-react';

const DonorDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showExpiredAlert, setShowExpiredAlert] = useState(false);

  // Sample donated medicines data
  const [donatedMedicines, setDonatedMedicines] = useState([
    {
      id: 1,
      name: 'Paracetamol 500mg',
      quantity: 50,
      expiryDate: '2025-12-15',
      category: 'Pain Relief',
      description: 'Sealed box, unused tablets',
      dateAdded: '2025-01-15',
      status: 'Available'
    },
    {
      id: 2,
      name: 'Amoxicillin 250mg',
      quantity: 30,
      expiryDate: '2025-08-20',
      category: 'Antibiotic',
      description: 'Partial box, well preserved',
      dateAdded: '2025-02-10',
      status: 'Available'
    },
    {
      id: 3,
      name: 'Ibuprofen 400mg',
      quantity: 25,
      expiryDate: '2025-03-01',
      category: 'Pain Relief',
      description: 'Original packaging',
      dateAdded: '2025-01-20',
      status: 'Expired'
    }
  ]);

  const [profile, setProfile] = useState({
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+91 9876543210',
    address: 'Green Park, New Delhi',
    registrationDate: '2024-11-15'
  });

  const isExpired = (expiryDate) => {
    return new Date(expiryDate) < new Date();
  };

  const expiredMedicines = donatedMedicines.filter(medicine => isExpired(medicine.expiryDate));

  const handleDeleteMedicine = (id) => {
    setDonatedMedicines(donatedMedicines.filter(medicine => medicine.id !== id));
  };

  const handleDeleteExpired = () => {
    setDonatedMedicines(donatedMedicines.filter(medicine => !isExpired(medicine.expiryDate)));
    setShowExpiredAlert(false);
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Welcome back, {profile.name}!</h2>
            <p className="text-gray-600 mt-1">Thank you for making a difference in people's lives</p>
          </div>
          <div className="hidden md:block">
            <Heart className="w-16 h-16 text-red-400" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Donations</p>
              <p className="text-2xl font-bold text-blue-600">{donatedMedicines.length}</p>
            </div>
            <Package className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Available Medicines</p>
              <p className="text-2xl font-bold text-green-600">
                {donatedMedicines.filter(m => !isExpired(m.expiryDate)).length}
              </p>
            </div>
            <Pill className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Expired Items</p>
              <p className="text-2xl font-bold text-red-600">{expiredMedicines.length}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Expired Medicine Alert */}
      {expiredMedicines.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-800">
                You have {expiredMedicines.length} expired medicine(s) that should be removed
              </p>
            </div>
            <button
              onClick={handleDeleteExpired}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Remove All Expired
            </button>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {donatedMedicines.slice(0, 3).map(medicine => (
            <div key={medicine.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Pill className="w-4 h-4 text-blue-500 mr-3" />
                <div>
                  <p className="font-medium">{medicine.name}</p>
                  <p className="text-sm text-gray-600">Added on {medicine.dateAdded}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${
                isExpired(medicine.expiryDate) 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {isExpired(medicine.expiryDate) ? 'Expired' : 'Available'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({...profile, name: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({...profile, email: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => setProfile({...profile, phone: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <input
              type="text"
              value={profile.address}
              onChange={(e) => setProfile({...profile, address: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="mt-6">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );

  const renderDonate = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Donate Medicine</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Medicine Name</label>
            <input
              type="text"
              placeholder="Enter medicine name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
            <input
              type="number"
              placeholder="Enter quantity"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
            <input
              type="date"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Pain Relief</option>
              <option>Antibiotic</option>
              <option>Vitamin</option>
              <option>Other</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              placeholder="Additional details about the medicine condition..."
              rows="3"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="mt-6">
          <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
            <Plus className="w-4 h-4 mr-2 inline" />
            Add Medicine
          </button>
        </div>
      </div>
    </div>
  );

  const renderMyDonations = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">My Donations</h3>
        <div className="flex space-x-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Filter className="w-4 h-4 mr-2 inline" />
            Filter
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            <Plus className="w-4 h-4 mr-2 inline" />
            Add New
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {donatedMedicines.map(medicine => (
          <div key={medicine.id} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-semibold text-gray-800">{medicine.name}</h4>
              <span className={`px-2 py-1 rounded-full text-xs ${
                isExpired(medicine.expiryDate) 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {isExpired(medicine.expiryDate) ? 'Expired' : 'Available'}
              </span>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Package className="w-4 h-4 mr-2" />
                Quantity: {medicine.quantity}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                Expires: {medicine.expiryDate}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Pill className="w-4 h-4 mr-2" />
                Category: {medicine.category}
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4">{medicine.description}</p>

            <div className="flex justify-between items-center">
              <button className="text-blue-600 hover:text-blue-800 transition-colors">
                <Edit3 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleDeleteMedicine(medicine.id)}
                className="text-red-600 hover:text-red-800 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Update Password
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-gray-600">Receive updates about your donations</p>
            </div>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg">ON</button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">SMS Notifications</p>
              <p className="text-sm text-gray-600">Get notified about medicine requests</p>
            </div>
            <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg">OFF</button>
          </div>
        </div>
      </div>
    </div>
  );

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'donate', label: 'Donate', icon: Plus },
    { id: 'donations', label: 'My Donations', icon: Package },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center">
                <Heart className="w-8 h-8 text-red-500 mr-2" />
                <span className="text-xl font-bold text-gray-900">PillShare</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Bell className="w-5 h-5 text-gray-600 hover:text-gray-800 cursor-pointer" />
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">{profile.name}</span>
              </div>
              <LogOut className="w-5 h-5 text-gray-600 hover:text-gray-800 cursor-pointer" />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <nav className="space-y-2">
                {menuItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${
                      activeTab === item.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'profile' && renderProfile()}
            {activeTab === 'donate' && renderDonate()}
            {activeTab === 'donations' && renderMyDonations()}
            {activeTab === 'settings' && renderSettings()}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <Heart className="w-8 h-8 text-red-500 mr-2" />
                <span className="text-xl font-bold">PillShare</span>
              </div>
              <p className="text-gray-400 mb-4">
                Connecting medicine donors with those in need. Making healthcare accessible for everyone, one donation at a time.
              </p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
                  <span className="text-sm font-bold">f</span>
                </div>
                <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-500 transition-colors">
                  <span className="text-sm font-bold">t</span>
                </div>
                <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-800 transition-colors">
                  <span className="text-sm font-bold">in</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Safety Guidelines</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2025 PillShare. All rights reserved.
              </p>
              <div className="flex items-center space-x-6 mt-4 md:mt-0">
                <div className="flex items-center text-gray-400">
                  <Phone className="w-4 h-4 mr-2" />
                  <span className="text-sm">+91 1234567890</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <Mail className="w-4 h-4 mr-2" />
                  <span className="text-sm">support@pillshare.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DonorDashboard;