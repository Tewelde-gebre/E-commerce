import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import contactBg from '../assets/contact_bg.png';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Message sent! We will get back to you shortly.');
  };

  const contactInfos = [
    { icon: Mail, label: "Email Support", value: "hello@fashionmarketplace.com" },
    { icon: Phone, label: "Phone Line", value: "+1 (800) FASHION" },
    { icon: MapPin, label: "Our Studio", value: "75 Fashion Ave, NY 10001" },
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden selection:bg-blue-100 uppercase">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center pt-24 overflow-hidden text-white">
        <div className="fixed inset-0 z-0">
          <img 
            src={contactBg} 
            alt="Contact Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-transparent" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto"
          >
            <h1 className="text-7xl md:text-[180px] font-black text-white tracking-tighter leading-none mb-12 uppercase mix-blend-screen opacity-90">
              Get In <br /> <span className="text-blue-500">Touch.</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/70 font-medium mb-12 max-w-xl mx-auto leading-relaxed normal-case tracking-widest">
              We're dedicated to providing the best fashion experience. Our team is ready to assist you.
            </p>
            
            {/* Floating Scroll Indicator */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
              className="mt-12"
            >
              <div className="w-7 h-12 border-2 border-slate-300 rounded-full p-1.5 flex justify-center mx-auto shadow-lg bg-white/20 backdrop-blur-sm">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Contact Content */}
      <section className="py-32 bg-white relative z-10 shadow-[0_-50px_100px_rgba(0,0,0,0.05)] rounded-t-[60px]">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-20">
            
            {/* Left side: Information */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex-1"
            >
              <h1 className="text-6xl font-black text-slate-900 tracking-tighter mb-8 lowercase">
                Get in <br /> touch <span className="text-blue-600">.</span>
              </h1>
              <p className="text-lg text-slate-500 font-medium leading-relaxed mb-12 max-w-sm normal-case">
                We're here to help. Whether you have questions about buying, selling, or just want to say hello.
              </p>

              <div className="space-y-10">
                {contactInfos.map((info, idx) => (
                  <div key={idx} className="flex gap-6 items-start group text-left">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm border border-slate-100">
                      <info.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-2">{info.label}</h4>
                      <p className="text-xl font-black text-slate-900 normal-case">{info.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-16 p-8 bg-blue-600 rounded-[40px] text-white flex items-center justify-between shadow-2xl shadow-blue-500/20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div className="font-bold uppercase tracking-widest text-xs">Customer Chat</div>
                </div>
                <button className="px-6 py-3 bg-white text-blue-600 rounded-xl font-black text-sm hover:bg-slate-100 transition-all">
                  Live Chat
                </button>
              </div>
            </motion.div>

            {/* Right side: Form */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex-[1.2] bg-white rounded-[50px] p-12 md:p-16 shadow-2xl shadow-slate-200 border border-slate-100"
            >
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 text-left">Your Name</label>
                    <input 
                      type="text" 
                      required
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all placeholder:text-slate-300 text-slate-800 font-medium normal-case"
                      placeholder="John Doe"
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 text-left">Email Address</label>
                    <input 
                      type="email" 
                      required
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all placeholder:text-slate-300 text-slate-800 font-medium normal-case"
                      placeholder="john@example.com"
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 text-left">Subject</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all placeholder:text-slate-300 text-slate-800 font-medium normal-case"
                    placeholder="Inquiry about..."
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 text-left">Message</label>
                  <textarea 
                    required
                    rows="5"
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all placeholder:text-slate-300 text-slate-800 font-medium resize-none normal-case"
                    placeholder="How can we help?"
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  ></textarea>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-2xl flex items-center justify-center gap-3 hover:bg-slate-800 transition-all group"
                >
                  Send Message
                  <Send className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Contact;
