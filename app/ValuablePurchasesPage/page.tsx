"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { FiFilter, FiStar, FiShoppingCart, FiHeart, FiChevronDown, FiX, FiMessageCircle, FiAward, FiZap, FiClock, FiShield, FiTruck } from "react-icons/fi";
import { LuCrown } from "react-icons/lu";

// Corrected Interfaces based on actual API structure
interface Product {
  _id: string;
  features?: string[]; // Made optional
  filters?: string[]; // Made optional
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

interface CategoryApiResponse {
  status: number;
  success: boolean;
  data: {
    categories: Category[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
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

export default function ValuablePurchasesPage() {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [expandedFilter, setExpandedFilter] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<FilterCategory[]>([]);
  const [brands, setBrands] = useState<FilterCategory[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [filterState, setFilterState] = useState<FilterState>({
    categories: [],
    priceRanges: [],
    brands: [],
    specialFilters: []
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [priceRanges] = useState([
    { id: 1, label: 'زیر ۵۰۰ هزار تومان', value: '0-500000' },
    { id: 2, label: '۵۰۰ هزار تا ۱ میلیون', value: '500000-1000000' },
    { id: 3, label: 'بالای ۱ میلیون', value: '1000000-5000000' },
  ]);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        
        const [productsResponse, categoriesResponse] = await Promise.all([
          fetch('https://coffee-shop-backend-k3un.onrender.com/api/v1/valueBuy'),
          fetch('https://coffee-shop-backend-k3un.onrender.com/api/v1/category')
        ]);

        const productsData: ApiResponse = await productsResponse.json();
        const categoriesData: CategoryApiResponse = await categoriesResponse.json();

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

    loadData();
  }, []);

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

    // FIXED: Check if filters exists before using includes
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

  // FIXED: All helper functions now safely check if arrays exist
  const getStatusBadgeStyle = (product: Product) => {
    if (product.features && product.features.includes("پیشنهاد شده")) return "bg-gradient-to-r from-red-500 to-red-600 text-white";
    if (product.filters && product.filters.includes("انتخاب اقتصادی")) return "bg-gradient-to-r from-amber-500 to-amber-600 text-white";
    if (product.product.stock < 3) return "bg-gradient-to-r from-purple-500 to-purple-600 text-white";
    return "bg-gradient-to-r from-green-500 to-green-600 text-white";
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

  const getProductFeatures = (product: Product) => {
    return product.features || []; // Return empty array if features doesn't exist
  };

  const handleFilterChange = (filterType: keyof FilterState, value: string) => {
    setFilterState(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(item => item !== value)
        : [...prev[filterType], value]
    }));
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
      <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-orange-50/30 pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-[var(--font-yekan)]">در حال بارگذاری محصولات باارزش...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-orange-50/30 pt-34">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-gray-600 mb-6 font-[var(--font-yekan)]"
        >
          <span className="hover:text-amber-700 cursor-pointer">خانه</span>
          <span className="mx-2">/</span>
          <span className="hover:text-amber-700 cursor-pointer">خریدهای باارزش</span>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:w-72 flex-shrink-0 hidden lg:block"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-amber-200/60 p-6 sticky top-32">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-amber-200">
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-2 rounded-lg">
                  <LuCrown className="text-white text-lg" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 font-[var(--font-yekan)]">فیلترهای ویژه</h3>
                  <p className="text-xs text-gray-500 mt-1 font-[var(--font-yekan)]">محصولات منتخب و باارزش</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl p-4 mb-6 border border-amber-200">
                <div className="flex items-center justify-between text-sm font-[var(--font-yekan)]">
                  <span className="text-gray-700">تعداد محصولات:</span>
                  <span className="font-bold text-amber-700">{filteredProducts.length} قلم</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2 font-[var(--font-yekan)]">
                  <span className="text-gray-700">موجودی کل:</span>
                  <span className="font-bold text-amber-700">
                    {products.reduce((acc, product) => acc + product.product.stock, 0)} عدد
                  </span>
                </div>
              </div>

              {/* Special Filters */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3 font-[var(--font-yekan)] flex items-center gap-2">
                  <FiAward className="text-amber-500" />
                  فیلترهای ویژه
                </h4>
                <div className="space-y-2">
                  {[
                    { key: 'economicChoice', label: 'بهترین انتخاب اقتصادی', icon: <FiAward className="text-amber-500 w-4 h-4" /> },
                    { key: 'bestValue', label: 'بیشترین ارزش', icon: <FiZap className="text-amber-500 w-4 h-4" /> },
                    { key: 'topSelling', label: 'پرفروش', icon: <FiStar className="text-amber-500 w-4 h-4" /> },
                    { key: 'freeShipping', label: 'ارسال رایگان', icon: <FiTruck className="text-green-500 w-4 h-4" /> }
                  ].map((filter) => (
                    <motion.label
                      key={filter.key}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-3 cursor-pointer group p-3 rounded-xl border border-amber-200 hover:bg-amber-50 transition-all"
                    >
                      <input 
                        type="checkbox" 
                        checked={filterState.specialFilters.includes(filter.key)}
                        onChange={() => handleFilterChange('specialFilters', filter.key)}
                        className="rounded border-amber-300 text-amber-600 focus:ring-amber-500 w-4 h-4" 
                      />
                      <span className="text-sm text-gray-600 group-hover:text-amber-700 transition-colors font-[var(--font-yekan)] flex-1">
                        {filter.label}
                      </span>
                      {filter.icon}
                    </motion.label>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3 font-[var(--font-yekan)] flex items-center gap-2">
                  <FiZap className="text-amber-500" />
                  دسته‌بندی‌ها
                </h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <motion.button
                      key={category.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all font-[var(--font-yekan)] text-right ${
                        filterState.categories.includes(category.name)
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg'
                          : 'bg-amber-50 text-gray-700 hover:bg-amber-100 hover:text-amber-700 border border-amber-200'
                      }`}
                      onClick={() => handleFilterChange('categories', category.name)}
                    >
                      <span className="text-sm">{category.name}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        filterState.categories.includes(category.name) ? 'bg-white/20 text-white' : 'bg-amber-200 text-amber-700'
                      }`}>
                        {category.count}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3 font-[var(--font-yekan)] flex items-center gap-2">
                  <FiAward className="text-amber-500" />
                  برندها
                </h4>
                <div className="space-y-2">
                  {brands.map((brand) => (
                    <motion.label
                      key={brand.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-3 cursor-pointer group p-3 rounded-xl border border-amber-200 hover:bg-amber-50 transition-all"
                    >
                      <input 
                        type="checkbox" 
                        checked={filterState.brands.includes(brand.name)}
                        onChange={() => handleFilterChange('brands', brand.name)}
                        className="rounded border-amber-300 text-amber-600 focus:ring-amber-500 w-4 h-4" 
                      />
                      <span className="text-sm text-gray-600 group-hover:text-amber-700 transition-colors font-[var(--font-yekan)] flex-1">
                        {brand.name}
                      </span>
                      <span className="text-xs bg-amber-200 text-amber-700 px-2 py-1 rounded-full">
                        {brand.count}
                      </span>
                    </motion.label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3 font-[var(--font-yekan)] flex items-center gap-2">
                  <FiAward className="text-amber-500" />
                  محدوده قیمت
                </h4>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <motion.label
                      key={range.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-3 cursor-pointer group p-3 rounded-xl border border-amber-200 hover:bg-amber-50 transition-all"
                    >
                      <input 
                        type="checkbox" 
                        checked={filterState.priceRanges.includes(range.value)}
                        onChange={() => handleFilterChange('priceRanges', range.value)}
                        className="rounded border-amber-300 text-amber-600 focus:ring-amber-500 w-4 h-4" 
                      />
                      <span className="text-sm text-gray-600 group-hover:text-amber-700 transition-colors font-[var(--font-yekan)] flex-1">
                        {range.label}
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
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-2xl p-4 flex items-center justify-between shadow-lg font-[var(--font-yekan)]"
              >
                <div className="flex items-center gap-2">
                  <LuCrown className="text-white" />
                  <span className="font-semibold">فیلترهای ویژه</span>
                </div>
                <FiChevronDown className="text-white" />
              </motion.button>
            </div>

            {/* Consultation Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl shadow-lg border border-emerald-400 p-6 mb-6 relative overflow-hidden"
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
                    <p className="text-emerald-100 font-[var(--font-yekan)] text-sm leading-relaxed">
                      برای دریافت راهنمایی تخصصی در انتخاب محصول، روی دکمه "از من بپرس" کلیک کنید
                    </p>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 bg-white hover:bg-emerald-50 text-emerald-700 px-6 py-3 rounded-xl font-semibold transition-all shadow-lg font-[var(--font-yekan)] whitespace-nowrap"
                >
                  <FiMessageCircle size={18} />
                  <span>از من بپرس</span>
                </motion.button>
              </div>
            </motion.div>

            {/* Products Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link
                    href={`/products/${product.product.slug}`}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-amber-100 overflow-hidden group relative block"
                  >
                    {/* Product Image Section - Without Image */}
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                      <div className="text-center">
                        <LuCrown className="w-12 h-12 text-amber-600 mx-auto mb-2" />
                        <span className="text-amber-700 font-bold font-[var(--font-yekan)] text-lg">{product.product.name}</span>
                        <p className="text-amber-600 text-sm mt-1 font-[var(--font-yekan)]">{product.product.brand}</p>
                      </div>
                      
                      {/* Status Badge */}
                      <div className="absolute top-3 right-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium font-[var(--font-yekan)] shadow-md ${getStatusBadgeStyle(product)}`}>
                          {getStatusText(product)}
                        </span>
                      </div>

                      {/* Premium Badge */}
                      <div className="absolute bottom-3 right-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg flex items-center gap-1">
                        <LuCrown size={10} />
                        <span>پریمیوم</span>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="font-bold text-gray-800 mb-2 text-sm leading-relaxed font-[var(--font-yekan)]">
                        {product.product.name}
                      </h3>
                      
                      {/* Stock Information */}
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          <FiShield className="w-3 h-3 text-green-500" />
                          <span className="text-xs text-gray-500 font-[var(--font-yekan)]">
                            موجودی: {product.product.stock} عدد
                          </span>
                        </div>
                      </div>

                      {/* Positive Feature */}
                      <div className="mb-3">
                        <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium font-[var(--font-yekan)] border border-green-200">
                          {getPositiveFeature(product)}
                        </span>
                      </div>

                      {/* Product Features */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {getProductFeatures(product).map((feature, idx) => (
                          <span key={idx} className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-full border border-amber-200">
                            {feature}
                          </span>
                        ))}
                      </div>

                      {/* Price and Actions */}
                      <div className="space-y-3 mt-4">
                        {/* Price Section */}
                        <div className="flex flex-col gap-1">
                          {product.product.priceAfterDiscount && product.product.priceAfterDiscount < product.product.price && (
                            <span className="text-sm text-gray-500 line-through font-[var(--font-yekan)]">
                              {formatPrice(product.product.price)}
                            </span>
                          )}
                          <span className={`font-bold text-amber-700 font-[var(--font-yekan)] text-xl`}>
                            {formatPrice(product.product.priceAfterDiscount || product.product.price)}
                          </span>
                        </div>

                        {/* Buttons Section */}
                        <div className="flex flex-col gap-2">
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
                <div className="bg-white rounded-2xl shadow-lg border border-amber-200 p-8 max-w-md mx-auto">
                  <LuCrown className="w-16 h-16 text-amber-400 mx-auto mb-4" />
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

      {/* Mobile Filters Modal */}
      <AnimatePresence>
        {showMobileFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-24"
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl overflow-y-auto max-h-[80vh]"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold font-[var(--font-yekan)]">فیلترهای ویژه</h3>
                <button onClick={() => setShowMobileFilters(false)} className="p-2 text-gray-600 hover:text-amber-600 rounded-full">
                  <FiX size={24} />
                </button>
              </div>

              {/* Special Filters */}
              <FilterSection title="فیلترهای ویژه" filterKey="special">
                <div className="space-y-2">
                  {[
                    { key: 'economicChoice', label: 'بهترین انتخاب اقتصادی' },
                    { key: 'bestValue', label: 'بیشترین ارزش' },
                    { key: 'topSelling', label: 'پرفروش' },
                    { key: 'freeShipping', label: 'ارسال رایگان' }
                  ].map((filter) => (
                    <label key={filter.key} className="flex items-center gap-3 p-3 rounded-xl border border-amber-200 hover:bg-amber-50 cursor-pointer font-[var(--font-yekan)]">
                      <input 
                        type="checkbox" 
                        checked={filterState.specialFilters.includes(filter.key)}
                        onChange={() => handleFilterChange('specialFilters', filter.key)}
                        className="w-4 h-4 text-amber-600 focus:ring-amber-500 rounded" 
                      />
                      <span className="flex-1">{filter.label}</span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              <FilterSection title="دسته‌بندی‌ها" filterKey="category">
                <div className="space-y-2">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all font-[var(--font-yekan)] text-right ${
                        filterState.categories.includes(category.name)
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg'
                          : 'bg-amber-50 text-gray-700 hover:bg-amber-100 hover:text-amber-700 border border-amber-200'
                      }`}
                      onClick={() => handleFilterChange('categories', category.name)}
                    >
                      <span className="text-sm">{category.name}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        filterState.categories.includes(category.name) ? 'bg-white/20 text-white' : 'bg-amber-200 text-amber-700'
                      }`}>
                        {category.count}
                      </span>
                    </button>
                  ))}
                </div>
              </FilterSection>

              <FilterSection title="برندها" filterKey="brands">
                <div className="space-y-2">
                  {brands.map(brand => (
                    <label key={brand.id} className="flex items-center justify-between p-3 rounded-xl border border-amber-200 hover:bg-amber-50 cursor-pointer font-[var(--font-yekan)]">
                      <input 
                        type="checkbox" 
                        checked={filterState.brands.includes(brand.name)}
                        onChange={() => handleFilterChange('brands', brand.name)}
                        className="w-4 h-4 text-amber-600 focus:ring-amber-500 rounded" 
                      />
                      <span className="flex-1 text-right">{brand.name}</span>
                      <span className="text-xs bg-amber-200 text-amber-700 px-2 py-1 rounded-full">
                        {brand.count}
                      </span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              <FilterSection title="محدوده قیمت" filterKey="price">
                <div className="space-y-2">
                  {priceRanges.map(range => (
                    <label key={range.id} className="flex items-center gap-3 p-3 rounded-xl border border-amber-200 hover:bg-amber-50 cursor-pointer font-[var(--font-yekan)]">
                      <input 
                        type="checkbox" 
                        checked={filterState.priceRanges.includes(range.value)}
                        onChange={() => handleFilterChange('priceRanges', range.value)}
                        className="w-4 h-4 text-amber-600 focus:ring-amber-500" 
                      />
                      <span className="flex-1">{range.label}</span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold font-[var(--font-yekan)] shadow-lg"
                onClick={() => setShowMobileFilters(false)}
              >
                اعمال فیلترها
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}