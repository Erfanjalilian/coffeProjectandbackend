// app/special-discounts/page.tsx
import { getDiscountProducts } from '@/lib/api';
import ClientSpecialDiscountsPage from './client-page';

export default async function SpecialDiscountsPage() {
  try {
    // Fetch discount products on SERVER - user won't wait for this
    const initialProducts = await getDiscountProducts();
    
    return <ClientSpecialDiscountsPage initialProducts={initialProducts} />;
  } catch (error) {
    console.error('Server-side fetch error:', error);
    return (
      <ClientSpecialDiscountsPage 
        initialProducts={[]} 
        error="متاسفانه در بارگذاری تخفیف‌ها مشکلی پیش آمده است. لطفا دوباره تلاش کنید."
      />
    );
  }
}