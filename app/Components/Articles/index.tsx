import { Suspense } from 'react';
import { fetchArticleById } from '@/lib/api/articles';
import ArticlesClient from './ArticlesClient';
import { ArticlesSkeleton } from './ArticlesSkeleton';

// Using the new Next.js 15 async component pattern
export default async function Articles() {
  try {
    // Parallel data fetching for better performance
    const articlesPromise = fetchArticleById();
    
    // You could add more parallel promises here if needed
    const [articles] = await Promise.all([articlesPromise]);
    
    // Ensure initialArticles is always an array, even if fetchArticleById returns a single Article
    return (
      <Suspense fallback={<ArticlesSkeleton />}>
        <ArticlesClient initialArticles={Array.isArray(articles) ? articles : articles ? [articles] : []} />
      </Suspense>
    );
  } catch (error) {
    console.error('Error in Articles server component:', error);
    
    // Return client component with error state
    return <ArticlesClient initialArticles={[]} error="خطا در دریافت مقالات. لطفا دوباره تلاش کنید." />;
  }
}