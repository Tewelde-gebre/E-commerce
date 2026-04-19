import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { 
  BarChart2, PlusCircle, ShoppingBag, List, TrendingUp, User, 
  MessageSquare, Reply, Send, Search, Filter, CheckCircle2, ShieldCheck, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSellerComments, replyToComment } from '../../api/commentApi';

const CommentItem = ({ comment, onReply }) => {
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState('');

  const handleSendReply = async () => {
    if (!replyText.trim()) return;
    try {
      await onReply(comment._id, replyText);
      setReplyText('');
      setIsReplyOpen(false);
    } catch (e) {
      alert("Failed to reply");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[32px] p-8 mt-6 shadow-xl shadow-black/5 border border-slate-100 first:mt-0 group hover:border-orange-200 transition-all"
    >
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left: Product Context */}
        <div className="w-full md:w-48 shrink-0">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 group-hover:shadow-lg transition-all duration-500">
            <img src={comment.productId?.image ? `https://fashion-9hk0.onrender.com${comment.productId.image}` : ''} alt={comment.productId?.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
              <span className="text-[10px] font-black text-white uppercase tracking-widest">{comment.productId?.title}</span>
            </div>
          </div>
          <div className="mt-3">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest truncate">{comment.productId?.title}</h4>
            <div className="flex items-center gap-1.5 mt-1 text-[10px] font-bold text-slate-400">
               <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
               {comment.productId?.currency === 'Dollar' ? '$' : 'ብር'} {comment.productId?.price}
            </div>
          </div>
        </div>

        {/* Right: Comment & Thread */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-black text-xs uppercase border border-orange-100 shadow-sm">
                {comment.userId?.name?.[0] || 'U'}
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-800 tracking-tight">{comment.userId?.name || 'User'}</h3>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <Clock className="w-3 h-3" />
                  {new Date(comment.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            {!comment.storeReply && (
               <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-100">
                 Awaiting Reply
               </span>
            )}
          </div>

          <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100/50">
            <p className="text-sm text-slate-600 font-medium leading-relaxed italic">
              "{comment.text}"
            </p>
          </div>

          {/* Existing Store Reply */}
          {comment.storeReply && (
            <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="ml-8 p-6 rounded-[24px] bg-orange-600 text-white shadow-xl shadow-orange-600/20 relative"
            >
              <div className="absolute -left-3 top-6 w-6 h-6 bg-orange-600 rotate-45" />
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-4 h-4 text-white/80" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">Store Response</span>
              </div>
              <p className="text-sm font-bold leading-relaxed">{comment.storeReply}</p>
            </motion.div>
          )}

          {/* Reply Interface */}
          {!comment.storeReply && (
            <div className="pt-4">
              <AnimatePresence>
                {!isReplyOpen ? (
                  <motion.button 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setIsReplyOpen(true)}
                    className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-black text-xs uppercase tracking-widest group"
                  >
                    <Reply className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Write a response
                  </motion.button>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="space-y-4"
                  >
                    <div className="relative">
                      <textarea 
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type your professional response..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:border-orange-600 transition-all resize-none min-h-[100px]"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={handleSendReply}
                        className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-lg active:scale-95"
                      >
                        <Send className="w-4 h-4" />
                        Post Reply
                      </button>
                      <button 
                         onClick={() => setIsReplyOpen(false)}
                         className="px-6 py-3 text-slate-400 hover:text-slate-600 font-black text-xs uppercase tracking-widest transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const SellerComments = () => {
  const [filter, setFilter] = useState('all');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const data = await getSellerComments();
      setComments(data);
    } catch (error) {
      console.error('Failed to fetch comments', error);
    } finally {
      setLoading(false);
    }
  };

  const sidebarItems = [
    { label: 'Dashboard', icon: BarChart2, link: '/seller' },
    { label: 'Add Product', icon: PlusCircle, link: '/seller/add' },
    { label: 'My Products', icon: ShoppingBag, link: '/seller/products' },
    { label: 'Orders Received', icon: List, link: '/seller/orders' },
    { label: 'Sales Report', icon: TrendingUp, link: '/seller/report' },
    { label: 'Comments', icon: MessageSquare, link: '/seller/comments', active: true },
    { label: 'My Profile', icon: User, link: '/seller/profile' },
  ];

  const handleReply = async (id, text) => {
    const updated = await replyToComment(id, text);
    setComments(comments.map(c => c._id === id ? { ...c, storeReply: updated.storeReply } : c));
  };

  const filteredComments = filter === 'all' ? comments : comments.filter(c => !c.storeReply);

  return (
    <DashboardLayout 
      sidebarItems={sidebarItems} 
      user={{ name: 'Mike', role: 'Seller' }}
      themeColor="bg-orange-600"
      secondaryColor="bg-orange-700"
      headerLeft="Customer Interactions"
    >
      <div className="max-w-6xl mx-auto space-y-10 pb-20">
        
        {/* Statistics Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-3xl p-6 shadow-xl shadow-black/5 border border-slate-100 flex items-center gap-6">
            <div className="w-14 h-14 bg-orange-100 text-orange-600 flex items-center justify-center rounded-2xl">
              <MessageSquare className="w-7 h-7" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Comments</p>
              <p className="text-2xl font-black text-slate-800">{comments.length}</p>
            </div>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-xl shadow-black/5 border border-slate-100 flex items-center gap-6">
            <div className="w-14 h-14 bg-amber-100 text-amber-600 flex items-center justify-center rounded-2xl">
              <Clock className="w-7 h-7" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Awaiting Reply</p>
              <p className="text-2xl font-black text-slate-800">{comments.filter(c => !c.storeReply).length}</p>
            </div>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-xl shadow-black/5 border border-slate-100 flex items-center gap-6">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 flex items-center justify-center rounded-2xl">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Response Rate</p>
              <p className="text-2xl font-black text-slate-800">
                {Math.round((comments.filter(c => c.storeReply).length / (comments.length || 1)) * 100)}%
              </p>
            </div>
          </div>
        </div>

        {/* Feed Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-orange-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Search comments or users..."
              className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white border border-slate-100 shadow-sm focus:outline-none focus:ring-4 focus:ring-orange-600/5 focus:border-orange-200 font-semibold text-slate-800 transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center p-1.5 bg-white rounded-2xl border border-slate-100 shadow-xl shadow-black/5">
            <button 
              onClick={() => setFilter('all')}
              className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${filter === 'all' ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
            >
              All Comments
            </button>
            <button 
              onClick={() => setFilter('unreplied')}
              className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${filter === 'unreplied' ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
            >
              Unreplied
            </button>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {filteredComments.map((comment) => (
              <CommentItem 
                key={comment._id} 
                comment={comment} 
                onReply={handleReply} 
              />
            ))}
            {filteredComments.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-20 text-center"
              >
                <div className="w-20 h-20 bg-slate-50 rounded-[32px] flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400/50" />
                </div>
                <h4 className="text-xl font-black text-slate-800 italic">"Inbox Zero!"</h4>
                <p className="text-slate-400 font-bold mt-2">All customer comments have been addressed.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default SellerComments;
