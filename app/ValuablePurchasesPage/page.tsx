// app/valuable-purchases/page.tsx
import { getValuablePurchases, getAllCategories } from '@/lib/api';
import ClientValuablePurchasesPage from './client-page';

export default async function ValuablePurchasesPage() {
  try {
    // Fetch data on SERVER - user won't wait for this
    const [initialProducts, initialCategories] = await Promise.all([
      getValuablePurchases(),
      getAllCategories()
    ]);
    
    return (
      <ClientValuablePurchasesPage 
        initialProducts={initialProducts} 
        initialCategories={initialCategories} 
      />
    );
  } catch (error) {
    console.error('Server-side fetch error:', error);
    return (
      <ClientValuablePurchasesPage 
        initialProducts={[]} 
        initialCategories={[]}
        error="متاسفانه در بارگذاری خریدهای باارزش مشکلی پیش آمده است. لطفا دوباره تلاش کنید."
      />
    );
  }
}