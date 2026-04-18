import React from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../../layouts/DashboardLayout';
import { ShoppingCart, Package, Heart, User, BarChart2, Search, Filter, ExternalLink, Globe, CheckCircle, Truck, Clock } from 'lucide-react';

const MyOrders = () => {
  const sidebarItems = [
    { label: 'Dashboard', icon: BarChart2, link: '/buyer' },
    { label: 'Explore', icon: Globe, link: '/buyer/discover' },
    { label: 'My Cart', icon: ShoppingCart, link: '/buyer/cart' },
    { label: 'My Orders', icon: Package, link: '/buyer/orders', active: true },
    { label: 'Liked Products', icon: Heart, link: '/buyer/liked' },
    { label: 'Profile', icon: User, link: '/buyer/profile' },
  ];

  const orders = [
    { id: '1234', date: 'Oct 24, 2023', total: 45.00, status: 'Delivered', items: 1 },
    { id: '1233', date: 'Oct 20, 2023', total: 120.00, status: 'Shipped', items: 3 },
    { id: '1232', date: 'Oct 15, 2023', total: 80.00, status: 'Processing', items: 1 },
  ];

  const statusConfig = {
    Delivered: { color: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: CheckCircle },
    Shipped: { color: 'bg-blue-50 text-blue-600 border-blue-100', icon: Truck },
    Processing: { color: 'bg-amber-50 text-amber-600 border-amber-100', icon: Clock },
  };

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
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">My Orders</h1>
          <p className="text-slate-400 text-sm font-medium mt-1">Track and manage your purchases</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-56">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search orders..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-slate-200/60 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 text-sm font-medium transition-all" 
            />
          </div>
          <button className="p-2.5 rounded-xl border border-slate-200/60 bg-white hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order, idx) => {
          const config = statusConfig[order.status] || statusConfig.Processing;
          const StatusIcon = config.icon;
          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="bg-white rounded-2xl border border-slate-200/60 p-5 hover:shadow-lg hover:shadow-blue-500/5 transition-all group cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${config.color} border flex items-center justify-center flex-shrink-0`}>
                    <StatusIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-800 text-sm">Order #{order.id}</span>
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${config.color} border`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-xs text-slate-400 font-medium">{order.date}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-xs text-slate-400 font-medium">{order.items} item{order.items > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 sm:gap-6">
                  <span className="font-bold text-slate-800">ብር {order.total.toFixed(2)}</span>
                  <button className="p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </DashboardLayout>
  );
};

export default MyOrders;
