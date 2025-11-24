"use client";

import { useAuth } from "@/contaxt/AuthContext";
import UserProfileSidebarD from "@/app/Components/userProfileSidebarD";
import { motion, AnimatePresence } from "framer-motion";
import { FiCreditCard, FiPlus, FiEdit, FiTrash2, FiCopy, FiSettings } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Define proper TypeScript interfaces
interface BankAccount {
  _id: string;
  user: {
    _id: string;
    phone: string;
  };
  bankName: string;
  cardNumber: string;
  shebaNumber: string;
  accountType: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface BankAccountWithUser extends BankAccount {
  accountHolderName: string;
}

export default function BankAccountsPage() {
  const { user: currentUser, logout, isLoading, isAuthenticated } = useAuth();
  
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // State for bank accounts and form
  const [bankAccounts, setBankAccounts] = useState<BankAccountWithUser[]>([]);
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    bankName: "",
    cardNumber: "",
    shebaNumber: "",
    accountHolderName: "",
    isDefault: false
  });

  // Add this useEffect to display the current user's ID
useEffect(() => {
  if (currentUser?._id) {
    console.log('Logged-in User ID:', currentUser._id);
    console.log('Full User Object:', currentUser);
  }
}, [currentUser]);

  // Check authentication on component mount
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    } else if (!isLoading) {
      setIsCheckingAuth(false);
    }
  }, [isAuthenticated, isLoading, router]);

  // Fetch bank accounts data when authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading && currentUser?._id) {
      fetchBankAccounts();
    }
  }, [isAuthenticated, isLoading, currentUser?._id]);

  // Fetch bank accounts for the CURRENT logged-in user
  const fetchBankAccounts = async () => {
    try {
      setIsLoadingAccounts(true);
      
      // Get the current user's ID from context
      const currentUserId = currentUser?._id;
      
      if (!currentUserId) {
        console.error('No user ID found in context');
        return;
      }

      // Fetch bank accounts
      const bankAccountsResponse = await fetch('https://coffee-shop-backend-k3un.onrender.com/api/v1/bankAccount');
      const bankAccountsData = await bankAccountsResponse.json();
      
      if (bankAccountsData.success) {
        // Filter bank accounts to only show the current user's accounts
        const userBankAccounts = bankAccountsData.data.bankAccounts.filter(
          (account: BankAccount) =>
             account.user._id === currentUserId
        );

        // Add account holder name from current user context
        const accountsWithUserNames: BankAccountWithUser[] = userBankAccounts.map((account: BankAccount) => {
          // Get account holder name from current user's data
          let accountHolderName = "نام نامشخص";
          
          if (currentUser?.addresses && currentUser.addresses.length > 0) {
            accountHolderName = currentUser.addresses[0].name;
          } else if (currentUser?.firstName || currentUser?.lastName) {
            accountHolderName = `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim();
          } else if (currentUser?.phone) {
            accountHolderName = currentUser.phone;
          }
          
          return {
            ...account,
            accountHolderName
          };
        });
        
        setBankAccounts(accountsWithUserNames);
      } else {
        setBankAccounts([]);
      }
    } catch (error) {
      console.error('Error fetching bank accounts:', error);
      setBankAccounts([]);
    } finally {
      setIsLoadingAccounts(false);
    }
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [router]);

  // Get user's display name for sidebar
  const getUserDisplayName = () => {
    if (currentUser?.firstName && currentUser?.lastName) {
      return `${currentUser.firstName} ${currentUser.lastName}`;
    }
    return currentUser?.phone || "کاربر";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    
    const formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    
    setFormData(prev => ({
      ...prev,
      cardNumber: formattedValue
    }));
  };

  const handleShebaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.toUpperCase().replace(/\s/g, '');
    
    const formattedValue = value.replace(/(.{4})/g, '$1 ').trim();
    
    setFormData(prev => ({
      ...prev,
      shebaNumber: formattedValue
    }));
  };

  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const accountData = {
        bankName: formData.bankName,
        cardNumber: formData.cardNumber.replace(/\s/g, ''),
        shebaNumber: formData.shebaNumber.replace(/\s/g, ''),
        accountType: "حساب جاری",
        isActive: true,
        // Include the current user's ID from context
        user: {
          _id: currentUser?._id,
          phone: currentUser?.phone
        }
      };

      // Make POST request to add new bank account
      const response = await fetch('https://coffee-shop-backend-k3un.onrender.com/api/v1/bankAccount', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(accountData)
      });

      const result = await response.json();

      if (result.success) {
        // Refresh the bank accounts list
        await fetchBankAccounts();
        setIsSaving(false);
        setIsAddingAccount(false);
        setFormData({
          bankName: "",
          cardNumber: "",
          shebaNumber: "",
          accountHolderName: "",
          isDefault: false
        });
      } else {
        console.error('Error saving bank account:', result);
        setIsSaving(false);
      }
    } catch (error) {
      console.error('Error saving bank account:', error);
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async (id: string) => {
    try {
      // Make DELETE request to remove bank account
      const response = await fetch(`https://coffee-shop-backend-k3un.onrender.com/api/v1/bankAccount/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        // Remove from local state
        setBankAccounts(prev => prev.filter(account => account._id !== id));
      } else {
        console.error('Error deleting bank account:', result);
      }
    } catch (error) {
      console.error('Error deleting bank account:', error);
    }
  };

  const handleSetDefault = (id: string) => {
    setBankAccounts(prev => prev.map(account => ({
      ...account,
      isDefault: account._id === id
    })));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Iranian banks list
  const banks = [
    "ملت", "ملی", "صادرات", "پارسیان", "پاسارگاد", "تجارت", "رفاه", "سامان", 
    "سپه", "کارآفرین", "کشاورزی", "صنعت و معدن", "مسکن", "قرض الحسنه مهر", 
    "قوامین", "انصار", "دی", "ایران زمین", "خاورمیانه", "سینا", "شهر", 
    "گردشگری", "حکمت ایرانیان", "موسسه اعتباری توسعه", "موسسه اعتباری ثامن"
  ];

  // Format card number for display
  const formatCardNumber = (cardNumber: string) => {
    return cardNumber.replace(/(\d{4})/g, '$1 ').trim();
  };

  // Format sheba for display
  const formatSheba = (shebaNumber: string) => {
    return shebaNumber.replace(/(.{4})/g, '$1 ').trim();
  };

  // Show loading while checking authentication or loading accounts
  if (isLoading || isCheckingAuth || isLoadingAccounts) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center" dir="rtl">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-[var(--font-yekan)]">در حال بارگذاری اطلاعات حساب‌ها...</p>
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
                userRole={currentUser?.roles?.[0]}
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
              userRole={currentUser?.roles?.[0]}
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

                      {/* Card Number and Sheba Row */}
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
                            maxLength={19}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 font-[var(--font-yekan)]">
                            شماره شبا (اختیاری)
                          </label>
                          <input
                            type="text"
                            name="shebaNumber"
                            value={formData.shebaNumber}
                            onChange={handleShebaChange}
                            className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 font-[var(--font-yekan)] dir-ltr text-left"
                            placeholder="IR 0000 0000 0000 0000 0000 00"
                            maxLength={29}
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
                          onClick={() => setIsAddingAccount(false)}
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
                        key={account._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-lg border border-amber-200 p-6 hover:shadow-xl transition-all duration-300"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${account.isActive ? 'bg-amber-100' : 'bg-gray-100'}`}>
                              <FiCreditCard className={`text-lg ${account.isActive ? 'text-amber-600' : 'text-gray-400'}`} />
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-800 font-[var(--font-yekan)]">
                                {account.bankName}
                              </h3>
                              <span className={`text-xs px-2 py-1 rounded-full font-[var(--font-yekan)] ${account.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                {account.isActive ? 'فعال' : 'غیرفعال'}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSetDefault(account._id)}
                              className="text-amber-600 hover:text-amber-700 p-2 transition-colors"
                              title="تنظیم به عنوان پیش‌فرض"
                            >
                              <FiCreditCard size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteAccount(account._id)}
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
                          
                          {account.shebaNumber && (
                            <div>
                              <span className="font-semibold">شماره شبا:</span>
                              <div className="flex items-center gap-2 mt-1">
                                <p className="font-mono dir-ltr text-xs">
                                  {formatSheba(account.shebaNumber)}
                                </p>
                                <button
                                  onClick={() => copyToClipboard(account.shebaNumber)}
                                  className="text-amber-600 hover:text-amber-700 transition-colors"
                                  title="کپی شماره شبا"
                                >
                                  <FiCopy size={14} />
                                </button>
                              </div>
                            </div>
                          )}

                          <div>
                            <span className="font-semibold">نوع حساب:</span>
                            <p className="mt-1">{account.accountType}</p>
                          </div>
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