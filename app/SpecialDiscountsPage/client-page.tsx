// app/special-discounts/client-page.tsx
"use client";

import { useState, useEffect } from "react";
import { FiFilter, FiGrid, FiList, FiStar, FiChevronDown, FiX, FiMessageCircle, FiCoffee } from "react-icons/fi";
import Link from "next/link";

// Add PageProps interface
interface PageProps {
  initialProducts: Product[];
  error?: string;
}

// Types (keep your existing types exactly as they are)
interface Product {
  _id: string;
  name: string;
  description: string;
  positiveFeature: string;
  category: any;
  badge: string;
  images: string[];
  image: string;
  status: string;
  price: number;
  stock: number;
  originalPrice: number;
  discount: number;
  type: string;
  dealType?: string;
  timeLeft?: string;
  soldCount: number;
  totalCount: number;
  rating: number;
  reviews: number;
  isPrime: boolean;
  isPremium: boolean;
  features: string[];
  priceAfterDiscount: number;
  brand?: string;
  weight?: number;
  ingredients?: string;
  benefits?: string;
  howToUse?: string;
  hasWarranty?: boolean;
  warrantyDuration?: number;
  warrantyDescription?: string;
  userReviews: any[];
  recommended: boolean;
  relatedProducts: string[];
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  status: number;
  success: boolean;
  data: {
    products: Product[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
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

export default function ClientSpecialDiscountsPage({ initialProducts, error }: PageProps) {
  // Use initial data from server immediately
  const [discountProducts, setDiscountProducts] = useState<Product[]>(initialProducts);
  const [allProducts, setAllProducts] = useState<Product[]>(initialProducts);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('popular');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [expandedFilter, setExpandedFilter] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filters, setFilters] = useState<Filters>({ brands: [], priceRanges: [], ratings: [] });
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    selectedBrands: [],
    selectedPriceRange: "",
    selectedRatings: [],
    selectedCategories: [],
    priceRange: [0, 1000000]
  });
  const [customMinPrice, setCustomMinPrice] = useState<string>("");
  const [customMaxPrice, setCustomMaxPrice] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(initialProducts.length === 0);

  // Load additional data client-side if initial data is empty
  useEffect(() => {
    if (initialProducts.length === 0) {
      loadData();
    } else {
      // Generate filters from initial data
      generateDynamicFilters(initialProducts);
    }
    
    async function loadData() {
      try {
        setLoading(true);
        const response = await fetch('https://coffee-shop-backend-k3un.onrender.com/api/v1/product');
        const result: ApiResponse = await response.json();
        
        if (result.success && result.data.products) {
          const productsWithDiscount = result.data.products.filter(product => 
            product.discount > 0
          );
          
          setAllProducts(productsWithDiscount);
          setDiscountProducts(productsWithDiscount);
          generateDynamicFilters(productsWithDiscount);
        }
      } catch (error) {
        console.error('Error loading discount data:', error);
      } finally {
        setLoading(false);
      }
    }
  }, [initialProducts]);

  // Apply filters whenever activeFilters change
  useEffect(() => {
    applyFilters();
  }, [activeFilters, allProducts]);

