"use client";

import { useRouter } from "next/navigation";

export default function ViewAllButton() {
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
}