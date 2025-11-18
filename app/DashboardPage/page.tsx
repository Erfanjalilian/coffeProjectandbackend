"use client";

import { useAuth } from "@/contaxt/AuthContext";
import UserProfileSidebarD from "@/app/Components/userProfileSidebarD";
import { motion, AnimatePresence } from "framer-motion";
import { FiCoffee, FiUser, FiHeart, FiMapPin, FiCreditCard, FiMessageCircle, FiEdit, FiShield, FiTruck, FiMenu, FiX, FiSettings } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardPage() {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check authentication on component mount
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    } else if (!isLoading) {
      setIsCheckingAuth(false);
    }
  }, [isAuthenticated, isLoading, router]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [router]);

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

  // Get user's display name for personal information section
  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return "نام کامل وارد نشده";
  };

  // Get user's display name for welcome message and sidebar (can show phone number)
  const getUserWelcomeName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.phone || "کاربر";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 pt-44 pb-12" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Menu Button - Only visible on mobile - Different from header menu */}
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

        {/* Mobile Menu - No Backdrop */}
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
                activePage="dashboard"
                isMobile={true}
                onNavigate={() => setIsMobileMenuOpen(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header Section - Amazon Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2 font-[var(--font-yekan)] text-center lg:text-right">
            حساب کاربری
          </h1>
          <p className="text-gray-600 font-[var(--font-yekan)] text-center lg:text-right">
            مدیریت اطلاعات شخصی و تنظیمات حساب شما
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Left Side (1/4 width) - Hidden on mobile */}
          <div className="hidden lg:block lg:col-span-1">
            <UserProfileSidebarD
              userName={getUserWelcomeName()}
              userRole={user?.roles?.[0]}
              onLogout={logout}
              activePage="dashboard"
            />
          </div>

          {/* Main Content - Right Side (3/4 width) - Amazon Style */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* Welcome Card - Amazon Style Header */}
              <div className="bg-white rounded-2xl shadow-lg border border-amber-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800 font-[var(--font-yekan)]">
                    خوش آمدید، {getUserWelcomeName()}!
                  </h2>
                  <div className="bg-amber-100 p-2 rounded-full">
                    <FiCoffee className="text-amber-600 text-xl" />
                  </div>
                </div>
                
                {/* AI Assistant Message */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
                  <div className="flex items-start gap-3">
                    <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-2 rounded-full">
                      <FiMessageCircle size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-700 font-[var(--font-yekan)] text-sm leading-relaxed">
                        <span className="font-semibold text-amber-700">دستیار هوش مصنوعی:</span>
                        <br />
                        به پنل کاربری خود خوش آمدید! من اینجام تا به شما در کشف بهترین قهوه‌ها و مدیریت حساب‌تون کمک کنم. 
                        از طریق منوی کناری می‌تونید به تمام بخش‌های حساب کاربری دسترسی داشته باشید.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Overview - Amazon Style Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information Card */}
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-2xl shadow-lg border border-amber-200 p-6 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-amber-100 p-2 rounded-full">
                      <FiUser className="text-amber-600 text-lg" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 font-[var(--font-yekan)]">
                      اطلاعات شخصی
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-amber-100">
                      <span className="text-gray-600 font-[var(--font-yekan)] text-sm">نام کامل:</span>
                      <span className="text-gray-800 font-[var(--font-yekan)] font-semibold">
                        {getUserDisplayName()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-amber-100">
                      <span className="text-gray-600 font-[var(--font-yekan)] text-sm">نام کاربری:</span>
                      <span className="text-gray-800 font-[var(--font-yekan)] font-semibold">
                        {user?.username || "نام کاربری وارد نشده"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600 font-[var(--font-yekan)] text-sm">عضویت از:</span>
                      <span className="text-gray-800 font-[var(--font-yekan)] text-sm">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fa-IR') : '---'}
                      </span>
                    </div>
                  </div>
                  <Link href="/DashboardPage/profile">
                    <button className="w-full mt-4 bg-amber-100 hover:bg-amber-200 text-amber-700 py-2 rounded-xl font-[var(--font-yekan)] font-semibold transition-colors flex items-center justify-center gap-2">
                      <FiEdit size={16} />
                      ویرایش اطلاعات
                    </button>
                  </Link>
                </motion.div>

                {/* Quick Actions Card */}
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-2xl shadow-lg border border-amber-200 p-6 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-amber-100 p-2 rounded-full">
                      <FiTruck className="text-amber-600 text-lg" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 font-[var(--font-yekan)]">
                      دسترسی سریع
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <Link href="/dashboard/orders">
                      <button className="w-full text-right py-3 px-4 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors font-[var(--font-yekan)] text-gray-700 flex items-center justify-between">
                        <span>سفارش‌های اخیر</span>
                        <div className="bg-amber-200 text-amber-700 text-xs px-2 py-1 rounded-full">۰</div>
                      </button>
                    </Link>
                    <Link href="/dashboard/track-order">
                      <button className="w-full text-right py-3 px-4 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors font-[var(--font-yekan)] text-gray-700 flex items-center justify-between">
                        <span>پیگیری سفارش</span>
                        <FiTruck className="text-amber-600" />
                      </button>
                    </Link>
                    <Link href="/dashboard/support">
                      <button className="w-full text-right py-3 px-4 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors font-[var(--font-yekan)] text-gray-700 flex items-center justify-between">
                        <span>پشتیبانی آنلاین</span>
                        <FiMessageCircle className="text-amber-600" />
                      </button>
                    </Link>
                  </div>
                </motion.div>
              </div>

              {/* Features Grid - Amazon Style */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Favorites Card */}
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-2xl shadow-lg border border-amber-200 p-6 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-amber-100 p-2 rounded-full">
                      <FiHeart className="text-amber-600 text-lg" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 font-[var(--font-yekan)]">
                      علاقه‌مندی‌ها
                    </h3>
                  </div>
                  <div className="text-center py-8">
                    <FiHeart className="text-gray-300 text-4xl mx-auto mb-3" />
                    <p className="text-gray-500 font-[var(--font-yekan)] text-sm">
                      هیچ محصولی در لیست علاقه‌مندی‌های شما نیست
                    </p>
                    <Link href="/products">
                      <button className="mt-4 text-amber-600 hover:text-amber-700 font-[var(--font-yekan)] text-sm font-semibold">
                        کشف محصولات →
                      </button>
                    </Link>
                  </div>
                </motion.div>

                {/* Addresses Card */}
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-2xl shadow-lg border border-amber-200 p-6 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-amber-100 p-2 rounded-full">
                      <FiMapPin className="text-amber-600 text-lg" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 font-[var(--font-yekan)]">
                      آدرس‌های من
                    </h3>
                  </div>
                  <div className="text-center py-8">
                    <FiMapPin className="text-gray-300 text-4xl mx-auto mb-3" />
                    <p className="text-gray-500 font-[var(--font-yekan)] text-sm">
                      هیچ آدرسی ثبت نشده است
                    </p>
                    <Link href="/DashboardPage/addresses">
                      <button className="mt-4 text-amber-600 hover:text-amber-700 font-[var(--font-yekan)] text-sm font-semibold">
                        افزودن آدرس جدید →
                      </button>
                    </Link>
                  </div>
                </motion.div>

                {/* Bank Accounts Card */}
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-2xl shadow-lg border border-amber-200 p-6 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-amber-100 p-2 rounded-full">
                      <FiCreditCard className="text-amber-600 text-lg" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 font-[var(--font-yekan)]">
                      حساب‌های بانکی
                    </h3>
                  </div>
                  <div className="text-center py-8">
                    <FiCreditCard className="text-gray-300 text-4xl mx-auto mb-3" />
                    <p className="text-gray-500 font-[var(--font-yekan)] text-sm">
                      هیچ حساب بانکی ثبت نشده است
                    </p>
                    <Link href="/DashboardPage/BankAccountsPage">
                      <button className="mt-4 text-amber-600 hover:text-amber-700 font-[var(--font-yekan)] text-sm font-semibold">
                        افزودن حساب بانکی →
                      </button>
                    </Link>
                  </div>
                </motion.div>
              </div>

              {/* AI Recommendation Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-2xl p-6 text-white"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-3 rounded-full">
                    <FiMessageCircle size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-[var(--font-yekan)] mb-2">
                      پیشنهاد هوش مصنوعی برای شما
                    </h3>
                    <p className="text-amber-100 font-[var(--font-yekan)] text-sm">
                      بر اساس سلیقه شما، قهوه‌های اسپشیالتی جدیدی رو پیشنهاد می‌کنم که ممکنه دوست داشته باشید!
                    </p>
                    <Link href="/products?recommended=true">
                      <button className="mt-3 bg-white text-amber-700 hover:bg-amber-50 py-2 px-6 rounded-xl font-[var(--font-yekan)] font-semibold transition-colors">
                        مشاهده پیشنهادات
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}