// Add these new types and functions to your existing articles.ts file

export interface Article {
  _id: string;
  title: string;
  excerpt: string;
  description: string;
  body: string;
  cover: string;
  href: string;
  badge: string;
  readTime: string;
  author: string;
  date: string;
  publish: number;
  category?: string;
  relatedProducts: string[];
  isFeatured?: boolean;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  priceAfterDiscount?: number;
  discount?: number;
  stock: number;
  image: string;
  brand?: string;
  badge?: string;
  rating?: number;
  reviews?: number;
  isPrime?: boolean;
  isPremium?: boolean;
}

// Fetch article by ID (or all articles if no ID provided)
export async function fetchArticleById(id?: string): Promise<Article | Article[]> {
  try {
    const response = await fetch(
      'https://coffee-shop-backend-k3un.onrender.com/api/v1/article',
      {
        next: {
          revalidate: 3600, // Revalidate every hour
          tags: ['articles', id ? `article-${id}` : 'all-articles'],
        },
        signal: AbortSignal.timeout(5000)
      }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (result.success && result.data.articles) {
      const publishedArticles = result.data.articles.filter((a: Article) => a.publish === 1);
      
      if (id) {
        // Return single article
        const article = publishedArticles.find((a: Article) => a._id === id);
        return article || null;
      }
      
      // Return all articles for static generation
      return publishedArticles;
    }
    
    return id ? ({} as Article) : [];
  } catch (error) {
    console.error('Error fetching article:', error);
    if (id) {
      // but no article was found or an error occurred.
      // However, a better approach is to adjust the return type to Article | Article[] | null, 
      // but for now, we can return an empty object cast to Article.
      // Alternatively, return undefined if allowed, but sticking to Article | Article[].
      return {} as Article;
    }
    return [];
  }
}
export async function fetchRelatedProducts(articleId: string): Promise<Product[]> {
  try {
    // First get the article to get related product IDs
    const article = await fetchArticleById(articleId) as Article;
    
    if (!article || !article.relatedProducts || article.relatedProducts.length === 0) {
      return [];
    }

    // Fetch all products
    const response = await fetch(
      'https://coffee-shop-backend-k3un.onrender.com/api/v1/product',
      {
        next: {
          revalidate: 3600,
          tags: ['products', `article-${articleId}-products`],
        },
        signal: AbortSignal.timeout(5000)
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.success && result.data.products) {
      // Filter products that match the related product IDs
      return result.data.products.filter((product: Product) =>
        article.relatedProducts.includes(product._id)
      );
    }

    return [];
  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
}