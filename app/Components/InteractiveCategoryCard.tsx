"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { memo } from "react";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  productsCount: number;
}

export interface ColorScheme {
  bgColor: string;
  accent: string;
}

export interface SubItem {
  name: string;
  image: string;
}

interface InteractiveCategoryCardProps {
  category: Category;
  colorScheme: ColorScheme;
  subItems: SubItem[];
  index: number;
}

function InteractiveCategoryCard({
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
    const type = itemName.toLowerCase().replace(/[\s\u200c]+/g, '_');
    handleCardClick(type);
  };

  const handleKeyDown = (e: React.KeyboardEvent, itemName?: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (itemName) {
        const type = itemName.toLowerCase().replace(/[\s\u200c]+/g, '_');
        handleCardClick(type);
      } else {
        handleCardClick();
      }
    }
  };

  return (
    <div
      className={`relative ${colorScheme.bgColor} border border-gray-200 rounded-xl p-4 min-h-[320px] bg-white cursor-pointer group`}
      onClick={() => handleCardClick()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => handleKeyDown(e)}
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
              className="bg-white border border-gray-100 rounded-lg p-2 flex flex-col items-center justify-center text-center hover:border-blue-200"
              onClick={(e) => handleSubItemClick(e, item.name)}
              onKeyDown={(e) => {
                e.stopPropagation();
                handleKeyDown(e, item.name);
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
                    priority={index === 0 && itemIndex < 2}
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

// Memoize the component to prevent unnecessary re-renders
export default memo(InteractiveCategoryCard);