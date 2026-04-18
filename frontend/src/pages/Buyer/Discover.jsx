import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../../layouts/DashboardLayout';
import ProductPost from '../../components/ProductPost';
import { ShoppingCart, Package, Heart, User, Search, BarChart2, Globe, CreditCard, Smartphone, Building2, ChevronRight, CheckCircle2, X, Loader2 } from 'lucide-react';
import { getProducts } from '../../api/productApi';
import { getProfile } from '../../api/authApi';
import { createOrder, initializeChapaPayment } from '../../api/orderApi';

const ethiopianBanks = [
  {
    id: 'telebirr',
    name: 'TeleBirr',
    desc: 'Ethio Telecom Mobile Money',
    color: 'from-green-500 to-emerald-600',
    icon: '📱',
    popular: true
  },
  {
    id: 'cbe',
    name: 'CBE Birr',
    desc: 'Commercial Bank of Ethiopia',
    color: 'from-purple-600 to-indigo-600',
    icon: '🏦',
    popular: true
  },
  {
    id: 'awash',
    name: 'Awash Bank',
    desc: 'Awash Mobile Banking',
    color: 'from-amber-500 to-orange-600',
    icon: '🏦',
    popular: true
  },
  {
    id: 'abyssinia',
    name: 'Abyssinia Bank',
    desc: 'Bank of Abyssinia',
    color: 'from-teal-500 to-cyan-600',
    icon: '🏛️',
    popular: false
  },
  {
    id: 'dashen',
    name: 'Dashen Bank',
    desc: 'Dashen Amole Mobile',
    color: 'from-red-500 to-rose-600',
    icon: '💳',
    popular: false
  },
];

