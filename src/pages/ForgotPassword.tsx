import  { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, AlertCircle, X, ArrowLeft, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [formError, setFormError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { resetPassword, error, setError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setError(null);
    setMessage('');
    
    if (!email) {
      setFormError('Please enter your email address');
      return;
    }

    try {
      setIsLoading(true);
      await resetPassword(email);
      setMessage('Check your email for password reset instructions');
    } catch (error: any) {
      const errorMessage = 
        error.code === 'auth/user-not-found' 
          ? 'No account found with this email' 
          : error.message;
      setFormError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 lg:p-12">
        <div className="max-w-md w-full mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-8">
              <Link to="/" className="inline-flex items-center mb-4">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white">
                  <LogIn size={24} />
                </div>
                <span className="ml-2 text-xl font-bold text-gray-900">E-QR <span className="text-primary-600">Generator</span></span>
              </Link>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Reset your password</h2>
              <p className="text-gray-600">We'll send you an email with instructions</p>
            </div>

            {message && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-md"
              >
                <p className="text-green-700 text-sm">{message}</p>
              </motion.div>
            )}

            {(formError || error) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md"
              >
                <div className="flex items-center">
                  <AlertCircle className="text-red-500 mr-2" size={18} />
                  <p className="text-red-700 text-sm">{formError || error}</p>
                  <button 
                    onClick={() => { setFormError(''); setError(null); }} 
                    className="ml-auto text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input pl-10"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary w-full flex justify-center items-center"
                >
                  {isLoading ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  ) : null}
                  Send Reset Link
                </button>
              </div>
            </form>

            <div className="mt-8 text-center">
              <Link to="/login" className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700">
                <ArrowLeft size={16} className="mr-1" />
                Back to login
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:block lg:w-1/2 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1534527489986-3e3394ca569c?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwzfHxsb2dpbiUyMHJlZ2lzdHJhdGlvbiUyMGZvcm0lMjBtb2Rlcm4lMjB1aXxlbnwwfHx8fDE3NDg2MDMwNzh8MA&ixlib=rb-4.1.0&fit=fillmax&h=600&w=800')` }}>
        <div className="h-full w-full bg-black bg-opacity-20 flex items-center justify-center p-12">
          <div className="max-w-xl text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-4xl font-bold mb-6">Forgot your password?</h2>
              <p className="text-lg mb-8">Don't worry, we've got you covered. Enter your email and we'll send you instructions to reset your password.</p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
 