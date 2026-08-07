import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import { AnimatedNavFramer } from '../components/ui/navigation-menu';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const result = await register(username, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Failed to register');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-4 relative overflow-hidden font-body-md selection:bg-primary selection:text-on-primary">
      {/* Background Gradient to match the theme */}
      <div className="absolute inset-0 bg-transparent"></div>

      <AnimatedNavFramer />

      {/* Floating Card Container */}
      <div className="relative z-10 perspective-1000 mt-16 w-full max-w-md">
        
        {/* Static Card */}
        <div className="w-full glass-panel rounded-2xl p-8 shadow-2xl relative">
          <div className="text-center mb-8">
            <h2 className="font-display-lg-mobile text-display-lg-mobile text-on-surface mb-2">Create Account</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Join the secure blockchain network</p>
          </div>

          {error && (
            <div className="bg-error/10 border border-error/50 text-error px-4 py-3 rounded-lg mb-6 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2 uppercase">
                Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-surface border border-outline-variant/50 rounded-lg focus:outline-none focus:border-tertiary focus:ring-1 focus:ring-tertiary text-on-surface placeholder-outline-variant transition-colors"
                placeholder="Choose a username"
              />
            </div>

            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2 uppercase">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-surface border border-outline-variant/50 rounded-lg focus:outline-none focus:border-tertiary focus:ring-1 focus:ring-tertiary text-on-surface placeholder-outline-variant transition-colors"
                placeholder="Choose a password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary font-headline-sm text-[20px] font-semibold py-3 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <p className="mt-8 text-center text-on-surface-variant text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-tertiary hover:text-tertiary-container font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
