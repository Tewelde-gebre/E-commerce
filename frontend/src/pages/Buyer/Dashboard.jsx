import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../../layouts/DashboardLayout';
import DashboardProductCard from '../../components/DashboardProductCard';
import { ShoppingCart, Package, Heart, User, CheckCircle, Clock, Truck, BarChart2, Globe, ArrowRight, Zap, Gift, ShieldCheck, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getProfile } from '../../api/authApi';
import { getMyOrders } from '../../api/orderApi';
import { getProducts } from '../../api/productApi';

const StatCard = ({ title, value, icon: Icon, color = 'bg-blue-600', trend = 'Live data' }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white dark:bg-slate-900 rounded-[32px] p-6 shadow-xl shadow-black/5 flex flex-col gap-6 border border-slate-100 dark:border-slate-800 relative overflow-hidden group"
  >
    <div className={`w-14 h-14 ${color} text-white flex items-center justify-center rounded-2xl shadow-lg transition-transform duration-500 group-hover:scale-110`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1">{title}</h3>
      <p className="text-3xl font-black text-slate-900 dark:text-white leading-none tracking-tight mb-2">{value}</p>
      <div className="flex items-center gap-1.5">
          <Zap className="w-3 h-3 text-emerald-500 fill-emerald-500" />
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">{trend}</span>
      </div>
    </div>
    <div className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-5 -translate-y-1/2 translate-x-1/2 rounded-full blur-3xl`} />
  </motion.div>
);

const TransactionItem = ({ id, status, amount, label, date = "2 hours ago" }) => {
  const statusColors = {
    Delivered: { bg: 'bg-emerald-50 dark:bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', icon: CheckCircle },
    Shipped: { bg: 'bg-blue-50 dark:bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', icon: Truck },
    Processing: { bg: 'bg-amber-50 dark:bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', icon: Clock },
    Pending: { bg: 'bg-slate-50 dark:bg-slate-500/10', text: 'text-slate-600 dark:text-slate-400', icon: Clock },
  };

  const currentStatus = statusColors[status] || { bg: 'bg-slate-50', text: 'text-slate-600', icon: Package };
  const StatusIcon = currentStatus.icon;

  return (
    <div className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-800/20 rounded-3xl hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-700 cursor-pointer group">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-2xl ${currentStatus.bg} flex items-center justify-center ${currentStatus.text}`}>
          <StatusIcon className="w-6 h-6" />
        </div>
        <div>
          <span className="font-black text-slate-800 dark:text-slate-200 block text-sm truncate max-w-[150px]">{label}</span>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{date} • #{id.slice(-4)}</span>
        </div>
      </div>
      <div className="text-right">
        <span className="text-slate-900 dark:text-white font-black text-base block leading-none mb-1">ብር {amount}</span>
        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg ${currentStatus.bg} ${currentStatus.text}`}>
          {status}
        </span>
      </div>
    </div>
  );
};

const QuickAction = ({ icon: Icon, label, color, link }) => (
  <Link to={link || "#"} className="flex flex-col items-center gap-3 group">
    <div className={`w-16 h-16 rounded-[24px] ${color} text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-active:scale-95 transition-all duration-300 relative`}>
      <Icon className="w-7 h-7" />
      <div className="absolute inset-0 bg-white/20 rounded-[24px] opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] group-hover:text-blue-600 transition-colors">{label}</span>
  </Link>
);

const Dashboard = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profile = await getProfile();
        setUserProfile(profile);
        const [orderData, productData] = await Promise.all([
          getMyOrders(),
          getProducts(),
        ]);
        setOrders(orderData);
        setProducts(productData);
      } catch (err) {
        console.error("Dashboard data fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const sidebarItems = [
    { label: 'Dashboard', icon: BarChart2, link: '/buyer', active: true },
    { label: 'Explore', icon: Globe, link: '/buyer/discover' },
    { label: 'My Cart', icon: ShoppingCart, link: '/buyer/cart' },
    { label: 'My Orders', icon: Package, link: '/buyer/orders' },
    { label: 'Liked Products', icon: Heart, link: '/buyer/liked' },
    { label: 'Profile', icon: User, link: '/buyer/profile' },
  ];

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  const trendingStyles = products.slice(0, 4).map(p => ({
    id: p._id,
    name: p.title,
    price: p.price,
    image: p.image?.startsWith('http') ? p.image : `https://fashion-9hk0.onrender.com${p.image}`,
  }));

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      user={{ name: userProfile?.name || 'User', role: 'Buyer' }}
      themeColor="bg-blue-600"
      secondaryColor="bg-blue-700"
    >
      {/* Hero Welcome */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-slate-900 rounded-[40px] p-8 md:p-14 overflow-hidden mb-12 shadow-2xl shadow-blue-500/10"
      >
        <div className="relative z-10 max-w-2xl">
          <span className="px-5 py-2 bg-blue-600 rounded-full text-white text-[10px] font-black tracking-[0.3em] uppercase mb-8 inline-block shadow-lg shadow-blue-500/20">
            Welcome Back!
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-8 tracking-tighter uppercase shrink-0">
             Hello, <span className="text-blue-500">{userProfile?.name.split(' ')[0]}.</span> <br />
             Your style feed is ready.
          </h1>
          <p className="text-white/60 font-medium text-lg leading-relaxed mb-10 max-w-lg">
            Explore the latest Ethiopian fashion trends and exclusive collections tailored just for you.
          </p>
          <Link 
            to="/buyer/discover"
            className="inline-flex items-center gap-3 px-10 py-5 bg-white text-slate-900 rounded-2xl font-black text-base hover:bg-slate-100 transition-all shadow-xl hover:-translate-y-1 group"
          >
            Start Exploring
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
        
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-full bg-gradient-to-l from-blue-600/20 to-transparent blur-[120px] opacity-30 select-none pointer-events-none" />
        <div className="absolute -bottom-24 right-0 w-80 h-80 border-[40px] border-white/5 rounded-full blur-[10px] select-none pointer-events-none" />
      </motion.div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <StatCard title="Orders Placed" value={orders.length.toString().padStart(2, '0')} icon={Package} color="bg-blue-600" trend="History" />
        <StatCard title="Items Liked" value="00" icon={Heart} color="bg-rose-500" trend="Favorites" />
        <StatCard title="Shopping Cart" value="00" icon={ShoppingCart} color="bg-emerald-500" trend="Bag" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-12">
        
        {/* Quick Actions & Activity (Left Column) */}
        <div className="lg:col-span-7 space-y-10">
          
          {/* Quick Actions Section */}
          <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-xl shadow-black/5 border border-slate-100 dark:border-slate-800">
            <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight mb-8">Shortcuts</h2>
            <div className="flex flex-wrap items-center justify-between gap-6">
              <QuickAction icon={Package} label="Orders" color="bg-blue-500 shadow-blue-500/20" link="/buyer/orders" />
              <QuickAction icon={ShoppingCart} label="Cart" color="bg-emerald-500 shadow-emerald-500/20" link="/buyer/cart" />
              <QuickAction icon={User} label="Profile" color="bg-amber-500 shadow-amber-500/20" link="/buyer/profile" />
              <QuickAction icon={Gift} label="Offers" color="bg-rose-500 shadow-rose-500/20" />
              <QuickAction icon={ShieldCheck} label="Track" color="bg-indigo-500 shadow-indigo-500/20" />
            </div>
          </div>

          {/* Activity Section */}
          <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 md:p-10 shadow-xl shadow-black/5 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Recent Packages</h2>
              <Link to="/buyer/orders" className="text-blue-600 font-bold text-xs uppercase tracking-widest hover:translate-x-1 transition-transform">See all</Link>
            </div>
            <div className="space-y-4">
              {orders.slice(0, 3).map((order) => (
                <TransactionItem 
                  key={order._id} 
                  id={order._id}
                  status={order.status}
                  amount={order.totalPrice}
                  label={order.products[0]?.productId?.title || 'Order Item'}
                  date={new Date(order.createdAt).toLocaleDateString()}
                />
              ))}
              {orders.length === 0 && (
                <div className="py-10 text-center text-slate-400 font-medium">No recent orders found.</div>
              )}
            </div>
          </div>

        </div>

        {/* Trending Spotlight (Right Column) */}
        <div className="lg:col-span-5 space-y-10">
          
          <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-xl shadow-black/5 border border-slate-100 dark:border-slate-800 h-full">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Trending Styles</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Special for {userProfile?.name.split(' ')[0]}</p>
              </div>
              <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center">
                 <Globe className="w-5 h-5 text-blue-600 animate-pulse" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               {trendingStyles.map(product => (
                 <DashboardProductCard key={product.id} product={product} />
               ))}
            </div>

            <button className="w-full mt-10 py-5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-black text-xs uppercase tracking-widest rounded-2xl border border-slate-100 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-3 group">
              View Global Feed
              <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
