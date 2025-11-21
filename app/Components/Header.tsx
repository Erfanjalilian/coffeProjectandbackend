"use client";

import { useState, useEffect, useRef } from "react";
import {
  FiShoppingCart,
  FiUser,
  FiChevronDown,
  FiSearch,
  FiGlobe,
  FiMenu,
  FiX,
  FiHeart,
  FiHome,
  FiTag,
  FiCoffee,
  FiTool,
  FiBook,
  FiTruck,
  FiHelpCircle,
  FiStar,
  FiLogOut,
  FiSettings,
} from "react-icons/fi";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/contaxt/CartContext";
import { useAuth } from "@/contaxt/AuthContext";

// Define types for navigation items
interface NavItem {
  name: string;
  icon: React.ComponentType<{ size?: number }>;
  href: string;
}

export default function Header() {
  const [isLangOpen, setIsLangOpen] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
  
  const { cart } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  // Refs for dropdown positioning
  const langButtonRef = useRef<any>(null);
  const userButtonRef = useRef<any>(null);

  // محاسبه تعداد کل آیتم‌های سبد خرید
  const totalItems: number = cart.reduce((total: number, product) => total + product.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const headerClass: string = `w-full fixed top-0 z-40 transition-all duration-500 ${
    isScrolled
      ? "bg-white/95 backdrop-blur-lg shadow-lg shadow-amber-100/50"
      : "bg-gradient-to-b from-white to-amber-50/80 backdrop-blur-sm"
  }`;

  const navItems: NavItem[] = [
    { name: "صفحه اصلی", icon: FiHome, href: "/" },
    { name: "دسته‌بندی کالا ها", icon: FiCoffee, href: "/CoffeeCategoryPage" },
    { name: "تخفیف‌های امروز", icon: FiTag, href: "/SpecialDiscountsPage" },
    { name: "خرید با ارزش", icon: FiStar, href: "/ValuablePurchasesPage" },
    { name: "فروشنده باش", icon: FiTool, href: "/BecomeSellerPage" },
  ];

  const mobileAdditionalItems: NavItem[] = [
    { name: "فروشنده شوید", icon: FiUser, href: "/BecomeSellerPage" },
    { name: "پشتیبانی", icon: FiHelpCircle, href: "/support" },
    { name: "درباره ما", icon: FiHelpCircle, href: "/about" },
    { name: "تماس با ما", icon: FiHelpCircle, href: "/contact" },
    { name: "وبلاگ", icon: FiBook, href: "/blog" },
  ];

  // تابع برای گرفتن نام نمایشی کاربر
  const getUserDisplayName = (): string => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.username || user?.phone || "کاربر";
  };

  // Calculate dropdown position based on button position
  const getDropdownPosition = (buttonRef: React.RefObject<HTMLButtonElement>) => {
    if (!buttonRef.current) return { top: 0, right: 0 };
    
    const rect = buttonRef.current.getBoundingClientRect();
    return {
      top: rect.bottom + 8, // 8px below the button
      right: window.innerWidth - rect.right, // align with button right edge
    };
  };

  return (
    <>
      {/* Header */}
      <header className={headerClass}>
        {/* --- Top Bar --- */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full flex justify-between items-center px-4 sm:px-8 py-4 border-b border-amber-200/50"
        >
          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(true)}
            className="md:hidden text-gray-700 hover:text-amber-700 p-2 rounded-lg hover:bg-amber-50 transition-colors"
          >
            <FiMenu size={24} />
          </motion.button>

          {/* Logo */}
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 cursor-pointer"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-br from-amber-600 to-amber-700 text-white w-12 h-12 flex items-center justify-center rounded-2xl font-bold text-xl shadow-lg shadow-amber-600/25"
              >
                آی
              </motion.div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-gray-800 font-[var(--font-yekan)] leading-tight">
                  آی‌کسب
                </span>
                <span className="text-xs text-amber-600 font-[var(--font-yekan)] font-medium tracking-tight">
                  فروش با دستیار هوش مصنوعی
                </span>
              </div>
            </motion.div>
          </Link>

          {/* Search Box (hidden on small screens) */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 mx-6 hidden md:flex"
          >
            <div className="relative w-full max-w-xl mx-auto">
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="text"
                placeholder="چه قهوه‌ای دنبالشی؟ مثلا: اسپرسو، فرنچ پرس..."
                className="w-full border-2 border-amber-200 rounded-2xl py-3 px-5 pr-12 text-gray-700 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 bg-white/80 backdrop-blur-sm shadow-lg font-[var(--font-yekan)]"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-amber-600 to-amber-700 text-white p-2 rounded-full shadow-lg"
              >
                <FiSearch size={18} />
              </motion.button>
            </div>
          </motion.div>

          {/* Right Buttons */}
          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <motion.div className="relative hidden sm:block" whileHover={{ scale: 1.05 }}>
              <motion.button
                ref={langButtonRef}
                whileHover={{ backgroundColor: "rgba(245, 158, 11, 0.1)" }}
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-2 text-gray-700 hover:text-amber-700 p-2 rounded-xl transition-colors"
              >
                <FiGlobe size={18} />
                <span className="font-[var(--font-yekan)]">فارسی</span>
                <motion.div animate={{ rotate: isLangOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                  <FiChevronDown size={14} />
                </motion.div>
              </motion.button>
            </motion.div>

            {/* Wishlist */}
            <Link href="/wishlist">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative p-2 text-gray-700 hover:text-amber-700 rounded-xl hover:bg-amber-50 transition-colors"
              >
                <FiHeart size={22} />
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  ۳
                </span>
              </motion.button>
            </Link>

            {/* Cart */}
            <Link href="/CartPage">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative p-2 text-gray-700 hover:text-amber-700 rounded-xl hover:bg-amber-50 transition-colors"
              >
                <FiShoppingCart size={22} />
                {totalItems > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    key={totalItems}
                    className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-600 to-amber-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </motion.button>
            </Link>

            {/* User Section */}
            <motion.div className="relative" whileHover={{ scale: 1.05 }}>
              {isAuthenticated ? (
                // کاربر لاگین کرده - نمایش منوی کاربر
                <>
                  <motion.button
                    ref={userButtonRef}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white py-2 px-4 rounded-2xl shadow-lg shadow-amber-600/25 hover:shadow-amber-600/40 transition-all"
                  >
                    <FiUser size={18} />
                    <span className="font-[var(--font-yekan)] hidden sm:inline">
                      {getUserDisplayName()}
                    </span>
                    <motion.div animate={{ rotate: isUserMenuOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                      <FiChevronDown size={14} />
                    </motion.div>
                  </motion.button>
                </>
              ) : (
                // کاربر لاگین نکرده - نمایش دکمه ورود
                <Link href="/LoginPage">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white py-2 px-4 rounded-2xl shadow-lg shadow-amber-600/25 hover:shadow-amber-600/40 transition-all"
                  >
                    <FiUser size={18} />
                    <span className="font-[var(--font-yekan)] hidden sm:inline">ورود</span>
                  </motion.button>
                </Link>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* --- Bottom Navigation (Desktop) - راست‌چین شده --- */}
        <motion.nav
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="hidden md:flex justify-start items-center px-8 py-3 text-sm font-medium bg-gradient-to-r from-amber-50/50 to-orange-50/50 backdrop-blur-sm border-b border-amber-200/50"
        >
          <div className="flex items-center gap-8 ml-auto">
            {navItems.map((item: NavItem) => (
              <motion.div key={item.name} whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                <Link
                  href={item.href}
                  className="text-gray-700 hover:text-amber-700 font-[var(--font-yekan)] relative group py-2 flex items-center gap-2"
                >
                  <item.icon size={16} />
                  {item.name}
                  <motion.div
                    className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-600 to-amber-700 group-hover:w-full transition-all duration-300"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                  />
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.nav>
      </header>

      {/* Dropdown Menus - POSITIONED RELATIVE TO THEIR BUTTONS */}
      
      {/* Language Dropdown */}
      <AnimatePresence>
        {isLangOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            style={getDropdownPosition(langButtonRef)}
            className="fixed bg-white/95 backdrop-blur-lg shadow-2xl rounded-2xl overflow-hidden border border-amber-200 min-w-[120px] z-50"
          >
            <motion.button
              whileHover={{ backgroundColor: "rgba(245, 158, 11, 0.1)" }}
              className="block w-full px-4 py-3 text-right hover:text-amber-700 font-[var(--font-yekan)] border-b border-amber-100"
              onClick={() => setIsLangOpen(false)}
            >
              فارسی
            </motion.button>
            <motion.button
              whileHover={{ backgroundColor: "rgba(245, 158, 11, 0.1)" }}
              className="block w-full px-4 py-3 text-right hover:text-amber-700"
              onClick={() => setIsLangOpen(false)}
            >
              English
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Menu Dropdown */}
      <AnimatePresence>
        {isUserMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            style={getDropdownPosition(userButtonRef)}
            className="fixed bg-white/95 backdrop-blur-lg shadow-2xl rounded-2xl overflow-hidden border border-amber-200 min-w-[200px] z-50"
          >
            <div className="p-4 border-b border-amber-100">
              <p className="text-gray-800 font-[var(--font-yekan)] font-semibold">
                {getUserDisplayName()}
              </p>
              <p className="text-gray-500 text-sm font-[var(--font-yekan)] mt-1">
                {user?.phone}
              </p>
            </div>
            
            <Link href="/DashboardPage" onClick={() => setIsUserMenuOpen(false)}>
              <motion.button
                whileHover={{ backgroundColor: "rgba(245, 158, 11, 0.1)" }}
                className="block w-full px-4 py-3 text-right hover:text-amber-700 font-[var(--font-yekan)] border-b border-amber-100 flex items-center justify-start gap-3"
              >
                <FiUser size={16} />
                پنل کاربری
              </motion.button>
            </Link>
            
            <Link href="/DashboardPage/profile" onClick={() => setIsUserMenuOpen(false)}>
              <motion.button
                whileHover={{ backgroundColor: "rgba(245, 158, 11, 0.1)" }}
                className="block w-full px-4 py-3 text-right hover:text-amber-700 font-[var(--font-yekan)] border-b border-amber-100 flex items-center justify-start gap-3"
              >
                <FiSettings size={16} />
                ویرایش پروفایل
              </motion.button>
            </Link>
            
            <Link href="/DashboardPage/orders" onClick={() => setIsUserMenuOpen(false)}>
              <motion.button
                whileHover={{ backgroundColor: "rgba(245, 158, 11, 0.1)" }}
                className="block w-full px-4 py-3 text-right hover:text-amber-700 font-[var(--font-yekan)] border-b border-amber-100 flex items-center justify-start gap-3"
              >
                <FiTruck size={16} />
                سفارش‌های من
              </motion.button>
            </Link>
            
            <motion.button
              whileHover={{ backgroundColor: "rgba(239, 68, 68, 0.1)" }}
              onClick={() => {
                logout();
                setIsUserMenuOpen(false);
              }}
              className="block w-full px-4 py-3 text-right text-red-600 hover:text-red-700 font-[var(--font-yekan)] flex items-center justify-start gap-3"
            >
              <FiLogOut size={16} />
              خروج
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] md:hidden"
            />
            
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 w-80 bg-white shadow-2xl z-[70] flex flex-col md:hidden"
            >
              {/* Header */}
              <div className="flex justify-between items-center p-6 pb-4 border-b border-amber-200 bg-white">
                <Link href="/" onClick={() => setIsMenuOpen(false)}>
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-amber-600 to-amber-700 text-white w-10 h-10 flex items-center justify-center rounded-xl font-bold">
                      آی
                    </div>
                    <div className="flex flex-col">
                      <span className="text-lg font-bold text-gray-800 font-[var(--font-yekan)]">آی‌کسب</span>
                      <span className="text-xs text-amber-600 font-[var(--font-yekan)] font-medium">
                        فروش با دستیار هوش مصنوعی
                      </span>
                    </div>
                  </div>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-600 hover:text-amber-700 p-2 rounded-lg hover:bg-amber-100"
                >
                  <FiX size={24} />
                </motion.button>
              </div>

              {/* Search Box */}
              <div className="relative p-6 pb-4 bg-white">
                <input
                  type="text"
                  placeholder="از من بپرس ..."
                  className="w-full border-2 border-amber-200 rounded-2xl py-3 px-4 pr-12 text-gray-700 focus:outline-none focus:border-amber-500 bg-white shadow-lg font-[var(--font-yekan)]"
                />
                <FiSearch className="absolute left-10 top-7 text-amber-600" size={20} />
              </div>

              {/* Navigation Links */}
              <nav className="px-6 space-y-1">
                {navItems.map((item: NavItem) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-3 p-4 text-gray-700 hover:text-amber-700 hover:bg-amber-100/80 rounded-xl transition-all font-[var(--font-yekan)]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <item.icon size={18}  />
                    {item.name}
                  </Link>
                ))}

                <div className="border-t border-amber-200 my-4"></div>

                {mobileAdditionalItems.map((item: NavItem) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-3 p-4 text-gray-700 hover:text-amber-700 hover:bg-amber-100/80 rounded-xl transition-all font-[var(--font-yekan)]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <item.icon size={18} />
                    {item.name}
                  </Link>
                ))}
              </nav>

              {/* Bottom Actions */}
              <div className="border-t border-amber-200 p-6 space-y-3 bg-white">
                {isAuthenticated ? (
                  // کاربر لاگین کرده در موبایل
                  <>
                    <Link href="/DashboardPage" onClick={() => setIsMenuOpen(false)}>
                      <motion.button whileHover={{ scale: 1.02 }} className="w-full flex items-center gap-3 p-4 text-gray-700 hover:text-amber-700 hover:bg-amber-100/80 rounded-xl transition-all">
                        <FiUser size={20} />
                        <span className="font-[var(--font-yekan)]">
                          پنل کاربری ({getUserDisplayName()})
                        </span>
                      </motion.button>
                    </Link>
                    <Link href="/DashboardPage/profile" onClick={() => setIsMenuOpen(false)}>
                      <motion.button whileHover={{ scale: 1.02 }} className="w-full flex items-center gap-3 p-4 text-gray-700 hover:text-amber-700 hover:bg-amber-100/80 rounded-xl transition-all">
                        <FiSettings size={20} />
                        <span className="font-[var(--font-yekan)]">ویرایش پروفایل</span>
                      </motion.button>
                    </Link>
                    <Link href="/DashboardPage/orders" onClick={() => setIsMenuOpen(false)}>
                      <motion.button whileHover={{ scale: 1.02 }} className="w-full flex items-center gap-3 p-4 text-gray-700 hover:text-amber-700 hover:bg-amber-100/80 rounded-xl transition-all">
                        <FiTruck size={20} />
                        <span className="font-[var(--font-yekan)]">سفارش‌های من</span>
                      </motion.button>
                    </Link>
                    <motion.button 
                      whileHover={{ scale: 1.02 }} 
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 p-4 text-red-600 hover:text-red-700 hover:bg-red-100/80 rounded-xl transition-all"
                    >
                      <FiLogOut size={20} />
                      <span className="font-[var(--font-yekan)]">خروج از حساب</span>
                    </motion.button>
                  </>
                ) : (
                  // کاربر لاگین نکرده در موبایل
                  <>
                    <Link href="/LoginPage" onClick={() => setIsMenuOpen(false)}>
                      <motion.button whileHover={{ scale: 1.02 }} className="w-full flex items-center gap-3 p-4 text-gray-700 hover:text-amber-700 hover:bg-amber-100/80 rounded-xl transition-all">
                        <FiUser size={20} />
                        <span className="font-[var(--font-yekan)]">ورود / ثبت‌نام</span>
                      </motion.button>
                    </Link>
                  </>
                )}
                
                <Link href="/CartPage" onClick={() => setIsMenuOpen(false)}>
                  <motion.button whileHover={{ scale: 1.02 }} className="w-full flex items-center gap-3 p-4 text-gray-700 hover:text-amber-700 hover:bg-amber-100/80 rounded-xl transition-all">
                    <FiShoppingCart size={20} />
                    <span className="font-[var(--font-yekan)]">
                      سبد خرید {totalItems > 0 && `(${totalItems})`}
                    </span>
                  </motion.button>
                </Link>
                <Link href="/wishlist" onClick={() => setIsMenuOpen(false)}>
                  <motion.button whileHover={{ scale: 1.02 }} className="w-full flex items-center gap-3 p-4 text-gray-700 hover:text-amber-700 hover:bg-amber-100/80 rounded-xl transition-all">
                    <FiHeart size={20} />
                    <span className="font-[var(--font-yekan)]">علاقه‌مندی‌ها</span>
                  </motion.button>
                </Link>
                <button onClick={() => setIsLangOpen(!isLangOpen)} className="w-full flex items-center gap-3 p-4 text-gray-700 hover:text-amber-700 hover:bg-amber-100/80 rounded-xl transition-all">
                  <FiGlobe size={20} />
                  <span className="font-[var(--font-yekan)]">تغییر زبان</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}