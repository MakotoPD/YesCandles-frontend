import { defineStore } from 'pinia';

export interface Category {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    categories: [] as Category[],
    isLoading: false,
    error: null as string | null,
  }),
  
  actions: {
    async fetchCategories() {
      const config = useRuntimeConfig();
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await $fetch(`${config.public.wooApiUrl}/products/categories`, {
          params: {
            consumer_key: config.public.wooConsumerKey,
            consumer_secret: config.public.wooConsumerSecret,
            per_page: 100
          },
          credentials: 'include'
        });
        
        this.categories = response;
      } catch (error: any) {
        console.error('Error fetching categories:', error);
        this.error = error.message || 'Failed to fetch categories';
      } finally {
        this.isLoading = false;
      }
    }
  },
  
  getters: {
    getCategoryBySlug: (state) => (slug: string) => {
      return state.categories.find(category => category.slug === slug);
    },
    
    getCategoryById: (state) => (id: number) => {
      return state.categories.find(category => category.id === id);
    },
    
    getMainCategories: (state) => {
      // Filter categories with product count > 0
      return state.categories.filter(category => category.count > 0);
    }
  }
});
