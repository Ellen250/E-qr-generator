import  { QrCode, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
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
          
          <div className="hidden md:flex items-center space-x-1">
            <a href="#features" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors">
              How It Works
            </a>
            <a href="#about" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors">
              About
            </a>
            <button className="ml-4 btn btn-primary">
              Get Started
            </button>
          </div>
          
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-primary-600 focus:outline-none"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a href="#features" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600">
                Features
              </a>
              <a href="#how-it-works" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600">
                How It Works
              </a>
              <a href="#about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600">
                About
              </a>
              <button className="w-full mt-2 btn btn-primary">
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
 