import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, Globe, Target, ArrowLeft } from 'lucide-react';
import aboutBg from '../assets/about_bg.png';

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8 } }
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden selection:bg-slate-200">
      <section className="relative h-screen flex items-center justify-center pt-24 overflow-hidden text-white">
        <div className="fixed inset-0 z-0">
          <img 
            src={aboutBg} 
            alt="About Our Marketplace" 
            className="w-full h-full object-cover grayscale opacity-30 blur-[1px]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-transparent" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-7xl md:text-[140px] font-black text-white tracking-tighter mb-10 leading-none uppercase mix-blend-screen opacity-90">
              REDEFINING <br /> THE STYLE <br /> ECOSYSTEM
            </h1>
            <p className="text-xl md:text-2xl text-white/70 font-medium max-w-2xl mx-auto leading-relaxed uppercase tracking-[0.05em]">
              We're building more than just a marketplace; we're creating a community where fashion meets technology.
            </p>
          </motion.div>
        </div>

        {/* Floating Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-slate-400"
        >
          <div className="w-7 h-12 border-2 border-slate-300 rounded-full p-1.5 flex justify-center shadow-lg bg-white/10 backdrop-blur-sm">
            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
          </div>
        </motion.div>
      </section>

      {/* Mission & Vision */}
      <section className="py-32 bg-white relative z-10 shadow-[0_-50px_100px_rgba(0,0,0,0.02)] rounded-t-[60px]">
        <div className="container mx-auto px-6">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-16"
          >
            <motion.div variants={itemVariants} className="text-center">
              <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center text-white mx-auto mb-8 shadow-2xl">
                <Target className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-widest">Our Mission</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                To empower individuals and businesses to connect through high-end fashion, providing a secure and inspiration-led environment for commerce.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white mx-auto mb-8 shadow-2xl shadow-blue-500/20">
                <Globe className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-widest">Global Reach</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                Connect with designers and vendors from around the world, making unique and premium styles accessible from anywhere.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center">
              <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center text-slate-900 mx-auto mb-8 shadow-xl">
                <Users className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-widest">Community</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                Fostering a sense of belonging for fashion enthusiasts, where discovery and shared passion drive the marketplace forward.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="py-32 bg-slate-900 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-24">
          <div className="flex-1">
            <motion.h2 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-black text-white leading-tight mb-8"
            >
              Building the Future of Digital Fashion.
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-white/60 text-lg font-medium leading-relaxed mb-10"
            >
              Founded in 2026, we saw the need for a marketplace that prioritizes both style and trust. Our platform bridges the gap between high-fashion creators and discerning buyers through innovative technology and a relentless focus on quality.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <Link to="/contact" className="inline-flex items-center gap-2 text-white font-black hover:gap-4 transition-all group">
                WORK WITH US 
                <ArrowLeft className="w-6 h-6 rotate-180 group-hover:text-blue-500 transition-colors" />
              </Link>
            </motion.div>
          </div>
          
          <div className="flex-1 relative">
            <div className="aspect-square bg-white shadow-[0_0_100px_rgba(255,255,255,0.05)] rounded-[60px] p-16 flex items-center justify-center border border-white/5 relative overflow-hidden">
              <div className="w-full h-full bg-slate-100 rounded-[40px] flex items-center justify-center overflow-hidden grayscale">
                <img 
                  src={aboutBg} 
                  alt="About Section Banner" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute top-0 right-0 p-8">
                <span className="text-slate-900/10 font-black text-9xl tracking-tighter">ABOUT</span>
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32">
        <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          <div>
            <div className="text-5xl font-black text-slate-900 mb-2 font-mono tracking-tighter">10K+</div>
            <div className="text-slate-400 font-bold uppercase tracking-widest text-xs">Designers</div>
          </div>
          <div>
            <div className="text-5xl font-black text-slate-900 mb-2 font-mono tracking-tighter">500K+</div>
            <div className="text-slate-400 font-bold uppercase tracking-widest text-xs">Members</div>
          </div>
          <div>
            <div className="text-5xl font-black text-slate-900 mb-2 font-mono tracking-tighter">150+</div>
            <div className="text-slate-400 font-bold uppercase tracking-widest text-xs">Countries</div>
          </div>
          <div>
            <div className="text-5xl font-black text-slate-900 mb-2 font-mono tracking-tighter">5M+</div>
            <div className="text-slate-400 font-bold uppercase tracking-widest text-xs">Items Sold</div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
