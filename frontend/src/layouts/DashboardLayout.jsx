import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronRight, Home, Camera, Upload, Bell, LogOut, User as UserIcon, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { updateUserProfile, getProfile } from '../api/authApi';
import { getNotifications, markAsRead } from '../api/notificationApi';

const SidebarItem = ({ item, idx, isDark, accent, setIsSidebarOpen }) => {
  return (
    <NavLink
      key={idx}
      to={item.link || '#'}
      onClick={() => setIsSidebarOpen(false)}
      className={({ isActive }) => `
        relative flex items-center gap-3.5 px-4 py-3.5 rounded-[14px] transition-all duration-300 group overflow-hidden
        ${isActive ? '' : isDark ? 'hover:bg-white/5' : 'hover:bg-slate-100'}
      `}
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.div
              layoutId="sidebar-active-bg"
              className={`absolute inset-0 bg-gradient-to-r ${accent.gradient} shadow-lg ${accent.glow}`}
              transition={{ type: 'spring', bounce: 0.15, duration: 0.6 }}
            />
          )}

          <div className="relative z-10 transition-transform duration-300 group-hover:scale-110">
            <item.icon className={`w-[18px] h-[18px] ${
              isActive 
                ? 'text-white' 
                : isDark ? 'text-slate-400 group-hover:text-white' : 'text-slate-500 group-hover:text-slate-800'
            }`} />
          </div>

          <span className={`relative z-10 text-[13px] font-bold tracking-tight transition-colors duration-300 ${
            isActive 
              ? 'text-white' 
              : isDark ? 'text-slate-400 group-hover:text-white' : 'text-slate-600 group-hover:text-slate-900'
          }`}>
            {item.label}
          </span>

          {isActive && (
            <motion.div 
              layoutId="active-dot" 
              className="ml-auto w-1.5 h-1.5 rounded-full bg-white relative z-10" 
            />
          )}
        </>
      )}
    </NavLink>
  );
};

