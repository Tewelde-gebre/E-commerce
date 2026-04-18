import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Star, Shield, Zap, Loader2 } from 'lucide-react';
import heroBg from '../assets/hero_bg.png';
import { getProducts } from '../api/productApi';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data.slice(0, 4)); // Show only first 4 featured items
        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Could not load products. Please check if the server is running.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const features = [
    { icon: Star, title: "Premium Quality", desc: "Curated selection of high-end fashion pieces from top designers." },
    { icon: Shield, title: "Secure Shopping", desc: "Your transactions are protected with advanced security protocols." },
    { icon: Zap, title: "Fast Delivery", desc: "Express shipping options to get your style items quickly." },
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden selection:bg-blue-100">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="fixed inset-0 z-0">
          <img
            src={heroBg}
            alt="Fashion Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-transparent" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto"
          >
            <motion.span
              variants={itemVariants}
              className="inline-block px-5 py-2 bg-blue-600 rounded-full text-white text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase mb-6 md:mb-8"
            >
              Exclusive Collection 2026
            </motion.span>

            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-8xl lg:text-[120px] font-black text-white leading-[0.9] mb-8 md:mb-10 tracking-tighter uppercase shrink-0"
            >
              Style <br />
              <span className="text-blue-500">Redefined.</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg md:text-2xl text-white/90 font-medium mb-10 md:mb-12 max-w-2xl mx-auto leading-relaxed px-4 md:px-0"
            >
              Experience the world's most exclusive fashion marketplace. Buy, sell, and explore the next generation of style.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
              <Link
                to="/register"
                className="w-full sm:w-auto px-10 md:px-12 py-4 md:py-5 bg-white text-slate-900 rounded-2xl font-black text-base md:text-lg hover:bg-slate-100 transition-all flex items-center justify-center gap-3 shadow-2xl group"
              >
                Get Started
                <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/about"
                className="w-full sm:w-auto px-10 md:px-12 py-4 md:py-5 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl font-black text-base md:text-lg hover:bg-white/20 transition-all shadow-xl"
              >
                Explore Story
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
          className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 text-white/50 hidden sm:flex"
        >
          <div className="w-7 h-12 border-2 border-white/30 rounded-full p-1.5 flex justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" />
          </div>
        </motion.div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 md:py-32 bg-white relative z-10 shadow-[0_-50px_100px_rgba(0,0,0,0.05)] rounded-t-[40px] md:rounded-t-[60px]">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-4 tracking-tighter">Featured <br />Collection</h2>
              <p className="text-slate-500 font-medium max-w-md">Our hand-picked selection of the most trending items in the market right now.</p>
            </div>
            <Link to="/explore" className="group flex items-center gap-3 text-slate-900 font-black text-lg hover:text-blue-600 transition-colors">
              View All Products
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                <ArrowRight className="w-5 h-5" />
              </div>
            </Link>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
              <p className="font-bold text-slate-400">Loading exclusive items...</p>
            </div>
          ) : error ? (
            <div className="bg-slate-50 rounded-[40px] p-12 text-center border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-bold mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <motion.div
                  key={product._id}
                  whileHover={{ y: -10 }}
                  className="group bg-white rounded-[32px] overflow-hidden border border-slate-100 hover:shadow-2xl transition-all"
                >
                  <div className="aspect-[4/5] relative overflow-hidden bg-slate-100">
                    <img 
                      src={product.image.startsWith('http') ? product.image : `http://localhost:5000${product.image}`} 
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase text-slate-900">
                      New Arrival
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-black text-slate-900 truncate mb-1">{product.title}</h3>
                    <p className="text-slate-500 text-sm mb-4 line-clamp-1">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-black text-blue-600">${product.price}</span>
                      <button className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-blue-600 transition-colors">
                        <ShoppingBag className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="p-8 md:p-10 bg-white rounded-[32px] md:rounded-[40px] shadow-sm hover:shadow-xl transition-all group border border-slate-100"
              >
                <div className="w-14 h-14 md:w-16 md:h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 md:mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <feature.icon className="w-7 h-7 md:w-8 md:h-8" />
                </div>
                <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-4">{feature.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="bg-slate-900 rounded-[40px] md:rounded-[60px] p-10 md:p-24 relative overflow-hidden flex flex-col items-center text-center lg:flex-row lg:text-left justify-between gap-12">
            <div className="relative z-10 max-w-xl">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6 md:mb-8">
                Ready to transform <br className="hidden md:block" />your wardrobe?
              </h2>
              <p className="text-white/60 text-base md:text-lg font-medium mb-8 md:mb-10">
                Join our exclusive marketplace and start buying or selling premium fashion pieces today.
              </p>
              <Link
                to="/register"
                className="inline-flex px-8 md:px-10 py-4 md:py-5 bg-blue-600 text-white rounded-2xl font-black text-sm md:text-base hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/30"
              >
                Get Started Now
              </Link>
            </div>

            <div className="relative z-10 hidden lg:block">
              <div className="w-56 h-56 md:w-80 md:h-80 bg-white/5 backdrop-blur-3xl rounded-full border border-white/10 flex items-center justify-center p-8">
                <div className="w-full h-full bg-white/10 rounded-full flex items-center justify-center animate-pulse">
                  <ShoppingBag className="w-24 h-24 md:w-32 md:h-32 text-white/20" />
                </div>
              </div>
            </div>

            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent opacity-50" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
