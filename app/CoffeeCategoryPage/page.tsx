"use client";


import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { FiFilter, FiGrid, FiList, FiStar, FiChevronDown, FiX, FiMessageCircle } from "react-icons/fi";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  badge: string;
  rating: number;
  reviews: number;
  isPrime: boolean;
  discount: number;
  type: string;
  positiveFeature: string;
  status: string;
}

interface Category {
  id: string;
  name: string;
  count: number;
  active: boolean;
}

interface PriceRange {
  id: number;
  label: string;
  value: string;
  min: number;
  max: number;
}

interface Filters {
  brands: string[];
  priceRanges: PriceRange[];
  ratings: number[];
}

interface CategoriesApiResponse {
  status: number;
  success: boolean;
  data: {
    categories: Array<{
      _id: string;
      name: string;
      description: string;
      images: string;
      color: string;
      isActive: boolean;
      showOnHomepage: boolean;
      productsCount: number;
    }>;
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

interface ProductsApiResponse {
  status: number;
  success: boolean;
  data: {
    products: Array<{
      _id: string;
      name: string;
      description: string;
      positiveFeature: string;
      category: string | null;
      badge: string;
      images: string[];
      image: string;
      status: string;
      price: number;
      originalPrice: number;
      discount: number;
      rating: number;
      reviews: number;
      isPrime: boolean;
      isPremium: boolean;
      features: string[];
      priceAfterDiscount: number;
    }>;
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export default function CoffeeCategoryPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('popular');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [expandedFilter, setExpandedFilter] = useState<string | null>(null);
  const [coffeeProducts, setCoffeeProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [customMinPrice, setCustomMinPrice] = useState<string>("");
  const [customMaxPrice, setCustomMaxPrice] = useState<string>("");
  const [filters, setFilters] = useState<Filters>({ brands: [], priceRanges: [], ratings: [] });
  const [loading, setLoading] = useState<boolean>(true);
  const [categoriesLoading, setCategoriesLoading] = useState<boolean>(true);

  // Fetch categories from API
  useEffect(() => {
    async function loadCategories() {
      try {
        setCategoriesLoading(true);
        const response = await fetch('https://coffee-shop-backend-k3un.onrender.com/api/v1/category');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result: CategoriesApiResponse = await response.json();
        
        if (result.success && result.data.categories) {
          // Map backend categories to our component structure
          const mappedCategories = result.data.categories
            .filter(cat => cat.isActive) // Only active categories
            .map((category, index) => ({
              id: category._id,
              name: category.name,
              count: category.productsCount || 0, // Use actual count from API or 0
              active: index === 0 // Make first category active by default
            }));
          
          setCategories(mappedCategories);
        } else {
          throw new Error('Failed to fetch categories from backend');
        }
      } catch (error) {
        console.error('Error loading categories:', error);
        // Fallback to static categories if API fails
        setCategories([
          { id: "1", name: "همه دسته‌بندی‌ها", count: 0, active: true },
          { id: "2", name: "قهوه اسپرسو", count: 0, active: false },
          { id: "3", name: "قهوه ترک", count: 0, active: false },
          { id: "4", name: "دانه قهوه", count: 0, active: false }
        ]);
      } finally {
        setCategoriesLoading(false);
      }
    }
    
    loadCategories();
  }, []);

  // Fetch products from API
  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const response = await fetch('https://coffee-shop-backend-k3un.onrender.com/api/v1/product');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result: ProductsApiResponse = await response.json();
        
        if (result.success && result.data.products) {
          const mappedProducts = result.data.products.map((product) => ({
            id: product._id,
            name: product.name,
            price: product.priceAfterDiscount || product.price,
            originalPrice: product.originalPrice,
            image: `https://coffee-shop-backend-k3un.onrender.com/${product.image}`,
            category: product.category || 'قهوه',
            badge: product.badge,
            rating: product.rating,
            reviews: product.reviews,
            isPrime: product.isPrime,
            discount: product.discount,
            type: 'regular',
            positiveFeature: product.positiveFeature,
            status: getStatusFromBadge(product.badge)
          }));
          
          setCoffeeProducts(mappedProducts);
        }
        
        // Static filters (unchanged)
        setFilters({
          brands: ["دیویدوف", "لاوازا", "ایلی", "استارباکس", "نسپرسو", "کمکس"],
          priceRanges: [
            { id: 1, label: "زیر ۱۰۰ هزار تومان", value: "0-100000", min: 0, max: 100000 },
            { id: 2, label: "۱۰۰ تا ۳۰۰ هزار تومان", value: "100000-300000", min: 100000, max: 300000 },
            { id: 3, label: "۳۰۰ تا ۵۰۰ هزار تومان", value: "300000-500000", min: 300000, max: 500000 },
            { id: 4, label: "۵۰۰ هزار تا ۱ میلیون", value: "500000-1000000", min: 500000, max: 1000000 },
            { id: 5, label: "بالای ۱ میلیون", value: "1000000-5000000", min: 1000000, max: 5000000 }
          ],
          ratings: [4, 3, 2, 1]
        });
      } catch (error) {
        console.error('Error loading products:', error);
        setCoffeeProducts([]);
      } finally {
        setLoading(false);
      }
    }
    
    loadProducts();
  }, []);

