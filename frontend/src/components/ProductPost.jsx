import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Send, MoreHorizontal, User, Loader2 } from 'lucide-react';
import { likeProduct } from '../api/productApi';
import { addComment, getCommentsByProduct } from '../api/commentApi';

const ProductPost = ({ product }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(product.likes?.length || 0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(true);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await getCommentsByProduct(product._id);
        setComments(data);
      } catch (err) {
        console.error("Failed to fetch comments:", err);
      } finally {
        setLoadingComments(false);
      }
    };
    fetchComments();
    
    // Check if current user has liked
    const userId = JSON.parse(localStorage.getItem('user'))?._id;
    if (userId && product.likes?.includes(userId)) {
      setIsLiked(true);
    }
  }, [product._id, product.likes]);

  const handleLike = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert("Please login to like products");
        return;
    }

    try {
        // Optimistic UI update
        const previouslyLiked = isLiked;
        setIsLiked(!previouslyLiked);
        setLikesCount(prev => previouslyLiked ? prev - 1 : prev + 1);

        await likeProduct(product._id);
    } catch (err) {
        console.error("Like failed:", err);
        // Rollback on error (simplified)
        setIsLiked(prev => !prev);
        setLikesCount(prev => isLiked ? prev + 1 : prev - 1);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const token = localStorage.getItem('token');
    if (!token) {
        alert("Please login to comment");
        return;
    }

    try {
        const savedComment = await addComment(product._id, newComment);
        
        // Backend now returns the fully populated comment!
        setComments(prev => [...prev, savedComment]);
        setNewComment('');
    } catch (err) {
        console.error("Comment failed:", err);
        alert("Failed to post comment.");
    }
  };

  // Extract seller info from populated sellerId OR use defaults
  const sellerName = product.sellerId?.name || product.sellerName || 'Seller';
  const sellerInitials = sellerName.charAt(0).toUpperCase();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden shadow-xl shadow-black/5 border border-slate-100 dark:border-slate-800 mb-8 max-w-2xl mx-auto"
    >
      {/* Post Header */}
      <div className="p-5 flex items-center justify-between border-b border-slate-50 dark:border-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-black text-xs uppercase border border-blue-50 dark:border-blue-800">
            {sellerInitials}
          </div>
          <div>
            <h3 className="font-black text-slate-800 dark:text-white text-sm tracking-tight">{sellerName}</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Verified Merchant</p>
          </div>
        </div>
        <button className="text-slate-400 hover:text-slate-600 transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <img 
          src={product.image.startsWith('http') ? product.image : `https://fashion-9hk0.onrender.com${product.image}`} 
          alt={product.title} 
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg shadow-black/5">
          <span className="text-blue-600 font-black text-sm tracking-tight">{product.currency === 'Dollar' ? '$' : 'ብር'} {product.price?.toLocaleString()}</span>
        </div>
      </div>

      {/* Interaction Bar */}
      <div className="p-5 pb-0">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-6">
            <button 
              onClick={handleLike}
              className="flex items-center gap-2 group transition-transform active:scale-95"
            >
              <motion.div
                animate={isLiked ? { scale: [1, 1.4, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Heart 
                  className={`w-6 h-6 transition-colors ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-400 group-hover:text-rose-500'}`} 
                />
              </motion.div>
              <span className={`text-xs font-black tracking-widest uppercase ${isLiked ? 'text-rose-500' : 'text-slate-400'}`}>
                {likesCount} Likes
              </span>
            </button>

            <button 
              onClick={() => setShowComments(!showComments)}
              className={`flex items-center gap-2 group transition-transform active:scale-95 ${showComments ? 'text-blue-600' : 'text-slate-400 hover:text-blue-600'}`}
            >
              <MessageCircle className="w-6 h-6" />
              <span className="text-xs font-black tracking-widest uppercase">{comments.length} Comments</span>
            </button>
          </div>
          
          {product.onBuyNow && (
            <button 
              onClick={product.onBuyNow}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 active:scale-95 transition-all text-sm uppercase tracking-wide"
            >
              Buy Now
            </button>
          )}
        </div>

        <div className="mb-2">
          <h4 className="font-black text-slate-800 dark:text-white text-sm mb-1">{product.title}</h4>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
            {product.description || 'Discover the perfect blend of tradition and modern style. Handcrafted with premium Ethiopian quality.'}
          </p>
        </div>
      </div>

      {/* Comment Section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-5 py-4 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-50 dark:border-slate-800/50 mt-4">
              {loadingComments ? (
          <div className="py-4 flex justify-center">
            <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
          </div>
        ) : (
          <div className="space-y-4 max-h-48 overflow-y-auto custom-scrollbar pr-2 mb-6">
            <AnimatePresence>
              {comments.map((comment, idx) => (
                <motion.div 
                  key={comment._id || idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex gap-3 items-start"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-[10px] font-black text-blue-500 shrink-0">
                    {(comment.userId?.name || 'U')[0]}
                  </div>
                  <div className="flex-1">
                    <div className="mb-1">
                      <span className="font-black text-slate-700 dark:text-slate-300 text-[11px] uppercase tracking-widest mr-2">
                          {comment.userId?.name || 'Member'}
                      </span>
                      <p className="text-sm text-slate-600 dark:text-slate-400 font-medium inline">{comment.text}</p>
                    </div>
                    {comment.storeReply && (
                      <div className="mt-2 p-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100/50 dark:border-blue-900/30 relative ml-2">
                        <div className="absolute -left-2 top-3 w-4 h-4 bg-blue-50/50 dark:bg-blue-900/10 border-l border-b border-blue-100/50 dark:border-blue-900/30 rotate-45" />
                        <div className="flex items-center gap-1.5 mb-1 relative z-10">
                          <span className="text-[9px] font-black uppercase tracking-[0.1em] text-blue-600 dark:text-blue-400">Store Response</span>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300 font-medium relative z-10">{comment.storeReply}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {comments.length === 0 && (
              <p className="text-xs text-slate-400 italic text-center py-4">No comments yet. Be the first!</p>
            )}
          </div>
        )}

        {/* Comment Input */}
        <form onSubmit={handleAddComment} className="relative mt-2">
          <input 
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full bg-white dark:bg-slate-800 border-none rounded-2xl py-4 px-6 pr-14 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 shadow-inner dark:shadow-slate-950/20 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
          />
          <button 
            type="submit"
            className="absolute right-2 top-2 p-2.5 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 disabled:bg-slate-300 disabled:shadow-none"
            disabled={!newComment.trim()}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductPost;
