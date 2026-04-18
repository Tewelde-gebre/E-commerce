import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Shield, User, ChevronDown, Check, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthInput from '../../components/AuthInput';
import authBanner from '../../assets/auth_banner.png';

import { loginUser } from '../../api/authApi';

const RoleSelector = ({ selectedRole, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const roles = [
    { id: 'buyer', label: 'Buyer', icon: User, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'seller', label: 'Seller', icon: User, color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: 'admin', label: 'Admin', icon: Shield, color: 'text-slate-700', bg: 'bg-slate-100' },
  ];

  const currentRole = roles.find(r => r.id === selectedRole);

  return (
    <div className="relative w-full mb-8">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl hover:border-slate-200 transition-all font-bold text-slate-700 active:scale-[0.98]"
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${currentRole.color} ${currentRole.bg}`}>
            <currentRole.icon className="w-5 h-5" />
          </div>
          <span className="text-lg">{currentRole.label} Account</span>
        </div>
        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl z-20 p-2 overflow-hidden"
          >
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => {
                  onSelect(role.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all ${selectedRole === role.id ? 'bg-slate-50 text-slate-900' : 'hover:bg-slate-50 text-slate-500'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg ${role.id === selectedRole ? `${role.color} ${role.bg}` : 'bg-slate-100 text-slate-400'}`}>
                    <role.icon className="w-4 h-4" />
                  </div>
                  <span className="font-semibold">{role.label}</span>
                </div>
                {selectedRole === role.id && <Check className="w-4 h-4 text-emerald-500" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('buyer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleForgotPassword = () => {
    if (!email) {
      setError("Please enter your email to send a reset link.");
      return;
    }
    setError(null);
    setSuccessMsg(`Password reset link sent to ${email}`);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setSuccessMsg(null);
      const data = await loginUser({ email, password });
      
      // Check if user role matches selected role (Optional security check)
      if (data.role !== role) {
        setError(`You are not registered as a ${role}.`);
        return;
      }

      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      // Store credentials and navigate
      localStorage.setItem('token', data.token);
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate(`/${role}`);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const themeColors = {
    buyer: 'from-blue-600 to-indigo-700',
    admin: 'from-slate-800 to-black',
    seller: 'from-orange-500 to-red-600',
  };

  const buttonColors = {
    buyer: 'bg-blue-600 hover:bg-blue-700 shadow-blue-200',
    admin: 'bg-slate-900 hover:bg-black shadow-slate-200',
    seller: 'bg-orange-600 hover:bg-orange-700 shadow-orange-200',
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, staggerChildren: 0.1, ease: 'easeOut' }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center font-sans selection:bg-blue-100 overflow-hidden bg-slate-900">
      {/* Full-Screen Animating Background Image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="fixed inset-0 z-0"
      >
        <motion.img
          src={authBanner}
          alt="Fashion Background"
          className="w-full h-full object-cover origin-center"
          animate={{
            scale: [1.05, 1.15, 1.05],
            rotate: [0, 1, -1, 0]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
        <div className={`absolute inset-0 bg-gradient-to-br ${themeColors[role]} mix-blend-multiply opacity-60 transition-all duration-1000`} />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-md" />
      </motion.div>

      {/* Floating Animated Modern Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          animate={{ x: ['-10vw', '50vw', '-10vw'], y: ['-10vh', '40vh', '-10vh'], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-500/30 rounded-full blur-[120px] mix-blend-screen"
        />
        <motion.div
          animate={{ x: ['60vw', '10vw', '60vw'], y: ['60vh', '10vh', '60vh'], scale: [1, 1.2, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-500/30 rounded-full blur-[120px] mix-blend-screen"
        />
        <motion.div
          animate={{ x: ['20vw', '80vw', '20vw'], y: ['80vh', '80vh', '80vh'], scale: [1, 1.5, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-0 w-[400px] h-[400px] bg-purple-500/30 rounded-full blur-[100px] mix-blend-screen"
        />
      </div>

      {/* Centered Premium Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-[480px] px-6 py-20 mt-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white/60 backdrop-blur-2xl border border-white/50 rounded-[40px] p-8 md:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] relative overflow-hidden group"
        >
          {/* Card Inner Reflection */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-50 pointer-events-none" />

          <div className="relative z-10">
            <motion.div variants={itemVariants} className="mb-10 text-center">
              <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Welcome back</h1>
              <p className="text-slate-600 font-medium">Elevate your fashion experience.</p>
            </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-bold rounded-r-xl"
            >
              {error}
            </motion.div>
          )}

          {successMsg && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 text-sm font-bold rounded-r-xl"
            >
              {successMsg}
            </motion.div>
          )}

          <motion.div variants={itemVariants}>
            <RoleSelector selectedRole={role} onSelect={setRole} />
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div variants={itemVariants}>
              <AuthInput
                label="Email Address"
                icon={Mail}
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <AuthInput
                label="Password"
                icon={Shield}
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-center justify-between py-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 bg-white/50" 
                />
                <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">Remember me</span>
              </label>
              <button 
                type="button" 
                onClick={handleForgotPassword}
                className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
              >
                Forgot password?
              </button>
            </motion.div>

            <motion.button
              variants={itemVariants}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-2xl text-white font-bold text-lg shadow-xl flex items-center justify-center gap-2 transition-all duration-300 ${loading ? 'bg-slate-400 cursor-not-allowed shadow-none' : buttonColors[role]}`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          <motion.div variants={itemVariants} className="mt-10 pt-8 border-t border-slate-900/10 text-center">
            <p className="text-slate-600 font-medium">
              Don't have an account?{' '}
              <Link to="/register" className="text-slate-900 font-black hover:underline underline-offset-4 decoration-2">
                Create account
              </Link>
            </p>
          </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
