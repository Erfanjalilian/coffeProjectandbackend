"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { FiStar, FiCoffee, FiMessageCircle, FiFilter, FiChevronDown, FiX } from "react-icons/fi";
import React from "react";

// Types remain the same as before
interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  badge: string;
  rating: number;
  reviews: number;
  isPrime: boolean;
  discount: number;
  type: string;
  positiveFeature: string;
  status: string;
  brand?: string;
  recommended?: boolean;
}

interface Category {
  id: string;
  name: string;
  count: number;
  active: boolean;
}

interface PriceRange {
  id: number;
  label: string;
  value: string;
  min: number;
  max: number;
}

interface Filters {
  brands: string[];
  priceRanges: PriceRange[];
  ratings: number[];
}

interface ActiveFilters {
  selectedBrands: string[];
  selectedPriceRange: string;
  selectedRatings: number[];
  selectedCategories: string[];
  priceRange: [number, number];
}

// Custom hook for data fetching
function useProducts() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('https://coffee-shop-backend-k3un.onrender.com/api/v1/product');
        if (!response.ok) throw new Error('Failed to fetch');
        const result = await response.json();
        
        if (result.success) {
          const productsData = result.data.products.map((product: any) => ({
            id: product._id,
            name: product.name,
            price: product.priceAfterDiscount || product.price,
            originalPrice: product.originalPrice,
            image: product.image,
            category: product.category?.name || 'بدون دسته‌بندی',
            badge: product.badge,
            rating: product.rating || 0,
            reviews: product.reviews || 0,
            isPrime: product.isPrime,
            discount: product.discount,
            type: product.type || 'regular',
            positiveFeature: product.positiveFeature,
            status: getStatusFromBadge(product.badge),
            brand: product.brand,
            recommended: product.recommended || false
          }));
          
          setAllProducts(productsData);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProducts();
  }, []);

  return { allProducts, loading };
}

// Custom hook for filters
function useFilteredProducts(allProducts: Product[]) {
  const [filters, setFilters] = useState<Filters>({ brands: [], priceRanges: [], ratings: [] });
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    selectedBrands: [],
    selectedPriceRange: "",
    selectedRatings: [],
    selectedCategories: [],
    priceRange: [0, 1000000]
  });
  const [quickFilter, setQuickFilter] = useState<'all' | 'recommended'>('all');
  const [customMinPrice, setCustomMinPrice] = useState("0");
  const [customMaxPrice, setCustomMaxPrice] = useState("1000000");

  // Generate filters from products
  useEffect(() => {
    if (allProducts.length === 0) return;
    
    const uniqueBrands = Array.from(new Set(allProducts
      .map(product => product.brand)
      .filter(brand => brand && brand.trim() !== "")
    )) as string[];

    const prices = allProducts.map(p => p.price).filter(price => price > 0);
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 1000000;
    
    const dynamicPriceRanges = generatePriceRanges(minPrice, maxPrice);

    const availableRatings = Array.from(new Set(allProducts
      .map(product => Math.floor(product.rating))
      .filter(rating => rating > 0)
    )).sort((a, b) => b - a);

    setFilters({
      brands: uniqueBrands.length > 0 ? uniqueBrands : ["برندهای موجود"],
      priceRanges: dynamicPriceRanges,
      ratings: availableRatings.length > 0 ? availableRatings : [4, 3, 2, 1]
    });

    setCustomMinPrice(minPrice.toString());
    setCustomMaxPrice(maxPrice.toString());
    
    setActiveFilters(prev => ({
      ...prev,
      priceRange: [minPrice, maxPrice]
    }));
  }, [allProducts]);

  // Apply filters with useMemo for performance
  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts];

    // Brand filter
    if (activeFilters.selectedBrands.length > 0) {
      filtered = filtered.filter(product => 
        product.brand && activeFilters.selectedBrands.includes(product.brand)
      );
    }

    // Price filter
    filtered = filtered.filter(product => 
      product.price >= activeFilters.priceRange[0] && product.price <= activeFilters.priceRange[1]
    );

    // Rating filter
    if (activeFilters.selectedRatings.length > 0) {
      filtered = filtered.filter(product => 
        activeFilters.selectedRatings.some(rating => Math.floor(product.rating) >= rating)
      );
    }

    // Category filter
    if (activeFilters.selectedCategories.length > 0 && 
        !activeFilters.selectedCategories.includes("همه دسته‌بندی‌ها")) {
      filtered = filtered.filter(product => 
        activeFilters.selectedCategories.includes(product.category)
      );
    }

    // Quick filter (recommended)
    if (quickFilter === 'recommended') {
      filtered = filtered.filter(product => product.recommended === true);
    }

    return filtered;
  }, [allProducts, activeFilters, quickFilter]);

  const handleCustomPriceChange = useCallback((min: string, max: string) => {
    const minNum = parseInt(min) || 0;
    const maxNum = parseInt(max) || 1000000;
    const validatedMin = Math.min(minNum, maxNum);
    const validatedMax = Math.max(minNum, maxNum);
    
    setCustomMinPrice(validatedMin.toString());
    setCustomMaxPrice(validatedMax.toString());
    
    setActiveFilters(prev => ({
      ...prev,
      selectedPriceRange: "custom",
      priceRange: [validatedMin, validatedMax]
    }));
  }, []);

  return { 
    filters, 
    activeFilters, 
    setActiveFilters, 
    quickFilter, 
    setQuickFilter, 
    filteredProducts,
    customMinPrice,
    customMaxPrice,
    handleCustomPriceChange
  };
}

