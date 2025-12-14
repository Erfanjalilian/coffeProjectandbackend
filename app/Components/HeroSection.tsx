import { cache } from 'react';
import InteractiveCategoryCard from '@/app/Components/InteractiveCategoryCard';
import ViewAllButton from '@/app/Components/ViewAllButton';

// Define SubItem type locally
type SubItem = {
  name: string;
  image: string;
};

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

// Color schemes
const PREDEFINED_COLOR_SCHEMES = [
  { bgColor: "bg-blue-50", accent: "bg-blue-500" },
  { bgColor: "bg-blue-100", accent: "bg-blue-600" },
  { bgColor: "bg-blue-50", accent: "bg-blue-500" },
  { bgColor: "bg-indigo-50", accent: "bg-indigo-500" },
  { bgColor: "bg-sky-50", accent: "bg-sky-500" },
  { bgColor: "bg-cyan-50", accent: "bg-cyan-500" },
] as const;

// Static sub-items - Using absolute paths from public folder
const CATEGORY_SUB_ITEMS: SubItem[] = [
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
];

// Cache the API call
const getCategories = cache(async (): Promise<Category[]> => {
  try {
    const response = await fetch(
      'https://coffee-shop-backend-k3un.onrender.com/api/v1/category',
      {
        next: { 
          revalidate: 300,
          tags: ['categories'] 
        },
        headers: {
          'Cache-Control': 'public, max-age=300'
        }
      }
    );

    if (!response.ok) {
      console.error(`API Error: ${response.status}`);
      return [];
    }

    const result: ApiResponse = await response.json();
    
    if (result.success && result.data.categories) {
      return result.data.categories
        .filter(cat => cat.isActive)
        .sort((a, b) => a.order - b.order)
        .slice(0, 6);
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
});

export default async function HeroSection() {
  const categories = await getCategories();
  
  if (categories.length === 0) {
    return (
      <section className="w-full py-12 px-4 md:px-8 lg:px-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-gray-800 text-lg font-[var(--font-yekan)] mb-4">
            هیچ دسته‌بندی فعالی یافت نشد
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-12 px-4 md:px-8 lg:px-16 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 font-[var(--font-yekan)] mb-2">
            دسته‌بندی‌های محصولات
          </h2>
          <p className="text-gray-600 font-[var(--font-yekan)]">
            محصولات خود را بر اساس دسته‌بندی مورد نظر جستجو کنید
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {categories.map((category, index) => {
            const colorScheme = PREDEFINED_COLOR_SCHEMES[index % PREDEFINED_COLOR_SCHEMES.length];
            
            return (
              <InteractiveCategoryCard
                key={category._id}
                category={{
                  id: category._id,
                  name: category.name,
                  slug: category.slug,
                  description: category.description,
                  productsCount: category.productsCount
                }}
                colorScheme={colorScheme}
                subItems={CATEGORY_SUB_ITEMS}
                index={index}
              />
            );
          })}
        </div>

        <div className="text-center mt-10">
          <ViewAllButton />
        </div>
      </div>
    </section>
  );
}