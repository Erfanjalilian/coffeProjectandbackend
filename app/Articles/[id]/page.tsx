"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiClock, FiUser, FiCalendar, FiArrowRight, FiMessageCircle, FiShoppingCart, FiHeart, FiShare2, FiBookmark } from "react-icons/fi";
import { LuCrown } from "react-icons/lu";

interface Article {
  _id: string;
  title: string;
  excerpt: string;
  description: string;
  body: string;
  cover: string;
  href: string;
  badge: string;
  readTime: string;
  author: string;
  date: string;
  publish: number;
  category?: string;
  relatedProducts: string[];
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  priceAfterDiscount?: number;
  discount?: number;
  stock: number;
  image: string;
  brand?: string;
  badge?: string;
  rating?: number;
  reviews?: number;
  isPrime?: boolean;
  isPremium?: boolean;
}

interface ApiResponse {
  status: number;
  success: boolean;
  data: {
    articles: Article[];
    pagination: {
      page: number;
      limit: number;
      totalPage: number;
      totalArticles: number;
    };
  };
}

interface ProductApiResponse {
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

export default function ArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArticleData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch all articles to find the one with matching ID
        const articlesResponse = await fetch('https://coffee-shop-backend-k3un.onrender.com/api/v1/article');
        const articlesData: ApiResponse = await articlesResponse.json();

        if (!articlesData.success || !articlesData.data.articles) {
          throw new Error('Failed to fetch articles');
        }

        const foundArticle = articlesData.data.articles.find(
          (article) => article._id === params.id && article.publish === 1
        );

        if (!foundArticle) {
          throw new Error('Article not found');
        }

        setArticle(foundArticle);

        // Fetch related products if they exist
        if (foundArticle.relatedProducts && foundArticle.relatedProducts.length > 0) {
          const productsResponse = await fetch('https://coffee-shop-backend-k3un.onrender.com/api/v1/product');
          const productsData: ProductApiResponse = await productsResponse.json();

          if (productsData.success && productsData.data.products) {
            const related = productsData.data.products.filter(product =>
              foundArticle.relatedProducts.includes(product._id)
            );
            setRelatedProducts(related);
          }
        }
      } catch (err) {
        console.error('Error fetching article data:', err);
        setError('مقاله مورد نظر یافت نشد.');
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchArticleData();
    }
  }, [params.id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + " تومان";
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fa-IR');
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white pt-24" dir="rtl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-amber-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-amber-100 rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-amber-200 rounded-2xl mb-8"></div>
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-4 bg-amber-100 rounded w-full"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white pt-24 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-lg border-2 border-amber-200 p-8 max-w-md mx-auto">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2 font-[var(--font-yekan)]">
              {error || 'مقاله یافت نشد'}
            </h3>
            <p className="text-gray-600 mb-4 font-[var(--font-yekan)]">
              متاسفانه مقاله مورد نظر شما در دسترس نیست.
            </p>
            <Link
              href="/articles"
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-2 rounded-xl font-semibold hover:from-amber-600 hover:to-amber-700 transition-all font-[var(--font-yekan)] inline-block"
            >
              بازگشت به مقالات
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white pt-34" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-gray-600 mb-6 font-[var(--font-yekan)] flex items-center gap-2"
        >
          <Link href="/" className="hover:text-amber-700 transition-colors">
            خانه
          </Link>
          <span>/</span>
          <Link href="/articles" className="hover:text-amber-700 transition-colors">
            مقالات
          </Link>
          <span>/</span>
          <span className="text-amber-700 font-semibold">{article.title}</span>
        </motion.div>

        {/* Article Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-lg border-2 border-amber-100 p-6 mb-8"
        >
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm px-3 py-1 rounded-full font-bold font-[var(--font-yekan)]">
              {article.badge}
            </span>
            {article.category && (
              <span className="bg-amber-100 text-amber-700 text-sm px-3 py-1 rounded-full font-[var(--font-yekan)]">
                {article.category}
              </span>
            )}
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 leading-relaxed font-[var(--font-yekan)]">
            {article.title}
          </h1>

          <p className="text-gray-600 text-lg mb-6 leading-relaxed font-[var(--font-yekan)]">
            {article.excerpt}
          </p>

          {/* Article Meta */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 border-t border-amber-100 pt-4">
            <div className="flex items-center gap-2">
              <FiUser className="text-amber-600" />
              <span className="font-[var(--font-yekan)]">نویسنده: {article.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiCalendar className="text-amber-600" />
              <span className="font-[var(--font-yekan)]">{formatDate(article.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiClock className="text-amber-600" />
              <span className="font-[var(--font-yekan)]">زمان مطالعه: {article.readTime}</span>
            </div>
          </div>
        </motion.div>

        {/* Article Cover - Using Icon Instead of Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl p-12 mb-8 flex items-center justify-center border-2 border-amber-200"
        >
          <div className="text-center">
            <svg className="w-20 h-20 text-amber-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9m0 0v2m0-2a2 2 0 012-2h2a2 2 0 012 2m-6 5v2m0 4v2m0 4v2m8-12v2m0 4v2m0 4v2" />
            </svg>
            <p className="text-amber-700 font-[var(--font-yekan)] text-lg">تصویر مقاله: {article.title}</p>
          </div>
        </motion.div>

        {/* Article Body */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg border-2 border-amber-100 p-8 mb-8"
        >
          <div className="prose prose-lg max-w-none font-[var(--font-yekan)] text-gray-700 leading-8">
            {article.body.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-justify">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Article Actions */}
          <div className="flex flex-wrap items-center gap-4 mt-8 pt-6 border-t border-amber-100">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-xl font-[var(--font-yekan)] hover:bg-amber-200 transition-colors"
            >
              <FiBookmark />
              
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-xl font-[var(--font-yekan)] hover:bg-amber-200 transition-colors"
            >
              <FiShare2 />
             
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-xl font-[var(--font-yekan)] hover:bg-amber-200 transition-colors"
            >
              <FiHeart />
              
            </motion.button>
          </div>
        </motion.div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white rounded-2xl shadow-lg border-2 border-amber-100 p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 font-[var(--font-yekan)] flex items-center gap-2">
                <LuCrown className="text-amber-600" />
                محصولات مرتبط
              </h2>
              <span className="text-sm text-gray-500 font-[var(--font-yekan)]">
                {relatedProducts.length} محصول
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedProducts.map((product, index) => (
                <Link
                  key={product._id}
                  href={`/CoffeeCategoryPage/${product._id}`}
                  className="block"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                    className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-200 hover:border-amber-300 transition-all group cursor-pointer h-full"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-gray-800 mb-2 font-[var(--font-yekan)] group-hover:text-amber-700 transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-gray-600 text-sm font-[var(--font-yekan)] line-clamp-2">
                          {product.description}
                        </p>
                      </div>
                      <div className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-full font-[var(--font-yekan)]">
                        {product.brand || 'برند'}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        {product.originalPrice && product.priceAfterDiscount && (
                          <span className="text-xs text-gray-500 line-through font-[var(--font-yekan)]">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                        <span className="font-bold text-amber-700 text-lg font-[var(--font-yekan)]">
                          {formatPrice(product.priceAfterDiscount || product.price)}
                        </span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-2 rounded-xl font-semibold text-sm font-[var(--font-yekan)] hover:from-amber-600 hover:to-amber-700 transition-all"
                        onClick={(e) => {
                          e.preventDefault();
                          // Add to cart logic here
                        }}
                      >
                        خرید
                      </motion.button>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}