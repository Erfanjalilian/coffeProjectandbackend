"use client";

import { useAuth } from "@/contaxt/AuthContext";
import UserProfileSidebarD from "@/app/Components/userProfileSidebarD";
import { motion, AnimatePresence } from "framer-motion";
import { FiCoffee, FiUser, FiHeart, FiMapPin, FiCreditCard, FiMessageCircle, FiEdit, FiShield, FiTruck, FiMenu, FiX, FiSettings, FiPackage, FiClock, FiCheckCircle, FiTruck as FiShipping, FiHome, FiTrash2, FiShoppingCart, FiStar } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Types for favorite products
interface FavoriteProduct {
  _id: string;
  name: string;
  price: number;
  priceAfterDiscount: number;
  originalPrice?: number;
  image: string;
  brand?: string;
  rating: number;
  positiveFeature: string;
  addedAt: string;
}

const FAVORITES_STORAGE_KEY = "user_favorites";

// Utility functions for favorites
const getFavoritesFromStorage = (): FavoriteProduct[] => {
  if (typeof window === "undefined") return [];
  try {
    const favorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error("Error reading favorites from localStorage:", error);
    return [];
  }
};

// 🔥 UPDATED: Dispatch event when favorites are removed
const removeFromFavorites = (productId: string): FavoriteProduct[] => {
  const favorites = getFavoritesFromStorage();
  const updatedFavorites = favorites.filter(fav => fav._id !== productId);
  
  // Save to localStorage
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updatedFavorites));
  
  // 🔥 ADDED: Dispatch event to notify header and other components
  window.dispatchEvent(new Event('favoritesUpdated'));
  
  return updatedFavorites;
};

