"use client";


import { useState, useEffect } from "react";

interface Category {
  _id: string;
  name: string;
  description: string;
  images: string;
  color: string;
  isActive: boolean;
  showOnHomepage: boolean;
  productsCount: number;
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

// Predefined color schemes for categories (fallback if API doesn't provide enough categories)
const predefinedColorSchemes = [
  {
    gradient: "from-amber-500 to-orange-500",
    bgGradient: "from-amber-50 to-orange-50",
    accent: "bg-gradient-to-r from-amber-500 to-orange-500"
  },
  {
    gradient: "from-emerald-500 to-teal-600",
    bgGradient: "from-emerald-50 to-teal-50",
    accent: "bg-gradient-to-r from-emerald-500 to-teal-600"
  },
  {
    gradient: "from-blue-500 to-indigo-600",
    bgGradient: "from-blue-50 to-indigo-50",
    accent: "bg-gradient-to-r from-blue-500 to-indigo-600"
  },
  {
    gradient: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-50 to-pink-50",
    accent: "bg-gradient-to-r from-purple-500 to-pink-500"
  },
  {
    gradient: "from-rose-500 to-pink-600",
    bgGradient: "from-rose-50 to-pink-50",
    accent: "bg-gradient-to-r from-rose-500 to-pink-600"
  },
  {
    gradient: "from-cyan-500 to-blue-600",
    bgGradient: "from-cyan-50 to-blue-50",
    accent: "bg-gradient-to-r from-cyan-500 to-blue-600"
  },
];

// Fallback items for each category (since API doesn't provide sub-items)
const fallbackItems = [
  { name: "محصول ویژه", image: "/Images/premium_photo-1674407009848-4da7a12b6b25.avif" },
  { name: "پرفروش‌ها", image: "/Images/premium_photo-1674327105076-36c4419864cf.avif" },
  { name: "جدیدترین‌ها", image: "/Images/premium_photo-1673545518947-ddf3240090b1.avif" },
  { name: "تخفیف دار", image: "/Images/premium_photo-1671559021551-95106555ee19.avif" }
];

export default function HeroSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('https://coffee-shop-backend-k3un.onrender.com/api/v1/category');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result: ApiResponse = await response.json();
        
        if (result.success && result.data.categories) {
          // Filter only active categories
          const activeCategories = result.data.categories.filter(cat => cat.isActive);
          setCategories(activeCategories);
        } else {
          throw new Error('Failed to fetch categories from backend');
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('خطا در دریافت دسته‌بندی‌ها. لطفا دوباره تلاش کنید.');
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Combine API categories with predefined color schemes and fallback items
  const displayCategories = categories.map((category, index) => {
    const colorScheme = predefinedColorSchemes[index % predefinedColorSchemes.length];
    
    return {
      id: category._id,
      title: category.name,
      description: category.description,
      items: fallbackItems, // Using fallback items since API doesn't provide sub-items
      ...colorScheme
    };
  });

  // If no categories from API, use fallback categories to maintain design
  const finalCategories = displayCategories.length > 0 ? displayCategories : predefinedColorSchemes.map((scheme, index) => ({
    id: `fallback-${index}`,
    title: `دسته‌بندی ${index + 1}`,
    description: 'توضیحات دسته‌بندی',
    items: fallbackItems,
    ...scheme
  }));

  if (loading) {
    return (
      <section className="w-full bg-gradient-to-br from-amber-50 via-white to-amber-100 py-16 px-4 md:px-10 lg:px-20 mt-34">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="relative bg-gradient-to-br from-amber-50 to-orange-50 border border-white rounded-3xl p-6 shadow-xl min-h-[320px] w-full animate-pulse"
              >
                <div className="relative z-10 h-full flex flex-col">
                  <div className="flex items-center mb-6">
                    <div className="w-3 h-10 bg-amber-200 rounded-full ml-4"></div>
                    <div className="h-6 bg-amber-200 rounded w-32"></div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 flex-1">
                    {[...Array(4)].map((_, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="relative bg-white/80 backdrop-blur-sm border border-white rounded-2xl overflow-hidden h-20"
                      >
                        <div className="w-full h-full bg-amber-200 animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error && finalCategories.length === 0) {
    return (
      <section className="w-full bg-gradient-to-br from-amber-50 via-white to-amber-100 py-16 px-4 md:px-10 lg:px-20 mt-34">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-amber-600 text-lg font-[var(--font-yekan)] mb-4">
            {error}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl font-[var(--font-yekan)]"
          >
            تلاش مجدد
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-gradient-to-br from-amber-50 via-white to-amber-100 py-16 px-4 md:px-10 lg:px-20 mt-34">
      <div className="max-w-7xl mx-auto">
        {/* Categories Grid - 3 columns on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {finalCategories.map((cat) => (
            <div
              key={cat.id}
              className={`relative bg-gradient-to-br ${cat.bgGradient} border border-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden min-h-[320px] w-full`}
            >
              {/* Background Elements */}
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

              <div className="relative z-10 h-full flex flex-col">
                <div className="flex items-center mb-6">
                  <div className={`w-3 h-10 ${cat.accent} rounded-full ml-4 shadow-lg`}></div>
                  <h3 className="text-xl font-bold text-gray-800 font-[var(--font-yekan)] group-hover:text-gray-900 transition-colors duration-300">
                    {cat.title}
                  </h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4 flex-1">
                  {cat.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="relative bg-white/80 backdrop-blur-sm border border-white rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 group/item"
                    >
                      {/* Image Container */}
                    
                      
                      {/* Text Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                        <span className="text-xs font-[var(--font-yekan)] text-white font-medium block text-center">
                          {item.name}
                        </span>
                      </div>

                      {/* Hover gradient border effect */}
                      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${cat.gradient} opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 -z-10`}></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Corner accents */}
              <div className={`absolute top-0 right-0 w-16 h-16 ${cat.accent} opacity-0 group-hover:opacity-10 rounded-bl-3xl transition-opacity duration-300`}></div>
              <div className={`absolute bottom-0 left-0 w-16 h-16 ${cat.accent} opacity-0 group-hover:opacity-10 rounded-tr-3xl transition-opacity duration-300`}></div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <button className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 font-[var(--font-yekan)] text-lg">
            مشاهده همه دسته‌بندی‌ها
          </button>
        </div>
      </div>

      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-300/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-amber-600/10 rounded-full blur-3xl"></div>
    </section>
  );
}