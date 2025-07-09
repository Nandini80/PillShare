import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  User, 
  Settings, 
  Bell, 
  LogOut, 
  Heart, 
  Pill, 
  Clock, 
  Phone, 
  Mail, 
  FileText,
  Filter,
  ChevronRight,
  Star
} from 'lucide-react';

const NeedyDashboard = () => {
  const [activeTab, setActiveTab] = useState('find');
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [showPrescription, setShowPrescription] = useState(false);

  const mockSearchResults = [
    {
      id: 1,
      donorName: "Dr. Rajesh Kumar",
      medicine: "Paracetamol 500mg",
      quantity: "50 tablets",
      expiry: "2025-12-15",
      distance: "2.3 km",
      phone: "+91 9876543210",
      address: "Sector 15, Faridabad",
      verified: true,
      rating: 4.8,
      donations: 12
    },
    {
      id: 2,
      donorName: "Mrs. Priya Sharma",
      medicine: "Paracetamol 500mg",
      quantity: "30 tablets",
      expiry: "2025-10-20",
      distance: "3.7 km",
      phone: "+91 9876543211",
      address: "NIT Faridabad",
      verified: true,
      rating: 4.9,
      donations: 8
    },
    {
      id: 3,
      donorName: "Mr. Amit Singh",
      medicine: "Paracetamol 500mg",
      quantity: "20 tablets",
      expiry: "2025-11-30",
      distance: "5.1 km",
      phone: "+91 9876543212",
      address: "Old Faridabad",
      verified: false,
      rating: 4.5,
      donations: 5
    }
  ];

  const handleSearch = () => {
    if (searchQuery && selectedRegion) {
      setSearchResults(mockSearchResults);
    }
  };

  const recentSearches = [
    { medicine: "Crocin 650mg", region: "Faridabad", date: "2025-07-08" },
    { medicine: "Amoxicillin 250mg", region: "Faridabad", date: "2025-07-07" },
    { medicine: "Ibuprofen 400mg", region: "Faridabad", date: "2025-07-06" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-red-500 mr-2" />
              <span className="text-xl font-bold text-gray-900">PillShare</span>
            </div>
            <div className="flex items-center space-x-4">
              <Bell className="h-6 w-6 text-gray-500 cursor-pointer hover:text-gray-700" />
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">John Doe</span>
                <LogOut className="h-5 w-5 text-gray-500 cursor-pointer hover:text-gray-700" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border">
              <nav className="p-4 space-y-2">
                <button
                  onClick={() => setActiveTab('find')}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'find' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Search className="h-5 w-5 mr-3" />
                  Find Medicine
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'profile' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <User className="h-5 w-5 mr-3" />
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'settings' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Settings className="h-5 w-5 mr-3" />
                  Settings
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'find' && (
              <div className="space-y-6">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-bold mb-2">Find Medicine Near You</h1>
                      <p className="text-blue-100">Connect with generous donors in your area</p>
                    </div>
                    <Heart className="h-16 w-16 text-white opacity-20" />
                  </div>
                </div>

                {/* Search Section */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Search for Medicine</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Medicine Name
                      </label>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="e.g., Paracetamol 500mg"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Region
                      </label>
                      <select
                        value={selectedRegion}
                        onChange={(e) => setSelectedRegion(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Region</option>
                        <option value="faridabad">Faridabad</option>
                        <option value="gurgaon">Gurgaon</option>
                        <option value="delhi">Delhi</option>
                        <option value="noida">Noida</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Prescription
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Click to upload prescription</p>
                      <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
                    </div>
                  </div>

                  <button
                    onClick={handleSearch}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <Search className="h-5 w-5 mr-2" />
                    Search Donors
                  </button>
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-gray-900">
                        Search Results ({searchResults.length})
                      </h2>
                      <button className="flex items-center text-blue-600 hover:text-blue-700">
                        <Filter className="h-4 w-4 mr-1" />
                        Filter
                      </button>
                    </div>
                    <div className="space-y-4">
                      {searchResults.map((donor) => (
                        <div key={donor.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center mb-2">
                                <h3 className="font-semibold text-gray-900 mr-2">{donor.donorName}</h3>
                                {donor.verified && (
                                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                    Verified
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mb-1">
                                <Pill className="h-4 w-4 inline mr-1" />
                                {donor.medicine} - {donor.quantity}
                              </p>
                              <p className="text-sm text-gray-600 mb-1">
                                <MapPin className="h-4 w-4 inline mr-1" />
                                {donor.address} • {donor.distance}
                              </p>
                              <p className="text-sm text-gray-600 mb-2">
                                <Clock className="h-4 w-4 inline mr-1" />
                                Expires: {donor.expiry}
                              </p>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <div className="flex items-center">
                                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                                  {donor.rating}
                                </div>
                                <span>{donor.donations} donations</span>
                              </div>
                            </div>
                            <div className="flex flex-col space-y-2 ml-4">
                              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm">
                                <Phone className="h-4 w-4 mr-1" />
                                Call
                              </button>
                              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center text-sm">
                                <Mail className="h-4 w-4 mr-1" />
                                Message
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Searches */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Searches</h2>
                  <div className="space-y-3">
                    {recentSearches.map((search, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{search.medicine}</p>
                          <p className="text-sm text-gray-600">{search.region} • {search.date}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      defaultValue="John Doe"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      defaultValue="john@example.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      defaultValue="+91 9876543210"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>Faridabad</option>
                      <option>Gurgaon</option>
                      <option>Delhi</option>
                      <option>Noida</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <textarea
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      defaultValue="123 Main Street, Faridabad, Haryana"
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Update Profile
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Settings</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-md font-medium text-gray-900 mb-3">Change Password</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                        <input
                          type="password"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                        <input
                          type="password"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                        <input
                          type="password"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Update Password
                    </button>
                  </div>
                  
                  <div className="border-t pt-6">
                    <h3 className="text-md font-medium text-gray-900 mb-3">Notification Preferences</h3>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3" defaultChecked />
                        <span className="text-sm text-gray-700">Email notifications for new donations</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3" defaultChecked />
                        <span className="text-sm text-gray-700">SMS notifications for urgent requests</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3" />
                        <span className="text-sm text-gray-700">Weekly summary reports</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <Heart className="h-8 w-8 text-red-500 mr-2" />
                <span className="text-xl font-bold">PillShare</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Connecting medicine donors with those in need. Making healthcare accessible for everyone, one donation at a time.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
                  <span className="text-white font-semibold">f</span>
                </div>
                <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-500 transition-colors">
                  <span className="text-white font-semibold">t</span>
                </div>
                <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-800 transition-colors">
                  <span className="text-white font-semibold">in</span>
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
          
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2025 PillShare. All rights reserved.</p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <div className="flex items-center text-gray-400">
                <Phone className="h-4 w-4 mr-2" />
                <span className="text-sm">+91 1234567890</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Mail className="h-4 w-4 mr-2" />
                <span className="text-sm">support@pillshare.com</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NeedyDashboard;