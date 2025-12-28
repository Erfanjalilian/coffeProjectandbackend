// app/articles/client-page.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  FiBook, 
  FiCoffee, 
  FiMessageCircle, 
  FiCalendar, 
  FiUser, 
  FiClock, 
  FiChevronLeft,
  FiStar,
  FiAward,
  FiTrendingUp,
  FiZap
} from "react-icons/fi";
import { LuCrown, LuBookOpen } from "react-icons/lu";

// Add PageProps interface
interface PageProps {
  initialArticles: Article[];
  error?: string;
}

// Interfaces based on your API structure
interface Article {
  _id: string;
  title: string;
  excerpt: string;
  description: string;
  body: string;
  cover: string;
  href: string;
  category: string | null;
  creator: {
    _id: string;
  };
  relatedProducts: string[];
  badge: string;
  readTime: string;
  author: string;
  date: string;
  publish: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
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

export default function ClientArticlesPage({ initialArticles, error: propError }: PageProps) {
  // Use initial data from server immediately
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [loading, setLoading] = useState<boolean>(initialArticles.length === 0);
  const [error, setError] = useState<string | null>(propError || null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Article icons to display instead of images - Updated colors to iKasb palette
  const articleIcons = [
    { icon: <FiBook />, color: "from-blue-500 to-blue-600" },
    { icon: <LuBookOpen />, color: "from-blue-600 to-blue-700" },
    { icon: <FiCoffee />, color: "from-blue-500 to-blue-600" },
    { icon: <FiMessageCircle />, color: "from-blue-600 to-blue-700" },
    { icon: <FiZap />, color: "from-blue-500 to-blue-600" },
    { icon: <FiTrendingUp />, color: "from-blue-600 to-blue-700" },
    { icon: <FiStar />, color: "from-blue-500 to-blue-600" },
    { icon: <FiAward />, color: "from-blue-600 to-blue-700" },
  ];

  // Load additional data client-side if initial data is empty
  useEffect(() => {
    if (initialArticles.length === 0 && !propError) {
      loadArticles();
    } else {
      // Set total pages based on initial data
      setTotalPages(Math.ceil(initialArticles.length / 10) || 1);
    }
    
    async function loadArticles() {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('https://coffee-shop-backend-k3un.onrender.com/api/v1/article');
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data: ApiResponse = await response.json();
        
        if (data.success && data.data.articles) {
          // Filter only published articles (publish === 1)
          const publishedArticles = data.data.articles.filter(article => article.publish === 1);
          setArticles(publishedArticles);
          setTotalPages(data.data.pagination.totalPage);
        } else {
          throw new Error('Invalid API response structure');
        }
        
      } catch (error) {
        console.error('Error loading articles:', error);
        setError('خطا در بارگذاری مقالات. لطفاً دوباره تلاش کنید.');
      } finally {
        setLoading(false);
      }
    }
  }, [initialArticles.length, propError]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const getRandomIcon = (index: number) => {
    return articleIcons[index % articleIcons.length];
  };

  const getArticleBadgeStyle = (badge: string) => {
    switch (badge) {
      case "ویژه":
        return "bg-gradient-to-r from-orange-500 to-orange-600 text-white";
      default:
        return "bg-gradient-to-r from-blue-500 to-blue-600 text-white";
    }
  };

  // Use prop error if exists
  const displayError = propError || error;

  if (loading && initialArticles.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-white pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-[var(--font-yekan)]">در حال بارگذاری مقالات...</p>
        </div>
      </div>
    );
  }

  if (displayError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-white pt-24 flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <div className="bg-white rounded-2xl shadow-lg border border-blue-200 p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiBook className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2 font-[var(--font-yekan)]">
              خطا در بارگذاری
            </h3>
            <p className="text-gray-600 font-[var(--font-yekan)] mb-4">
              {displayError}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-xl font-semibold font-[var(--font-yekan)] hover:shadow-lg transition-all"
            >
              تلاش مجدد
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-white pt-34">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 mb-6 font-[var(--font-yekan)]">
          <Link href="/" className="hover:text-blue-700 cursor-pointer transition-colors">
            خانه
          </Link>
          <span className="mx-2">/</span>
          <span className="text-blue-700 font-semibold">مقالات</span>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 font-[var(--font-yekan)]">
                مقالات تخصصی قهوه
              </h1>
              <p className="text-gray-600 font-[var(--font-yekan)]">
                آخرین مقالات و مطالب تخصصی در زمینه قهوه، روش‌های دم‌آوری و فرهنگ قهوه‌نوشی
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-[var(--font-yekan)]">
                <FiBook className="text-white" />
                <span className="font-semibold">{articles.length} مقاله</span>
              </div>
            </div>
          </div>
        </div>

        {/* Consultation Banner - Updated to iKasb colors */}
        <div
          className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg border border-blue-500 p-6 mb-8 relative overflow-hidden hidden lg:block"
        >
          <div className="absolute top-0 left-0 w-24 h-24 bg-white/10 rounded-full -translate-x-12 -translate-y-12"></div>
          <div className="absolute bottom-0 right-0 w-20 h-20 bg-white/10 rounded-full translate-x-10 translate-y-10"></div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 rounded-xl p-3 backdrop-blur-sm">
                <FiMessageCircle className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1 font-[var(--font-yekan)]">
                  مشاوره تخصصی انتخاب قهوه
                </h3>
                <p className="text-blue-100 font-[var(--font-yekan)] text-sm leading-relaxed">
                  برای دریافت راهنمایی تخصصی در انتخاب قهوه مناسب، با کارشناسان ما مشورت کنید
                </p>
              </div>
            </div>
            
            <button
              className="flex items-center gap-2 bg-white hover:bg-blue-50 text-blue-700 px-6 py-3 rounded-xl font-semibold transition-all shadow-lg font-[var(--font-yekan)] whitespace-nowrap"
            >
              <FiMessageCircle size={18} />
              <span>مشاوره رایگان</span>
            </button>
          </div>
        </div>

        {/* Articles Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6"
        >
          {articles.map((article, index) => {
            const iconData = getRandomIcon(index);
            
            return (
              <div
                key={article._id}
              >
                <Link
                  href={`/Articles/${article._id}`}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-blue-100 overflow-hidden group block h-full"
                >
                  {/* Article Icon Section - Instead of Image */}
                  <div className={`relative h-40 overflow-hidden bg-gradient-to-br ${iconData.color} flex items-center justify-center`}>
                    <div className="text-center text-white">
                      <div className="text-4xl mb-2 opacity-80 group-hover:scale-110 transition-transform duration-300">
                        {iconData.icon}
                      </div>
                      <span className="text-white font-bold font-[var(--font-yekan)] text-sm opacity-90">
                        {article.category || "مقاله تخصصی"}
                      </span>
                    </div>
                    
                    {/* Featured Badge */}
                    {article.badge === "ویژه" && (
                      <div className="absolute top-3 right-3">
                        <span className={`text-xs px-3 py-1.5 rounded-full font-bold font-[var(--font-yekan)] shadow-lg ${getArticleBadgeStyle(article.badge)} flex items-center gap-1`}>
                          <LuCrown size={10} />
                          <span>{article.badge}</span>
                        </span>
                      </div>
                    )}

                    {/* Reading Time Badge */}
                    <div className="absolute bottom-3 right-3 bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg flex items-center gap-1">
                      <FiClock size={10} />
                      <span>{article.readTime}</span>
                    </div>
                  </div>

                  {/* Article Content */}
                  <div className="p-5">
                    {/* Article Title */}
                    <h3 className="font-bold text-gray-800 mb-3 text-lg leading-relaxed font-[var(--font-yekan)] line-clamp-2 group-hover:text-blue-700 transition-colors">
                      {article.title}
                    </h3>
                    
                    {/* Article Excerpt */}
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed font-[var(--font-yekan)] line-clamp-3">
                      {article.excerpt || article.description}
                    </p>

                    {/* Article Meta Information */}
                    <div className="flex flex-wrap items-center gap-3 mb-4 text-xs text-gray-500 font-[var(--font-yekan)]">
                      <div className="flex items-center gap-1">
                        <FiUser className="w-3 h-3" />
                        <span>{article.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FiCalendar className="w-3 h-3" />
                        <span>{formatDate(article.date)}</span>
                      </div>
                    </div>

                    {/* Read More Button */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm font-[var(--font-yekan)] group-hover:text-blue-700 transition-colors">
                        <span>مطالعه مقاله</span>
                        <FiChevronLeft className="group-hover:-translate-x-1 transition-transform" />
                      </div>
                      
                      {/* Article Stats */}
                      <div className="flex items-center gap-2">
                        {article.relatedProducts.length > 0 && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                            {article.relatedProducts.length} محصول مرتبط
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* No Articles Message */}
        {articles.length === 0 && !loading && (
          <div
            className="text-center py-12"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-blue-200 p-8 max-w-md mx-auto">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiBook className="w-10 h-10 text-blue-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2 font-[var(--font-yekan)]">
                مقاله‌ای یافت نشد
              </h3>
              <p className="text-gray-600 font-[var(--font-yekan)]">
                در حال حاضر مقاله‌ای برای نمایش وجود ندارد.
              </p>
            </div>
          </div>
        )}

        {/* Pagination (if needed in future) */}
        {totalPages > 1 && (
          <div
            className="mt-8 flex justify-center"
          >
            <div className="flex items-center gap-2 bg-white rounded-xl shadow-lg border border-blue-100 p-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg font-[var(--font-yekan)] transition-all ${
                    currentPage === page
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                      : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Featured Articles Section */}
        {articles.filter(a => a.badge === "ویژه").length > 0 && (
          <div
            className="mt-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2 rounded-lg">
                <LuCrown className="text-white text-lg" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800 font-[var(--font-yekan)]">
                  مقالات ویژه
                </h2>
                <p className="text-sm text-gray-500 mt-1 font-[var(--font-yekan)]">
                  منتخب بهترین مقالات برای مطالعه
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {articles
                .filter(article => article.badge === "ویژه")
                .slice(0, 2) // Show only 2 featured articles
                .map((featuredArticle, index) => (
                  <div
                    key={featuredArticle._id}
                  >
                    <Link
                      href={`/Articles/${featuredArticle._id}`}
                      className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-blue-200 overflow-hidden group block h-full"
                    >
                      <div className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white text-2xl">
                              {getRandomIcon(index).icon}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                                ویژه
                              </span>
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <FiClock size={10} />
                                {featuredArticle.readTime}
                              </span>
                            </div>
                            <h4 className="font-bold text-gray-800 mb-2 font-[var(--font-yekan)] group-hover:text-blue-700 transition-colors">
                              {featuredArticle.title}
                            </h4>
                            <p className="text-gray-600 text-sm mb-3 font-[var(--font-yekan)] line-clamp-2">
                              {featuredArticle.excerpt}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500 font-[var(--font-yekan)]">
                                {featuredArticle.author}
                              </span>
                              <span className="text-blue-600 text-sm font-semibold font-[var(--font-yekan)] flex items-center gap-1">
                                مطالعه مقاله
                                <FiChevronLeft className="group-hover:-translate-x-1 transition-transform" />
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}