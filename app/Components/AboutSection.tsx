"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";

interface Article {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  category: string;
  badge: string;
  readTime: string;
  author: string;
  isFeatured?: boolean;
}

export default function LatestNewsAndDiscoveries() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState<boolean>(false);
  const [showRightArrow, setShowRightArrow] = useState<boolean>(true);
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Static data for articles and news
  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      const articlesData: Article[] = [
        {
          id: 1,
          title: "راهنمای کامل انتخاب قهوه مناسب",
          excerpt: "در این مقاله به بررسی انواع دانه های قهوه و روش های انتخاب بهترین نوع برای سلیقه شما می پردازیم.",
          date: "۱۴۰۲/۱۰/۱۵",
          image: "/Images/coffe1.webp",
          category: "آموزشی",
          badge: "جدید",
          readTime: "۵ دقیقه",
          author: "محمد رضایی",
          isFeatured: true
        },
        {
          id: 2,
          title: "تازه ترین trends در دنیای قهوه",
          excerpt: "آشنایی با جدیدترین ترندها و روش های دم کردن قهوه در سال ۲۰۲۴",
          date: "۱۴۰۲/۱۰/۱۲",
          image: "/Images/coffe2.avif",
          category: "اخبار",
          badge: "پربازدید",
          readTime: "۳ دقیقه",
          author: "سارا محمدی"
        },
        {
          id: 3,
          title: "خواص شگفت انگیز قهوه برای سلامت",
          excerpt: "بررسی علمی فواید مصرف متعادل قهوه بر روی سلامت جسم و روان",
          date: "۱۴۰۲/۱۰/۱۰",
          image: "/Images/coffe3.jpg",
          category: "سلامتی",
          badge: "محبوب",
          readTime: "۷ دقیقه",
          author: "دکتر علی نوری"
        },
        {
          id: 4,
          title: "تاریخچه قهوه در ایران",
          excerpt: "سفر در زمان و بررسی تاریخچه ورود و محبوبیت قهوه در فرهنگ ایرانی",
          date: "۱۴۰۲/۱۰/۰۸",
          image: "/Images/coffe4.jpg",
          category: "تاریخچه",
          badge: "ویژه",
          readTime: "۸ دقیقه",
          author: "رضا کریمی"
        },
        {
          id: 5,
          title: "طرز تهیه ۵ نوع قهوه محبوب",
          excerpt: "آموزش مرحله به مرحله تهیه محبوب ترین نوشیدنی های قهوه در خانه",
          date: "۱۴۰۲/۱۰/۰۵",
          image: "/Images/coffee5.png",
          category: "آموزشی",
          badge: "اقتصادی",
          readTime: "۶ دقیقه",
          author: "نازنین احمدی"
        },
        {
          id: 6,
          title: "ابزارهای ضروری برای بارistas خانگی",
          excerpt: "معرفی ابزارهای ضروری و حرفه ای برای علاقه مندان به قهوه در خانه",
          date: "۱۴۰۲/۱۰/۰۳",
          image: "/Images/coffee6.jpg",
          category: "تجهیزات",
          badge: "کاربردی",
          readTime: "۴ دقیقه",
          author: "امیر حسینی"
        },
        {
          id: 7,
          title: "قهوه و محیط زیست",
          excerpt: "بررسی تاثیر تولید و مصرف قهوه بر محیط زیست و راهکارهای پایدار",
          date: "۱۴۰۲/۱۰/۰۱",
          image: "/Images/coffee7.webp",
          category: "محیط زیست",
          badge: "مهم",
          readTime: "۹ دقیقه",
          author: "پرستو جعفری"
        }
      ];
      
      setFeaturedArticles(articlesData);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Fix for RTL scroll detection
  useEffect(() => {
    updateArrowVisibility();
  }, [featuredArticles]);

  const scroll = (direction: 'left' | 'right'): void => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 300;
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
      
      setShowLeftArrow(currentScroll > 0);
      setShowRightArrow(currentScroll < maxScroll - 10);
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <section className="w-full bg-gradient-to-b from-amber-50 to-white py-20 px-4 md:px-10 lg:px-20" dir="rtl">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-8 mb-16 border-2 border-amber-200/80">
            <div className="mb-8">
              <div className="h-8 bg-amber-200 rounded-lg w-64 mb-2 animate-pulse"></div>
              <div className="h-4 bg-amber-100 rounded w-48 animate-pulse"></div>
            </div>
            
            <div className="flex gap-6 overflow-x-auto pb-4">
              {[...Array(7)].map((_, index) => (
                <div key={index} className="flex-shrink-0 w-64 bg-white rounded-2xl p-4 shadow-lg border-2 border-amber-100/80">
                  <div className="h-32 bg-amber-200 rounded-xl mb-4 animate-pulse"></div>
                  <div className="h-6 bg-amber-100 rounded w-20 mb-2 animate-pulse"></div>
                  <div className="h-4 bg-amber-100 rounded w-full mb-2 animate-pulse"></div>
                  <div className="h-4 bg-amber-100 rounded w-3/4 mb-4 animate-pulse"></div>
                  <div className="flex justify-between">
                    <div className="h-6 bg-amber-200 rounded w-20 animate-pulse"></div>
                    <div className="h-4 bg-amber-100 rounded w-10 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-gradient-to-b from-amber-50 to-white py-20 px-4 md:px-10 lg:px-20" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Latest News Section with Horizontal Scroll */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-8 mb-16 border-2 border-amber-200/80 relative"
        >
          <div className="mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-amber-800 mb-2 font-[var(--font-yekan)]">
             بروز ترین اخبار و یافته ها
            </h3>
            <p className="text-gray-600 font-[var(--font-yekan)]">
              تازه ترین مقالات و اخبار دنیای قهوه را اینجا بخوانید
            </p>
          </div>

          {/* Scroll Arrows */}
          {showLeftArrow && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => scroll('left')}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-amber-700 w-10 h-10 rounded-full shadow-lg flex items-center justify-center z-10 transition-all duration-300 hover:scale-110 border border-amber-200"
              aria-label="Scroll left"
            >
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
            dir="ltr"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {featuredArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex-shrink-0 w-64 bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 group border-2 border-amber-100/80 hover:border-amber-200 cursor-pointer"
                dir="rtl"
                onClick={() => window.location.href = `/articles/${article.id}`}
              >
                <div className="relative h-32 mb-4 rounded-xl overflow-hidden">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Article Badge */}
                  

                  {/* Featured Badge */}
                  {article.isFeatured && (
                    <div className="absolute bottom-2 right-2">
                      <span className="bg-gradient-to-r from-amber-600 to-amber-700 text-white text-xs px-2 py-1 rounded-full font-bold font-[var(--font-yekan)]">
                        ویژه
                      </span>
                    </div>
                  )}
                </div>

                {/* Category */}
                <div className="mb-2">
                  <span className="text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded-full font-[var(--font-yekan)]">
                    {article.category}
                  </span>
                </div>

                {/* Article Title */}
                <h4 className="font-bold text-gray-800 mb-2 text-sm font-[var(--font-yekan)] leading-relaxed">
                  {article.title}
                </h4>

                {/* Article Excerpt */}
                <p className="text-gray-600 text-xs mb-3 leading-relaxed font-[var(--font-yekan)]">
                  {article.excerpt}
                </p>

                {/* Meta Information */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-[var(--font-yekan)]">{article.readTime}</span>
                  </div>
                  <span className="font-[var(--font-yekan)]">{article.date}</span>
                </div>

                {/* Author */}
                <div className="mt-2 text-xs text-amber-600 font-[var(--font-yekan)]">
                  نویسنده: {article.author}
                </div>
              </motion.div>
            ))}
          </div>

          {/* View All Articles Button */}
          <div className="text-center mt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-amber-700 border-2 border-amber-300 px-8 py-3 rounded-2xl font-semibold hover:bg-amber-50 transition-colors font-[var(--font-yekan)]"
              onClick={() => window.location.href = '/articles'}
            >
              مشاهده همه مطالب
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