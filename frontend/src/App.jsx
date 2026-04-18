import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import BuyerDashboard from './pages/Buyer/Dashboard';
import MyCart from './pages/Buyer/MyCart';
import MyOrders from './pages/Buyer/MyOrders';
import LikedProducts from './pages/Buyer/LikedProducts';
import Discover from './pages/Buyer/Discover';
import Profile from './pages/Buyer/Profile';
import SellerDashboard from './pages/Seller/Dashboard';
import AddProduct from './pages/Seller/AddProduct';
import MyProducts from './pages/Seller/MyProducts';
import OrdersReceived from './pages/Seller/OrdersReceived';
import SalesReport from './pages/Seller/SalesReport';
import SellerProfile from './pages/Seller/Profile';
import SellerComments from './pages/Seller/Comments';
import AdminDashboard from './pages/Admin/Dashboard';
import ManageUsers from './pages/Admin/ManageUsers';
import ManageProducts from './pages/Admin/ManageProducts';
import ManageOrders from './pages/Admin/ManageOrders';
import SiteReports from './pages/Admin/SiteReports';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Help from './pages/Help';
import './App.css';

const AppContent = () => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/buyer') || 
                      location.pathname.startsWith('/seller') || 
                      location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {!isDashboard && <Navbar />}
      <main className={`flex-grow ${!isDashboard ? 'pt-20' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/buyer" element={<BuyerDashboard />} />
          <Route path="/buyer/discover" element={<Discover />} />
          <Route path="/buyer/cart" element={<MyCart />} />
          <Route path="/buyer/orders" element={<MyOrders />} />
          <Route path="/buyer/liked" element={<LikedProducts />} />
          <Route path="/buyer/profile" element={<Profile />} />

          <Route path="/seller" element={<SellerDashboard />} />
          <Route path="/seller/add" element={<AddProduct />} />
          <Route path="/seller/products" element={<MyProducts />} />
          <Route path="/seller/orders" element={<OrdersReceived />} />
          <Route path="/seller/report" element={<SalesReport />} />
          <Route path="/seller/profile" element={<SellerProfile />} />
          <Route path="/seller/comments" element={<SellerComments />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/admin/products" element={<ManageProducts />} />
          <Route path="/admin/orders" element={<ManageOrders />} />
          <Route path="/admin/reports" element={<SiteReports />} />
          <Route path="/help" element={<Help />} />

          {/* Default fallback redirects to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isDashboard && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;


