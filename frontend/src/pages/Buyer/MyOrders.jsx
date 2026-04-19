import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../../layouts/DashboardLayout';
import { 
  ShoppingCart, Package, Heart, User, BarChart2, Search, 
  Filter, ExternalLink, Globe, CheckCircle, Truck, Clock, 
  Loader2, PackageSearch 
} from 'lucide-react';
import { getMyOrders } from '../../api/orderApi';
import { getProfile } from '../../api/authApi';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const sidebarItems = [
    { label: 'Dashboard', icon: BarChart2, link: '/buyer' },
    { label: 'Explore', icon: Globe, link: '/buyer/discover' },
    { label: 'My Cart', icon: ShoppingCart, link: '/buyer/cart' },
    { label: 'My Orders', icon: Package, link: '/buyer/orders', active: true },
    { label: 'Liked Products', icon: Heart, link: '/buyer/liked' },
    { label: 'Profile', icon: User, link: '/buyer/profile' },
  ];

  const statusConfig = {
    Delivered:  { color: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: CheckCircle },
    Shipped:    { color: 'bg-blue-50 text-blue-600 border-blue-100', icon: Truck },
    Processing: { color: 'bg-amber-50 text-amber-600 border-amber-100', icon: Clock },
    Pending:    { color: 'bg-slate-50 text-slate-600 border-slate-200', icon: Clock },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileData, orderData] = await Promise.all([
          getProfile(),
          getMyOrders(),
        ]);
        setProfile(profileData);
        setOrders(orderData);
      } catch (err) {
        console.error('MyOrders fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = orders.filter(o => {
    if (!search) return true;
    return o._id.toLowerCase().includes(search.toLowerCase());
  });

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
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">My Orders</h1>
          <p className="text-slate-400 text-sm font-medium mt-1">Track and manage your purchases</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-56">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by Order ID..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-slate-200/60 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 text-sm font-medium transition-all" 
            />
          </div>
          <button className="p-2.5 rounded-xl border border-slate-200/60 bg-white hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-32">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <PackageSearch className="w-20 h-20 text-slate-200" />
          <p className="text-slate-400 font-bold text-lg">
            {orders.length === 0 ? "You haven't placed any orders yet." : 'No orders match your search.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order, idx) => {
            const config = statusConfig[order.status] || statusConfig.Pending;
            const StatusIcon = config.icon;
            const itemCount = order.products?.length || 0;
            const firstTitle = order.products?.[0]?.productId?.title || 'Order Item';
            return (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 }}
                className="bg-white rounded-2xl border border-slate-200/60 p-5 hover:shadow-lg hover:shadow-blue-500/5 transition-all group cursor-pointer"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl ${config.color} border flex items-center justify-center flex-shrink-0`}>
                      <StatusIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-800 text-sm">Order #{order._id.slice(-8).toUpperCase()}</span>
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${config.color} border`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-xs text-slate-400 font-medium">
                          {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="text-slate-300">·</span>
                        <span className="text-xs text-slate-400 font-medium">{itemCount} item{itemCount > 1 ? 's' : ''}</span>
                        <span className="text-slate-300">·</span>
                        <span className="text-xs text-slate-500 font-semibold truncate max-w-[120px]">{firstTitle}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 sm:gap-6">
                    <span className="font-bold text-slate-800">ብር {Number(order.totalPrice).toLocaleString()}</span>
                    <button className="p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
};

export default MyOrders;
