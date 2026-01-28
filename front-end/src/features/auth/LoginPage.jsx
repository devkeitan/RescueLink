import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ShieldAlert, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // Replace with actual API call
    if (email && password) {
      login({ email, name: email.split('@')[0] });
      navigate('/dashboard');
    } else {
      setError('Please enter valid credentials');
    }
  };

  return (
    <div className="flex w-full items-center justify-center min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
     
     

      <div className="relative w-full max-w-md mx-4">
        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Red Header Section */}
          <div className="bg-gradient-to-r from-red-600 to-red-500 p-8 text-white text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                <ShieldAlert className="w-12 h-12" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">RescueLink</h1>
            <p className="text-red-100 text-sm">Emergency Response System</p>
          </div>

          {/* Form Section */}
          <div className="p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
              <p className="text-gray-500 text-sm mt-1">Sign in to access your dashboard</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" />
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="mail@gmail.com"
                    className="pl-11 h-12 border-gray-300 focus:border-red-500 focus:ring-red-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="pl-11 h-12 border-gray-300 focus:border-red-500 focus:ring-red-500"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <span className="text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-red-600 hover:text-red-700 font-medium">
                  Forgot password?
                </a>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold shadow-lg shadow-red-500/30 transition-all"
              >
                Sign In
              </Button>
            </form>

            {/* Emergency Notice */}
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-red-900">Emergency Access</p>
                  <p className="text-xs text-red-700 mt-1">
                    For urgent support, call <span className="font-bold">911</span> or contact emergency services
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-6 text-sm text-gray-600">
          <p>© 2026 RescueLink. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
