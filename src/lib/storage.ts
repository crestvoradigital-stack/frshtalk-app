import { STORAGE_KEYS } from '../constants';
import { User, UserSettings } from '../types';

export const storage = {
  // Auth Token
  getAuthToken(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEYS.authToken);
    } catch {
      return null;
    }
  },

  setAuthToken(token: string): void {
    try {
      localStorage.setItem(STORAGE_KEYS.authToken, token);
    } catch (error) {
      console.error('Failed to save auth token:', error);
    }
  },

  removeAuthToken(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.authToken);
    } catch (error) {
      console.error('Failed to remove auth token:', error);
    }
  },

  // User
  getUser(): User | null {
    try {
      const user = localStorage.getItem(STORAGE_KEYS.user);
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  setUser(user: User): void {
    try {
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
    } catch (error) {
      console.error('Failed to save user:', error);
    }
  },

  removeUser(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.user);
    } catch (error) {
      console.error('Failed to remove user:', error);
    }
  },

  // Coins
  getCoins(): number {
    try {
      const coins = localStorage.getItem(STORAGE_KEYS.coins);
      return coins ? parseInt(coins, 10) : 0;
    } catch {
      return 0;
    }
  },

  setCoins(coins: number): void {
    try {
      localStorage.setItem(STORAGE_KEYS.coins, coins.toString());
    } catch (error) {
      console.error('Failed to save coins:', error);
    }
  },

  // Onboarding
  getHasSeenOnboarding(): boolean {
    try {
      return localStorage.getItem(STORAGE_KEYS.hasSeenOnboarding) === 'true';
    } catch {
      return false;
    }
  },

  setHasSeenOnboarding(value: boolean): void {
    try {
      localStorage.setItem(STORAGE_KEYS.hasSeenOnboarding, value.toString());
    } catch (error) {
      console.error('Failed to save onboarding status:', error);
    }
  },

  // Signup Bonus
  getHasClaimedSignupBonus(): boolean {
    try {
      return localStorage.getItem(STORAGE_KEYS.hasClaimedSignupBonus) === 'true';
    } catch {
      return false;
    }
  },

  setHasClaimedSignupBonus(value: boolean): void {
    try {
      localStorage.setItem(STORAGE_KEYS.hasClaimedSignupBonus, value.toString());
    } catch (error) {
      console.error('Failed to save signup bonus status:', error);
    }
  },

  // Favorites
  getFavorites(): string[] {
    try {
      const favorites = localStorage.getItem(STORAGE_KEYS.favorites);
      return favorites ? JSON.parse(favorites) : [];
    } catch {
      return [];
    }
  },

  setFavorites(favorites: string[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(favorites));
    } catch (error) {
      console.error('Failed to save favorites:', error);
    }
  },

  addFavorite(listenerId: string): void {
    const favorites = this.getFavorites();
    if (!favorites.includes(listenerId)) {
      favorites.push(listenerId);
      this.setFavorites(favorites);
    }
  },

  removeFavorite(listenerId: string): void {
    const favorites = this.getFavorites();
    const filtered = favorites.filter((id) => id !== listenerId);
    this.setFavorites(filtered);
  },

  isFavorite(listenerId: string): boolean {
    const favorites = this.getFavorites();
    return favorites.includes(listenerId);
  },

  // Settings
  getSettings(): UserSettings | null {
    try {
      const settings = localStorage.getItem(STORAGE_KEYS.settings);
      return settings ? JSON.parse(settings) : null;
    } catch {
      return null;
    }
  },

  setSettings(settings: UserSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  },

  // Clear All
  clearAll(): void {
    try {
      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  },
};