const Discover = () => {
  const [products, setProducts] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedBank, setSelectedBank] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentProduct, setPaymentProduct] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productData, profile] = await Promise.all([
          getProducts(),
          getProfile()
        ]);
        setProducts(productData);
        setUserProfile(profile);
      } catch (err) {
        console.error("Discover data fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const sidebarItems = [
    { label: 'Dashboard', icon: BarChart2, link: '/buyer' },
    { label: 'Explore', icon: Globe, link: '/buyer/discover', active: true },
    { label: 'My Cart', icon: ShoppingCart, link: '/buyer/cart' },
    { label: 'My Orders', icon: Package, link: '/buyer/orders' },
    { label: 'Liked Products', icon: Heart, link: '/buyer/liked' },
    { label: 'Profile', icon: User, link: '/buyer/profile' },
  ];

  const handleBuyNow = (product) => {
    setPaymentProduct(product);
    setShowPayment(true);
    setSelectedBank(null);
    setPaymentSuccess(false);
  };

  const handleConfirmPayment = async () => {
    try {
      setIsProcessing(true);
      
      const pendingOrder = {
        products: [{
          productId: paymentProduct._id,
          quantity: 1,
          price: paymentProduct.price
        }],
        totalPrice: paymentProduct.price
      };

      // Save pending order to local storage to process it after return from Chapa
      localStorage.setItem('pendingOrderData', JSON.stringify(pendingOrder));

      const paymentData = {
        amount: paymentProduct.price,
        currency: paymentProduct.currency === 'Dollar' ? 'USD' : 'ETB',
        callbackUrl: `${window.location.origin}/buyer/payment/verify`
      };

      const response = await initializeChapaPayment(paymentData);

      if (response.checkout_url) {
        window.location.href = response.checkout_url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err) {
      console.error("Payment initialization failed:", err.response?.data || err);
      setIsProcessing(false);
      alert(`Payment gateway error: ${err.response?.data?.message || err.message}. Please try again.`);
    }
  };

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      user={{ name: userProfile?.name || 'User', role: 'Buyer' }}
      themeColor="bg-blue-600"
      secondaryColor="bg-blue-700"
    >
      {/* Search Bar inside content */}
      <div className="max-w-7xl mx-auto pt-2 pb-4">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search trends, styles, sellers..."
            className="w-full pl-12 pr-6 py-3.5 bg-white rounded-2xl border border-slate-200/60 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-300 focus:bg-white transition-all text-sm font-medium shadow-sm placeholder:text-slate-400 outline-none"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6">
        <div className="flex flex-col items-center mb-12 text-center">
          <span className="px-4 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-blue-100 mb-6">
            Feed
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4 uppercase">
            Trending <span className="text-blue-600">Now.</span>
          </h1>
          <p className="text-slate-500 max-w-lg font-medium leading-relaxed">
            Connect with the best sellers from Addis Ababa and beyond. Experience fashion as a conversation.
          </p>
        </div>



        {/* ─── Product Feed ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 items-start">
          {filteredProducts.map((product, idx) => (
            <motion.div 
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <ProductPost product={{...product, onBuyNow: () => handleBuyNow(product)}} />
            </motion.div>
          ))}
          {filteredProducts.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-slate-500 font-bold">No products found matching your search.</p>
            </div>
          )}
        </div>

        <div className="py-20 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Globe className="w-8 h-8 text-slate-300 animate-pulse" />
          </div>
          <p className="text-slate-400 font-black text-xs uppercase tracking-widest leading-none">You're all caught up for today!</p>
        </div>
      </div>

      {/* ─── Payment Modal ─── */}
      <AnimatePresence>
        {showPayment && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !paymentSuccess && !isProcessing && setShowPayment(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-x-4 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 top-[10%] md:top-[15%] md:w-[480px] bg-white rounded-3xl shadow-2xl z-[101] overflow-hidden max-h-[80vh] overflow-y-auto"
            >
              {paymentSuccess ? (
                /* ─── Success State ─── */
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-10 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', bounce: 0.5, delay: 0.1 }}
                    className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30"
                  >
                    <CheckCircle2 className="w-10 h-10 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-black text-slate-800 mb-2">Order Confirmed!</h3>
                  <p className="text-slate-500 font-medium text-sm">
                    Your order for <span className="font-bold text-slate-700">{paymentProduct?.title}</span> has been processed successfully.
                  </p>
                </motion.div>
              ) : (
                /* ─── Payment Selection ─── */
                <>
                  {/* Header */}
                  <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-black text-slate-800 tracking-tight">Checkout</h3>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">
                        {paymentProduct?.title} · <span className="font-bold text-blue-600">{paymentProduct?.currency === 'Dollar' ? '$' : 'ብር'} {paymentProduct?.price.toLocaleString()}</span>
                      </p>
                    </div>
                    <button
                      onClick={() => setShowPayment(false)}
                      disabled={isProcessing}
                      className="p-2 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50"
                    >
                      <X className="w-5 h-5 text-slate-400" />
                    </button>
                  </div>

                  {/* Bank List */}
                  <div className="p-4 space-y-2">
                    {ethiopianBanks.map((bank, idx) => (
                      <motion.button
                        key={bank.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        onClick={() => setSelectedBank(bank.id)}
                        disabled={isProcessing}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all group ${selectedBank === bank.id
                            ? 'border-blue-500 bg-blue-50/50 shadow-md shadow-blue-500/10'
                            : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                          } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${bank.color} flex items-center justify-center text-xl shadow-sm flex-shrink-0`}>
                          {bank.icon}
                        </div>
                        <div className="text-left flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-slate-800 text-sm">{bank.name}</p>
                            {bank.popular && (
                              <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-600 text-[8px] font-black uppercase tracking-wider rounded-md">
                                Popular
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 font-medium">{bank.desc}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedBank === bank.id
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-slate-300'
                          }`}>
                          {selectedBank === bank.id && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-2 h-2 bg-white rounded-full"
                            />
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  {/* Confirm Button */}
                  <div className="p-4 pt-2 pb-6">
                    <button
                      onClick={handleConfirmPayment}
                      disabled={!selectedBank || isProcessing}
                      className={`w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${selectedBank && !isProcessing
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.01] active:scale-[0.99]'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}
                    >
                      {isProcessing ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CreditCard className="w-4 h-4" />
                      )}
                      {isProcessing ? 'Processing Order...' : selectedBank ? `Pay ${paymentProduct?.currency === 'Dollar' ? '$' : 'ብር'} ${paymentProduct?.price.toLocaleString()} with ${ethiopianBanks.find(b => b.id === selectedBank)?.name}` : 'Select Payment Method'}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default Discover;
