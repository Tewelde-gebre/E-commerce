import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { PlusCircle, ShoppingBag, List, TrendingUp, BarChart2, Edit2, Trash2, ExternalLink, User, MessageSquare, Loader2 } from 'lucide-react';
import { getMyProducts } from '../../api/productApi';

const MyProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem('userInfo') || '{"name": "Seller", "role": "seller"}');

  useEffect(() => {
    const fetchMyProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        const data = await getMyProducts(token);
        setProducts(data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch products. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchMyProducts();
  }, [navigate]);

  const sidebarItems = [
    { label: 'Dashboard', icon: BarChart2, link: '/seller' },
    { label: 'Add Product', icon: PlusCircle, link: '/seller/add' },
    { label: 'My Products', icon: ShoppingBag, link: '/seller/products', active: true },
    { label: 'Orders Received', icon: List, link: '/seller/orders' },
    { label: 'Sales Report', icon: TrendingUp, link: '/seller/report' },
    { label: 'Comments', icon: MessageSquare, link: '/seller/comments' },
    { label: 'My Profile', icon: User, link: '/seller/profile' },
  ];

  return (
    <DashboardLayout 
      sidebarItems={sidebarItems} 
      user={user}
      themeColor="bg-orange-600"
      secondaryColor="bg-orange-700"
    >
      <div className="bg-white rounded-3xl p-8 shadow-xl shadow-black/5 border border-slate-100 mb-10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">My Products</h2>
          <button 
            onClick={() => navigate('/seller/add')}
            className="bg-orange-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-orange-500/20 hover:bg-orange-700 transition-all flex items-center gap-2"
          >
            <PlusCircle className="w-5 h-5" />
            Add New Product
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
            <p className="font-bold text-slate-400">Loading your inventory...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 rounded-2xl p-8 text-center border border-red-100">
            <p className="text-red-500 font-bold">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 text-sm font-black text-red-600 hover:underline"
            >
              Retry
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <ShoppingBag className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-bold mb-4">You haven't posted any clothes yet.</p>
            <button 
              onClick={() => navigate('/seller/add')}
              className="text-orange-600 font-black hover:underline"
            >
              Start selling now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product._id} className="flex flex-col p-5 rounded-2xl bg-slate-50 border border-slate-100 group transition-all hover:bg-white hover:shadow-xl">
                <div className="w-full aspect-square rounded-xl overflow-hidden bg-white shadow-sm mb-5 relative">
                  <img 
                    src={product.image.startsWith('http') ? product.image : `http://localhost:5000${product.image}`} 
                    alt={product.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute top-3 right-3 flex gap-1 transform translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <button className="w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur text-slate-600 hover:text-blue-600 rounded-full shadow-lg">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur text-slate-600 hover:text-red-500 rounded-full shadow-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className="font-bold text-slate-800 text-lg leading-tight line-clamp-1">{product.title}</h3>
                    <p className="text-orange-600 font-black whitespace-nowrap">{product.currency === 'Dollar' ? '$' : 'ብር'}{product.price?.toLocaleString()}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold uppercase tracking-widest text-slate-500">Stock: <span className="text-slate-800">{product.stock || 0}</span></span>
                    <span className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold uppercase tracking-widest text-slate-500">Type: <span className="text-slate-800">{product.productType || 'Cloth'}</span></span>
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                    <button className="flex items-center gap-1.5 hover:text-orange-600 transition-colors">
                      <ExternalLink className="w-4 h-4" /> View Post
                    </button>
                    <span>{product.likes?.length || 0} Likes</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyProducts;
