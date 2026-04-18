import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../../layouts/DashboardLayout';
import { ShoppingCart, Package, Heart, User, BarChart2, Trash2, Plus, Minus, Globe, ArrowRight, CreditCard, Building2, Smartphone, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const MyCart = () => {
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowCheckoutModal(false);
      navigate('/buyer/orders');
    }, 2000);
  };

  const paymentProviders = [
    { id: 'telebirr', name: 'Telebirr', icon: Smartphone, color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
    { id: 'cbe', name: 'CBE Birr', icon: Building2, color: 'bg-indigo-50 text-indigo-600 border-indigo-200' },
    { id: 'awash', name: 'Awash Bank', icon: Building2, color: 'bg-amber-50 text-amber-600 border-amber-200' },
    { id: 'zemen', name: 'Zemen Bank', icon: Building2, color: 'bg-emerald-50 text-emerald-500 border-emerald-200' },
    { id: 'nib', name: 'Nib Bank', icon: Building2, color: 'bg-yellow-50 text-yellow-600 border-yellow-200' },
    { id: 'coop', name: 'Coop Bank', icon: Building2, color: 'bg-cyan-50 text-cyan-600 border-cyan-200' },
    { id: 'wegagen', name: 'Wegagen', icon: Building2, color: 'bg-orange-50 text-orange-600 border-orange-200' },
    { id: 'dashen', name: 'Dashen Bank', icon: Building2, color: 'bg-blue-50 text-blue-600 border-blue-200' },
    { id: 'abyssinia', name: 'BOA', icon: Building2, color: 'bg-yellow-50 text-yellow-600 border-yellow-200' },
    { id: 'card', name: 'Credit Card', icon: CreditCard, color: 'bg-slate-50 text-slate-600 border-slate-200' },
  ];

  const sidebarItems = [
    { label: 'Dashboard', icon: BarChart2, link: '/buyer' },
    { label: 'Explore', icon: Globe, link: '/buyer/discover' },
    { label: 'My Cart', icon: ShoppingCart, link: '/buyer/cart', active: true },
    { label: 'My Orders', icon: Package, link: '/buyer/orders' },
    { label: 'Liked Products', icon: Heart, link: '/buyer/liked' },
    { label: 'Profile', icon: User, link: '/buyer/profile' },
  ];

  const cartItems = [
    { id: 1, name: 'Premium Cotton Tee', price: 29.99, quantity: 2, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=150&q=80' },
    { id: 2, name: 'Denim Jacket', price: 89.99, quantity: 1, image: 'https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?auto=format&fit=crop&w=150&q=80' },
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      user={{ name: 'አበበ', role: 'Buyer' }}
      themeColor="bg-blue-600"
      secondaryColor="bg-blue-700"
    >
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Shopping Cart</h1>
        <p className="text-slate-400 text-sm font-medium mt-1">{cartItems.length} items in your cart</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden">
            <div className="divide-y divide-slate-100">
              {cartItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-5 p-5 hover:bg-slate-50/50 transition-colors group"
                >
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shadow-sm flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-800 text-sm">{item.name}</h3>
                    <p className="text-blue-600 font-bold text-base mt-1">ብር {item.price}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-slate-100 px-1 py-1 rounded-xl">
                    <button className="p-1.5 hover:bg-white rounded-lg transition-colors text-slate-500 hover:text-slate-800">
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-bold text-sm w-8 text-center text-slate-800">{item.quantity}</span>
                    <button className="p-1.5 hover:bg-white rounded-lg transition-colors text-slate-500 hover:text-slate-800">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button className="p-2.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100 active:scale-90">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-96">
          <div className="bg-white rounded-2xl p-7 border border-slate-200/60 sticky top-24">
            <h2 className="text-lg font-bold text-slate-800 mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400 font-medium">Subtotal</span>
                <span className="font-bold text-slate-800">ብር {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400 font-medium">Shipping</span>
                <span className="font-bold text-slate-800">ብር 5.00</span>
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-between">
                <span className="font-bold text-slate-800">Total</span>
                <span className="font-bold text-blue-600 text-xl">ብር {(subtotal + 5).toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={() => setShowCheckoutModal(true)}
              className="w-full bg-slate-900 text-white font-semibold py-4 rounded-xl hover:bg-slate-800 transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </button>
            <Link to="/buyer/discover" className="w-full mt-3 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <AnimatePresence>
        {showCheckoutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCheckoutModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800 tracking-tight">Complete Payment</h3>
                <button
                  onClick={() => setShowCheckoutModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Select Payment Method</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 max-h-[220px] overflow-y-auto custom-scrollbar p-1 -mx-1">
                  {paymentProviders.map(provider => (
                    <button
                      key={provider.id}
                      onClick={() => setSelectedPayment(provider.id)}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all group ${selectedPayment === provider.id ? 'border-blue-500 bg-blue-50/50 shadow-md shadow-blue-500/10 scale-[0.98]' : 'border-slate-100 hover:border-slate-200 bg-white hover:bg-slate-50'}`}
                    >
                      <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl mb-2 flex items-center justify-center shadow-sm transition-transform group-hover:scale-110 flex-shrink-0 ${provider.color}`}>
                        <provider.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <span className={`text-[10px] sm:text-xs font-bold text-center leading-tight transition-colors ${selectedPayment === provider.id ? 'text-blue-700' : 'text-slate-600 group-hover:text-slate-800'}`}>{provider.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 mb-6">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-500 text-sm font-semibold">Total Amount</span>
                  <span className="text-blue-600 font-black text-xl">ብር {(subtotal + 5).toFixed(2)}</span>
                </div>
                <p className="text-[11px] font-medium text-slate-400">Secured via bank-level AES-256 encryption.</p>
              </div>

              <button
                onClick={handlePayment}
                disabled={!selectedPayment || isProcessing}
                className={`w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${!selectedPayment ? 'bg-slate-300 cursor-not-allowed text-slate-500' : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 active:scale-[0.98]'}`}
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    Pay Now <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default MyCart;
