import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../../layouts/DashboardLayout';
import { ShoppingCart, Package, Heart, User, BarChart2, Bell, Lock, MapPin, CreditCard, Globe, Camera, Save, CheckCircle, Shield, Smartphone, ChevronRight, Loader2 } from 'lucide-react';
import { getProfile, updateUserProfile } from '../../api/authApi';

const Profile = () => {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Profile Saved Successfully!');
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [expandedSetting, setExpandedSetting] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const user = await getProfile();
        setName(user.name || '');
        setEmail(user.email || '');
        setPhone(user.phone || '');
        setUsername(user.username || '');
        setAvatarUrl(user.avatar || null);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleSaveProfile = async () => {
    try {
      setToastMessage('Saving Changes...');
      setShowToast(true);
      
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('username', username);

      const updatedUser = await updateUserProfile(formData);
      
      // Update local states
      setName(updatedUser.name);
      setEmail(updatedUser.email);
      
      // Sync to header
      window.dispatchEvent(new Event('profile_updated'));
      
      setToastMessage('Profile Saved Successfully!');
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error("Failed to update profile:", err);
      setToastMessage('Error saving profile');
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleToggle2FA = () => {
    const newState = !is2FAEnabled;
    setIs2FAEnabled(newState);
    setToastMessage(newState ? '2FA Enabled Successfully!' : '2FA Disabled');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setToastMessage('Uploading Avatar...');
        setShowToast(true);

        const formData = new FormData();
        formData.append('avatar', file);
        formData.append('name', name);

        const updatedUser = await updateUserProfile(formData);
        setAvatarUrl(updatedUser.avatar);
        
        // Sync to header
        window.dispatchEvent(new Event('profile_updated'));
        
        setToastMessage('Avatar Updated!');
        setTimeout(() => setShowToast(false), 3000);
      } catch (err) {
        console.error("Failed to upload avatar:", err);
        setToastMessage('Error uploading avatar');
      }
    }
  };

  const sidebarItems = [
    { label: 'Dashboard', icon: BarChart2, link: '/buyer' },
    { label: 'Explore', icon: Globe, link: '/buyer/discover' },
    { label: 'My Cart', icon: ShoppingCart, link: '/buyer/cart' },
    { label: 'My Orders', icon: Package, link: '/buyer/orders' },
    { label: 'Liked Products', icon: Heart, link: '/buyer/liked' },
    { label: 'Profile', icon: User, link: '/buyer/profile', active: true },
  ];

  const quickLinks = [
    { id: 'shipping', icon: MapPin, title: 'Shipping Addresses', desc: 'Manage your saved addresses', color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
    { id: 'payment', icon: CreditCard, title: 'Payment Methods', desc: 'Manage your saved cards', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { id: 'security', icon: Lock, title: 'Security Settings', desc: 'Manage passwords & 2FA', color: 'bg-amber-50 text-amber-600 border-amber-100', hasChildren: true },
    { id: 'notifications', icon: Bell, title: 'Notifications', desc: 'Manage your email alerts', color: 'bg-rose-50 text-rose-600 border-rose-100' },
  ];

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      user={{ name: 'አበበ', role: 'Buyer' }}
      themeColor="bg-blue-600"
      secondaryColor="bg-blue-700"
    >
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Profile Settings</h1>
        <p className="text-slate-400 text-sm font-medium mt-1">Manage your account information</p>
      </div>

      <div className="max-w-4xl">
        {/* Avatar & Name Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-200/60 p-6 mb-6"
        >
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-blue-500/20 overflow-hidden">
                {avatarUrl ? (
                  <img 
                    src={avatarUrl.startsWith('http') ? avatarUrl : `https://fashion-9hk0.onrender.com${avatarUrl}`} 
                    alt="Profile" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  name ? name[0].toUpperCase() : <User className="w-10 h-10" />
                )}
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 p-2 bg-white rounded-xl border border-slate-200 shadow-sm text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all active:scale-90 z-10"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input 
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-bold text-slate-800">{name}</h2>
              <p className="text-sm text-slate-400 font-medium">{email}</p>
              <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 bg-blue-50 rounded-lg text-blue-600 text-[10px] font-bold uppercase tracking-widest border border-blue-100">
                Verified Buyer
              </div>
            </div>
          </div>
        </motion.div>

        {/* Personal Info Form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-slate-200/60 p-6 md:p-8 mb-6"
        >
          <h3 className="text-base font-bold text-slate-800 mb-6">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200/60 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 focus:bg-white font-medium text-slate-800 text-sm transition-all" 
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200/60 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 focus:bg-white font-medium text-slate-800 text-sm transition-all" 
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Phone Number</label>
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200/60 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 focus:bg-white font-medium text-slate-800 text-sm transition-all" 
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200/60 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 focus:bg-white font-medium text-slate-800 text-sm transition-all" 
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button 
              onClick={handleSaveProfile}
              className="bg-slate-900 text-white font-semibold px-8 py-3 rounded-xl hover:bg-slate-800 transition-all active:scale-[0.97] flex items-center gap-2 shadow-lg shadow-slate-900/10 text-sm"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </motion.div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          {quickLinks.map((link, idx) => (
            <motion.div
              layout
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + idx * 0.05 }}
              onClick={() => link.hasChildren && setExpandedSetting(expandedSetting === link.id ? null : link.id)}
              className={`bg-white rounded-2xl border border-slate-200/60 p-5 group flex flex-col transition-all overflow-hidden ${link.hasChildren ? 'cursor-pointer hover:border-amber-200' : 'cursor-pointer hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-0.5'}`}
            >
              <div className="flex items-center gap-5 w-full">
                <div className={`w-12 h-12 rounded-xl ${link.color} border flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  <link.icon className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-slate-800 text-sm">{link.title}</h3>
                  <p className="text-slate-400 text-xs font-medium mt-0.5">{link.desc}</p>
                </div>
                {link.hasChildren && (
                  <div className="flex-shrink-0">
                    <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${expandedSetting === link.id ? 'rotate-90' : ''}`} />
                  </div>
                )}
              </div>
              
              <AnimatePresence>
                {link.hasChildren && expandedSetting === link.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    className="w-full border-t border-slate-100"
                  >
                    <div className="pt-4 flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">Two-Factor Authentication</h4>
                        <p className="text-xs text-slate-500 mt-0.5 font-medium">Require a security code on login</p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleToggle2FA(); }}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${is2FAEnabled ? 'bg-emerald-500' : 'bg-slate-300'}`}
                      >
                        <span className="sr-only">Toggle 2FA</span>
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out shadow-sm ${is2FAEnabled ? 'translate-x-6' : 'translate-x-1'}`}
                        />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {(showToast || loading) && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-8 right-8 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-50"
          >
            {loading ? <Loader2 className="w-5 h-5 text-blue-400 animate-spin" /> : <CheckCircle className="w-5 h-5 text-emerald-400" />}
            <span className="text-sm font-semibold">{loading ? 'Loading Profile...' : toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default Profile;