// Helper functions
function getStatusFromBadge(badge: string): string {
  switch (badge) {
    case "پرفروش": return "پر فروش";
    case "جدید": return "جدید";
    case "ویژه": return "فروش ویژه";
    default: return "جدید";
  }
}

function generatePriceRanges(minPrice: number, maxPrice: number): PriceRange[] {
  if (minPrice === maxPrice || maxPrice - minPrice < 10000) {
    return [{
      id: 1,
      label: `${formatPrice(minPrice)}`,
      value: `${minPrice}-${maxPrice}`,
      min: minPrice,
      max: maxPrice
    }];
  }

  const ranges: PriceRange[] = [];
  const rangeCount = Math.min(5, Math.ceil((maxPrice - minPrice) / 100000) || 1);
  const step = Math.ceil((maxPrice - minPrice) / rangeCount);
  
  for (let i = 0; i < rangeCount; i++) {
    const rangeMin = minPrice + (i * step);
    const rangeMax = i === rangeCount - 1 ? maxPrice : minPrice + ((i + 1) * step);
    
    ranges.push({
      id: i + 1,
      label: `${formatPrice(rangeMin)} - ${formatPrice(rangeMax)}`,
      value: `${rangeMin}-${rangeMax}`,
      min: rangeMin,
      max: rangeMax
    });
  }
  
  return ranges;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('fa-IR').format(price) + " تومان";
}

// Skeleton Components
function ProductSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden animate-pulse">
      <div className="h-56 bg-gradient-to-br from-blue-100 to-blue-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-blue-100 rounded w-3/4" />
        <div className="h-3 bg-blue-100 rounded w-1/2" />
        <div className="h-6 bg-blue-100 rounded w-1/3" />
        <div className="h-10 bg-blue-100 rounded" />
      </div>
    </div>
  );
}

function FilterSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-blue-200 p-6 sticky top-32">
      <div className="h-6 bg-blue-100 rounded w-1/3 mb-6" />
      {[...Array(4)].map((_, i) => (
        <div key={i} className="mb-4">
          <div className="h-4 bg-blue-100 rounded w-1/2 mb-3" />
          <div className="space-y-2">
            {[...Array(3)].map((_, j) => (
              <div key={j} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-100 rounded" />
                  <div className="h-3 bg-blue-100 rounded w-24" />
                </div>
                <div className="w-8 h-6 bg-blue-100 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Mobile Filter Section Component
function MobileFilterSection({ 
  title, 
  children,
  isExpanded,
  onToggle 
}: { 
  title: string; 
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-blue-200 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full py-4 flex items-center justify-between text-right font-[var(--font-yekan)]"
      >
        <span className="font-semibold text-gray-700">{title}</span>
        <FiChevronDown className={`text-blue-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </button>
      {isExpanded && (
        <div className="pb-4">
          {children}
        </div>
      )}
    </div>
  );
}

// Product Card Component
const ProductCard = React.memo(({ product }: { product: Product }) => {
  const statusStyle = product.status === "فروش ویژه" 
    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white"
    : product.status === "جدید"
    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
    : "bg-gradient-to-r from-blue-600 to-blue-700 text-white";

  const handleBuyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(`/CoffeeCategoryPage/${product.id}`, '_blank');
  };

  return (
    <Link href={`/CoffeeCategoryPage/${product.id}`} target="_blank" className="block">
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-blue-100 overflow-hidden group cursor-pointer h-full flex flex-col">
        <div className="relative h-56">
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
            <FiCoffee className="text-blue-400 text-4xl" />
          </div>
          
          {product.discount > 0 && (
            <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">
              {product.discount}% تخفیف
            </div>
          )}
          
          <div className="absolute top-2 right-2">
            <span className={`text-xs px-2 py-1 rounded-full font-medium font-[var(--font-yekan)] shadow-md ${statusStyle}`}>
              {product.status}
            </span>
          </div>
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <div className="flex-1">
            <h3 className="font-bold text-gray-800 mb-2 text-sm leading-relaxed font-[var(--font-yekan)] line-clamp-2">
              {product.name}
            </h3>
            
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-blue-400 fill-blue-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500 font-[var(--font-yekan)]">
                ({product.reviews})
              </span>
            </div>

            <div className="mb-3">
              <span className="text-xs text-blue-600 font-medium font-[var(--font-yekan)] line-clamp-1">
                {product.positiveFeature}
              </span>
            </div>
          </div>

          <div className="space-y-3 mt-auto">
            <div className="space-y-1">
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-gray-500 line-through font-[var(--font-yekan)] block">
                  {new Intl.NumberFormat('fa-IR').format(product.originalPrice)} تومان
                </span>
              )}
              <span className={`font-bold text-blue-700 font-[var(--font-yekan)] block ${
                product.originalPrice && product.originalPrice > product.price ? 'text-base' : 'text-lg'
              }`}>
                {new Intl.NumberFormat('fa-IR').format(product.price)} تومان
              </span>
            </div>

            <button
              onClick={handleBuyClick}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-2 py-3 rounded-xl font-semibold transition-all shadow-lg font-[var(--font-yekan)] text-sm w-full"
            >
              خرید
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
});

ProductCard.displayName = 'ProductCard';

// Filter Sidebar Component
const FilterSidebar = React.memo(({ 
  filters, 
  activeFilters, 
  setActiveFilters,
  quickFilter,
  setQuickFilter,
  categories,
  customMinPrice,
  customMaxPrice,
  handleCustomPriceChange
}: { 
  filters: Filters;
  activeFilters: ActiveFilters;
  setActiveFilters: React.Dispatch<React.SetStateAction<ActiveFilters>>;
  quickFilter: 'all' | 'recommended';
  setQuickFilter: (filter: 'all' | 'recommended') => void;
  categories: Category[];
  customMinPrice: string;
  customMaxPrice: string;
  handleCustomPriceChange: (min: string, max: string) => void;
}) => {
  const handleBrandFilter = useCallback((brand: string) => {
    setActiveFilters(prev => ({
      ...prev,
      selectedBrands: prev.selectedBrands.includes(brand)
        ? prev.selectedBrands.filter(b => b !== brand)
        : [...prev.selectedBrands, brand]
    }));
  }, [setActiveFilters]);

  const handleRatingFilter = useCallback((rating: number) => {
    setActiveFilters(prev => ({
      ...prev,
      selectedRatings: prev.selectedRatings.includes(rating)
        ? prev.selectedRatings.filter(r => r !== rating)
        : [...prev.selectedRatings, rating]
    }));
  }, [setActiveFilters]);

  const handleCategoryFilter = useCallback((categoryName: string) => {
    setActiveFilters(prev => {
      let updatedCategories: string[];
      
      if (categoryName === "همه دسته‌بندی‌ها") {
        updatedCategories = prev.selectedCategories.includes("همه دسته‌بندی‌ها") 
          ? [] 
          : ["همه دسته‌بندی‌ها"];
      } else {
        const isSelected = prev.selectedCategories.includes(categoryName);
        updatedCategories = isSelected
          ? prev.selectedCategories.filter(c => c !== categoryName && c !== "همه دسته‌بندی‌ها")
          : [...prev.selectedCategories.filter(c => c !== "همه دسته‌بندی‌ها"), categoryName];
      }
      
      return { ...prev, selectedCategories: updatedCategories };
    });
  }, [setActiveFilters]);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-blue-200 p-6 sticky top-32">
      <h3 className="font-bold text-gray-800 font-[var(--font-yekan)] mb-6">فیلترها</h3>

      {/* Quick Filter */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-700 mb-3 font-[var(--font-yekan)]">فیلتر سریع</h4>
        <button
          onClick={() => setQuickFilter(quickFilter === 'recommended' ? 'all' : 'recommended')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all font-[var(--font-yekan)] w-full text-right ${
            quickFilter === 'recommended'
              ? 'bg-orange-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          توصیه شده‌ها
        </button>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-700 mb-3 font-[var(--font-yekan)]">دسته‌بندی‌ها</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category.id} className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={activeFilters.selectedCategories.includes(category.name)}
                  onChange={() => handleCategoryFilter(category.name)}
                  className="rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600 font-[var(--font-yekan)]">
                  {category.name}
                </span>
              </div>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                {category.count}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-700 mb-3 font-[var(--font-yekan)]">محدوده قیمت</h4>
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-700 font-[var(--font-yekan)]">قیمت دلخواه</span>
            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full font-[var(--font-yekan)]">
              {formatPrice(activeFilters.priceRange[0])} - {formatPrice(activeFilters.priceRange[1])}
            </span>
          </div>
          
          <div className="flex gap-2 mb-3">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1 font-[var(--font-yekan)]">حداقل</label>
              <input
                type="text"
                value={customMinPrice}
                onChange={(e) => handleCustomPriceChange(e.target.value, customMaxPrice)}
                placeholder="۰"
                className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-[var(--font-yekan)] text-left"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1 font-[var(--font-yekan)]">حداکثر</label>
              <input
                type="text"
                value={customMaxPrice}
                onChange={(e) => handleCustomPriceChange(customMinPrice, e.target.value)}
                placeholder="۱۰۰۰۰۰۰"
                className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-[var(--font-yekan)] text-left"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Brands */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-700 mb-3 font-[var(--font-yekan)]">برندها</h4>
        <div className="space-y-2">
          {filters.brands.map((brand) => (
            <label key={brand} className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={activeFilters.selectedBrands.includes(brand)}
                onChange={() => handleBrandFilter(brand)}
                className="rounded border-blue-300 text-blue-600 focus:ring-blue-500" 
              />
              <span className="text-sm text-gray-600 font-[var(--font-yekan)]">
                {brand}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Ratings */}
      <div>
        <h4 className="font-semibold text-gray-700 mb-3 font-[var(--font-yekan)]">امتیاز</h4>
        <div className="space-y-2">
          {filters.ratings.map((rating) => (
            <label key={rating} className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={activeFilters.selectedRatings.includes(rating)}
                onChange={() => handleRatingFilter(rating)}
                className="rounded border-blue-300 text-blue-600 focus:ring-blue-500" 
              />
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={`w-3 h-3 ${i < rating ? 'text-blue-400 fill-blue-400' : 'text-gray-300'}`}
                  />
                ))}
                <span className="text-xs text-gray-500 mr-1">و بالاتر</span>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
});

FilterSidebar.displayName = 'FilterSidebar';

// Main Component
export default function CoffeeCategoryPage() {
  const { allProducts, loading: productsLoading } = useProducts();
  const { 
    filters, 
    activeFilters, 
    setActiveFilters, 
    quickFilter, 
    setQuickFilter, 
    filteredProducts,
    customMinPrice,
    customMaxPrice,
    handleCustomPriceChange
  } = useFilteredProducts(allProducts);
  
  const [selectedCategoryFromStorage, setSelectedCategoryFromStorage] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([
    { id: "all", name: "همه دسته‌بندی‌ها", count: 0, active: true }
  ]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [expandedMobileFilter, setExpandedMobileFilter] = useState<string | null>(null);

  // Initialize categories from products
  useEffect(() => {
    if (allProducts.length === 0) return;

    const categoryProductCounts = new Map();
    allProducts.forEach(product => {
      const categoryName = product.category;
      categoryProductCounts.set(categoryName, (categoryProductCounts.get(categoryName) || 0) + 1);
    });

    const uniqueCategories = Array.from(categoryProductCounts.entries()).map(([name, count], index) => ({
      id: `cat-${index}`,
      name,
      count,
      active: false
    }));

    setCategories([
      { id: "all", name: "همه دسته‌بندی‌ها", count: allProducts.length, active: true },
      ...uniqueCategories
    ]);

    // Check localStorage for saved category
    const savedCategory = localStorage.getItem('selectedCategory');
    setSelectedCategoryFromStorage(savedCategory);
    
    if (savedCategory) {
      const targetCategory = uniqueCategories.find(cat => cat.name === savedCategory);
      if (targetCategory) {
        setActiveFilters(prev => ({
          ...prev,
          selectedCategories: [targetCategory.name]
        }));
        localStorage.removeItem('selectedCategory');
      }
    }
  }, [allProducts, setActiveFilters]);

  // Show skeleton immediately for first paint
  if (productsLoading && allProducts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-34">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Breadcrumb Skeleton */}
          <div className="h-4 bg-blue-100 rounded w-1/4 mb-6 animate-pulse" />
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filter Skeleton */}
            <div className="lg:w-64 flex-shrink-0 hidden lg:block">
              <FilterSkeleton />
            </div>
            
            {/* Products Skeleton */}
            <div className="flex-1">
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
                {[...Array(6)].map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-34">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 mb-6 font-[var(--font-yekan)]">
          <span>خانه / </span>
          <span>دسته‌بندی کالا‌ها</span>
          {selectedCategoryFromStorage && (
            <>
              <span> / </span>
              <span className="text-blue-600">{selectedCategoryFromStorage}</span>
            </>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters */}
          <div className="lg:w-64 flex-shrink-0 hidden lg:block">
            <FilterSidebar
              filters={filters}
              activeFilters={activeFilters}
              setActiveFilters={setActiveFilters}
              quickFilter={quickFilter}
              setQuickFilter={setQuickFilter}
              categories={categories}
              customMinPrice={customMinPrice}
              customMaxPrice={customMaxPrice}
              handleCustomPriceChange={handleCustomPriceChange}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setShowMobileFilters(true)}
                className="w-full bg-white border-2 border-blue-300 rounded-2xl p-4 flex items-center justify-between shadow-lg font-[var(--font-yekan)]"
              >
                <div className="flex items-center gap-2">
                  <FiFilter className="text-blue-600" />
                  <span className="font-semibold text-gray-800">فیلترها و مرتب‌سازی</span>
                </div>
                <FiChevronDown className="text-blue-600" />
              </button>
            </div>

            {/* Header */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl border border-blue-200 p-6 mb-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-600 rounded-full p-3">
                    <FiMessageCircle className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-blue-800 mb-1 font-[var(--font-yekan)]">
                      نیاز به مشاوره دارید؟
                    </h3>
                    <p className="text-blue-700 font-[var(--font-yekan)] text-sm">
                      برای دریافت راهنمایی تخصصی در انتخاب محصول، روی دکمه "از من بپرس" کلیک کنید
                    </p>
                  </div>
                </div>
                
                <button className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg font-[var(--font-yekan)]">
                  <FiMessageCircle size={18} />
                  <span>از من بپرس</span>
                </button>
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-600 font-[var(--font-yekan)]">
                نمایش {filteredProducts.length} محصول از {allProducts.length} محصول
              </p>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* No Products */}
            {filteredProducts.length === 0 && !productsLoading && (
              <div className="text-center py-12">
                <p className="text-gray-600 font-[var(--font-yekan)] text-lg">
                  محصولی با فیلترهای انتخاب شده یافت نشد.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden">
          <div className="fixed top-0 right-0 bottom-0 left-0 bg-white flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-blue-200 bg-blue-50">
              <h2 className="text-xl font-bold text-blue-800 font-[var(--font-yekan)]">فیلترها</h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-3 text-gray-600 hover:text-blue-700 rounded-full hover:bg-blue-100"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Filters Content */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <div className="bg-white rounded-2xl border border-blue-200 p-5">
                {/* Quick Filter */}
                <MobileFilterSection 
                  title="فیلتر سریع" 
                  isExpanded={expandedMobileFilter === 'quick'}
                  onToggle={() => setExpandedMobileFilter(expandedMobileFilter === 'quick' ? null : 'quick')}
                >
                  <div className="space-y-3 mt-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={quickFilter === 'recommended'}
                        onChange={() => setQuickFilter(quickFilter === 'recommended' ? 'all' : 'recommended')}
                        className="w-5 h-5 rounded border-blue-300 text-blue-600 focus:ring-blue-500" 
                      />
                      <span className="text-sm text-gray-600 font-[var(--font-yekan)]">
                        توصیه شده‌ها
                      </span>
                    </label>
                  </div>
                </MobileFilterSection>

                {/* Categories */}
                <MobileFilterSection 
                  title="دسته‌بندی‌ها" 
                  isExpanded={expandedMobileFilter === 'categories'}
                  onToggle={() => setExpandedMobileFilter(expandedMobileFilter === 'categories' ? null : 'categories')}
                >
                  <div className="space-y-3 mt-3">
                    {categories.map((category) => (
                      <label key={category.id} className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={activeFilters.selectedCategories.includes(category.name)}
                            onChange={() => {
                              let updatedCategories: string[];
                              
                              if (category.name === "همه دسته‌بندی‌ها") {
                                updatedCategories = activeFilters.selectedCategories.includes("همه دسته‌بندی‌ها") 
                                  ? [] 
                                  : ["همه دسته‌بندی‌ها"];
                              } else {
                                const isSelected = activeFilters.selectedCategories.includes(category.name);
                                updatedCategories = isSelected
                                  ? activeFilters.selectedCategories.filter(c => c !== category.name && c !== "همه دسته‌بندی‌ها")
                                  : [...activeFilters.selectedCategories.filter(c => c !== "همه دسته‌بندی‌ها"), category.name];
                              }
                              
                              setActiveFilters(prev => ({
                                ...prev,
                                selectedCategories: updatedCategories
                              }));
                            }}
                            className="w-5 h-5 rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-600 font-[var(--font-yekan)]">
                            {category.name}
                          </span>
                        </div>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1.5 rounded-full">
                          {category.count}
                        </span>
                      </label>
                    ))}
                  </div>
                </MobileFilterSection>

                {/* Price Range */}
                <MobileFilterSection 
                  title="محدوده قیمت" 
                  isExpanded={expandedMobileFilter === 'price'}
                  onToggle={() => setExpandedMobileFilter(expandedMobileFilter === 'price' ? null : 'price')}
                >
                  <div className="space-y-4 mt-3">
                    <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                      <div className="flex gap-3 mb-4">
                        <div className="flex-1">
                          <label className="block text-xs text-gray-500 mb-2 font-[var(--font-yekan)]">حداقل قیمت</label>
                          <input
                            type="text"
                            value={customMinPrice}
                            onChange={(e) => handleCustomPriceChange(e.target.value, customMaxPrice)}
                            placeholder="۰"
                            className="w-full px-4 py-3 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-[var(--font-yekan)] text-left"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs text-gray-500 mb-2 font-[var(--font-yekan)]">حداکثر قیمت</label>
                          <input
                            type="text"
                            value={customMaxPrice}
                            onChange={(e) => handleCustomPriceChange(customMinPrice, e.target.value)}
                            placeholder="۱۰۰۰۰۰۰"
                            className="w-full px-4 py-3 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-[var(--font-yekan)] text-left"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </MobileFilterSection>

                {/* Brands */}
                <MobileFilterSection 
                  title="برندها" 
                  isExpanded={expandedMobileFilter === 'brands'}
                  onToggle={() => setExpandedMobileFilter(expandedMobileFilter === 'brands' ? null : 'brands')}
                >
                  <div className="space-y-3 mt-3">
                    {filters.brands.map((brand) => (
                      <label key={brand} className="flex items-center gap-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={activeFilters.selectedBrands.includes(brand)}
                          onChange={() => {
                            const isSelected = activeFilters.selectedBrands.includes(brand);
                            const updatedBrands = isSelected
                              ? activeFilters.selectedBrands.filter(b => b !== brand)
                              : [...activeFilters.selectedBrands, brand];
                            
                            setActiveFilters(prev => ({
                              ...prev,
                              selectedBrands: updatedBrands
                            }));
                          }}
                          className="w-5 h-5 rounded border-blue-300 text-blue-600 focus:ring-blue-500" 
                        />
                        <span className="text-sm text-gray-600 font-[var(--font-yekan)]">
                          {brand}
                        </span>
                      </label>
                    ))}
                  </div>
                </MobileFilterSection>

                {/* Ratings */}
                <MobileFilterSection 
                  title="امتیاز" 
                  isExpanded={expandedMobileFilter === 'ratings'}
                  onToggle={() => setExpandedMobileFilter(expandedMobileFilter === 'ratings' ? null : 'ratings')}
                >
                  <div className="space-y-3 mt-3">
                    {filters.ratings.map((rating) => (
                      <label key={rating} className="flex items-center gap-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={activeFilters.selectedRatings.includes(rating)}
                          onChange={() => {
                            const isSelected = activeFilters.selectedRatings.includes(rating);
                            const updatedRatings = isSelected
                              ? activeFilters.selectedRatings.filter(r => r !== rating)
                              : [...activeFilters.selectedRatings, rating];
                            
                            setActiveFilters(prev => ({
                              ...prev,
                              selectedRatings: updatedRatings
                            }));
                          }}
                          className="w-5 h-5 rounded border-blue-300 text-blue-600 focus:ring-blue-500" 
                        />
                        <div className="flex items-center gap-2">
                          {[...Array(5)].map((_, i) => (
                            <FiStar
                              key={i}
                              className={`w-4 h-4 ${i < rating ? 'text-blue-400 fill-blue-400' : 'text-gray-300'}`}
                            />
                          ))}
                          <span className="text-xs text-gray-500 mr-1">و بالاتر</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </MobileFilterSection>
              </div>
            </div>

            {/* Apply Button */}
            <div className="p-5 border-t border-blue-200 bg-white">
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-2xl font-semibold shadow-lg font-[var(--font-yekan)]"
              >
                اعمال فیلترها
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}