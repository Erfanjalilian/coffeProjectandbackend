import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import ArticleDetailClient from './ArticleDetailClient';
import { ArticleDetailSkeleton } from './ArticleDetailSkeleton';
import { fetchArticleById, fetchRelatedProducts } from '@/lib/api/articles';

// Next.js 15 metadata generation
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await fetchArticleById(id);
  
  if (!article) {
    return {
      title: 'مقاله یافت نشد',
    };
  }

  // Ensure we handle both Article and Article[] cases
  if (Array.isArray(article)) {
    // Defensive: fallback case (shouldn't happen, but handle gracefully)
    return {
      title: 'مقاله یافت نشد',
    };
  }

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.date,
      authors: [article.author],
    },
  };
}

// Generate static paths for better performance
export async function generateStaticParams() {
  const articles = await fetchArticleById(); // Fetch all articles

  // Ensure articles is always an array
  const articlesArray = Array.isArray(articles) ? articles : articles ? [articles] : [];

  return articlesArray.map((article: { _id: string }) => ({
    id: article._id,
  }));
}

// Main server component
export default async function ArticleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  try {
    // Parallel data fetching
    const [article, relatedProducts] = await Promise.all([
      fetchArticleById(id),
      fetchRelatedProducts(id)
    ]);

    if (!article) {
      notFound();
    }

    return (
      <Suspense fallback={<ArticleDetailSkeleton />}>
        <ArticleDetailClient 
          article={Array.isArray(article) ? article[0] : article}
          relatedProducts={relatedProducts}
        />
      </Suspense>
    );
  } catch (error) {
    console.error('Error in article detail page:', error);
    notFound();
  }
}