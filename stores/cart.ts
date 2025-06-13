import { defineStore } from 'pinia';

// Define Product interface locally to avoid import issues
interface Product {
  id: number;
  name: string;
  slug: string;
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
  attributes?: Array<{
    id: number;
    name: string;
    options: string[];
  }>;
  stock_status: string;
  stock_quantity: number | null;
}

interface CartItem {
  product: Product;
  quantity: number;
  variants?: Record<string, string>;
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
    isOpen: false,
  }),
  
  actions: {
    addToCart(product: Product, quantity: number = 1, variants?: Record<string, string>) {
      // Check if we already have this product with the same variants
      const existingItem = this.items.find(item => {
        if (item.product.id !== product.id) return false;
        
        // If no variants for either, they match
        if (!variants && !item.variants) return true;
        
        // If one has variants but the other doesn't, they don't match
        if ((!variants && item.variants) || (variants && !item.variants)) return false;
        
        // Compare variants
        if (variants && item.variants) {
          const variantKeys = Object.keys(variants);
          const itemVariantKeys = Object.keys(item.variants);
          
          // Different number of variant attributes
          if (variantKeys.length !== itemVariantKeys.length) return false;
          
          // Check if all variants match
          return variantKeys.every(key => variants[key] === item.variants?.[key]);
        }
        
        return true;
      });
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        this.items.push({ product, quantity, variants });
      }
      
      // Save cart to localStorage
      this.saveCart();
      
      // Open cart drawer
      this.isOpen = true;
    },
    
    removeFromCart(productId: number) {
      const index = this.items.findIndex(item => item.product.id === productId);
      if (index !== -1) {
        this.items.splice(index, 1);
        this.saveCart();
      }
    },
    
    updateQuantity(productId: number, quantity: number) {
      const item = this.items.find(item => item.product.id === productId);
      if (item) {
        item.quantity = quantity;
        this.saveCart();
      }
    },
    
    clearCart() {
      this.items = [];
      this.saveCart();
    },
    
    toggleCart() {
      this.isOpen = !this.isOpen;
    },
    
    saveCart() {
      if (process.client) {
        localStorage.setItem('cart', JSON.stringify(this.items));
      }
    },
    
    loadCart() {
      if (process.client) {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          try {
            this.items = JSON.parse(savedCart);
          } catch (e) {
            console.error('Failed to parse cart from localStorage', e);
            this.items = [];
          }
        }
      }
    }
  },
  
  getters: {
    totalItems(): number {
      return this.items.reduce((total, item) => total + item.quantity, 0);
    },
    
    totalPrice(): number {
      return this.items.reduce((total, item) => {
        const price = parseFloat(item.product.price || item.product.regular_price);
        return total + (price * item.quantity);
      }, 0);
    },
    
    formattedTotalPrice(): string {
      return this.totalPrice.toFixed(2) + ' zł';
    }
  }
});
