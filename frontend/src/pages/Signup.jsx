import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // 1. Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        }
      }
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setName('');
    setEmail('');
    setPassword('');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-darker flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="flex justify-center mb-6">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center shadow-[0_0_30px_var(--color-primary-glow)]">
            <span className="text-darker font-black text-2xl">LT</span>
          </div>
        </div>
        <h2 className="mt-2 text-center text-3xl font-black text-white tracking-tight">
          Join LIVE TECH
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Create an account to start your journey
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="glass-panel py-8 px-4 sm:px-10 border border-white/10">
          {error && (
            <div className="mb-4 bg-red-500/10 border border-red-500/50 p-3 rounded-lg text-sm text-red-400 text-center">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 bg-green-500/10 border border-green-500/50 p-3 rounded-lg text-sm text-green-400 text-center">
              Check your email for the confirmation link!
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSignup}>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-white/10 rounded-lg bg-dark/50 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">
                Email address
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-white/10 rounded-lg bg-dark/50 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-white/10 rounded-lg bg-dark/50 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-darker bg-gradient-to-r from-secondary to-primary hover:from-primary hover:to-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark focus:ring-primary transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Sign up'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-gray-400">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/login"
                className="w-full flex justify-center py-2.5 px-4 border border-white/10 rounded-lg shadow-sm text-sm font-medium text-white bg-white/5 hover:bg-white/10 transition-colors"
              >
                Log in instead
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
