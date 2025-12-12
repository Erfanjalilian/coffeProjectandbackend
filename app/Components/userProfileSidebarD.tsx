"use client";

import { 
  FiUser, 
  FiHeart, 
  FiMapPin, 
  FiCreditCard, 
  FiSettings, 
  FiLogOut, 
  FiCoffee, 
  FiX,
  FiHome,
  FiShoppingBag,
  FiPackage
} from "react-icons/fi";
import { motion } from "framer-motion";
import Link from "next/link";

interface UserProfileSidebarProps {
  userName: string;
  userRole?: string;
  onLogout: () => void;
  activePage?: string;
  isMobile?: boolean;
  onNavigate?: () => void;
}

export default function UserProfileSidebarD({ 
  userName, 
  userRole, 
  onLogout,
  activePage = "dashboard",
  isMobile = false,
  onNavigate
}: UserProfileSidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "داشبورد", icon: FiHome, href: "/DashboardPage" },
    { id: "orders", label: "سفارشات", icon: FiPackage, href: "/DashboardPage/OrdersPage" },
    { id: "profile", label: "اطلاعات شخصی", icon: FiUser, href: "/DashboardPage/profile" },
    { id: "favorites", label: "علاقه‌مندی‌ها", icon: FiHeart, href: "/DashboardPage/favorites" },
    { id: "addresses", label: "آدرس‌های من", icon: FiMapPin, href: "/DashboardPage/addresses" },
    { id: "bank-accounts", label: "حساب‌های بانکی", icon: FiCreditCard, href: "/DashboardPage/BankAccountsPage" },
  ];

  const handleNavigation = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  const handleLogout = () => {
    onLogout();
    if (onNavigate) {
      onNavigate();
    }
  };

  // Mobile sidebar content
  if (isMobile) {
    return (
      <div className="h-full flex flex-col">
        {/* Mobile Header - Updated with brand colors */}
        <div className="bg-[#3366FF] p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold font-[var(--font-yekan)]">منوی کاربری</h2>
            <button
              onClick={handleNavigation}
              className="p-2 hover:bg-[#194FFF] rounded-full transition-colors"
            >
              <FiX size={20} />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-[#194FFF] p-2 rounded-full">
              <FiUser size={20} />
            </div>
            <div>
              <p className="font-[var(--font-yekan)] font-semibold">{userName}</p>
              <p className="text-blue-100 text-sm font-[var(--font-yekan)]">
                {userRole || "کاربر"}
              </p>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Content - Updated with brand colors */}
        <div className="flex-1 overflow-y-auto p-4">
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={handleNavigation}
                  className={`flex items-center gap-3 px-4 py-4 rounded-xl transition-all duration-200 font-[var(--font-yekan)] ${
                    isActive
                      ? "bg-blue-50 text-[#3366FF] border-r-4 border-[#3366FF]"
                      : "text-[#1E2024] hover:bg-blue-50 hover:text-[#3366FF]"
                  }`}
                >
                  <Icon size={20} />
                  <span className="flex-1">{item.label}</span>
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 bg-[#3366FF] rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Logout Button */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-4 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-[var(--font-yekan)]"
            >
              <FiLogOut size={20} />
              <span>خروج از حساب</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Desktop sidebar content (updated with brand colors)
  return (
    <div className="space-y-6">
      {/* User Info Card - Updated with brand colors */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
      >
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-[#3366FF] to-blue-700 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-white text-2xl font-bold font-[var(--font-yekan)]">
              {userName.charAt(0)}
            </span>
          </div>
          <h3 className="text-lg font-bold text-[#1E2024] mb-1 font-[var(--font-yekan)]">
            {userName}
          </h3>
          <p className="text-[#3366FF] text-sm font-[var(--font-yekan)]">
            {userRole || "کاربر"}
          </p>
        </div>
      </motion.div>

      {/* Navigation Menu - Updated with brand colors */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
      >
        <nav className="space-y-1 p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-[var(--font-yekan)] ${
                  isActive
                    ? "bg-blue-50 text-[#3366FF] border-r-4 border-[#3366FF]"
                    : "text-[#1E2024] hover:bg-blue-50 hover:text-[#3366FF]"
                }`}
              >
                <Icon size={20} />
                <span className="flex-1">{item.label}</span>
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 bg-[#3366FF] rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="border-t border-gray-200 p-4">
          <button
            onClick={onLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-[var(--font-yekan)]"
          >
            <FiLogOut size={20} />
            <span>خروج از حساب</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}