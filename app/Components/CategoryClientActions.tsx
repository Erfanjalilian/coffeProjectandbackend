"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  productsCount: number;
}

interface ColorScheme {
  bgColor: string;
  accent: string;
}

interface SubItem {
  name: string;
  image: string;
}

interface InteractiveCategoryCardProps {
  category: Category;
  colorScheme: ColorScheme;
  subItems: SubItem[];
  index: number;
}

// Main Card Component
export default function InteractiveCategoryCard({
  category,
  colorScheme,
  subItems,
  index
}: InteractiveCategoryCardProps) {
  const router = useRouter();

  const handleCardClick = (type?: string) => {
    try {
      localStorage.setItem('selectedCategory', category.name);
      localStorage.setItem('selectedCategorySlug', category.slug);
      
      if (type) {
        localStorage.setItem('selectedCategoryType', type);
      }
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
    
    router.push(`/CoffeeCategoryPage?category=${category.slug}`);
  };

  const handleSubItemClick = (e: React.MouseEvent, itemName: string) => {
    e.stopPropagation();
    const type = itemName.toLowerCase().replace(' ', '_');
    handleCardClick(type);
  };

  return (
    <div
      className={`relative ${colorScheme.bgColor} border border-gray-200 rounded-xl p-4 min-h-[320px] bg-white cursor-pointer group`}
      onClick={() => handleCardClick()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
      aria-label={`دسته‌بندی ${category.name}`}
    >
      <div className="h-full flex flex-col">
        {/* Category Header */}
        <div className="flex items-center mb-4">
          <div className={`w-10 h-10 ${colorScheme.accent} rounded-lg flex items-center justify-center ml-3 flex-shrink-0`}>
            <span className="text-white font-bold font-[var(--font-yekan)] text-sm">
              {category.name.charAt(0)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-800 font-[var(--font-yekan)] truncate group-hover:text-blue-600">
              {category.name}
            </h3>
            {category.description && (
              <p className="text-xs text-gray-600 font-[var(--font-yekan)] mt-1 line-clamp-2">
                {category.description}
              </p>
            )}
          </div>
        </div>
        
        {/* Sub-items Grid */}
        <div className="grid grid-cols-2 gap-3 flex-1">
          {subItems.map((item, itemIndex) => (
            <div
              key={itemIndex}
              className="bg-white border border-gray-100 rounded-lg p-2 flex flex-col items-center justify-center text-center hover:border-blue-200 transition-colors"
              onClick={(e) => handleSubItemClick(e, item.name)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSubItemClick(e as any, item.name);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`${item.name} در ${category.name}`}
            >
              <div className="relative w-full h-16 mb-2 rounded-lg overflow-hidden">
                {/* Image Container - Full width/height */}
                <div className="relative w-full h-full">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 33vw"
                    loading={itemIndex < 2 ? "eager" : "lazy"}
                    quality={75}
                    priority={index === 0 && itemIndex < 2} // Prioritize first category's first two images
                  />
                </div>
              </div>
              <span className="text-xs font-[var(--font-yekan)] text-gray-800 truncate w-full mt-1">
                {item.name}
              </span>
            </div>
          ))}
        </div>
        
        {/* Products Count */}
        {category.productsCount > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-600 font-[var(--font-yekan)]">
              {category.productsCount} محصول
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// View All Button Component
InteractiveCategoryCard.ViewAllButton = function ViewAllButton({ 
  categories 
}: { 
  categories: Category[] 
}) {
  const router = useRouter();

  const handleViewAllCategories = () => {
    try {
      localStorage.removeItem('selectedCategory');
      localStorage.removeItem('selectedCategorySlug');
      localStorage.removeItem('selectedCategoryType');
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
    router.push('/CoffeeCategoryPage');
  };

  return (
    <button 
      onClick={handleViewAllCategories}
      className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg font-[var(--font-yekan)] text-base focus:outline-none focus:ring-2 focus:ring-blue-500 border border-blue-400 shadow hover:bg-blue-700 transition-colors duration-200"
      aria-label="مشاهده همه دسته‌بندی‌ها"
    >
      مشاهده همه دسته‌بندی‌ها
    </button>
  );
};