import { useState, useEffect, useRef, useMemo } from 'react';
import { AppView, Product, ComparisonResult, ChatMessage, NewsItem, Language, CommunityPost } from '../data';
import { discoverHardware, compareProductsAI, sendChatMessage } from '../services/geminiService';
import { getNewsFeed, getLatestDrops, getCategories, getKeynotes, getCommunityPosts, getMilestones, resolveHomeShowcaseProducts } from '../data';
import { storageService } from '../services/storageService';
import { cloudService, supabase, logEvent } from '../services/supabaseService';
import { generateProductImage } from '../services/imageGenerationService';

export interface ToastCallback {
  success: (message: string, duration?: number) => string;
  error: (message: string, duration?: number) => string;
  info: (message: string, duration?: number) => string;
  favorite: (message: string, duration?: number) => string;
}

export const useAppLogic = (lang: Language, t: (key: any) => string, toast?: ToastCallback) => {
  // Data State
  const [catalog, setCatalog] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [newsFeed, setNewsFeed] = useState<NewsItem[]>([]);
  const [localPosts, setLocalPosts] = useState<CommunityPost[]>([]);
  const [latestFiveProducts, setLatestFiveProducts] = useState<Product[]>([]); // 仅首页横条，见 data/homeShowcase.ts

  // AI图片生成：默认关闭，避免首屏卡在图片生成导致产品列表一直为空
  // 需要时在控制台执行：localStorage.setItem('useAIGeneratedImages','true') 后刷新
  const [useAIGeneratedImages, setUseAIGeneratedImages] = useState<boolean>(
    localStorage.getItem('useAIGeneratedImages') === 'true'
  );
  const [imageGenerationProgress, setImageGenerationProgress] = useState<{ current: number; total: number } | null>(null);

  // Comparison State
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);

  // Sync Status
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error' | 'offline'>('synced');
  const [lastSynced, setLastSynced] = useState<Date | null>(null);

  // Store/Products State
  const [activeCategory, setActiveCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);

  // Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize Data on lang change
  useEffect(() => {
    const initializeData = async () => {
      try {
        const drops = getLatestDrops(lang);
        const cats = getCategories(lang);
        setNewsFeed(getNewsFeed(lang));

        // 产品时效规则：默认仅展示「近半年」内的新品；若标记为经典（isClassic），则始终保留
        const now = new Date();
        const HALF_YEAR_MS = 183 * 24 * 60 * 60 * 1000; // 约半年
        const baseSorted = [...drops].sort((a, b) => {
          const da = new Date(a.launchDate || '').getTime();
          const db = new Date(b.launchDate || '').getTime();
          return (isNaN(db) ? 0 : db) - (isNaN(da) ? 0 : da);
        });
        let filteredDrops = drops.filter(p => {
          if (!p.launchDate) return true;
          const d = new Date(p.launchDate);
          if (isNaN(d.getTime())) return true; // 无法解析的日期先不过滤
          const diff = now.getTime() - d.getTime();
          // 未来产品（预告）也保留；已发布则限制在半年内，或标记为经典
          if (diff < 0) return true;
          return diff <= HALF_YEAR_MS || p.isClassic;
        });

        // 若近半年内不足 5 个，放宽到 12 个月以保证首页「最近发布」至少 5 条
        if (filteredDrops.length < 5) {
          const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;
          filteredDrops = drops.filter(p => {
            if (!p.launchDate) return true;
            const d = new Date(p.launchDate);
            if (isNaN(d.getTime())) return true;
            const diff = now.getTime() - d.getTime();
            if (diff < 0) return true;
            return diff <= ONE_YEAR_MS || p.isClassic;
          });
        }

        // 如果近半年/一年过滤后仍少于 5 个，用原始按时间排序的列表兜底
        if (filteredDrops.length < 5) {
          filteredDrops = baseSorted;
        }

        // 按发布时间从新到旧排序，保证最新产品排在最前面
        let sortedDrops = [...filteredDrops].sort((a, b) => {
          if (!a.launchDate && !b.launchDate) return 0;
          if (!a.launchDate) return 1;
          if (!b.launchDate) return -1;
          return new Date(b.launchDate).getTime() - new Date(a.launchDate).getTime();
        });

        // 如果启用AI生成图片，为产品生成图片
        if (useAIGeneratedImages) {
          setImageGenerationProgress({ current: 0, total: sortedDrops.length });

          // 为每个产品生成图片（异步，不阻塞UI）
          const productsWithImages = await Promise.all(
            sortedDrops.map(async (product, index) => {
              const imageUrl = await generateProductImage(product);
              setImageGenerationProgress({ current: index + 1, total: sortedDrops.length });
              return { ...product, imageUrl };
            })
          );

          sortedDrops = productsWithImages;
          setImageGenerationProgress(null);
        }

        setCatalog(sortedDrops);
        setProducts(sortedDrops); // 发现新品 /products — 全量目录，勿与首页 showcase 混用

        setLatestFiveProducts(resolveHomeShowcaseProducts(sortedDrops, baseSorted));
        setCategories(cats);
        if (cats.length > 0) {
          setActiveCategory(cats[0]);
        }
      } catch (error) {
        console.error('Error initializing app data:', error);
        toast?.error(
          lang === 'zh' 
            ? '数据加载失败，部分功能可能不可用' 
            : 'Failed to load data, some features may be unavailable',
          4000
        );
      }
    };

    initializeData();

    // Load persisted chat history or default welcome
    const savedChat = storageService.getChatHistory();
    if (savedChat.length > 0) {
      setChatMessages(savedChat);
    } else {
      setChatMessages([{ role: 'ai', content: t('chat_welcome') }]);
    }

    // Load persisted favorites
    const savedFavorites = storageService.getFavorites();
    if (savedFavorites.length > 0) setFavorites(savedFavorites);

    // HYBRID SYNC: Load local first, then try cloud
    const savedPosts = storageService.getPosts();
    setLocalPosts(savedPosts);

    if (supabase) {
      setSyncStatus('syncing');
      cloudService.getPosts()
        .then(cloudPosts => {
          if (cloudPosts.length > 0) {
            // Deduplicate simple logic: favour cloud over local if IDs match
            setLocalPosts(prev => {
              const combined = [...cloudPosts];
              prev.forEach(p => {
                if (!combined.find(c => c.id === p.id)) {
                  combined.push(p);
                }
              });
              return combined;
            });
          }
          setSyncStatus('synced');
          setLastSynced(new Date());
        })
        .catch(error => {
          console.error('Failed to sync posts:', error);
          setSyncStatus('error');
        });
    } else {
      setSyncStatus('offline');
    }

  }, [lang]);

  // Persist Chat History
  useEffect(() => {
    if (chatMessages.length > 0) {
      storageService.saveChatHistory(chatMessages);
    }
  }, [chatMessages]);

  // Persist Favorites with feedback
  useEffect(() => {
    if (favorites.length > 0) {
      storageService.saveFavorites(favorites);
      // Silent save - no toast to avoid spam
    }
  }, [favorites]);

  // 发布会时效规则：保留最近 730 天的 Keynote，最多 20 条；日期解析失败时不过滤，避免误伤
  const keynoteItems = useMemo(() => {
    const all = getKeynotes(lang);
    const now = new Date();
    const TWO_YEARS_MS = 730 * 24 * 60 * 60 * 1000;
    return all
      .filter(k => {
        if (!k.date) return true;
        const d = new Date(k.date);
        if (isNaN(d.getTime())) return true;
        const diff = now.getTime() - d.getTime();
        if (diff < 0) return true; // 未来发布会（预告）保留
        return diff <= TWO_YEARS_MS;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 20);
  }, [lang]);

  // Merge default posts with user local posts
  const communityPosts = useMemo(() => {
    const defaults = getCommunityPosts(lang);
    // Ensure no duplicates between defaults and local/cloud
    const userPostIds = new Set(localPosts.map(p => p.id));
    const filteredDefaults = defaults.filter(p => !userPostIds.has(p.id));
    return [...localPosts, ...filteredDefaults];
  }, [lang, localPosts]);

  const milestones = useMemo(() => getMilestones(lang), [lang]);

  // Actions
  const handleAddPost = async (post: CommunityPost) => {
    try {
      // 1. Optimistic Update (Local)
      const updated = storageService.addPost(post);
      setLocalPosts(updated);
      toast?.success(
        lang === 'zh' 
          ? '帖子已发布' 
          : 'Post published successfully',
        2000
      );

      // 2. Cloud Sync (Background)
      if (supabase) {
        setSyncStatus('syncing');
        try {
          await cloudService.createPost(post);
          setSyncStatus('synced');
          setLastSynced(new Date());
          toast?.info(
            lang === 'zh' 
              ? '已同步到云端' 
              : 'Synced to cloud',
            2000
          );
        } catch (cloudError) {
          console.error('Cloud sync failed:', cloudError);
          setSyncStatus('error');
          toast?.error(
            lang === 'zh' 
              ? '云端同步失败，但已保存到本地' 
              : 'Cloud sync failed, but saved locally',
            3000
          );
        }
      } else {
        setSyncStatus('offline');
      }

      // 3. Analytics
      logEvent('community_post_create', {
        postId: post.id,
        productId: post.productId,
        rating: post.rating,
      });
    } catch (error) {
      console.error('Failed to add post:', error);
      toast?.error(
        lang === 'zh' 
          ? '发布失败，请重试' 
          : 'Failed to publish, please try again',
        3000
      );
    }
  };

  const handleUpdatePost = async (post: CommunityPost) => {
    try {
      const updated = storageService.updatePost(post);
      setLocalPosts(updated);
      toast?.success(
        lang === 'zh' 
          ? '帖子已更新' 
          : 'Post updated successfully',
        2000
      );

      if (supabase) {
        setSyncStatus('syncing');
        try {
          await cloudService.updatePost(post);
          setSyncStatus('synced');
          setLastSynced(new Date());
        } catch (cloudError) {
          console.error('Cloud sync failed:', cloudError);
          setSyncStatus('error');
          toast?.error(
            lang === 'zh' 
              ? '云端同步失败，但已保存到本地' 
              : 'Cloud sync failed, but saved locally',
            3000
          );
        }
      } else {
        setSyncStatus('offline');
      }

      logEvent('community_post_update', {
        postId: post.id,
        productId: post.productId,
        rating: post.rating,
        helpfulCount: post.helpfulCount,
      });
    } catch (error) {
      console.error('Failed to update post:', error);
      toast?.error(
        lang === 'zh' 
          ? '更新失败，请重试' 
          : 'Failed to update, please try again',
        3000
      );
    }
  };

  const handleDeletePost = async (id: string) => {
    try {
      const updated = storageService.deletePost(id);
      setLocalPosts(updated);
      toast?.success(
        lang === 'zh' 
          ? '帖子已删除' 
          : 'Post deleted successfully',
        2000
      );

      if (supabase) {
        setSyncStatus('syncing');
        try {
          await cloudService.deletePost(id);
          setSyncStatus('synced');
          setLastSynced(new Date());
        } catch (cloudError) {
          console.error('Cloud sync failed:', cloudError);
          setSyncStatus('error');
          toast?.error(
            lang === 'zh' 
              ? '云端删除失败，但已从本地删除' 
              : 'Cloud delete failed, but removed locally',
            3000
          );
        }
      } else {
        setSyncStatus('offline');
      }

      logEvent('community_post_delete', { postId: id });
    } catch (error) {
      console.error('Failed to delete post:', error);
      toast?.error(
        lang === 'zh' 
          ? '删除失败，请重试' 
          : 'Failed to delete, please try again',
        3000
      );
    }
  };

  const handleSearch = async (e?: React.FormEvent, overrideQuery?: string) => {
    if (e) e.preventDefault();
    const q = overrideQuery || searchQuery;
    if (!q) {
      toast?.info(lang === 'zh' ? '请输入搜索关键词' : 'Please enter a search keyword');
      return;
    }

    setIsSearching(true);
    // Save search history
    storageService.addSearchHistory(q);

    // Analytics - search
    logEvent('search', { query: q });

    // Determine mode based on where we are is tricky without view state, 
    // but we can default to 'trending' or pass it as arg if needed.
    // For now, default to trending.
    const mode = 'trending';

    try {
      const results = await discoverHardware(q, mode, lang);
      if (results.length > 0) {
        setProducts(results);
        toast?.success(
          lang === 'zh' 
            ? `找到 ${results.length} 个相关产品` 
            : `Found ${results.length} products`,
          2000
        );
      } else {
        // Fallback
        const allProducts = [...getLatestDrops(lang), ...getMilestones(lang)];
        const filtered = allProducts.filter(p =>
          p.name && p.brand && p.description &&
          (p.name.toLowerCase().includes(q.toLowerCase()) ||
          p.description.toLowerCase().includes(q.toLowerCase()) ||
          p.brand.toLowerCase().includes(q.toLowerCase()))
        );
        if (filtered.length > 0) {
          setProducts(filtered);
          toast?.info(
            lang === 'zh' 
              ? `找到 ${filtered.length} 个相关产品（本地搜索）` 
              : `Found ${filtered.length} products (local search)`,
            2000
          );
        } else {
          setProducts([]);
          // 空结果提示会在 ProductsView 中显示
        }
      }
    } catch (err) {
      console.error(err);
      toast?.error(
        lang === 'zh' 
          ? '搜索失败，请稍后重试' 
          : 'Search failed, please try again later',
        4000
      );
      // 保持当前产品列表不变
    } finally {
      setIsSearching(false);
    }
  };

  const toggleSelection = (product: Product) => {
    setSelectedProducts(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        const newList = prev.filter(p => p.id !== product.id);
        toast?.info(
          lang === 'zh' 
            ? `已取消选择 ${product.name}` 
            : `Deselected ${product.name}`,
          2000
        );
        return newList;
      }
      if (prev.length >= 3) {
        toast?.error(
          lang === 'zh' 
            ? "最多只能选择 3 款产品进行比较" 
            : "You can select up to 3 products for comparison",
          3000
        );
        return prev;
      }
      const newList = [...prev, product];
      toast?.success(
        lang === 'zh' 
          ? `已选择 ${product.name} (${newList.length}/3)` 
          : `Selected ${product.name} (${newList.length}/3)`,
        2000
      );
      return newList;
    });
  };

  const toggleFavorite = (product: Product) => {
    setFavorites(prev => {
      const exists = prev.find(p => p.id === product.id);
      const next = exists
        ? prev.filter(p => p.id !== product.id)
        : [...prev, product];

      // Analytics - favorite toggle
      logEvent('favorite_toggle', {
        productId: product.id,
        action: exists ? 'remove' : 'add',
      });

      // Toast feedback
      if (exists) {
        toast?.info(
          lang === 'zh' 
            ? `已取消收藏 ${product.name}` 
            : `Removed ${product.name} from favorites`,
          2000
        );
      } else {
        toast?.favorite(
          lang === 'zh' 
            ? `已收藏 ${product.name}` 
            : `Added ${product.name} to favorites`,
          2000
        );
      }

      return next;
    });
  };

  const runComparison = async () => {
    // Note: This logic might need to change to navigation instead of internal state
    if (selectedProducts.length < 2) {
      toast?.error(
        lang === 'zh' 
          ? '请至少选择 2 款产品进行比较' 
          : 'Please select at least 2 products to compare',
        3000
      );
      return;
    }
    setIsComparing(true);
    setComparisonResult(null);
    toast?.info(
      lang === 'zh' 
        ? '正在生成对比分析...' 
        : 'Generating comparison analysis...',
      2000
    );
    try {
      const names = selectedProducts.map(p => `${p.brand} ${p.name}`);
      const result = await compareProductsAI(names, lang);
      setComparisonResult(result);
      toast?.success(
        lang === 'zh' 
          ? '对比分析完成' 
          : 'Comparison analysis completed',
        2000
      );
    } catch (err) {
      console.error(err);
      toast?.error(
        lang === 'zh' 
          ? '对比分析失败，请稍后重试' 
          : 'Comparison failed, please try again later',
        4000
      );
    } finally {
      setIsComparing(false);
    }
  };

  const handleSendChat = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isChatLoading) {
      if (!chatInput.trim()) {
        toast?.info(lang === 'zh' ? '请输入消息' : 'Please enter a message');
      }
      return;
    }

    const userMsg = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsChatLoading(true);

    try {
      const aiResponse = await sendChatMessage(userMsg, lang);
      setChatMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
    } catch (error) {
      const errorMsg = lang === 'zh' 
        ? '连接 Aiva 失败，请检查网络连接后重试' 
        : 'Failed to connect to Aiva. Please check your connection and try again.';
      setChatMessages(prev => [...prev, { role: 'ai', content: errorMsg }]);
      toast?.error(
        lang === 'zh' 
          ? 'AI 服务暂时不可用，请稍后重试' 
          : 'AI service temporarily unavailable, please try again later',
        4000
      );
    } finally {
      setIsChatLoading(false);
    }
  };

  return {
    products, setProducts,
    selectedProducts, toggleSelection,
    favorites, toggleFavorite,
    searchQuery, setSearchQuery, isSearching, handleSearch,
    newsFeed,
    isComparing, comparisonResult, runComparison,
    activeCategory, setActiveCategory, categories,
    isChatOpen, setIsChatOpen, chatMessages, chatInput, setChatInput, isChatLoading, handleSendChat, chatEndRef,
    keynoteItems, communityPosts, milestones, catalog, latestFiveProducts,
    handleAddPost, handleUpdatePost, handleDeletePost,
    useAIGeneratedImages, setUseAIGeneratedImages, imageGenerationProgress,
    syncStatus, lastSynced
  };
};

