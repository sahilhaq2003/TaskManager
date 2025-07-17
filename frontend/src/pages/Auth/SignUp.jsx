import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthLayout from '../../components/layouts/AuthLayout';
import { validateEmail } from '../../utils/helper';
import ProfilePhotoSelector from '../../components/layouts/Inputs/ProfilePhotoSelector';
import { API_PATHS } from '../../utils/apiPaths';


const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [adminInviteToken, setAdminInviteToken] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!profilePic) return setError('Upload a profile picture.');
    if (fullName.length < 3) return setError('Name must be at least 3 characters.');
    if (!validateEmail(email)) return setError('Enter a valid email.');
    if (password.length < 8) return setError('Password must be at least 8 characters.');
    if (password !== confirmPassword) return setError('Passwords do not match.');

    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', profilePic);

      const uploadRes = await axios.post(API_PATHS.IMAGE.UPLOAD_IMAGE, formData);
      const profileImageUrl = uploadRes.data.imageUrl;

      const res = await axios.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
        profileImageUrl,
        adminInviteToken,
      });

      const { token, role } = res.data;

      localStorage.setItem('token', token);
      navigate(role === 'admin' ? '/admin-dashboard' : '/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(msg);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md mx-auto px-4 sm:px-8 py-10">
        <div className="bg-white/30 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/10">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">Create Account</h2>
          <p className="text-sm text-gray-600 mb-6 text-center">Join us today</p>

          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}

          <form onSubmit={handleSignUp} className="space-y-5">
            <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full Name"
              className="w-full border border-gray-300 rounded-xl p-2 focus:ring-2 focus:ring-blue-500 text-sm"
            />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full border border-gray-300 rounded-xl p-2 focus:ring-2 focus:ring-blue-500 text-sm"
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full border border-gray-300 rounded-xl p-2 focus:ring-2 focus:ring-blue-500 text-sm"
            />

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="w-full border border-gray-300 rounded-xl p-2 focus:ring-2 focus:ring-blue-500 text-sm"
            />

            <input
              type="text"
              value={adminInviteToken}
              onChange={(e) => setAdminInviteToken(e.target.value)}
              placeholder="Admin Token (Optional)"
              className="w-full border border-gray-300 rounded-xl p-2 focus:ring-2 focus:ring-blue-500 text-sm"
            />

            <button
              type="submit"
              className="w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl shadow-md transition-all text-sm font-semibold"
            >
              Sign Up
            </button>

            <p className="text-xs text-center text-gray-500 mt-4">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:underline font-medium">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
