"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FiStar, FiShoppingCart, FiArrowLeft, FiHeart, FiTruck, FiShield, FiCoffee } from "react-icons/fi";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCart } from "@/contaxt/CartContext";
import { useAuth } from "@/contaxt/AuthContext";

interface UserReview {
  _id: string;
  user: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface CommentUser {
  _id: string;
  phone: string;
  username: string;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

interface Comment {
  _id: string;
  content: string;
  product: {
    _id: string;
    name: string;
  };
  rating: number;
  user: CommentUser;
  replies: any[];
  createdAt: string;
  updatedAt: string;
}

interface CommentsApiResponse {
  status: number;
  success: boolean;
  data: {
    comments: Comment[];
    pagination: {
      page: number;
      limit: number;
      totalPage: number;
      totalComments: number;
    };
  };
}

interface Product {
  _id: string;
  name: string;
  slug: string;
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
  userReviews: UserReview[];
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

// Favorites types and utilities
interface FavoriteProduct {
  _id: string;
  name: string;
  price: number;
  priceAfterDiscount: number;
  originalPrice?: number;
  image: string;
  brand?: string;
  rating: number;
  positiveFeature: string;
  addedAt: string;
}

const FAVORITES_STORAGE_KEY = "user_favorites";

// Favorites utility functions
const getFavoritesFromStorage = (): FavoriteProduct[] => {
  if (typeof window === "undefined") return [];
  try {
    const favorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error("Error reading favorites from localStorage:", error);
    return [];
  }
};

// 🔥 UPDATED: Dispatch event when favorites are saved
const saveFavoritesToStorage = (favorites: FavoriteProduct[]): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    // 🔥 ADDED: Dispatch event to notify header and other components
    window.dispatchEvent(new Event('favoritesUpdated'));
  } catch (error) {
    console.error("Error saving favorites to localStorage:", error);
  }
};

// 🔥 UPDATED: Dispatch event when adding to favorites
const addToFavorites = (product: Product): FavoriteProduct[] => {
  const favorites = getFavoritesFromStorage();
  
  // Check if product is already in favorites
  const existingIndex = favorites.findIndex(fav => fav._id === product._id);
  
  if (existingIndex === -1) {
    const favoriteProduct: FavoriteProduct = {
      _id: product._id,
      name: product.name,
      price: product.price,
      priceAfterDiscount: product.priceAfterDiscount,
      originalPrice: product.originalPrice,
      image: product.image,
      brand: product.brand,
      rating: product.rating,
      positiveFeature: product.positiveFeature,
      addedAt: new Date().toISOString()
    };
    
    const updatedFavorites = [favoriteProduct, ...favorites];
    saveFavoritesToStorage(updatedFavorites);
    return updatedFavorites;
  }
  
  return favorites;
};

// 🔥 UPDATED: Dispatch event when removing from favorites
const removeFromFavorites = (productId: string): FavoriteProduct[] => {
  const favorites = getFavoritesFromStorage();
  const updatedFavorites = favorites.filter(fav => fav._id !== productId);
  saveFavoritesToStorage(updatedFavorites);
  return updatedFavorites;
};

const isProductInFavorites = (productId: string): boolean => {
  const favorites = getFavoritesFromStorage();
  return favorites.some(fav => fav._id === productId);
};

export default function ProductDetailPage() {
  const params = useParams();
  const { addToCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'features' | 'reviews' | 'specifications'>('description');
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');
  
  // Favorites state
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFavoriteMessage, setShowFavoriteMessage] = useState(false);
  const [favoriteMessage, setFavoriteMessage] = useState('');

  // Cart notification state
  const [showCartMessage, setShowCartMessage] = useState(false);
  const [cartMessage, setCartMessage] = useState('');

  // Fetch product data
  useEffect(() => {
    const controller = new AbortController();

    async function loadProductsOnce() {
      try {
        setLoading(true);
        
        const res = await fetch('https://coffee-shop-backend-k3un.onrender.com/api/v1/product', {
          signal: controller.signal
        });
        
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        
        const result: ApiResponse = await res.json();
        
        if (!result.success || !result.data.products) {
          throw new Error('Failed to fetch products from backend');
        }

        const allProducts = result.data.products;

        if (!params?.id) {
          setProduct(null);
          setRelatedProducts([]);
          return;
        }

        const current = allProducts.find(p => String(p._id) === String(params.id)) ?? null;
        setProduct(current);

        if (current) {
          const related = allProducts
            .filter(p => String(p._id) !== String(current._id))
            .slice(0, 4);
          setRelatedProducts(related);
          
          // Check if current product is in favorites
          setIsFavorite(isProductInFavorites(current._id));
        } else {
          setRelatedProducts([]);
        }

      } catch (error: any) {
        if (error.name === 'AbortError') return;
        console.error('Error loading products:', error);
        setProduct(null);
        setRelatedProducts([]);
      } finally {
        setLoading(false);
      }
    }

    loadProductsOnce();
    return () => controller.abort();
  }, [params?.id]);

  // Fetch comments for this specific product
  const fetchComments = async (productId: string) => {
    if (!productId) return;
    
    try {
      setCommentsLoading(true);
      console.log(`Fetching comments for product: ${productId}`);
      
      const res = await fetch(`https://coffee-shop-backend-k3un.onrender.com/api/v1/comment?product=${productId}`);
      
      if (!res.ok) throw new Error(`Failed to fetch comments: ${res.status}`);
      
      const result: CommentsApiResponse = await res.json();
      
      if (result.success && result.data.comments) {
        // Double-check that comments belong to this specific product
        const filteredComments = result.data.comments.filter(comment => 
          comment.product && String(comment.product._id) === String(productId)
        );
        
        console.log(`API returned ${result.data.comments.length} comments, filtered to ${filteredComments.length} for product ${productId}`);
        
        setComments(filteredComments);
      } else {
        setComments([]);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      setComments([]);
    } finally {
      setCommentsLoading(false);
    }
  };

  // Fetch comments when product is loaded and reviews tab is active
  useEffect(() => {
    if (product && activeTab === 'reviews') {
      fetchComments(product._id);
    }
  }, [product, activeTab]);

  // Handle favorites toggle
  const handleToggleFavorite = () => {
    if (!product) return;
    
    if (!isAuthenticated) {
      setShowLoginAlert(true);
      return;
    }

    if (isFavorite) {
      removeFromFavorites(product._id);
      setIsFavorite(false);
      setFavoriteMessage('محصول از علاقه‌مندی‌ها حذف شد');
    } else {
      addToFavorites(product);
      setIsFavorite(true);
      setFavoriteMessage('محصول به علاقه‌مندی‌ها اضافه شد');
    }
    
    setShowFavoriteMessage(true);
    setTimeout(() => setShowFavoriteMessage(false), 3000);
  };

  // Handle add to cart with notification
  const handleAddToCart = () => {
    if (!product) return;

    addToCart({
      id: product._id,
      name: product.name,
      price: displayPrice,
    }, quantity);
    
    setCartMessage(`${quantity} عدد "${product.name}" به سبد خرید اضافه شد`);
    setShowCartMessage(true);
    setTimeout(() => setShowCartMessage(false), 3000);
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + " تومان";
  };

  // CORRECTED COMMENT SUBMISSION FUNCTION
  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    
    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      setShowLoginAlert(true);
      return;
    }

    if (!product || !params?.id) return;

    try {
      setSubmittingReview(true);
      
      // Get authentication token properly
      const token = localStorage.getItem('token');
      console.log('User token:', token);
      console.log('Current user ID:', user._id);
      console.log('Product ID:', params.id);

      // CORRECTED: Use productId instead of product (based on API error message)
      const commentData = {
        content: newReview.comment,
        rating: newReview.rating,
        productId: params.id, // ✅ Correct field name from API error
        userId: user._id      // ✅ Also use userId for consistency
      };

      console.log('Submitting comment with CORRECTED data:', commentData);

      const res = await fetch('https://coffee-shop-backend-k3un.onrender.com/api/v1/comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(commentData)
      });

      console.log('Response status:', res.status);

      const responseText = await res.text();
      console.log('Response text:', responseText);

      if (!res.ok) {
        let errorMessage = `خطا در ارسال نظر (کد: ${res.status})`;
        
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorMessage;
          // Show specific validation errors if available
          if (errorData.data && errorData.data.length > 0) {
            const validationErrors = errorData.data.map((err: any) => err.message).join(', ');
            errorMessage += ` - ${validationErrors}`;
          }
        } catch {
          errorMessage = responseText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      // Parse the successful response
      const result = JSON.parse(responseText);
      console.log('Comment submission success:', result);
      
      if (result.success) {
        // Refresh comments for this specific product
        await fetchComments(params.id as string);
        // Reset form
        setNewReview({ rating: 5, comment: '' });
        // Show success message
        alert('نظر شما با موفقیت ثبت شد!');
      } else {
        throw new Error(result.message || 'خطای ناشناخته از سرور');
      }
    } catch (error: any) {
      console.error('Full error details:', error);
      setSubmitError(error.message || 'خطا در ثبت نظر. لطفاً دوباره تلاش کنید.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizes = {
      sm: 'w-3 h-3',
      md: 'w-4 h-4',
      lg: 'w-5 h-5'
    };
    
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <FiStar
            key={i}
            className={`${sizes[size]} ${
              i < Math.floor(rating) ? 'text-blue-400 fill-blue-400' : 'text-gray-300'
            }`}
          />
        ))}
        <span className={`${size === 'lg' ? 'text-sm' : 'text-xs'} text-gray-600 mr-1`}>
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  // Calculate average rating from comments for THIS product
  const calculateAverageRating = () => {
    if (comments.length === 0) return 0;
    const total = comments.reduce((sum, comment) => sum + comment.rating, 0);
    return total / comments.length;
  };

  // Calculate rating distribution for THIS product
  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    comments.forEach(comment => {
      const stars = Math.floor(comment.rating);
      if (stars >= 1 && stars <= 5) {
        distribution[stars as keyof typeof distribution]++;
      }
    });
    return distribution;
  };

  // Show loading state
  if (loading) return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 font-[var(--font-yekan)]">در حال بارگذاری محصول...</p>
      </div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 font-[var(--font-yekan)]">محصول یافت نشد</h2>
        <Link href="/CoffeeCategoryPage" className="text-blue-600 hover:text-blue-700 font-[var(--font-yekan)]">
          بازگشت به دسته‌بندی
        </Link>
      </div>
    </div>
  );

  const displayPrice = product.priceAfterDiscount || product.price;
  const displayOriginalPrice = product.originalPrice && product.originalPrice > displayPrice ? product.originalPrice : undefined;
  const discountPercentage = displayOriginalPrice ? Math.round(((displayOriginalPrice - displayPrice) / displayOriginalPrice) * 100) : 0;

  const averageRating = calculateAverageRating();
  const ratingDistribution = getRatingDistribution();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24">
      {/* Success Messages */}
      <AnimatePresence>
        {showFavoriteMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-blue-500 text-white px-6 py-3 rounded-xl shadow-lg font-[var(--font-yekan)] flex items-center gap-2">
              <FiHeart className="text-white" />
              <span>{favoriteMessage}</span>
            </div>
          </motion.div>
        )}
        
        {showCartMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-orange-500 text-white px-6 py-3 rounded-xl shadow-lg font-[var(--font-yekan)] flex items-center gap-2">
              <FiShoppingCart className="text-white" />
              <span>{cartMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-gray-600 mb-6 font-[var(--font-yekan)]"
        >
          <Link href="/" className="hover:text-blue-700 transition-colors">خانه</Link>
          <span className="mx-2">/</span>
          <Link href="/CoffeeCategoryPage" className="hover:text-blue-700 transition-colors">دسته‌بندی‌ها</Link>
          <span className="mx-2">/</span>
          <span className="text-blue-700 font-semibold">{product.name}</span>
        </motion.div>

        {/* Back Button - Mobile */}
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => window.history.back()}
          className="lg:hidden flex items-center gap-2 text-blue-700 hover:text-blue-800 mb-6 font-[var(--font-yekan)] transition-colors"
        >
          <FiArrowLeft />
          <span>بازگشت</span>
        </motion.button>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Image Gallery - Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-5"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-blue-200 p-6 sticky top-32">
              {/* Main Image - Replaced with Icon */}
              <div className="relative h-80 w-full rounded-xl overflow-hidden mb-4 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <div className="text-center">
                  <FiCoffee className="text-blue-500 text-8xl mb-4" />
                  <div className="text-blue-700 font-[var(--font-yekan)] text-lg">تصویر محصول</div>
                </div>
                <div className="absolute top-3 left-3">
                  {product.badge && (
                    <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                      {product.badge}
                    </span>
                  )}
                </div>
                {discountPercentage > 0 && (
                  <div className="absolute top-3 right-3 bg-orange-500 text-white text-sm px-2 py-1 rounded-full font-bold">
                    {discountPercentage}% تخفیف
                  </div>
                )}
              </div>

              {/* Thumbnail Images - All Icons */}
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-20 rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 border-2 flex items-center justify-center ${
                      selectedImage === index ? 'border-blue-500' : 'border-blue-200'
                    }`}
                  >
                    <FiCoffee className={`text-xl ${selectedImage === index ? 'text-blue-600' : 'text-blue-400'}`} />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Product Info - Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-7"
          >
            <div className="space-y-6">
              {/* Product Header */}
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-3 font-[var(--font-yekan)] leading-relaxed">
                  {product.name}
                </h1>
                
                {/* Brand and Category */}
                <div className="flex flex-wrap items-center gap-4 mb-3">
                  {product.brand && (
                    <span className="text-sm text-gray-600 font-[var(--font-yekan)]">
                      برند: <span className="font-semibold text-blue-700">{product.brand}</span>
                    </span>
                  )}
                  <span className="text-sm text-gray-600 font-[var(--font-yekan)]">
                    دسته: <span className="font-semibold text-blue-600">{product.category?.name || 'قهوه'}</span>
                  </span>
                </div>

                {/* Rating and Reviews */}
                <div className="flex items-center gap-4 mb-4">
                  {renderStars(averageRating, 'lg')}
                  <span className="text-gray-600 font-[var(--font-yekan)]">
                    ({comments.length} نظر)
                  </span>
                  <span className="text-blue-600 text-sm font-[var(--font-yekan)] bg-blue-50 px-2 py-1 rounded-full">
                    {product.positiveFeature}
                  </span>
                </div>
              </div>

              {/* Price Section */}
              <div className="bg-white rounded-2xl border border-blue-200 p-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-3xl font-bold text-blue-700 font-[var(--font-yekan)]">
                    {formatPrice(displayPrice)}
                  </span>
                  {displayOriginalPrice && (
                    <div className="flex flex-col">
                      <span className="text-xl text-gray-500 line-through font-[var(--font-yekan)]">
                        {formatPrice(displayOriginalPrice)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Stock and Sales Info */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6 font-[var(--font-yekan)]">
                  <span>موجودی: {product.stock} عدد</span>
                  <span>فروخته شده: {product.soldCount} عدد</span>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-gray-700 font-[var(--font-yekan)]">تعداد:</span>
                  <div className="flex items-center gap-3 bg-white rounded-xl border border-blue-200 p-2">
                    <button
                      onClick={decrementQuantity}
                      className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center hover:bg-blue-200 transition-colors"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold text-gray-800">{quantity}</span>
                    <button
                      onClick={incrementQuantity}
                      className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center hover:bg-blue-200 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Action Buttons - UPDATED: Removed "Ask Me" and "Share" buttons */}
                <div className="space-y-3 mb-6">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAddToCart}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-xl font-semibold shadow-lg font-[var(--font-yekan)] transition-all flex items-center justify-center gap-2"
                    >
                      <FiShoppingCart size={18} />
                      <span>اضافه به سبد خرید</span>
                    </motion.button>
                  </div>

                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleToggleFavorite}
                      className={`flex-1 border py-3 rounded-xl font-semibold font-[var(--font-yekan)] transition-all flex items-center justify-center gap-2 ${
                        isFavorite
                          ? 'bg-red-50 border-red-300 text-red-600 hover:bg-red-100'
                          : 'bg-white border-blue-300 text-blue-700 hover:bg-blue-50'
                      }`}
                    >
                      <FiHeart 
                        size={18} 
                        className={isFavorite ? 'fill-red-600 text-red-600' : ''} 
                      />
                      <span className="sm:block hidden">
                        {isFavorite ? 'حذف از علاقه‌مندی' : 'لیست علاقه‌مندی'}
                      </span>
                    </motion.button>
                  </div>
                </div>

                {/* Delivery and Warranty Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-green-600">
                    <FiTruck className="flex-shrink-0" />
                    <span className="font-[var(--font-yekan)]">ارسال رایگان برای سفارش‌های بالای ۲۰۰ هزار تومان</span>
                  </div>
                  {product.hasWarranty && (
                    <div className="flex items-center gap-2 text-blue-600">
                      <FiShield className="flex-shrink-0" />
                      <span className="font-[var(--font-yekan)]">
                        گارانتی {product.warrantyDuration} ماهه
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Product Details Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border border-blue-200 overflow-hidden mb-12"
        >
          {/* Tab Headers */}
          <div className="flex overflow-x-auto border-b border-blue-200">
            {[
              { id: 'description', label: 'توضیحات محصول' },
              { id: 'features', label: 'ویژگی‌ها' },
              { id: 'specifications', label: 'مشخصات فنی' },
              { id: 'reviews', label: `نظرات (${comments.length})` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-shrink-0 px-6 py-4 font-[var(--font-yekan)] border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-700 font-bold bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-blue-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'description' && (
              <div className="space-y-4">
                <p className="text-gray-700 font-[var(--font-yekan)] leading-relaxed text-lg">
                  {product.description}
                </p>
                {product.benefits && (
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2 font-[var(--font-yekan)]">فواید:</h4>
                    <p className="text-gray-700 font-[var(--font-yekan)]">{product.benefits}</p>
                  </div>
                )}
                {product.howToUse && (
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2 font-[var(--font-yekan)]">روش استفاده:</h4>
                    <p className="text-gray-700 font-[var(--font-yekan)]">{product.howToUse}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'features' && product.features && (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-700 font-[var(--font-yekan)]">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            )}

            {activeTab === 'specifications' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.weight && (
                  <div className="flex justify-between py-2 border-b border-blue-100">
                    <span className="text-gray-600 font-[var(--font-yekan)]">وزن:</span>
                    <span className="text-gray-800 font-[var(--font-yekan)]">{product.weight} گرم</span>
                  </div>
                )}
                {product.ingredients && (
                  <div className="flex justify-between py-2 border-b border-blue-100">
                    <span className="text-gray-600 font-[var(--font-yekan)]">مواد تشکیل‌دهنده:</span>
                    <span className="text-gray-800 font-[var(--font-yekan)]">{product.ingredients}</span>
                  </div>
                )}
                {product.brand && (
                  <div className="flex justify-between py-2 border-b border-blue-100">
                    <span className="text-gray-600 font-[var(--font-yekan)]">برند:</span>
                    <span className="text-gray-800 font-[var(--font-yekan)]">{product.brand}</span>
                  </div>
                )}
                {product.type && (
                  <div className="flex justify-between py-2 border-b border-blue-100">
                    <span className="text-gray-600 font-[var(--font-yekan)]">نوع:</span>
                    <span className="text-gray-800 font-[var(--font-yekan)]">{product.type}</span>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {/* Review Summary */}
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">{averageRating.toFixed(1)}</div>
                    {renderStars(averageRating, 'lg')}
                    <div className="text-gray-600 font-[var(--font-yekan)] mt-1">
                      {comments.length} نظر
                    </div>
                  </div>
                  
                  {/* Rating Distribution */}
                  <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map((stars) => {
                      const count = ratingDistribution[stars as keyof typeof ratingDistribution];
                      const percentage = comments.length > 0 ? (count / comments.length) * 100 : 0;
                      return (
                        <div key={stars} className="flex items-center gap-2">
                          <span className="text-sm text-gray-600 w-8 font-[var(--font-yekan)]">{stars} ستاره</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-400 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-12 font-[var(--font-yekan)]">
                            {count} نظر
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Login Alert */}
                {showLoginAlert && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-red-700 font-[var(--font-yekan)]">
                        برای ثبت نظر باید وارد حساب کاربری خود شوید.
                      </p>
                      <button
                        onClick={() => setShowLoginAlert(false)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                    <Link href="/login" className="text-red-600 hover:text-red-800 font-[var(--font-yekan)] text-sm mt-2 block">
                        ورود به حساب کاربری
                    </Link>
                  </div>
                )}

                {/* Error Message */}
                {submitError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-red-700 font-[var(--font-yekan)]">{submitError}</p>
                      <button
                        onClick={() => setSubmitError('')}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                )}

                {/* Add Review Form */}
                <form onSubmit={handleAddReview} className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <h4 className="font-bold text-gray-800 mb-4 font-[var(--font-yekan)]">افزودن نظر</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 mb-2 font-[var(--font-yekan)]">امتیاز شما:</label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                            className="text-2xl"
                          >
                            <FiStar
                              className={`${
                                star <= newReview.rating
                                  ? 'text-blue-400 fill-blue-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2 font-[var(--font-yekan)]">نظر شما:</label>
                      <textarea
                        value={newReview.comment}
                        onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                        rows={4}
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-[var(--font-yekan)]"
                        placeholder="نظر خود را در مورد این محصول بنویسید..."
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-6 py-2 rounded-lg font-[var(--font-yekan)] transition-colors disabled:cursor-not-allowed"
                    >
                      {submittingReview ? 'در حال ثبت...' : 'ثبت نظر'}
                    </button>
                  </div>
                </form>

                {/* User Reviews */}
                <div className="space-y-6">
                  {commentsLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-4 text-gray-600 font-[var(--font-yekan)]">در حال بارگذاری نظرات...</p>
                    </div>
                  ) : comments.length > 0 ? (
                    comments.map((comment) => (
                      <div key={comment._id} className="border-b border-blue-100 pb-6 last:border-b-0">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-bold font-[var(--font-yekan)]">
                              {comment.user.username?.substring(0, 2) || 'کاربر'}
                            </span>
                          </div>
                          <div>
                            {renderStars(comment.rating, 'md')}
                            <div className="text-gray-500 text-sm font-[var(--font-yekan)]">
                              {new Date(comment.createdAt).toLocaleDateString('fa-IR')}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 font-[var(--font-yekan)] leading-relaxed">
                          {comment.content}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500 font-[var(--font-yekan)]">
                      هنوز نظری برای این محصول ثبت نشده است.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12"
          >
            <h2 className="text-2xl font-bold mb-6 font-[var(--font-yekan)]">محصولات مشابه</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <Link key={p._id} href={`/CoffeeCategoryPage/${p._id}`} className="block">
                  <div className="bg-white rounded-2xl shadow-lg border border-blue-200 p-4 hover:shadow-xl transition-all duration-300 cursor-pointer">
                    <div className="relative h-48 w-full rounded-xl overflow-hidden mb-3 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                      <div className="text-center">
                        <FiCoffee className="text-blue-500 text-5xl mb-3" />
                        <div className="text-blue-700 font-[var(--font-yekan)] text-sm">تصویر محصول</div>
                      </div>
                      {p.badge && (
                        <div className="absolute top-2 left-2">
                          <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                            {p.badge}
                          </span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-[var(--font-yekan)] font-semibold text-gray-800 mb-2 line-clamp-2">
                      {p.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      {renderStars(p.rating, 'sm')}
                      <span className="text-xs text-gray-500 font-[var(--font-yekan)]">
                        ({p.reviews})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-700 font-bold font-[var(--font-yekan)] text-lg">
                        {formatPrice(p.priceAfterDiscount || p.price)}
                      </span>
                      {p.originalPrice && p.originalPrice > (p.priceAfterDiscount || p.price) && (
                        <span className="text-gray-500 line-through text-sm font-[var(--font-yekan)]">
                          {formatPrice(p.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}