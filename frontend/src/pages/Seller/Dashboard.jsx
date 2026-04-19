import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { PlusCircle, ShoppingBag, List, TrendingUp, MoreVertical, Package, BarChart2, User, MessageSquare, Loader2 } from 'lucide-react';
import { getProfile } from '../../api/authApi';
import { getMyProducts } from '../../api/productApi';
import { getAllOrders } from '../../api/orderApi';

const StatCard = ({ title, value, icon: Icon, color = 'bg-orange-500' }) => (
  <div className="bg-white rounded-2xl p-6 shadow-lg shadow-black/5 flex items-center gap-6 border border-slate-100 transition-transform hover:-translate-y-1 duration-300">
    <div className={`w-14 h-14 ${color} text-white flex items-center justify-center rounded-2xl shadow-lg shadow-orange-500/20`}>
      <Icon className="w-8 h-8" />
    </div>
    <div>
      <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">{title}</h3>
      <p className="text-3xl font-bold text-slate-800">{value}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [myProducts, setMyProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [profile, products, allOrders] = await Promise.all([
          getProfile(),
          getMyProducts(token),
          getAllOrders()
        ]);
        setUserProfile(profile);
        setMyProducts(products);
        
        // Filter orders that contain this seller's products
        const sellerOrders = allOrders.filter(order => 
          order.products.some(p => products.some(mp => mp._id === p.productId?._id))
        );
        setOrders(sellerOrders);
      } catch (err) {
        console.error("Seller dashboard fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const sidebarItems = [
    { label: 'Dashboard', icon: BarChart2, link: '/seller', active: true },
    { label: 'Add Product', icon: PlusCircle, link: '/seller/add' },
    { label: 'My Products', icon: ShoppingBag, link: '/seller/products' },
    { label: 'Orders Received', icon: List, link: '/seller/orders' },
    { label: 'Sales Report', icon: TrendingUp, link: '/seller/report' },
    { label: 'Comments', icon: MessageSquare, link: '/seller/comments' },
    { label: 'My Profile', icon: User, link: '/seller/profile' },
  ];

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-10 h-10 text-orange-600 animate-spin" />
      </div>
    );
  }

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      user={{ name: userProfile?.name || 'Seller', role: 'Seller' }}
      themeColor="bg-orange-600"
      secondaryColor="bg-orange-700"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
        <StatCard title="Active Products" value={myProducts.length.toString()} icon={ShoppingBag} color="bg-orange-500" />
        <StatCard title="Total Orders" value={orders.length.toString()} icon={Package} color="bg-orange-600" />
        <StatCard title="Total Revenue" value={`ብር ${totalRevenue.toLocaleString()}`} icon={TrendingUp} color="bg-emerald-500" />
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-xl shadow-black/5 border border-slate-100 overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Recent activity</h2>
          <button className="p-2 rounded-full hover:bg-slate-100 transition-colors">
            <MoreVertical className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-sm font-medium uppercase tracking-widest">
                <th className="pb-4">Order ID</th>
                <th className="pb-4">Buyer</th>
                <th className="pb-4">Amount</th>
                <th className="pb-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {orders.slice(0, 5).map((order) => (
                <tr key={order._id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 font-mono text-sm text-slate-400">#{order._id.slice(-4)}</td>
                  <td className="py-4 font-semibold text-slate-800">{order.userId?.name || 'Customer'}</td>
                  <td className="py-4 font-bold text-slate-900">ብር {order.totalPrice.toFixed(2)}</td>
                  <td className="py-4 text-right px-2">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${
                      order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' : 
                      order.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-10 text-center text-slate-400 font-medium">No recent activity.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
