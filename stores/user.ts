import { defineStore } from 'pinia';
import { useCookie } from '#app';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  avatar?: string;
}

interface LoginCredentials {
  username: string;
  password: string;
}

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
    isAuthenticated: false,
    isLoading: false,
    error: null as string | null,
    token: null as string | null,
  }),

  getters: {
    // Get user's full name
    fullName: (state) => {
      if (!state.user) return '';
      return `${state.user.firstName} ${state.user.lastName}`;
    },
    
    // Check if user is logged in
    loggedIn: (state) => {
      return state.isAuthenticated && state.user !== null;
    }
  },

  actions: {
    // Login with email and password
    async login(credentials: LoginCredentials) {
      const config = useRuntimeConfig();
      this.isLoading = true;
      this.error = null;
      
      try {
        // WordPress JWT authentication
        const response = await $fetch(`${config.public.wordpressUrl}?rest_route=/jwt-login/v1/auth&login=${credentials.username}&password=${credentials.password}`, {
          method: 'POST',
        });
        
        // Store the token
        this.token = response.data.jwt;
        
        // Get user data
        await this.fetchUserData(response.data.jwt);
        
        // Set authentication status
        this.isAuthenticated = true;
        
        // Store token in cookie for persistence
        const authCookie = useCookie('auth_token', {
          maxAge: 60 * 60 * 24 * 7, // 7 days
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          httpOnly: false // Allow JavaScript access
        });
        authCookie.value = response.token;
        
        return true;
      } catch (error: any) {
        this.error = error.message || 'Failed to login. Please check your credentials.';
        return false;
      } finally {
        this.isLoading = false;
      }
    },
    
    // Fetch user data with token
    async fetchUserData(token: string) {
      const config = useRuntimeConfig();
      
      try {
        const response = await $fetch(`${config.public.wordpressUrl}?rest_route=/jwt-login/v1/auth/validate&JWT=${token}`, {
          method: 'POST',
        });
        console.log(response)
        this.user = {
          id: response.data.user.id,
          email: response.data.user.email,
          firstName: response.data.user.display_name.split(' ')[0] || '',
          lastName: response.data.user.display_name.split(' ')[1] || '',
          displayName: response.data.user.user_nicename || response.data.user.display_name,
          avatar: response.data.user.avatar_urls?.['96'] || null
        };
      } catch (error: any) {
        console.error('Failed to fetch user data:', error);
        this.error = 'Failed to fetch user data';
      }
    },
    
    // Register a new user
    async register(userData: { username: string, email: string, password: string, firstName?: string, lastName?: string }) {
      const config = useRuntimeConfig();
      this.isLoading = true;
      this.error = null;
      
      try {
        // WordPress user registration
        const response = await $fetch(`${config.public.wordpressUrl}?rest_route=/jwt-login/v1/users&email=${userData.email}&password=${userData.password}&nickname=${userData.username}&first_name=${userData.firstName}&last_name=${userData.lastName}`, {
          method: 'POST',
        });
        
        // Auto login after successful registration
        await this.login({
          username: userData.email,
          password: userData.password
        });
        
        return true;
      } catch (error: any) {
        this.error = error.message || 'Registration failed. Please try again.';
        return false;
      } finally {
        this.isLoading = false;
      }
    },
    
    // Login with Google
    async loginWithGoogle(idToken: string) {
      const config = useRuntimeConfig();
      this.isLoading = true;
      this.error = null;
      
      try {
        // WordPress Google authentication
        // This requires a WordPress plugin that supports Google login
        const response = await $fetch(`${config.public.wordpressUrl}/api/v1/google`, {
          method: 'POST',
          body: {
            id_token: idToken
          }
        });
        
        // Store the token
        this.token = response.token;
        
        // Get user data
        await this.fetchUserData(response.token);
        
        // Set authentication status
        this.isAuthenticated = true;
        
        // Store token in cookie for persistence
        const authCookie = useCookie('auth_token', {
          maxAge: 60 * 60 * 24 * 7, // 7 days
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          httpOnly: false // Allow JavaScript access
        });
        authCookie.value = response.token;
        
        return true;
      } catch (error: any) {
        this.error = error.message || 'Google login failed. Please try again.';
        return false;
      } finally {
        this.isLoading = false;
      }
    },
    
    // Logout user
    logout() {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      
      // Remove token from cookie
      const authCookie = useCookie('auth_token', {
        maxAge: 0,
        sameSite: 'lax',
        httpOnly: false
      });
      authCookie.value = null;
    },
    
    // Check if user is already logged in (from cookie)
    async checkAuth() {
      const token = useCookie('auth_token', {
        sameSite: 'lax',
        httpOnly: false
      }).value;
      
      if (token) {
        this.token = token;
        this.isLoading = true;
        
        try {
          await this.fetchUserData(token);
          this.isAuthenticated = true;
        } catch (error) {
          this.logout(); // Token might be invalid or expired
        } finally {
          this.isLoading = false;
        }
      }
    }
  }
});
