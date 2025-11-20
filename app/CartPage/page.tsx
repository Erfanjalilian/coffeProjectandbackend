"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { FiTrash2, FiShoppingCart, FiCheckCircle, FiTruck, FiShield, FiGift, FiClock, FiPackage, FiHeart, FiAward, FiCreditCard, FiRefreshCw, FiHeadphones, FiChevronRight, FiChevronLeft, FiMessageCircle, FiZap } from "react-icons/fi";
import { useCart, CartProduct } from "@/contaxt/CartContext";

type Product = {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category?: string;
  badge?: string;
  rating?: number;
  reviews?: number;
  isPrime?: boolean;
  discount?: number;
  type?: string;
  description?: string;
  dealType?: string;
  timeLeft?: string;
  soldCount?: number;
  totalCount?: number;
  isPremium?: boolean;
  features?: string[];
};

export default function CartPage(): React.ReactElement {
  const cartContext = useCart();
  const { cart, removeFromCart, updateQuantity, clearCart, addToCart } = cartContext;

  const [products, setProducts] = useState<Product[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);

  // Refs for scrollable containers
  const alsoBoughtRef = useRef<HTMLDivElement>(null);
  const recentlyViewedRef = useRef<HTMLDivElement>(null);

  // Fetch products from your API
  useEffect(() => {
    let mounted = true;
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch("https://6810ff2827f2fdac24139dec.mockapi.io/Product");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as Product[];
        if (mounted) {
          setProducts(data);
        }
      } catch (e) {
        console.error("Failed to fetch products:", e);
        if (mounted) setError("خطا در دریافت اطلاعات محصولات.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchProducts();
    return () => {
      mounted = false;
    };
  }, []);

  // Build recently viewed
  useEffect(() => {
    if (products.length > 0) {
      const sample = [...products].sort(() => 0.5 - Math.random()).slice(0, 8);
      setRecentlyViewed(sample);
    }
  }, [products]);

  // Scroll functions for Also Bought section
  const scrollAlsoBoughtLeft = () => {
    if (alsoBoughtRef.current) {
      alsoBoughtRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollAlsoBoughtRight = () => {
    if (alsoBoughtRef.current) {
      alsoBoughtRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  // Scroll functions for Recently Viewed section
  const scrollRecentlyViewedLeft = () => {
    if (recentlyViewedRef.current) {
      recentlyViewedRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRecentlyViewedRight = () => {
    if (recentlyViewedRef.current) {
      recentlyViewedRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  // Calculate prices only when cart has items
  const totalPrice = cart.length > 0 ? cart.reduce((acc, item) => acc + (typeof item.price === 'string' ? parseFloat(item.price) : item.price) * item.quantity, 0) : 0;
  const shippingCost = cart.length > 0 ? (totalPrice > 500000 ? 0 : 30000) : 0;
  const discountAmount = cart.length > 0 ? (totalPrice * discount) / 100 : 0;
  const finalPrice = cart.length > 0 ? totalPrice + shippingCost - discountAmount : 0;
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const applyCoupon = () => {
    if (cart.length === 0) {
      alert("سبد خرید شما خالی است");
      return;
    }
    if (couponCode === "DISCOUNT10") {
      setDiscount(10);
    } else if (couponCode === "DISCOUNT20") {
      setDiscount(20);
    } else {
      setDiscount(0);
      alert("کد تخفیف معتبر نیست");
    }
  };

  const formatCurrency = (n: number) =>
    n.toLocaleString("fa-IR") + " تومان";

const convertToCartProduct = (product: Product): Omit<CartProduct, "quantity"> => ({
  id: product.id.toString(),   // تبدیل به رشته
  name: product.name,
  price: product.price          // حتما عدد باشد
});

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 pt-54 font-[var(--font-yekan)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* PROMOTIONAL BANNER */}
        <div className="mb-8 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-center text-center">
            <div className="flex items-center gap-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-full">
                <FiAward className="text-white" size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1">فروش ویژه زمستانه! ❄️</h2>
                <p className="text-amber-100 text-lg">
                  تا <span className="font-bold text-white">۵۰٪</span> تخفیف روی تمام محصولات + ارسال رایگان برای سفارش‌های بالای ۵۰۰,۰۰۰ تومان
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* STEP INDICATOR - FIXED */}
        <div className="flex items-center justify-between mb-8 text-amber-800">
          {[
            { id: 1, label: "سبد خرید" },
            { id: 2, label: "اطلاعات ارسال" },
            { id: 3, label: "پرداخت" },
            { id: 4, label: "تایید نهایی" },
          ].map((step, idx) => (
            <div key={step.id} className="flex-1 flex flex-col items-center relative">
              <div className={`w-9 h-9 flex items-center justify-center rounded-full border-2 ${idx === 0 ? "bg-amber-600 border-amber-600 text-white" : "border-amber-300 text-amber-700"}`}>
                {idx === 0 ? <FiCheckCircle /> : step.id}
              </div>
              <span className="mt-2 text-sm font-medium text-center px-1">{step.label}</span>
              {/* FIXED: Changed idx < 3 to idx < 4 to include all connections */}
              {idx < 3 && (
                <div className="absolute top-4 left-[60%] right-[-20%]">
                  <div className="h-[2px] bg-amber-200 w-full" />
                </div>
              )}
            </div>
          ))}
        </div>

        <h1 className="text-3xl font-bold mb-6 text-amber-900">سبد خرید</h1>

        {/* MAIN GRID: products (span 2) + summary (span 1) on md+ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT/MIDDLE: Cart items & carousels */}
          <div className="lg:col-span-2 space-y-8">

            {/* Cart Items */}
            <div className="space-y-4">
              {cart.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl border border-amber-200 text-center shadow-sm">
                  <FiShoppingCart className="mx-auto text-amber-300 mb-4" size={64} />
                  <h3 className="text-2xl font-bold text-amber-800 mb-3">سبد خرید شما خالی است</h3>
                  <p className="text-amber-600 text-lg">می‌توانید از محصولات زیر برای افزودن به سبد خرید استفاده کنید</p>
                </div>
              ) : (
                cart.map((item) => {
                  const itemPrice = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
                  return (
                    <div
                      key={item.id}
                      className="grid grid-cols-1 md:grid-cols-[150px_1fr_120px] items-center gap-6 bg-white p-6 rounded-2xl border border-amber-200 shadow-sm hover:shadow-md transition"
                    >
                      {/* LEFT: total price per item */}
                      <div className="order-1 md:order-none flex flex-col items-start">
                        <span className="text-xl font-bold text-amber-900">
                          {formatCurrency(itemPrice * item.quantity)}
                        </span>
                        <span className="text-xs text-amber-500 mt-1">جمع آیتم</span>
                      </div>

                      {/* MIDDLE: product info, qty controls */}
                      <div className="order-3 md:order-none flex flex-col justify-between h-full text-right">
                        <h3 className="font-bold text-gray-800 text-lg mb-2">{item.name}</h3>
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-sm text-amber-700">قیمت واحد: {formatCurrency(itemPrice)}</span>
                        </div>

                        <div className="flex items-center gap-3 mt-auto">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="w-10 h-10 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition flex items-center justify-center font-bold text-lg"
                            aria-label="decrement"
                          >
                            -
                          </button>
                          <span className="font-bold text-lg min-w-10 text-center bg-amber-50 py-1 rounded-md">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-10 h-10 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition flex items-center justify-center font-bold text-lg"
                            aria-label="increment"
                          >
                            +
                          </button>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="mr-auto text-red-500 hover:text-red-600 transition p-2 hover:bg-red-50 rounded-lg"
                            aria-label="remove"
                          >
                            <FiTrash2 size={20} />
                          </button>
                        </div>
                      </div>

                      {/* RIGHT: image */}
                     
                    </div>
                  );
                })
              )}
            </div>

            {/* Only show these sections when cart is NOT empty */}
            {cart.length > 0 && (
              <>
                {/* Also Bought Section - Full width container with single row horizontal scrolling */}
                <section className="w-full bg-white p-6 rounded-2xl border border-amber-200 shadow-sm relative">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <FiGift className="text-amber-600 flex-shrink-0" size={24} />
                      <h2 className="text-2xl font-bold text-amber-900">خریداران این محصولات، این کالاها را هم خریده‌اند</h2>
                    </div>
                    
                    {/* Navigation buttons for Also Bought */}
                    <div className="flex gap-2">
                      <button
                        onClick={scrollAlsoBoughtLeft}
                        className="w-10 h-10 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition flex items-center justify-center"
                        aria-label="Scroll left"
                      >
                        <FiChevronRight size={20} />
                      </button>
                      <button
                        onClick={scrollAlsoBoughtRight}
                        className="w-10 h-10 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition flex items-center justify-center"
                        aria-label="Scroll right"
                      >
                        <FiChevronLeft size={20} />
                      </button>
                    </div>
                  </div>
                  
                  {loading && (
                    <div className="text-amber-600 text-center py-8 text-lg">در حال بارگذاری...</div>
                  )}
                  {error && (
                    <div className="text-red-500 text-center py-8 text-lg">{error}</div>
                  )}
                  
                  {/* Single row with horizontal scrolling */}
                  <div 
                    ref={alsoBoughtRef}
                    className="w-full flex flex-row gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-amber-300 scrollbar-track-amber-100"
                  >
                    {products.slice(0, 8).map((p) => (
                      <div key={p.id} className="flex-none w-72 bg-amber-50 rounded-2xl p-5 border border-amber-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
                        <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4">
                          <Image src={p.image} alt={p.name} fill className="object-cover hover:scale-105 transition duration-300" />
                        </div>
                        <h3 className="font-bold text-base text-amber-900 line-clamp-2 flex-grow mb-3">{p.name}</h3>
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-amber-700 text-lg font-bold">{formatCurrency(p.price)}</p>
                          {p.originalPrice && p.originalPrice > p.price && (
                            <p className="text-gray-500 text-sm line-through">{formatCurrency(p.originalPrice)}</p>
                          )}
                        </div>
                        <button
                          onClick={() => addToCart?.(convertToCartProduct(p))}
                          className="w-full bg-amber-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-3 hover:bg-amber-700 transition text-base"
                        >
                          <FiShoppingCart />
                          افزودن به سبد خرید
                        </button>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Recently Viewed Section - Full width container with single row horizontal scrolling */}
                <section className="w-full bg-white p-6 rounded-2xl border border-amber-200 shadow-sm relative">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <FiClock className="text-amber-600 flex-shrink-0" size={24} />
                      <h2 className="text-2xl font-bold text-amber-900">کالاهایی که اخیراً مشاهده کرده‌اید</h2>
                    </div>
                    
                    {/* Navigation buttons for Recently Viewed */}
                    <div className="flex gap-2">
                      <button
                        onClick={scrollRecentlyViewedLeft}
                        className="w-10 h-10 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition flex items-center justify-center"
                        aria-label="Scroll left"
                      >
                        <FiChevronRight size={20} />
                      </button>
                      <button
                        onClick={scrollRecentlyViewedRight}
                        className="w-10 h-10 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition flex items-center justify-center"
                        aria-label="Scroll right"
                      >
                        <FiChevronLeft size={20} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Single row with horizontal scrolling */}
                  <div 
                    ref={recentlyViewedRef}
                    className="w-full flex flex-row gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-amber-300 scrollbar-track-amber-100"
                  >
                    {recentlyViewed.map((p) => (
                      <div key={p.id} className="flex-none w-72 bg-amber-50 rounded-2xl p-5 border border-amber-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
                        <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4">
                          <Image src={p.image} alt={p.name} fill className="object-cover hover:scale-105 transition duration-300" />
                        </div>
                        <h3 className="font-bold text-base text-amber-900 line-clamp-2 flex-grow mb-3">{p.name}</h3>
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-amber-700 text-lg font-bold">{formatCurrency(p.price)}</p>
                          {p.originalPrice && p.originalPrice > p.price && (
                            <p className="text-gray-500 text-sm line-through">{formatCurrency(p.originalPrice)}</p>
                          )}
                        </div>
                        <button
                          onClick={() => addToCart?.(convertToCartProduct(p))}
                          className="w-full bg-amber-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-3 hover:bg-amber-700 transition text-base"
                        >
                          <FiShoppingCart />
                          افزودن به سبد خرید
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}
          </div>

          {/* RIGHT: Enhanced Order Summary (sidebar) */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Order Summary Box */}
            <div className="sticky top-28 bg-white p-6 rounded-2xl border border-amber-200 shadow-sm">
              <h3 className="text-xl font-bold text-amber-900 mb-6 pb-3 border-b border-amber-100 text-center">خلاصه سفارش</h3>

              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <FiShoppingCart className="mx-auto text-amber-300 mb-4" size={48} />
                  <p className="text-amber-600">سبد خرید شما خالی است</p>
                  <p className="text-amber-500 text-sm mt-2">برای مشاهده خلاصه سفارش، محصولی به سبد خرید اضافه کنید</p>
                </div>
              ) : (
                <>
                  {/* Order Details */}
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                      <span className="text-amber-700">تعداد کالاها</span>
                      <span className="font-semibold text-amber-900">{totalItems} عدد</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-amber-700">جمع محصولات</span>
                      <span className="font-semibold text-amber-900">{formatCurrency(totalPrice)}</span>
                    </div>
                    
                    {discount > 0 && (
                      <div className="flex justify-between items-center bg-green-50 p-3 rounded-lg border border-green-200">
                        <span className="text-green-700">تخفیف ({discount}%)</span>
                        <span className="font-semibold text-green-700">-{formatCurrency(discountAmount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <span className="text-amber-700">هزینه ارسال</span>
                      <span className={`font-semibold ${shippingCost === 0 ? 'text-green-600' : 'text-amber-900'}`}>
                        {shippingCost === 0 ? 'رایگان' : formatCurrency(shippingCost)}
                      </span>
                    </div>

                    {shippingCost > 0 && (
                      <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
                        <span className="font-medium">ارسال رایگان برای سفارش‌های بالای </span>
                        {formatCurrency(500000)}
                      </div>
                    )}

                    {/* Order Info */}
                    <div className="pt-3 border-t border-amber-100 space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-amber-600">تعداد اقلام متفاوت</span>
                        <span className="font-medium">{cart.length} قلم</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-amber-600">زمان تحویل تخمینی</span>
                        <span className="font-medium text-green-600">۲-۳ روز کاری</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-amber-600">امکان بازگشت کالا</span>
                        <span className="font-medium text-green-600">تا ۷ روز</span>
                      </div>
                    </div>
                  </div>

                  {/* Discount coupon */}
                  <div className="mb-6">
                    <label className="block text-amber-700 text-sm font-medium mb-3">کد تخفیف دارید؟</label>
                    <div className="flex gap-2 mb-2">
                      <input 
                        type="text" 
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="کد تخفیف را وارد کنید"
                        className="flex-1 border border-amber-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                      <button 
                        onClick={applyCoupon}
                        className="bg-amber-500 text-white px-4 py-3 rounded-lg text-sm hover:bg-amber-600 transition font-medium min-w-20"
                      >
                        اعمال
                      </button>
                    </div>
                    <div className="text-xs text-amber-600">
                      کدهای تخفیف: <span className="font-mono bg-amber-100 px-2 py-1 rounded">DISCOUNT10</span> - <span className="font-mono bg-amber-100 px-2 py-1 rounded">DISCOUNT20</span>
                    </div>
                  </div>

                  {/* Final Price */}
                  <div className="flex justify-between items-center mb-6 pt-4 border-t border-amber-200 bg-amber-50 p-4 rounded-lg">
                    <span className="text-lg font-bold text-amber-900">مبلغ قابل پرداخت</span>
                    <span className="font-bold text-2xl text-amber-900">{formatCurrency(finalPrice)}</span>
                  </div>

                  {/* Trust badges */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <FiShield className="text-blue-500 flex-shrink-0" size={18} />
                      <span className="text-sm text-blue-700">ضمانت اصل بودن کالا</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <FiTruck className="text-green-500 flex-shrink-0" size={18} />
                      <span className="text-sm text-green-700">ارسال اکسپرس (۲۴ ساعته)</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <FiPackage className="text-purple-500 flex-shrink-0" size={18} />
                      <span className="text-sm text-purple-700">بسته‌بندی مطمئن</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                      <FiHeart className="text-red-500 flex-shrink-0" size={18} />
                      <span className="text-sm text-red-700">پشتیبانی ۲۴/۷</span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="space-y-3">
                    <button 
                      className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-4 rounded-xl font-semibold hover:from-amber-700 hover:to-amber-800 transition shadow-md text-lg"
                    >
                      ادامه فرایند خرید
                    </button>

                    <button 
                      onClick={clearCart} 
                      className="w-full bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition text-base"
                    >
                      خالی کردن سبد خرید
                    </button>
                    
                    <button className="w-full border border-amber-300 text-amber-700 py-3 rounded-lg font-semibold hover:bg-amber-50 transition text-base">
                      ادامه خرید در فروشگاه
                    </button>
                  </div>
                </>
              )}

              {/* Security notice - Always show */}
              <div className="mt-6 pt-4 border-t border-amber-100">
                <div className="flex items-center justify-center gap-2 text-xs text-amber-600 text-center leading-relaxed">
                  <FiShield className="flex-shrink-0" size={14} />
                  اطلاعات شما نزد ما امن است و مطابق با قوانین حریم خصوصی محافظت می‌شود
                </div>
              </div>
            </div>

            {/* AI Assistance Box */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-start gap-4">
                <div className="bg-green-500 p-3 rounded-full flex-shrink-0">
                  <FiZap className="text-white" size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <FiMessageCircle className="text-green-600" size={18} />
                    <h3 className="font-bold text-green-900 text-lg">دستیار هوش مصنوعی</h3>
                  </div>
                  <p className="text-green-800 text-sm leading-relaxed mb-4">
                    برای هر محصولی که می‌خواهید بخرید، می‌توانید از من کمک بگیرید. 
                    <span className="font-semibold text-green-900"> من اینجام در خدمت شما!</span>
                  </p>
                  <div className="bg-white rounded-lg p-3 border border-green-200">
                    <p className="text-green-700 text-xs mb-2 font-medium">من می‌توانم به شما کمک کنم:</p>
                    <ul className="text-green-600 text-xs space-y-1">
                      <li className="flex items-center gap-1">
                        <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                        محصولات مشابه را پیشنهاد بدهم
                      </li>
                      <li className="flex items-center gap-1">
                        <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                        در مقایسه محصولات کمک کنم
                      </li>
                      <li className="flex items-center gap-1">
                        <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                        به سوالات شما پاسخ بدم
                      </li>
                    </ul>
                  </div>
                  <button className="w-full mt-4 bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition text-sm flex items-center justify-center gap-2">
                    <FiMessageCircle size={16} />
                    گفتگو با دستیار هوشمند
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* FEATURES SECTION - Bottom of the page */}
        <div className="mt-12 bg-white rounded-2xl border border-amber-200 shadow-sm p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1: Express Delivery */}
            <div className="flex flex-col items-center text-center p-4 hover:bg-amber-50 rounded-xl transition duration-300">
              <div className="bg-green-100 p-4 rounded-full mb-4">
                <FiTruck className="text-green-600" size={32} />
              </div>
              <h3 className="font-bold text-amber-900 text-lg mb-2">ارسال اکسپرس</h3>
              <p className="text-amber-700 text-sm leading-relaxed">
                تحویل سریع در تهران تا ۲۴ ساعت و در سایر شهرها تا ۴۸ ساعت
              </p>
            </div>

            {/* Feature 2: Cash on Delivery */}
            <div className="flex flex-col items-center text-center p-4 hover:bg-amber-50 rounded-xl transition duration-300">
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <FiCreditCard className="text-blue-600" size={32} />
              </div>
              <h3 className="font-bold text-amber-900 text-lg mb-2">پرداخت در محل</h3>
              <p className="text-amber-700 text-sm leading-relaxed">
                امکان پرداخت نقدی یا کارتی در زمان تحویل کالا
              </p>
            </div>

            {/* Feature 3: Return Policy */}
            <div className="flex flex-col items-center text-center p-4 hover:bg-amber-50 rounded-xl transition duration-300">
              <div className="bg-purple-100 p-4 rounded-full mb-4">
                <FiRefreshCw className="text-purple-600" size={32} />
              </div>
              <h3 className="font-bold text-amber-900 text-lg mb-2">بازگشت ۷ روزه</h3>
              <p className="text-amber-700 text-sm leading-relaxed">
                امکان بازگرداندن کالا تا ۷ روز پس از تحویل بدون نیاز به دلیل
              </p>
            </div>

            {/* Feature 4: Support */}
            <div className="flex flex-col items-center text-center p-4 hover:bg-amber-50 rounded-xl transition duration-300">
              <div className="bg-red-100 p-4 rounded-full mb-4">
                <FiHeadphones className="text-red-600" size={32} />
              </div>
              <h3 className="font-bold text-amber-900 text-lg mb-2">پشتیبانی ۲۴/۷</h3>
              <p className="text-amber-700 text-sm leading-relaxed">
                پشتیبانی تلفنی و آنلاین در تمام ساعات شبانه‌روز
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}