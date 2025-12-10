"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface SeoData {
  metaKeywords: string[];
  metaTitle?: string;
  metaDescription?: string;
}

interface Category {
  seo: SeoData;
  _id: string;
  name: string;
  slug: string;
  description: string;
  images: string;
  color: string;
  parent: string | null;
  order: number;
  isActive: boolean;
  showOnHomepage: boolean;
  productsCount: number;
  createdAt: string;
  updatedAt: string;
  id: string;
}

interface ApiResponse {
  status: number;
  success: boolean;
  data: {
    categories: Category[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

// Color schemes based on your API color field or fallback
const PREDEFINED_COLOR_SCHEMES = [
  { bgColor: "bg-blue-50", accent: "bg-blue-500", textColor: "text-blue-500" },
  { bgColor: "bg-blue-100", accent: "bg-blue-600", textColor: "text-blue-600" },
  { bgColor: "bg-blue-50", accent: "bg-blue-500", textColor: "text-blue-500" },
  { bgColor: "bg-indigo-50", accent: "bg-indigo-500", textColor: "text-indigo-500" },
  { bgColor: "bg-sky-50", accent: "bg-sky-500", textColor: "text-sky-500" },
  { bgColor: "bg-cyan-50", accent: "bg-cyan-500", textColor: "text-cyan-500" },
] as const;

// Sub-items for each category card with corresponding images
const CATEGORY_SUB_ITEMS = [
  { 
    name: "محصول ویژه", 
    image: "/Images/photo-1461023058943-07fcbe16d735.avif" 
  },
  { 
    name: "پرفروش‌ها", 
    image: "/Images/photo-1514432324607-a09d9b4aefdd.avif" 
  },
  { 
    name: "جدیدترین‌ها", 
    image: "/Images/photo-1514066558159-fc8c737ef259.avif" 
  },
  { 
    name: "تخفیف دار", 
    image: "/Images/photo-1514432324607-a09d9b4aefdd.avif" 
  }
] as const;

// Display category interface
interface DisplayCategory {
  id: string;
  title: string;
  description: string;
  slug: string;
  items: typeof CATEGORY_SUB_ITEMS;
  bgColor: string;
  accent: string;
  textColor: string;
  showOnHomepage: boolean;
  order: number;
  productsCount: number;
}

// Simplified Category Card with performance optimizations
function CategoryCard({ 
  cat, 
  onClick 
}: { 
  cat: DisplayCategory; 
  onClick: (slug: string, title: string) => void 
}) {
  // Use useCallback to memoize click handler
  const handleClick = useCallback(() => {
    onClick(cat.slug, cat.title);
  }, [cat.slug, cat.title, onClick]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(cat.slug, cat.title);
    }
  }, [cat.slug, cat.title, onClick]);

  return (
    <div
      className={`relative ${cat.bgColor} border border-gray-200 rounded-xl p-4 shadow-sm min-h-[320px] cursor-pointer backdrop-blur-sm bg-white/70 hover:shadow-md transition-shadow duration-200 will-change-transform`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={`دسته‌بندی ${cat.title}`}
    >
      <div className="h-full flex flex-col">
        <div className="flex items-center mb-4">
          <div className={`w-10 h-10 ${cat.accent} rounded-lg flex items-center justify-center ml-3 flex-shrink-0`}>
            <span className="text-white font-bold font-[var(--font-yekan)] text-sm">
              {cat.title.charAt(0)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-800 font-[var(--font-yekan)] truncate">
              {cat.title}
            </h3>
            {cat.description && (
              <p className="text-xs text-gray-600 font-[var(--font-yekan)] mt-1 line-clamp-2">
                {cat.description}
              </p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 flex-1">
          {cat.items.map((item, index: number) => (
            <div
              key={index}
              className="bg-white/80 border border-gray-100/50 rounded-lg p-2 flex flex-col items-center justify-center text-center backdrop-blur-sm hover:bg-white/90 transition-colors duration-150"
            >
              {/* Image Container - Rectangular and full width */}
              <div className="relative w-full h-16 mb-2 rounded-lg overflow-hidden flex items-center justify-center bg-blue-50">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 200px) 100vw, 200px"
                  priority={false}
                  onError={(e) => {
                    // Fallback if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallbackDiv = target.parentElement?.querySelector('.image-fallback') as HTMLElement;
                    if (fallbackDiv) {
                      fallbackDiv.style.display = 'flex';
                    }
                  }}
                />
                {/* Fallback content in case image fails to load */}
                <div className="image-fallback hidden absolute inset-0 items-center justify-center">
                  <div className={`w-10 h-10 ${cat.accent} rounded-lg flex items-center justify-center`}>
                    <span className="text-white font-bold text-xs">{index + 1}</span>
                  </div>
                </div>
              </div>
              <span className="text-xs font-[var(--font-yekan)] text-gray-800 truncate w-full mt-1">
                {item.name}
              </span>
            </div>
          ))}
        </div>
        
        {cat.productsCount > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100/50">
            <span className="text-xs text-gray-600 font-[var(--font-yekan)]">
              {cat.productsCount} محصول
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function HeroSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Memoize handlers
  const handleCategoryClick = useCallback((slug: string, title: string) => {
    try {
      localStorage.setItem('selectedCategory', title);
      localStorage.setItem('selectedCategorySlug', slug);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
    router.push('/CoffeeCategoryPage');
  }, [router]);

  const handleViewAllCategories = useCallback(() => {
    try {
      localStorage.removeItem('selectedCategory');
      localStorage.removeItem('selectedCategorySlug');
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
    router.push('/CoffeeCategoryPage');
  }, [router]);

  // Transform API data to display format
  const displayCategories = useMemo(() => {
    // Filter active categories and sort by order
    const activeCategories = categories
      .filter(cat => cat.isActive)
      .sort((a, b) => a.order - b.order);

    // If no active categories from API, show empty state
    if (activeCategories.length === 0) {
      return [];
    }

    return activeCategories.map((category, index) => {
      const colorScheme = PREDEFINED_COLOR_SCHEMES[index % PREDEFINED_COLOR_SCHEMES.length];

      return {
        id: category._id,
        title: category.name,
        description: category.description,
        slug: category.slug,
        items: CATEGORY_SUB_ITEMS,
        bgColor: colorScheme.bgColor,
        accent: colorScheme.accent,
        textColor: colorScheme.textColor,
        showOnHomepage: category.showOnHomepage,
        order: category.order,
        productsCount: category.productsCount || 0
      } as DisplayCategory;
    });
  }, [categories]);

  // Fetch categories from your API
  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          'https://coffee-shop-backend-k3un.onrender.com/api/v1/category', 
          { 
            signal: controller.signal,
            headers: {
              'Cache-Control': 'max-age=300',
            }
          }
        );
        
        if (!response.ok) {
          throw new Error(`خطا در دریافت داده‌ها: ${response.status}`);
        }
        
        const result: ApiResponse = await response.json();
        
        if (mounted) {
          if (result.success && result.data.categories) {
            setCategories(result.data.categories);
          } else {
            throw new Error('داده‌های دریافتی معتبر نیستند');
          }
          setLoading(false);
        }
      } catch (error) {
        if (mounted) {
          if (error instanceof Error && error.name === 'AbortError') {
            console.log('درخواست لغو شد');
            return;
          }
          console.error('Error fetching categories:', error);
          setError('خطا در دریافت دسته‌بندی‌ها. لطفا دوباره تلاش کنید.');
          setLoading(false);
        }
      }
    };

    fetchCategories();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  // Loading state
  if (loading) {
    return (
      <section 
        className="w-full py-12 px-4 md:px-8 lg:px-16 mt-34 relative overflow-hidden bg-gradient-to-b from-blue-50 to-white"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="h-8 bg-blue-100/50 rounded-lg w-48 mx-auto mb-2 animate-pulse"></div>
            <div className="h-4 bg-blue-100/50 rounded w-64 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-white/50 border border-blue-100 rounded-xl p-4 min-h-[320px] animate-pulse"
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg ml-3"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-blue-100 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-blue-100 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-blue-50 rounded-lg p-3 h-20"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section 
        className="w-full py-12 px-4 md:px-8 lg:px-16 mt-34 relative bg-gradient-to-b from-blue-50 to-white"
      >
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-gray-800 text-lg font-[var(--font-yekan)] mb-4">
            {error}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-[var(--font-yekan)] hover:bg-blue-700 transition-colors duration-200"
          >
            تلاش مجدد
          </button>
        </div>
      </section>
    );
  }

  // Empty state
  if (displayCategories.length === 0) {
    return (
      <section 
        className="w-full py-12 px-4 md:px-8 lg:px-16 mt-34 relative bg-gradient-to-b from-blue-50 to-white"
      >
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-gray-800 text-lg font-[var(--font-yekan)] mb-4">
            هیچ دسته‌بندی فعالی یافت نشد
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      className="w-full py-12 px-4 md:px-8 lg:px-16 mt-34 relative overflow-hidden bg-gradient-to-b from-blue-50 to-white"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 font-[var(--font-yekan)] mb-2">
            دسته‌بندی‌های محصولات
          </h2>
          <p className="text-gray-600 font-[var(--font-yekan)]">
            محصولات خود را بر اساس دسته‌بندی مورد نظر جستجو کنید
          </p>
        </div>

        {/* Categories Grid - Added will-change for better performance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 will-change-transform">
          {displayCategories.map((cat) => (
            <CategoryCard
              key={cat.id}
              cat={cat}
              onClick={handleCategoryClick}
            />
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-10">
          <button 
            onClick={handleViewAllCategories}
            className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg font-[var(--font-yekan)] text-base focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-blue-700 transition-colors duration-200 border border-blue-400/30 shadow-lg"
            aria-label="مشاهده همه دسته‌بندی‌ها"
          >
            مشاهده همه دسته‌بندی‌ها
          </button>
        </div>
      </div>
    </section>
  );
}