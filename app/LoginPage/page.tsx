"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiCoffee, FiSmartphone, FiMessageCircle, FiClock } from "react-icons/fi";
import { useAuth } from "@/contaxt/AuthContext";
import type { User } from "@/contaxt/AuthContext";
import { useRouter } from "next/navigation";

const AUTH_API_BASE_URL = process.env.NEXT_PUBLIC_AUTH_API_BASE_URL ?? "https://coffee-shop-backend-k3un.onrender.com/api/v1/auth";
console.log(AUTH_API_BASE_URL)
// Helper to log API URL for debugging
if (typeof window !== "undefined") {
  console.log("🔗 API Base URL:", AUTH_API_BASE_URL);
}

type ApiResponse<T> = {
  status: number;
  success: boolean;
  data?: T;
  error?: string;
};

type SendOtpResponse = {
  message?: string;
};

type VerifyOtpResponse = {
  message?: string;
  token: string;
  user: User;
};

interface ApiError extends Error {
  status?: number;
}

const sanitizePhoneNumber = (phone: string) => phone.replace(/\s+/g, "");

const isValidPhoneNumber = (phone: string) => /^(?:\+98|0098|0)?9\d{9}$/.test(phone);

const extractCountdownSeconds = (message?: string) => {
  if (!message) return undefined;
  const match = message.match(/(\d{1,2}):(\d{2})/);
  if (!match) return undefined;
  const mins = Number(match[1]);
  const secs = Number(match[2]);
  if (Number.isNaN(mins) || Number.isNaN(secs)) return undefined;
  return mins * 60 + secs;
};

const createApiError = (message: string, status?: number): ApiError => {
  const error = Object.assign(new Error(message), { status }) as ApiError;
  return error;
};

