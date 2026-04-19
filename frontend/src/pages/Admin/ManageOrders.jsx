import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { 
  Users, LayoutGrid, ClipboardList, BarChart3, Search, 
  ShoppingCart, Filter, MoreVertical, Eye, Trash2, 
  ShieldAlert, ShieldCheck, Loader2, PackageSearch
} from 'lucide-react';
import { getAllOrders } from '../../api/orderApi';

const statusStyle = (status) => {
  if (status === 'Delivered') return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50';
  if (status === 'Processing') return 'bg-blue-500/20 text-blue-400 border border-blue-500/50';
  if (status === 'Shipped') return 'bg-violet-500/20 text-violet-400 border border-violet-500/50';
  return 'bg-amber-500/20 text-amber-400 border border-amber-500/50'; // Pending
};

const OrderRow = ({ id, date, buyer, products, amount, status }) => {
  return (
    <tr className="group hover:bg-slate-800 transition-colors border-b border-slate-700/50">
      <td className="py-6 px-4">
        <div className="flex flex-col">
          <span className="font-mono text-xs text-slate-300">#{id.slice(-8).toUpperCase()}</span>
          <span className="text-slate-500 text-[10px] uppercase font-black tracking-widest">{date}</span>
        </div>
      </td>
      <td className="py-6 px-4">
        <div className="flex flex-col">
          <span className="font-bold text-white uppercase text-xs">{buyer?.name || 'Unknown'}</span>
          <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest leading-tight">{buyer?.email || ''}</span>
        </div>
      </td>
      <td className="py-6 px-4">
        <div className="flex flex-col gap-1">
          {products && products.length > 0 ? (
            products.slice(0, 2).map((item, i) => (
              <span key={i} className="font-bold text-blue-400 text-xs truncate max-w-[160px]">
                {item.productId?.title || 'Deleted Product'} × {item.quantity}
              </span>
            ))
          ) : (
            <span className="text-slate-500 text-xs">No items</span>
          )}
          {products && products.length > 2 && (
            <span className="text-slate-500 text-[10px]">+{products.length - 2} more</span>
          )}
        </div>
      </td>
      <td className="py-6 px-4">
        <span className="text-lg font-black text-white">ብር {Number(amount).toLocaleString()}</span>
      </td>
      <td className="py-6 px-4">
        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${statusStyle(status)}`}>
          {status}
        </span>
      </td>
      <td className="py-6 px-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <button className="p-2.5 bg-slate-700 hover:bg-blue-500/20 text-slate-300 hover:text-blue-400 rounded-xl transition-all shadow-lg" title="View order">
            <Eye className="w-5 h-5" />
          </button>
          <button className="p-2.5 bg-slate-700 hover:bg-amber-500/20 text-slate-300 hover:text-amber-400 rounded-xl transition-all shadow-lg" title="Flag order">
            <ShieldAlert className="w-5 h-5" />
          </button>
        </div>
      </td>
    </tr>
  );
};

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sidebarItems = [
    { label: 'Dashboard', icon: BarChart3, link: '/admin' },
    { label: 'Manage Users', icon: Users, link: '/admin/users' },
    { label: 'Manage Products', icon: LayoutGrid, link: '/admin/products' },
    { label: 'Manage Orders', icon: ClipboardList, link: '/admin/orders', active: true },
    { label: 'Site Reports', icon: ShieldCheck, link: '/admin/reports' },
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await getAllOrders();
        setOrders(data);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setError('Failed to load orders. Please refresh.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      order._id?.toLowerCase().includes(s) ||
      order.userId?.name?.toLowerCase().includes(s) ||
      order.userId?.email?.toLowerCase().includes(s)
    );
  });

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
          <div>
            <h2 className="text-2xl font-black text-white tracking-widest uppercase text-center md:text-left leading-tight">
              Global Transaction Log
            </h2>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1 text-center md:text-left">
              {orders.length} total order{orders.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
             <div className="relative flex-1 md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by Order ID or buyer name..."
                  className="w-full pl-12 pr-6 py-4 bg-slate-800/80 border border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-bold text-white transition-all shadow-inner placeholder:text-slate-600"
                />
             </div>
             <button className="p-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl transition-all shadow-lg active:scale-95 border border-slate-700">
                <Filter className="w-6 h-6 text-slate-400" />
             </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          </div>
        ) : error ? (
          <div className="py-20 text-center">
            <p className="text-rose-400 font-bold">{error}</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-8 border border-slate-800">
              <PackageSearch className="w-10 h-10 text-slate-700" />
            </div>
            <h4 className="text-xl font-bold text-slate-500 italic">
              {orders.length === 0 ? 'No orders have been placed yet.' : 'No orders match your search.'}
            </h4>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-700 text-slate-500 text-xs font-black uppercase tracking-[0.2em]">
                  <th className="pb-6 px-4">Order ID</th>
                  <th className="pb-6 px-4">Buyer</th>
                  <th className="pb-6 px-4">Items</th>
                  <th className="pb-6 px-4">Total</th>
                  <th className="pb-6 px-4">Status</th>
                  <th className="pb-6 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                 {filteredOrders.map((order) => (
                    <OrderRow 
                      key={order._id}
                      id={order._id}
                      date={new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      buyer={order.userId}
                      products={order.products}
                      amount={order.totalPrice}
                      status={order.status}
                    />
                 ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ManageOrders;