export default function FavoritesPage() {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removeMessage, setRemoveMessage] = useState<string>('');

  // Check authentication on component mount
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    } else if (!isLoading && isAuthenticated) {
      setIsCheckingAuth(false);
      loadFavorites();
    }
  }, [isAuthenticated, isLoading, router]);

  // Load favorites from localStorage
  const loadFavorites = () => {
    try {
      setIsLoadingFavorites(true);
      setError(null);
      const userFavorites = getFavoritesFromStorage();
      setFavorites(userFavorites);
    } catch (err) {
      setError('خطا در بارگذاری علاقه‌مندی‌ها');
      console.error('Error loading favorites:', err);
    } finally {
      setIsLoadingFavorites(false);
    }
  };

  // Remove product from favorites
  const handleRemoveFavorite = (productId: string, productName: string) => {
    const updatedFavorites = removeFromFavorites(productId);
    setFavorites(updatedFavorites);
    setRemoveMessage(`"${productName}" از علاقه‌مندی‌ها حذف شد`);
    setTimeout(() => setRemoveMessage(''), 3000);
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [router]);

  // Listen for favorites updates from other components (like product page)
  useEffect(() => {
    const handleFavoritesUpdate = () => {
      loadFavorites(); // Reload favorites when they're updated elsewhere
    };

    window.addEventListener('favoritesUpdated', handleFavoritesUpdate);
    
    return () => {
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
    };
  }, []);

  // Format price to Persian currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  // Calculate discount percentage
  const calculateDiscount = (originalPrice: number, currentPrice: number) => {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  // Get user's display name for sidebar
  const getUserWelcomeName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.phone || "کاربر";
  };

  // Show loading while checking authentication
  if (isLoading || isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center" dir="rtl">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-[var(--font-yekan)]">در حال بارگذاری...</p>
        </motion.div>
      </div>
    );
  }

  // If not authenticated, don't render anything (will redirect in useEffect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 pt-44 pb-12" dir="rtl">
      {/* Remove Success Message */}
      <AnimatePresence>
        {removeMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg font-[var(--font-yekan)] flex items-center gap-2">
              <FiHeart className="text-white" />
              <span>{removeMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Menu Button */}
        <div className="lg:hidden fixed top-24 right-4 z-40">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMobileMenuOpen(true)}
            className="bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3 px-4 rounded-xl shadow-lg flex items-center gap-2 font-[var(--font-yekan)]"
          >
            <FiSettings size={18} />
            <span>منوی کاربری</span>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-80 max-w-full bg-white z-50 lg:hidden shadow-2xl"
              dir="rtl"
            >
              <UserProfileSidebarD
                userName={getUserWelcomeName()}
                userRole={user?.roles?.[0]}
                onLogout={logout}
                activePage="favorites"
                isMobile={true}
                onNavigate={() => setIsMobileMenuOpen(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2 font-[var(--font-yekan)] text-center lg:text-right">
            علاقه‌مندی‌های من
          </h1>
          <p className="text-gray-600 font-[var(--font-yekan)] text-center lg:text-right">
            مدیریت محصولات مورد علاقه شما
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Hidden on mobile */}
          <div className="hidden lg:block lg:col-span-1">
            <UserProfileSidebarD
              userName={getUserWelcomeName()}
              userRole={user?.roles?.[0]}
              onLogout={logout}
              activePage="favorites"
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* Favorites List */}
              <div className="bg-white rounded-2xl shadow-lg border border-amber-200 overflow-hidden">
                <div className="p-6 border-b border-amber-200">
                  <h2 className="text-xl font-bold text-gray-800 font-[var(--font-yekan)] flex items-center gap-2">
                    <FiHeart className="text-amber-600" />
                    لیست علاقه‌مندی‌ها
                  </h2>
                  <p className="text-gray-500 text-sm mt-1 font-[var(--font-yekan)]">
                    نمایش {favorites.length} محصول از علاقه‌مندی‌های شما
                  </p>
                </div>

                {isLoadingFavorites ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-[var(--font-yekan)]">در حال بارگذاری علاقه‌مندی‌ها...</p>
                  </div>
                ) : error ? (
                  <div className="p-8 text-center">
                    <FiHeart className="text-gray-300 text-4xl mx-auto mb-3" />
                    <p className="text-gray-600 font-[var(--font-yekan)] mb-4">{error}</p>
                    <button
                      onClick={loadFavorites}
                      className="bg-amber-600 hover:bg-amber-700 text-white py-2 px-6 rounded-xl font-[var(--font-yekan)] transition-colors"
                    >
                      تلاش مجدد
                    </button>
                  </div>
                ) : favorites.length === 0 ? (
                  <div className="p-8 text-center">
                    <FiHeart className="text-gray-300 text-4xl mx-auto mb-3" />
                    <p className="text-gray-600 font-[var(--font-yekan)] mb-2">هنوز محصولی به علاقه‌مندی‌ها اضافه نکرده‌اید</p>
                    <p className="text-gray-500 text-sm mb-4 font-[var(--font-yekan)]">
                      با افزودن محصولات به علاقه‌مندی‌ها، آن‌ها را برای بعد ذخیره کنید
                    </p>
                    <Link href="/CoffeeCategoryPage">
                      <button className="bg-amber-600 hover:bg-amber-700 text-white py-2 px-6 rounded-xl font-[var(--font-yekan)] transition-colors">
                        مشاهده محصولات
                      </button>
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-amber-100">
                    {favorites.map((product, index) => {
                      const hasDiscount = product.originalPrice && product.originalPrice > product.priceAfterDiscount;
                      const discountPercentage = hasDiscount ? 
                        calculateDiscount(product.originalPrice!, product.priceAfterDiscount) : 0;
                      
                      return (
                        <motion.div
                          key={product._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-6 hover:bg-amber-50 transition-colors"
                        >
                          <div className="flex flex-col lg:flex-row gap-6">
                            {/* Product Image */}
                            <div className="flex-shrink-0">
                              <div className="relative w-24 h-24 lg:w-32 lg:h-32 rounded-xl overflow-hidden bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                                <FiCoffee className="text-amber-400 text-2xl" />
                                {hasDiscount && (
                                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                                    {discountPercentage}%
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Product Info */}
                            <div className="flex-1">
                              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                <div className="flex-1">
                                  <h3 className="text-lg font-bold text-gray-800 mb-2 font-[var(--font-yekan)]">
                                    {product.name}
                                  </h3>
                                  
                                  <div className="flex items-center gap-4 mb-3">
                                    {product.brand && (
                                      <span className="text-sm text-gray-600 font-[var(--font-yekan)]">
                                        برند: <span className="font-semibold text-amber-700">{product.brand}</span>
                                      </span>
                                    )}
                                    <div className="flex items-center gap-1">
                                      {[...Array(5)].map((_, i) => (
                                        <FiStar
                                          key={i}
                                          className={`w-4 h-4 ${
                                            i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
                                          }`}
                                        />
                                      ))}
                                      <span className="text-sm text-gray-500 font-[var(--font-yekan)]">
                                        ({product.rating.toFixed(1)})
                                      </span>
                                    </div>
                                  </div>

                                  <div className="mb-3">
                                    <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium font-[var(--font-yekan)] border border-green-200">
                                      {product.positiveFeature}
                                    </span>
                                  </div>

                                  {/* Price Section */}
                                  <div className="flex items-center gap-3">
                                    <span className="text-xl font-bold text-amber-700 font-[var(--font-yekan)]">
                                      {formatPrice(product.priceAfterDiscount)}
                                    </span>
                                    {hasDiscount && (
                                      <span className="text-lg text-gray-500 line-through font-[var(--font-yekan)]">
                                        {formatPrice(product.originalPrice!)}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-3">
                                  <div className="flex gap-2">
                                    <Link href={`/CoffeeCategoryPage/${product._id}`}>
                                      <button className="bg-amber-100 hover:bg-amber-200 text-amber-700 py-2 px-4 rounded-lg font-[var(--font-yekan)] text-sm transition-colors whitespace-nowrap">
                                        مشاهده محصول
                                      </button>
                                    </Link>
                                    <button 
                                      onClick={() => handleRemoveFavorite(product._id, product.name)}
                                      className="bg-red-100 hover:bg-red-200 text-red-700 py-2 px-4 rounded-lg font-[var(--font-yekan)] text-sm transition-colors flex items-center gap-2"
                                    >
                                      <FiTrash2 size={14} />
                                      حذف
                                    </button>
                                  </div>
                                  
                                
                                </div>
                              </div>

                              {/* Added Date */}
                              <div className="mt-4 pt-4 border-t border-amber-100">
                                <p className="text-sm text-gray-500 font-[var(--font-yekan)]">
                                  افزوده شده در: {new Date(product.addedAt).toLocaleDateString('fa-IR')}
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-2xl shadow-lg border border-amber-200 p-6 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-amber-100 p-2 rounded-full">
                      <FiCoffee className="text-amber-600 text-lg" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 font-[var(--font-yekan)]">
                      ادامه خرید
                    </h3>
                  </div>
                  <p className="text-gray-600 font-[var(--font-yekan)] text-sm mb-4">
                    از محصولات جدید و ویژه ما دیدن کنید
                  </p>
                  <Link href="/CoffeeCategoryPage">
                    <button className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-xl font-[var(--font-yekan)] font-semibold transition-colors">
                      مشاهده محصولات
                    </button>
                  </Link>
                </motion.div>

                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-2xl shadow-lg border border-amber-200 p-6 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-amber-100 p-2 rounded-full">
                      <FiMessageCircle className="text-amber-600 text-lg" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 font-[var(--font-yekan)]">
                      پشتیبانی
                    </h3>
                  </div>
                  <p className="text-gray-600 font-[var(--font-yekan)] text-sm mb-4">
                    در صورت وجود مشکل در سفارش با ما تماس بگیرید
                  </p>
                  <Link href="/support">
                    <button className="w-full bg-amber-100 hover:bg-amber-200 text-amber-700 py-2 rounded-xl font-[var(--font-yekan)] font-semibold transition-colors">
                      تماس با پشتیبانی
                    </button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}