const DashboardLayout = ({
  children,
  sidebarItems = [],
  user: initialUser = { name: 'User', role: 'Buyer', avatar: null },
  themeColor = 'bg-blue-600',
  secondaryColor = 'bg-blue-700',
  headerLeft = null,
  headerRight = null,
  isDark = false,
}) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : initialUser;
  });

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const avatarMenuRef = useRef(null);
  const notificationMenuRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const profile = await getProfile();
        setCurrentUser(profile);
        localStorage.setItem('user', JSON.stringify(profile));
      } catch (err) {
        console.error("Failed to sync profile:", err);
      }
    };
    fetchUserData();

    // Listen for manual sync events from Profile pages
    window.addEventListener('profile_updated', fetchUserData);

    const fetchAlerts = async () => {
      try {
        const data = await getNotifications();
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.isRead).length);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };
    fetchAlerts();

    // Refresh notifications every 2 minutes
    const interval = setInterval(fetchAlerts, 120000);
    return () => {
      clearInterval(interval);
      window.removeEventListener('profile_updated', fetchUserData);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (avatarMenuRef.current && !avatarMenuRef.current.contains(e.target)) setShowAvatarMenu(false);
      if (notificationMenuRef.current && !notificationMenuRef.current.contains(e.target)) setShowNotificationMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUpdatingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      formData.append('name', currentUser.name);

      const updated = await updateUserProfile(formData);
      setCurrentUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
      setShowAvatarMenu(false);
    } catch (err) {
      console.error("Avatar update failed:", err);
      alert("Failed to update profile picture.");
    } finally {
      setIsUpdatingAvatar(false);
    }
  };

  const handleNotificationClick = async (n) => {
    try {
      if (!n.isRead) {
        await markAsRead(n._id);
        setNotifications(prev => prev.map(notif => notif._id === n._id ? { ...notif, isRead: true } : notif));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      setShowNotificationMenu(false);
      
      // Navigate to relevant section where product lives (since they are sorted newest first, they appear at the top)
      if (currentUser.role === 'buyer') {
          // New product notification
          navigate('/buyer/discover');
      } else if (currentUser.role === 'seller') {
          if (n.message.toLowerCase().includes('comment')) {
              navigate('/seller/comments');
          } else {
              // Liked product
              navigate('/seller/products');
          }
      }
    } catch (err) {
      console.error("Failed to handle notification click:", err);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const roleAccents = {
    buyer: { gradient: 'from-blue-600 to-indigo-600', glow: 'shadow-blue-500/20', badge: 'bg-blue-500/10 text-blue-400', color: 'text-blue-500' },
    seller: { gradient: 'from-orange-500 to-amber-500', glow: 'shadow-orange-500/20', badge: 'bg-orange-500/10 text-orange-400', color: 'text-orange-500' },
    admin: { gradient: 'from-violet-600 to-purple-600', glow: 'shadow-violet-500/20', badge: 'bg-violet-500/10 text-violet-400', color: 'text-violet-500' },
  };
  const accent = roleAccents[currentUser.role] || roleAccents.buyer;

  const getAvatarSource = () => {
    if (!currentUser.avatar) return null;
    if (currentUser.avatar.startsWith('http')) return currentUser.avatar;
    return `https://fashion-9hk0.onrender.com${currentUser.avatar}`;
  };

  const SidebarContent = () => (
    <div className={`flex flex-col h-full ${isDark ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200'} border-r relative overflow-hidden transition-colors duration-500 shadow-2xl`}>
      <div className="px-6 pt-8 pb-8 relative z-10">
        <Link to="/" className="flex items-center gap-3.5 group">
          <div className={`w-11 h-11 bg-gradient-to-br ${accent.gradient} rounded-xl flex items-center justify-center text-white text-xl font-black shadow-xl shrink-0 group-hover:scale-105 transition-transform duration-300`}>
            F
          </div>
          <span className={`font-black text-xl tracking-tighter uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Fashion
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-2 space-y-1.5 overflow-y-auto custom-scrollbar relative z-10">
        <div className={`text-[10px] font-black uppercase tracking-[0.2em] mb-4 px-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
           Main Menu
        </div>
        {sidebarItems.map((item, idx) => (
          <SidebarItem 
            key={idx} 
            item={item} 
            idx={idx} 
            isDark={isDark} 
            accent={accent} 
            setIsSidebarOpen={setIsSidebarOpen} 
          />
        ))}
      </nav>

      <div className="p-4 mt-auto relative z-10">
        <button
          onClick={logout}
          className={`w-full flex items-center gap-3.5 px-4 py-4 rounded-[16px] transition-all group ${
            isDark ? 'text-rose-400 hover:text-white hover:bg-rose-500/10' : 'text-slate-500 hover:text-rose-600 hover:bg-rose-50'
          }`}
        >
          <LogOut className="w-5 h-5 opacity-70 group-hover:opacity-100" />
          <span className="text-[14px] font-bold">Logout Session</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen flex ${isDark ? 'bg-[#030712] text-white' : 'bg-slate-50 text-slate-900'} font-sans transition-colors duration-500`}>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-[290px] flex-shrink-0 flex-col fixed inset-y-0 left-0 z-50">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[290px] z-[70] lg:hidden"
            >
              <div className="absolute top-6 right-[-50px]">
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-3 bg-white/10 text-white rounded-full backdrop-blur-xl border border-white/20"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-h-screen lg:ml-[290px] relative">
        <header className={`h-20 flex items-center justify-between px-6 md:px-10 sticky top-0 z-40 transition-all duration-300 ${
           isDark ? 'bg-[#030712]/80' : 'bg-white/80'
        } backdrop-blur-xl border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="flex items-center gap-5">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className={`lg:hidden p-3 rounded-2xl transition-all ${isDark ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              <Menu className="w-6 h-6" />
            </button>
            {headerLeft ? (
              <div className="text-lg font-black tracking-tight">{headerLeft}</div>
            ) : (
              <div className="hidden sm:block text-sm font-bold opacity-60">
                Welcome back, <span className={isDark ? 'text-white' : 'text-slate-900'}>{currentUser.name}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {headerRight || (
              <>
                <div className="relative" ref={notificationMenuRef}>
                  <button
                    onClick={() => setShowNotificationMenu(!showNotificationMenu)}
                    className={`p-3 rounded-2xl relative transition-all ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'} hover:scale-105 active:scale-95`}
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-slate-800 animate-pulse" />
                    )}
                  </button>

                  <AnimatePresence>
                    {showNotificationMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 15, scale: 0.95 }}
                        className={`absolute top-full right-0 mt-3 w-80 rounded-[24px] shadow-2xl p-4 border ${isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900'} z-50`}
                      >
                        <h3 className="font-black text-xs uppercase tracking-widest mb-4 px-2 opacity-60">Recent Alerts</h3>
                        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                          {notifications.map((n) => (
                            <div 
                              key={n._id} 
                              onClick={() => handleNotificationClick(n)}
                              className={`p-3 rounded-xl transition-all cursor-pointer border ${n.isRead ? 'opacity-50' : 'bg-blue-500/5 border-blue-500/20'}`}
                            >
                              <div className="flex justify-between items-start gap-2">
                                <p className="text-[11px] font-bold leading-relaxed flex-1">{n.message}</p>
                                {n.isRead && (
                                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 bg-slate-200/50 dark:bg-slate-800/50 px-2 py-0.5 rounded-full shrink-0">
                                    Seen
                                  </span>
                                )}
                              </div>
                              <span className="text-[8px] font-black uppercase tracking-widest opacity-40 mt-1 block">
                                {new Date(n.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          ))}
                          {notifications.length === 0 && (
                            <div className="py-10 text-center opacity-40 italic text-sm">No notifications found.</div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex items-center gap-4 relative" ref={avatarMenuRef}>
                   <div className="hidden md:flex flex-col items-end gap-0.5">
                      <span className="text-sm font-black tracking-tight leading-none">{currentUser.name}</span>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${accent.color}`}>{currentUser.role}</span>
                   </div>
                   <button 
                     onClick={() => setShowAvatarMenu(!showAvatarMenu)}
                     className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${accent.gradient} p-0.5 shadow-xl hover:scale-105 transition-transform overflow-hidden relative`}
                   >
                     {isUpdatingAvatar && (
                        <div className="absolute inset-0 bg-black/60 z-10 flex items-center justify-center">
                           <Loader2 className="w-4 h-4 text-white animate-spin" />
                        </div>
                     )}
                     <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center overflow-hidden">
                        {getAvatarSource() ? (
                           <img src={getAvatarSource()} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                           <span className="text-white font-black">{currentUser.name[0]}</span>
                        )}
                     </div>
                   </button>

                   <AnimatePresence>
                    {showAvatarMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 15, scale: 0.95 }}
                        className={`absolute top-full right-0 mt-3 w-56 rounded-[24px] shadow-2xl p-2 border ${isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900'} z-50`}
                      >
                        <button 
                          onClick={() => fileInputRef.current.click()}
                          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all font-bold text-xs uppercase tracking-widest"
                        >
                          <Upload className="w-4 h-4" /> Upload Avatar
                        </button>
                        <button 
                          onClick={() => cameraInputRef.current.click()}
                          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all font-bold text-xs uppercase tracking-widest"
                        >
                          <Camera className="w-4 h-4" /> Take Photo
                        </button>
                        <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
                        <button 
                          onClick={logout}
                          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-rose-50 text-rose-500 transition-all font-bold text-xs uppercase tracking-widest"
                        >
                          <LogOut className="w-4 h-4" /> Log out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>
        </header>

        <main className="flex-1 p-6 md:p-10 w-full overflow-x-hidden">
            {children}
        </main>
      </div>

      <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
      <input ref={cameraInputRef} type="file" className="hidden" accept="image/*" capture="user" onChange={handleAvatarChange} />
    </div>
  );
};

export default DashboardLayout;
