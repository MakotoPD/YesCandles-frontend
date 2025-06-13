import { defineStore } from 'pinia';

// Define the Product interface
interface Product {
  id: number;
  name: string;
  slug: string;
  tags: Array<{id: number, name: string, slug: string}>;
  price: string;
  regular_price: string;
  sale_price: string;
  description: string;
  short_description: string;
  images: Array<{
    id: number;
    src: string;
    alt: string;
  }>;
  categories: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  stock_status: string;
  stock_quantity: number | null;
  meta_data: any;
}

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: [] as Product[],
    featuredProducts: [] as Product[],
    isLoading: false,
    error: null as string | null,
  }),
  
  actions: {
    async fetchProducts() {
      const config = useRuntimeConfig();
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await $fetch(`${config.public.wooApiUrl}/products`, {
          params: {
            consumer_key: config.public.wooConsumerKey,
            consumer_secret: config.public.wooConsumerSecret,
            per_page: 100
          },
          credentials: 'include'
        });
        
        this.products = response;
      } catch (error: any) {
        console.error('Error fetching products:', error);
        this.error = error.message || 'Failed to fetch products';
      } finally {
        this.isLoading = false;
      }
    },
    
    async fetchFeaturedProducts() {
      const config = useRuntimeConfig();
      this.isLoading = true;
      
      try {
        const response = await $fetch(`${config.public.wooApiUrl}/products`, {
          params: {
            consumer_key: config.public.wooConsumerKey,
            consumer_secret: config.public.wooConsumerSecret,
            featured: false,
            per_page: 6
          },
          credentials: 'include'
        });
        
        this.featuredProducts = response;
      } catch (error: any) {
        console.error('Error fetching featured products:', error);
      } finally {
        this.isLoading = false;
      }
    },
    
    async getProductBySlug(slug: string): Promise<Product | undefined> {
      const config = useRuntimeConfig();
      
      try {
        const response = await $fetch(`${config.public.wooApiUrl}/products`, {
          params: {
            consumer_key: config.public.wooConsumerKey,
            consumer_secret: config.public.wooConsumerSecret,
            slug
          },
          credentials: 'include'
        });
        
        if (Array.isArray(response) && response.length > 0) {
          return response[0];
        }
        return undefined;
      } catch (error) {
        console.error('Error fetching product by slug:', error);
        return undefined;
      }
    },
    
    async getProductVariations(productId: number): Promise<any[]> {
      const config = useRuntimeConfig();
      
      try {
        const response = await $fetch(`${config.public.wooApiUrl}/products/${productId}/variations`, {
          params: {
            consumer_key: config.public.wooConsumerKey,
            consumer_secret: config.public.wooConsumerSecret,
            per_page: 100
          },
          credentials: 'include'
        });
        
        if (Array.isArray(response)) {
          return response;
        }
        return [];
      } catch (error) {
        console.error('Error fetching product variations:', error);
        return [];
      }
    }
  },
  
  getters: {
    getProductById: (state) => (id: number) => {
      return state.products.find(product => product.id === id);
    }
  }
});
