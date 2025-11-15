"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { FiFilter, FiStar, FiShoppingCart, FiHeart, FiChevronDown, FiX, FiMessageCircle, FiAward, FiZap, FiClock, FiShield } from "react-icons/fi";
import { LuCrown } from "react-icons/lu";

interface PremiumProduct {
  id: number;
  name: string;
  price: string;
  originalPrice?: string;
  image: string;
  category: string;
  badge: string;
  rating: number;
  reviews: number;
  isPrime: boolean;
  discount: number;
  isPremium: boolean;
  features: string[];
  timeLeft: string;
  soldCount: number;
  type: string;
}

interface Category {
  id: number;
  name: string;
  count: number;
  active: boolean;
}

interface PriceRange {
  id: number;
  label: string;
  value: string;
}

interface Filters {
  levels: string[];
  priceRanges: PriceRange[];
  features: string[];
}

export default function ValuablePurchasesPage() {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [expandedFilter, setExpandedFilter] = useState<string | null>(null);
  const [valuableProducts, setValuableProducts] = useState<PremiumProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filters, setFilters] = useState<Filters>({ levels: [], priceRanges: [], features: [] });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const response = await fetch('https://6810ff2827f2fdac24139dec.mockapi.io/Product'); // API خودت
        const data: PremiumProduct[] = await response.json();

        const premiumProducts = data.filter(p => p.isPremium);
        setValuableProducts(premiumProducts);

        const cats: Category[] = Array.from(new Set(premiumProducts.map(p => p.category))).map((c, idx) => ({
          id: idx,
          name: c,
          count: premiumProducts.filter(p => p.category === c).length,
          active: false,
        }));
        setCategories(cats);

        setFilters({
          levels: ['معمولی', 'ویژه', 'پریمیوم'],
          priceRanges: [
            { id: 1, label: '0-100', value: '0-100' },
            { id: 2, label: '100-500', value: '100-500' },
            { id: 3, label: '500+', value: '500+' },
          ],
          features: ['ارگانیک', 'فاقد کافئین', 'برشته‌کاری ویژه']
        });
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

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
                  <span className="font-bold text-amber-700">{valuableProducts.length} قلم</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2 font-[var(--font-yekan)]">
                  <span className="text-gray-700">میانگین امتیاز:</span>
                  <span className="font-bold text-amber-700">
                    {valuableProducts.length > 0 
                      ? (valuableProducts.reduce((acc, product) => acc + product.rating, 0) / valuableProducts.length).toFixed(1)
                      : '0.0'
                    } از ۵
                  </span>
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3 font-[var(--font-yekan)] flex items-center gap-2">
                  <FiZap className="text-amber-500" />
                  دسته‌بندی‌ها
                </h4>
                <div className="space-y-2">
                  {categories.map((category, index) => (
                    <motion.button
                      key={category.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all font-[var(--font-yekan)] text-right ${
                        category.active
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg'
                          : 'bg-amber-50 text-gray-700 hover:bg-amber-100 hover:text-amber-700'
                      }`}
                    >
                      <span className="text-sm">{category.name}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${category.active ? 'bg-white/20 text-white' : 'bg-amber-200 text-amber-700'}`}>
                        {category.count}
                      </span>
                    </motion.button>
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
                  {filters.priceRanges.map((range, index) => (
                    <motion.label
                      key={range.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-amber-50"
                    >
                      <input type="radio" name="price" className="text-amber-600 focus:ring-amber-500 w-4 h-4" />
                      <span className="text-sm text-gray-600 group-hover:text-amber-700 transition-colors font-[var(--font-yekan)]">{range.label}</span>
                    </motion.label>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-3 font-[var(--font-yekan)] flex items-center gap-2">
                  <FiShield className="text-amber-500" />
                  ویژگی‌های ویژه
                </h4>
                <div className="space-y-2">
                  {filters.features.map((feature, index) => (
                    <motion.label
                      key={feature}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-amber-50"
                    >
                      <input type="checkbox" className="rounded border-amber-300 text-amber-600 focus:ring-amber-500 w-4 h-4" />
                      <span className="text-sm text-gray-600 group-hover:text-amber-700 transition-colors font-[var(--font-yekan)]">{feature}</span>
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
                      نیاز به مشاوره تخصصی دارید؟
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
              {valuableProducts.map((product, index) => (
                <Link
                  key={product.id}
                  href={`/CoffeeCategoryPage/${product.id}`}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-amber-200 overflow-hidden group relative block"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    {/* Product Image */}
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {product.discount > 0 && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg">{product.discount}% تخفیف</div>
                      )}
                      {product.isPremium && (
                        <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg flex items-center gap-1">
                          <LuCrown size={10} />
                          <span>پریمیوم</span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <div className="flex flex-wrap gap-1 mb-3">
                        {product.features.slice(0, 2).map((feature, idx) => (
                          <span key={idx} className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-full border border-amber-200">{feature}</span>
                        ))}
                      </div>

                      <h3 className="font-bold text-gray-800 mb-3 text-sm leading-relaxed font-[var(--font-yekan)] min-h-[3rem]">{product.name}</h3>

                      <div className="flex items-center justify-between pt-3 border-t border-amber-200">
                        <div className="flex flex-col">
                          <span className="text-lg font-bold text-amber-700 font-[var(--font-yekan)]">{product.price}</span>
                          {product.originalPrice && (
                            <span className="text-sm text-gray-500 line-through font-[var(--font-yekan)]">{product.originalPrice}</span>
                          )}
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-lg font-[var(--font-yekan)] flex items-center gap-2"
                        >
                          <FiShoppingCart size={16} />
                          <span>خرید</span>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </motion.div>
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
                <h3 className="text-lg font-bold font-[var(--font-yekan)]">فیلترها</h3>
                <button onClick={() => setShowMobileFilters(false)} className="p-2 text-gray-600 hover:text-amber-600 rounded-full">
                  <FiX size={24} />
                </button>
              </div>

              {/* Filters */}
              <FilterSection title="دسته‌بندی‌ها" filterKey="category">
                <div className="space-y-2">
                  {categories.map(category => (
                    <label key={category.id} className="flex items-center justify-between p-3 rounded-xl border hover:bg-amber-50 cursor-pointer font-[var(--font-yekan)]">
                      <span>{category.name}</span>
                      <span className="text-sm bg-amber-200 text-amber-700 px-2 py-1 rounded-full">{category.count}</span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              <FilterSection title="محدوده قیمت" filterKey="price">
                <div className="space-y-2">
                  {filters.priceRanges.map(range => (
                    <label key={range.id} className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-amber-50 font-[var(--font-yekan)]">
                      <input type="radio" name="price" className="w-4 h-4 text-amber-600 focus:ring-amber-500" />
                      <span>{range.label}</span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              <FilterSection title="ویژگی‌ها" filterKey="features">
                <div className="space-y-2">
                  {filters.features.map(feature => (
                    <label key={feature} className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-amber-50 font-[var(--font-yekan)]">
                      <input type="checkbox" className="w-4 h-4 text-amber-600 focus:ring-amber-500 rounded" />
                      <span>{feature}</span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold font-[var(--font-yekan)] shadow-lg"
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
