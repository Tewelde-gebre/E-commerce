import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { PlusCircle, ShoppingBag, List, TrendingUp, BarChart2, User, MessageSquare, Shirt, X, Upload, Loader2 } from 'lucide-react';
import { createProduct } from '../../api/productApi';

const AddProduct = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'cloths',
    productType: '',
    gender: 'unisex',
    price: '',
    currency: 'Birr',
    stock: '',
    description: '',
    sizes: []
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const sidebarItems = [
    { label: 'Dashboard', icon: BarChart2, link: '/seller' },
    { label: 'Add Product', icon: PlusCircle, link: '/seller/add', active: true },
    { label: 'My Products', icon: ShoppingBag, link: '/seller/products' },
    { label: 'Orders Received', icon: List, link: '/seller/orders' },
    { label: 'Sales Report', icon: TrendingUp, link: '/seller/report' },
    { label: 'Comments', icon: MessageSquare, link: '/seller/comments' },
    { label: 'My Profile', icon: User, link: '/seller/profile' },
  ];

  const clothingTypes = [
    'T-shirt', 'Jeans', 'Hoodie', 'Dress', 'Jacket', 'Shirt', 'Shorts', 'Traditional', 'Sweater', 'Skirts'
  ];

  const clothingSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
  const jeansSizes = ['28', '30', '32', '34', '36', '38', '40', '42'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value,
      // Clear sizes if switching between Jeans and regular clothes to prevent conflicts
      ...(name === 'productType' ? { sizes: [] } : {})
    }));
  };

  const toggleSize = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
      }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      alert('Please upload at least one clothing image');
      return;
    }
    if (formData.sizes.length === 0) {
      alert('Please select at least one available size');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to post products');
        navigate('/login');
        return;
      }

      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('currency', formData.currency);
      data.append('category', formData.category);
      data.append('productType', formData.productType);
      data.append('gender', formData.gender);
      data.append('stock', formData.stock);
      data.append('sizes', JSON.stringify(formData.sizes));
      data.append('image', image);

      await createProduct(data, token);
      alert('Clothing item published successfully!');
      navigate('/seller/products');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(error.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Determine which size set to show
  const currentSizes = formData.productType === 'Jeans' ? jeansSizes : clothingSizes;

  return (
    <DashboardLayout 
      sidebarItems={sidebarItems} 
      user={{ name: 'Mike', role: 'Seller' }}
      themeColor="bg-orange-600"
      secondaryColor="bg-orange-700"
    >
      <div className="max-w-4xl mx-auto pb-20">
        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-black/5 border border-slate-100">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl">
              <Shirt className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Post New Clothing</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Hidden File Input */}
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />

            {/* Image Upload */}
            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Clothing Photos</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {imagePreview ? (
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-slate-100 group">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-md rounded-full text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div 
                    onClick={triggerFileUpload}
                    className="aspect-[3/4] rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 hover:border-orange-500 hover:bg-orange-50 transition-all cursor-pointer group"
                  >
                    <Upload className="w-8 h-8 text-slate-300 group-hover:text-orange-500" />
                    <span className="text-xs font-bold text-slate-400 group-hover:text-orange-500 text-center px-2">Upload from<br/>Camera or Local</span>
                  </div>
                )}
              </div>
              {!imagePreview && <p className="text-xs text-slate-400 font-medium italic">* At least one high-quality cloth image is required</p>}
            </div>

            {/* Basic Info Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1 h-6 bg-orange-600 rounded-full" />
                <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wide text-sm">Cloth Details</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="block">
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Cloth Title</span>
                    <input 
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      type="text" 
                      placeholder="e.g. Vintage Oversized Hoodie" 
                      className="w-full mt-2 px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500/20 font-semibold text-slate-800 transition-all" 
                    />
                  </label>

                  <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest">
                    Clothing Type
                    <select 
                      name="productType"
                      value={formData.productType}
                      onChange={handleInputChange}
                      required
                      className="w-full mt-2 px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500/20 font-semibold text-slate-800 appearance-none cursor-pointer"
                    >
                      <option value="">Select Type</option>
                      {clothingTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <label className="block">
                      <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Price</span>
                      <div className="flex mt-2">
                        <select 
                          name="currency"
                          value={formData.currency}
                          onChange={handleInputChange}
                          className="px-4 py-4 rounded-l-2xl bg-slate-100 border border-slate-200 focus:outline-none font-bold text-slate-600 appearance-none cursor-pointer border-r-0"
                        >
                          <option value="Birr">ETB</option>
                          <option value="Dollar">USD</option>
                        </select>
                        <input 
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          required
                          type="number" 
                          placeholder="0.00" 
                          className="w-full px-6 py-4 rounded-r-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500/20 font-semibold text-slate-800 transition-all border-l-0" 
                        />
                      </div>
                    </label>
                    <label className="block">
                      <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Stock Count</span>
                      <input 
                        name="stock"
                        value={formData.stock}
                        onChange={handleInputChange}
                        required
                        type="number" 
                        placeholder="10" 
                        className="w-full mt-2 px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500/20 font-semibold text-slate-800 transition-all" 
                      />
                    </label>
                  </div>

                  <div className="space-y-2">
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Gender Target</span>
                    <div className="flex p-1 bg-slate-50 rounded-2xl border border-slate-100">
                      {['male', 'female', 'unisex'].map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, gender: g }))}
                          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                            formData.gender === g 
                              ? 'bg-white text-orange-600 shadow-md ring-1 ring-slate-100' 
                              : 'text-slate-400 hover:text-slate-600'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sizes Selection */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                    Select {formData.productType === 'Jeans' ? 'Waist Sizes' : 'Available Sizes'}
                  </span>
                  <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded-md font-black uppercase">Multiple Choice</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {currentSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size)}
                      className={`min-w-[56px] h-[56px] flex items-center justify-center rounded-2xl font-bold transition-all border-2 ${
                        formData.sizes.includes(size)
                          ? 'bg-orange-600 border-orange-600 text-white shadow-lg shadow-orange-500/30 ring-4 ring-orange-500/10'
                          : 'bg-white border-slate-100 text-slate-400 hover:border-orange-200 hover:text-orange-600'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <label className="block">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">About the Cloth</span>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="4" 
                  placeholder="Describe materials, fit, wash care, and style..." 
                  className="w-full mt-2 px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500/20 font-semibold text-slate-800 resize-none transition-all"
                ></textarea>
              </label>
            </div>

            <div className="pt-6 flex gap-4">
              <button 
                type="submit" 
                disabled={loading}
                className="flex-[2] bg-orange-600 text-white font-bold py-5 rounded-2xl shadow-xl shadow-orange-500/30 hover:bg-orange-700 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-6 h-6" />
                    Publish Cloth
                  </>
                )}
              </button>
              <button type="button" className="flex-1 px-8 py-5 rounded-2xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-all border border-slate-200">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddProduct;
