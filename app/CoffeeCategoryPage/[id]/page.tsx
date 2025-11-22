"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FiStar, FiShoppingCart, FiMessageCircle, FiArrowLeft, FiHeart, FiShare2, FiTruck, FiShield, FiCoffee } from "react-icons/fi";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCart } from "@/contaxt/CartContext";

// Complete interface matching your API structure
interface UserReview {
  _id: string;
  user: string;
  rating: number;
  comment: string;
  createdAt: string;
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

export default function ProductDetailPage() {
  const params = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'features' | 'reviews' | 'specifications'>('description');
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

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

        // Find current product by _id
        const current = allProducts.find(p => String(p._id) === String(params.id)) ?? null;
        setProduct(current);

        if (current) {
          // Find related products
          const related = allProducts
            .filter(p => String(p._id) !== String(current._id))
            .slice(0, 4);
          
          setRelatedProducts(related);
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

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + " تومان";
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the review to your API
    console.log('New review:', newReview);
    setNewReview({ rating: 5, comment: '' });
    // You can add a success message here
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
              i < Math.floor(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
            }`}
          />
        ))}
        <span className={`${size === 'lg' ? 'text-sm' : 'text-xs'} text-gray-600 mr-1`}>
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white pt-24 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 font-[var(--font-yekan)]">در حال بارگذاری محصول...</p>
      </div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white pt-24 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 font-[var(--font-yekan)]">محصول یافت نشد</h2>
        <Link href="/CoffeeCategoryPage" className="text-amber-600 hover:text-amber-700 font-[var(--font-yekan)]">
          بازگشت به دسته‌بندی
        </Link>
      </div>
    </div>
  );

  const displayPrice = product.priceAfterDiscount || product.price;
  const displayOriginalPrice = product.originalPrice && product.originalPrice > displayPrice ? product.originalPrice : undefined;
  const discountPercentage = displayOriginalPrice ? Math.round(((displayOriginalPrice - displayPrice) / displayOriginalPrice) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-gray-600 mb-6 font-[var(--font-yekan)]"
        >
          <Link href="/" className="hover:text-amber-700 transition-colors">خانه</Link>
          <span className="mx-2">/</span>
          <Link href="/CoffeeCategoryPage" className="hover:text-amber-700 transition-colors">دسته‌بندی‌ها</Link>
          <span className="mx-2">/</span>
          <span className="text-amber-700 font-semibold">{product.name}</span>
        </motion.div>

        {/* Back Button - Mobile */}
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => window.history.back()}
          className="lg:hidden flex items-center gap-2 text-amber-700 hover:text-amber-800 mb-6 font-[var(--font-yekan)] transition-colors"
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
            <div className="bg-white rounded-2xl shadow-lg border border-amber-200 p-6 sticky top-32">
              {/* Main Image */}
              <div className="relative h-80 w-full rounded-xl overflow-hidden mb-4 bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                <FiCoffee className="text-amber-400 text-6xl" />
                <div className="absolute top-3 left-3">
                  {product.badge && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                      {product.badge}
                    </span>
                  )}
                </div>
                {discountPercentage > 0 && (
                  <div className="absolute top-3 right-3 bg-amber-500 text-white text-sm px-2 py-1 rounded-full font-bold">
                    {discountPercentage}% تخفیف
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-20 rounded-lg overflow-hidden bg-gradient-to-br from-amber-50 to-amber-100 border-2 flex items-center justify-center ${
                      selectedImage === index ? 'border-amber-500' : 'border-amber-200'
                    }`}
                  >
                    <FiCoffee className="text-amber-300 text-xl" />
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
                      برند: <span className="font-semibold text-amber-700">{product.brand}</span>
                    </span>
                  )}
                  <span className="text-sm text-gray-600 font-[var(--font-yekan)]">
                    دسته: <span className="font-semibold text-green-600">{product.category?.name || 'قهوه'}</span>
                  </span>
                </div>

                {/* Rating and Reviews */}
                <div className="flex items-center gap-4 mb-4">
                  {renderStars(product.rating, 'lg')}
                  <span className="text-gray-600 font-[var(--font-yekan)]">
                    ({product.reviews} نظر)
                  </span>
                  <span className="text-green-600 text-sm font-[var(--font-yekan)] bg-green-50 px-2 py-1 rounded-full">
                    {product.positiveFeature}
                  </span>
                </div>
              </div>

              {/* Price Section */}
              <div className="bg-white rounded-2xl border border-amber-200 p-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-3xl font-bold text-amber-700 font-[var(--font-yekan)]">
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
                  {product.dealType === 'lightning' && product.timeLeft && (
                    <span className="text-red-500 font-semibold">
                      زمان باقی‌مانده: {product.timeLeft}
                    </span>
                  )}
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-gray-700 font-[var(--font-yekan)]">تعداد:</span>
                  <div className="flex items-center gap-3 bg-white rounded-xl border border-amber-200 p-2">
                    <button
                      onClick={decrementQuantity}
                      className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center hover:bg-amber-200 transition-colors"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold text-gray-800">{quantity}</span>
                    <button
                      onClick={incrementQuantity}
                      className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center hover:bg-amber-200 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Action Buttons - Fixed Desktop Layout */}
                <div className="space-y-3 mb-6">
                  {/* Main Action Buttons - Side by side on desktop */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    {/* Add to Cart Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        if (product) {
                          addToCart({
                            id: product._id,
                            name: product.name,
                            price: displayPrice,
                           
                          }, quantity);
                        }
                      }}
                      className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white py-3 rounded-xl font-semibold shadow-lg font-[var(--font-yekan)] transition-all flex items-center justify-center gap-2"
                    >
                      <FiShoppingCart size={18} />
                      <span>اضافه به سبد خرید</span>
                    </motion.button>

                    {/* AI Assistant Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 rounded-xl font-semibold transition-all shadow-lg font-[var(--font-yekan)] flex items-center justify-center gap-2"
                    >
                      <FiMessageCircle size={18} />
                      <span>از من بپرس</span>
                    </motion.button>
                  </div>

                  {/* Heart and Share Buttons - Neatly below */}
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 bg-white border border-amber-300 text-amber-700 py-3 rounded-xl font-semibold font-[var(--font-yekan)] transition-all flex items-center justify-center gap-2"
                    >
                      <FiHeart size={18} />
                      <span className="sm:block hidden">لیست علاقه‌مندی</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 bg-white border border-amber-300 text-amber-700 py-3 rounded-xl font-semibold font-[var(--font-yekan)] transition-all flex items-center justify-center gap-2"
                    >
                      <FiShare2 size={18} />
                      <span className="sm:block hidden">اشتراک‌گذاری</span>
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
          className="bg-white rounded-2xl shadow-lg border border-amber-200 overflow-hidden mb-12"
        >
          {/* Tab Headers */}
          <div className="flex overflow-x-auto border-b border-amber-200">
            {[
              { id: 'description', label: 'توضیحات محصول' },
              { id: 'features', label: 'ویژگی‌ها' },
              { id: 'specifications', label: 'مشخصات فنی' },
              { id: 'reviews', label: `نظرات (${product.userReviews.length})` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-shrink-0 px-6 py-4 font-[var(--font-yekan)] border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-amber-500 text-amber-700 font-bold bg-amber-50'
                    : 'border-transparent text-gray-600 hover:text-amber-700'
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
                    <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            )}

            {activeTab === 'specifications' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.weight && (
                  <div className="flex justify-between py-2 border-b border-amber-100">
                    <span className="text-gray-600 font-[var(--font-yekan)]">وزن:</span>
                    <span className="text-gray-800 font-[var(--font-yekan)]">{product.weight} گرم</span>
                  </div>
                )}
                {product.ingredients && (
                  <div className="flex justify-between py-2 border-b border-amber-100">
                    <span className="text-gray-600 font-[var(--font-yekan)]">مواد تشکیل‌دهنده:</span>
                    <span className="text-gray-800 font-[var(--font-yekan)]">{product.ingredients}</span>
                  </div>
                )}
                {product.brand && (
                  <div className="flex justify-between py-2 border-b border-amber-100">
                    <span className="text-gray-600 font-[var(--font-yekan)]">برند:</span>
                    <span className="text-gray-800 font-[var(--font-yekan)]">{product.brand}</span>
                  </div>
                )}
                {product.type && (
                  <div className="flex justify-between py-2 border-b border-amber-100">
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
                    <div className="text-4xl font-bold text-amber-600 mb-2">{product.rating.toFixed(1)}</div>
                    {renderStars(product.rating, 'lg')}
                    <div className="text-gray-600 font-[var(--font-yekan)] mt-1">
                      {product.reviews} نظر
                    </div>
                  </div>
                  
                  {/* Rating Distribution */}
                  <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map((stars) => {
                      const count = product.userReviews.filter(r => Math.floor(r.rating) === stars).length;
                      const percentage = product.userReviews.length > 0 ? (count / product.userReviews.length) * 100 : 0;
                      return (
                        <div key={stars} className="flex items-center gap-2">
                          <span className="text-sm text-gray-600 w-8 font-[var(--font-yekan)]">{stars} ستاره</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-amber-400 h-2 rounded-full"
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

                {/* Add Review Form */}
                <form onSubmit={handleAddReview} className="bg-amber-50 rounded-xl p-6 border border-amber-200">
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
                                  ? 'text-amber-400 fill-amber-400'
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
                        className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-[var(--font-yekan)]"
                        placeholder="نظر خود را در مورد این محصول بنویسید..."
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-[var(--font-yekan)] transition-colors"
                    >
                      ثبت نظر
                    </button>
                  </div>
                </form>

                {/* User Reviews */}
                <div className="space-y-6">
                  {product.userReviews.map((review) => (
                    <div key={review._id} className="border-b border-amber-100 pb-6 last:border-b-0">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                          <span className="text-amber-600 font-bold font-[var(--font-yekan)]">
                            {review.user.substring(0, 2)}
                          </span>
                        </div>
                        <div>
                          {renderStars(review.rating, 'md')}
                          <div className="text-gray-500 text-sm font-[var(--font-yekan)]">
                            {new Date(review.createdAt).toLocaleDateString('fa-IR')}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 font-[var(--font-yekan)] leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                  
                  {product.userReviews.length === 0 && (
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
                  <div className="bg-white rounded-2xl shadow-lg border border-amber-200 p-4 hover:shadow-xl transition-all duration-300 cursor-pointer">
                    <div className="relative h-48 w-full rounded-xl overflow-hidden mb-3 bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                      <FiCoffee className="text-amber-400 text-3xl" />
                      {p.badge && (
                        <div className="absolute top-2 left-2">
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
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
                      <span className="text-amber-700 font-bold font-[var(--font-yekan)] text-lg">
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