"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Article {
  _id: string;
  title: string;
  excerpt: string;
  cover: string;
  href: string;
  badge: string;
  readTime: string;
  author: string;
  date: string;
  publish: number;
  category?: string;
  isFeatured?: boolean;
}

interface ApiResponse {
  status: number;
  success: boolean;
  data: {
    articles: Article[];
    pagination: {
      page: number;
      limit: number;
      totalPage: number;
      totalArticles: number;
    };
  };
}

export default function Articles() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState<boolean>(false);
  const [showRightArrow, setShowRightArrow] = useState<boolean>(true);
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch articles from API
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('https://coffee-shop-backend-k3un.onrender.com/api/v1/article');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result: ApiResponse = await response.json();
        
        if (result.success && result.data.articles) {
          // Filter only published articles and map to include isFeatured for the first article
          const publishedArticles = result.data.articles
            .filter(article => article.publish === 1)
            .map((article, index) => ({
              ...article,
              isFeatured: index === 0 // Make first article featured
            }));
          
          setFeaturedArticles(publishedArticles);
        } else {
          throw new Error('Failed to fetch articles');
        }
      } catch (err) {
        console.error('Error fetching articles:', err);
        setError('خطا در دریافت مقالات. لطفا دوباره تلاش کنید.');
        // Fallback to empty array to prevent crashes
        setFeaturedArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
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

  // Format date to Persian format (you can enhance this function as needed)
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fa-IR');
    } catch {
      return '۱۴۰۲/۱۰/۱۵'; // Fallback date
    }
  };

  // Loading skeleton (unchanged from your original)
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

  // Error state
  if (error) {
    return (
      <section className="w-full bg-gradient-to-b from-amber-50 to-white py-20 px-4 md:px-10 lg:px-20" dir="rtl">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-8 mb-16 border-2 border-amber-200/80 text-center">
            <div className="text-amber-600 text-lg font-[var(--font-yekan)] mb-4">
              {error}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="bg-white text-amber-700 border-2 border-amber-300 px-6 py-2 rounded-2xl font-semibold hover:bg-amber-50 transition-colors font-[var(--font-yekan)]"
            >
              تلاش مجدد
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-gradient-to-b from-amber-50 to-white py-20 px-4 md:px-10 lg:px-20" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Latest News Section with Horizontal Scroll */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-8 mb-16 border-2 border-amber-200/80 relative">
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
            <button
              onClick={() => scroll('left')}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-amber-700 w-10 h-10 rounded-full shadow-lg flex items-center justify-center z-10 transition-all duration-300 border border-amber-200"
              aria-label="Scroll left"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {showRightArrow && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-amber-700 w-10 h-10 rounded-full shadow-lg flex items-center justify-center z-10 transition-all duration-300 border border-amber-200"
              aria-label="Scroll right"
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
                className="flex-shrink-0 w-64 bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 group border-2 border-amber-100/80 hover:border-amber-200 cursor-pointer block"
                dir="rtl"
              >
                <div className="relative h-32 mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                  <svg className="w-12 h-12 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9m0 0v2m0-2a2 2 0 012-2h2a2 2 0 012 2m-6 5v2m0 4v2m0 4v2m8-12v2m0 4v2m0 4v2" />
                  </svg>
                  
                  {/* Article Badge */}
                  <div className="absolute top-2 left-2">
                    <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold font-[var(--font-yekan)]">
                      {article.badge}
                    </span>
                  </div>

                  {/* Featured Badge */}
                  {article.isFeatured && (
                    <div className="absolute bottom-2 right-2">
                      <span className="bg-gradient-to-r from-amber-600 to-amber-700 text-white text-xs px-2 py-1 rounded-full font-bold font-[var(--font-yekan)]">
                        ویژه
                      </span>
                    </div>
                  )}
                </div>

                {/* Category - Using badge as fallback since category might be null */}
                <div className="mb-2">
                  <span className="text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded-full font-[var(--font-yekan)]">
                    {article.category || article.badge}
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
                  <span className="font-[var(--font-yekan)]">{formatDate(article.date)}</span>
                </div>

                {/* Author */}
                <div className="mt-2 text-xs text-amber-600 font-[var(--font-yekan)]">
                  نویسنده: {article.author}
                </div>
              </Link>
            ))}
          </div>

          {/* View All Articles Button - Show only if there are articles */}
          {featuredArticles.length > 0 && (
            <div className="text-center mt-6">
              <Link
                href="/articles"
                className="bg-white text-amber-700 border-2 border-amber-300 px-8 py-3 rounded-2xl font-semibold hover:bg-amber-50 transition-colors font-[var(--font-yekan)] inline-block"
              >
                مشاهده همه مطالب
              </Link>
            </div>
          )}

          {/* No articles message */}
          {featuredArticles.length === 0 && !loading && (
            <div className="text-center py-8">
              <p className="text-gray-600 font-[var(--font-yekan)]">
                مقاله ای برای نمایش وجود ندارد.
              </p>
            </div>
          )}
        </div>

        {/* Main Call to Action */}
        <div className="text-center">
          {/* Empty div - removed extra content */}
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
      `}</style>
    </section>
  );
}