import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag, Search, Heart, Globe, ChevronDown, Check } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [language, setLanguage] = useState('AM');
  const [isLangOpen, setIsLangOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const languages = [
    { id: 'EN', name: 'English', label: 'EN' },
    { id: 'TG', name: 'ትግርኛ', label: 'TG' },
    { id: 'AM', name: 'አማርኛ', label: 'AM' },
  ];

  const content = {
    EN: { home: 'Home', about: 'About', contact: 'Contact', help: 'Help', login: 'Login', join: 'Join Now' },
    TG: { home: 'ቤት', about: 'ብዛዕባ', contact: 'ርክብ', help: 'ሓገዝ', login: 'እቶ', join: 'ተጸንበር' },
    AM: { home: 'ቤት', about: 'ስለ', contact: 'እውቅያ', help: 'እርዳታ', login: 'ግባ', join: 'ተቀላቀል' },
  };

  const navLinks = [
    { name: content[language].home, path: '/' },
    { name: content[language].about, path: '/about' },
    { name: content[language].contact, path: '/contact' },
    { name: content[language].help, path: '/help' },
  ];

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isTransparent = !scrolled && !isAuthPage;

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled || isAuthPage
        ? 'py-4 bg-white/80 backdrop-blur-lg shadow-sm border-b border-slate-900/5'
        : 'py-6 bg-transparent bg-gradient-to-b from-black/50 to-transparent'
      }`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link to="/" className={`text-2xl font-black tracking-tighter flex items-center gap-2 group transition-colors ${isTransparent ? 'text-white' : 'text-slate-900'}`}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-lg group-hover:rotate-12 transition-transform">F</div>
            <span className="uppercase">{language === 'EN' ? 'FASHION' : 'ፋሽን'}</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-[10px] md:text-xs font-black uppercase tracking-[0.2em] transition-all hover:text-blue-600 ${isActive
                      ? 'text-blue-600'
                      : isTransparent
                        ? 'text-white/80 hover:text-white'
                        : 'text-slate-600'
                    }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className={`flex items-center gap-2 pr-6 border-r transition-colors group ${isTransparent ? 'border-white/20' : 'border-slate-200'}`}
            >
              <Globe className={`w-4 h-4 transition-colors ${isTransparent ? 'text-white/60 group-hover:text-white' : 'text-slate-400 group-hover:text-blue-600'}`} />
              <div className="flex flex-col items-start leading-none">
                <span className={`text-[10px] font-black tracking-widest uppercase transition-colors ${isTransparent ? 'text-white' : 'text-slate-900'}`}>{language}</span>
                <span className={`text-[8px] font-bold uppercase mt-0.5 transition-colors ${isTransparent ? 'text-white/50' : 'text-slate-400'}`}>ETB</span>
              </div>
              <ChevronDown className={`w-3 h-3 transition-transform ${isTransparent ? 'text-white/50' : 'text-slate-400'} ${isLangOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isLangOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-40 bg-white border border-slate-100 rounded-2xl shadow-2xl p-2 z-[60] backdrop-blur-xl"
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => {
                        setLanguage(lang.id);
                        setIsLangOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${language === lang.id ? 'bg-slate-50 text-blue-600' : 'hover:bg-slate-50 text-slate-600'}`}
                    >
                      <span className="text-[11px] font-black uppercase tracking-tight">{lang.name}</span>
                      {language === lang.id && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-5">
            <button className={`p-1 group transition-colors ${isTransparent ? 'text-white/80 hover:text-white' : 'text-slate-600 hover:text-blue-600'}`}>
              <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
            <button className={`p-1 group transition-colors ${isTransparent ? 'text-white/80 hover:text-white' : 'text-slate-600 hover:text-rose-500'}`}>
              <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
            <Link to="/cart" className={`p-1 relative group transition-colors ${isTransparent ? 'text-white/80 hover:text-white' : 'text-slate-600 hover:text-blue-600'}`}>
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-[10px] font-black flex items-center justify-center rounded-full shadow-lg shadow-blue-500/30">
                0
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3 ml-4">
            <Link to="/login" className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${isTransparent
                ? 'text-white hover:bg-white/10 border-white/20 hover:border-white'
                : 'text-slate-600 hover:bg-slate-100 border-transparent hover:border-slate-200'
              }`}>
              {content[language].login}
            </Link>
            <Link to="/register" className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-xl ${isTransparent
                ? 'text-slate-900 bg-white hover:bg-slate-100 shadow-white/10'
                : 'text-white bg-slate-900 hover:bg-slate-800 shadow-slate-300'
              }`}>
              {content[language].join}
            </Link>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button className={`md:hidden p-2 focus:outline-none transition-colors ${isTransparent ? 'text-white' : 'text-slate-900'}`} onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="md:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-b border-slate-100 shadow-2xl z-50 overflow-hidden"
            >
              <div className="flex flex-col p-8 gap-8">
                <div className="flex flex-col gap-4">
                   <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Navigation</span>
                   {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`text-2xl font-black tracking-tight flex items-center justify-between group ${location.pathname === link.path ? 'text-blue-600' : 'text-slate-900'}`}
                    >
                      {link.name}
                      <div className={`w-2 h-2 rounded-full bg-blue-600 transition-transform scale-0 ${location.pathname === link.path ? 'scale-100' : ''}`} />
                    </Link>
                  ))}
                </div>
                
                <div className="flex flex-col gap-4 pt-8 border-t border-slate-50">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Account</span>
                  <div className="grid grid-cols-2 gap-4">
                    <Link to="/login" onClick={() => setIsOpen(false)} className="py-5 text-center font-black text-xs uppercase tracking-widest text-slate-700 bg-slate-50 rounded-2xl active:scale-95 transition-transform">
                      {content[language].login}
                    </Link>
                    <Link to="/register" onClick={() => setIsOpen(false)} className="py-5 text-center font-black text-xs uppercase tracking-widest text-white bg-slate-900 rounded-2xl shadow-xl shadow-slate-200 active:scale-95 transition-transform">
                      {content[language].join}
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
