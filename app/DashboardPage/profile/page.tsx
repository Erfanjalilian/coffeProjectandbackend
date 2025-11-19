"use client";

import { useAuth } from "@/contaxt/AuthContext";
import UserProfileSidebarD from "@/app/Components/userProfileSidebarD";
import { motion, AnimatePresence } from "framer-motion";
import { FiUser, FiSave, FiCheck, FiSettings } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_AUTH_API_BASE_URL ?? "https://coffee-shop-backend-k3un.onrender.com/api/v1";

// API Response Type
type ApiResponse<T> = {
  status: number;
  success: boolean;
  data?: T;
  error?: string;
};

// Error Handling
interface ApiError extends Error {
  status?: number;
}

const createApiError = (message: string, status?: number): ApiError => {
  const error = Object.assign(new Error(message), { status }) as ApiError;
  return error;
};

const resolveErrorMessage = (error: unknown) => {
  const defaultMessage = "خطا در برقراری ارتباط با سرور";

  if (error instanceof TypeError) {
    const errorMessage = error.message.toLowerCase();
    if (errorMessage.includes("failed to fetch") || errorMessage.includes("networkerror") || errorMessage.includes("network error")) {
      return "سرور در حال راه‌اندازی است. لطفاً چند ثانیه صبر کنید و دوباره تلاش کنید";
    }
    return "مشکل اتصال به اینترنت. لطفاً اتصال خود را بررسی کنید";
  }

  if (error && typeof error === "object" && "status" in error) {
    const apiError = error as ApiError;
    const fallback = apiError.message || defaultMessage;
    switch (apiError.status) {
      case 400:
        return fallback || "درخواست نامعتبر است";
      case 401:
        return "لطفاً دوباره وارد شوید";
      case 403:
        return "شما دسترسی لازم برای این عملیات را ندارید";
      case 404:
        return "اطلاعات کاربر یافت نشد";
      case 500:
        return "خطای داخلی سرور، لطفاً دوباره تلاش کنید";
      default:
        return fallback || defaultMessage;
    }
  }

  if (error instanceof Error) {
    const errorMessage = error.message.toLowerCase();
    if (errorMessage.includes("network") || errorMessage.includes("fetch")) {
      return "سرور در دسترس نیست. لطفاً دوباره تلاش کنید";
    }
    return error.message || defaultMessage;
  }

  return defaultMessage;
};

export default function ProfilePage() {
  const { user, logout, isAuthenticated, isLoading, updateUser } = useAuth();
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Parse the full name from user data
  const getUserFullName = () => {
    return user?.username || ""; // API فعلی name ندارد، از username استفاده می‌کنیم
  };

  // State for form fields
  const [formData, setFormData] = useState({
    name: getUserFullName(),
    username: user?.username || "",
    phone: user?.phone || ""
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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

  // Track if form has been modified
  const isFormModified = formData.name !== getUserFullName() || formData.username !== (user?.username || "");

  // Get user's display name for sidebar
  const getUserDisplayName = () => {
    return user?.username || user?.phone || "کاربر"; // نام کاربری یا شماره موبایل
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError("");
    if (successMessage) setSuccessMessage("");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormModified) {
      setSuccessMessage("هیچ تغییری اعمال نشده است");
      setTimeout(() => setSuccessMessage(""), 3000);
      return;
    }

    setIsSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      const token = localStorage.getItem('token');
      if (!token) throw createApiError("لطفاً دوباره وارد شوید", 401);

      const response = await fetch(`${API_BASE_URL}/user/${user?._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: formData.username,
          name: formData.name, // اگر backend از name پشتیبانی می‌کند
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw createApiError(errData.error || "خطا در بروزرسانی پروفایل", response.status);
      }

      const data = await response.json();

      // بروزرسانی Context کاربر
      if (updateUser && data?.data) {
        updateUser(data.data);
      }

      setSuccessMessage("اطلاعات پروفایل با موفقیت به‌روزرسانی شد");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Profile update error:", err);
      setError(resolveErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: getUserFullName(),
      username: user?.username || "",
      phone: user?.phone || ""
    });
    setError("");
    setSuccessMessage("");
  };

  if (isLoading || isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center" dir="rtl">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-[var(--font-yekan)]">در حال بارگذاری...</p>
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 pt-44 pb-12" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                activePage="profile"
                isMobile={true}
                onNavigate={() => setIsMobileMenuOpen(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2 font-[var(--font-yekan)] text-center lg:text-right">
                اطلاعات شخصی
              </h1>
              <p className="text-gray-600 font-[var(--font-yekan)] text-center lg:text-right">
                مدیریت و به‌روزرسانی اطلاعات حساب کاربری
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="hidden lg:block lg:col-span-1">
            <UserProfileSidebarD
              userName={getUserDisplayName()}
              userRole={user?.roles?.[0]}
              onLogout={logout}
              activePage="profile"
            />
          </div>

          <div className="lg:col-span-3">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-red-700 text-sm font-[var(--font-yekan)] text-center">{error}</p>
                </motion.div>
              )}

              {successMessage && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <p className="text-emerald-700 text-sm font-[var(--font-yekan)] text-center">{successMessage}</p>
                </motion.div>
              )}

              <div className="bg-white rounded-2xl shadow-lg border border-amber-200 p-6 mb-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-amber-100 p-3 rounded-full">
                    <FiUser className="text-amber-600 text-xl" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 font-[var(--font-yekan)]">اطلاعات حساب کاربری</h2>
                    <p className="text-gray-600 font-[var(--font-yekan)] text-sm mt-1">
                      اطلاعات شخصی و هویتی شما در این بخش قابل مدیریت است
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSave}>
                  <div className="space-y-6">
                    {/* Full Name Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 font-[var(--font-yekan)]">نام کامل</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 font-[var(--font-yekan)] bg-white"
                        placeholder="نام و نام خانوادگی خود را وارد کنید"
                      />
                      {!formData.name && (
                        <p className="text-amber-600 text-xs mt-2 font-[var(--font-yekan)]">نام کامل شما هنوز ثبت نشده است</p>
                      )}
                    </div>

                    {/* Username Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 font-[var(--font-yekan)]">نام کاربری</label>
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
                      <label className="block text-sm font-medium text-gray-700 mb-2 font-[var(--font-yekan)]">شماره موبایل</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={true}
                        className="w-full px-4 py-3 border border-amber-200 rounded-xl bg-gray-50 text-gray-500 font-[var(--font-yekan)]"
                        placeholder="09xxxxxxxxx"
                      />
                      <p className="text-gray-500 text-xs mt-2 font-[var(--font-yekan)]">شماره موبایل قابل تغییر نیست</p>
                    </div>

                    {/* Membership Date */}
                    <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 font-[var(--font-yekan)] text-sm">تاریخ عضویت:</span>
                        <span className="text-gray-800 font-[var(--font-yekan)] font-semibold">
                          {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fa-IR') : '---'}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3 pt-4">
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
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
                <div className="flex items-start gap-4">
                  <div className="bg-amber-100 p-2 rounded-full mt-1">
                    <FiCheck className="text-amber-600 text-lg" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2 font-[var(--font-yekan)]">نکات مهم</h3>
                    <ul className="text-gray-700 space-y-2 font-[var(--font-yekan)] text-sm">
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
