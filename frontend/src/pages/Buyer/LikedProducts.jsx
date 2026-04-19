import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../../layouts/DashboardLayout';
import { ShoppingCart, Package, Heart, User, BarChart2, ShoppingBag, Trash2, Globe, Loader2 } from 'lucide-react';
import { getProfile } from '../../api/authApi';
import { getProducts } from '../../api/productApi';

const LikedProducts = () => {
  const [profile, setProfile] = useState(null);
  const [likedItems, setLikedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const sidebarItems = [
    { label: 'Dashboard', icon: BarChart2, link: '/buyer' },
    { label: 'Explore', icon: Globe, link: '/buyer/discover' },
    { label: 'My Cart', icon: ShoppingCart, link: '/buyer/cart' },
    { label: 'My Orders', icon: Package, link: '/buyer/orders' },
    { label: 'Liked Products', icon: Heart, link: '/buyer/liked', active: true },
    { label: 'Profile', icon: User, link: '/buyer/profile' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileData, allProducts] = await Promise.all([
          getProfile(),
          getProducts(),
        ]);
        setProfile(profileData);
        // Filter products that this user has liked
        const userId = profileData._id;
        const liked = allProducts.filter(p =>
          Array.isArray(p.likes) && p.likes.some(id => id === userId || id?._id === userId || id?.toString() === userId?.toString())
        );
        setLikedItems(liked);
      } catch (err) {
        console.error('LikedProducts fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUnlike = (productId) => {
    setLikedItems(prev => prev.filter(p => p._id !== productId));
  };

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      user={{ name: profile?.name || 'Buyer', role: 'Buyer' }}
      themeColor="bg-blue-600"
      secondaryColor="bg-blue-700"
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Liked Products</h1>
          <p className="text-slate-400 text-sm font-medium mt-1">
            {loading ? 'Loading...' : `${likedItems.length} item${likedItems.length !== 1 ? 's' : ''} you've saved`}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-32">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        </div>
      ) : likedItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Heart className="w-20 h-20 text-slate-200" />
          <p className="text-slate-400 font-bold text-lg">You haven't liked any products yet.</p>
          <a href="/buyer/discover" className="text-blue-600 font-bold hover:underline text-sm">
            Explore products →
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {likedItems.map((item, idx) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group bg-white rounded-2xl overflow-hidden border border-slate-200/60 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="aspect-[4/5] overflow-hidden relative bg-slate-100">
                <img
                  src={item.image?.startsWith('http') ? item.image : `https://fashion-9hk0.onrender.com${item.image}`}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <button
                  onClick={() => handleUnlike(item._id)}
                  className="absolute top-3 right-3 p-2.5 bg-white/90 backdrop-blur-md rounded-xl text-rose-500 shadow-sm hover:bg-rose-500 hover:text-white transition-all active:scale-90"
                >
                  <Heart className="w-4 h-4 fill-current" />
                </button>
                <div className="absolute bottom-3 left-3">
                  <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-lg text-blue-600 font-bold text-sm shadow-sm">
                    {item.currency === 'Dollar' ? '$' : 'ብር'} {Number(item.price).toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-slate-800 text-sm mb-4 line-clamp-2">{item.title}</h3>
                <div className="flex gap-2">
                  <button className="flex-1 bg-slate-900 text-white font-semibold py-3 rounded-xl hover:bg-slate-800 transition-all active:scale-[0.97] flex items-center justify-center gap-2 text-sm">
                    <ShoppingBag className="w-4 h-4" />
                    Buy Now
                  </button>
                  <button
                    onClick={() => handleUnlike(item._id)}
                    className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all border border-slate-200/60 active:scale-90"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default LikedProducts;
