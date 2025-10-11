import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { api } from '../shared/api';

type Tokens = { accessToken: string | null; refreshToken: string | null };
type Creds = { email: string; password: string };

const ACCESS_KEY = 'access_token';
const REFRESH_KEY = 'refresh_token';

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  setTokens: (t: Tokens) => Promise<void>;
  logout: () => Promise<void>;
  login: (c: Creds) => Promise<boolean>;
  refresh: () => Promise<string | null>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  refreshToken: null,
  setTokens: async ({ accessToken, refreshToken }) => {
    set({ accessToken, refreshToken });
    if (accessToken) await SecureStore.setItemAsync(ACCESS_KEY, accessToken);
    if (refreshToken) await SecureStore.setItemAsync(REFRESH_KEY, refreshToken);
  },
  logout: async () => {
    await SecureStore.deleteItemAsync(ACCESS_KEY);
    await SecureStore.deleteItemAsync(REFRESH_KEY);
    set({ accessToken: null, refreshToken: null });
  },
  login: async ({ email, password }) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      await get().setTokens({ accessToken: data.access_token, refreshToken: data.refresh_token });
      return true;
    } catch {
      return false;
    }
  },
  refresh: async () => {
    const rt = (await SecureStore.getItemAsync(REFRESH_KEY)) || get().refreshToken;
    if (!rt) return null;
    try {
      const { data } = await api.post('/auth/refresh', { refresh_token: rt });
      await get().setTokens({ accessToken: data.access_token, refreshToken: data.refresh_token || rt });
      return data.access_token as string;
    } catch {
      await get().logout();
      return null;
    }
  },
}));