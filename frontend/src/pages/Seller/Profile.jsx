import React, { useState, useRef, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { 
  BarChart2, PlusCircle, ShoppingBag, List, TrendingUp, User, 
  MapPin, Phone, Mail, Store, Save, Lock, Camera, ShieldCheck,
  CheckCircle2, AlertCircle, MessageSquare, Loader2
} from 'lucide-react';
import { getProfile, updateUserProfile } from '../../api/authApi';

const ProfileField = ({ label, name, value, icon: Icon, type = 'text', placeholder, onChange }) => (
  <div className="space-y-2">
    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-600 transition-colors">
        <Icon className="w-5 h-5" />
      </div>
      <input 
        name={name}
        type={type} 
        defaultValue={value}
        placeholder={placeholder}
        onChange={onChange}
        className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500/20 font-semibold text-slate-800 transition-all"
      />
    </div>
  </div>
);

const SellerProfile = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);
  
  // Real states
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [shopName, setShopName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  
  const [tempData, setTempData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    description: ""
  });

  const sidebarItems = [
    { label: 'Dashboard', icon: BarChart2, link: '/seller' },
    { label: 'Add Product', icon: PlusCircle, link: '/seller/add' },
    { label: 'My Products', icon: ShoppingBag, link: '/seller/products' },
    { label: 'Orders Received', icon: List, link: '/seller/orders' },
    { label: 'Sales Report', icon: TrendingUp, link: '/seller/report' },
    { label: 'Comments', icon: MessageSquare, link: '/seller/comments' },
    { label: 'My Profile', icon: User, link: '/seller/profile', active: true },
  ];

  // Listen for sync from header/other components
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const user = await getProfile();
        setShopName(user.name || "");
        setEmail(user.email || "");
        setPhone(user.phone || "");
        setLocation(user.location || "");
        setDescription(user.description || "");
        setAvatarUrl(user.avatar || null);
        
        setTempData({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          location: user.location || "",
          description: user.description || ""
        });
      } catch (err) {
        console.error("Failed to fetch seller profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('avatar', file);
        formData.append('name', shopName);

        const updatedUser = await updateUserProfile(formData);
        setAvatarUrl(updatedUser.avatar);
        
        // Sync to header
        window.dispatchEvent(new Event('profile_updated'));
      } catch (err) {
        console.error("Avatar update failed:", err);
      }
    }
  };

  const toggle2FA = () => {
    setIs2FAEnabled(!is2FAEnabled);
  };

  const handleSaveProfile = async () => {
    try {
      const formData = new FormData();
      formData.append('name', tempData.name);
      formData.append('email', tempData.email);
      formData.append('phone', tempData.phone);
      formData.append('location', tempData.location);
      formData.append('description', tempData.description);

      const updatedUser = await updateUserProfile(formData);
      
      setShopName(updatedUser.name);
      // Sync to header
      window.dispatchEvent(new Event('profile_updated'));
      alert('Profile updated successfully!');
    } catch (err) {
      console.error("Failed to save profile:", err);
      alert('Error saving profile');
    }
  };

  return (
    <DashboardLayout 
      sidebarItems={sidebarItems} 
      user={{ name: shopName, role: 'Seller' }}
      themeColor="bg-orange-600"
      secondaryColor="bg-orange-700"
    >
      <div className="max-w-5xl mx-auto pb-20">
        <div className="flex flex-col md:flex-row gap-8">
          
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleAvatarChange} 
          />

          {/* Left Column */}
          <div className="w-full md:w-80 space-y-6">
            <div className="bg-white rounded-[32px] p-8 shadow-xl shadow-black/5 border border-slate-100 text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-orange-500 to-amber-500" />
              
              <div className="relative z-10 pt-4">
                <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-[24px] bg-white p-1.5 shadow-xl mx-auto ring-4 ring-white transition-transform group-hover:scale-[1.02]">
                    <div className="w-full h-full rounded-[18px] bg-slate-100 flex items-center justify-center overflow-hidden">
                      {avatarUrl ? (
                         <img 
                          src={avatarUrl.startsWith('http') ? avatarUrl : `https://fashion-9hk0.onrender.com${avatarUrl}`} 
                          alt="Seller" 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <User className="w-12 h-12 text-slate-300" />
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 p-2 bg-white rounded-xl shadow-lg border border-slate-100 text-orange-600 hover:bg-orange-50 hover:scale-110 transition-all"
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                </div>
                
                <h2 className="text-2xl font-black text-slate-800 mt-6 tracking-tight truncate">{shopName}</h2>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Sourcing Excellence</p>
                
                <div className="flex items-center justify-center gap-2 mt-4 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black uppercase tracking-wider mx-auto w-fit">
                  <ShieldCheck className="w-4 h-4" />
                  Verified Store
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[32px] p-6 shadow-xl shadow-black/5 border border-slate-100 space-y-4">
              <button 
                onClick={() => setActiveTab('general')}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all ${activeTab === 'general' ? 'bg-orange-50 text-orange-600' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <Store className="w-5 h-5" />
                General Info
              </button>
              <button 
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all ${activeTab === 'security' ? 'bg-orange-50 text-orange-600' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <Lock className="w-5 h-5" />
                Security & 2FA
              </button>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex-1">
            <div className="bg-white rounded-[40px] p-10 shadow-xl shadow-black/5 border border-slate-100">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
                    {activeTab === 'general' ? <Store className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                    {activeTab === 'general' ? 'Store Profile' : 'Security Master'}
                  </h3>
                </div>
                <button 
                  onClick={handleSaveProfile}
                  className="flex items-center gap-2 bg-orange-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-orange-500/30 hover:bg-orange-700 hover:translate-y-[-2px] transition-all active:scale-95"
                >
                  <Save className="w-5 h-5" />
                  Save Portfolio
                </button>
              </div>

              {activeTab === 'general' ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <ProfileField 
                      label="Shop Name" 
                      value={tempData.name} 
                      icon={Store} 
                      placeholder="Your store name" 
                      onChange={(e) => setTempData({...tempData, name: e.target.value})}
                    />
                    <ProfileField 
                      label="Support Email" 
                      value={tempData.email} 
                      icon={Mail} 
                      placeholder="Support email" 
                      onChange={(e) => setTempData({...tempData, email: e.target.value})}
                    />
                    <ProfileField 
                      label="Contact Phone" 
                      value={tempData.phone} 
                      icon={Phone} 
                      placeholder="Phone number" 
                      onChange={(e) => setTempData({...tempData, phone: e.target.value})}
                    />
                    <ProfileField 
                      label="Location" 
                      value={tempData.location} 
                      icon={MapPin} 
                      placeholder="Store location" 
                      onChange={(e) => setTempData({...tempData, location: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Shop Description</label>
                    <textarea 
                      rows="4"
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500/20 font-semibold text-slate-800 resize-none transition-all"
                      value={tempData.description}
                      onChange={(e) => setTempData({...tempData, description: e.target.value})}
                      placeholder="Describe your shop..."
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <ProfileField label="New Password" value="" icon={Lock} type="password" placeholder="••••••••••••" />
                    <ProfileField label="Confirm New Password" value="" icon={Lock} type="password" placeholder="••••••••••••" />
                  </div>
                  
                  <div className={`p-8 rounded-[32px] border transition-all duration-500 ${is2FAEnabled ? 'bg-emerald-50 border-emerald-100' : 'bg-orange-50 border-orange-100'}`}>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="flex gap-5">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${is2FAEnabled ? 'bg-emerald-500 text-white' : 'bg-orange-500 text-white'}`}>
                          <ShieldCheck className="w-8 h-8" />
                        </div>
                        <div className="space-y-1">
                          <h4 className={`text-lg font-black tracking-tight ${is2FAEnabled ? 'text-emerald-800' : 'text-orange-800'}`}>
                            {is2FAEnabled ? 'Two-Factor Auth Active' : 'Protect Your Profits'}
                          </h4>
                          <p className={`text-sm font-medium leading-relaxed max-w-sm ${is2FAEnabled ? 'text-emerald-600' : 'text-orange-600'}`}>
                            {is2FAEnabled 
                              ? 'Your account is currently protected with secondary authentication. High security mode is active.' 
                              : 'Add an extra layer of security and trust to your seller account by enabling two-step verification.'}
                          </p>
                        </div>
                      </div>
                      
                      <button 
                        onClick={toggle2FA}
                        className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95 flex items-center gap-3 ${
                          is2FAEnabled 
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-500/20' 
                            : 'bg-orange-600 text-white hover:bg-orange-700 shadow-orange-500/20'
                        }`}
                      >
                        {is2FAEnabled ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            Disable 2FA
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-4 h-4" />
                            Enable Now
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default SellerProfile;