  // Generate dynamic filters from products
  const generateDynamicFilters = (products: Product[]) => {
    if (products.length === 0) {
      setFilters({
        brands: ["برندهای موجود"],
        priceRanges: [
          { id: 1, label: "زیر ۱۰۰ هزار تومان", value: "0-100000", min: 0, max: 100000 },
          { id: 2, label: "۱۰۰ تا ۳۰۰ هزار تومان", value: "100000-300000", min: 100000, max: 300000 },
          { id: 3, label: "۳۰۰ تا ۵۰۰ هزار تومان", value: "300000-500000", min: 300000, max: 500000 },
          { id: 4, label: "۵۰۰ هزار تا ۱ میلیون", value: "500000-1000000", min: 500000, max: 1000000 },
          { id: 5, label: "بالای ۱ میلیون", value: "1000000-5000000", min: 1000000, max: 5000000 }
        ],
        ratings: [4, 3, 2, 1]
      });
      
      setCategories([
        { id: "all", name: "همه دسته‌بندی‌ها", count: 0, active: true }
      ]);
      return;
    }

    // Generate categories from products
    const categoryCounts = new Map();
    products.forEach(product => {
      const categoryName = product.category?.name || 'دسته‌بندی نشده';
      categoryCounts.set(categoryName, (categoryCounts.get(categoryName) || 0) + 1);
    });

    const categoryArray = Array.from(categoryCounts, ([name, count]) => ({
      id: name,
      name,
      count,
      active: false
    }));

    // Add "All Categories" option
    setCategories([
      { id: "all", name: "همه دسته‌بندی‌ها", count: products.length, active: true },
      ...categoryArray
    ]);

    // Extract unique brands
    const uniqueBrands = Array.from(new Set(
      products
        .map(p => p.brand)
        .filter(brand => brand && brand.trim() !== "")
    ));

    // Generate price ranges based on actual prices
    const prices = products.map(p => p.priceAfterDiscount || p.price).filter(price => price > 0);
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 1000000;
    
    const dynamicPriceRanges = generatePriceRanges(minPrice, maxPrice);

    // Extract available ratings
    const availableRatings = Array.from(new Set(products
      .map(product => Math.floor(product.rating))
      .filter(rating => rating > 0)
    )).sort((a, b) => b - a);

    const dynamicRatings = availableRatings.length > 0 ? availableRatings : [4, 3, 2, 1];

    setFilters({
      brands: uniqueBrands.length > 0 ? uniqueBrands as string[] : ["برندهای موجود"],
      priceRanges: dynamicPriceRanges,
      ratings: dynamicRatings
    });

    // Initialize custom price inputs with actual data
    setCustomMinPrice(minPrice.toString());
    setCustomMaxPrice(maxPrice.toString());
    setActiveFilters(prev => ({
      ...prev,
      priceRange: [minPrice, maxPrice]
    }));
  };

  // Apply all active filters
  const applyFilters = () => {
    let filteredProducts = [...allProducts];

    // Filter by brands
    if (activeFilters.selectedBrands.length > 0) {
      filteredProducts = filteredProducts.filter(product => 
        product.brand && activeFilters.selectedBrands.includes(product.brand)
      );
    }

    // Filter by price range
    filteredProducts = filteredProducts.filter(product => {
      const productPrice = product.priceAfterDiscount || product.price;
      return productPrice >= activeFilters.priceRange[0] && productPrice <= activeFilters.priceRange[1];
    });

    // Filter by ratings
    if (activeFilters.selectedRatings.length > 0) {
      filteredProducts = filteredProducts.filter(product => 
        activeFilters.selectedRatings.some(rating => Math.floor(product.rating) >= rating)
      );
    }

    // Filter by categories (excluding "All Categories")
    if (activeFilters.selectedCategories.length > 0 && 
        !activeFilters.selectedCategories.includes("همه دسته‌بندی‌ها")) {
      filteredProducts = filteredProducts.filter(product => 
        activeFilters.selectedCategories.includes(product.category?.name || 'دسته‌بندی نشده')
      );
    }

    setDiscountProducts(filteredProducts);
  };

  // Handle brand filter change
  const handleBrandFilter = (brand: string) => {
    setActiveFilters(prev => {
      const isSelected = prev.selectedBrands.includes(brand);
      const updatedBrands = isSelected
        ? prev.selectedBrands.filter(b => b !== brand)
        : [...prev.selectedBrands, brand];
      
      return {
        ...prev,
        selectedBrands: updatedBrands
      };
    });
  };

  // Handle rating filter change
  const handleRatingFilter = (rating: number) => {
    setActiveFilters(prev => {
      const isSelected = prev.selectedRatings.includes(rating);
      const updatedRatings = isSelected
        ? prev.selectedRatings.filter(r => r !== rating)
        : [...prev.selectedRatings, rating];
      
      return {
        ...prev,
        selectedRatings: updatedRatings
      };
    });
  };

