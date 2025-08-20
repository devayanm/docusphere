import { useState, useEffect, useCallback } from 'react';

export interface FavoriteItem {
  id: string;
  title: string;
  path: string;
  dateAdded: string;
  type: 'page' | 'folder';
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('docusphere-favorites');
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to parse favorites:', error);
      }
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('docusphere-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = useCallback((item: Omit<FavoriteItem, 'dateAdded'>) => {
    setFavorites(prev => {
      const exists = prev.find(fav => fav.id === item.id);
      if (exists) return prev;
      
      return [...prev, {
        ...item,
        dateAdded: new Date().toISOString()
      }];
    });
  }, []);

  const removeFavorite = useCallback((id: string) => {
    setFavorites(prev => prev.filter(fav => fav.id !== id));
  }, []);

  const toggleFavorite = useCallback((item: Omit<FavoriteItem, 'dateAdded'>) => {
    const isFavorite = favorites.some(fav => fav.id === item.id);
    if (isFavorite) {
      removeFavorite(item.id);
    } else {
      addFavorite(item);
    }
  }, [favorites, addFavorite, removeFavorite]);

  const isFavorite = useCallback((id: string) => {
    return favorites.some(fav => fav.id === id);
  }, [favorites]);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearFavorites,
  };
}
