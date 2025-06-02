import  { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { QrCode, LogOut, User, Settings, Plus, History, FileText, ArrowRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Custom CheckCircle component since we can't import it from lucide-react
const CheckCircle = ({ size = 20, className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const recentCodes = [
    { id: 1, type: 'qr', name: 'Company Website', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2) },
    { id: 2, type: 'barcode', name: 'Product Barcode', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24) },
    { id: 3, type: 'qr', name: 'WiFi Network', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) },
  ];

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHrs < 1) {
      return 'Just now';
    } else if (diffHrs < 24) {
      return `${diffHrs} hour${diffHrs > 1 ? 's' : ''} ago`;
    } else {
      const diffDays = Math.floor(diffHrs / 24);
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white">
                  <QrCode size={24} />
                </div>
                <span className="ml-2 text-xl font-bold text-gray-900">E-QR <span className="text-primary-600">Generator</span></span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="flex items-center text-gray-700 hover:text-primary-600 focus:outline-none">
                  <div className="flex items-center space-x-2">
                    {currentUser?.photoURL ? (
                      <img 
                        src={currentUser.photoURL} 
                        alt="Profile" 
                        className="h-8 w-8 rounded-full object-cover border-2 border-primary-100"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                        <User size={18} />
                      </div>
                    )}
                    <span className="text-sm font-medium">
                      {currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User'}
                    </span>
                  </div>
                </button>
              </div>
              
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center text-gray-700 hover:text-primary-600 focus:outline-none"
              >
                {isLoggingOut ? (
                  <span className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <LogOut size={20} />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User'}!
          </h1>
          <p className="text-gray-600">
            Generate, manage and track your QR codes and barcodes
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Codes', value: '23', icon: <FileText size={20} className="text-blue-500" /> },
            { label: 'Total Scans', value: '1,254', icon: <History size={20} className="text-green-500" /> },
            { label: 'Active Codes', value: '18', icon: <CheckCircle size={20} className="text-teal-500" /> },
            { label: 'Subscription', value: 'Free Plan', icon: <Star size={20} className="text-yellow-500" /> }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                  {stat.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Code</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  onClick={() => navigate('/')}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mr-3">
                      <QrCode size={20} />
                    </div>
                    <span className="font-medium">QR Code</span>
                  </div>
                  <ArrowRight size={16} className="text-gray-400" />
                </button>
                
                <button 
                  onClick={() => navigate('/')}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mr-3">
                      {/* Custom Barcode Icon */}
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="5" width="18" height="14" rx="2" />
                        <line x1="7" y1="7" x2="7" y2="17" />
                        <line x1="11" y1="7" x2="11" y2="17" />
                        <line x1="15" y1="7" x2="15" y2="17" />
                        <line x1="19" y1="7" x2="19" y2="17" />
                      </svg>
                    </div>
                    <span className="font-medium">Barcode</span>
                  </div>
                  <ArrowRight size={16} className="text-gray-400" />
                </button>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent Codes</h2>
                <button className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center">
                  View all
                  <ArrowRight size={16} className="ml-1" />
                </button>
              </div>
              
              <div className="space-y-3">
                {recentCodes.map((code) => (
                  <div 
                    key={code.id}
                    className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 mr-3">
                        {code.type === 'qr' ? (
                          <QrCode size={16} />
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="5" width="18" height="14" rx="2" />
                            <line x1="7" y1="7" x2="7" y2="17" />
                            <line x1="11" y1="7" x2="11" y2="17" />
                            <line x1="15" y1="7" x2="15" y2="17" />
                            <line x1="19" y1="7" x2="19" y2="17" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{code.name}</p>
                        <p className="text-xs text-gray-500">{formatDate(code.createdAt)}</p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-primary-600">
                      <ArrowRight size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Premium banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl shadow-sm overflow-hidden text-white p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">Upgrade to Premium</h2>
              <p className="text-primary-100 mb-4 md:mb-0 max-w-xl">
                Get unlimited QR codes, detailed analytics, bulk generation, and custom branding options.
              </p>
            </div>
            <button className="btn bg-white text-primary-700 hover:bg-gray-100 px-6">
              Upgrade Now
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
 