  // Handle category filter change
  const handleCategoryFilter = (categoryId: string, categoryName: string) => {
    setActiveFilters(prev => {
      let updatedCategories: string[];
      
      if (categoryName === "همه دسته‌بندی‌ها") {
        // If "All Categories" is selected, clear other category selections
        updatedCategories = prev.selectedCategories.includes("همه دسته‌بندی‌ها") 
          ? [] 
          : ["همه دسته‌بندی‌ها"];
      } else {
        // For specific categories
        const isSelected = prev.selectedCategories.includes(categoryName);
        updatedCategories = isSelected
          ? prev.selectedCategories.filter(c => c !== categoryName && c !== "همه دسته‌بندی‌ها")
          : [...prev.selectedCategories.filter(c => c !== "همه دسته‌بندی‌ها"), categoryName];
      }
      
      return {
        ...prev,
        selectedCategories: updatedCategories
      };
    });

    // Update the categories UI state
    setCategories(prev => prev.map(cat => ({
      ...cat,
      active: cat.id === categoryId ? !cat.active : cat.active
    })));
  };

  // Handle custom price range
  const handleCustomPriceApply = () => {
    const min = parseInt(customMinPrice) || 0;
    const max = parseInt(customMaxPrice) || 1000000;
    
    // Validate and ensure min is not greater than max
    const validatedMin = Math.min(min, max);
    const validatedMax = Math.max(min, max);
    
    setActiveFilters(prev => ({
      ...prev,
      selectedPriceRange: "custom",
      priceRange: [validatedMin, validatedMax]
    }));
    
    // Update the input fields with validated values
    setCustomMinPrice(validatedMin.toString());
    setCustomMaxPrice(validatedMax.toString());
  };

  // Handle individual custom price input changes
  const handleCustomMinPriceChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    setCustomMinPrice(numericValue);
    
    // Update price range in real-time if both values are valid
    const min = parseInt(numericValue) || 0;
    const max = parseInt(customMaxPrice) || 1000000;
    
    const validatedMin = Math.min(min, max);
    const validatedMax = Math.max(min, max);
    
