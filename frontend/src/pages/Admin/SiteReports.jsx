import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { 
  Users, LayoutGrid, ClipboardList, BarChart3, ShieldCheck, 
  DollarSign, ShoppingBag, Activity, ArrowUpRight, TrendingUp, Loader2
} from 'lucide-react';
import { getUsers } from '../../api/authApi';
import { getProducts } from '../../api/productApi';
import { getAllOrders } from '../../api/orderApi';

const ReportCard = ({ title, value, icon: Icon, color, description }) => (
  <div className="bg-slate-800/40 rounded-3xl p-8 border border-slate-700/50 hover:bg-slate-800 transition-all hover:shadow-2xl hover:shadow-blue-500/5 flex flex-col gap-6">
    <div className="flex items-center justify-between">
      <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
        <Icon className="w-8 h-8" />
      </div>
      <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
        <ArrowUpRight className="w-4 h-4" />
        <span className="text-xs font-black uppercase tracking-widest">Live</span>
      </div>
    </div>
    
    <div>
      <h3 className="font-bold text-white text-2xl mb-1 tracking-tight">{value}</h3>
      <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em]">{title}</p>
    </div>

    <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
  </div>
);

const SiteReports = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ users: 0, products: 0, revenue: 0, orders: 0 });

  const sidebarItems = [
    { label: 'Dashboard', icon: BarChart3, link: '/admin' },
    { label: 'Manage Users', icon: Users, link: '/admin/users' },
    { label: 'Manage Products', icon: LayoutGrid, link: '/admin/products' },
    { label: 'Manage Orders', icon: ClipboardList, link: '/admin/orders' },
    { label: 'Site Reports', icon: ShieldCheck, link: '/admin/reports', active: true },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [users, products, orders] = await Promise.all([
          getUsers(),
          getProducts(),
          getAllOrders(),
        ]);
        const revenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
        setStats({
          users: users.length,
          products: products.length,
          orders: orders.length,
          revenue,
        });
      } catch (err) {
        console.error('SiteReports fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Calculate a realistic percentage for the progress bars based on simple ratios
  const sellerCount = stats.users > 0 ? Math.min(100, Math.round((stats.orders / Math.max(1, stats.users)) * 10)) : 0;

  return (
    <DashboardLayout 
      sidebarItems={sidebarItems} 
      user={{ name: 'Admin', role: 'Admin' }}
      themeColor="bg-slate-900"
      secondaryColor="bg-slate-800"
      isDark={true}
      headerLeft={<div className="flex items-center gap-3"><ShieldCheck className="text-blue-400" /> Platform Intelligence</div>}
    >
      {loading ? (
        <div className="flex justify-center items-center py-32">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
             <ReportCard 
               title="Platform Revenue" 
               value={`ብር ${stats.revenue.toLocaleString()}`}
               icon={DollarSign} 
               color="bg-emerald-600" 
               description="Total marketplace transaction volume across all registered buyers." 
             />
             <ReportCard 
               title="Registered Users" 
               value={stats.users.toLocaleString()}
               icon={Users} 
               color="bg-blue-600" 
               description="Total registered accounts across buyers, sellers, and admins." 
             />
             <ReportCard 
               title="Active Listings" 
               value={stats.products.toLocaleString()} 
               icon={ShoppingBag} 
               color="bg-rose-600" 
               description="Total products currently listed by sellers on the platform." 
             />
          </div>

          <div className="bg-slate-800/30 rounded-3xl p-8 border border-slate-700 shadow-2xl">
             <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
                <div>
                   <h2 className="text-2xl font-black text-white tracking-widest uppercase mb-1">Platform Summary</h2>
                   <p className="text-slate-500 text-sm font-bold">Live data from your database.</p>
                </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-8">
                   {[
                      { label: 'Total Orders', value: stats.orders, max: Math.max(stats.orders, 1), color: 'bg-emerald-500' },
                      { label: 'Total Products', value: stats.products, max: Math.max(stats.products, 1), color: 'bg-blue-500' },
                      { label: 'Total Users', value: stats.users, max: Math.max(stats.users, 1), color: 'bg-indigo-500' },
                      { label: 'Platform Revenue (ብር)', value: Math.round(stats.revenue), max: Math.max(stats.revenue, 1), color: 'bg-orange-500' },
                   ].map((item, idx) => {
                     const pct = Math.min(100, Math.round((item.value / item.max) * 100));
                     return (
                       <div key={idx}>
                           <div className="flex justify-between mb-3 text-xs font-black uppercase tracking-widest leading-none">
                               <span className="text-slate-500">{item.label}</span>
                               <span className="text-white">{item.value.toLocaleString()}</span>
                           </div>
                           <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                               <div className={`h-full ${item.color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                           </div>
                       </div>
                     );
                   })}
                </div>
                <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-700/50 flex flex-col items-center justify-center gap-6">
                   <TrendingUp className="w-20 h-20 text-slate-700" />
                   <p className="text-slate-500 font-bold tracking-widest uppercase text-center text-xs leading-loose">
                     All data shown is live <br /> and pulled directly from <br /> the database in real time.
                   </p>
                </div>
             </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default SiteReports;