const resolveErrorMessage = (error: unknown) => {
  const defaultMessage = "خطا در برقراری ارتباط با سرور";

  // Handle network errors (fetch fails before getting response)
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

    if (normalizedFallback.includes("phone number is not valid")) {
      return "فرمت شماره موبایل معتبر نیست";
    }

    if (normalizedFallback.includes("otp code is not valid")) {
      return "کد تأیید معتبر نیست";
    }

    if (normalizedFallback.includes("wrong or expired otp") || 
        normalizedFallback.includes("wrong or expired otp !!") ||
        normalizedFallback === "wrong or expired otp") {
      return "کد تأیید اشتباه یا منقضی شده است";
    }

    if (normalizedFallback.includes("otp code is required")) {
      return "وارد کردن کد تأیید الزامی است";
    }

    switch (apiError.status) {
      case 400:
        return fallback || "درخواست نامعتبر است";
      case 401:
        return "لطفاً دوباره وارد شوید";
      case 403:
        return "این شماره موبایل مسدود شده است";
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

// Helper function to translate API messages to Persian
const translateApiMessage = (message?: string): string => {
  if (!message) return "کد تأیید ارسال شد";
  
  const messageLower = message.toLowerCase();
  
  // Success messages
  if (messageLower.includes("otp sent") || 
      messageLower.includes("sent successfully") ||
      messageLower.includes("code sent")) {
    return "کد تأیید با موفقیت ارسال شد";
  }
  
  if (messageLower.includes("verified") || 
      messageLower.includes("verification successful")) {
    return "کد تأیید با موفقیت تأیید شد";
  }
  
  // Countdown messages - extract time but show Persian text
  if (messageLower.includes("please wait") || messageLower.includes("try again")) {
    const timeMatch = message.match(/(\d+)/);
    if (timeMatch) {
      return `لطفاً ${timeMatch[1]} ثانیه دیگر مجدداً تلاش کنید`;
    }
    return "لطفاً چند ثانیه دیگر مجدداً تلاش کنید";
  }
  
  // Default fallback - return original message but you can add more translations as needed
  return message;
};

export default function LoginPage() {
  const [formData, setFormData] = useState({
    phone: "",
    otp: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [infoMessage, setInfoMessage] = useState("");

  const { login } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSendOtp = async () => {
    if (!formData.phone) {
      setError("لطفاً شماره موبایل خود را وارد کنید");
      return;
    }

    const normalizedPhone = sanitizePhoneNumber(formData.phone);

    if (!isValidPhoneNumber(normalizedPhone)) {
      setError("فرمت شماره موبایل معتبر نیست");
      return;
    }

    setIsLoading(true);
    setError("");
    setInfoMessage("");

    try {
      console.log("📤 Sending OTP request to:", `${AUTH_API_BASE_URL}/send`);
      console.log("📱 Phone:", normalizedPhone);
      
      // Retry mechanism for Render sleep mode (free tier)
      // Render free tier sleeps after 15 min, first request may take 30-60 seconds
      let response: Response;
      let retries = 0;
      const maxRetries = 2;
      
      while (retries <= maxRetries) {
        try {
          response = await fetch(`${AUTH_API_BASE_URL}/send`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ phone: normalizedPhone }),
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
      let data: ApiResponse<SendOtpResponse>;
      try {
        data = (await response!.json()) as ApiResponse<SendOtpResponse>;
      } catch {
        // If response is not JSON, it's likely a network/server error
        throw createApiError(
          `سرور پاسخ معتبری ارسال نکرد (کد وضعیت: ${response!.status})`,
          response!.status
        );
      }

      if (!response!.ok || !data.success) {
        throw createApiError(
          data.error || "خطا در ارسال کد تأیید",
          data.status ?? response!.status
        );
      }

      const nextCountdown = extractCountdownSeconds(data.data?.message) ?? 120;
      setCountdown(nextCountdown);
      setOtpSent(true);
      // Use translation function here
      setInfoMessage(translateApiMessage(data.data?.message) || "کد تأیید ارسال شد");
    } catch (err) {
      console.error("OTP sending error:", err);
      setError(resolveErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = () => {
    if (countdown > 0) return;
    setInfoMessage("");
    handleSendOtp();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otpSent) {
      setError("لطفاً ابتدا کد تأیید را دریافت کنید");
      return;
    }

    if (!formData.otp) {
      setError("لطفاً کد تأیید را وارد کنید");
      return;
    }

    const normalizedPhone = sanitizePhoneNumber(formData.phone);

    if (!isValidPhoneNumber(normalizedPhone)) {
      setError("فرمت شماره موبایل معتبر نیست");
      return;
    }

    const otpCode = formData.otp.trim();

    if (!/^\d{6}$/.test(otpCode)) {
      setError("کد تأیید باید ۶ رقم عددی باشد");
      return;
    }

    setIsLoading(true);
    setError("");
    setInfoMessage("");

    try {
      const response = await fetch(`${AUTH_API_BASE_URL}/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: normalizedPhone, otp: otpCode }),
      });

      // Check if response is ok before trying to parse JSON
      let data: ApiResponse<VerifyOtpResponse>;
      try {
        data = (await response.json()) as ApiResponse<VerifyOtpResponse>;
      } catch {
        // If response is not JSON, it's likely a network/server error
        throw createApiError(
          `سرور پاسخ معتبری ارسال نکرد (کد وضعیت: ${response.status})`,
          response.status
        );
      }

      if (!response.ok || !data.success || !data.data) {
        // Log the error for debugging
        console.log("API Error Response:", {
          status: data.status ?? response.status,
          error: data.error,
          success: data.success,
        });
        
        throw createApiError(
          data.error || "خطا در تأیید کد",
          data.status ?? response.status
        );
      }

      const { token, user } = data.data;

      if (!token || !user) {
        throw createApiError("توکن معتبر از سرور دریافت نشد", data.status ?? response.status);
      }

      // Show success message for verification
      setInfoMessage(translateApiMessage(data.data.message) || "ورود موفقیت‌آمیز بود");
      
      login(user, token);
      router.push("/DashboardPage");
    } catch (err) {
      console.error("Login error:", err);
      setError(resolveErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Countdown timer effect
  useEffect(() => {
    if (!otpSent || countdown <= 0) return;

    const interval = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [otpSent, countdown]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 pt-44 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Link href="/" className="inline-block">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center justify-center gap-3 mb-4"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-br from-amber-600 to-amber-700 text-white w-14 h-14 flex items-center justify-center rounded-2xl font-bold text-2xl shadow-lg shadow-amber-600/25"
              >
                <FiCoffee size={24} />
              </motion.div>
              <div className="flex flex-col text-right">
                <span className="text-2xl font-bold text-gray-800 font-[var(--font-yekan)] leading-tight">
                  آی‌کسب
                </span>
                <span className="text-sm text-amber-600 font-[var(--font-yekan)] font-medium">
                  فروش با دستیار هوش مصنوعی
                </span>
              </div>
            </motion.div>
          </Link>
        </motion.div>

        <div className="flex justify-center">
          <div className="w-full max-w-md">
            {/* Login Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-2xl shadow-amber-200/50 border border-amber-200 overflow-hidden"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-6 py-6">
                <h1 className="text-2xl font-bold text-white text-center font-[var(--font-yekan)]">
                  ورود | ثبت‌نام
                </h1>
                <p className="text-amber-100 text-center mt-2 font-[var(--font-yekan)] text-sm">
                  با وارد کردن شماره موبایل، حساب شما ساخته یا وارد می‌شوید
                </p>
              </div>

              {/* Card Body */}
              <div className="p-6">
                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 bg-red-50 border border-red-200 rounded-xl p-4"
                  >
                    <p className="text-red-700 text-sm font-[var(--font-yekan)] text-center">{error}</p>
                  </motion.div>
                )}
                {infoMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 bg-emerald-50 border border-emerald-200 rounded-xl p-4"
                  >
                    <p className="text-emerald-700 text-sm font-[var(--font-yekan)] text-center">{infoMessage}</p>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Phone Number Field */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2 font-[var(--font-yekan)]">
                      شماره موبایل
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <FiSmartphone className="h-5 w-5 text-amber-600" />
                      </div>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        disabled={otpSent}
                        placeholder="09*********"
                        className="w-full pr-10 pl-4 py-3 border-2 border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50/50 transition-all duration-200 font-[var(--font-yekan)] placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  {/* Send OTP Button */}
                  {!otpSent && (
                    <motion.button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={isLoading}
                      whileHover={{ scale: isLoading ? 1 : 1.02 }}
                      whileTap={{ scale: isLoading ? 1 : 0.98 }}
                      className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white py-4 rounded-xl font-semibold shadow-lg shadow-amber-600/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-[var(--font-yekan)]"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>در حال ارسال...</span>
                        </div>
                      ) : (
                        "دریافت کد تأیید"
                      )}
                    </motion.button>
                  )}

                  {/* OTP Field */}
                  {otpSent && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-4"
                    >
                      <div>
                        <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2 font-[var(--font-yekan)]">
                          کد تأیید
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <FiClock className="h-5 w-5 text-amber-600" />
                          </div>
                          <input
                            type="text"
                            id="otp"
                            name="otp"
                            value={formData.otp}
                            onChange={handleChange}
                            required
                            maxLength={6}
                            placeholder="کد ۶ رقمی ارسال شده"
                            className="w-full pr-10 pl-4 py-3 border-2 border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50/50 transition-all duration-200 font-[var(--font-yekan)] placeholder-gray-400 text-center tracking-widest"
                            dir="ltr"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-2 text-center font-[var(--font-yekan)]">
                          کد ۶ رقمی به شماره {formData.phone} ارسال شد
                        </p>
                      </div>

                      {/* Resend OTP */}
                      <div className="text-center">
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          disabled={countdown > 0}
                          className={`text-sm font-[var(--font-yekan)] transition-colors ${
                            countdown > 0
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-amber-600 hover:text-amber-700"
                          }`}
                        >
                          {countdown > 0 ? (
                            <span>ارسال مجدد کد ({formatTime(countdown)})</span>
                          ) : (
                            "ارسال مجدد کد"
                          )}
                        </button>
                      </div>

                      {/* Submit Button */}
                      <motion.button
                        type="submit"
                        disabled={isLoading}
                        whileHover={{ scale: isLoading ? 1 : 1.02 }}
                        whileTap={{ scale: isLoading ? 1 : 0.98 }}
                        className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white py-4 rounded-xl font-semibold shadow-lg shadow-amber-600/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-[var(--font-yekan)]"
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span>در حال ورود...</span>
                          </div>
                        ) : (
                          "ورود به حساب"
                        )}
                      </motion.button>
                    </motion.div>
                  )}
                </form>

                {/* AI Assistant Message */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200 mt-6"
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-2 rounded-full">
                      <FiMessageCircle size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-700 font-[var(--font-yekan)] text-sm leading-relaxed">
                        <span className="font-semibold text-amber-700">دستیار هوش مصنوعی:</span>
                        <br />
                        فقط با وارد کردن شماره موبایل، حساب شما به طور خودکار ساخته می‌شود و می‌توانید از تمام امکانات آی‌کسب استفاده کنید!
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Terms Notice */}
                <div className="mt-6 text-center">
                  <p className="text-gray-500 font-[var(--font-yekan)] text-xs">
                    با ورود یا ثبت‌نام، با{" "}
                    <Link href="/terms" className="text-amber-600 hover:text-amber-700 underline">
                      شرایط و قوانین
                    </Link>{" "}
                    آی‌کسب موافقت می‌کنید
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}