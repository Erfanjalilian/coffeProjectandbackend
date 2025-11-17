"use client";

import { useAuth } from "@/contaxt/AuthContext";
import UserProfileSidebarD from "@/app/Components/userProfileSidebarD";
import { motion } from "framer-motion";
import { FiMapPin, FiPlus, FiEdit, FiTrash2, FiHome, FiBriefcase } from "react-icons/fi";
import { useState } from "react";

export default function AddressesPage() {
  const { user, logout, isLoading } = useAuth();
  
  // State for addresses and form
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    province: "",
    city: "",
    fullAddress: "",
    postalCode: "",
    isDefault: false
  });

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

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      const newAddress = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString()
      };
      
      setAddresses(prev => [newAddress, ...prev]);
      setIsSaving(false);
      setIsAddingAddress(false);
      setFormData({
        title: "",
        province: "",
        city: "",
        fullAddress: "",
        postalCode: "",
        isDefault: false
      });
    }, 1500);
  };

  const handleCancel = () => {
    setIsAddingAddress(false);
    setFormData({
      title: "",
      province: "",
      city: "",
      fullAddress: "",
      postalCode: "",
      isDefault: false
    });
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(prev => prev.filter(address => address.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setAddresses(prev => prev.map(address => ({
      ...address,
      isDefault: address.id === id
    })));
  };

  // Sample provinces and cities for Iran
  const provinces = [
    "تهران",
    "اصفهان",
    "فارس",
    "خراسان رضوی",
    "آذربایجان شرقی",
    "آذربایجان غربی",
    "کرمان",
    "خوزستان",
    "قزوین",
    "قم",
    "البرز",
    "گیلان",
    "مازندران",
    "مرکزی",
    "همدان",
    "کردستان",
    "لرستان",
    "سیستان و بلوچستان",
    "یزد",
    "کرمانشاه",
    "اردبیل",
    "بوشهر",
    "زنجان",
    "سمنان",
    "چهارمحال و بختیاری",
    "هرمزگان",
    "کهگیلویه و بویراحمد",
    "گلستان",
    "ایلام",
    "خراسان شمالی",
    "خراسان جنوبی"
  ];

  const cities = {
    "تهران": ["تهران", "شهریار", "اسلامشهر", "رباط کریم", "پاکدشت"],
    "اصفهان": ["اصفهان", "کاشان", "خمینی شهر", "نجف آباد", "شاهین شهر"],
    "فارس": ["شیراز", "مرودشت", "کازرون", "فسا", "لار"],
    "خراسان رضوی": ["مشهد", "نیشابور", "سبزوار", "تربت حیدریه", "قوچان"]
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center">
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 pt-44 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2 font-[var(--font-yekan)]">
                آدرس‌های من
              </h1>
              <p className="text-gray-600 font-[var(--font-yekan)]">
                مدیریت آدرس‌های تحویل سفارشات
              </p>
            </div>
            <div className="flex items-center gap-3">
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
          {/* Sidebar - Right Side */}
          <div className="lg:col-span-1">
            <UserProfileSidebarD
              userName={getUserDisplayName()}
              userRole={user?.roles?.[0]}
              onLogout={logout}
              activePage="addresses"
            />
          </div>

          {/* Main Content - Left Side */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Add New Address Card */}
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
                        افزودن آدرس جدید
                      </h2>
                      <p className="text-gray-600 font-[var(--font-yekan)] text-sm mt-1">
                        آدرس جدید خود را برای تحویل سفارشات وارد کنید
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSaveAddress}>
                    <div className="space-y-6">
                      {/* Address Title */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 font-[var(--font-yekan)]">
                          عنوان آدرس (اختیاری)
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 font-[var(--font-yekan)]"
                          placeholder="مثال: منزل، محل کار"
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

                      {/* Full Address */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 font-[var(--font-yekan)]">
                          آدرس کامل *
                        </label>
                        <input
                          type="text"
                          name="fullAddress"
                          value={formData.fullAddress}
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

                      {/* Default Address Checkbox */}
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          name="isDefault"
                          checked={formData.isDefault}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-amber-600 border-amber-300 rounded focus:ring-amber-500"
                        />
                        <label className="text-sm text-gray-700 font-[var(--font-yekan)]">
                          تنظیم به عنوان آدرس پیش‌فرض
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
                              افزودن آدرس
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
                        key={address.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-lg border border-amber-200 p-6 hover:shadow-xl transition-all duration-300"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${address.isDefault ? 'bg-amber-100' : 'bg-gray-100'}`}>
                              {address.title?.includes('کار') ? (
                                <FiBriefcase className={`text-lg ${address.isDefault ? 'text-amber-600' : 'text-gray-400'}`} />
                              ) : (
                                <FiHome className={`text-lg ${address.isDefault ? 'text-amber-600' : 'text-gray-400'}`} />
                              )}
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-800 font-[var(--font-yekan)]">
                                {address.title || 'آدرس بدون عنوان'}
                              </h3>
                              {address.isDefault && (
                                <span className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-full font-[var(--font-yekan)]">
                                  پیش‌فرض
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSetDefault(address.id)}
                              className="text-amber-600 hover:text-amber-700 p-2 transition-colors"
                              title="تنظیم به عنوان پیش‌فرض"
                            >
                              <FiMapPin size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteAddress(address.id)}
                              className="text-red-600 hover:text-red-700 p-2 transition-colors"
                              title="حذف آدرس"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600 font-[var(--font-yekan)]">
                          <p className="flex items-center gap-2">
                            <span className="font-semibold">آدرس:</span>
                            {address.fullAddress}
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
                        <span>می‌توانید یک آدرس را به عنوان پیش‌فرض تنظیم کنید</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 mt-1">•</span>
                        <span>آدرس پیش‌فرض برای تحویل سریع‌تر سفارشات استفاده می‌شود</span>
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