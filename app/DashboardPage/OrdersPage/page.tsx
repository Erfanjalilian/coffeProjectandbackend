"use client";

import { useAuth } from "@/contaxt/AuthContext";
import UserProfileSidebarD from "@/app/Components/userProfileSidebarD";
import { motion, AnimatePresence } from "framer-motion";
import { FiCoffee, FiUser, FiHeart, FiMapPin, FiCreditCard, FiMessageCircle, FiEdit, FiShield, FiTruck, FiMenu, FiX, FiSettings, FiPackage, FiClock, FiCheckCircle, FiTruck as FiShipping, FiHome } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Types based on your API structure
interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  priceAfterDiscount: number;
  images: string[];
  slug: string;
  rating: number;
  stock: number;
}

interface OrderItem {
  _id: string;
  product: Product;
  quantity: number;
  priceAtTimeOfAdding: number;
}

interface ShippingAddress {
  coordinates: {
    lat: string;
    lng: string;
  };
  postalCode: string;
  address: string;
  cityId: number;
}

interface Order {
  _id: string;
  user: {
    _id: string;
    phone: string;
    username: string;
    roles: string[];
  };
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  authority: string;
  createdAt?: string;
  updatedAt?: string;
  __v: number;
}

interface OrdersResponse {
  status: number;
  success: boolean;
  data: {
    orders: Order[];
    pagination: {
      page: number;
      limit: number;
      totalPage: number;
      totalOrders: number;
    };
  };
}

