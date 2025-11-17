import { create } from 'zustand';
import { User } from '../types';
import { authApi } from '../services/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email: string, password: string) => {
    try {
      console.log('🔐 Intentando login con:', email);
      const response = await authApi.login(email, password);
      console.log('✅ Login response:', response.data);
      const { access_token, refresh_token, user } = response.data;

      console.log('💾 Guardando tokens en localStorage...');
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      console.log('✅ Tokens guardados');

      set({ user, isAuthenticated: true, isLoading: false });
      console.log('✅ Estado actualizado - usuario autenticado:', user);
    } catch (error) {
      console.error('❌ Error en login:', error);
      set({ user: null, isAuthenticated: false, isLoading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    console.log('🔍 Verificando autenticación...');
    const token = localStorage.getItem('access_token');
    console.log('🔑 Token encontrado:', token ? token.substring(0, 30) + '...' : 'NO HAY TOKEN');

    if (!token) {
      console.log('⚠️ No hay token - usuario no autenticado');
      set({ user: null, isAuthenticated: false, isLoading: false });
      return;
    }

    try {
      console.log('📡 Llamando a /api/auth/me...');
      const response = await authApi.getCurrentUser();
      console.log('✅ Usuario verificado:', response.data);
      set({ user: response.data, isAuthenticated: true, isLoading: false });
    } catch (error) {
      console.error('❌ Error verificando usuario:', error);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
