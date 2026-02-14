"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LuCrown } from "react-icons/lu";
import type { Product } from "@/lib/api/articles";

interface RelatedProductsProps {
  products: Product[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + " تومان";
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#1E2024] font-[var(--font-yekan)] flex items-center gap-2">
          <LuCrown className="text-[#3366FF]" />
          محصولات مرتبط
        </h2>
        <span className="text-sm text-[#666666] font-[var(--font-yekan)]">
          {products.length} محصول
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map((product, index) => (
          <Link
            key={product._id}
            href={`/CoffeeCategoryPage/${product._id}`}
            className="block cursor-pointer"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border-2 border-blue-200 hover:border-[#3366FF] hover:shadow-lg transition-all group h-full"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-[#1E2024] mb-2 font-[var(--font-yekan)] group-hover:text-[#3366FF] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-[#333333] text-sm font-[var(--font-yekan)] line-clamp-2">
                    {product.description}
                  </p>
                </div>
                <div className="bg-blue-100 text-[#3366FF] text-xs px-2 py-1 rounded-full font-[var(--font-yekan)] whitespace-nowrap">
                  {product.brand || 'برند'}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  {product.originalPrice && product.priceAfterDiscount && (
                    <span className="text-xs text-[#666666] line-through font-[var(--font-yekan)]">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                  <span className="font-bold text-[#FFA500] text-lg font-[var(--font-yekan)]">
                    {formatPrice(product.priceAfterDiscount || product.price)}
                  </span>
                </div>
                <div className="text-sm text-[#3366FF] font-[var(--font-yekan)] opacity-0 group-hover:opacity-100 transition-opacity">
                  مشاهده محصول
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}