    setActiveFilters(prev => ({
      ...prev,
      selectedPriceRange: "custom",
      priceRange: [validatedMin, validatedMax]
    }));
  };

  const handleCustomMaxPriceChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    setCustomMaxPrice(numericValue);
    
    // Update price range in real-time if both values are valid
    const min = parseInt(customMinPrice) || 0;
    const max = parseInt(numericValue) || 1000000;
    
    const validatedMin = Math.min(min, max);
    const validatedMax = Math.max(min, max);
    
    setActiveFilters(prev => ({
      ...prev,
      selectedPriceRange: "custom",
      priceRange: [validatedMin, validatedMax]
    }));
  };

  // Clear all filters
  const clearAllFilters = () => {
    // Get the actual min and max prices from all products
    const prices = allProducts.map(p => p.priceAfterDiscount || p.price).filter(price => price > 0);
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 1000000;
    
    setActiveFilters({
      selectedBrands: [],
      selectedPriceRange: "",
      selectedRatings: [],
      selectedCategories: [],
      priceRange: [minPrice, maxPrice]
    });
    
    setCustomMinPrice(minPrice.toString());
    setCustomMaxPrice(maxPrice.toString());
    
    // Reset categories UI - only "All Categories" active
    setCategories(prev => prev.map(cat => ({
      ...cat,
      active: cat.id === "all"
    })));
  };

  // Generate price ranges based on actual price data
  const generatePriceRanges = (minPrice: number, maxPrice: number): PriceRange[] => {
    if (minPrice === maxPrice || maxPrice - minPrice < 10000) {
      return [
        {
          id: 1,
          label: `${formatPrice(minPrice)}`,
          value: `${minPrice}-${maxPrice}`,
          min: minPrice,
          max: maxPrice
        }
      ];
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
  };

  // Check if any filters are active
  const hasActiveFilters = 
    activeFilters.selectedBrands.length > 0 ||
    activeFilters.selectedRatings.length > 0 ||
    activeFilters.selectedCategories.length > 0 ||
    activeFilters.selectedPriceRange !== "" ||
    activeFilters.priceRange[0] > 0 ||
    activeFilters.priceRange[1] < 1000000;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + " تومان";
  };

  const formatProductPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + " تومان";
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "فروش ویژه":
        return "bg-gradient-to-r from-orange-500 to-orange-600 text-white";
      case "جدید":
        return "bg-gradient-to-r from-blue-500 to-blue-600 text-white";
      case "پر فروش":
        return "bg-gradient-to-r from-blue-600 to-blue-700 text-white";
      default:
        return "bg-gradient-to-r from-blue-600 to-blue-700 text-white";
    }
  };

  // Image placeholder component
  const ProductImage = ({ src, alt, className }: { src: string; alt: string; className: string }) => {
    const [imageError, setImageError] = useState(false);
    
    const handleImageError = () => {
      setImageError(true);
    };

    if (imageError || !src || src.includes('undefined')) {
      return (
        <div className={`${className} bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center`}>
          <FiCoffee className="text-blue-400 text-2xl" />
        </div>
      );
    }

    return (
      <img
        src={src}
        alt={alt}
        className={className}
        onError={handleImageError}
      />
    );
  };

  // Handle Buy button click - redirects to product details page
  const handleBuyClick = (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(`/CoffeeCategoryPage/${productId}`, '_blank');
  };

  const FilterSection = ({ title, children, filterKey }: { title: string; children: React.ReactNode; filterKey: string }) => (
    <div className="border-b border-blue-200 last:border-b-0">
      <button
        onClick={() => setExpandedFilter(expandedFilter === filterKey ? null : filterKey)}
        className="w-full py-4 flex items-center justify-between text-right font-[var(--font-yekan)]"
      >
        <span className="font-semibold text-gray-700">{title}</span>
        <FiChevronDown className={`text-blue-600 ${expandedFilter === filterKey ? 'rotate-180' : ''}`} />
      </button>
      {expandedFilter === filterKey && (
        <div className="pb-4">
          {children}
        </div>
      )}
    </div>
  );

  // Show error if exists
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4 font-[var(--font-yekan)]">{error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl font-[var(--font-yekan)] hover:bg-blue-700"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  if (loading && initialProducts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-[var(--font-yekan)]">در حال بارگذاری تخفیف‌ها...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-34">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 mb-6 font-[var(--font-yekan)] mt-8 lg:mt-0">
          <span className="hover:text-blue-700 cursor-pointer">خانه</span>
          <span className="mx-2">/</span>
          <span>تخفیف های امروز</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar Filters */}
          <div className="lg:w-64 flex-shrink-0 hidden lg:block">
            <div className="bg-white rounded-2xl shadow-lg border border-blue-200 p-6 sticky top-32">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <FiFilter className="text-blue-600" />
                  <h3 className="font-bold text-gray-800 font-[var(--font-yekan)]">فیلترها</h3>
                </div>
                {hasActiveFilters && (
                  <button 
                    onClick={clearAllFilters}
                    className="text-red-500 hover:text-red-700 text-sm font-[var(--font-yekan)]"
                  >
                    حذف همه
                  </button>
                )}
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3 font-[var(--font-yekan)]">دسته‌بندی‌ها</h4>
                <div className="space-y-2">
                  {categories.map((category, index) => (
                    <label
                      key={category.id}
                      className="flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={activeFilters.selectedCategories.includes(category.name)}
                          onChange={() => handleCategoryFilter(category.id, category.name)}
                          className="rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-600 group-hover:text-blue-700 transition-colors font-[var(--font-yekan)]">
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

              {/* Modern Price Range Filter */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-4 font-[var(--font-yekan)]">محدوده قیمت</h4>
                
                {/* Custom Price Range Input */}
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
                        onChange={(e) => handleCustomMinPriceChange(e.target.value)}
                        placeholder="۰"
                        className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-[var(--font-yekan)] text-left"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1 font-[var(--font-yekan)]">حداکثر</label>
                      <input
                        type="text"
                        value={customMaxPrice}
                        onChange={(e) => handleCustomMaxPriceChange(e.target.value)}
                        placeholder="۱۰۰۰۰۰۰"
                        className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-[var(--font-yekan)] text-left"
                      />
                    </div>
                  </div>
                  
                  <button
                    onClick={handleCustomPriceApply}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition-all font-[var(--font-yekan)]"
                  >
                    اعمال محدوده
                  </button>
                </div>
              </div>

              {/* Brands */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3 font-[var(--font-yekan)]">برندها</h4>
                <div className="space-y-2">
                  {filters.brands.map((brand, index) => (
                    <label
                      key={brand}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      <input 
                        type="checkbox" 
                        checked={activeFilters.selectedBrands.includes(brand)}
                        onChange={() => handleBrandFilter(brand)}
                        className="rounded border-blue-300 text-blue-600 focus:ring-blue-500" 
                      />
                      <span className="text-sm text-gray-600 group-hover:text-blue-700 transition-colors font-[var(--font-yekan)]">
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
                  {filters.ratings.map((rating, index) => (
                    <label
                      key={rating}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
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

            {/* Consultation Banner - Hidden on mobile */}
            <div
              className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl shadow-lg border border-blue-200 p-6 mb-6 hidden lg:block"
            >
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
                
                <button
                  className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg font-[var(--font-yekan)] whitespace-nowrap"
                >
                  <FiMessageCircle size={18} />
                  <span>از من بپرس</span>
                </button>
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-600 font-[var(--font-yekan)]">
                نمایش {discountProducts.length} محصول تخفیف‌دار از {allProducts.length} محصول
              </p>
            </div>

            {/* Products Grid/List */}
            <div className={`${
                viewMode === 'grid'
                  ? 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'
                  : 'space-y-6'
              }`}
            >
              {discountProducts.map((product, index) => (
                <Link 
                  key={product._id} 
                  href={`/CoffeeCategoryPage/${product._id}`}
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="block"
                >
                  <div
                    className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-blue-100 overflow-hidden group cursor-pointer ${
                      viewMode === 'list' ? 'flex' : 'h-full flex flex-col'
                    }`}
                  >
                    {/* Product Image - INCREASED HEIGHT */}
                    <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'h-56 sm:h-64'}`}>
                      <ProductImage
                        src={product.image}
                        alt={product.name}
                        className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                          viewMode === 'list' ? 'rounded-r-2xl' : 'rounded-t-2xl'
                        }`}
                      />
                      
                      {/* Discount Badge */}
                      {product.discount > 0 && (
                        <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                          {product.discount}% تخفیف
                        </div>
                      )}
                      
                      {/* Status Badge */}
                      <div className="absolute top-3 right-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium font-[var(--font-yekan)] shadow-md ${getStatusBadgeStyle(product.badge)}`}>
                          {product.badge}
                        </span>
                      </div>

                      {/* Time Left Badge for Deal Products */}
                      {product.timeLeft && (
                        <div className="absolute bottom-3 left-3 bg-black/80 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <FiMessageCircle size={12} />
                          {product.timeLeft}
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className={`p-4 flex-1 ${viewMode === 'list' ? 'flex flex-col justify-between' : ''}`}>
                      <div>
                        <h3 className="font-bold text-gray-800 mb-2 text-sm leading-relaxed font-[var(--font-yekan)]">
                          {product.name}
                        </h3>
                        
                        {/* Rating */}
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
                            ({product.reviews || 0} نظر)
                          </span>
                        </div>

                        {/* Positive Feature */}
                        <div className="mb-3">
                          <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full font-medium font-[var(--font-yekan)] border border-blue-200">
                            {product.positiveFeature}
                          </span>
                        </div>
                      </div>

                      {/* Price and Actions */}
                      <div className="space-y-3 mt-4">
                        {/* Price Section */}
                        <div className="flex flex-col gap-1">
                          {/* Original Price */}
                          {product.originalPrice && product.originalPrice > product.priceAfterDiscount && (
                            <span className="text-sm text-gray-500 line-through font-[var(--font-yekan)]">
                              {formatProductPrice(product.originalPrice)}
                            </span>
                          )}
                          {/* Current Price */}
                          <span className={`font-bold text-blue-700 font-[var(--font-yekan)] ${
                            product.originalPrice && product.originalPrice > product.priceAfterDiscount ? 'text-lg' : 'text-xl'
                          }`}>
                            {formatProductPrice(product.priceAfterDiscount || product.price)}
                          </span>
                        </div>

                        {/* Buttons Section */}
                        <div className="flex flex-col gap-2">
                          {/* Buy Button - CHANGED: Now redirects to product details page */}
                          <button
                            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-3 rounded-xl font-semibold transition-all shadow-lg font-[var(--font-yekan)]"
                            onClick={(e) => handleBuyClick(product._id, e)}
                          >
                            خرید
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* No Products Message */}
            {discountProducts.length === 0 && !loading && (
              <div className="text-center py-12">
                <FiCoffee className="text-gray-300 text-4xl mx-auto mb-3" />
                <p className="text-gray-600 font-[var(--font-yekan)] text-lg">
                  هیچ محصول تخفیف‌داری با فیلترهای انتخاب شده یافت نشد.
                </p>
                <button 
                  onClick={clearAllFilters}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-[var(--font-yekan)]"
                >
                  حذف فیلترها
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <>
          <div
            onClick={() => setShowMobileFilters(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />
          
          <div
            className="fixed top-0 left-0 right-0 bottom-0 bg-white z-50 lg:hidden flex flex-col"
          >
            {/* Header - Improved spacing */}
            <div className="flex items-center justify-between p-5 border-b border-blue-200 bg-blue-50">
              <h2 className="text-xl font-bold text-blue-800 font-[var(--font-yekan)]">فیلترها و مرتب‌سازی</h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-3 text-gray-600 hover:text-blue-700 rounded-full hover:bg-blue-100"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Filters Content - Improved margins and spacing */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <div className="bg-white rounded-2xl border border-blue-200 p-5">
                {/* Categories */}
                <FilterSection title="دسته‌بندی‌ها" filterKey="categories">
                  <div className="space-y-3 mt-3">
                    {categories.map((category) => (
                      <label key={category.id} className="flex items-center justify-between cursor-pointer group px-1">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={activeFilters.selectedCategories.includes(category.name)}
                            onChange={() => handleCategoryFilter(category.id, category.name)}
                            className="w-5 h-5 rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-600 group-hover:text-blue-700 transition-colors font-[var(--font-yekan)]">
                            {category.name}
                          </span>
                        </div>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1.5 rounded-full">
                          {category.count}
                        </span>
                      </label>
                    ))}
                  </div>
                </FilterSection>

                {/* Price Range */}
                <FilterSection title="محدوده قیمت" filterKey="price">
                  <div className="space-y-4 mt-3">
                    {/* Custom Price Range for Mobile */}
                    <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                      <div className="flex gap-3 mb-4">
                        <div className="flex-1">
                          <label className="block text-xs text-gray-500 mb-2 font-[var(--font-yekan)]">حداقل قیمت</label>
                          <input
                            type="text"
                            value={customMinPrice}
                            onChange={(e) => handleCustomMinPriceChange(e.target.value)}
                            placeholder="۰"
                            className="w-full px-4 py-3 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-[var(--font-yekan)] text-left"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs text-gray-500 mb-2 font-[var(--font-yekan)]">حداکثر قیمت</label>
                          <input
                            type="text"
                            value={customMaxPrice}
                            onChange={(e) => handleCustomMaxPriceChange(e.target.value)}
                            placeholder="۱۰۰۰۰۰۰"
                            className="w-full px-4 py-3 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-[var(--font-yekan)] text-left"
                          />
                        </div>
                      </div>
                      <button
                        onClick={handleCustomPriceApply}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-sm font-medium transition-all font-[var(--font-yekan)]"
                      >
                        اعمال محدوده
                      </button>
                    </div>
                  </div>
                </FilterSection>

                {/* Brands */}
                <FilterSection title="برندها" filterKey="brands">
                  <div className="space-y-3 mt-3">
                    {filters.brands.map((brand) => (
                      <label key={brand} className="flex items-center gap-3 cursor-pointer group px-1">
                        <input 
                          type="checkbox" 
                          checked={activeFilters.selectedBrands.includes(brand)}
                          onChange={() => handleBrandFilter(brand)}
                          className="w-5 h-5 rounded border-blue-300 text-blue-600 focus:ring-blue-500" 
                        />
                        <span className="text-sm text-gray-600 group-hover:text-blue-700 transition-colors font-[var(--font-yekan)]">
                          {brand}
                        </span>
                      </label>
                    ))}
                  </div>
                </FilterSection>

                {/* Ratings */}
                <FilterSection title="امتیاز" filterKey="ratings">
                  <div className="space-y-3 mt-3">
                    {filters.ratings.map((rating) => (
                      <label key={rating} className="flex items-center gap-3 cursor-pointer group px-1">
                        <input 
                          type="checkbox" 
                          checked={activeFilters.selectedRatings.includes(rating)}
                          onChange={() => handleRatingFilter(rating)}
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
                </FilterSection>
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
        </>
      )}
    </div>
  );
}