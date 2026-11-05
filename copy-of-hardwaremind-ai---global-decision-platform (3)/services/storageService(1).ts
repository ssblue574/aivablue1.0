import { Product, ChatMessage, CommunityPost } from '../data';

const KEYS = {
  FAVORITES: 'aiva_favorites',
  CHAT_HISTORY: 'aiva_chat_history',
  SEARCH_HISTORY: 'aiva_search_history',
  COMMUNITY_POSTS: 'aiva_community_posts',
  GALLERY: 'aiva_gallery',
  KEYNOTE_PROGRESS: 'aiva_keynote_progress',
  KEYNOTE_FAVORITES: 'aiva_keynote_favorites',
  RECENT_VIEWS: 'aiva_recent_views',
};

export const storageService = {
  // Favorites / Comparison List
  getFavorites: (): Product[] => {
    try {
      const item = localStorage.getItem(KEYS.FAVORITES);
      return item ? JSON.parse(item) : [];
    } catch { return []; }
  },
  
  saveFavorites: (products: Product[]) => {
    localStorage.setItem(KEYS.FAVORITES, JSON.stringify(products));
  },

  toggleFavorite: (product: Product): Product[] => {
    const current = storageService.getFavorites();
    const exists = current.find(p => p.id === product.id);
    let updated;
    if (exists) {
      updated = current.filter(p => p.id !== product.id);
    } else {
      updated = [...current, product];
    }
    storageService.saveFavorites(updated);
    return updated;
  },

  // Chat History
  getChatHistory: (): ChatMessage[] => {
    try {
      const item = localStorage.getItem(KEYS.CHAT_HISTORY);
      return item ? JSON.parse(item) : [];
    } catch { return []; }
  },

  saveChatHistory: (messages: ChatMessage[]) => {
    // Limit to last 50 messages to prevent storage overflow
    const toSave = messages.slice(-50);
    localStorage.setItem(KEYS.CHAT_HISTORY, JSON.stringify(toSave));
  },

  clearChatHistory: () => {
    localStorage.removeItem(KEYS.CHAT_HISTORY);
  },
  
  // Search History
  getSearchHistory: (): string[] => {
    try {
      const item = localStorage.getItem(KEYS.SEARCH_HISTORY);
      return item ? JSON.parse(item) : [];
    } catch { return []; }
  },

  addSearchHistory: (query: string) => {
    const current = storageService.getSearchHistory();
    const updated = [query, ...current.filter(q => q !== query)].slice(0, 10);
    localStorage.setItem(KEYS.SEARCH_HISTORY, JSON.stringify(updated));
  },

  removeSearchHistory: (query: string) => {
    const current = storageService.getSearchHistory();
    const updated = current.filter(q => q !== query);
    localStorage.setItem(KEYS.SEARCH_HISTORY, JSON.stringify(updated));
    return updated;
  },

  clearSearchHistory: () => {
    localStorage.removeItem(KEYS.SEARCH_HISTORY);
  },

  // Community Posts
  getPosts: (): CommunityPost[] => {
    try {
      const item = localStorage.getItem(KEYS.COMMUNITY_POSTS);
      return item ? JSON.parse(item) : [];
    } catch { return []; }
  },

  addPost: (post: CommunityPost) => {
    const current = storageService.getPosts();
    const updated = [post, ...current];
    localStorage.setItem(KEYS.COMMUNITY_POSTS, JSON.stringify(updated));
    return updated;
  },

  updatePost: (post: CommunityPost) => {
    const current = storageService.getPosts();
    const updated = current.map(p => (p.id === post.id ? post : p));
    localStorage.setItem(KEYS.COMMUNITY_POSTS, JSON.stringify(updated));
    return updated;
  },

  deletePost: (id: string) => {
    const current = storageService.getPosts();
    const updated = current.filter(p => p.id !== id);
    localStorage.setItem(KEYS.COMMUNITY_POSTS, JSON.stringify(updated));
    return updated;
  },

  // AI Gallery
  getGallery: (): string[] => {
    try {
      const item = localStorage.getItem(KEYS.GALLERY);
      return item ? JSON.parse(item) : [];
    } catch { return []; }
  },

  saveToGallery: (imageUrl: string) => {
    const current = storageService.getGallery();
    // Prevent duplicates
    if (current.includes(imageUrl)) return current;
    const updated = [imageUrl, ...current];
    localStorage.setItem(KEYS.GALLERY, JSON.stringify(updated));
    return updated;
  },

  // Keynote Progress (播放进度记忆)
  getKeynoteProgress: (): Record<string, number> => {
    try {
      const item = localStorage.getItem(KEYS.KEYNOTE_PROGRESS);
      return item ? JSON.parse(item) : {};
    } catch { return {}; }
  },

  saveKeynoteProgress: (keynoteId: string, progress: number) => {
    const current = storageService.getKeynoteProgress();
    current[keynoteId] = progress;
    localStorage.setItem(KEYS.KEYNOTE_PROGRESS, JSON.stringify(current));
  },

  // Keynote Favorites (收藏的发布会)
  getKeynoteFavorites: (): string[] => {
    try {
      const item = localStorage.getItem(KEYS.KEYNOTE_FAVORITES);
      return item ? JSON.parse(item) : [];
    } catch { return []; }
  },

  toggleKeynoteFavorite: (keynoteId: string): string[] => {
    const current = storageService.getKeynoteFavorites();
    const exists = current.includes(keynoteId);
    const updated = exists 
      ? current.filter(id => id !== keynoteId)
      : [...current, keynoteId];
    localStorage.setItem(KEYS.KEYNOTE_FAVORITES, JSON.stringify(updated));
    return updated;
  },

  // Recent Views (最近浏览)
  getRecentViews: (): Product[] => {
    try {
      const item = localStorage.getItem(KEYS.RECENT_VIEWS);
      return item ? JSON.parse(item) : [];
    } catch { return []; }
  },

  addRecentView: (product: Product) => {
    const current = storageService.getRecentViews();
    // Remove if already exists
    const filtered = current.filter(p => p.id !== product.id);
    // Add to front and limit to 10
    const updated = [product, ...filtered].slice(0, 10);
    localStorage.setItem(KEYS.RECENT_VIEWS, JSON.stringify(updated));
    return updated;
  },

  clearRecentViews: () => {
    localStorage.removeItem(KEYS.RECENT_VIEWS);
  }
};

