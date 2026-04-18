import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Mail, 
  ArrowRight, 
  Globe, 
  ShieldCheck, 
  ChevronUp,
  MapPin,
  Phone,
  Sparkles
} from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerLinks = {
    shop: [
      { name: 'New Arrivals', path: '/shop' },
      { name: 'Best Sellers', path: '/shop' },
      { name: 'Exclusive Pieces', path: '/shop' },
      { name: 'Sustainability', path: '/about' },
    ],
    company: [
      { name: 'Our Story', path: '/about' },
      { name: 'Careers', path: '/about' },
      { name: 'Press & Media', path: '/about' },
      { name: 'Work with Us', path: '/contact' },
    ],
    support: [
      { name: 'Shipping & Returns', path: '/help' },
      { name: 'Secure Payments', path: '/help' },
      { name: 'Size Guides', path: '/help' },
      { name: 'Contact Us', path: '/contact' },
    ]
  };

  const socialIcons = [
    { icon: Globe, label: 'Website', href: '/' },
    { icon: Mail, label: 'Email', href: 'mailto:concierge@fashionmarket.com' },
    { icon: ShieldCheck, label: 'Trust', href: '/help' },
  ];

  return (
    <footer className="bg-slate-950 text-slate-300 pt-20 pb-8 relative z-50 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/[0.03] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/[0.03] rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Newsletter Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 pb-16 border-b border-white/[0.06] mb-16">
          <div className="max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 rounded-lg border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-6">
              <Sparkles className="w-3 h-3" />
              Exclusive Updates
            </div>
            <h3 className="text-3xl md:text-4xl font-black mb-4 tracking-tighter text-white">
              Join the Inner Circle.
            </h3>
            <p className="text-slate-400 font-medium leading-relaxed">
              Get exclusive access to new collections and a weekly dose of style inspiration directly in your inbox.
            </p>
          </div>
          <div className="w-full max-w-md">
            <form onSubmit={(e) => e.preventDefault()} className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-white/[0.05] border border-white/[0.08] rounded-2xl py-5 px-14 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/30 focus:bg-white/[0.08] transition-all font-medium placeholder:text-slate-600 text-white"
              />
              <button 
                type="submit"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:shadow-lg hover:shadow-blue-500/20 transition-all active:scale-95"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-4">
            <Link to="/" className="text-2xl font-black tracking-tighter flex items-center gap-3 mb-6 group text-white">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white text-lg group-hover:rotate-12 transition-transform shadow-lg shadow-blue-500/20">
                F
              </div>
              FASHION
            </Link>
            <p className="text-slate-500 font-medium leading-relaxed max-w-xs mb-8 text-sm">
              Building a community where high-end Ethiopian fashion meets next-gen technology. Handcrafted style, delivered globally.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-slate-500">
                <MapPin className="w-4 h-4 text-slate-600" />
                <span className="text-sm font-medium">Addis Ababa, Ethiopia</span>
              </div>
              <div className="flex items-center gap-3 text-slate-500">
                <Phone className="w-4 h-4 text-slate-600" />
                <span className="text-sm font-medium">+251 911 000 000</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {socialIcons.map((social, idx) => (
                <a 
                  key={idx} 
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 bg-white/[0.05] rounded-xl flex items-center justify-center hover:bg-gradient-to-br hover:from-blue-600 hover:to-indigo-600 hover:text-white transition-all border border-white/[0.06] text-slate-500 hover:border-transparent hover:shadow-lg hover:shadow-blue-500/10"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-6 text-white">Marketplace</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-slate-500 hover:text-blue-400 transition-colors font-medium text-sm inline-flex items-center gap-1.5 group">
                    <span className="w-0 group-hover:w-2 h-[1.5px] bg-blue-400 transition-all duration-200" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-6 text-white">The Brand</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-slate-500 hover:text-blue-400 transition-colors font-medium text-sm inline-flex items-center gap-1.5 group">
                    <span className="w-0 group-hover:w-2 h-[1.5px] bg-blue-400 transition-all duration-200" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-6 text-white">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-slate-500 hover:text-blue-400 transition-colors font-medium text-sm inline-flex items-center gap-1.5 group">
                    <span className="w-0 group-hover:w-2 h-[1.5px] bg-blue-400 transition-all duration-200" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
            <p className="text-slate-600 font-semibold text-xs">
              © 2026 Fashion Marketplace. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link to="/help" className="text-slate-600 hover:text-slate-400 transition-colors text-xs font-medium">Privacy</Link>
              <span className="text-slate-800">·</span>
              <Link to="/help" className="text-slate-600 hover:text-slate-400 transition-colors text-xs font-medium">Terms</Link>
              <span className="text-slate-800">·</span>
              <Link to="/help" className="text-slate-600 hover:text-slate-400 transition-colors text-xs font-medium">Cookies</Link>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-slate-600">
              <ShieldCheck className="w-4 h-4 text-emerald-500/60" />
              <span className="text-xs font-semibold">Secure Payment</span>
            </div>
            <button 
              onClick={scrollToTop}
              className="w-10 h-10 bg-white/[0.05] rounded-xl flex items-center justify-center hover:bg-gradient-to-br hover:from-blue-600 hover:to-indigo-600 hover:text-white transition-all border border-white/[0.06] group text-slate-500 hover:border-transparent"
            >
              <ChevronUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
