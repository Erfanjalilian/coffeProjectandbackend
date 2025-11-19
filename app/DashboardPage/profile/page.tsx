"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FiUser, FiSave, FiCheck, FiSettings } from "react-icons/fi";
import { useState } from "react";
import Link from "next/link";

// Mock user data - completely static
const staticUser = {
  name: "محمد احمدی",
  username: "mohammad_ahmadi",
  phone: "09123456789",
  roles: ["user"],
  createdAt: "2024-01-15T10:30:00.000Z"
};

export default function ProfilePage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Static form data
  const [formData, setFormData] = useState({
    name: staticUser.name,
    username: staticUser.username,
    phone: staticUser.phone
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Track if form has been modified
  const isFormModified = formData.name !== staticUser.name || 
                        formData.username !== staticUser.username;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear messages when user starts typing
    if (error) setError("");
    if (successMessage) setSuccessMessage("");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Don't save if no changes were made
    if (!isFormModified) {
      setSuccessMessage("هیچ تغییری اعمال نشده است");
      setTimeout(() => setSuccessMessage(""), 3000);
      return;
    }

    setIsSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In static version, we just show success message without actually saving
      setSuccessMessage("اطلاعات پروفایل با موفقیت به‌روزرسانی شد (نسخه نمایشی)");
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

    } catch (err) {
      console.error("Profile update error:", err);
      setError("خطا در به‌روزرسانی اطلاعات (نسخه نمایشی)");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: staticUser.name,
      username: staticUser.username,
      phone: staticUser.phone
    });
    setError("");
    setSuccessMessage("");
  };

  // Mock logout function
  const handleLogout = () => {
    console.log("Logout clicked (static version)");
    // In static version, you might want to redirect to home or show a message
  };

  // Mock sidebar component - you'll need to create a static version of this too
  const StaticUserProfileSidebar = ({ 
    userName, 
    userRole, 
    onLogout, 
    activePage,
    isMobile = false,
    onNavigate 
  }: any) => (
    <div className={`bg-white rounded-2xl shadow-lg border border-amber-200 ${isMobile ? 'h-full' : ''}`}>
      <div className="p-6 border-b border-amber-200">
        <div className="flex items-center gap-3">
          <div className="bg-amber-100 p-3 rounded-full">
            <FiUser className="text-amber-600 text-xl" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 font-[var(--font-yekan)]">{userName}</h3>
            <p className="text-gray-600 text-sm font-[var(--font-yekan)]">{userRole === 'admin' ? 'مدیر' : 'کاربر'}</p>
          </div>
        </div>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <Link 
              href="/profile" 
              className={`flex items-center gap-3 p-3 rounded-xl font-[var(--font-yekan)] transition-colors ${
                activePage === 'profile' 
                  ? 'bg-amber-100 text-amber-700' 
                  : 'text-gray-700 hover:bg-amber-50'
              }`}
              onClick={onNavigate}
            >
              <FiUser size={18} />
              اطلاعات شخصی
            </Link>
          </li>
          <li>
            <button 
              onClick={onLogout}
              className="w-full flex items-center gap-3 p-3 rounded-xl text-red-600 hover:bg-red-50 font-[var(--font-yekan)] transition-colors text-right"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              خروج از حساب
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 pt-44 pb-12" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Menu Button - Only visible on mobile */}
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

        {/* Mobile Menu Overlay */}
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
              <StaticUserProfileSidebar
                userName={staticUser.name}
                userRole={staticUser.roles[0]}
                onLogout={handleLogout}
                activePage="profile"
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2 font-[var(--font-yekan)] text-center lg:text-right">
                اطلاعات شخصی
              </h1>
              <p className="text-gray-600 font-[var(--font-yekan)] text-center lg:text-right">
                مدیریت و به‌روزرسانی اطلاعات حساب کاربری (نسخه استاتیک)
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Left Side (1/4 width) - Hidden on mobile */}
          <div className="hidden lg:block lg:col-span-1">
            <StaticUserProfileSidebar
              userName={staticUser.name}
              userRole={staticUser.roles[0]}
              onLogout={handleLogout}
              activePage="profile"
            />
          </div>

          {/* Main Content - Right Side (3/4 width) */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4"
                >
                  <p className="text-red-700 text-sm font-[var(--font-yekan)] text-center">{error}</p>
                </motion.div>
              )}

              {/* Success Message */}
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 bg-emerald-50 border border-emerald-200 rounded-xl p-4"
                >
                  <p className="text-emerald-700 text-sm font-[var(--font-yekan)] text-center">{successMessage}</p>
                </motion.div>
              )}

              {/* Profile Information Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-amber-200 p-6 mb-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-amber-100 p-3 rounded-full">
                    <FiUser className="text-amber-600 text-xl" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 font-[var(--font-yekan)]">
                      اطلاعات حساب کاربری
                    </h2>
                    <p className="text-gray-600 font-[var(--font-yekan)] text-sm mt-1">
                      اطلاعات شخصی و هویتی شما در این بخش قابل مدیریت است (نسخه استاتیک)
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSave}>
                  <div className="space-y-6">
                    {/* Full Name Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 font-[var(--font-yekan)]">
                        نام کامل
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 font-[var(--font-yekan)] bg-white"
                        placeholder="نام و نام خانوادگی خود را وارد کنید"
                      />
                      {!formData.name && (
                        <p className="text-amber-600 text-xs mt-2 font-[var(--font-yekan)]">
                          نام کامل شما هنوز ثبت نشده است
                        </p>
                      )}
                    </div>

                    {/* Username Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 font-[var(--font-yekan)]">
                        نام کاربری
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 font-[var(--font-yekan)] bg-white"
                        placeholder="نام کاربری خود را وارد کنید"
                      />
                    </div>

                    {/* Phone Number Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 font-[var(--font-yekan)]">
                        شماره موبایل
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={true}
                        className="w-full px-4 py-3 border border-amber-200 rounded-xl bg-gray-50 text-gray-500 font-[var(--font-yekan)]"
                        placeholder="09xxxxxxxxx"
                      />
                      <p className="text-gray-500 text-xs mt-2 font-[var(--font-yekan)]">
                        شماره موبایل قابل تغییر نیست
                      </p>
                    </div>

                    {/* Membership Date */}
                    <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 font-[var(--font-yekan)] text-sm">
                          تاریخ عضویت:
                        </span>
                        <span className="text-gray-800 font-[var(--font-yekan)] font-semibold">
                          {new Date(staticUser.createdAt).toLocaleDateString('fa-IR')}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons - Always visible but disabled when no changes */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3 pt-4"
                    >
                      <button
                        type="submit"
                        disabled={isSaving || !isFormModified}
                        className="flex-1 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 disabled:cursor-not-allowed text-white py-3 rounded-xl font-[var(--font-yekan)] font-semibold transition-colors flex items-center justify-center gap-2"
                      >
                        {isSaving ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            در حال ذخیره...
                          </>
                        ) : (
                          <>
                            <FiSave size={18} />
                            {isFormModified ? "ذخیره تغییرات" : "تغییری اعمال نشده"}
                          </>
                        )}
                      </button>
                      
                      {isFormModified && (
                        <button
                          type="button"
                          onClick={handleReset}
                          disabled={isSaving}
                          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-[var(--font-yekan)] font-semibold transition-colors"
                        >
                          بازنشانی
                        </button>
                      )}
                    </motion.div>
                  </div>
                </form>
              </div>

              {/* Information Box */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-amber-100 p-2 rounded-full mt-1">
                    <FiCheck className="text-amber-600 text-lg" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2 font-[var(--font-yekan)]">
                      نکات مهم (نسخه استاتیک)
                    </h3>
                    <ul className="text-gray-700 space-y-2 font-[var(--font-yekan)] text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 mt-1">•</span>
                        <span>این نسخه نمایشی است و اطلاعات ذخیره نمی‌شوند</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 mt-1">•</span>
                        <span>می‌توانید مستقیماً اطلاعات خود را ویرایش کرده و سپس دکمه ذخیره را بزنید</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 mt-1">•</span>
                        <span>نام کامل باید مطابق با کارت شناسایی شما باشد</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 mt-1">•</span>
                        <span>شماره موبایل برای ورود به حساب و بازیابی رمز عبور استفاده می‌شود</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 mt-1">•</span>
                        <span>دکمه ذخیره تنها زمانی فعال می‌شود که تغییری در اطلاعات ایجاد کرده باشید</span>
                      </li>
                    </ul>
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