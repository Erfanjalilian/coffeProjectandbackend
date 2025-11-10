"use client";

import { useState, useEffect } from "react";
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
} from "react-icons/fi";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const headerClass = `w-full fixed top-0 z-50 transition-all duration-500 ${
    isScrolled
      ? "bg-white/95 backdrop-blur-lg shadow-lg shadow-amber-100/50"
      : "bg-gradient-to-b from-white to-amber-50/80 backdrop-blur-sm"
  }`;

  const navItems = [
    { name: "صفحه اصلی", icon: FiHome, href: "/" },
    { name: "دسته‌بندی کالا ها", icon: FiCoffee, href: "/CoffeeCategoryPage" },
    { name: "تخفیف‌های امروز", icon: FiTag, href: "/SpecialDiscountsPage" },
    { name: "خرید باارزش", icon: FiStar, href: "/ValuablePurchasesPage" },
    { name: "فروشنده باش", icon: FiTool, href: "/BecomeSellerPage" },
  ];

  const mobileAdditionalItems = [
    { name: "فروشنده شوید", icon: FiUser, href: "/BecomeSellerPage" },
    { name: "پشتیبانی", icon: FiHelpCircle, href: "/support" },
    { name: "درباره ما", icon: FiHelpCircle, href: "/about" },
    { name: "تماس با ما", icon: FiHelpCircle, href: "/contact" },
    { name: "وبلاگ", icon: FiBook, href: "/blog" },
  ];

  return (
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

            <AnimatePresence>
              {isLangOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.9 }}
                  className="absolute left-0 mt-3 bg-white/95 backdrop-blur-lg shadow-2xl rounded-2xl overflow-hidden border border-amber-200 min-w-[120px] z-[60]"
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
          <Link href="/cart">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative p-2 text-gray-700 hover:text-amber-700 rounded-xl hover:bg-amber-50 transition-colors"
            >
              <FiShoppingCart size={22} />
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-600 to-amber-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                ۲
              </span>
            </motion.button>
          </Link>

          {/* User */}
          <Link href="/login">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white py-2 px-4 rounded-2xl shadow-lg shadow-amber-600/25 hover:shadow-amber-600/40 transition-all"
            >
              <FiUser size={18} />
              <span className="font-[var(--font-yekan)] hidden sm:inline">ورود</span>
            </motion.button>
          </Link>
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
          {navItems.map((item) => (
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

      {/* --- Mobile Menu (Drawer) بدون اسکرول --- */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 w-80 bg-white shadow-2xl z-50 flex flex-col"
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
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-3 p-4 text-gray-700 hover:text-amber-700 hover:bg-amber-100/80 rounded-xl transition-all font-[var(--font-yekan)]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <item.icon size={18} className="text-amber-600" />
                    {item.name}
                  </Link>
                ))}

                <div className="border-t border-amber-200 my-4"></div>

                {mobileAdditionalItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-3 p-4 text-gray-700 hover:text-amber-700 hover:bg-amber-100/80 rounded-xl transition-all font-[var(--font-yekan)]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <item.icon size={18} className="text-amber-600" />
                    {item.name}
                  </Link>
                ))}
              </nav>

              {/* Bottom Actions */}
              <div className="border-t border-amber-200 p-6 space-y-3 bg-white">
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  <motion.button whileHover={{ scale: 1.02 }} className="w-full flex items-center gap-3 p-4 text-gray-700 hover:text-amber-700 hover:bg-amber-100/80 rounded-xl transition-all">
                    <FiUser size={20} />
                    <span className="font-[var(--font-yekan)]">ورود / ثبت‌نام</span>
                  </motion.button>
                </Link>
                <Link href="/cart" onClick={() => setIsMenuOpen(false)}>
                  <motion.button whileHover={{ scale: 1.02 }} className="w-full flex items-center gap-3 p-4 text-gray-700 hover:text-amber-700 hover:bg-amber-100/80 rounded-xl transition-all">
                    <FiShoppingCart size={20} />
                    <span className="font-[var(--font-yekan)]">سبد خرید</span>
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
    </header>
  );
}