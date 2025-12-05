"use client";

import { useState, useEffect, useMemo, useCallback, memo, JSX } from "react";
import { useRouter } from "next/navigation";
import { 
  FiCoffee, 
  FiPackage, 
  FiStar, 
  FiTag, 
  FiTrendingUp, 
  FiZap 
} from "react-icons/fi";
import { LuCrown } from "react-icons/lu";

interface Category {
  _id: string;
  name: string;
  description: string;
  images: string;
  color: string;
  isActive: boolean;
  showOnHomepage: boolean;
  productsCount: number;
  slug: string;
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

interface ColorScheme {
  gradient: string;
  bgGradient: string;
  accent: string;
  icon: JSX.Element;
}

interface FallbackItem {
  name: string;
  icon: JSX.Element;
}

interface DisplayCategory {
  id: string;
  title: string;
  description: string;
  slug: string;
  items: readonly FallbackItem[];
  gradient: string;
  bgGradient: string;
  accent: string;
  icon: JSX.Element;
}

// Stylish icons for each category type
const CATEGORY_ICONS = [
  <LuCrown className="w-6 h-6" />,
  <FiCoffee className="w-6 h-6" />,
  <FiPackage className="w-6 h-6" />,
  <FiStar className="w-6 h-6" />,
  <FiTrendingUp className="w-6 h-6" />,
  <FiZap className="w-6 h-6" />,
] as const;

// Memoized color schemes with icons
const PREDEFINED_COLOR_SCHEMES: ColorScheme[] = [
  {
    gradient: "from-amber-500 to-orange-500",
    bgGradient: "from-amber-50 to-orange-50",
    accent: "bg-gradient-to-r from-amber-500 to-orange-500",
    icon: CATEGORY_ICONS[0]
  },
  {
    gradient: "from-emerald-500 to-teal-600",
    bgGradient: "from-emerald-50 to-teal-50",
    accent: "bg-gradient-to-r from-emerald-500 to-teal-600",
    icon: CATEGORY_ICONS[1]
  },
  {
    gradient: "from-blue-500 to-indigo-600",
    bgGradient: "from-blue-50 to-indigo-50",
    accent: "bg-gradient-to-r from-blue-500 to-indigo-600",
    icon: CATEGORY_ICONS[2]
  },
  {
    gradient: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-50 to-pink-50",
    accent: "bg-gradient-to-r from-purple-500 to-pink-500",
    icon: CATEGORY_ICONS[3]
  },
  {
    gradient: "from-rose-500 to-pink-600",
    bgGradient: "from-rose-50 to-pink-50",
    accent: "bg-gradient-to-r from-rose-500 to-pink-600",
    icon: CATEGORY_ICONS[4]
  },
  {
    gradient: "from-cyan-500 to-blue-600",
    bgGradient: "from-cyan-50 to-blue-50",
    accent: "bg-gradient-to-r from-cyan-500 to-blue-600",
    icon: CATEGORY_ICONS[5]
  },
];

// Stylish icons for fallback items
const FALLBACK_ITEM_ICONS = [
  <LuCrown className="w-5 h-5" />,
  <FiTrendingUp className="w-5 h-5" />,
  <FiZap className="w-5 h-5" />,
  <FiTag className="w-5 h-5" />,
] as const;

// Memoized fallback items with stylish icons
const FALLBACK_ITEMS: FallbackItem[] = [
  { name: "محصول ویژه", icon: FALLBACK_ITEM_ICONS[0] },
  { name: "پرفروش‌ها", icon: FALLBACK_ITEM_ICONS[1] },
  { name: "جدیدترین‌ها", icon: FALLBACK_ITEM_ICONS[2] },
  { name: "تخفیف دار", icon: FALLBACK_ITEM_ICONS[3] }
];

// Define props interface for CategoryCard
interface CategoryCardProps {
  cat: DisplayCategory;
  onCategoryClick: (title: string) => void;
}

// Memoized Category Card Component with proper TypeScript
const CategoryCard = memo<CategoryCardProps>(({ 
  cat, 
  onCategoryClick 
}) => {
  const handleClick = useCallback(() => {
    onCategoryClick(cat.title);
  }, [onCategoryClick, cat.title]);

  return (
    <div
      className={`relative bg-gradient-to-br ${cat.bgGradient} border border-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden min-h-[320px] w-full cursor-pointer will-change-transform`}
      onClick={handleClick}
      style={{ contain: 'content' }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      aria-label={`دسته‌بندی ${cat.title}`}
    >
      {/* Background Elements - Simplified opacity animation */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
        style={{ willChange: 'opacity' }}
        aria-hidden="true"
      ></div>

      <div className="relative z-10 h-full flex flex-col">
        <div className="flex items-center mb-6">
          <div className={`w-12 h-12 ${cat.accent} rounded-2xl flex items-center justify-center ml-4 shadow-lg`}>
            <div className="text-white">
              {cat.icon}
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-800 font-[var(--font-yekan)] group-hover:text-gray-900 transition-colors duration-300">
            {cat.title}
          </h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4 flex-1">
          {cat.items.map((item, itemIndex) => (
            <div
              key={itemIndex}
              className="relative bg-white/80 border border-white rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 group/item min-h-[80px] will-change-transform flex flex-col items-center justify-center p-2"
              style={{ backdropFilter: 'blur(4px)' }}
              role="button"
              tabIndex={-1}
              aria-hidden="true"
            >
              {/* Stylish Icon */}
              <div className="text-gray-600 mb-1 group-hover/item:text-amber-600 transition-colors duration-300">
                {item.icon}
              </div>
              
              {/* Item Name */}
              <span className="text-xs font-[var(--font-yekan)] text-gray-800 font-medium text-center leading-tight">
                {item.name}
              </span>

              {/* Hover gradient border effect - Optimized */}
              <div 
                className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${cat.gradient} opacity-0 group-hover/item:opacity-10 transition-opacity duration-300 pointer-events-none`}
                style={{ willChange: 'opacity' }}
                aria-hidden="true"
              ></div>
            </div>
          ))}
        </div>
      </div>

      {/* Corner accents - Simplified opacity changes */}
      <div 
        className={`absolute top-0 right-0 w-16 h-16 ${cat.accent} opacity-0 group-hover:opacity-10 rounded-bl-3xl transition-opacity duration-300 pointer-events-none`}
        style={{ willChange: 'opacity' }}
        aria-hidden="true"
      ></div>
      <div 
        className={`absolute bottom-0 left-0 w-16 h-16 ${cat.accent} opacity-0 group-hover:opacity-10 rounded-tr-3xl transition-opacity duration-300 pointer-events-none`}
        style={{ willChange: 'opacity' }}
        aria-hidden="true"
      ></div>
    </div>
  );
});

CategoryCard.displayName = 'CategoryCard';

// Memoized Skeleton Loader with TypeScript
const SkeletonLoader = memo(() => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, index) => (
      <div
        key={index}
        className="relative bg-gradient-to-br from-amber-50 to-orange-50 border border-white rounded-3xl p-6 shadow-xl min-h-[320px] w-full overflow-hidden"
        style={{ contain: 'content' }}
        aria-hidden="true"
      >
        <div className="relative z-10 h-full flex flex-col">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-amber-200 rounded-2xl ml-4 animate-pulse"></div>
            <div className="h-6 bg-amber-200 rounded w-32 animate-pulse"></div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 flex-1">
            {[...Array(4)].map((_, itemIndex) => (
              <div
                key={itemIndex}
                className="relative bg-white/80 border border-white rounded-2xl overflow-hidden min-h-[80px] animate-pulse flex items-center justify-center"
              >
                <div className="w-8 h-8 bg-amber-200 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ))}
  </div>
));

SkeletonLoader.displayName = 'SkeletonLoader';

export default function HeroSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Memoized display categories calculation with proper TypeScript return type
  const displayCategories: DisplayCategory[] = useMemo(() => {
    const activeCategories = categories.filter(cat => cat.isActive);
    
    if (activeCategories.length === 0) {
      return PREDEFINED_COLOR_SCHEMES.map((scheme, index): DisplayCategory => ({
        id: `fallback-${index}`,
        title: `دسته‌بندی ${index + 1}`,
        description: 'توضیحات دسته‌بندی',
        slug: `category-${index}`,
        items: FALLBACK_ITEMS,
        gradient: scheme.gradient,
        bgGradient: scheme.bgGradient,
        accent: scheme.accent,
        icon: scheme.icon
      }));
    }

    return activeCategories.map((category, index): DisplayCategory => {
      const colorScheme = PREDEFINED_COLOR_SCHEMES[index % PREDEFINED_COLOR_SCHEMES.length];
      return {
        id: category._id,
        title: category.name,
        description: category.description,
        slug: category.slug,
        items: FALLBACK_ITEMS,
        gradient: colorScheme.gradient,
        bgGradient: colorScheme.bgGradient,
        accent: colorScheme.accent,
        icon: colorScheme.icon
      };
    });
  }, [categories]);

  // Memoized click handler with proper TypeScript
  const handleCategoryClick = useCallback((categoryName: string) => {
    // Use requestIdleCallback to defer non-critical work
    const saveToStorage = () => {
      try {
        localStorage.setItem('selectedCategory', categoryName);
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    };

    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(saveToStorage);
    } else {
      setTimeout(saveToStorage, 0);
    }
    
    router.push('/CoffeeCategoryPage');
  }, [router]);

  // Memoized view all categories handler
  const handleViewAllCategories = useCallback(() => {
    const clearStorage = () => {
      try {
        localStorage.removeItem('selectedCategory');
      } catch (error) {
        console.error('Error clearing localStorage:', error);
      }
    };

    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(clearStorage);
    } else {
      setTimeout(clearStorage, 0);
    }
    
    router.push('/CoffeeCategoryPage');
  }, [router]);

  // Optimized data fetching with TypeScript cleanup
  useEffect(() => {
    let mounted = true;
    let fetchTimeout: NodeJS.Timeout;
    const abortController = new AbortController();

    const fetchCategories = async (): Promise<void> => {
      try {
        // Small delay to allow initial render and scroll to be smooth
        await new Promise(resolve => setTimeout(resolve, 100));
        
        if (!mounted) return;

        const response = await fetch('https://coffee-shop-backend-k3un.onrender.com/api/v1/category', {
          signal: abortController.signal,
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result: ApiResponse = await response.json();
        
        if (mounted && result.success && result.data.categories) {
          // Batch state updates
          setCategories(result.data.categories);
          setLoading(false);
        } else if (mounted) {
          throw new Error('Failed to fetch categories from backend');
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') {
          console.log('Fetch aborted');
          return;
        }
        
        if (mounted) {
          console.error('Error fetching categories:', err);
          setError('خطا در دریافت دسته‌بندی‌ها. لطفا دوباره تلاش کنید.');
          setCategories([]);
          setLoading(false);
        }
      }
    };

    // Start fetching after initial paint
    fetchTimeout = setTimeout(fetchCategories, 0);

    return () => {
      mounted = false;
      clearTimeout(fetchTimeout);
      abortController.abort();
    };
  }, []);

  // Handle error retry
  const handleRetry = useCallback(() => {
    setLoading(true);
    setError(null);
    window.location.reload();
  }, []);

  // Early return for error state
  if (error && displayCategories.length === 0) {
    return (
      <section 
        className="w-full bg-gradient-to-br from-amber-50 via-white to-amber-100 py-16 px-4 md:px-10 lg:px-20 mt-34"
        role="alert"
        aria-live="polite"
      >
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-amber-600 text-lg font-[var(--font-yekan)] mb-4">
            {error}
          </div>
          <button
            onClick={handleRetry}
            className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl font-[var(--font-yekan)] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            aria-label="تلاش مجدد برای بارگذاری دسته‌بندی‌ها"
          >
            تلاش مجدد
          </button>
        </div>
      </section>
    );
  }

  return (
    <section 
      className="w-full bg-gradient-to-br from-amber-50 via-white to-amber-100 py-16 px-4 md:px-10 lg:px-20 mt-34"
      aria-label="دسته‌بندی‌های محصولات"
    >
      <div className="max-w-7xl mx-auto">
        {/* Categories Grid */}
        {loading ? (
          <SkeletonLoader />
        ) : (
          <div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            role="list"
            aria-label="لیست دسته‌بندی‌ها"
          >
            {displayCategories.map((cat) => (
              <CategoryCard
                key={cat.id}
                cat={cat}
                onCategoryClick={handleCategoryClick}
              />
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-12">
          <button 
            onClick={handleViewAllCategories}
            className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 font-[var(--font-yekan)] text-lg will-change-transform focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            style={{ transform: 'translateZ(0)' }}
            aria-label="مشاهده همه دسته‌بندی‌ها"
          >
            مشاهده همه دسته‌بندی‌ها
          </button>
        </div>
      </div>

      {/* Background decorations - Moved outside of scrollable content */}
      <div 
        className="fixed top-0 right-0 w-32 h-32 bg-amber-300/10 rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      ></div>
      <div 
        className="fixed bottom-0 left-0 w-40 h-40 bg-amber-600/10 rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      ></div>
    </section>
  );
}