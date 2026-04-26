import { useState, useEffect } from 'react';
import { storage } from '../lib/storage';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    setFavorites(storage.getFavorites());
  }, []);

  const addFavorite = (listenerId: string) => {
    storage.addFavorite(listenerId);
    setFavorites(storage.getFavorites());
  };

  const removeFavorite = (listenerId: string) => {
    storage.removeFavorite(listenerId);
    setFavorites(storage.getFavorites());
  };

  const toggleFavorite = (listenerId: string) => {
    if (isFavorite(listenerId)) {
      removeFavorite(listenerId);
    } else {
      addFavorite(listenerId);
    }
  };

  const isFavorite = (listenerId: string) => {
    return favorites.includes(listenerId);
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
  };
}
