"use client";

import { useAuth } from "@/contaxt/AuthContext";
import UserProfileSidebarD from "@/app/Components/userProfileSidebarD";
import { motion } from "framer-motion";
import { FiUser, FiSave, FiArrowRight, FiCheck, FiEdit } from "react-icons/fi";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
    const normalizedFallback = fallback.toLowerCase();

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
  
  // Parse the full name from user data
  const getUserFullName = () => {
    return user?.name || "";
  };

  // State for form fields - only name (combined first + last) and username
  const [formData, setFormData] = useState({
    name: getUserFullName(),
    username: user?.username || "",
    phone: user?.phone || ""
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Get user's display name for sidebar
  const getUserDisplayName = () => {
    if (user?.name) {
      return user.name;
    }
    return user?.phone || "کاربر";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user starts typing
    if (error) setError("");
    if (successMessage) setSuccessMessage("");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw createApiError("لطفاً دوباره وارد شوید", 401);
      }

      console.log("📤 Sending profile update request to:", `${API_BASE_URL}/users/profile`);
      console.log("📝 Update data:", formData);

      // Retry mechanism for Render sleep mode (similar to login component)
      let response: Response;
      let retries = 0;
      const maxRetries = 2;
      
      while (retries <= maxRetries) {
        try {
          response = await fetch(`${API_BASE_URL}/users/profile`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
              name: formData.name,
              username: formData.username
              // Only sending name and username, no firstName/lastName
            }),
          });
          break; // Success, exit retry loop
        } catch (fetchError) {
          retries++;
          if (retries > maxRetries) {
            throw fetchError; // Re-throw if all retries failed
          }
          // Wait before retry (exponential backoff: 2s, 4s)
          await new Promise(resolve => setTimeout(resolve, 2000 * retries));
          console.log(`🔄 Retry attempt ${retries}/${maxRetries}... (Render may be waking up)`);
        }
      }

      console.log("📥 Response status:", response!.status);
      console.log("📥 Response ok:", response!.ok);

      // Check if response is ok before trying to parse JSON
      let data: ApiResponse<any>;
      try {
        data = (await response!.json()) as ApiResponse<any>;
      } catch {
        // If response is not JSON, it's likely a network/server error
        throw createApiError(
          `سرور پاسخ معتبری ارسال نکرد (کد وضعیت: ${response!.status})`,
          response!.status
        );
      }

      if (!response!.ok || !data.success) {
        throw createApiError(
          data.error || "خطا در به‌روزرسانی پروفایل",
          data.status ?? response!.status
        );
      }

      // Update user context with new data
      if (updateUser && data.data) {
        updateUser(data.data);
      }

      setSuccessMessage("اطلاعات پروفایل با موفقیت به‌روزرسانی شد");
      setIsEditing(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

    } catch (err) {
      console.error("Profile update error:", err);
      setError(resolveErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: getUserFullName(),
      username: user?.username || "",
      phone: user?.phone || ""
    });
    setIsEditing(false);
    setError("");
    setSuccessMessage("");
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

  // If not authenticated, redirect (handled by useEffect in parent)
  if (!isAuthenticated) {
    return null;
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
                اطلاعات شخصی
              </h1>
              <p className="text-gray-600 font-[var(--font-yekan)]">
                مدیریت و به‌روزرسانی اطلاعات حساب کاربری
              </p>
            </div>
            <div className="flex items-center gap-3">
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-xl font-[var(--font-yekan)] font-semibold transition-colors flex items-center gap-2"
                >
                  <FiEdit size={18} />
                  ویرایش اطلاعات
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
              activePage="profile"
            />
          </div>

          {/* Main Content - Left Side */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
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
                      اطلاعات شخصی و هویتی شما در این بخش قابل مدیریت است
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
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 font-[var(--font-yekan)] disabled:bg-gray-50 disabled:text-gray-500"
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
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 font-[var(--font-yekan)] disabled:bg-gray-50 disabled:text-gray-500"
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
                          {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fa-IR') : '---'}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {isEditing && (
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
                              <FiSave size={18} />
                              ذخیره تغییرات
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
                    )}
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
                      نکات مهم
                    </h3>
                    <ul className="text-gray-700 space-y-2 font-[var(--font-yekan)] text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 mt-1">•</span>
                        <span>اطلاعات شخصی شما برای بهبود تجربه خرید و ارائه خدمات بهتر استفاده می‌شود</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 mt-1">•</span>
                        <span>نام کامل باید مطابق با کارت شناسایی شما باشد</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 mt-1">•</span>
                        <span>شماره موبایل برای ورود به حساب و بازیابی رمز عبور استفاده می‌شود</span>
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