import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ShieldAlert, Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from './AuthContext';
import { Link } from 'react-router-dom';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(''); 
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await forgotPassword(email);
      setMessage(
        'If an account with that email exists, you will receive a password reset link.'
      );
    } catch (err) {
      // Do not reveal if account exists or not
      // Just show generic error
      setMessage(
        'An error occurred while sending reset instructions. Please try again later.'
      );
      // Optional: log for debugging
      console.error('Forgot password error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full items-center justify-center min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      <div className="relative w-full max-w-md mx-4">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-red-600 to-red-500 p-8 text-white text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                <ShieldAlert className="w-12 h-12" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">RescueLink</h1>
            <p className="text-red-100 text-sm">Account Recovery</p>
          </div>

          <div className="p-8">
            {!message ? (
              <>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Forgot Password?</h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Enter your email and we'll send you instructions.
                  </p>
                </div>

                {message && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4" />
                    {message}
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
                        className="pl-11 h-12 border-gray-300 focus:border-red-500"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold shadow-lg shadow-red-500/30"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      'Send Reset Link'
                    )}
                  </Button>
                </form>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="flex justify-center mb-4">
                  <CheckCircle2 className="w-16 h-16 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Check your email</h2>
                <p className="text-gray-500 text-sm mt-2 mb-6">
                  We've sent a password reset link to{' '}
                  <span className="font-semibold text-gray-900">{email}</span>
                </p>
                <Button
                  variant="outline"
                  onClick={() => setMessage('')}
                  className="w-full border-gray-300"
                >
                  Didn't get the email? Try again
                </Button>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-100">
              <Link
                to="/"
                className="flex items-center justify-center gap-2 text-red-600 font-semibold hover:text-red-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}