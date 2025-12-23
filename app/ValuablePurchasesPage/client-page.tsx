// app/valuable-purchases/client-page.tsx
"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { FiFilter, FiStar, FiShoppingCart, FiHeart, FiChevronDown, FiX, FiMessageCircle, FiAward, FiZap, FiClock, FiShield, FiTruck } from "react-icons/fi";
import { LuCrown } from "react-icons/lu";

// Add PageProps interface
interface PageProps {
  initialProducts: Product[];
  initialCategories: Category[];
  error?: string;
}

// Corrected Interfaces based on actual API structure
interface Product {
  _id: string;
  features?: string[];
  filters?: string[];
  product: {
    _id: string;
    name: string;
    slug: string;
    category: string;
    price: number;
    stock: number;
    image: string;
    brand?: string;
    priceAfterDiscount: number;
    id: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  images: string;
  color: string;
  parent: string | null;
  isActive: boolean;
  productsCount: number;
  id: string;
}

interface ApiResponse {
  status: number;
  success: boolean;
  data: {
    valueBuys: Product[];
    pagination: {
      page: number;
      limit: number;
      totalPage: number;
      totalValueBuys: number;
    };
  };
}

interface FilterState {
  categories: string[];
  priceRanges: string[];
  brands: string[];
  specialFilters: string[];
}

interface FilterCategory {
  id: string;
  name: string;
  count: number;
  active: boolean;
}

export default function ClientValuablePurchasesPage({ 
  initialProducts, 
  initialCategories, 
  error 
}: PageProps) {
  // Use initial data from server immediately
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [allCategories, setAllCategories] = useState<Category[]>(initialCategories);
  
  // All other state variables remain the same
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [expandedFilter, setExpandedFilter] = useState<string | null>(null);
  const [categories, setCategories] = useState<FilterCategory[]>([]);
  const [brands, setBrands] = useState<FilterCategory[]>([]);
  const [filterState, setFilterState] = useState<FilterState>({
    categories: [],
    priceRanges: [],
    brands: [],
    specialFilters: []
  });
  const [customMinPrice, setCustomMinPrice] = useState<string>("");
  const [customMaxPrice, setCustomMaxPrice] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(
    initialProducts.length === 0 || initialCategories.length === 0
  );

  const [priceRanges] = useState([
    { id: 1, label: 'زیر ۵۰۰ هزار تومان', value: '0-500000', min: 0, max: 500000 },
    { id: 2, label: '۵۰۰ هزار تا ۱ میلیون', value: '500000-1000000', min: 500000, max: 1000000 },
    { id: 3, label: 'بالای ۱ میلیون', value: '1000000-5000000', min: 1000000, max: 5000000 },
  ]);

  // Load additional data client-side if needed
  useEffect(() => {
    // Only fetch if initial data is empty
    if (initialProducts.length === 0 || initialCategories.length === 0) {
      loadData();
    } else {
      // Process filters from initial data
      processCategoriesAndBrands();
      setLoading(false);
    }
    
    async function loadData() {
      try {
        setLoading(true);
        const [productsResponse, categoriesResponse] = await Promise.all([
          fetch('https://coffee-shop-backend-k3un.onrender.com/api/v1/valueBuy'),
          fetch('https://coffee-shop-backend-k3un.onrender.com/api/v1/category')
        ]);

        const productsData: ApiResponse = await productsResponse.json();
        const categoriesData = await categoriesResponse.json();

        if (productsData.success && productsData.data.valueBuys) {
          setProducts(productsData.data.valueBuys);
        }

        if (categoriesData.success && categoriesData.data.categories) {
          setAllCategories(categoriesData.data.categories);
        }
      } catch (error) {
        console.error('Error loading data from API:', error);
      } finally {
        setLoading(false);
      }
    }
  }, [initialProducts.length, initialCategories.length]);

  // Process filters when data changes
  useEffect(() => {
    if (products.length > 0 && allCategories.length > 0) {
      processCategoriesAndBrands();
    }
  }, [products, allCategories]);

  const processCategoriesAndBrands = () => {
    const categoryMap = new Map<string, number>();
    const brandMap = new Map<string, number>();

    products.forEach(item => {
      const category = allCategories.find(cat => cat._id === item.product.category);
      const categoryName = category?.name || 'دسته‌بندی نشده';
      
      if (categoryMap.has(categoryName)) {
        categoryMap.set(categoryName, categoryMap.get(categoryName)! + 1);
      } else {
        categoryMap.set(categoryName, 1);
      }
      
      const brandName = item.product.brand || 'برند مشخص نشده';
      if (brandMap.has(brandName)) {
        brandMap.set(brandName, brandMap.get(brandName)! + 1);
      } else {
        brandMap.set(brandName, 1);
      }
    });

    const processedCategories: FilterCategory[] = Array.from(categoryMap.entries()).map(([name, count], index) => ({
      id: `cat-${index}`,
      name,
      count,
      active: false
    }));

    const processedBrands: FilterCategory[] = Array.from(brandMap.entries()).map(([name, count], index) => ({
      id: `brand-${index}`,
      name,
      count,
      active: false
    }));

    setCategories(processedCategories);
    setBrands(processedBrands);
  };

  const filteredProducts = products.filter(product => {
    if (filterState.categories.length > 0) {
      const productCategory = allCategories.find(cat => cat._id === product.product.category);
      const categoryName = productCategory?.name || 'دسته‌بندی نشده';
      
      if (!filterState.categories.includes(categoryName)) {
        return false;
      }
    }

    if (filterState.brands.length > 0) {
      const brandName = product.product.brand || 'برند مشخص نشده';
      if (!filterState.brands.includes(brandName)) {
        return false;
      }
    }

    if (filterState.priceRanges.length > 0) {
      const price = product.product.priceAfterDiscount || product.product.price;
      const matchesPrice = filterState.priceRanges.some(range => {
        const [min, max] = range.split('-').map(Number);
        return price >= min && price <= max;
      });
      if (!matchesPrice) return false;
    }

    if (filterState.specialFilters.length > 0 && product.filters) {
      const matchesSpecial = filterState.specialFilters.some(filter => {
        return product.filters!.includes(filter);
      });
      if (!matchesSpecial) return false;
    }

    return true;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + " تومان";
  };

  const formatProductPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + " تومان";
  };

  const getStatusBadgeStyle = (product: Product) => {
    if (product.features && product.features.includes("پیشنهاد شده")) return "bg-gradient-to-r from-orange-500 to-orange-600 text-white";
    if (product.filters && product.filters.includes("انتخاب اقتصادی")) return "bg-gradient-to-r from-blue-600 to-blue-700 text-white";
    if (product.product.stock < 3) return "bg-gradient-to-r from-purple-500 to-purple-600 text-white";
    return "bg-gradient-to-r from-blue-500 to-blue-600 text-white";
  };

  const getStatusText = (product: Product) => {
    if (product.features && product.features.includes("پیشنهاد شده")) return "فروش ویژه";
    if (product.filters && product.filters.includes("انتخاب اقتصادی")) return "پر فروش";
    if (product.product.stock < 3) return "آخرین فرصت";
    return "جدید";
  };

  const getPositiveFeature = (product: Product) => {
    if (product.filters && product.filters.includes("انتخاب اقتصادی")) return "انتخاب اقتصادی";
    if (product.features && product.features.includes("پیشنهاد شده")) return "پیشنهاد ویژه";
    if (product.product.stock > 10) return "موجود زیاد";
    return "کیفیت عالی";
  };

  const handleFilterChange = (filterType: keyof FilterState, value: string) => {
    setFilterState(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(item => item !== value)
        : [...prev[filterType], value]
    }));
  };

  // Handle custom price range
  const handleCustomPriceApply = () => {
    const min = parseInt(customMinPrice) || 0;
    const max = parseInt(customMaxPrice) || 1000000;
    
    // Validate and ensure min is not greater than max
    const validatedMin = Math.min(min, max);
    const validatedMax = Math.max(min, max);
    
    setCustomMinPrice(validatedMin.toString());
    setCustomMaxPrice(validatedMax.toString());
  };

  // Handle individual custom price input changes
  const handleCustomMinPriceChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    setCustomMinPrice(numericValue);
  };

  const handleCustomMaxPriceChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    setCustomMaxPrice(numericValue);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilterState({
      categories: [],
      priceRanges: [],
      brands: [],
      specialFilters: []
    });
    
    setCustomMinPrice("");
    setCustomMaxPrice("");
  };

  // Check if any filters are active
  const hasActiveFilters = 
    filterState.categories.length > 0 ||
    filterState.priceRanges.length > 0 ||
    filterState.brands.length > 0 ||
    filterState.specialFilters.length > 0;

  const FilterSection = ({ title, children, filterKey }: { title: string; children: React.ReactNode; filterKey: string }) => (
    <div className="border-b border-blue-200 last:border-b-0">
      <button
        onClick={() => setExpandedFilter(expandedFilter === filterKey ? null : filterKey)}
        className="w-full py-4 flex items-center justify-between text-right font-[var(--font-yekan)]"
      >
        <span className="font-semibold text-gray-800">{title}</span>
        <motion.div
          animate={{ rotate: expandedFilter === filterKey ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <FiChevronDown className="text-blue-600" />
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

  // Show error if exists
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-white pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4 font-[var(--font-yekan)]">{error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl font-[var(--font-yekan)] hover:bg-blue-700"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  if (loading && (initialProducts.length === 0 || initialCategories.length === 0)) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-white pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-[var(--font-yekan)]">در حال بارگذاری خریدهای باارزش...</p>
        </div>
      </div>
    );
  }

  // REST OF YOUR JSX REMAINS EXACTLY THE SAME FROM YOUR ORIGINAL COMPONENT
  // Copy everything from the return statement below
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-white pt-34">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-gray-600 mb-6 font-[var(--font-yekan)]"
        >
          <span className="hover:text-blue-700 cursor-pointer">خانه</span>
          <span className="mx-2">/</span>
          <span className="hover:text-blue-700 cursor-pointer">خریدهای باارزش</span>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - UPDATED to match other pages */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:w-64 flex-shrink-0 hidden lg:block"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-blue-200 p-6 sticky top-32">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <FiFilter className="text-blue-600" />
                  <h3 className="font-bold text-gray-800 font-[var(--font-yekan)]">فیلترها</h3>
                </div>
                {hasActiveFilters && (
                  <button 
                    onClick={clearAllFilters}
                    className="text-red-500 hover:text-red-700 text-sm font-[var(--font-yekan)]"
                  >
                    حذف همه
                  </button>
                )}
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 mb-6 border border-blue-200">
                <div className="flex items-center justify-between text-sm font-[var(--font-yekan)]">
                  <span className="text-gray-700">تعداد محصولات:</span>
                  <span className="font-bold text-blue-700">{filteredProducts.length} قلم</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2 font-[var(--font-yekan)]">
                  <span className="text-gray-700">موجودی کل:</span>
                  <span className="font-bold text-blue-700">
                    {products.reduce((acc, product) => acc + product.product.stock, 0)} عدد
                  </span>
                </div>
              </div>

              {/* Categories - UPDATED layout */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3 font-[var(--font-yekan)]">دسته‌بندی‌ها</h4>
                <div className="space-y-2">
                  {categories.map((category, index) => (
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
                          checked={filterState.categories.includes(category.name)}
                          onChange={() => handleFilterChange('categories', category.name)}
                          className="rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-600 group-hover:text-blue-700 transition-colors font-[var(--font-yekan)]">
                          {category.name}
                        </span>
                      </div>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        {category.count}
                      </span>
                    </motion.label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter - UPDATED to match other pages */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-4 font-[var(--font-yekan)]">محدوده قیمت</h4>

                {/* Custom Price Range Input */}
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-700 font-[var(--font-yekan)]">قیمت دلخواه</span>
                    <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full font-[var(--font-yekan)]">
                      {customMinPrice ? formatPrice(parseInt(customMinPrice) || 0) : '۰'} - {customMaxPrice ? formatPrice(parseInt(customMaxPrice) || 1000000) : '۱۰۰۰۰۰۰'}
                    </span>
                  </div>
                  
                  <div className="flex gap-2 mb-3">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1 font-[var(--font-yekan)]">حداقل</label>
                      <input
                        type="text"
                        value={customMinPrice}
                        onChange={(e) => handleCustomMinPriceChange(e.target.value)}
                        placeholder="۰"
                        className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-[var(--font-yekan)] text-left"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1 font-[var(--font-yekan)]">حداکثر</label>
                      <input
                        type="text"
                        value={customMaxPrice}
                        onChange={(e) => handleCustomMaxPriceChange(e.target.value)}
                        placeholder="۱۰۰۰۰۰۰"
                        className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-[var(--font-yekan)] text-left"
                      />
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCustomPriceApply}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition-all font-[var(--font-yekan)]"
                  >
                    اعمال محدوده
                  </motion.button>
                </div>
              </div>

              {/* Brands - UPDATED layout */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3 font-[var(--font-yekan)]">برندها</h4>
                <div className="space-y-2">
                  {brands.map((brand, index) => (
                    <motion.label
                      key={brand.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      <input 
                        type="checkbox" 
                        checked={filterState.brands.includes(brand.name)}
                        onChange={() => handleFilterChange('brands', brand.name)}
                        className="rounded border-blue-300 text-blue-600 focus:ring-blue-500" 
                      />
                      <span className="text-sm text-gray-600 group-hover:text-blue-700 transition-colors font-[var(--font-yekan)]">
                        {brand.name}
                      </span>
                    </motion.label>
                  ))}
                </div>
              </div>

              {/* Special Filters - UPDATED layout */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3 font-[var(--font-yekan)]">فیلترهای ویژه</h4>
                <div className="space-y-2">
                  {[
                    { key: 'economicChoice', label: 'بهترین انتخاب اقتصادی' },
                    { key: 'bestValue', label: 'بیشترین ارزش' },
                    { key: 'topSelling', label: 'پرفروش' },
                    { key: 'freeShipping', label: 'ارسال رایگان' }
                  ].map((filter, index) => (
                    <motion.label
                      key={filter.key}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      <input 
                        type="checkbox" 
                        checked={filterState.specialFilters.includes(filter.key)}
                        onChange={() => handleFilterChange('specialFilters', filter.key)}
                        className="rounded border-blue-300 text-blue-600 focus:ring-blue-500" 
                      />
                      <span className="text-sm text-gray-600 group-hover:text-blue-700 transition-colors font-[var(--font-yekan)]">
                        {filter.label}
                      </span>
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
                className="w-full bg-white border-2 border-blue-300 rounded-2xl p-4 flex items-center justify-between shadow-lg font-[var(--font-yekan)]"
              >
                <div className="flex items-center gap-2">
                  <FiFilter className="text-blue-600" />
                  <span className="font-semibold text-gray-800">فیلترها و مرتب‌سازی</span>
                </div>
                <FiChevronDown className="text-blue-600" />
              </motion.button>
            </div>

            {/* Consultation Banner - Hidden on mobile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg border border-blue-500 p-6 mb-6 relative overflow-hidden hidden lg:block"
            >
              <div className="absolute top-0 left-0 w-24 h-24 bg-white/10 rounded-full -translate-x-12 -translate-y-12"></div>
              <div className="absolute bottom-0 right-0 w-20 h-20 bg-white/10 rounded-full translate-x-10 translate-y-10"></div>
              
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 rounded-xl p-3 backdrop-blur-sm">
                    <FiMessageCircle className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1 font-[var(--font-yekan)]">
                      بیشترین ارزش دریافتی در مقابل پول پرداخت شده 
                    </h3>
                    <p className="text-blue-100 font-[var(--font-yekan)] text-sm leading-relaxed">
                      برای دریافت راهنمایی تخصصی در انتخاب محصول، روی دکمه "از من بپرس" کلیک کنید
                    </p>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 bg-white hover:bg-blue-50 text-blue-700 px-6 py-3 rounded-xl font-semibold transition-all shadow-lg font-[var(--font-yekan)] whitespace-nowrap"
                >
                  <FiMessageCircle size={18} />
                  <span>از من بپرس</span>
                </motion.button>
              </div>
            </motion.div>

            {/* Products Grid - Product links updated to open in new tab */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6"
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link
                    href={`/CoffeeCategoryPage/${product.product._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-blue-100 overflow-hidden group relative block h-full flex flex-col"
                  >
                    {/* Product Image Section - Increased height */}
                    <div className="relative h-40 sm:h-48 overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                      <div className="text-center">
                        <LuCrown className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 mx-auto mb-2" />
                        <span className="text-blue-700 font-bold font-[var(--font-yekan)] text-xs sm:text-sm">{product.product.name}</span>
                        <p className="text-blue-600 text-xs mt-1 font-[var(--font-yekan)]">{product.product.brand}</p>
                      </div>
                      
                      {/* Status Badge */}
                      <div className="absolute top-2 right-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium font-[var(--font-yekan)] shadow-md ${getStatusBadgeStyle(product)}`}>
                          {getStatusText(product)}
                        </span>
                      </div>

                      {/* Premium Badge */}
                      <div className="absolute bottom-2 right-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg flex items-center gap-1">
                        <LuCrown size={10} />
                        <span>پریمیوم</span>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-3 flex-1 flex flex-col">
                      <h3 className="font-bold text-gray-800 mb-2 text-xs sm:text-sm leading-relaxed font-[var(--font-yekan)] line-clamp-2">
                        {product.product.name}
                      </h3>
                      
                      {/* Stock Information */}
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          <FiShield className="w-3 h-3 text-blue-600" />
                          <span className="text-xs text-gray-500 font-[var(--font-yekan)]">
                            موجودی: {product.product.stock} عدد
                          </span>
                        </div>
                      </div>

                      {/* Positive Feature */}
                      <div className="mb-2">
                        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full font-medium font-[var(--font-yekan)] border border-blue-200">
                          {getPositiveFeature(product)}
                        </span>
                      </div>

                      {/* Price and Actions */}
                      <div className="space-y-2 mt-auto">
                        {/* Price Section */}
                        <div className="flex flex-col gap-1">
                          {product.product.priceAfterDiscount && product.product.priceAfterDiscount < product.product.price && (
                            <span className="text-xs text-gray-500 line-through font-[var(--font-yekan)]">
                              {formatPrice(product.product.price)}
                            </span>
                          )}
                          <span className={`font-bold text-blue-700 font-[var(--font-yekan)] text-base sm:text-lg`}>
                            {formatPrice(product.product.priceAfterDiscount || product.product.price)}
                          </span>
                        </div>

                        {/* Buttons Section - Quick consultation button removed */}
                        <div className="flex flex-col gap-2">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl font-semibold transition-all shadow-lg font-[var(--font-yekan)] text-xs sm:text-sm"
                            onClick={(e) => {
                              e.preventDefault();
                            }}
                          >
                            خرید
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {/* No Results Message */}
            {filteredProducts.length === 0 && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <div className="bg-white rounded-2xl shadow-lg border border-blue-200 p-8 max-w-md mx-auto">
                  <LuCrown className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-800 mb-2 font-[var(--font-yekan)]">
                    محصولی یافت نشد
                  </h3>
                  <p className="text-gray-600 font-[var(--font-yekan)]">
                    با فیلترهای فعلی هیچ محصولی matching ندارد. لطفاً فیلترها را تغییر دهید.
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal - UPDATED with improved spacing */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 right-0 bottom-0 bg-white z-50 lg:hidden flex flex-col"
            >
              {/* Header - Improved spacing */}
              <div className="flex items-center justify-between p-5 border-b border-blue-200 bg-blue-50">
                <h2 className="text-xl font-bold text-blue-800 font-[var(--font-yekan)]">فیلترها و مرتب‌سازی</h2>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-3 text-gray-600 hover:text-blue-700 rounded-full hover:bg-blue-100"
                >
                  <FiX size={24} />
                </button>
              </div>

              {/* Filters Content - Improved margins and spacing */}
              <div className="flex-1 overflow-y-auto px-5 py-4">
                <div className="bg-white rounded-2xl border border-blue-200 p-5">
                  {/* Categories */}
                  <FilterSection title="دسته‌بندی‌ها" filterKey="categories">
                    <div className="space-y-3 mt-3">
                      {categories.map((category) => (
                        <label key={category.id} className="flex items-center justify-between cursor-pointer group px-1">
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={filterState.categories.includes(category.name)}
                              onChange={() => handleFilterChange('categories', category.name)}
                              className="w-5 h-5 rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-600 group-hover:text-blue-700 transition-colors font-[var(--font-yekan)]">
                              {category.name}
                            </span>
                          </div>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1.5 rounded-full">
                            {category.count}
                          </span>
                        </label>
                      ))}
                    </div>
                  </FilterSection>

                  {/* Price Range */}
                  <FilterSection title="محدوده قیمت" filterKey="price">
                    <div className="space-y-4 mt-3">
                      {/* Custom Price Range for Mobile */}
                      <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                        <div className="flex gap-3 mb-4">
                          <div className="flex-1">
                            <label className="block text-xs text-gray-500 mb-2 font-[var(--font-yekan)]">حداقل قیمت</label>
                            <input
                              type="text"
                              value={customMinPrice}
                              onChange={(e) => handleCustomMinPriceChange(e.target.value)}
                              placeholder="۰"
                              className="w-full px-4 py-3 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-[var(--font-yekan)] text-left"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block text-xs text-gray-500 mb-2 font-[var(--font-yekan)]">حداکثر قیمت</label>
                            <input
                              type="text"
                              value={customMaxPrice}
                              onChange={(e) => handleCustomMaxPriceChange(e.target.value)}
                              placeholder="۱۰۰۰۰۰۰"
                              className="w-full px-4 py-3 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-[var(--font-yekan)] text-left"
                            />
                          </div>
                        </div>
                        <button
                          onClick={handleCustomPriceApply}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-sm font-medium transition-all font-[var(--font-yekan)]"
                        >
                          اعمال محدوده
                        </button>
                      </div>
                    </div>
                  </FilterSection>

                  {/* Brands */}
                  <FilterSection title="برندها" filterKey="brands">
                    <div className="space-y-3 mt-3">
                      {brands.map((brand) => (
                        <label key={brand.id} className="flex items-center gap-3 cursor-pointer group px-1">
                          <input 
                            type="checkbox" 
                            checked={filterState.brands.includes(brand.name)}
                            onChange={() => handleFilterChange('brands', brand.name)}
                            className="w-5 h-5 rounded border-blue-300 text-blue-600 focus:ring-blue-500" 
                          />
                          <span className="text-sm text-gray-600 group-hover:text-blue-700 transition-colors font-[var(--font-yekan)]">
                            {brand.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </FilterSection>

                  {/* Special Filters */}
                  <FilterSection title="فیلترهای ویژه" filterKey="special">
                    <div className="space-y-3 mt-3">
                      {[
                        { key: 'economicChoice', label: 'بهترین انتخاب اقتصادی' },
                        { key: 'bestValue', label: 'بیشترین ارزش' },
                        { key: 'topSelling', label: 'پرفروش' },
                        { key: 'freeShipping', label: 'ارسال رایگان' }
                      ].map((filter) => (
                        <label key={filter.key} className="flex items-center gap-3 cursor-pointer group px-1">
                          <input 
                            type="checkbox" 
                            checked={filterState.specialFilters.includes(filter.key)}
                            onChange={() => handleFilterChange('specialFilters', filter.key)}
                            className="w-5 h-5 rounded border-blue-300 text-blue-600 focus:ring-blue-500" 
                          />
                          <span className="text-sm text-gray-600 group-hover:text-blue-700 transition-colors font-[var(--font-yekan)]">
                            {filter.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </FilterSection>
                </div>
              </div>

              {/* Apply Button */}
              <div className="p-5 border-t border-blue-200 bg-white">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-2xl font-semibold shadow-lg font-[var(--font-yekan)]"
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