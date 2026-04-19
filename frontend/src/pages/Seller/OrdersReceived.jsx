import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { 
  PlusCircle, ShoppingBag, List, TrendingUp, BarChart2, 
  Search, Filter, Eye, Truck, CheckCircle, User, 
  MessageSquare, Loader2, PackageSearch
} from 'lucide-react';
import { getAllOrders } from '../../api/orderApi';
import { getMyProducts } from '../../api/productApi';
import { getProfile } from '../../api/authApi';

const statusColors = {
  Pending:   'bg-amber-100 text-amber-700',
  Completed: 'bg-emerald-100 text-emerald-700',
  Shipped:   'bg-blue-100 text-blue-700',
  Delivered: 'bg-emerald-100 text-emerald-700',
  Processing:'bg-blue-100 text-blue-700',
};

const OrdersReceived = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);

  const sidebarItems = [
    { label: 'Dashboard', icon: BarChart2, link: '/seller' },
    { label: 'Add Product', icon: PlusCircle, link: '/seller/add' },
    { label: 'My Products', icon: ShoppingBag, link: '/seller/products' },
    { label: 'Orders Received', icon: List, link: '/seller/orders', active: true },
    { label: 'Sales Report', icon: TrendingUp, link: '/seller/report' },
    { label: 'Comments', icon: MessageSquare, link: '/seller/comments' },
    { label: 'My Profile', icon: User, link: '/seller/profile' },
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const [profileData, myProducts, allOrders] = await Promise.all([
          getProfile(),
          getMyProducts(token),
          getAllOrders(),
        ]);
        setProfile(profileData);

        // Keep only orders that contain at least one of this seller's products
        const myProductIds = new Set(myProducts.map(p => p._id));
        const myOrders = allOrders.filter(order =>
          order.products.some(p => myProductIds.has(p.productId?._id || p.productId))
        );
        setOrders(myOrders);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setError('Failed to load orders. Please refresh.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filtered = orders.filter(o => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      o._id.toLowerCase().includes(s) ||
      (o.userId?.name || '').toLowerCase().includes(s)
    );
  });

  return (
    <DashboardLayout 
      sidebarItems={sidebarItems} 
      user={{ name: profile?.name || 'Seller', role: 'Seller' }}
      themeColor="bg-orange-600"
      secondaryColor="bg-orange-700"
    >
      <div className="bg-white rounded-3xl p-8 shadow-xl shadow-black/5 border border-slate-100 mb-10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Orders Received</h2>
            <p className="text-sm text-slate-400 mt-1">{orders.length} order{orders.length !== 1 ? 's' : ''} for your products</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search orders..." 
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20" 
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
          </div>
        ) : error ? (
          <div className="py-16 text-center">
            <p className="text-rose-500 font-bold">{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <PackageSearch className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-400 font-medium">
              {orders.length === 0
                ? 'No orders have been placed for your products yet.'
                : 'No orders match your search.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-sm font-medium uppercase tracking-widest">
                  <th className="pb-4">Order ID</th>
                  <th className="pb-4">Date</th>
                  <th className="pb-4">Buyer</th>
                  <th className="pb-4">Amount</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((order) => (
                  <tr key={order._id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 font-mono text-sm text-slate-400">#{order._id.slice(-8).toUpperCase()}</td>
                    <td className="py-4 font-semibold text-slate-800">
                      {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="py-4 text-slate-600 font-medium">{order.userId?.name || 'Customer'}</td>
                    <td className="py-4 font-bold text-slate-900">ብር {Number(order.totalPrice).toLocaleString()}</td>
                    <td className="py-4">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${statusColors[order.status] || 'bg-slate-100 text-slate-600'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all" title="View details">
                          <Eye className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-orange-600 hover:bg-orange-50 rounded-xl transition-all" title="Mark shipped">
                          <Truck className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default OrdersReceived;
