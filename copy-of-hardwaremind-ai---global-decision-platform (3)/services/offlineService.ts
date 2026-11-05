/**
 * Offline Service
 * Manages offline data storage, synchronization, and conflict resolution
 */

import { Product, CommunityPost } from '../data/types';

interface OfflineAction {
  id: string;
  type: 'favorite' | 'unfavorite' | 'addPost' | 'updatePost' | 'deletePost' | 'viewProduct';
  data: any;
  timestamp: number;
  synced: boolean;
}

class OfflineService {
  private dbName = 'HardwareMindDB';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;
  private actionQueue: OfflineAction[] = [];

  /**
   * Initialize IndexedDB
   */
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        console.error('Failed to open IndexedDB');
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        this.loadActionQueue();
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object stores
        if (!db.objectStoreNames.contains('products')) {
          db.createObjectStore('products', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('posts')) {
          db.createObjectStore('posts', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('favorites')) {
          db.createObjectStore('favorites', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('actions')) {
          const actionStore = db.createObjectStore('actions', { keyPath: 'id', autoIncrement: true });
          actionStore.createIndex('synced', 'synced', { unique: false });
          actionStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
        if (!db.objectStoreNames.contains('cache')) {
          db.createObjectStore('cache', { keyPath: 'key' });
        }
      };
    });
  }

  /**
   * Store product data offline
   */
  async storeProduct(product: Product): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['products'], 'readwrite');
      const store = transaction.objectStore('products');
      const request = store.put(product);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get product from offline storage
   */
  async getProduct(id: string): Promise<Product | null> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['products'], 'readonly');
      const store = transaction.objectStore('products');
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get all products from offline storage
   */
  async getAllProducts(): Promise<Product[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['products'], 'readonly');
      const store = transaction.objectStore('products');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Store favorite offline
   */
  async storeFavorite(product: Product): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['favorites'], 'readwrite');
      const store = transaction.objectStore('favorites');
      const request = store.put(product);

      request.onsuccess = () => {
        this.queueAction({
          id: `fav-${Date.now()}`,
          type: 'favorite',
          data: { productId: product.id },
          timestamp: Date.now(),
          synced: false,
        });
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Remove favorite offline
   */
  async removeFavorite(productId: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['favorites'], 'readwrite');
      const store = transaction.objectStore('favorites');
      const request = store.delete(productId);

      request.onsuccess = () => {
        this.queueAction({
          id: `unfav-${Date.now()}`,
          type: 'unfavorite',
          data: { productId },
          timestamp: Date.now(),
          synced: false,
        });
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get all favorites from offline storage
   */
  async getFavorites(): Promise<Product[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['favorites'], 'readonly');
      const store = transaction.objectStore('favorites');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Store community post offline
   */
  async storePost(post: CommunityPost): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['posts'], 'readwrite');
      const store = transaction.objectStore('posts');
      const request = store.put(post);

      request.onsuccess = () => {
        this.queueAction({
          id: `post-${Date.now()}`,
          type: 'addPost',
          data: post,
          timestamp: Date.now(),
          synced: false,
        });
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get all posts from offline storage
   */
  async getPosts(): Promise<CommunityPost[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['posts'], 'readonly');
      const store = transaction.objectStore('posts');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Queue an action for later sync
   */
  private async queueAction(action: OfflineAction): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['actions'], 'readwrite');
      const store = transaction.objectStore('actions');
      const request = store.add(action);

      request.onsuccess = () => {
        this.actionQueue.push(action);
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Load action queue from IndexedDB
   */
  private async loadActionQueue(): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['actions'], 'readonly');
      const store = transaction.objectStore('actions');
      const index = store.index('synced');
      const request = index.getAll(false); // Get unsynced actions

      request.onsuccess = () => {
        this.actionQueue = request.result || [];
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get pending actions for sync
   */
  async getPendingActions(): Promise<OfflineAction[]> {
    if (!this.db) await this.init();
    await this.loadActionQueue();
    return this.actionQueue.filter(action => !action.synced);
  }

  /**
   * Mark action as synced
   */
  async markActionSynced(actionId: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['actions'], 'readwrite');
      const store = transaction.objectStore('actions');
      const getRequest = store.get(actionId);

      getRequest.onsuccess = () => {
        const action = getRequest.result;
        if (action) {
          action.synced = true;
          const putRequest = store.put(action);
          putRequest.onsuccess = () => {
            this.actionQueue = this.actionQueue.filter(a => a.id !== actionId);
            resolve();
          };
          putRequest.onerror = () => reject(putRequest.error);
        } else {
          resolve();
        }
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  /**
   * Cache API response
   */
  async cacheResponse(key: string, data: any, ttl: number = 3600000): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cache'], 'readwrite');
      const store = transaction.objectStore('cache');
      const request = store.put({
        key,
        data,
        timestamp: Date.now(),
        ttl,
      });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get cached response
   */
  async getCachedResponse(key: string): Promise<any | null> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cache'], 'readonly');
      const store = transaction.objectStore('cache');
      const request = store.get(key);

      request.onsuccess = () => {
        const cached = request.result;
        if (!cached) {
          resolve(null);
          return;
        }

        const age = Date.now() - cached.timestamp;
        if (age > cached.ttl) {
          // Cache expired, delete it
          const deleteTransaction = this.db!.transaction(['cache'], 'readwrite');
          const deleteStore = deleteTransaction.objectStore('cache');
          deleteStore.delete(key);
          resolve(null);
        } else {
          resolve(cached.data);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Clear all offline data
   */
  async clearAll(): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(
        ['products', 'posts', 'favorites', 'actions', 'cache'],
        'readwrite'
      );

      let completed = 0;
      const total = 5;

      const checkComplete = () => {
        completed++;
        if (completed === total) {
          resolve();
        }
      };

      transaction.objectStore('products').clear().onsuccess = checkComplete;
      transaction.objectStore('posts').clear().onsuccess = checkComplete;
      transaction.objectStore('favorites').clear().onsuccess = checkComplete;
      transaction.objectStore('actions').clear().onsuccess = checkComplete;
      transaction.objectStore('cache').clear().onsuccess = checkComplete;

      transaction.onerror = () => reject(transaction.error);
    });
  }
}

export const offlineService = new OfflineService();

