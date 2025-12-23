// app/coffee-category/page.tsx
import { getProducts } from '@/lib/api';
import ClientCoffeeCategoryPage from './client-page';

export default async function CoffeeCategoryPage() {
  try {
    // This runs on the SERVER - user sees nothing until it completes
    const initialProducts = await getProducts();
    
    return <ClientCoffeeCategoryPage initialProducts={initialProducts} />;
  } catch (error) {
    console.error('Server-side fetch error:', error);
    return (
      <ClientCoffeeCategoryPage 
        initialProducts={[]} 
        error="متاسفانه در بارگذاری محصولات مشکلی پیش آمده است. لطفا دوباره تلاش کنید."
      />
    );
  }
}