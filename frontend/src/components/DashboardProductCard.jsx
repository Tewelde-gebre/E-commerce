import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart } from 'lucide-react';

const DashboardProductCard = ({ product }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      className="group bg-white dark:bg-slate-900 rounded-3xl p-3 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      <div className="relative aspect-square rounded-[20px] overflow-hidden bg-slate-50">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
        />
        <div className="absolute top-2 right-2 flex flex-col gap-2">
            <button className="p-2 bg-white/80 backdrop-blur-md rounded-xl text-rose-500 shadow-sm hover:bg-rose-500 hover:text-white transition-all scale-0 group-hover:scale-100 duration-200">
                <Heart className="w-4 h-4 fill-current outline-none border-none" strokeWidth={3} />
            </button>
        </div>
        <div className="absolute bottom-2 left-2 right-2">
           <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-sm text-center">
              <span className="text-blue-600 font-black text-xs tracking-tight">${product.price}</span>
           </div>
        </div>
      </div>
      
      <div className="p-3">
        <h3 className="font-black text-slate-800 dark:text-white text-xs truncate mb-2 uppercase tracking-wide">{product.name}</h3>
        <button className="w-full bg-slate-50 dark:bg-slate-800 hover:bg-blue-600 hover:text-white py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 group/btn">
          <ShoppingBag className="w-3 h-3 group-hover/btn:animate-bounce" />
          <span className="text-[10px] font-black uppercase tracking-widest leading-none">Add to Cart</span>
        </button>
      </div>
    </motion.div>
  );
};

export default DashboardProductCard;
