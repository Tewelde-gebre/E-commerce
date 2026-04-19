import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { 
  PlusCircle, ShoppingBag, List, TrendingUp, BarChart2, 
  DollarSign, Users, ShoppingCart, ArrowUpRight, ArrowDownRight, User,
  Activity, MessageSquare, Loader2
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { getProfile } from '../../api/authApi';
import { getMyProducts } from '../../api/productApi';
import { getAllOrders } from '../../api/orderApi';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-3xl p-8 shadow-xl shadow-black/5 border border-slate-100 transition-all hover:shadow-2xl hover:-translate-y-1">
    <div className="flex items-center justify-between mb-6">
      <div className={`w-14 h-14 ${color} text-white flex items-center justify-center rounded-2xl shadow-lg`}>
        <Icon className="w-8 h-8" />
      </div>
    </div>
    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</h3>
    <p className="text-3xl font-black text-slate-800">{value}</p>
  </div>
);

// Groups orders by month label (last 6 months)
const buildMonthlyChart = (orders) => {
  const months = {};
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = d.toLocaleString('default', { month: 'short' });
    months[key] = { name: key, sales: 0, orders: 0 };
  }
  orders.forEach(order => {
    const d = new Date(order.createdAt);
    const key = d.toLocaleString('default', { month: 'short' });
    if (months[key]) {
      months[key].sales += order.totalPrice || 0;
      months[key].orders += 1;
    }
  });
  return Object.values(months);
};

const SalesReport = () => {
  const [profile, setProfile] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);

  const sidebarItems = [
    { label: 'Dashboard', icon: BarChart2, link: '/seller' },
    { label: 'Add Product', icon: PlusCircle, link: '/seller/add' },
    { label: 'My Products', icon: ShoppingBag, link: '/seller/products' },
    { label: 'Orders Received', icon: List, link: '/seller/orders' },
    { label: 'Sales Report', icon: TrendingUp, link: '/seller/report', active: true },
    { label: 'Comments', icon: MessageSquare, link: '/seller/comments' },
    { label: 'My Profile', icon: User, link: '/seller/profile' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [profileData, myProducts, allOrders] = await Promise.all([
          getProfile(),
          getMyProducts(token),
          getAllOrders(),
        ]);
        setProfile(profileData);
        setTotalProducts(myProducts.length);

        const myProductIds = new Set(myProducts.map(p => p._id));
        const myOrders = allOrders.filter(order =>
          order.products.some(p => myProductIds.has(p.productId?._id || p.productId))
        );

        const revenue = myOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
        setTotalRevenue(revenue);
        setTotalOrders(myOrders.length);
        setChartData(buildMonthlyChart(myOrders));
      } catch (err) {
        console.error('SalesReport fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <DashboardLayout 
      sidebarItems={sidebarItems} 
      user={{ name: profile?.name || 'Seller', role: 'Seller' }}
      themeColor="bg-orange-600"
      secondaryColor="bg-orange-700"
    >
      <div className="space-y-10 pb-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl">
              <TrendingUp className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">Sales Analytics</h2>
              <p className="text-sm font-bold text-slate-400 tracking-wide uppercase">Track your business performance</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-32">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <StatCard title="Total Revenue" value={`ብር ${totalRevenue.toLocaleString()}`} icon={DollarSign} color="bg-orange-500" />
              <StatCard title="Total Orders" value={totalOrders.toString()} icon={ShoppingCart} color="bg-blue-500" />
              <StatCard title="Active Products" value={totalProducts.toString()} icon={ShoppingBag} color="bg-emerald-500" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2 bg-white rounded-[40px] p-10 shadow-xl shadow-black/5 border border-slate-100">
                 <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-6 bg-orange-600 rounded-full" />
                      <h3 className="text-xl font-black text-slate-800 tracking-tight">Revenue Overview (Last 6 Months)</h3>
                    </div>
                 </div>
                 <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} dy={15} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} />
                        <Tooltip 
                          contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px 18px' }}
                          itemStyle={{ fontWeight: 800, fontSize: '14px' }}
                          labelStyle={{ marginBottom: '4px', color: '#94a3b8', fontWeight: 700 }}
                        />
                        <Area type="monotone" dataKey="sales" stroke="#f97316" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" animationDuration={1500} />
                      </AreaChart>
                    </ResponsiveContainer>
                 </div>
              </div>

              <div className="bg-white rounded-[40px] p-10 shadow-xl shadow-black/5 border border-slate-100 flex flex-col">
                 <div className="flex items-center gap-3 mb-10">
                    <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                    <h3 className="text-xl font-black text-slate-800 tracking-tight">Order Activity</h3>
                 </div>
                 <div className="flex-1 h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                        <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                        <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3b82f6' : '#60a5fa'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                 </div>
                 <div className="mt-8 pt-8 border-t border-slate-50 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Orders</span>
                      <span className="text-lg font-black text-slate-800">{totalOrders}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Revenue</span>
                      <span className="text-sm font-black text-emerald-600">ብር {totalRevenue.toLocaleString()}</span>
                    </div>
                 </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SalesReport;
