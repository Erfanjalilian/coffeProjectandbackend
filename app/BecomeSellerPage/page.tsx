"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import { FiUser, FiMail, FiPhone, FiMapPin, FiCoffee, FiPackage, FiTruck, FiAward, FiCheck, FiArrowRight } from "react-icons/fi";

export default function BecomeSellerPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    productType: "",
    experience: "",
    description: ""
  });

  const benefits = [
    {
      icon: <FiUser className="text-amber-600" size={24} />,
      title: "پروفایل فروشنده اختصاصی",
      description: "صفحه فروشگاه شخصی با قابلیت سفارشی‌سازی"
    },
    {
      icon: <FiPackage className="text-amber-600" size={24} />,
      title: "مدیریت آسان محصولات",
      description: "سیستم مدیریت محصولات پیشرفته و کاربرپسند"
    },
    {
      icon: <FiTruck className="text-amber-600" size={24} />,
      title: "پشتیبانی لجستیک",
      description: "همکاری با بهترین شرکت‌های حمل و نقل"
    },
    {
      icon: <FiAward className="text-amber-600" size={24} />,
      title: "گواهی فروشنده معتبر",
      description: "دریافت گواهی رسمی فروشنده پریمیوم"
    }
  ];

  const requirements = [
    "دارا بودن مجوزهای قانونی مرتبط",
    "تضمین کیفیت محصولات",
    "قیمت‌گذاری رقابتی و منصفانه",
    "پشتیبانی مشتریان ۲۴ ساعته",
    "ارسال به موقع سفارشات"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted:", formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white pt-34">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-gray-600 mb-8 font-[var(--font-yekan)]"
        >
          <span className="hover:text-amber-700 cursor-pointer">خانه</span>
          <span className="mx-2">/</span>
          <span className="text-amber-700 font-semibold">فروشنده شوید</span>
        </motion.div>

        {/* Hero Section - Updated to match Product Categories page size */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-2xl shadow-lg border border-amber-200 p-6 mb-12"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-amber-500 rounded-full p-3">
                <FiUser className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-amber-800 mb-1 font-[var(--font-yekan)]">
                  فروشنده شوید و کسب‌وکار خود را رشد دهید
                </h3>
                <p className="text-amber-700 font-[var(--font-yekan)] text-sm">
                  به خانواده بزرگ فروشندگان قهوه ما بپیوندید و محصولات خود را به هزاران مشتری مشتاق عرضه کنید
                </p>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg font-[var(--font-yekan)] whitespace-nowrap"
            >
              <FiUser size={18} />
              <span>ثبت‌نام فروشنده</span>
            </motion.button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Benefits Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg border border-amber-200 p-6 mb-8"
            >
              <h2 className="text-2xl font-bold text-amber-800 mb-6 font-[var(--font-yekan)] flex items-center gap-2">
                <FiAward className="text-amber-600" />
                مزایای همکاری با ما
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex items-start gap-4 p-4 rounded-xl bg-amber-50 border border-amber-200 hover:border-amber-300 transition-all group"
                  >
                    <div className="bg-white p-3 rounded-xl shadow-sm group-hover:shadow-md transition-shadow">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 mb-2 font-[var(--font-yekan)]">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed font-[var(--font-yekan)]">
                        {benefit.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Requirements Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl shadow-lg border border-amber-200 p-6"
            >
              <h2 className="text-2xl font-bold text-amber-800 mb-6 font-[var(--font-yekan)]">
                شرایط لازم برای فروشندگی
              </h2>
              
              <div className="space-y-3">
                {requirements.map((requirement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/80 backdrop-blur-sm"
                  >
                    <div className="bg-amber-100 text-amber-600 p-1 rounded-full">
                      <FiCheck size={14} />
                    </div>
                    <span className="text-gray-700 font-[var(--font-yekan)]">{requirement}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Application Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg border border-amber-200 p-6 sticky top-32"
          >
            <h2 className="text-2xl font-bold text-amber-800 mb-6 font-[var(--font-yekan)] text-center">
              درخواست همکاری
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-[var(--font-yekan)]">
                  نام و نام خانوادگی
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full pr-3 pl-10 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all font-[var(--font-yekan)]"
                    placeholder="نام کامل خود را وارد کنید"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-[var(--font-yekan)]">
                  ایمیل
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pr-3 pl-10 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all font-[var(--font-yekan)]"
                    placeholder="example@email.com"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-[var(--font-yekan)]">
                  شماره تماس
                </label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full pr-3 pl-10 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all font-[var(--font-yekan)]"
                    placeholder="09XXXXXXXXX"
                  />
                </div>
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-[var(--font-yekan)]">
                  شهر
                </label>
                <div className="relative">
                  <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full pr-3 pl-10 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all font-[var(--font-yekan)]"
                    placeholder="شهر خود را وارد کنید"
                  />
                </div>
              </div>

              {/* Product Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-[var(--font-yekan)]">
                  نوع محصولات
                </label>
                <div className="relative">
                  <FiCoffee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    name="productType"
                    value={formData.productType}
                    onChange={handleChange}
                    required
                    className="w-full pr-3 pl-10 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all font-[var(--font-yekan)] appearance-none bg-white"
                  >
                    <option value="">انتخاب کنید</option>
                    <option value="coffee-beans">دانه قهوه</option>
                    <option value="equipment">تجهیزات قهوه</option>
                    <option value="accessories">لوازم جانبی</option>
                    <option value="tea">چای و دمنوش</option>
                    <option value="other">سایر</option>
                  </select>
                </div>
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-[var(--font-yekan)]">
                  سابقه فعالیت
                </label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                  className="w-full pr-3 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all font-[var(--font-yekan)] appearance-none bg-white"
                >
                  <option value="">انتخاب کنید</option>
                  <option value="less-than-1">کمتر از ۱ سال</option>
                  <option value="1-3">۱ تا ۳ سال</option>
                  <option value="3-5">۳ تا ۵ سال</option>
                  <option value="more-than-5">بیش از ۵ سال</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-[var(--font-yekan)]">
                  توضیحات بیشتر
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all font-[var(--font-yekan)] resize-none"
                  placeholder="در مورد کسب‌وکار و محصولات خود توضیح دهید..."
                />
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white py-4 rounded-xl font-semibold transition-all shadow-lg font-[var(--font-yekan)] flex items-center justify-center gap-2"
              >
                <span>ارسال درخواست</span>
                <FiArrowRight className="transform rotate-180" />
              </motion.button>
            </form>

            {/* Contact Info */}
            <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
              <p className="text-sm text-gray-600 text-center font-[var(--font-yekan)]">
                برای اطلاعات بیشتر با پشتیبانی تماس بگیرید
              </p>
              <p className="text-amber-700 font-bold text-center mt-2 font-[var(--font-yekan)]">
                ۰۲۱-۱۲۳۴۵۶۷۸
              </p>
            </div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl shadow-lg p-8 text-white"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">۵۰۰+</div>
              <div className="text-amber-100 font-[var(--font-yekan)]">فروشنده فعال</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">۵۰,۰۰۰+</div>
              <div className="text-amber-100 font-[var(--font-yekan)]">محصول متنوع</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">۹۸%</div>
              <div className="text-amber-100 font-[var(--font-yekan)]">رضایت فروشندگان</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">۲۴/۷</div>
              <div className="text-amber-100 font-[var(--font-yekan)]">پشتیبانی</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}