"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  category?: string;
  badge?: string;
  rating: number;
}

export default function AboutSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState<boolean>(false);
  const [showRightArrow, setShowRightArrow] = useState<boolean>(true);

  const featuredProducts: Product[] = [
    {
      id: 1,
      name: "قهوه اسپرسو ایتالیایی",
      price: "۲۹۰,۰۰۰ تومان",
      image: "/Images/premium_photo-1674407009848-4da7a12b6b25.avif",
      category: "نوشیدنی",
      badge: "پرفروش",
      rating: 4.8
    },
    {
      id: 2,
      name: "فرنچ پرس شیشه‌ای",
      price: "۱۸۰,۰۰۰ تومان",
      image: "/Images/photo-1596098823457-74e360fcd023.avif",
      category: "تجهیزات",
      badge: "جدید",
      rating: 4.6
    },
    {
      id: 3,
      name: "دانه قهوه برزیل",
      price: "۲۲۰,۰۰۰ تومان",
      image: "/Images/premium_photo-1671379526961-1aebb82b317b.avif",
      category: "دانه خاص",
      badge: "ویژه",
      rating: 4.9
    },
    {
      id: 4,
      name: "قهوه ترک اصل",
      price: "۲۶۰,۰۰۰ تومان",
      image: "/Images/premium_photo-1674327105076-36c4419864cf.avif",
      category: "نوشیدنی",
      badge: "محبوب",
      rating: 4.7
    },
    {
      id: 5,
      name: "آسیاب قهوه حرفه‌ای",
      price: "۳۵۰,۰۰۰ تومان",
      image: "/Images/photo-1592663527359-cf6642f54cff.avif",
      category: "تجهیزات",
      badge: "پرفروش",
      rating: 4.8
    },
    {
      id: 6,
      name: "موکاپات استیل",
      price: "۱۴۰,۰۰۰ تومان",
      image: "/Images/photo-1594075731547-8c705bb69e50.avif",
      category: "تجهیزات",
      badge: "جدید",
      rating: 4.6
    },
    {
      id: 7,
      name: "قهوه عربیکا اتیوپی",
      price: "۳۱۰,۰۰۰ تومان",
      image: "/Images/photo-1525088553748-01d6e210e00b.avif",
      category: "دانه خاص",
      badge: "ویژه",
      rating: 4.9
    }
  ];

  // Fix for RTL scroll detection
  useEffect(() => {
    updateArrowVisibility();
  }, []);

  const scroll = (direction: 'left' | 'right'): void => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 300;
      // Fixed scroll direction:
      // - Left arrow should scroll left (negative)
      // - Right arrow should scroll right (positive)
      const newScrollLeft = direction === 'left' 
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;
      
      container.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });

      setTimeout(() => {
        updateArrowVisibility();
      }, 300);
    }
  };

  const updateArrowVisibility = (): void => {
    const container = scrollContainerRef.current;
    if (container) {
      const maxScroll = container.scrollWidth - container.clientWidth;
      const currentScroll = container.scrollLeft;
      
      // Fixed arrow visibility logic:
      // - Left arrow shows when we can scroll left (scrollLeft > 0)
      // - Right arrow shows when we can scroll right (scrollLeft < maxScroll)
      setShowLeftArrow(currentScroll > 0);
      setShowRightArrow(currentScroll < maxScroll - 10); // -10 for tolerance
    }
  };

  return (
    <section className="w-full bg-gradient-to-b from-amber-50 to-white py-20 px-4 md:px-10 lg:px-20" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Featured Products Section with Horizontal Scroll */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-8 mb-16 border-2 border-amber-200/80 relative"
        >
          <div className="mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-amber-800 mb-2 font-[var(--font-yekan)]">
              پر فروش ترین محصولات
            </h3>
            <p className="text-gray-600 font-[var(--font-yekan)]">
              محصولاتی که بیشترین محبوبیت را در بین مشتریان دارند
            </p>
          </div>

          {/* Scroll Arrows - Fixed direction */}
          {showLeftArrow && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => scroll('left')}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-amber-700 w-10 h-10 rounded-full shadow-lg flex items-center justify-center z-10 transition-all duration-300 hover:scale-110 border border-amber-200"
              aria-label="Scroll left"
            >
              {/* Left arrow icon */}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
          )}

          {showRightArrow && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => scroll('right')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-amber-700 w-10 h-10 rounded-full shadow-lg flex items-center justify-center z-10 transition-all duration-300 hover:scale-110 border border-amber-200"
              aria-label="Scroll right"
            >
              {/* Right arrow icon */}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          )}

          {/* Horizontal Scroll Container */}
          <div 
            ref={scrollContainerRef}
            onScroll={updateArrowVisibility}
            className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
            dir="ltr" // Force LTR for scroll container to work properly
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex-shrink-0 w-64 bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 group border-2 border-amber-100/80 hover:border-amber-200"
                dir="rtl" // RTL for card content
              >
                <div className="relative h-32 mb-4 rounded-xl overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      product.badge === 'پرفروش' ? 'bg-red-500 text-white' :
                      product.badge === 'جدید' ? 'bg-green-500 text-white' :
                      product.badge === 'ویژه' ? 'bg-purple-500 text-white' :
                      'bg-amber-500 text-white'
                    } font-[var(--font-yekan)]`}>
                      {product.badge}
                    </span>
                  </div>
                </div>
                <div className="mb-2">
                  <span className="text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded-full font-[var(--font-yekan)]">
                    {product.category}
                  </span>
                </div>
                <h4 className="font-bold text-gray-800 mb-2 text-sm font-[var(--font-yekan)]">
                  {product.name}
                </h4>
                <div className="flex items-center justify-between">
                  <span className="text-amber-700 font-bold font-[var(--font-yekan)]">
                    {product.price}
                  </span>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                    <span className="text-sm text-gray-600">{product.rating}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-amber-700 border-2 border-amber-300 px-8 py-3 rounded-2xl font-semibold hover:bg-amber-50 transition-colors font-[var(--font-yekan)]"
            >
              مشاهده همه محصولات
            </motion.button>
          </div>
        </motion.div>

        {/* Main Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(245, 158, 11, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold py-4 px-8 rounded-2xl shadow-lg transition-all duration-300 font-[var(--font-yekan)] text-lg"
          >
            کشف همه محصولات
          </motion.button>
        </motion.div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}