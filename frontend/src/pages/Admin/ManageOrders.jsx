import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { Users, LayoutGrid, ClipboardList, BarChart3, Search, ShoppingCart, Filter, MoreVertical, Eye, Trash2, ShieldAlert, ShieldCheck } from 'lucide-react';

const OrderRow = ({ id, date, buyer, seller, amount, status }) => {
  return (
    <tr className="group hover:bg-slate-800 transition-colors border-b border-slate-700/50">
      <td className="py-6 px-4">
        <div className="flex flex-col">
          <span className="font-mono text-xs text-slate-400">ORDER-#{id}</span>
          <span className="text-slate-500 text-[10px] uppercase font-black tracking-widest">{date}</span>
        </div>
      </td>
      <td className="py-6 px-4">
          <div className="flex flex-col">
            <span className="font-bold text-white uppercase text-xs">{buyer}</span>
            <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest leading-tight">Buyer</span>
          </div>
      </td>
      <td className="py-6 px-4">
          <div className="flex flex-col">
            <span className="font-bold text-blue-400 uppercase text-xs">{seller}</span>
            <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest leading-tight">Merchant</span>
          </div>
      </td>
      <td className="py-6 px-4">
          <span className="text-lg font-black text-white">${amount}</span>
      </td>
      <td className="py-6 px-4">
        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${status === 'Delivered' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' : status === 'Processing' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' : 'bg-amber-500/20 text-amber-400 border border-amber-500/50'}`}>
          {status}
        </span>
      </td>
      <td className="py-6 px-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <button className="p-2.5 bg-slate-700 hover:bg-blue-500/20 text-slate-300 hover:text-blue-400 rounded-xl transition-all shadow-lg">
            <Eye className="w-5 h-5" />
          </button>
          <button className="p-2.5 bg-slate-700 hover:bg-red-500/20 text-slate-300 hover:text-red-400 rounded-xl transition-all shadow-lg">
            <Trash2 className="w-5 h-5" />
          </button>
          <button className="p-2.5 bg-slate-700 hover:bg-amber-500/20 text-slate-300 hover:text-amber-400 rounded-xl transition-all shadow-lg">
            <ShieldAlert className="w-5 h-5" />
          </button>
        </div>
      </td>
    </tr>
  );
};

const ManageOrders = () => {
  const sidebarItems = [
    { label: 'Dashboard', icon: BarChart3, link: '/admin' },
    { label: 'Manage Users', icon: Users, link: '/admin/users' },
    { label: 'Manage Products', icon: LayoutGrid, link: '/admin/products' },
    { label: 'Manage Orders', icon: ClipboardList, link: '/admin/orders' },
    { label: 'Site Reports', icon: ShieldCheck, link: '/admin/reports' },
  ];

  const orders = [
    { id: '1234', date: 'Oct 24, 2023', buyer: 'jane_doe', seller: 'mike_smith', amount: 45.00, status: 'Delivered' },
    { id: '1233', date: 'Oct 23, 2023', buyer: 'adam_89', seller: 'fashion_store', amount: 120.00, status: 'Processing' },
    { id: '1232', date: 'Oct 22, 2023', buyer: 'lisa_k', seller: 'nike_official', amount: 80.00, status: 'Pending' },
    { id: '1231', date: 'Oct 21, 2023', buyer: 'tom_brady', seller: 'sports_hub', amount: 250.00, status: 'Delivered' },
  ];

  return (
    <DashboardLayout 
      sidebarItems={sidebarItems} 
      user={{ name: 'Admin', role: 'Admin' }}
      themeColor="bg-slate-900"
      secondaryColor="bg-slate-800"
      isDark={true}
      headerLeft={<div className="flex items-center gap-3"><ClipboardList className="text-blue-400" /> Platform Transactions</div>}
    >
      <div className="bg-slate-800/30 rounded-3xl p-8 border border-slate-700 shadow-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
          <h2 className="text-2xl font-black text-white tracking-widest uppercase text-center md:text-left leading-tight">Global Transaction Log</h2>
          <div className="flex items-center gap-4 w-full md:w-auto">
             <div className="relative flex-1 md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input type="text" placeholder="Search order ID or Buyer name..." className="w-full pl-12 pr-6 py-4 bg-slate-800/80 border border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-bold text-white transition-all shadow-inner" />
             </div>
             <button className="p-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl transition-all shadow-lg active:scale-95 border border-slate-700">
                <Filter className="w-6 h-6 text-slate-400" />
             </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-700 text-slate-500 text-xs font-black uppercase tracking-[0.2em]">
                <th className="pb-6 px-4">Identification</th>
                <th className="pb-6 px-4">Origin</th>
                <th className="pb-6 px-4">Destination</th>
                <th className="pb-6 px-4">Volume</th>
                <th className="pb-6 px-4">Fulfillment</th>
                <th className="pb-6 px-4 text-right">System Override</th>
              </tr>
            </thead>
            <tbody>
               {orders.map((order, idx) => (
                  <OrderRow key={idx} {...order} />
               ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageOrders;
