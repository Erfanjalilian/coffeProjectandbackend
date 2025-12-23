// app/articles/page.tsx
import { getArticles } from '@/lib/api';
import ClientArticlesPage from './client-page';

export default async function ArticlesPage() {
  try {
    // Fetch articles on SERVER - user won't wait for this
    const initialArticles = await getArticles();
    
    return <ClientArticlesPage initialArticles={initialArticles} />;
  } catch (error) {
    console.error('Server-side fetch error:', error);
    return (
      <ClientArticlesPage 
        initialArticles={[]} 
        error="متاسفانه در بارگذاری مقالات مشکلی پیش آمده است. لطفا دوباره تلاش کنید."
      />
    );
  }
}