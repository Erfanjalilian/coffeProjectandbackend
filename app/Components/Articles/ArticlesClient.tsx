"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Article } from "@/lib/api/articles";

interface ArticlesClientProps {
  initialArticles: Article[];
  error?: string;
}

export default function ArticlesClient({ initialArticles, error: initialError }: ArticlesClientProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState<boolean>(false);
  const [showRightArrow, setShowRightArrow] = useState<boolean>(true);
  const [featuredArticles] = useState<Article[]>(initialArticles);
  const [error] = useState<string | null>(initialError || null);

  // Memoize the update function to prevent unnecessary re-renders
  const updateArrowVisibility = useCallback((): void => {
    const container = scrollContainerRef.current;
    if (container) {
      const maxScroll = container.scrollWidth - container.clientWidth;
      const currentScroll = container.scrollLeft;
      
      setShowLeftArrow(currentScroll > 0);
      setShowRightArrow(currentScroll < maxScroll - 10);
    }
  }, []);

  // Fix for RTL scroll detection
  useEffect(() => {
    updateArrowVisibility();
    
    // Add resize observer for responsive updates
    const resizeObserver = new ResizeObserver(() => {
      updateArrowVisibility();
    });

    if (scrollContainerRef.current) {
      resizeObserver.observe(scrollContainerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [updateArrowVisibility, featuredArticles]);

  const scroll = useCallback((direction: 'left' | 'right'): void => {
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

      // Use requestAnimationFrame for better performance
      requestAnimationFrame(() => {
        setTimeout(() => {
          updateArrowVisibility();
        }, 300);
      });
    }
  }, [updateArrowVisibility]);

  // Format date to Persian format with memoization
  const formatDate = useCallback((dateString: string): string => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('fa-IR', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
      }).format(date);
    } catch {
      return '۱۴۰۲/۱۰/۱۵'; // Fallback date
    }
  }, []);

  // Error state
  if (error) {
    return (
      <section className="w-full bg-gradient-to-b from-blue-50 to-white py-20 px-4 md:px-10 lg:px-20" dir="rtl">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 mb-16 border-2 border-blue-200/80 text-center">
            <div className="text-blue-600 text-lg font-[var(--font-yekan)] mb-4">
              {error}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="bg-white text-blue-700 border-2 border-blue-300 px-6 py-2 rounded-2xl font-semibold hover:bg-blue-50 transition-colors font-[var(--font-yekan)]"
            >
              تلاش مجدد
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-gradient-to-b from-blue-50 to-white py-20 px-4 md:px-10 lg:px-20" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Latest News Section with Horizontal Scroll */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 mb-16 border-2 border-blue-200/80 relative">
          <div className="mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-blue-800 mb-2 font-[var(--font-yekan)]">
              بروز ترین اخبار و یافته ها
            </h3>
            <p className="text-gray-600 font-[var(--font-yekan)]">
              تازه ترین مقالات و اخبار دنیای قهوه را اینجا بخوانید
            </p>
          </div>

          {/* Scroll Arrows - Only render when needed */}
          {showLeftArrow && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-blue-700 w-10 h-10 rounded-full shadow-lg flex items-center justify-center z-10 transition-all duration-300 border border-blue-200"
              aria-label="اسکرول به راست"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {showRightArrow && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-blue-700 w-10 h-10 rounded-full shadow-lg flex items-center justify-center z-10 transition-all duration-300 border border-blue-200"
              aria-label="اسکرول به چپ"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
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
              <Link
                key={article._id}
                href={`/Articles/${article._id}`}
                className="flex-shrink-0 w-64 bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 group border-2 border-blue-100/80 hover:border-blue-200 cursor-pointer block"
                dir="rtl"
                prefetch={true} // Enable prefetching for better navigation
              >
                <div className="relative h-32 mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                  <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9m0 0v2m0-2a2 2 0 012-2h2a2 2 0 012 2m-6 5v2m0 4v2m0 4v2m8-12v2m0 4v2m0 4v2" />
                  </svg>
                  
                  {/* Article Badge */}
                  <div className="absolute top-2 left-2">
                    <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs px-2 py-1 rounded-full font-bold font-[var(--font-yekan)]">
                      {article.badge}
                    </span>
                  </div>

                  {/* Featured Badge */}
                  {article.isFeatured && (
                    <div className="absolute bottom-2 right-2">
                      <span className="bg-gradient-to-r from-orange-600 to-orange-700 text-white text-xs px-2 py-1 rounded-full font-bold font-[var(--font-yekan)]">
                        ویژه
                      </span>
                    </div>
                  )}
                </div>

                {/* Category - Using badge as fallback since category might be null */}
                <div className="mb-2">
                  <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full font-[var(--font-yekan)]">
                    {article.category || article.badge}
                  </span>
                </div>

                {/* Article Title */}
                <h4 className="font-bold text-gray-800 mb-2 text-sm font-[var(--font-yekan)] leading-relaxed line-clamp-2">
                  {article.title}
                </h4>

                {/* Article Excerpt */}
                <p className="text-gray-600 text-xs mb-3 leading-relaxed font-[var(--font-yekan)] line-clamp-2">
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
                  <span className="font-[var(--font-yekan)]">{formatDate(article.date)}</span>
                </div>

                {/* Author */}
                <div className="mt-2 text-xs text-blue-600 font-[var(--font-yekan)] truncate">
                  نویسنده: {article.author}
                </div>
              </Link>
            ))}
          </div>

          {/* View All Articles Button - Show only if there are articles */}
          {featuredArticles.length > 0 && (
            <div className="text-center mt-6">
              <Link
                href="/ArticlesPage"
                className="bg-white text-blue-700 border-2 border-blue-300 px-8 py-3 rounded-2xl font-semibold hover:bg-blue-50 transition-colors font-[var(--font-yekan)] inline-block"
                prefetch={true}
              >
                مشاهده همه مطالب
              </Link>
            </div>
          )}

          {/* No articles message */}
          {featuredArticles.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600 font-[var(--font-yekan)]">
                مقاله ای برای نمایش وجود ندارد.
              </p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
}