  // Helper function to convert badge to status
  const getStatusFromBadge = (badge: string): string => {
    switch (badge) {
      case "پرفروش":
        return "پر فروش";
      case "جدید":
        return "جدید";
      case "ویژه":
        return "فروش ویژه";
      default:
        return "جدید";
    }
  };

  const handlePriceRangeSelect = (range: PriceRange) => {
    setSelectedPriceRange(range.value);
    setPriceRange([range.min, range.max]);
    setCustomMinPrice(range.min.toString());
    setCustomMaxPrice(range.max.toString());
  };

  const handleCustomPriceApply = () => {
    const min = parseInt(customMinPrice) || 0;
    const max = parseInt(customMaxPrice) || 1000000;
    setPriceRange([min, max]);
    setSelectedPriceRange("custom");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + " تومان";
  };

  const formatProductPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + " تومان";
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "فروش ویژه":
        return "bg-gradient-to-r from-red-500 to-red-600 text-white";
      case "جدید":
        return "bg-gradient-to-r from-green-500 to-green-600 text-white";
      case "پر فروش":
        return "bg-gradient-to-r from-amber-500 to-amber-600 text-white";
      default:
        return "bg-gradient-to-r from-amber-600 to-amber-700 text-white";
    }
  };

  // Toggle category active state
  const toggleCategoryActive = (categoryId: string) => {
    setCategories(prev => prev.map(cat => ({
      ...cat,
      active: cat.id === categoryId
    })));
  };

  const FilterSection = ({ title, children, filterKey }: { title: string; children: React.ReactNode; filterKey: string }) => (
    <div className="border-b border-amber-200 last:border-b-0">
      <button
        onClick={() => setExpandedFilter(expandedFilter === filterKey ? null : filterKey)}
        className="w-full py-4 flex items-center justify-between text-right font-[var(--font-yekan)]"
      >
        <span className="font-semibold text-gray-700">{title}</span>
        <motion.div
          animate={{ rotate: expandedFilter === filterKey ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <FiChevronDown className="text-amber-600" />
        </motion.div>
      </button>
      <AnimatePresence>
        {expandedFilter === filterKey && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="pb-4"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-[var(--font-yekan)]">در حال بارگذاری محصولات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white pt-34">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-gray-600 mb-6 font-[var(--font-yekan)] mt-8 lg:mt-0"
        >
          <span>خانه</span>
          <span className="mx-2">/</span>
          <span>دسته‌بندی کالا ها</span>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar Filters */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:w-64 flex-shrink-0 hidden lg:block"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-amber-200 p-6 sticky top-32">
              <div className="flex items-center gap-2 mb-6">
                <FiFilter className="text-amber-600" />
                <h3 className="font-bold text-gray-800 font-[var(--font-yekan)]">فیلترها</h3>
              </div>

              {/* Categories - NOW DYNAMIC */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3 font-[var(--font-yekan)]">دسته‌بندی‌ها</h4>
                <div className="space-y-2">
                  {categoriesLoading ? (
                    // Loading skeleton for categories
                    [...Array(4)].map((_, index) => (
                      <div key={index} className="flex items-center justify-between animate-pulse">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-amber-200 rounded"></div>
                          <div className="h-4 bg-amber-200 rounded w-24"></div>
                        </div>
                        <div className="w-8 h-6 bg-amber-200 rounded-full"></div>
                      </div>
                    ))
                  ) : (
                    categories.map((category, index) => (
                      <motion.label
                        key={category.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between cursor-pointer group"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={category.active}
                            onChange={() => toggleCategoryActive(category.id)}
                            className="rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                          />
                          <span className="text-sm text-gray-600 group-hover:text-amber-700 transition-colors font-[var(--font-yekan)]">
                            {category.name}
                          </span>
                        </div>
                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                          {category.count}
                        </span>
                      </motion.label>
                    ))
                  )}
                </div>
              </div>

              {/* Modern Price Range Filter - REMAINS STATIC */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-4 font-[var(--font-yekan)]">محدوده قیمت</h4>
                
                {/* Quick Price Range Buttons */}
                <div className="space-y-2 mb-4">
                  {filters.priceRanges.map((range, index) => (
                    <motion.button
                      key={range.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handlePriceRangeSelect(range)}
                      className={`w-full text-right py-3 px-4 rounded-xl border transition-all duration-200 font-[var(--font-yekan)] text-sm ${
                        selectedPriceRange === range.value
                          ? 'bg-amber-500 text-white border-amber-500 shadow-md'
                          : 'bg-white text-gray-700 border-amber-200 hover:bg-amber-50 hover:border-amber-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{range.label}</span>
                        {selectedPriceRange === range.value && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Custom Price Range Input */}
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-700 font-[var(--font-yekan)]">قیمت دلخواه</span>
                    <span className="text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded-full font-[var(--font-yekan)]">
                      {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                    </span>
                  </div>
                  
                  <div className="flex gap-2 mb-3">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1 font-[var(--font-yekan)]">حداقل</label>
                      <input
                        type="text"
                        value={customMinPrice}
                        onChange={(e) => setCustomMinPrice(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="۰"
                        className="w-full px-3 py-2 text-sm border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-[var(--font-yekan)] text-left"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1 font-[var(--font-yekan)]">حداکثر</label>
                      <input
                        type="text"
                        value={customMaxPrice}
                        onChange={(e) => setCustomMaxPrice(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="۱۰۰۰۰۰۰"
                        className="w-full px-3 py-2 text-sm border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-[var(--font-yekan)] text-left"
                      />
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCustomPriceApply}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-lg text-sm font-medium transition-all font-[var(--font-yekan)]"
                  >
                    اعمال محدوده
                  </motion.button>
                </div>
              </div>

              {/* Brands - REMAINS STATIC */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3 font-[var(--font-yekan)]">برندها</h4>
                <div className="space-y-2">
                  {filters.brands.map((brand, index) => (
                    <motion.label
                      key={brand}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      <input type="checkbox" className="rounded border-amber-300 text-amber-600 focus:ring-amber-500" />
                      <span className="text-sm text-gray-600 group-hover:text-amber-700 transition-colors font-[var(--font-yekan)]">
                        {brand}
                      </span>
                    </motion.label>
                  ))}
                </div>
              </div>

              {/* Ratings - REMAINS STATIC */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-3 font-[var(--font-yekan)]">امتیاز</h4>
                <div className="space-y-2">
                  {filters.ratings.map((rating, index) => (
                    <motion.label
                      key={rating}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      <input type="checkbox" className="rounded border-amber-300 text-amber-600 focus:ring-amber-500" />
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <FiStar
                            key={i}
                            className={`w-3 h-3 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
                          />
                        ))}
                        <span className="text-xs text-gray-500 mr-1">و بالاتر</span>
                      </div>
                    </motion.label>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowMobileFilters(true)}
                className="w-full bg-white border-2 border-amber-300 rounded-2xl p-4 flex items-center justify-between shadow-lg font-[var(--font-yekan)]"
              >
                <div className="flex items-center gap-2">
                  <FiFilter className="text-amber-600" />
                  <span className="font-semibold text-gray-800">فیلترها و مرتب‌سازی</span>
                </div>
                <FiChevronDown className="text-amber-600" />
              </motion.button>
            </div>

            {/* Header with Sort and View Options */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-2xl shadow-lg border border-amber-200 p-6 mb-6"
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="bg-amber-500 rounded-full p-3">
                    <FiMessageCircle className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-amber-800 mb-1 font-[var(--font-yekan)]">
                      نیاز به مشاوره دارید؟
                    </h3>
                    <p className="text-amber-700 font-[var(--font-yekan)] text-sm">
                      برای دریافت راهنمایی تخصصی در انتخاب محصول، روی دکمه "از من بپرس" کلیک کنید
                    </p>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg font-[var(--font-yekan)] whitespace-nowrap"
                >
                  <FiMessageCircle size={18} />
                  <span>از من بپرس</span>
                </motion.button>
              </div>
            </motion.div>

            {/* Filter Options */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-wrap gap-3 mb-6"
            >
              {['توصیه شده ها', 'تخفیف دارها'].map((filter, index) => (
                <motion.button
                  key={filter}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all font-[var(--font-yekan)] ${
                    index === 0
                      ? 'bg-amber-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 border border-amber-200 hover:bg-amber-50 hover:text-amber-700'
                  }`}
                >
                  {filter}
                </motion.button>
              ))}
            </motion.div>

            {/* Products Grid/List */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className={`${
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-6'
              }`}
            >
              
              {coffeeProducts.map((product, index) => (
                <Link 
                  key={product.id} 
                  href={`/CoffeeCategoryPage/${product.id}`}
                  className="block"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-amber-100 overflow-hidden group cursor-pointer ${
                      viewMode === 'list' ? 'flex' : ''
                    }`}
                  >
                    {/* Product Image */}
                    <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'h-48'}`}>
                     
                      
                      {/* Discount Badge */}
                      {product.discount > 0 && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                          {product.discount}% تخفیف
                        </div>
                      )}
                      
                      {/* Status Badge */}
                      <div className="absolute top-3 right-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium font-[var(--font-yekan)] shadow-md ${getStatusBadgeStyle(product.status)}`}>
                          {product.status}
                        </span>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className={`p-4 flex-1 ${viewMode === 'list' ? 'flex flex-col justify-between' : ''}`}>
                      <div>
                        <h3 className="font-bold text-gray-800 mb-2 text-sm leading-relaxed font-[var(--font-yekan)]">
                          {product.name}
                        </h3>
                        
                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <FiStar
                                key={i}
                                className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500 font-[var(--font-yekan)]">
                            ({product.reviews} نظر)
                          </span>
                        </div>

                        {/* Positive Feature */}
                        <div className="mb-3">
                          <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium font-[var(--font-yekan)] border border-green-200">
                            {product.positiveFeature}
                          </span>
                        </div>
                      </div>

                      {/* Price and Actions */}
                      <div className="space-y-3 mt-4">
                        {/* Price Section */}
                        <div className="flex flex-col gap-1">
                          {/* Original Price (if discounted) */}
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-sm text-gray-500 line-through font-[var(--font-yekan)]">
                              {formatProductPrice(product.originalPrice)}
                            </span>
                          )}
                          {/* Current Price */}
                          <span className={`font-bold text-amber-700 font-[var(--font-yekan)] ${
                            product.originalPrice && product.originalPrice > product.price ? 'text-lg' : 'text-xl'
                          }`}>
                            {formatProductPrice(product.price)}
                          </span>
                        </div>

                        {/* Buttons Section */}
                        <div className="flex flex-col gap-2">
                          {/* Smart Consultation Button */}
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-lg font-[var(--font-yekan)]"
                            onClick={(e) => {
                              e.preventDefault();
                            }}
                          >
                            <FiMessageCircle size={14} />
                            <span>مشاوره سریع (هوشمند)</span>
                          </motion.button>

                          {/* Buy Button */}
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-4 py-3 rounded-xl font-semibold transition-all shadow-lg font-[var(--font-yekan)]"
                            onClick={(e) => {
                              e.preventDefault();
                            }}
                          >
                            خرید
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </motion.div>

            {/* No Products Message */}
            {coffeeProducts.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-gray-600 font-[var(--font-yekan)] text-lg">
                  محصولی برای نمایش وجود ندارد.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal - Updated with dynamic categories */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 right-0 bottom-0 bg-white z-50 lg:hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-amber-200 bg-amber-50">
                <h2 className="text-xl font-bold text-amber-800 font-[var(--font-yekan)]">فیلترها و مرتب‌سازی</h2>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 text-gray-600 hover:text-amber-700"
                >
                  <FiX size={24} />
                </button>
              </div>

              {/* Filters Content */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="bg-white rounded-2xl border border-amber-200">
                  {/* Categories - NOW DYNAMIC in mobile too */}
                  <FilterSection title="دسته‌بندی‌ها" filterKey="categories">
                    <div className="space-y-2">
                      {categoriesLoading ? (
                        [...Array(4)].map((_, index) => (
                          <div key={index} className="flex items-center justify-between animate-pulse">
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 bg-amber-200 rounded"></div>
                              <div className="h-4 bg-amber-200 rounded w-24"></div>
                            </div>
                            <div className="w-8 h-6 bg-amber-200 rounded-full"></div>
                          </div>
                        ))
                      ) : (
                        categories.map((category) => (
                          <label key={category.id} className="flex items-center justify-between cursor-pointer group">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={category.active}
                                onChange={() => toggleCategoryActive(category.id)}
                                className="rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                              />
                              <span className="text-sm text-gray-600 group-hover:text-amber-700 transition-colors font-[var(--font-yekan)]">
                                {category.name}
                              </span>
                            </div>
                            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                              {category.count}
                            </span>
                          </label>
                        ))
                      )}
                    </div>
                  </FilterSection>

                  {/* Price Range - Updated for mobile */}
                  <FilterSection title="محدوده قیمت" filterKey="price">
                    <div className="space-y-3">
                      {filters.priceRanges.map((range) => (
                        <button
                          key={range.id}
                          onClick={() => handlePriceRangeSelect(range)}
                          className={`w-full text-right py-3 px-4 rounded-xl border transition-all duration-200 font-[var(--font-yekan)] text-sm ${
                            selectedPriceRange === range.value
                              ? 'bg-amber-500 text-white border-amber-500 shadow-md'
                              : 'bg-white text-gray-700 border-amber-200 hover:bg-amber-50 hover:border-amber-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{range.label}</span>
                            {selectedPriceRange === range.value && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                        </button>
                      ))}
                      
                      {/* Custom Price Range for Mobile */}
                      <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                        <div className="flex gap-2 mb-3">
                          <div className="flex-1">
                            <input
                              type="text"
                              value={customMinPrice}
                              onChange={(e) => setCustomMinPrice(e.target.value.replace(/[^0-9]/g, ''))}
                              placeholder="حداقل قیمت"
                              className="w-full px-3 py-2 text-sm border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-[var(--font-yekan)] text-left"
                            />
                          </div>
                          <div className="flex-1">
                            <input
                              type="text"
                              value={customMaxPrice}
                              onChange={(e) => setCustomMaxPrice(e.target.value.replace(/[^0-9]/g, ''))}
                              placeholder="حداکثر قیمت"
                              className="w-full px-3 py-2 text-sm border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-[var(--font-yekan)] text-left"
                            />
                          </div>
                        </div>
                        <button
                          onClick={handleCustomPriceApply}
                          className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-lg text-sm font-medium transition-all font-[var(--font-yekan)]"
                        >
                          اعمال محدوده
                        </button>
                      </div>
                    </div>
                  </FilterSection>

                  {/* Brands */}
                  <FilterSection title="برندها" filterKey="brands">
                    <div className="space-y-2">
                      {filters.brands.map((brand) => (
                        <label key={brand} className="flex items-center gap-2 cursor-pointer group">
                          <input type="checkbox" className="rounded border-amber-300 text-amber-600 focus:ring-amber-500" />
                          <span className="text-sm text-gray-600 group-hover:text-amber-700 transition-colors font-[var(--font-yekan)]">
                            {brand}
                          </span>
                        </label>
                      ))}
                    </div>
                  </FilterSection>

                  {/* Ratings */}
                  <FilterSection title="امتیاز" filterKey="ratings">
                    <div className="space-y-2">
                      {filters.ratings.map((rating) => (
                        <label key={rating} className="flex items-center gap-2 cursor-pointer group">
                          <input type="checkbox" className="rounded border-amber-300 text-amber-600 focus:ring-amber-500" />
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <FiStar
                                key={i}
                                className={`w-3 h-3 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
                              />
                            ))}
                            <span className="text-xs text-gray-500 mr-1">و بالاتر</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </FilterSection>
                </div>
              </div>

              {/* Apply Button */}
              <div className="p-4 border-t border-amber-200 bg-white">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3 rounded-2xl font-semibold shadow-lg font-[var(--font-yekan)]"
                >
                  اعمال فیلترها
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}