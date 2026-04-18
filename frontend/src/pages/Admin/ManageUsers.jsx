import React, { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { 
  Users, LayoutGrid, ClipboardList, BarChart3, Search, 
  UserCheck, UserX, UserPlus, Shield, Trash2, Ban, 
  Filter, MoreHorizontal, CheckCircle2, ShieldCheck 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UserRow = ({ id, name, email, role, status, onAction }) => {
  return (
    <motion.tr 
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="group hover:bg-slate-800/60 transition-all border-b border-white/5"
    >
      <td className="py-7 px-6">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-xl shadow-blue-500/20 uppercase">
              {name[0]}
            </div>
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-white text-lg tracking-tight">{name}</span>
            <span className="text-slate-500 text-[11px] font-mono tracking-tighter uppercase">{email}</span>
          </div>
        </div>
      </td>
      <td className="py-7 px-6">
        <div className="flex items-center gap-2">
           <Shield className={`w-4 h-4 ${role === 'Admin' ? 'text-violet-400' : role === 'Seller' ? 'text-orange-400' : 'text-blue-400'}`} />
           <span className="text-slate-300 font-black uppercase text-[10px] tracking-widest">{role}</span>
        </div>
      </td>
      <td className="py-7 px-6">
        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
          status === 'Active' 
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
        }`}>
          {status}
        </span>
      </td>
      <td className="py-7 px-6 text-right">
        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onAction(id, 'toggleStatus')}
            className={`p-3 rounded-xl transition-all shadow-lg ${status === 'Active' ? 'bg-slate-700 hover:bg-rose-500/20 text-rose-400' : 'bg-slate-700 hover:bg-emerald-500/20 text-emerald-400'}`}
            title={status === 'Active' ? 'Ban User' : 'Activate User'}
          >
            {status === 'Active' ? <Ban className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
          </button>
          <button 
            onClick={() => onAction(id, 'delete')}
            className="p-3 bg-slate-700 hover:bg-rose-600 text-slate-300 hover:text-white rounded-xl transition-all shadow-lg"
            title="Delete Permanently"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </td>
    </motion.tr>
  );
};

const ManageUsers = () => {
  const [filter, setFilter] = useState('all');
  const [userList, setUserList] = useState([
    { id: 1, name: 'አበበ_fashion', email: 'abebe@ethio.com', role: 'Seller', status: 'Active' },
    { id: 2, name: 'samuel_k', email: 'sam@buyer.com', role: 'Buyer', status: 'Active' },
    { id: 3, name: 'ለማ_admin', email: 'lema@admin.com', role: 'Admin', status: 'Active' },
    { id: 4, name: 'rebel_user', email: 'flagged@spam.com', role: 'Buyer', status: 'Inactive' },
    { id: 5, name: 'ethio_store', email: 'store@ethio.com', role: 'Seller', status: 'Active' },
  ]);

  const sidebarItems = [
    { label: 'Dashboard', icon: BarChart3, link: '/admin' },
    { label: 'Manage Users', icon: Users, link: '/admin/users', active: true },
    { label: 'Manage Products', icon: LayoutGrid, link: '/admin/products' },
    { label: 'Manage Orders', icon: ClipboardList, link: '/admin/orders' },
    { label: 'Site Reports', icon: ShieldCheck, link: '/admin/reports' },
  ];

  const handleAction = (id, action) => {
    if (action === 'delete') {
      setUserList(userList.filter(u => u.id !== id));
    } else if (action === 'toggleStatus') {
      setUserList(userList.map(u => 
        u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u
      ));
    }
  };

  const filteredUsers = filter === 'all' 
    ? userList 
    : userList.filter(u => u.role.toLowerCase() === filter);

  return (
    <DashboardLayout 
      sidebarItems={sidebarItems} 
      user={{ name: 'Admin', role: 'Admin' }}
      themeColor="bg-slate-900"
      secondaryColor="bg-slate-800"
      isDark={true}
      headerLeft={<div className="flex items-center gap-3"><Users className="text-blue-400" /> Administrative Moderation</div>}
    >
      <div className="bg-slate-800/20 rounded-[40px] p-10 border border-slate-700 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full" />
        
        <div className="flex flex-col xl:flex-row items-center justify-between mb-12 gap-8 relative z-10">
          <div>
            <h2 className="text-2xl font-black text-white tracking-widest uppercase mb-2">Platform Users</h2>
            <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" /> {userList.length} Total Users
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" /> {userList.filter(u => u.status === 'Active').length} Verified
               </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 w-full xl:w-auto">
             <div className="flex p-1.5 bg-slate-900 border border-slate-700 rounded-2xl shadow-xl">
                {['all', 'seller', 'buyer', 'admin'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilter(t)}
                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      filter === t 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {t}s
                  </button>
                ))}
             </div>
             
             <div className="relative flex-1 sm:w-80 group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Query user records..." 
                  className="w-full pl-14 pr-6 py-4 bg-slate-900/80 border border-slate-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold text-white transition-all shadow-inner placeholder:text-slate-600" 
                />
             </div>
          </div>
        </div>

        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 text-slate-500 text-xs font-black uppercase tracking-[0.25em]">
                <th className="pb-8 px-6">User Primary Identity</th>
                <th className="pb-8 px-6">Assigned Role</th>
                <th className="pb-8 px-6">Security Status</th>
                <th className="pb-8 px-6 text-right">Moderator Actions</th>
              </tr>
            </thead>
            <tbody>
               <AnimatePresence mode="popLayout">
                 {filteredUsers.map((user) => (
                    <UserRow key={user.id} {...user} onAction={handleAction} />
                 ))}
               </AnimatePresence>
            </tbody>
          </table>
          
          {filteredUsers.length === 0 && (
            <div className="py-20 text-center">
              <div className="w-20 h-20 bg-slate-900 rounded-[32px] flex items-center justify-center mx-auto mb-6 border border-slate-800">
                <Shield className="w-10 h-10 text-slate-700" />
              </div>
              <h4 className="text-xl font-bold text-slate-400 italic">No correlating user records found</h4>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageUsers;
