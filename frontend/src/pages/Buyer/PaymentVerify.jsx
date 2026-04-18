import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { verifyChapaPayment, createOrder } from '../../api/orderApi';
import DashboardLayout from '../../layouts/DashboardLayout';
import { ShoppingCart, Package, Heart, User, BarChart2, Globe } from 'lucide-react';

const PaymentVerify = () => {
  const [status, setStatus] = useState('verifying'); // verifying, success, failed
  const [message, setMessage] = useState('Verifying your payment...');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verify = async () => {
      const searchParams = new URLSearchParams(location.search);
      const tx_ref = searchParams.get('trx_ref');
      const isMock = searchParams.get('mock') === 'true';
      const productDataStr = localStorage.getItem('pendingOrderData');

      if (!tx_ref || !productDataStr) {
        setStatus('failed');
        setMessage('Invalid integration. Missing transaction reference or order data.');
        return;
      }

      try {
        const response = await verifyChapaPayment(tx_ref, isMock);

        if (response.success) {
          // Now create the order
          const pendingOrder = JSON.parse(productDataStr);
          await createOrder(pendingOrder);
          
          setStatus('success');
          setMessage('Payment Successful! Your order has been placed.');
          localStorage.removeItem('pendingOrderData');

          setTimeout(() => {
            navigate('/buyer/orders');
          }, 3000);
        } else {
          setStatus('failed');
          setMessage('Payment verification failed.');
        }
      } catch (err) {
        setStatus('failed');
        setMessage(err.response?.data?.message || 'Payment verification failed. Please try again.');
      }
    };

    verify();
  }, [location, navigate]);

  const sidebarItems = [
    { label: 'Dashboard', icon: BarChart2, link: '/buyer' },
    { label: 'Explore', icon: Globe, link: '/buyer/discover' },
    { label: 'My Cart', icon: ShoppingCart, link: '/buyer/cart' },
    { label: 'My Orders', icon: Package, link: '/buyer/orders' },
    { label: 'Liked Products', icon: Heart, link: '/buyer/liked' },
    { label: 'Profile', icon: User, link: '/buyer/profile' },
  ];

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      user={{ name: 'User', role: 'Buyer' }}
      themeColor="bg-blue-600"
      secondaryColor="bg-blue-700"
    >
      <div className="flex h-[80vh] items-center justify-center">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center border border-slate-100">
          {status === 'verifying' && (
            <div className="flex flex-col items-center">
              <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-6" />
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Verifying</h2>
              <p className="text-slate-500 mt-2 font-medium">{message}</p>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-2">Success!</h2>
              <p className="text-slate-500 font-medium">{message}</p>
              <p className="text-sm mt-6 text-slate-400 font-bold uppercase tracking-widest">Redirecting to orders...</p>
            </div>
          )}

          {status === 'failed' && (
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mb-6">
                <XCircle className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-2">Payment Failed</h2>
              <p className="text-slate-500 font-medium">{message}</p>
              <button
                onClick={() => navigate('/buyer/cart')}
                className="mt-8 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
              >
                Return to Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PaymentVerify;
