"use client";

import { useAuth } from "@/contaxt/AuthContext";
import UserProfileSidebarD from "@/app/Components/userProfileSidebarD";
import { motion, AnimatePresence } from "framer-motion";
import { FiMapPin, FiPlus, FiEdit, FiTrash2, FiHome, FiBriefcase, FiSettings, FiX } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AddressesPage() {
  const { user, logout, isLoading, isAuthenticated, updateUser } = useAuth();
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // State for addresses and form
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  
  // Form state - matches exact API structure
  const [formData, setFormData] = useState({
    name: "",
    postalCode: "",
    province: "",
    city: "",
    street: "",
  });

  // API base URL
  const API_BASE_URL = 'https://coffee-shop-backend-k3un.onrender.com/api/v1';

  // Check authentication on component mount and load addresses
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    } else if (!isLoading && isAuthenticated) {
      setIsCheckingAuth(false);
      loadAddressesFromAPI();
    }
  }, [isAuthenticated, isLoading, router]);

  // Load addresses from API
  const loadAddressesFromAPI = async () => {
    try {
      setIsLoadingAddresses(true);
      const token = localStorage.getItem("token");
      
      console.log('🔍 Loading addresses from API...');
      console.log('📝 Token exists:', !!token);
      console.log('👤 Current user ID:', user?._id);

      const response = await fetch(`${API_BASE_URL}/user`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 API Response Status:', response.status);
      console.log('📡 API Response OK:', response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ API Data received:', data);
        
        // Find the current user in the users array
        const currentUser = data.data.users.find((u: any) => u._id === user?._id);
        console.log('👤 Found current user:', currentUser);
        
        if (currentUser && currentUser.addresses) {
          console.log('📍 User addresses:', currentUser.addresses);
          setAddresses(currentUser.addresses);
          // Also update the auth context with fresh data
          updateUser(currentUser);
        } else {
          console.log('❌ No addresses found for user');
        }
      } else {
        const errorText = await response.text();
        console.error('❌ API Error Response:', errorText);
        throw new Error(`Failed to fetch addresses: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('💥 Error loading addresses:', error);
      console.error('🔧 Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        name: error instanceof Error ? error.name : 'N/A',
        stack: error instanceof Error ? error.stack : 'N/A'
      });
      
      // Use addresses from auth context as fallback ONLY
      if (user?.addresses) {
        console.log('🔄 Falling back to addresses from auth context');
        setAddresses(user.addresses);
      }
    } finally {
      setIsLoadingAddresses(false);
    }
  };

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
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const token = localStorage.getItem("token");
      
      console.log('💾 Starting address save process...');
      console.log('🔐 Token available:', !!token);
      console.log('👤 Current user ID:', user?._id);
      console.log('📝 Form data:', formData);
      console.log('✏️ Is editing:', isEditingAddress);
      
      // Create address data in exact API format
      const addressData = {
        name: formData.name,
        postalCode: formData.postalCode,
        province: formData.province,
        city: formData.city,
        street: formData.street
      };

      console.log('📍 Address data to save:', addressData);

      let response;

      if (isEditingAddress) {
        // UPDATE existing address - PATCH /api/v1/user/me/addresses/:addressId
        console.log(`🔄 Updating address with ID: ${isEditingAddress}`);
        response = await fetch(`${API_BASE_URL}/user/me/addresses/${isEditingAddress}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(addressData)
        });
      } else {
        // CREATE new address - POST /api/v1/user/me/addresses
        console.log('🆕 Creating new address');
        response = await fetch(`${API_BASE_URL}/user/me/addresses`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(addressData)
        });
      }

      console.log('📡 API Response Status:', response.status);
      console.log('📡 API Response OK:', response.ok);

      if (response.ok) {
        const responseData = await response.json();
        console.log('✅ Save successful! Response data:', responseData);
        
        // Reload addresses from API to get the updated list
        await loadAddressesFromAPI();
        
        console.log('✅ Address saved successfully!');
        handleCancel();
        alert('آدرس با موفقیت ذخیره شد');
      } else {
        const errorText = await response.text();
        console.error('❌ Save failed! API Error Response:', errorText);
        console.error('🔧 Error details:', {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries())
        });
        
        throw new Error(`API returned ${response.status}: ${errorText}`);
      }

    } catch (error) {
      console.error('💥 Error saving address:', error);
      console.error('🔧 Detailed error analysis:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        name: error instanceof Error ? error.name : 'N/A',
        stack: error instanceof Error ? error.stack : 'N/A',
        type: error instanceof TypeError ? 'TypeError' : 'Other',
        isNetworkError: error instanceof TypeError && error.message.includes('fetch'),
        timestamp: new Date().toISOString()
      });
      
      alert('خطا در ذخیره آدرس. لطفاً دوباره تلاش کنید. (برای جزئیات بیشتر کنسول را بررسی کنید)');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditAddress = (address: any) => {
    console.log('✏️ Editing address:', address);
    setFormData({
      name: address.name || "",
      postalCode: address.postalCode || "",
      province: address.province || "",
      city: address.city || "",
      street: address.street || ""
    });
    setIsEditingAddress(address._id);
    setIsAddingAddress(true);
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm('آیا از حذف این آدرس مطمئن هستید؟')) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      
      console.log('🗑️ Deleting address:', addressId);
      console.log('👤 Current user ID:', user?._id);

      // DELETE address - DELETE /api/v1/user/me/addresses/:addressId
      const response = await fetch(`${API_BASE_URL}/user/me/addresses/${addressId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 Delete API Response Status:', response.status);
      console.log('📡 Delete API Response OK:', response.ok);

      if (response.ok) {
        const responseData = await response.json();
        console.log('✅ Delete successful! Response data:', responseData);
        
        // Reload addresses from API to get the updated list
        await loadAddressesFromAPI();
        
        alert('آدرس با موفقیت حذف شد');
      } else {
        const errorText = await response.text();
        console.error('❌ Delete failed! API Error Response:', errorText);
        throw new Error(`API returned ${response.status}: ${errorText}`);
      }

    } catch (error) {
      console.error('💥 Error deleting address:', error);
      console.error('🔧 Detailed error analysis:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        name: error instanceof Error ? error.name : 'N/A',
        stack: error instanceof Error ? error.stack : 'N/A'
      });
      
      alert('خطا در حذف آدرس. لطفاً دوباره تلاش کنید. (برای جزئیات بیشتر کنسول را بررسی کنید)');
    }
  };

  const handleCancel = () => {
    console.log('🚫 Canceling address form');
    setIsAddingAddress(false);
    setIsEditingAddress(null);
    setFormData({
      name: "",
      postalCode: "",
      province: "",
      city: "",
      street: "",
    });
  };

  // Sample provinces and cities for Iran
  const provinces = [
    "تهران", "اصفهان", "فارس", "خراسان رضوی", "آذربایجان شرقی", "آذربایجان غربی",
    "کرمان", "خوزستان", "قزوین", "قم", "البرز", "گیلان", "مازندران", "مرکزی",
    "همدان", "کردستان", "لرستان", "سیستان و بلوچستان", "یزد", "کرمانشاه",
    "اردبیل", "بوشهر", "زنجان", "سمنان", "چهارمحال و بختیاری", "هرمزگان",
    "کهگیلویه و بویراحمد", "گلستان", "ایلام", "خراسان شمالی", "خراسان جنوبی"
  ];

  const cities = {
    "تهران": ["تهران", "شهریار", "اسلامشهر", "رباط کریم", "پاکدشت"],
    "اصفهان": ["اصفهان", "کاشان", "خمینی شهر", "نجف آباد", "شاهین شهر"],
    "فارس": ["شیراز", "مرودشت", "کازرون", "فسا", "لار"],
    "خراسان رضوی": ["مشهد", "نیشابور", "سبزوار", "تربت حیدریه", "قوچان"],
    "خراسان جنوبی": ["بیرجند", "قائن", "فردوس", "نهبندان"]
  };

  // Show loading while checking authentication or loading addresses
  if (isLoading || isCheckingAuth || isLoadingAddresses) {
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
                activePage="addresses"
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
                آدرس‌های من
              </h1>
              <p className="text-gray-600 font-[var(--font-yekan)] text-center lg:text-right">
                مدیریت آدرس‌های تحویل سفارشات
              </p>
            </div>
            <div className="hidden lg:flex items-center gap-3">
              {!isAddingAddress && addresses.length > 0 && (
                <button
                  onClick={() => setIsAddingAddress(true)}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-xl font-[var(--font-yekan)] font-semibold transition-colors flex items-center gap-2"
                >
                  <FiPlus size={18} />
                  افزودن آدرس جدید
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
              activePage="addresses"
            />
          </div>

          {/* Main Content - Right Side (3/4 width) */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Add/Edit New Address Card */}
              {isAddingAddress && (
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
                        {isEditingAddress ? 'ویرایش آدرس' : 'افزودن آدرس جدید'}
                      </h2>
                      <p className="text-gray-600 font-[var(--font-yekan)] text-sm mt-1">
                        {isEditingAddress ? 'اطلاعات آدرس را ویرایش کنید' : 'آدرس جدید خود را برای تحویل سفارشات وارد کنید'}
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSaveAddress}>
                    <div className="space-y-6">
                      {/* Name Field (Receiver Name) */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 font-[var(--font-yekan)]">
                          نام تحویل‌گیرنده *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 font-[var(--font-yekan)]"
                          placeholder="نام شخصی که سفارش را دریافت می‌کند"
                        />
                      </div>

                      {/* Province and City Row */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 font-[var(--font-yekan)]">
                            استان *
                          </label>
                          <select
                            name="province"
                            value={formData.province}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 font-[var(--font-yekan)]"
                          >
                            <option value="">انتخاب استان</option>
                            {provinces.map(province => (
                              <option key={province} value={province}>
                                {province}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 font-[var(--font-yekan)]">
                            شهر *
                          </label>
                          <select
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            required
                            disabled={!formData.province}
                            className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 font-[var(--font-yekan)] disabled:bg-gray-50"
                          >
                            <option value="">انتخاب شهر</option>
                            {formData.province && cities[formData.province as keyof typeof cities]?.map(city => (
                              <option key={city} value={city}>
                                {city}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Street Address */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 font-[var(--font-yekan)]">
                          آدرس کامل *
                        </label>
                        <input
                          type="text"
                          name="street"
                          value={formData.street}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 font-[var(--font-yekan)]"
                          placeholder="خیابان، کوچه، پلاک، واحد"
                        />
                      </div>

                      {/* Postal Code */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 font-[var(--font-yekan)]">
                          کد پستی *
                        </label>
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 font-[var(--font-yekan)]"
                          placeholder="۱۰ رقمی"
                          maxLength={10}
                        />
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
                              {isEditingAddress ? 'ویرایش آدرس' : 'افزودن آدرس'}
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

              {/* Empty State or Addresses List */}
              {addresses.length === 0 && !isAddingAddress ? (
                <div className="bg-white rounded-2xl shadow-lg border border-amber-200 p-12 text-center">
                  <div className="max-w-md mx-auto">
                    <div className="bg-amber-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                      <FiMapPin className="text-amber-600 text-2xl" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3 font-[var(--font-yekan)]">
                      هیچ آدرسی ثبت نشده است
                    </h3>
                    <p className="text-gray-600 mb-6 font-[var(--font-yekan)]">
                      برای دریافت سفارشات خود در اسرع وقت، اولین آدرس خود را اضافه کنید.
                    </p>
                    <button
                      onClick={() => setIsAddingAddress(true)}
                      className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-xl font-[var(--font-yekan)] font-semibold transition-colors flex items-center gap-2 mx-auto"
                    >
                      <FiPlus size={18} />
                      افزودن آدرس جدید
                    </button>
                  </div>
                </div>
              ) : addresses.length > 0 && (
                <div className="space-y-6">
                  {/* Addresses List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map((address) => (
                      <motion.div
                        key={address._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-lg border border-amber-200 p-6 hover:shadow-xl transition-all duration-300"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-amber-100 p-2 rounded-full">
                              <FiHome className="text-amber-600 text-lg" />
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-800 font-[var(--font-yekan)]">
                                {address.name || 'آدرس بدون نام'}
                              </h3>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditAddress(address)}
                              className="text-amber-600 hover:text-amber-700 p-2 transition-colors"
                              title="ویرایش آدرس"
                            >
                              <FiEdit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteAddress(address._id)}
                              className="text-red-600 hover:text-red-700 p-2 transition-colors"
                              title="حذف آدرس"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600 font-[var(--font-yekan)]">
                          <p className="flex items-center gap-2">
                            <span className="font-semibold">نام تحویل‌گیرنده:</span>
                            {address.name}
                          </p>
                          <p className="flex items-center gap-2">
                            <span className="font-semibold">آدرس:</span>
                            {address.street}
                          </p>
                          <p className="flex items-center gap-2">
                            <span className="font-semibold">شهر:</span>
                            {address.city}، {address.province}
                          </p>
                          <p className="flex items-center gap-2">
                            <span className="font-semibold">کد پستی:</span>
                            {address.postalCode}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Add More Address Button */}
                  {!isAddingAddress && (
                    <div className="text-center">
                      <button
                        onClick={() => setIsAddingAddress(true)}
                        className="bg-amber-100 hover:bg-amber-200 text-amber-700 px-6 py-3 rounded-xl font-[var(--font-yekan)] font-semibold transition-colors flex items-center gap-2 mx-auto"
                      >
                        <FiPlus size={18} />
                        افزودن آدرس جدید
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
                    <FiMapPin className="text-amber-600 text-lg" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2 font-[var(--font-yekan)]">
                      نکات مهم آدرس‌دهی
                    </h3>
                    <ul className="text-gray-700 space-y-2 font-[var(--font-yekan)] text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 mt-1">•</span>
                        <span>آدرس باید به صورت کامل و دقیق وارد شود</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 mt-1">•</span>
                        <span>کد پستی باید ۱۰ رقمی و معتبر باشد</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 mt-1">•</span>
                        <span>نام تحویل‌گیرنده باید مشخص باشد</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 mt-1">•</span>
                        <span>اطمینان حاصل کنید که آدرس قابل دسترسی است</span>
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