// lib/api.ts - COMPLETE UPDATED FILE WITH ALL FUNCTIONS
export async function getProducts() {
  try {
    const response = await fetch('https://coffee-shop-backend-k3un.onrender.com/api/v1/product', {
      // Cache for 60 seconds to improve performance
      next: { revalidate: 60 }
    });
    
    if (!response.ok) {
      throw new Error(`API responded with ${response.status}`);
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error('API returned unsuccessful');
    }
    
    // Map data to match your Product interface
    return result.data.products.map((product: any) => ({
      id: product._id,
      name: product.name,
      price: product.priceAfterDiscount || product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      category: product.category?.name || 'بدون دسته‌بندی',
      badge: product.badge,
      rating: product.rating || 0,
      reviews: product.reviews || 0,
      isPrime: product.isPrime,
      discount: product.discount,
      type: product.type || 'regular',
      positiveFeature: product.positiveFeature,
      status: getStatusFromBadge(product.badge),
      brand: product.brand,
      recommended: product.recommended || false
    }));
  } catch (error) {
    console.error('Failed to fetch products:', error);
    throw error; // Re-throw to handle in page.tsx
  }
}

export async function getDiscountProducts() {
  try {
    const response = await fetch('https://coffee-shop-backend-k3un.onrender.com/api/v1/product', {
      next: { revalidate: 60 } // Cache for 60 seconds
    });
    
    if (!response.ok) {
      throw new Error(`API responded with ${response.status}`);
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error('API returned unsuccessful');
    }
    
    // Filter only products with discount
    const productsWithDiscount = result.data.products
      .filter((product: any) => product.discount > 0)
      .map((product: any) => ({
        _id: product._id,
        name: product.name,
        description: product.description,
        positiveFeature: product.positiveFeature,
        category: product.category,
        badge: product.badge,
        images: product.images,
        image: product.image,
        status: getStatusFromBadge(product.badge),
        price: product.price,
        stock: product.stock,
        originalPrice: product.originalPrice,
        discount: product.discount,
        type: product.type,
        dealType: product.dealType,
        timeLeft: product.timeLeft,
        soldCount: product.soldCount,
        totalCount: product.totalCount,
        rating: product.rating || 0,
        reviews: product.reviews || 0,
        isPrime: product.isPrime,
        isPremium: product.isPremium,
        features: product.features || [],
        priceAfterDiscount: product.priceAfterDiscount || product.price,
        brand: product.brand,
        weight: product.weight,
        ingredients: product.ingredients,
        benefits: product.benefits,
        howToUse: product.howToUse,
        hasWarranty: product.hasWarranty,
        warrantyDuration: product.warrantyDuration,
        warrantyDescription: product.warrantyDescription,
        userReviews: product.userReviews || [],
        recommended: product.recommended || false,
        relatedProducts: product.relatedProducts || [],
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      }));
    
    return productsWithDiscount;
  } catch (error) {
    console.error('Failed to fetch discount products:', error);
    throw error;
  }
}

export async function getValuablePurchases() {
  try {
    const response = await fetch('https://coffee-shop-backend-k3un.onrender.com/api/v1/valueBuy', {
      next: { revalidate: 60 } // Cache for 60 seconds
    });
    
    if (!response.ok) {
      throw new Error(`API responded with ${response.status}`);
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error('API returned unsuccessful');
    }
    
    return result.data.valueBuys || [];
  } catch (error) {
    console.error('Failed to fetch valuable purchases:', error);
    throw error;
  }
}

export async function getAllCategories() {
  try {
    const response = await fetch('https://coffee-shop-backend-k3un.onrender.com/api/v1/category', {
      next: { revalidate: 300 } // Cache for 5 minutes
    });
    
    if (!response.ok) {
      throw new Error(`API responded with ${response.status}`);
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error('API returned unsuccessful');
    }
    
    return result.data.categories || [];
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    throw error;
  }
}

export async function getArticles() {
  try {
    const response = await fetch('https://coffee-shop-backend-k3un.onrender.com/api/v1/article', {
      next: { revalidate: 60 } // Cache for 60 seconds
    });
    
    if (!response.ok) {
      throw new Error(`API responded with ${response.status}`);
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error('API returned unsuccessful');
    }
    
    // Filter only published articles (publish === 1)
    const publishedArticles = result.data.articles
      .filter((article: any) => article.publish === 1)
      .map((article: any) => ({
        _id: article._id,
        title: article.title,
        excerpt: article.excerpt,
        description: article.description,
        body: article.body,
        cover: article.cover,
        href: article.href,
        category: article.category,
        creator: article.creator,
        relatedProducts: article.relatedProducts || [],
        badge: article.badge,
        readTime: article.readTime,
        author: article.author,
        date: article.date,
        publish: article.publish,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
        __v: article.__v
      }));
    
    return publishedArticles;
  } catch (error) {
    console.error('Failed to fetch articles:', error);
    throw error;
  }
}

function getStatusFromBadge(badge: string): string {
  switch (badge) {
    case "پرفروش": return "پر فروش";
    case "جدید": return "جدید";
    case "ویژه": return "فروش ویژه";
    default: return "جدید";
  }
}

// Helper function for price formatting
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fa-IR').format(price) + " تومان";
}

// Optional: Common product mapping helper
export function mapProductData(product: any) {
  return {
    id: product._id,
    name: product.name,
    price: product.priceAfterDiscount || product.price,
    originalPrice: product.originalPrice,
    image: product.image,
    category: product.category?.name || 'بدون دسته‌بندی',
    badge: product.badge,
    rating: product.rating || 0,
    reviews: product.reviews || 0,
    discount: product.discount || 0,
    brand: product.brand,
    positiveFeature: product.positiveFeature,
    status: getStatusFromBadge(product.badge)
  };
}