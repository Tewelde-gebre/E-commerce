import React, { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { 
  PlusCircle, ShoppingBag, List, TrendingUp, BarChart2, 
  DollarSign, Users, ShoppingCart, ArrowUpRight, ArrowDownRight, User,
  Calendar, PieChart, Activity
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';

const StatCard = ({ title, value, icon: Icon, color, trend, trendValue }) => (
  <div className="bg-white rounded-3xl p-8 shadow-xl shadow-black/5 border border-slate-100 transition-all hover:shadow-2xl hover:-translate-y-1">
    <div className="flex items-center justify-between mb-6">
      <div className={`w-14 h-14 ${color} text-white flex items-center justify-center rounded-2xl shadow-lg`}>
        <Icon className="w-8 h-8" />
      </div>
      {trend && (
        <div className={`flex items-center gap-1 font-bold text-sm ${trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
          {trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
          {trendValue}%
        </div>
      )}
    </div>
    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</h3>
    <p className="text-3xl font-black text-slate-800">{value}</p>
  </div>
);

const SalesReport = () => {
  const [timeframe, setTimeframe] = useState('monthly');

  const sidebarItems = [
    { label: 'Dashboard', icon: BarChart2, link: '/seller' },
    { label: 'Add Product', icon: PlusCircle, link: '/seller/add' },
    { label: 'My Products', icon: ShoppingBag, link: '/seller/products' },
    { label: 'Orders Received', icon: List, link: '/seller/orders' },
    { label: 'Sales Report', icon: TrendingUp, link: '/seller/report', active: true },
    { label: 'Comments', icon: MessageSquare, link: '/seller/comments' },
    { label: 'My Profile', icon: User, link: '/seller/profile' },
  ];

  const reportData = {
    weekly: [
      { name: 'Mon', sales: 1200, orders: 40 },
      { name: 'Tue', sales: 1900, orders: 55 },
      { name: 'Wed', sales: 1500, orders: 48 },
      { name: 'Thu', sales: 2200, orders: 70 },
      { name: 'Fri', sales: 2800, orders: 85 },
      { name: 'Sat', sales: 3500, orders: 110 },
      { name: 'Sun', sales: 3100, orders: 95 },
    ],
    monthly: [
      { name: 'Jan', sales: 4200, orders: 120 },
      { name: 'Feb', sales: 5100, orders: 145 },
      { name: 'Mar', sales: 4800, orders: 138 },
      { name: 'Apr', sales: 6200, orders: 180 },
      { name: 'May', sales: 7500, orders: 210 },
      { name: 'Jun', sales: 8800, orders: 250 },
    ],
    yearly: [
      { name: '2021', sales: 45000, orders: 1200 },
      { name: '2022', sales: 62000, orders: 1800 },
      { name: '2023', sales: 85000, orders: 2400 },
    ]
  };

  const chartColors = {
    weekly: '#f97316', // Orange
    monthly: '#3b82f6', // Blue
    yearly: '#8b5cf6', // Violet
  };

  return (
    <DashboardLayout 
      sidebarItems={sidebarItems} 
      user={{ name: 'Mike', role: 'Seller' }}
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
          
          <div className="flex p-1.5 bg-white rounded-2xl border border-slate-100 shadow-xl shadow-black/5">
            {['weekly', 'monthly', 'yearly'].map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  timeframe === t 
                    ? 'bg-slate-900 text-white shadow-lg' 
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatCard title="Total Revenue" value="ብር 12,850" icon={DollarSign} color="bg-orange-500" trend="up" trendValue="12.5" />
          <StatCard title="Total Orders" value="482" icon={ShoppingCart} color="bg-blue-500" trend="up" trendValue="8.2" />
          <StatCard title="Conversion Rate" value="3.4%" icon={Activity} color="bg-emerald-500" trend="down" trendValue="0.5" />
          <StatCard title="Active Customers" value="850" icon={Users} color="bg-rose-500" trend="up" trendValue="15.0" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 bg-white rounded-[40px] p-10 shadow-xl shadow-black/5 border border-slate-100">
             <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-orange-600 rounded-full" />
                  <h3 className="text-xl font-black text-slate-800 tracking-tight">Revenue Overview</h3>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                    Sales (ETB)
                  </div>
                </div>
             </div>

             <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={reportData[timeframe]} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={chartColors[timeframe]} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={chartColors[timeframe]} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                      dy={15}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                      tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '20px', 
                        border: 'none', 
                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                        padding: '12px 18px'
                      }}
                      itemStyle={{ fontWeight: 800, fontSize: '14px' }}
                      labelStyle={{ marginBottom: '4px', color: '#94a3b8', fontWeight: 700 }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="sales" 
                      stroke={chartColors[timeframe]} 
                      strokeWidth={4}
                      fillOpacity={1} 
                      fill="url(#colorSales)" 
                      animationDuration={1500}
                    />
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
                  <BarChart data={reportData[timeframe]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                    />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20}>
                      {reportData[timeframe].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3b82f6' : '#60a5fa'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
             </div>

             <div className="mt-8 pt-8 border-t border-slate-50 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Orders</span>
                  <span className="text-lg font-black text-slate-800">482</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Growth</span>
                  <span className="text-xs font-black text-emerald-500 uppercase">+12% vs LY</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SalesReport;
