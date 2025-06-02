import  { useState } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Code, Monitor, Smartphone, Layout, Settings, User } from 'lucide-react';
import QRCodeGenerator from './components/QRCodeGenerator';
import BarcodeGenerator from './components/BarcodeGenerator';
import { CodeType } from './types';
import { Link } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Custom components for missing Lucide icons
const Mail = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"></rect>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
  </svg>
);

const Phone = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

const MessageSquare = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const Wifi = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
    <path d="M1.42 9a16 16 0 0 1 21.16 0"></path>
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
    <line x1="12" y1="20" x2="12.01" y2="20"></line>
  </svg>
);

const MapPin = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

function App() {
  const [activeTab, setActiveTab] = useState<'qr' | 'barcode'>('qr');
  const [qrType, setQrType] = useState<CodeType>('url');
  const [barcodeType, setBarcodeType] = useState<CodeType>('code128');
  const { currentUser } = useAuth();

  const handleTabChange = (tab: 'qr' | 'barcode') => {
    setActiveTab(tab);
  };

  const handleQrTypeChange = (type: CodeType) => {
    setQrType(type);
  };

  const handleBarcodeTypeChange = (type: CodeType) => {
    setBarcodeType(type);
  };

  const qrTypes = [
    { id: 'url', name: 'Website URL', icon: <Monitor size={18} /> },
    { id: 'text', name: 'Text', icon: <Layout size={18} /> },
    { id: 'email', name: 'Email', icon: <Mail size={18} /> },
    { id: 'phone', name: 'Phone', icon: <Phone size={18} /> },
    { id: 'sms', name: 'SMS', icon: <MessageSquare size={18} /> },
    { id: 'wifi', name: 'WiFi', icon: <Wifi size={18} /> },
    { id: 'location', name: 'Location', icon: <MapPin size={18} /> },
    { id: 'vcard', name: 'Contact', icon: <User size={18} /> }
  ];

  const barcodeTypes = [
    { id: 'code128', name: 'Code 128', description: 'Alphanumeric, variable length' },
    { id: 'ean13', name: 'EAN-13', description: '12 digits + check digit' },
    { id: 'upc', name: 'UPC', description: '11 digits + check digit' },
    { id: 'code39', name: 'Code 39', description: 'Alphanumeric, special chars' }
  ];

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

            {currentUser ? (
              <Link 
                to="/dashboard" 
                className="flex items-center text-gray-700 hover:text-primary-600 font-medium"
              >
                <User size={20} className="mr-2" />
                Dashboard
              </Link>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Generate Professional QR Codes & Barcodes</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create custom QR codes and barcodes for your business, products, or personal use. 
            Easy to use, fast and professional.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-12">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => handleTabChange('qr')}
              className={`flex-1 py-4 text-center font-medium text-sm md:text-base transition ${
                activeTab === 'qr'
                  ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex justify-center items-center">
                <QrCode size={20} className="mr-2" />
                QR Code Generator
              </div>
            </button>
            <button
              onClick={() => handleTabChange('barcode')}
              className={`flex-1 py-4 text-center font-medium text-sm md:text-base transition ${
                activeTab === 'barcode'
                  ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex justify-center items-center">
                <Code size={20} className="mr-2" />
                Barcode Generator
              </div>
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'qr' && (
              <div>
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">QR Code Type</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {qrTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => handleQrTypeChange(type.id as CodeType)}
                        className={`p-3 rounded-lg border ${
                          qrType === type.id
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        } flex items-center justify-center md:justify-start`}
                      >
                        <span className="w-6 h-6 flex items-center justify-center mr-2">
                          {type.icon}
                        </span>
                        <span className="font-medium">{type.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <QRCodeGenerator codeType={qrType} />
              </div>
            )}

            {activeTab === 'barcode' && (
              <div>
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Barcode Type</label>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    {barcodeTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => handleBarcodeTypeChange(type.id as CodeType)}
                        className={`p-3 rounded-lg border ${
                          barcodeType === type.id
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        <span className="block font-medium">{type.name}</span>
                        <span className="text-xs">{type.description}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <BarcodeGenerator codeType={barcodeType} />
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why Choose Our QR Code Generator</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Customizable Design',
                description: 'Change colors, add logos, and adjust size to match your brand identity.',
                icon: <Settings className="text-primary-600" size={24} />
              },
              {
                title: 'Multiple QR Code Types',
                description: 'Generate QR codes for URLs, text, emails, phone numbers, WiFi networks and more.',
                icon: <Layout className="text-primary-600" size={24} />
              },
              {
                title: 'Mobile Friendly',
                description: 'All QR codes are tested for optimal scanning performance on mobile devices.',
                icon: <Smartphone className="text-primary-600" size={24} />
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-sm text-center"
              >
                <div className="inline-block p-3 bg-primary-50 rounded-full mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Ready to create professional QR codes?</h2>
            <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
              Sign up for free and unlock additional features like saving your QR codes, tracking scans, and more.
            </p>
            <Link
              to="/register"
              className="inline-block bg-white text-primary-700 hover:bg-gray-100 px-6 py-3 rounded-md font-medium"
            >
              Create Free Account
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white">
                <QrCode size={18} />
              </div>
              <span className="ml-2 text-lg font-bold text-gray-900">E-QR <span className="text-primary-600">Generator</span></span>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-sm text-gray-500">
                &copy; {new Date().getFullYear()} E-QR Generator. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Additional styles for input and buttons */}
      <style jsx>{`
        .input {
          @apply block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm;
        }
        
        .btn {
          @apply inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500;
        }
        
        .btn-primary {
          @apply bg-primary-600 text-white hover:bg-primary-700;
        }
        
        .btn-secondary {
          @apply bg-white text-gray-700 border-gray-300 hover:bg-gray-50;
        }
        
        .qr-container {
          transition: transform 0.3s ease;
        }
        
        .qr-container:hover {
          transform: scale(1.02);
        }
        
        .loader {
          border: 3px solid rgba(79, 70, 229, 0.1);
          border-radius: 50%;
          border-top: 3px solid rgba(79, 70, 229, 1);
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default App;
 