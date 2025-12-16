"use client";

import React, { useEffect, useState, useRef } from "react";
import { FiTrash2, FiShoppingCart, FiCheckCircle, FiGift, FiChevronRight, FiChevronLeft, FiMessageCircle, FiZap, FiCoffee } from "react-icons/fi";
import { useCart, CartProduct } from "@/contaxt/CartContext";

type Product = {
  id: string;
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  priceAfterDiscount?: number;
  image: string;
  images: string[];
  category?: {
    _id: string;
    name: string;
    slug: string;
  };
  categoryName?: string;
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
  brand?: string;
  weight?: number;
  ingredients?: string;
  benefits?: string;
  howToUse?: string;
  hasWarranty?: boolean;
  warrantyDuration?: number;
  warrantyDescription?: string;
};

export default function CartPage(): React.ReactElement {
  const cartContext = useCart();
  const { cart, removeFromCart, updateQuantity, clearCart, addToCart } = cartContext;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);

  // Ref for scrollable container
  const similarProductsRef = useRef<HTMLDivElement>(null);

  // Fetch products from YOUR ACTUAL API
  useEffect(() => {
    let mounted = true;
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // USING YOUR ACTUAL API ENDPOINT
        const res = await fetch("https://coffee-shop-backend-k3un.onrender.com/api/v1/product");
        
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        
        const data = await res.json();
        console.log("API Response:", data); // Debug log
        
  if (mounted && data.success && Array.isArray(data.data?.products)) {
  const transformedProducts = data.data.products.map((product: any) => ({
    id: product._id,
    _id: product._id,
    name: product.name,
    price: product.price,
    originalPrice: product.originalPrice,
    priceAfterDiscount: product.priceAfterDiscount,
    image: product.image,
    images: product.images || [],
    category: product.category,
    categoryName: product.category?.name,
    badge: product.badge,
    rating: product.rating || 0,
    reviews: product.reviews || 0,
    isPrime: product.isPrime,
    discount: product.discount,
    type: product.type,
    description: product.description,
    dealType: product.dealType,
    timeLeft: product.timeLeft,
    soldCount: product.soldCount,
    totalCount: product.totalCount,
    isPremium: product.isPremium,
    features: product.features || [],
    brand: product.brand,
    weight: product.weight,
    ingredients: product.ingredients,
    benefits: product.benefits,
    howToUse: product.howToUse,
    hasWarranty: product.hasWarranty,
    warrantyDuration: product.warrantyDuration,
    warrantyDescription: product.warrantyDescription
  }));

  setProducts(transformedProducts);
} else {
  console.error("Invalid API response format:", data);
  setError("خطا در دریافت اطلاعات محصولات از سرور.");
}

      } catch (e) {
        console.error("Failed to fetch products from API:", e);
        if (mounted) setError("خطا در دریافت اطلاعات محصولات از سرور.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchProducts();
    return () => {
      mounted = false;
    };
  }, []);

  // Get similar products based on categories in cart - USING REAL API DATA
  const getSimilarProducts = () => {
    if (cart.length === 0 || products.length === 0) {
      console.log("Cart empty or no products available");
      return [];
    }

    console.log("Available products from API:", products);
    console.log("Current cart items:", cart);

    // Get unique category IDs from cart items
    const cartCategoryIds = cart
      .map(item => {
        // Find the product in our REAL products list to get its category
        const product = products.find(p => p.id === item.id);
        console.log(`Cart item ${item.id} -> Product:`, product);
        return product?.category?._id;
      })
      .filter(Boolean) // Remove undefined values
      .filter((categoryId, index, self) => self.indexOf(categoryId) === index); // Remove duplicates

    console.log("Cart category IDs:", cartCategoryIds);

    // If no categories found, return random products from REAL API
    if (cartCategoryIds.length === 0) {
      console.log("No categories found, returning random products");
      const randomProducts = [...products]
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.min(8, products.length));
      console.log("Random products selected:", randomProducts);
      return randomProducts;
    }

    // Filter REAL products that belong to the same categories as cart items
    // Exclude products that are already in the cart
    const cartProductIds = cart.map(item => item.id);
    const similarProducts = products.filter(product => {
      const isSameCategory = cartCategoryIds.includes(product.category?._id);
      const isNotInCart = !cartProductIds.includes(product.id);
      console.log(`Product ${product.name}: sameCategory=${isSameCategory}, notInCart=${isNotInCart}`);
      return isSameCategory && isNotInCart;
    });

    console.log("Similar products found:", similarProducts);

    // If not enough similar products, add some random ones from REAL API
    if (similarProducts.length < 8) {
      const additionalProducts = products
        .filter(product => !cartProductIds.includes(product.id) && !similarProducts.some(p => p.id === product.id))
        .sort(() => 0.5 - Math.random())
        .slice(0, 8 - similarProducts.length);
      
      console.log("Additional products added:", additionalProducts);
      const finalProducts = [...similarProducts, ...additionalProducts].slice(0, 8);
      console.log("Final similar products:", finalProducts);
      return finalProducts;
    }

    const finalProducts = similarProducts.slice(0, 8);
    console.log("Final similar products (enough found):", finalProducts);
    return finalProducts;
  };

  // Scroll functions for Similar Products section
  const scrollSimilarProductsLeft = () => {
    if (similarProductsRef.current) {
      similarProductsRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollSimilarProductsRight = () => {
    if (similarProductsRef.current) {
      similarProductsRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  // Calculate prices only when cart has items
  const totalPrice = cart.length > 0 ? cart.reduce((acc, item) => acc + (typeof item.price === 'string' ? parseFloat(item.price) : item.price) * item.quantity, 0) : 0;
  const discountAmount = cart.length > 0 ? (totalPrice * discount) / 100 : 0;
  const finalPrice = cart.length > 0 ? totalPrice - discountAmount : 0;
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
    id: product.id,
    name: product.name,
    price: product.priceAfterDiscount || product.price
  });

  const similarProducts = getSimilarProducts();

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-b from-[#F5F5F5] to-white pt-54 font-[var(--font-yekan)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 md:pb-8"> {/* Added padding-bottom for mobile fixed buttons */}

        {/* STEP INDICATOR - IMPROVED FOR MOBILE */}
        <div className="mb-8">
          {/* Desktop View - Horizontal Steps */}
          <div className="hidden md:flex items-center justify-between text-[#1F2A3F]">
            {[
              { id: 1, label: "سبد خرید" },
              { id: 2, label: "اطلاعات ارسال" },
              { id: 3, label: "پرداخت" },
              { id: 4, label: "تایید نهایی" },
            ].map((step, idx) => (
              <div key={step.id} className="flex-1 flex flex-col items-center relative">
                <div className={`w-9 h-9 flex items-center justify-center rounded-full border-2 ${idx === 0 ? "bg-[#3366CC] border-[#3366CC] text-white" : "border-[#A4ABFA] text-[#2F2F2F]"}`}>
                  {idx === 0 ? <FiCheckCircle /> : step.id}
                </div>
                <span className="mt-2 text-sm font-medium text-center px-1">{step.label}</span>
                {idx < 3 && ( // Changed from idx < 3 to idx < 4 to include connection to step 4
                  <div className="absolute top-4 left-[60%] right-[-20%]">
                    <div className="h-[2px] bg-[#A4ABFA] w-full" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile View - Clean Vertical/Collapsed Steps */}
          <div className="md:hidden">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#1F2A3F]">مراحل خرید</h2>
              <div className="flex items-center gap-2 text-sm text-[#3366CC]">
                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-[#3366CC] text-white">
                  1
                </div>
                <span>از 4</span>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-[#A4ABFA] bg-opacity-30 h-2 rounded-full mb-3">
              <div className="w-1/4 h-full bg-[#3366CC] rounded-full"></div>
            </div>
            
            {/* Step Labels - Compact */}
            <div className="flex justify-between text-xs text-[#2F2F2F]">
              <div className="flex flex-col items-center">
                <span className="font-bold text-[#3366CC]">سبد خرید</span>
                <span className="mt-1">✓</span>
              </div>
              <div className="flex flex-col items-center">
                <span>اطلاعات ارسال</span>
                <span className="mt-1">○</span>
              </div>
              <div className="flex flex-col items-center">
                <span>پرداخت</span>
                <span className="mt-1">○</span>
              </div>
              <div className="flex flex-col items-center">
                <span>تایید نهایی</span>
                <span className="mt-1">○</span>
              </div>
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-6 text-[#1F2A3F]">سبد خرید</h1>

        {/* MAIN GRID: products (span 2) + summary (span 1) on md+ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT/MIDDLE: Cart items & carousels */}
          <div className="lg:col-span-2 space-y-8">

            {/* Cart Items */}
            <div className="space-y-4">
              {cart.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl border border-[#A4ABFA] text-center shadow-sm">
                  <FiShoppingCart className="mx-auto text-[#3366CC] mb-4" size={64} />
                  <h3 className="text-2xl font-bold text-[#1F2A3F] mb-3">سبد خرید شما خالی است</h3>
                  <p className="text-[#2F2F2F] text-lg">می‌توانید از محصولات زیر برای افزودن به سبد خرید استفاده کنید</p>
                </div>
              ) : (
                cart.map((item) => {
                  const itemPrice = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
                  return (
                    <div
                      key={item.id}
                      className="grid grid-cols-1 md:grid-cols-[150px_1fr_120px] items-center gap-6 bg-white p-6 rounded-2xl border border-[#A4ABFA] shadow-sm hover:shadow-md transition"
                    >
                      {/* LEFT: total price per item */}
                      <div className="order-1 md:order-none flex flex-col items-start">
                        <span className="text-xl font-bold text-[#1F2A3F]">
                          {formatCurrency(itemPrice * item.quantity)}
                        </span>
                        <span className="text-xs text-[#2F2F2F] mt-1">جمع آیتم</span>
                      </div>

                      {/* MIDDLE: product info, qty controls */}
                      <div className="order-3 md:order-none flex flex-col justify-between h-full text-right">
                        <h3 className="font-bold text-[#1F2A3F] text-lg mb-2">{item.name}</h3>
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-sm text-[#3366CC]">قیمت واحد: {formatCurrency(itemPrice)}</span>
                        </div>

                        <div className="flex items-center gap-3 mt-auto">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="w-10 h-10 bg-[#A4ABFA] text-white rounded-lg hover:bg-[#8B94F7] transition flex items-center justify-center font-bold text-lg"
                            aria-label="decrement"
                          >
                            -
                          </button>
                          <span className="font-bold text-lg min-w-10 text-center bg-[#F5F5F5] py-1 rounded-md text-[#1F2A3F]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-10 h-10 bg-[#A4ABFA] text-white rounded-lg hover:bg-[#8B94F7] transition flex items-center justify-center font-bold text-lg"
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

                      {/* RIGHT: Coffee icon instead of image */}
                      <div className="order-2 md:order-none flex justify-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-[#A4ABFA] to-[#8B94F7] rounded-xl flex items-center justify-center">
                          <FiCoffee className="text-white" size={32} />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Only show these sections when cart is NOT empty */}
            {cart.length > 0 && (
              <>
                {/* Similar Products Section - Full width container with single row horizontal scrolling */}
                <section className="w-full bg-white p-6 rounded-2xl border border-[#A4ABFA] shadow-sm relative">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <FiGift className="text-[#F3801F] flex-shrink-0" size={24} />
                      <h2 className="text-2xl font-bold text-[#1F2A3F]">محصولات مشابه</h2>
                    </div>
                    
                    {/* Navigation buttons for Similar Products */}
                    <div className="flex gap-2">
                      <button
                        onClick={scrollSimilarProductsLeft}
                        className="w-10 h-10 bg-[#A4ABFA] text-white rounded-lg hover:bg-[#8B94F7] transition flex items-center justify-center"
                        aria-label="Scroll left"
                      >
                        <FiChevronRight size={20} />
                      </button>
                      <button
                        onClick={scrollSimilarProductsRight}
                        className="w-10 h-10 bg-[#A4ABFA] text-white rounded-lg hover:bg-[#8B94F7] transition flex items-center justify-center"
                        aria-label="Scroll right"
                      >
                        <FiChevronLeft size={20} />
                      </button>
                    </div>
                  </div>
                  
                  {loading && (
                    <div className="text-[#3366CC] text-center py-8 text-lg">در حال بارگذاری محصولات مشابه...</div>
                  )}
                  {error && (
                    <div className="text-red-500 text-center py-8 text-lg">{error}</div>
                  )}
                  
                  {/* Single row with horizontal scrolling */}
                  <div 
                    ref={similarProductsRef}
                    className="w-full flex flex-row gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-[#A4ABFA] scrollbar-track-[#F5F5F5]"
                  >
                    {!loading && similarProducts.length > 0 ? (
                      similarProducts.map((p) => (
                        <div key={p.id} className="flex-none w-72 bg-white rounded-2xl p-5 border border-[#A4ABFA] shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
                          {/* Coffee icon instead of product image */}
                          <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4 bg-gradient-to-br from-[#A4ABFA] to-[#8B94F7] flex items-center justify-center">
                            <FiCoffee className="text-white" size={64} />
                            {p.badge && (
                              <div className="absolute top-3 left-3">
                                <span className="bg-[#F3801F] text-white text-xs px-2 py-1 rounded-full font-bold">
                                  {p.badge}
                                </span>
                              </div>
                            )}
                          </div>
                          
                          <h3 className="font-bold text-base text-[#1F2A3F] line-clamp-2 flex-grow mb-3">{p.name}</h3>
                          
                          {/* Category badge */}
                          {p.categoryName && (
                            <div className="mb-2">
                              <span className="text-xs bg-[#A4ABFA] text-white px-2 py-1 rounded-full">
                                {p.categoryName}
                              </span>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between mb-4">
                            <p className="text-[#1F2A3F] text-lg font-bold">
                              {formatCurrency(p.priceAfterDiscount || p.price)}
                            </p>
                            {p.originalPrice && p.originalPrice > (p.priceAfterDiscount || p.price) && (
                              <p className="text-[#2F2F2F] text-sm line-through">
                                {formatCurrency(p.originalPrice)}
                              </p>
                            )}
                          </div>
                          
                          <button
                            onClick={() => addToCart?.(convertToCartProduct(p))}
                            className="w-full bg-[#F3801F] text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-3 hover:bg-[#E5720C] transition text-base"
                          >
                            <FiShoppingCart />
                            افزودن به سبد خرید
                          </button>
                        </div>
                      ))
                    ) : (
                      !loading && (
                        <div className="w-full text-center py-8 text-[#3366CC]">
                          {products.length === 0 ? "هیچ محصولی در فروشگاه موجود نیست" : "محصول مشابهی یافت نشد"}
                        </div>
                      )
                    )}
                  </div>
                </section>
              </>
            )}
          </div>

          {/* RIGHT: Enhanced Order Summary (sidebar) */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Order Summary Box */}
            <div className="sticky top-28 bg-white p-6 rounded-2xl border border-[#A4ABFA] shadow-sm">
              <h3 className="text-xl font-bold text-[#1F2A3F] mb-6 pb-3 border-b border-[#A4ABFA] text-center">خلاصه سفارش</h3>

              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <FiShoppingCart className="mx-auto text-[#3366CC] mb-4" size={48} />
                  <p className="text-[#2F2F2F]">سبد خرید شما خالی است</p>
                  <p className="text-[#2F2F2F] text-sm mt-2">برای مشاهده خلاصه سفارش، محصولی به سبد خرید اضافه کنید</p>
                </div>
              ) : (
                <>
                  {/* Order Details */}
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center p-3 bg-[#F5F5F5] rounded-lg">
                      <span className="text-[#2F2F2F]">تعداد کالاها</span>
                      <span className="font-semibold text-[#1F2A3F]">{totalItems} عدد</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-[#2F2F2F]">جمع محصولات</span>
                      <span className="font-semibold text-[#1F2A3F]">{formatCurrency(totalPrice)}</span>
                    </div>
                    
                    {discount > 0 && (
                      <div className="flex justify-between items-center bg-green-50 p-3 rounded-lg border border-green-200">
                        <span className="text-green-700">تخفیف ({discount}%)</span>
                        <span className="font-semibold text-green-700">-{formatCurrency(discountAmount)}</span>
                      </div>
                    )}
                  </div>

                  {/* Final Price */}
                  <div className="flex justify-between items-center mb-6 pt-4 border-t border-[#A4ABFA] bg-[#F5F5F5] p-4 rounded-lg">
                    <span className="text-lg font-bold text-[#1F2A3F]">مبلغ قابل پرداخت</span>
                    <span className="font-bold text-2xl text-[#1F2A3F]">{formatCurrency(finalPrice)}</span>
                  </div>

                  {/* Action buttons - RESTORED for desktop */}
                  <div className="space-y-3">
                    <button 
                      className="w-full bg-gradient-to-r from-[#3366CC] to-[#2A55A3] text-white py-4 rounded-xl font-semibold hover:from-[#2A55A3] hover:to-[#1F2A3F] transition shadow-md text-lg"
                    >
                      ادامه فرایند خرید
                    </button>

                    <button 
                      onClick={clearCart} 
                      className="w-full bg-[#2F2F2F] text-white py-3 rounded-lg font-semibold hover:bg-[#1F2A3F] transition text-base"
                    >
                      خالی کردن سبد خرید
                    </button>
                    
                    <button className="w-full border border-[#3366CC] text-[#3366CC] py-3 rounded-lg font-semibold hover:bg-[#F5F5F5] transition text-base">
                      ادامه خرید در فروشگاه
                    </button>
                  </div>
                </>
              )}

              {/* Security notice - Always show */}
              <div className="mt-6 pt-4 border-t border-[#A4ABFA]">
                <div className="flex items-center justify-center gap-2 text-xs text-[#2F2F2F] text-center leading-relaxed">
                  اطلاعات شما نزد ما امن است و مطابق با قوانین حریم خصوصی محافظت می‌شود
                </div>
              </div>
            </div>

            {/* AI Assistance Box */}
            <div className="bg-gradient-to-br from-[#F5F5F5] to-white border border-[#A4ABFA] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-start gap-4">
                <div className="bg-[#3366CC] p-3 rounded-full flex-shrink-0">
                  <FiZap className="text-white" size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <FiMessageCircle className="text-[#3366CC]" size={18} />
                    <h3 className="font-bold text-[#1F2A3F] text-lg">دستیار هوش مصنوعی</h3>
                  </div>
                  <p className="text-[#2F2F2F] text-sm leading-relaxed mb-4">
                    برای هر محصولی که می‌خواهید بخرید، می‌توانید از من کمک بگیرید. 
                    <span className="font-semibold text-[#1F2A3F]"> من اینجام در خدمت شما!</span>
                  </p>
                  <div className="bg-white rounded-lg p-3 border border-[#A4ABFA]">
                    <p className="text-[#1F2A3F] text-xs mb-2 font-medium">من می‌توانم به شما کمک کنم:</p>
                    <ul className="text-[#2F2F2F] text-xs space-y-1">
                      <li className="flex items-center gap-1">
                        <div className="w-1 h-1 bg-[#3366CC] rounded-full"></div>
                        محصولات مشابه را پیشنهاد بدهم
                      </li>
                      <li className="flex items-center gap-1">
                        <div className="w-1 h-1 bg-[#3366CC] rounded-full"></div>
                        در مقایسه محصولات کمک کنم
                      </li>
                      <li className="flex items-center gap-1">
                        <div className="w-1 h-1 bg-[#3366CC] rounded-full"></div>
                        به سوالات شما پاسخ بدم
                      </li>
                    </ul>
                  </div>
                  <button className="w-full mt-4 bg-[#3366CC] text-white py-2 rounded-lg font-semibold hover:bg-[#2A55A3] transition text-sm flex items-center justify-center gap-2">
                    <FiMessageCircle size={16} />
                    گفتگو با دستیار هوشمند
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Mobile Fixed Action Buttons - Only shown on mobile and when cart has items */}
        {cart.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#A4ABFA] p-4 shadow-lg z-50 md:hidden">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex flex-col space-y-3">
                {/* Final Price Display */}
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-[#1F2A3F]">مبلغ قابل پرداخت:</span>
                  <span className="font-bold text-xl text-[#1F2A3F]">{formatCurrency(finalPrice)}</span>
                </div>
                
                {/* Action Buttons */}
                <button 
                  className="w-full bg-gradient-to-r from-[#3366CC] to-[#2A55A3] text-white py-4 rounded-xl font-semibold hover:from-[#2A55A3] hover:to-[#1F2A3F] transition shadow-md text-lg"
                >
                  ادامه فرایند خرید
                </button>

                <div className="flex gap-3">
                  <button 
                    onClick={clearCart} 
                    className="flex-1 bg-[#2F2F2F] text-white py-3 rounded-lg font-semibold hover:bg-[#1F2A3F] transition text-base"
                  >
                    خالی کردن سبد خرید
                  </button>
                  
                  <button className="flex-1 border border-[#3366CC] text-[#3366CC] py-3 rounded-lg font-semibold hover:bg-[#F5F5F5] transition text-base">
                    ادامه خرید
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}