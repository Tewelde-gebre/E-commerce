import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Shield, User, ChevronDown, Check, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthInput from '../../components/AuthInput';
import authBanner from '../../assets/auth_banner.png';

import { registerUser } from '../../api/authApi';

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

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('buyer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await registerUser({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: role
      });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
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
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center font-sans selection:bg-orange-100 overflow-hidden">
      {/* Full-Screen Background Image */}
      <motion.div
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="fixed inset-0 z-0"
      >
        <img
          src={authBanner}
          alt="Fashion Background"
          className="w-full h-full object-cover"
        />
        <div className={`absolute inset-0 bg-gradient-to-br ${themeColors[role]} mix-blend-multiply opacity-30 transition-all duration-700`} />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      </motion.div>

      {/* Floating Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ x: [0, 60, 0], y: [0, -40, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/3 -right-20 w-80 h-80 bg-orange-500/20 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 60, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/3 -left-20 w-96 h-96 bg-red-500/20 rounded-full blur-[120px]"
        />
      </div>

      {/* Centered Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-[540px] px-6 py-20 mt-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white/70 backdrop-blur-2xl border border-white/40 rounded-[40px] p-8 md:p-12 shadow-2xl shadow-black/20"
        >
          <motion.div variants={itemVariants} className="mb-10 text-center">
            <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Create account</h1>
            <p className="text-slate-600 font-medium">Join our fashion community.</p>
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

          <motion.div variants={itemVariants}>
            <RoleSelector selectedRole={role} onSelect={setRole} />
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div variants={itemVariants}>
              <AuthInput
                label="Full Name"
                icon={User}
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) => updateField('fullName', e.target.value)}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <AuthInput
                label="Email Address"
                icon={Mail}
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
              />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <motion.div variants={itemVariants}>
                <AuthInput
                  label="Password"
                  icon={Shield}
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => updateField('password', e.target.value)}
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <AuthInput
                  label="Confirm"
                  icon={Shield}
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => updateField('confirmPassword', e.target.value)}
                />
              </motion.div>
            </div>

            <motion.div variants={itemVariants} className="py-2">
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                By creating an account, you agree to our <span className="text-slate-900 font-bold cursor-pointer hover:underline">Terms</span> and <span className="text-slate-900 font-bold cursor-pointer hover:underline">Privacy Policy</span>.
              </p>
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
                  Registering...
                </>
              ) : (
                <>
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          <motion.div variants={itemVariants} className="mt-10 pt-8 border-t border-slate-900/10 text-center">
            <p className="text-slate-600 font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-slate-900 font-black hover:underline underline-offset-4 decoration-2">
                Login here
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
