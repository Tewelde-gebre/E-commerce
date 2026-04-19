import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { 
  Users, LayoutGrid, ClipboardList, BarChart3, Search, Package, 
  CheckCircle, XCircle, MoreVertical, ShieldAlert, Store, Tag, 
  Trash2, Filter, AlertCircle, ShoppingBag, ShieldCheck, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getProducts } from '../../api/productApi';
import axiosInstance from '../../api/axiosConfig';

const ProductCard = ({ id, name, status, category, price, items, seller, color, onAction }) => {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`bg-slate-800/20 rounded-[32px] p-8 border border-slate-700/50 hover:bg-slate-800 transition-all hover:shadow-2xl hover:shadow-blue-500/5 group flex flex-col gap-8 relative overflow-hidden ${status === 'Flagged' ? 'border-rose-500/30' : ''}`}
    >
      {status === 'Flagged' && (
        <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 bg-rose-500 text-white rounded-full text-[9px] font-black uppercase tracking-widest z-10 shadow-lg animate-pulse">
          <AlertCircle className="w-3 h-3" /> Flagged
        </div>
      )}

      <div className="flex items-start justify-between relative z-10">
        <div className={`w-16 h-16 ${color} text-white flex items-center justify-center rounded-2xl shadow-xl group-hover:scale-110 transition-transform`}>
          <Package className="w-9 h-9" />
        </div>
        <div className="flex flex-col gap-2">
           <button 
             onClick={() => onAction(id, 'Approve')}
             className="p-2.5 bg-slate-900/80 hover:bg-emerald-500/20 text-slate-500 hover:text-emerald-400 rounded-xl transition-all border border-slate-700/50"
             title="Approve Listing"
           >
             <CheckCircle className="w-5 h-5" />
           </button>
           <button 
             onClick={() => onAction(id, 'Flagged')}
             className="p-2.5 bg-slate-900/80 hover:bg-amber-500/20 text-slate-500 hover:text-amber-400 rounded-xl transition-all border border-slate-700/50"
             title="Flag Content"
           >
             <ShieldAlert className="w-5 h-5" />
           </button>
           <button 
             onClick={() => onAction(id, 'Delete')}
             className="p-2.5 bg-slate-900/80 hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 rounded-xl transition-all border border-slate-700/50"
             title="Delete Listing"
           >
             <Trash2 className="w-5 h-5" />
           </button>
        </div>
      </div>
      
      <div className="relative z-10">
        <h3 className="font-black text-white text-xl mb-1 tracking-tight truncate">{name}</h3>
        <div className="flex items-center gap-2 mb-4">
           <Store className="w-3.5 h-3.5 text-slate-500" />
           <p className="text-slate-400 text-xs font-bold truncate">Seller: <span className="text-blue-400">{seller}</span></p>
        </div>
        <div className="flex items-center gap-2">
            <span className="bg-slate-900 px-3 py-1 rounded-lg text-[9px] font-black text-slate-500 uppercase tracking-widest border border-slate-700/50">
              {category}
            </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 relative z-10">
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-white/5 group-hover:border-blue-500/20 transition-all">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Price (ETB)</p>
          <p className="text-lg font-black text-white">{price}</p>
        </div>
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-white/5 group-hover:border-blue-500/20 transition-all">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Stock</p>
          <p className="text-lg font-black text-white">{items} <span className="text-xs text-slate-500 font-bold">Qty</span></p>
        </div>
      </div>

      <div className="pt-6 border-t border-white/5 flex justify-between items-center relative z-10">
         <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
           status === 'Active' 
             ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
             : status === 'Flagged'
             ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
             : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
         }`}>
           {status}
         </span>
         <button className="p-2 text-slate-500 hover:text-white transition-colors bg-slate-900/50 rounded-xl">
            <MoreVertical className="w-5 h-5" />
         </button>
      </div>
    </motion.div>
  );
};

const CARD_COLORS = [
  'bg-rose-500', 'bg-indigo-600', 'bg-blue-600',
  'bg-emerald-600', 'bg-amber-600', 'bg-violet-600', 'bg-cyan-600'
];

const ManageProducts = () => {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sidebarItems = [
    { label: 'Dashboard', icon: BarChart3, link: '/admin' },
    { label: 'Manage Users', icon: Users, link: '/admin/users' },
    { label: 'Manage Products', icon: LayoutGrid, link: '/admin/products', active: true },
    { label: 'Manage Orders', icon: ClipboardList, link: '/admin/orders' },
    { label: 'Site Reports', icon: ShieldCheck, link: '/admin/reports' },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        // Map API data to the shape the card expects
        const mapped = data.map((p, idx) => ({
          id: p._id,
          name: p.title,
          status: p.status || 'Active',
          category: p.category || 'Uncategorized',
          price: Number(p.price).toLocaleString(),
          items: p.stock ?? 0,
          seller: p.sellerId?.name || p.sellerId?.email || 'Unknown Seller',
          color: CARD_COLORS[idx % CARD_COLORS.length],
        }));
        setProductList(mapped);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to load products. Please refresh.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAction = async (id, action) => {
    if (action === 'Delete') {
      try {
        const token = localStorage.getItem('token');
        await axiosInstance.delete(`/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProductList(prev => prev.filter(p => p.id !== id));
      } catch (err) {
        console.error('Delete failed:', err);
        alert('Failed to delete product.');
      }
    } else {
      // Local status toggle (Approve / Flag) — can be wired to a PATCH endpoint later
      setProductList(prev =>
        prev.map(p =>
          p.id === id ? { ...p, status: action === 'Approve' ? 'Active' : action } : p
        )
      );
    }
  };

  const filteredProducts = productList.filter(p => {
    const matchesFilter =
      filter === 'all' ||
      p.status.toLowerCase() === filter.toLowerCase() ||
      p.category.toLowerCase() === filter.toLowerCase();
    const matchesSearch =
      search === '' ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.seller.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <DashboardLayout 
      sidebarItems={sidebarItems} 
      user={{ name: 'Admin', role: 'Admin' }}
      themeColor="bg-slate-900"
      secondaryColor="bg-slate-800"
      isDark={true}
      headerLeft={<div className="flex items-center gap-3"><ShoppingBag className="text-blue-400" /> Catalog Moderation</div>}
    >
      <div className="flex flex-col xl:flex-row items-center justify-between mb-12 gap-8">
        <div>
          <h2 className="text-2xl font-black text-white tracking-widest uppercase mb-2">Global Inventory</h2>
          <div className="flex items-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
            <span className="text-blue-400">{productList.length} Total items</span>
            <span className="w-1.5 h-1.5 bg-slate-700 rounded-full" />
            <span className="text-amber-500">{productList.filter(p => p.status === 'Pending').length} Pending Review</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 w-full xl:w-auto">
          <div className="flex p-1.5 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl">
            {['all', 'Active', 'Pending', 'Flagged'].map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  filter === t 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          
          <div className="relative flex-1 sm:w-80 group">
             <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
             <input 
               type="text"
               value={search}
               onChange={e => setSearch(e.target.value)}
               placeholder="Search by product name or seller..." 
               className="w-full pl-14 pr-6 py-4 bg-slate-900/80 border border-slate-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold text-white transition-all shadow-inner placeholder:text-slate-600" 
             />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-32">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        </div>
      ) : error ? (
        <div className="py-20 text-center">
          <p className="text-rose-400 font-bold">{error}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
             <AnimatePresence mode="popLayout">
               {filteredProducts.map((p) => (
                  <ProductCard key={p.id} {...p} onAction={handleAction} />
               ))}
             </AnimatePresence>
          </div>

          {filteredProducts.length === 0 && (
            <div className="py-20 text-center">
              <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-8 border border-slate-800">
                <LayoutGrid className="w-10 h-10 text-slate-700" />
              </div>
              <h4 className="text-xl font-bold text-slate-500 italic">
                {productList.length === 0 ? 'No products have been posted yet.' : 'No products match this filter.'}
              </h4>
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
};

export default ManageProducts;
