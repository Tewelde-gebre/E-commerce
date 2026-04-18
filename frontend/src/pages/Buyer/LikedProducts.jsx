import React from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../../layouts/DashboardLayout';
import { ShoppingCart, Package, Heart, User, BarChart2, ShoppingBag, Trash2, Globe } from 'lucide-react';

const LikedProducts = () => {
  const sidebarItems = [
    { label: 'Dashboard', icon: BarChart2, link: '/buyer' },
    { label: 'Explore', icon: Globe, link: '/buyer/discover' },
    { label: 'My Cart', icon: ShoppingCart, link: '/buyer/cart' },
    { label: 'My Orders', icon: Package, link: '/buyer/orders' },
    { label: 'Liked Products', icon: Heart, link: '/buyer/liked', active: true },
    { label: 'Profile', icon: User, link: '/buyer/profile' },
  ];

  const likedItems = [
    { id: 1, name: 'Premium Silk Netela', price: 2500, image: '/images/ethiopian_scarf_1_1775238385655.png' },
    { id: 2, name: 'Modern Habesha Kemis', price: 4500, image: '/images/ethiopian_dress_1_1775238309721.png' },
    { id: 3, name: 'Cultural Leather Jacket', price: 12000, image: '/images/ethiopian_jacket_1_1775238609216.png' },
  ];

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      user={{ name: 'አበበ', role: 'Buyer' }}
      themeColor="bg-blue-600"
      secondaryColor="bg-blue-700"
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Liked Products</h1>
          <p className="text-slate-400 text-sm font-medium mt-1">{likedItems.length} items you've saved</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sort by:</span>
          <select className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all cursor-pointer">
            <option>Recently Added</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {likedItems.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group bg-white rounded-2xl overflow-hidden border border-slate-200/60 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300"
          >
            <div className="aspect-[4/5] overflow-hidden relative bg-slate-100">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <button className="absolute top-3 right-3 p-2.5 bg-white/90 backdrop-blur-md rounded-xl text-rose-500 shadow-sm hover:bg-rose-500 hover:text-white transition-all active:scale-90">
                <Heart className="w-4 h-4 fill-current" />
              </button>
              <div className="absolute bottom-3 left-3">
                <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-lg text-blue-600 font-bold text-sm shadow-sm">
                  {item.currency === 'Dollar' ? '$' : 'ብር'} {item.price}
                </span>
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-slate-800 text-sm mb-4">{item.name}</h3>
              <div className="flex gap-2">
                <button className="flex-1 bg-slate-900 text-white font-semibold py-3 rounded-xl hover:bg-slate-800 transition-all active:scale-[0.97] flex items-center justify-center gap-2 text-sm">
                  <ShoppingBag className="w-4 h-4" />
                  Add to Cart
                </button>
                <button className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all border border-slate-200/60 active:scale-90">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default LikedProducts;
