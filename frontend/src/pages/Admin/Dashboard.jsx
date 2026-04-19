import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { 
  Users, LayoutGrid, ClipboardList, BarChart3, ShieldCheck, 
  UserX, Package, ShoppingCart, ArrowUpRight, TrendingUp, AlertTriangle,
  Activity, Zap, Loader2
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getUsers, getProfile } from '../../api/authApi';
import { getProducts } from '../../api/productApi';
import { getAllOrders } from '../../api/orderApi';

const StatCard = ({ title, value, icon: Icon, color = 'bg-slate-700', trend }) => (
  <div className="bg-slate-800/40 rounded-3xl p-8 border border-slate-700/50 shadow-2xl flex flex-col gap-6 transition-all hover:border-blue-500/30 group">
    <div className="flex items-center justify-between">
      <div className={`w-14 h-14 ${color} text-white flex items-center justify-center rounded-2xl shadow-lg group-hover:scale-110 transition-transform`}>
        <Icon className="w-8 h-8" />
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-emerald-400 font-black text-xs uppercase tracking-widest">
          <ArrowUpRight className="w-4 h-4" />
          {trend}%
        </div>
      )}
    </div>
    <div>
      <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-1">{title}</h3>
      <p className="text-3xl font-black text-white">{value}</p>
    </div>
  </div>
);

const UserRow = ({ name, email, time }) => {
  return (
    <div className="flex items-center justify-between p-5 bg-slate-900/40 rounded-2xl hover:bg-slate-800 transition-all border border-slate-700/30 group">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-black text-xs uppercase border border-blue-500/20">
          {name ? name[0].toUpperCase() : 'U'}
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-white text-sm">{name || 'Anonymous User'}</span>
          <span className="text-slate-500 text-[10px] font-mono tracking-tighter uppercase">{email}</span>
        </div>
      </div>
      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
        {time}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [adminProfile, setAdminProfile] = useState(null);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profile, userData, productData, orderData] = await Promise.all([
          getProfile(),
          getUsers(),
          getProducts(),
          getAllOrders()
        ]);
        setAdminProfile(profile);
        setUsers(userData);
        setProducts(productData);
        setOrders(orderData);
      } catch (err) {
        console.error("Admin dashboard fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const sidebarItems = [
    { label: 'Dashboard', icon: BarChart3, link: '/admin', active: true },
    { label: 'Manage Users', icon: Users, link: '/admin/users' },
    { label: 'Manage Products', icon: LayoutGrid, link: '/admin/products' },
    { label: 'Manage Orders', icon: ClipboardList, link: '/admin/orders' },
    { label: 'Site Reports', icon: ShieldCheck, link: '/admin/reports' },
  ];

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);

  // Build last-7-days chart from real orders
  const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const growthData = (() => {
    const today = new Date();
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (6 - i));
      return { name: DAY_LABELS[d.getDay()], sales: 0, users: 0, _date: d.toDateString() };
    });
    orders.forEach(order => {
      const d = new Date(order.createdAt).toDateString();
      const slot = days.find(s => s._date === d);
      if (slot) { slot.sales += order.totalPrice || 0; slot.users += 1; }
    });
    users.forEach(user => {
      const d = new Date(user.createdAt).toDateString();
      const slot = days.find(s => s._date === d);
      if (slot) slot.users += 1;
    });
    return days.map(({ name, sales, users }) => ({ name, sales, users }));
  })();

  return (
    <DashboardLayout 
      sidebarItems={sidebarItems} 
      user={{ name: adminProfile?.name || 'Admin', role: 'Admin' }}
      themeColor="bg-slate-900"
      secondaryColor="bg-slate-800"
      isDark={true}
      headerLeft={<div className="flex items-center gap-3"><ShieldCheck className="text-blue-400" /> Platform Governance</div>}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <StatCard title="Total Users" value={users.length.toLocaleString()} icon={Users} color="bg-blue-600" />
        <StatCard title="Total Products" value={products.length.toLocaleString()} icon={Package} color="bg-orange-600" />
        <StatCard title="Total Orders" value={orders.length.toLocaleString()} icon={Zap} color="bg-amber-600" />
        <StatCard title="Platform Revenue" value={totalRevenue >= 1000 ? `ብር ${(totalRevenue/1000).toFixed(1)}K` : `ብር ${totalRevenue.toLocaleString()}`} icon={TrendingUp} color="bg-emerald-600" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        <div className="xl:col-span-2 bg-slate-800/20 rounded-[40px] p-10 border border-slate-700 shadow-2xl overflow-hidden relative">
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full" />
           <div className="flex items-center justify-between mb-10 relative z-10">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Platform Growth</h2>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Activity over the last 7 days</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-400">
                  <div className="w-2 h-2 rounded-full bg-blue-400" /> Users
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-400">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" /> Sales
                </div>
              </div>
           </div>

           <div className="h-[350px] w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={growthData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 800 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 800 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', borderRadius: '16px', border: '1px solid #334155', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)' }}
                      itemStyle={{ fontWeight: 800, fontSize: '12px' }}
                      labelStyle={{ color: '#64748b', marginBottom: '4px', fontWeight: 800 }}
                    />
                    <Area type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorUsers)" />
                    <Area type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
                  </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="bg-slate-800/20 rounded-[40px] p-10 border border-slate-700 shadow-2xl">
           <div className="flex items-center gap-3 mb-10">
              <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl">
                 <Activity className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black text-white tracking-tight">Recent Users</h2>
           </div>
           
           <div className="space-y-4">
            {users.slice(-5).reverse().map((user) => (
              <UserRow 
                key={user._id} 
                name={user.name} 
                email={user.email} 
                time={new Date(user.createdAt).toLocaleDateString()} 
              />
            ))}
            {users.length === 0 && (
              <div className="py-10 text-center text-slate-500 font-medium">No users found.</div>
            )}
           </div>

           <button className="w-full mt-10 py-5 bg-slate-900 rounded-[20px] text-xs font-black text-slate-400 uppercase tracking-widest hover:text-white hover:bg-slate-800 transition-all border border-slate-700/50">
              Full Activity Log
           </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
