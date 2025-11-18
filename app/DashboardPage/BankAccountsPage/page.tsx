"use client";

import { useAuth } from "@/contaxt/AuthContext";
import UserProfileSidebarD from "@/app/Components/userProfileSidebarD";
import { motion, AnimatePresence } from "framer-motion";
import { FiCreditCard, FiPlus, FiEdit, FiTrash2, FiCopy, FiSettings } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BankAccountsPage() {
  const { user, logout, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // State for bank accounts and form
  const [bankAccounts, setBankAccounts] = useState<any[]>([]);
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    bankName: "",
    cardNumber: "",
    iban: "",
    accountHolderName: "",
    isDefault: false
  });

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

  // Get user's display name for sidebar
  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.phone || "کاربر";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length > 16) value = value.slice(0, 16); // Limit to 16 digits
    
    // Add spaces every 4 digits for better readability
    const formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    
    setFormData(prev => ({
      ...prev,
      cardNumber: formattedValue
    }));
  };

  const handleIbanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.toUpperCase().replace(/\s/g, ''); // Remove spaces and convert to uppercase
    
    // Format with spaces every 4 characters
    const formattedValue = value.replace(/(.{4})/g, '$1 ').trim();
    
    setFormData(prev => ({
      ...prev,
      iban: formattedValue
    }));
  };

  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      const newAccount = {
        id: Date.now().toString(),
        ...formData,
        // Remove spaces for storage
        cardNumber: formData.cardNumber.replace(/\s/g, ''),
        iban: formData.iban.replace(/\s/g, ''),
        createdAt: new Date().toISOString()
      };
      
      setBankAccounts(prev => [newAccount, ...prev]);
      setIsSaving(false);
      setIsAddingAccount(false);
      setFormData({
        bankName: "",
        cardNumber: "",
        iban: "",
        accountHolderName: "",
        isDefault: false
      });
    }, 1500);
  };

  const handleCancel = () => {
    setIsAddingAccount(false);
    setFormData({
      bankName: "",
      cardNumber: "",
      iban: "",
      accountHolderName: "",
      isDefault: false
    });
  };

  const handleDeleteAccount = (id: string) => {
    setBankAccounts(prev => prev.filter(account => account.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setBankAccounts(prev => prev.map(account => ({
      ...account,
      isDefault: account.id === id
    })));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  // Iranian banks list
  const banks = [
    "ملت",
    "ملی",
    "صادرات",
    "پارسیان",
    "پاسارگاد",
    "تجارت",
    "رفاه",
    "سامان",
    "سپه",
    "کارآفرین",
    "کشاورزی",
    "صنعت و معدن",
    "مسکن",
    "قرض الحسنه مهر",
    "قوامین",
    "انصار",
    "دی",
    "ایران زمین",
    "خاورمیانه",
    "سینا",
    "شهر",
    "گردشگری",
    "حکمت ایرانیان",
    "موسسه اعتباری توسعه",
    "موسسه اعتباری ثامن"
  ];

  // Format card number for display
  const formatCardNumber = (cardNumber: string) => {
    return cardNumber.replace(/(\d{4})/g, '$1 ').trim();
  };

  // Format IBAN for display
  const formatIban = (iban: string) => {
    return iban.replace(/(.{4})/g, '$1 ').trim();
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

  // If not authenticated, redirect (handled by useEffect in parent)
  if (!isAuthenticated) {
    return null;
  }

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
              <UserProfileSidebarD
                userName={getUserDisplayName()}
                userRole={user?.roles?.[0]}
                onLogout={logout}
                activePage="bank-accounts"
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
                حساب‌های بانکی
              </h1>
              <p className="text-gray-600 font-[var(--font-yekan)] text-center lg:text-right">
                مدیریت حساب‌های بانکی و کارت‌های اعتباری
              </p>
            </div>
            <div className="hidden lg:flex items-center gap-3">
              {!isAddingAccount && bankAccounts.length > 0 && (
                <button
                  onClick={() => setIsAddingAccount(true)}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-xl font-[var(--font-yekan)] font-semibold transition-colors flex items-center gap-2"
                >
                  <FiPlus size={18} />
                  افزودن حساب جدید
                </button>
              )}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Left Side (1/4 width) - Hidden on mobile */}
          <div className="hidden lg:block lg:col-span-1">
            <UserProfileSidebarD
              userName={getUserDisplayName()}
              userRole={user?.roles?.[0]}
              onLogout={logout}
              activePage="bank-accounts"
            />
          </div>

          {/* Main Content - Right Side (3/4 width) */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Add New Bank Account Card */}
              {isAddingAccount && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-lg border border-amber-200 p-6 mb-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-amber-100 p-3 rounded-full">
                      <FiPlus className="text-amber-600 text-xl" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800 font-[var(--font-yekan)]">
                        افزودن حساب بانکی جدید
                      </h2>
                      <p className="text-gray-600 font-[var(--font-yekan)] text-sm mt-1">
                        اطلاعات حساب بانکی یا کارت اعتباری خود را وارد کنید
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSaveAccount}>
                    <div className="space-y-6">
                      {/* Bank Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 font-[var(--font-yekan)]">
                          نام بانک *
                        </label>
                        <select
                          name="bankName"
                          value={formData.bankName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 font-[var(--font-yekan)]"
                        >
                          <option value="">انتخاب بانک</option>
                          {banks.map(bank => (
                            <option key={bank} value={bank}>
                              {bank}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Account Holder Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 font-[var(--font-yekan)]">
                          نام دارنده حساب *
                        </label>
                        <input
                          type="text"
                          name="accountHolderName"
                          value={formData.accountHolderName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 font-[var(--font-yekan)]"
                          placeholder="نام کامل دارنده حساب"
                        />
                      </div>

                      {/* Card Number and IBAN Row */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 font-[var(--font-yekan)]">
                            شماره کارت (۱۶ رقمی) *
                          </label>
                          <input
                            type="text"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleCardNumberChange}
                            required
                            className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 font-[var(--font-yekan)] dir-ltr text-left"
                            placeholder="1234 5678 9012 3456"
                            maxLength={19} // 16 digits + 3 spaces
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 font-[var(--font-yekan)]">
                            شماره شبا (اختیاری)
                          </label>
                          <input
                            type="text"
                            name="iban"
                            value={formData.iban}
                            onChange={handleIbanChange}
                            className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 font-[var(--font-yekan)] dir-ltr text-left"
                            placeholder="IR 0000 0000 0000 0000 0000 00"
                            maxLength={29} // 24 characters + 5 spaces
                          />
                        </div>
                      </div>

                      {/* Default Account Checkbox */}
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          name="isDefault"
                          checked={formData.isDefault}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-amber-600 border-amber-300 rounded focus:ring-amber-500"
                        />
                        <label className="text-sm text-gray-700 font-[var(--font-yekan)]">
                          تنظیم به عنوان حساب پیش‌فرض
                        </label>
                      </div>

                      {/* Action Buttons */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-3 pt-4"
                      >
                        <button
                          type="submit"
                          disabled={isSaving}
                          className="flex-1 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white py-3 rounded-xl font-[var(--font-yekan)] font-semibold transition-colors flex items-center justify-center gap-2"
                        >
                          {isSaving ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              در حال ذخیره...
                            </>
                          ) : (
                            <>
                              <FiPlus size={18} />
                              افزودن حساب
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={handleCancel}
                          disabled={isSaving}
                          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-[var(--font-yekan)] font-semibold transition-colors"
                        >
                          انصراف
                        </button>
                      </motion.div>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Empty State or Bank Accounts List */}
              {bankAccounts.length === 0 && !isAddingAccount ? (
                <div className="bg-white rounded-2xl shadow-lg border border-amber-200 p-12 text-center">
                  <div className="max-w-md mx-auto">
                    <div className="bg-amber-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                      <FiCreditCard className="text-amber-600 text-2xl" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3 font-[var(--font-yekan)]">
                      هیچ حساب بانکی ثبت نشده است
                    </h3>
                    <p className="text-gray-600 mb-6 font-[var(--font-yekan)]">
                      برای تسهیل در پرداخت‌ها، اولین حساب بانکی خود را اضافه کنید.
                    </p>
                    <button
                      onClick={() => setIsAddingAccount(true)}
                      className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-xl font-[var(--font-yekan)] font-semibold transition-colors flex items-center gap-2 mx-auto"
                    >
                      <FiPlus size={18} />
                      افزودن حساب بانکی
                    </button>
                  </div>
                </div>
              ) : bankAccounts.length > 0 && (
                <div className="space-y-6">
                  {/* Bank Accounts List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {bankAccounts.map((account) => (
                      <motion.div
                        key={account.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-lg border border-amber-200 p-6 hover:shadow-xl transition-all duration-300"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${account.isDefault ? 'bg-amber-100' : 'bg-gray-100'}`}>
                              <FiCreditCard className={`text-lg ${account.isDefault ? 'text-amber-600' : 'text-gray-400'}`} />
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-800 font-[var(--font-yekan)]">
                                {account.bankName}
                              </h3>
                              {account.isDefault && (
                                <span className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-full font-[var(--font-yekan)]">
                                  پیش‌فرض
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSetDefault(account.id)}
                              className="text-amber-600 hover:text-amber-700 p-2 transition-colors"
                              title="تنظیم به عنوان پیش‌فرض"
                            >
                              <FiCreditCard size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteAccount(account.id)}
                              className="text-red-600 hover:text-red-700 p-2 transition-colors"
                              title="حذف حساب"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-3 text-sm text-gray-600 font-[var(--font-yekan)]">
                          <div>
                            <span className="font-semibold">دارنده حساب:</span>
                            <p className="mt-1">{account.accountHolderName}</p>
                          </div>
                          
                          <div>
                            <span className="font-semibold">شماره کارت:</span>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="font-mono dir-ltr">
                                {formatCardNumber(account.cardNumber)}
                              </p>
                              <button
                                onClick={() => copyToClipboard(account.cardNumber)}
                                className="text-amber-600 hover:text-amber-700 transition-colors"
                                title="کپی شماره کارت"
                              >
                                <FiCopy size={14} />
                              </button>
                            </div>
                          </div>
                          
                          {account.iban && (
                            <div>
                              <span className="font-semibold">شماره شبا:</span>
                              <div className="flex items-center gap-2 mt-1">
                                <p className="font-mono dir-ltr text-xs">
                                  {formatIban(account.iban)}
                                </p>
                                <button
                                  onClick={() => copyToClipboard(account.iban)}
                                  className="text-amber-600 hover:text-amber-700 transition-colors"
                                  title="کپی شماره شبا"
                                >
                                  <FiCopy size={14} />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Add More Accounts Button */}
                  {!isAddingAccount && (
                    <div className="text-center">
                      <button
                        onClick={() => setIsAddingAccount(true)}
                        className="bg-amber-100 hover:bg-amber-200 text-amber-700 px-6 py-3 rounded-xl font-[var(--font-yekan)] font-semibold transition-colors flex items-center gap-2 mx-auto"
                      >
                        <FiPlus size={18} />
                        افزودن حساب جدید
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Information Box */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200 mt-6"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-amber-100 p-2 rounded-full mt-1">
                    <FiCreditCard className="text-amber-600 text-lg" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2 font-[var(--font-yekan)]">
                      نکات مهم حساب‌های بانکی
                    </h3>
                    <ul className="text-gray-700 space-y-2 font-[var(--font-yekan)] text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 mt-1">•</span>
                        <span>اطلاعات حساب بانکی شما به صورت امن ذخیره می‌شود</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 mt-1">•</span>
                        <span>شماره کارت باید ۱۶ رقمی و معتبر باشد</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 mt-1">•</span>
                        <span>می‌توانید یک حساب را به عنوان پیش‌فرض تنظیم کنید</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 mt-1">•</span>
                        <span>حساب پیش‌فرض برای پرداخت‌های سریع‌تر استفاده می‌شود</span>
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