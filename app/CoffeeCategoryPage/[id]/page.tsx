"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FiStar, FiShoppingCart, FiMessageCircle, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCart } from "@/contaxt/CartContext"; // اضافه شده

interface Product {
  id: number;
  name: string;
  price: string;
  originalPrice?: string;
  image: string;
  category: string;
  badge: string;
  rating: number;
  reviews: number;
  isPrime: boolean;
  discount: number;
  type: string;
  dealType?: string;
  timeLeft?: string;
  soldCount?: number;
  totalCount?: number;
  isPremium?: boolean;
  features?: string[];
  description?: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const { addToCart } = useCart(); // استفاده از کانتکست
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'features'>('description');
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProductsOnce() {
      try {
        setLoading(true);
        const res = await fetch('https://6810ff2827f2fdac24139dec.mockapi.io/Product', {
          signal: controller.signal
        });
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        const allProducts: Product[] = await res.json();

        if (!params?.id) {
          setProduct(null);
          setRelatedProducts([]);
          return;
        }

        const current = allProducts.find(p => String(p.id) === String(params.id)) ?? null;
        setProduct(current);

        if (current) {
          const related = allProducts
            .filter(p => String(p.id) !== String(current.id) && p.category === current.category)
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
        <Link href="/CoffeeCategoryPage" className="text-amber-600 hover:text-amber-700 font-[var(--font-yekan)]">بازگشت به دسته‌بندی</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-gray-600 mb-6 font-[var(--font-yekan)]">
          <Link href="/" className="hover:text-amber-700 transition-colors">خانه</Link>
          <span className="mx-2">/</span>
          <Link href="/CoffeeCategoryPage" className="hover:text-amber-700 transition-colors">دسته‌بندی‌ها</Link>
          <span className="mx-2">/</span>
          <span className="text-amber-700 font-semibold">{product.name}</span>
        </motion.div>

        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-amber-700 hover:text-amber-800 mb-6 font-[var(--font-yekan)] transition-colors"
        >
          <FiArrowLeft />
          <span>بازگشت</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="bg-white rounded-2xl shadow-lg border border-amber-200 p-4">
              <div className="relative h-96 w-full rounded-xl overflow-hidden">
                <Image src={product.image} alt={product.name} fill className="object-cover" />
                {product.badge && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-3 py-1 rounded-full text-sm font-bold">{product.badge}</span>
                  </div>
                )}
                {product.discount > 0 && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">{product.discount}% تخفیف</div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2 font-[var(--font-yekan)] leading-relaxed">{product.name}</h1>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                ))}
              </div>
              <span className="text-gray-600 font-[var(--font-yekan)]">({product.reviews} نظر)</span>
              <span className="text-green-600 text-sm font-[var(--font-yekan)]">{product.category}</span>
            </div>

            <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-2xl p-6 border border-amber-200">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold text-amber-700 font-[var(--font-yekan)]">{product.price}</span>
                {product.originalPrice && <span className="text-xl text-gray-500 line-through font-[var(--font-yekan)]">{product.originalPrice}</span>}
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-gray-700 font-[var(--font-yekan)]">تعداد:</span>
                <div className="flex items-center gap-3 bg-white rounded-xl border border-amber-200 p-2">
                  <button onClick={decrementQuantity} className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center hover:bg-amber-200 transition-colors">-</button>
                  <span className="w-8 text-center font-bold text-gray-800">{quantity}</span>
                  <button onClick={incrementQuantity} className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center hover:bg-amber-200 transition-colors">+</button>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (product) {
                      addToCart({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                      }, quantity);
                    }
                  }}
                  className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white py-4 rounded-xl font-semibold shadow-lg font-[var(--font-yekan)] transition-all flex items-center justify-center gap-2"
                >
                  <FiShoppingCart size={20} /> <span>اضافه کن به سبد خریدم</span>
                </motion.button>

               <motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-4 rounded-xl font-semibold transition-all shadow-lg font-[var(--font-yekan)]"
>
  <FiMessageCircle size={22} />
  <div className="flex flex-col leading-tight text-right">
    <span>در موردش از من بپرس</span>
    <span className="text-sm opacity-90">(من هوش مصنوعی‌ام)</span>
  </div>
</motion.button>

              </div>

              {/* Tabs */}
              <div className="border-t border-amber-200 pt-4">
                <div className="flex gap-4 mb-4">
                  <button onClick={() => setActiveTab('description')} className={`px-4 py-2 rounded-t-xl ${activeTab === 'description' ? 'bg-amber-100 font-bold' : 'bg-white font-normal'}`}>توضیحات</button>
                  {product.features && product.features.length > 0 && (
                    <button onClick={() => setActiveTab('features')} className={`px-4 py-2 rounded-t-xl ${activeTab === 'features' ? 'bg-amber-100 font-bold' : 'bg-white font-normal'}`}>ویژگی‌ها</button>
                  )}
                </div>
                <div className="bg-white p-4 rounded-b-xl border border-t-0 border-amber-200 min-h-[100px]">
                  {activeTab === 'description' ? (
                    <p className="text-gray-700 font-[var(--font-yekan)]">{product.description || 'توضیحی برای این محصول موجود نیست.'}</p>
                  ) : (
                    <ul className="list-disc list-inside text-gray-700 font-[var(--font-yekan)]">
                      {product.features?.map((feat, idx) => <li key={idx}>{feat}</li>)}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 font-[var(--font-yekan)]">محصولات مرتبط</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map(p => (
                <div key={p.id} className="bg-white rounded-2xl shadow-lg border border-amber-200 p-4">
                  <div className="relative h-48 w-full rounded-xl overflow-hidden mb-3">
                    <Image src={p.image} alt={p.name} fill className="object-cover" />
                  </div>
                  <h3 className="font-[var(--font-yekan)] font-semibold text-gray-800">{p.name}</h3>
                  <span className="text-amber-700 font-bold font-[var(--font-yekan)]">{p.price}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
