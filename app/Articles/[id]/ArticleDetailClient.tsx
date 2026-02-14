"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import dynamic from 'next/dynamic';
import { FiClock, FiUser, FiCalendar, FiShare2 } from "react-icons/fi";
import { LuCrown } from "react-icons/lu";
import type { Article, Product } from "@/lib/api/articles";

// Lazy load non-critical components
const RelatedProducts = dynamic(() => import('./RelatedProducts'), {
  loading: () => <div className="h-48 bg-blue-50 animate-pulse rounded-2xl" />
});

interface ArticleDetailClientProps {
  article: Article;
  relatedProducts: Product[];
}

export default function ArticleDetailClient({ article, relatedProducts: initialRelatedProducts }: ArticleDetailClientProps) {
  const router = useRouter();
  const [relatedProducts] = useState(initialRelatedProducts);

  // Memoize expensive calculations
  const formattedDate = useMemo(() => {
    try {
      const date = new Date(article.date);
      return new Intl.DateTimeFormat('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date);
    } catch {
      return article.date;
    }
  }, [article.date]);

  const formattedBody = useMemo(() => {
    return article.body.split('\n').filter(p => p.trim() !== '');
  }, [article.body]);

  // Share handler
  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('لینک مقاله کپی شد!');
    }
  }, [article.title, article.excerpt]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-34" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-[#333333] mb-6 font-[var(--font-yekan)] flex items-center gap-2">
          <Link href="/" className="hover:text-[#3366FF] transition-colors">
            خانه
          </Link>
          <span>/</span>
          <Link href="/articles" className="hover:text-[#3366FF] transition-colors">
            مقالات
          </Link>
          <span>/</span>
          <span className="text-[#3366FF] font-semibold truncate">{article.title}</span>
        </div>

        {/* Article Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-6 mb-8"
        >
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="bg-gradient-to-r from-[#3366FF] to-blue-700 text-white text-sm px-3 py-1 rounded-full font-bold font-[var(--font-yekan)]">
              {article.badge}
            </span>
            {article.category && (
              <span className="bg-blue-100 text-[#3366FF] text-sm px-3 py-1 rounded-full font-[var(--font-yekan)]">
                {article.category}
              </span>
            )}
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-[#1E2024] mb-4 leading-relaxed font-[var(--font-yekan)]">
            {article.title}
          </h1>

          <p className="text-[#333333] text-lg mb-6 leading-relaxed font-[var(--font-yekan)]">
            {article.excerpt}
          </p>

          {/* Article Meta */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-[#666666] border-t border-gray-200 pt-4">
            <div className="flex items-center gap-2">
              <FiUser className="text-[#3366FF]" />
              <span className="font-[var(--font-yekan)]">نویسنده: {article.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiCalendar className="text-[#3366FF]" />
              <span className="font-[var(--font-yekan)]">{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiClock className="text-[#3366FF]" />
              <span className="font-[var(--font-yekan)]">زمان مطالعه: {article.readTime}</span>
            </div>
          </div>
        </motion.div>

        {/* Article Cover */}
        <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-12 mb-8 flex items-center justify-center border-2 border-blue-300">
          <div className="text-center">
            <svg className="w-20 h-20 text-[#3366FF] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9m0 0v2m0-2a2 2 0 012-2h2a2 2 0 012 2m-6 5v2m0 4v2m0 4v2m8-12v2m0 4v2m0 4v2" />
            </svg>
            <p className="text-[#3366FF] font-[var(--font-yekan)] text-lg">تصویر مقاله: {article.title}</p>
          </div>
        </div>

        {/* Article Body */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-8 mb-8">
          <div className="prose prose-lg max-w-none font-[var(--font-yekan)] text-[#333333] leading-8">
            {formattedBody.map((paragraph, index) => (
              <p key={index} className="mb-4 text-justify">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Share Button - Only share button remaining */}
          <div className="flex justify-center mt-8 pt-6 border-t border-gray-200">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              className="flex items-center gap-2 bg-[#3366FF] text-white px-6 py-3 rounded-xl font-[var(--font-yekan)] hover:bg-[#194FFF] transition-colors shadow-md"
            >
              <FiShare2 className="text-lg" />
              اشتراک گذاری مقاله
            </motion.button>
          </div>
        </div>

        {/* Related Products - Lazy loaded */}
        {relatedProducts.length > 0 && (
          <RelatedProducts products={relatedProducts} />
        )}
      </div>
    </div>
  );
}