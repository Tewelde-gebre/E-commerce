import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Users, LayoutGrid, ClipboardList, BarChart3, ShieldCheck, DollarSign, ShoppingBag, Activity, ArrowUpRight, TrendingUp } from 'lucide-react';

const ReportCard = ({ title, value, icon: Icon, color, description }) => (
  <div className="bg-slate-800/40 rounded-3xl p-8 border border-slate-700/50 hover:bg-slate-800 transition-all hover:shadow-2xl hover:shadow-blue-500/5 flex flex-col gap-6">
    <div className="flex items-center justify-between">
      <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
        <Icon className="w-8 h-8" />
      </div>
      <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
        <ArrowUpRight className="w-4 h-4" />
        <span className="text-xs font-black uppercase tracking-widest">Growth</span>
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
  const sidebarItems = [
    { label: 'Dashboard', icon: BarChart3, link: '/admin' },
    { label: 'Manage Users', icon: Users, link: '/admin/users' },
    { label: 'Manage Products', icon: LayoutGrid, link: '/admin/products' },
    { label: 'Manage Orders', icon: ClipboardList, link: '/admin/orders' },
    { label: 'Site Reports', icon: ShieldCheck, link: '/admin/reports', active: true },
  ];

  return (
    <DashboardLayout 
      sidebarItems={sidebarItems} 
      user={{ name: 'Admin', role: 'Admin' }}
      themeColor="bg-slate-900"
      secondaryColor="bg-slate-800"
      isDark={true}
      headerLeft={<div className="flex items-center gap-3"><ShieldCheck className="text-blue-400" /> Platform Intelligence</div>}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
         <ReportCard title="Revenue Growth" value="$142.5K" icon={DollarSign} color="bg-emerald-600" description="Total marketplace transaction volume across all registered merchants." />
         <ReportCard title="User Acquisition" value="+2,450" icon={Users} color="bg-blue-600" description="New registration metrics for buyers and sellers this quarter." />
         <ReportCard title="Product Listing" value="15.8K" icon={ShoppingBag} color="bg-rose-600" description="Total active items currently being brokered through the platform." />
      </div>

      <div className="bg-slate-800/30 rounded-3xl p-8 border border-slate-700 shadow-2xl">
         <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
            <div>
               <h2 className="text-2xl font-black text-white tracking-widest uppercase mb-1">System Health Analytics</h2>
               <p className="text-slate-500 text-sm font-bold">Real-time platform performance monitoring and auditing.</p>
            </div>
            <button className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-2xl border border-slate-600 transition-all flex items-center gap-3">
               <Activity className="w-5 h-5 text-blue-400" />
               Generate Full Report
            </button>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-8">
               {[
                  { label: 'Marketplace Volume', value: '85%', color: 'bg-emerald-500' },
                  { label: 'System Uptime', value: '99.9%', color: 'bg-blue-500' },
                  { label: 'User Retention', value: '72%', color: 'bg-indigo-500' },
                  { label: 'Seller Satisfaction', value: '94%', color: 'bg-orange-500' }
               ].map((item, idx) => (
                  <div key={idx}>
                      <div className="flex justify-between mb-3 text-xs font-black uppercase tracking-widest leading-none">
                          <span className="text-slate-500">{item.label}</span>
                          <span className="text-white">{item.value}</span>
                      </div>
                      <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                          <div className={`h-full ${item.color} rounded-full`} style={{ width: item.value.includes('%') ? item.value : '100%' }}></div>
                      </div>
                  </div>
               ))}
            </div>
            <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-700/50 flex flex-col items-center justify-center gap-6">
               <TrendingUp className="w-20 h-20 text-slate-700" />
               <p className="text-slate-500 font-bold tracking-widest uppercase text-center text-xs leading-loose">
                  Aggregated time-series data <br /> visualization is currently <br /> being processed for this node.
               </p>
            </div>
         </div>
      </div>
    </DashboardLayout>
  );
};

export default SiteReports;
