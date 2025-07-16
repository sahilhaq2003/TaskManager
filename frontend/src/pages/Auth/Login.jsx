import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/layouts/AuthLayout';
import Input from '../../components/layouts/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) return setError('Enter a valid email.');
    if (!password) return setError('Enter your password.');

    setError(null);
    setLoading(true);

    try {
      const res = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token, role } = res.data;

      localStorage.setItem('token', token);
      updateUser(res.data);

      navigate(role === 'admin' ? '/admin/dashboard' : '/user/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md mx-auto px-4 sm:px-8 py-10">
        <div className="bg-white/30 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/10">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">Welcome Back</h2>
          <p className="text-sm text-gray-600 mb-6 text-center">Login to continue</p>

          {error && (
            <p className="text-red-500 text-sm mb-4 text-center" aria-live="polite">
              {error}
            </p>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <Input
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              label="Email"
              placeholder="you@example.com"
              type="email"
            />

            <Input
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              label="Password"
              placeholder="••••••••"
              type="password"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl shadow-md transition-all text-sm font-semibold disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <p className="text-xs text-center text-gray-500 mt-4">
              Don’t have an account?{' '}
              <Link to="/signup" className="text-blue-600 hover:underline font-medium">
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
