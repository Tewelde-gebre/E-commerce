import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { PlusCircle, ShoppingBag, List, TrendingUp, BarChart2, Search, Filter, MoreVertical, Eye, Truck, CheckCircle, User, MessageSquare } from 'lucide-react';

const OrdersReceived = () => {
  const sidebarItems = [
    { label: 'Dashboard', icon: BarChart2, link: '/seller' },
    { label: 'Add Product', icon: PlusCircle, link: '/seller/add' },
    { label: 'My Products', icon: ShoppingBag, link: '/seller/products' },
    { label: 'Orders Received', icon: List, link: '/seller/orders', active: true },
    { label: 'Sales Report', icon: TrendingUp, link: '/seller/report' },
    { label: 'Comments', icon: MessageSquare, link: '/seller/comments' },
    { label: 'My Profile', icon: User, link: '/seller/profile' },
  ];

  const orders = [
    { id: '1055', date: 'Oct 24, 2023', buyer: 'Sarah T.', amount: 75.00, status: 'Pending', items: 2 },
    { id: '1054', date: 'Oct 23, 2023', buyer: 'John K.', amount: 120.00, status: 'Completed', items: 3 },
    { id: '1053', date: 'Oct 22, 2023', buyer: 'Lisa M.', amount: 50.00, status: 'Shipped', items: 1 },
  ];

  const statusColors = {
    Pending: 'bg-amber-100 text-amber-700',
    Completed: 'bg-emerald-100 text-emerald-700',
    Shipped: 'bg-blue-100 text-blue-700',
  };

  return (
    <DashboardLayout 
      sidebarItems={sidebarItems} 
      user={{ name: 'Mike', role: 'Seller' }}
      themeColor="bg-orange-600"
      secondaryColor="bg-orange-700"
    >
      <div className="bg-white rounded-3xl p-8 shadow-xl shadow-black/5 border border-slate-100 mb-10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Orders Received</h2>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Search orders..." className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20" />
            </div>
            <button className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
              <Filter className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

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
              {orders.map((order) => (
                <tr key={order.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 font-mono text-sm text-slate-400">#{order.id}</td>
                  <td className="py-4 font-semibold text-slate-800">{order.date}</td>
                  <td className="py-4 text-slate-600 font-medium">{order.buyer}</td>
                  <td className="py-4 font-bold text-slate-900">${order.amount.toFixed(2)}</td>
                  <td className="py-4">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex justify-end gap-2">
                       <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all" title="View details">
                        <Eye className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-orange-600 hover:bg-orange-50 rounded-xl transition-all" title="Ship order">
                        <Truck className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OrdersReceived;
