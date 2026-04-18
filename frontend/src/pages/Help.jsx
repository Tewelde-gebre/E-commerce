import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, FileText, ShoppingBag, Truck, RefreshCw, Shield, Mail, Phone, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import contactBg from '../assets/contact_bg.png'; // Fallback to existing asset for seamless demo

const Help = () => {
  const faqs = [
    {
      icon: ShoppingBag,
      q: "How do I track my order?",
      a: "Once your order is dispatched, you will receive an email with a tracking number. You can also track it directly from your 'Orders' section in your dashboard."
    },
    {
      icon: Truck,
      q: "What are your shipping rates?",
      a: "We offer free standard shipping on all orders over $500. For smaller orders, a flat fee of $15 applies globally."
    },
    {
      icon: RefreshCw,
      q: "What is your return policy?",
      a: "We accept returns for unworn items with original tags within 14 days of delivery. Returns are processed within 3-5 business days."
    },
    {
      icon: Shield,
      q: "How secure is my data?",
      a: "We utilize industry-leading SSL encryption and secure payment gateways (Stripe/PayPal) to ensure your data and transactions are 100% protected."
    }
  ];

  const categories = [
    { icon: FileText, name: "Buying Guide", desc: "Learn how to find the best styles." },
    { icon: HelpCircle, name: "Seller Center", desc: "Everything you need to set up your shop." },
    { icon: Phone, name: "Direct Support", desc: "Speak with our fashion concierges." },
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden selection:bg-blue-100">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center pt-24 overflow-hidden text-white">
        <div className="fixed inset-0 z-0">
          <img 
            src={contactBg} 
            alt="Help Support" 
            className="w-full h-full object-cover grayscale opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-transparent" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-6 uppercase mix-blend-screen opacity-90">
              Cierge <span className="text-blue-500">Center.</span>
            </h1>
            <p className="text-xl text-white/60 font-medium max-w-2xl mx-auto leading-relaxed uppercase tracking-widest">
              Your comprehensive guide to the fashion marketplace ecosystem.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 bg-white relative z-10 shadow-[0_-50px_100px_rgba(0,0,0,0.02)] rounded-t-[60px]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {categories.map((cat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-10 bg-slate-50 rounded-[40px] hover:bg-slate-100 transition-all group cursor-pointer border border-transparent hover:border-slate-200"
              >
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm mb-6">
                  <cat.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">{cat.name}</h3>
                <p className="text-slate-500 font-medium mb-6">{cat.desc}</p>
                <div className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
                  Browse <ArrowRight className="w-4 h-4" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-32 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 uppercase tracking-tight">Common Inquiries</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqs.map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="p-10 bg-white rounded-[40px] shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all group"
              >
                <div className="flex gap-6 items-start">
                  <div className="p-4 bg-slate-50 rounded-2xl text-slate-400 group-hover:text-blue-600 transition-colors">
                    <faq.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-900 mb-3 uppercase tracking-tight">{faq.q}</h4>
                    <p className="text-slate-500 font-medium leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Support CTA */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          <div className="bg-slate-900 rounded-[60px] p-12 md:p-24 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-[150px] opacity-20 -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-8 uppercase tracking-tight">Still Need Guidance?</h2>
              <p className="text-white/50 text-xl font-medium mb-12 max-w-2xl mx-auto uppercase tracking-widest leading-relaxed">
                Our luxury concierge team is available 24/7 to assist with your inquiries.
              </p>
              <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                <Link to="/contact" className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95">
                  Reach Out Now
                </Link>
                <div className="flex items-center gap-3 text-white/40 font-bold uppercase tracking-widest text-xs">
                  <Mail className="w-5 h-5 text-blue-500" />
                  concierge@fashionmarket.com
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Help;