export default function OrdersPage() {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check authentication on component mount
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    } else if (!isLoading && isAuthenticated) {
      setIsCheckingAuth(false);
      fetchOrders();
    }
  }, [isAuthenticated, isLoading, router]);

  // Fetch user orders and filter by current user
  const fetchOrders = async () => {
    try {
      setIsLoadingOrders(true);
      setError(null);
      const token = localStorage.getItem("token");

      // Check if user is available
      if (!user?._id) {
        throw new Error('اطلاعات کاربر در دسترس نیست');
      }

      const response = await fetch('https://coffee-shop-backend-k3un.onrender.com/api/v1/order/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('خطا در دریافت اطلاعات سفارشات');
      }

      const data: OrdersResponse = await response.json();
      
      if (data.success && data.data?.orders) {
        // Filter orders to show only the current user's orders
        const userOrders = data.data.orders.filter(order => 
          order.user._id === user._id
        );
        
        setOrders(userOrders);
      } else {
        throw new Error('خطا در دریافت اطلاعات سفارشات');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطای ناشناخته');
      console.error('Error fetching orders:', err);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [router]);

  // Get status badge color and text
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'PENDING':
        return { color: 'bg-yellow-100 text-yellow-800', text: 'در انتظار پرداخت', icon: FiClock };
      case 'PROCESSING':
        return { color: 'bg-blue-100 text-blue-800', text: 'در حال پردازش', icon: FiPackage };
      case 'SHIPPED':
        return { color: 'bg-purple-100 text-purple-800', text: 'ارسال شده', icon: FiShipping };
      case 'DELIVERED':
        return { color: 'bg-green-100 text-green-800', text: 'تحویل شده', icon: FiCheckCircle };
      case 'CANCELLED':
        return { color: 'bg-red-100 text-red-800', text: 'لغو شده', icon: FiX };
      default:
        return { color: 'bg-gray-100 text-gray-800', text: status, icon: FiPackage };
    }
  };

  // Format price to Persian currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  // Calculate total order price
  const calculateOrderTotal = (order: Order) => {
    return order.items.reduce((total, item) => total + (item.priceAtTimeOfAdding * item.quantity), 0);
  };

  // Get user's display name for sidebar
  const getUserWelcomeName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.phone || "کاربر";
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

  // If not authenticated, don't render anything (will redirect in useEffect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 pt-44 pb-12" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Menu Button */}
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

        {/* Mobile Menu */}
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
                userName={getUserWelcomeName()}
                userRole={user?.roles?.[0]}
                onLogout={logout}
                activePage="orders"
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2 font-[var(--font-yekan)] text-center lg:text-right">
            سفارش‌های من
          </h1>
          <p className="text-gray-600 font-[var(--font-yekan)] text-center lg:text-right">
            مدیریت و پیگیری سفارش‌های شما
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Hidden on mobile */}
          <div className="hidden lg:block lg:col-span-1">
            <UserProfileSidebarD
              userName={getUserWelcomeName()}
              userRole={user?.roles?.[0]}
              onLogout={logout}
              activePage="orders"
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* Stats Overview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-lg border border-amber-200 text-center">
                  <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                    <FiPackage className="text-amber-600 text-xl" />
                  </div>
                  <p className="text-gray-600 font-[var(--font-yekan)] text-sm">کل سفارشات</p>
                  <p className="text-2xl font-bold text-gray-800 font-[var(--font-yekan)]">{orders.length}</p>
                </div>
                
                <div className="bg-white rounded-xl p-4 shadow-lg border border-amber-200 text-center">
                  <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                    <FiClock className="text-blue-600 text-xl" />
                  </div>
                  <p className="text-gray-600 font-[var(--font-yekan)] text-sm">در حال پردازش</p>
                  <p className="text-2xl font-bold text-gray-800 font-[var(--font-yekan)]">
                    {orders.filter(order => order.status === 'PROCESSING').length}
                  </p>
                </div>
                
                <div className="bg-white rounded-xl p-4 shadow-lg border border-amber-200 text-center">
                  <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                    <FiShipping className="text-purple-600 text-xl" />
                  </div>
                  <p className="text-gray-600 font-[var(--font-yekan)] text-sm">ارسال شده</p>
                  <p className="text-2xl font-bold text-gray-800 font-[var(--font-yekan)]">
                    {orders.filter(order => order.status === 'SHIPPED').length}
                  </p>
                </div>
                
                <div className="bg-white rounded-xl p-4 shadow-lg border border-amber-200 text-center">
                  <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                    <FiCheckCircle className="text-green-600 text-xl" />
                  </div>
                  <p className="text-gray-600 font-[var(--font-yekan)] text-sm">تحویل شده</p>
                  <p className="text-2xl font-bold text-gray-800 font-[var(--font-yekan)]">
                    {orders.filter(order => order.status === 'DELIVERED').length}
                  </p>
                </div>
              </div>

              {/* Orders List */}
              <div className="bg-white rounded-2xl shadow-lg border border-amber-200 overflow-hidden">
                <div className="p-6 border-b border-amber-200">
                  <h2 className="text-xl font-bold text-gray-800 font-[var(--font-yekan)] flex items-center gap-2">
                    <FiPackage className="text-amber-600" />
                    لیست سفارش‌ها
                  </h2>
                  <p className="text-gray-500 text-sm mt-1 font-[var(--font-yekan)]">
                    نمایش سفارش‌های کاربر: {getUserWelcomeName()}
                  </p>
                </div>

                {isLoadingOrders ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-[var(--font-yekan)]">در حال بارگذاری سفارش‌ها...</p>
                  </div>
                ) : error ? (
                  <div className="p-8 text-center">
                    <FiPackage className="text-gray-300 text-4xl mx-auto mb-3" />
                    <p className="text-gray-600 font-[var(--font-yekan)] mb-4">{error}</p>
                    <button
                      onClick={fetchOrders}
                      className="bg-amber-600 hover:bg-amber-700 text-white py-2 px-6 rounded-xl font-[var(--font-yekan)] transition-colors"
                    >
                      تلاش مجدد
                    </button>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="p-8 text-center">
                    <FiPackage className="text-gray-300 text-4xl mx-auto mb-3" />
                    <p className="text-gray-600 font-[var(--font-yekan)] mb-2">شما هنوز هیچ سفارشی ثبت نکرده‌اید</p>
                    <p className="text-gray-500 text-sm mb-4 font-[var(--font-yekan)]">
                      اولین سفارش خود را ثبت کنید و از محصولات ما لذت ببرید
                    </p>
                    <Link href="/products">
                      <button className="bg-amber-600 hover:bg-amber-700 text-white py-2 px-6 rounded-xl font-[var(--font-yekan)] transition-colors">
                        مشاهده محصولات و ثبت سفارش
                      </button>
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-amber-100">
                    {orders.map((order) => {
                      const statusInfo = getStatusInfo(order.status);
                      const StatusIcon = statusInfo.icon;
                      const totalPrice = calculateOrderTotal(order);
                      
                      return (
                        <motion.div
                          key={order._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-6 hover:bg-amber-50 transition-colors"
                        >
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            {/* Order Info */}
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold font-[var(--font-yekan)] flex items-center gap-1 ${statusInfo.color}`}>
                                  <StatusIcon size={14} />
                                  {statusInfo.text}
                                </span>
                                <span className="text-gray-500 text-sm font-[var(--font-yekan)]">
                                  کد سفارش: {order.authority}
                                </span>
                              </div>
                              
                              <div className="space-y-2">
                                {order.items.map((item) => (
                                  <div key={item._id} className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                                      <FiCoffee className="text-amber-600" />
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-gray-800 font-[var(--font-yekan)] font-semibold">
                                        {item.product.name}
                                      </p>
                                      <p className="text-gray-600 font-[var(--font-yekan)] text-sm">
                                        {item.quantity} عدد × {formatPrice(item.priceAtTimeOfAdding)}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              
                              <div className="mt-3 flex items-center gap-4 text-sm text-gray-600 font-[var(--font-yekan)]">
                                <div className="flex items-center gap-1">
                                  <FiHome size={14} />
                                  <span>{order.shippingAddress.address}</span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Order Actions */}
                            <div className="flex flex-col items-end gap-3">
                              <div className="text-left">
                                <p className="text-lg font-bold text-gray-800 font-[var(--font-yekan)]">
                                  {formatPrice(totalPrice)}
                                </p>
                                <p className="text-gray-500 text-sm font-[var(--font-yekan)]">
                                  {order.items.reduce((sum, item) => sum + item.quantity, 0)} کالا
                                </p>
                              </div>
                              
                              <div className="flex gap-2">
                                <button className="bg-amber-100 hover:bg-amber-200 text-amber-700 py-2 px-4 rounded-lg font-[var(--font-yekan)] text-sm transition-colors">
                                  پیگیری سفارش
                                </button>
                                <button className="bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 py-2 px-4 rounded-lg font-[var(--font-yekan)] text-sm transition-colors">
                                  جزئیات
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-2xl shadow-lg border border-amber-200 p-6 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-amber-100 p-2 rounded-full">
                      <FiCoffee className="text-amber-600 text-lg" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 font-[var(--font-yekan)]">
                      ادامه خرید
                    </h3>
                  </div>
                  <p className="text-gray-600 font-[var(--font-yekan)] text-sm mb-4">
                    از محصولات جدید و ویژه ما دیدن کنید
                  </p>
                  <Link href="/products">
                    <button className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-xl font-[var(--font-yekan)] font-semibold transition-colors">
                      مشاهده محصولات
                    </button>
                  </Link>
                </motion.div>

                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-2xl shadow-lg border border-amber-200 p-6 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-amber-100 p-2 rounded-full">
                      <FiMessageCircle className="text-amber-600 text-lg" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 font-[var(--font-yekan)]">
                      پشتیبانی
                    </h3>
                  </div>
                  <p className="text-gray-600 font-[var(--font-yekan)] text-sm mb-4">
                    در صورت وجود مشکل در سفارش با ما تماس بگیرید
                  </p>
                  <Link href="/support">
                    <button className="w-full bg-amber-100 hover:bg-amber-200 text-amber-700 py-2 rounded-xl font-[var(--font-yekan)] font-semibold transition-colors">
                      تماس با پشتیبانی
                    </button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}