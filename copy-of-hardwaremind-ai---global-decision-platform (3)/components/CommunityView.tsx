import React, { useMemo, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Heart, MessageCircle, Share2, Plus, X, Sparkles, Zap, ExternalLink, ArrowLeft, Image, Send, Star } from 'lucide-react';
import { clsx } from 'clsx';
import { CommunityPost, Product, UserProfile } from '../data';
import { useTheme } from '../ThemeContext';
import { useNavigate } from 'react-router-dom';
import { logEvent } from '../services/supabaseService';
import { GlassmorphicCard } from './GlassmorphicCard';
import { DynamicInput } from './DynamicInput';
import { useInteractionFeedback } from '../hooks/useInteractionFeedback';
import { ConfirmDialog } from './ConfirmDialog';
import { SyncStatusIndicator } from './SyncStatusIndicator';

// FAB Component that renders via Portal to body
const FloatingActionButton: React.FC<{
    onClick: () => void;
    isDark: boolean;
}> = ({ onClick, isDark }) => {
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);
    
    if (!mounted) return null;
    
    return createPortal(
        <button
            onClick={onClick}
            style={{
                position: 'fixed',
                bottom: '24px',
                right: '24px',
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                cursor: 'pointer',
                zIndex: 99999,
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                color: isDark ? '#000000' : '#ffffff',
                boxShadow: isDark 
                    ? '0 8px 40px rgba(255,255,255,0.3), 0 4px 20px rgba(255,255,255,0.2)' 
                    : '0 8px 40px rgba(0,0,0,0.4), 0 4px 20px rgba(0,0,0,0.3)',
                transition: 'transform 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
            <Plus size={24} strokeWidth={2.5} />
        </button>,
        document.body
    );
};

interface CommunityViewProps {
    t: (key: any) => string;
    posts: CommunityPost[];
    products: Product[];
    onViewProduct?: (product: Product) => void;
    onAddPost?: (post: CommunityPost) => void;
    onUpdatePost?: (post: CommunityPost) => void;
    onDeletePost?: (id: string) => void;
    currentUser: UserProfile | null;
    lang?: string;
}

// PostCard Component with GlassmorphicCard and interaction feedback
const PostCard: React.FC<{
    post: CommunityPost;
    t: (key: any) => string;
    products: Product[];
    onViewProduct?: (product: Product) => void;
    onUpdatePost?: (post: CommunityPost) => void;
    onDeletePost?: (id: string) => void;
    currentUser: UserProfile | null;
    isDark: boolean;
    isZh: boolean;
    setEditingPostId: (id: string) => void;
    setShowComposer: (show: boolean) => void;
    setSelectedProductId: (id: string) => void;
    setDraftTitle: (title: string) => void;
    setDraftContent: (content: string) => void;
    setDraftRating: (rating: number) => void;
}> = ({
    post,
    t,
    products,
    onViewProduct,
    onUpdatePost,
    onDeletePost,
    currentUser,
    isDark,
    isZh,
    setEditingPostId,
    setShowComposer,
    setSelectedProductId,
    setDraftTitle,
    setDraftContent,
    setDraftRating,
}) => {
    const [showCommentInput, setShowCommentInput] = useState(false);
    const [commentText, setCommentText] = useState('');
    // Interaction feedback for like button
    const likeButtonFeedback = useInteractionFeedback({
        enableGlow: true,
        enableRipple: true,
        enableParticles: true,
        glowConfig: {
            color: isDark ? '#FF5FD2' : '#FF2D55',
            intensity: 0.6,
            duration: 600,
        },
        rippleConfig: {
            color: isDark ? 'rgba(255, 95, 210, 0.4)' : 'rgba(255, 45, 85, 0.4)',
            duration: 600,
        },
        particleConfig: {
            count: 8,
            colors: [isDark ? '#FF5FD2' : '#FF2D55', isDark ? '#00FFC6' : '#0071E3'],
            duration: 800,
        },
    });

    // Interaction feedback for comment button
    const commentButtonFeedback = useInteractionFeedback({
        enableGlow: true,
        enableRipple: true,
        glowConfig: {
            color: isDark ? '#6AA8FF' : '#0071E3',
            intensity: 0.5,
            duration: 500,
        },
        rippleConfig: {
            color: isDark ? 'rgba(106, 168, 255, 0.4)' : 'rgba(0, 113, 227, 0.4)',
            duration: 500,
        },
    });

    // Interaction feedback for share button
    const shareButtonFeedback = useInteractionFeedback({
        enableGlow: true,
        enableRipple: true,
        glowConfig: {
            color: isDark ? '#00FFC6' : '#0071E3',
            intensity: 0.5,
            duration: 500,
        },
        rippleConfig: {
            color: isDark ? 'rgba(0, 255, 198, 0.4)' : 'rgba(0, 113, 227, 0.4)',
            duration: 500,
        },
    });

    const renderRating = (rating: number) => {
        return (
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((num) => (
                    <span
                        key={num}
                        className={clsx(
                            "text-xs",
                            num <= rating
                                ? "text-yellow-400"
                                : isDark ? "text-white/20" : "text-black/20"
                        )}
                    >
                        ★
                    </span>
                ))}
            </div>
        );
    };

    return (
        <GlassmorphicCard
            blur={20}
            opacity={isDark ? 0.05 : 0.15}
            borderGlow={true}
            hoverEffect="lift"
            className="p-6 space-y-5"
        >
            <div className="flex items-start gap-3">
                <div className={clsx(
                    "w-12 h-12 rounded-full flex items-center justify-center font-semibold",
                    isDark ? "bg-gradient-to-br from-white/30 to-white/5 text-white" : "bg-gradient-to-br from-black/10 to-black/5 text-black"
                )}>
                    {post.userName.slice(0, 1)}
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <p className="font-semibold">{post.userName}</p>
                        {post.isVerifiedPurchase && (
                            <span className={clsx("text-[10px] tracking-wide px-2 py-0.5 rounded-full", isDark ? "bg-white/10 text-white" : "bg-black/10 text-black")}>✓ {t('verified')}</span>
                        )}
                    </div>
                    <div className={clsx("flex items-center gap-2 text-xs mt-1", isDark ? "text-white/40" : "text-black/40")}>
                        {renderRating(post.rating)}
                        <span>·</span>
                        <span>{post.createdAt}</span>
                    </div>
                </div>
            </div>
            <div
                className={clsx(
                    "flex items-center gap-3 border rounded-2xl p-4 cursor-pointer transition-all hover:scale-[1.02]",
                    isDark ? "bg-white/[0.03] border-white/10 hover:border-white/30" : "bg-gray-50 border-black/5 hover:border-black/20"
                )}
                onClick={() => {
                    const product = products.find(p => p.id === post.productId);
                    if (product && onViewProduct) onViewProduct(product);
                }}
            >
                <img src={post.productImage} alt={post.productName} className="w-14 h-14 rounded-xl object-cover" />
                <div>
                    <p className={clsx("text-xs uppercase tracking-[0.3em]", isDark ? "text-white/40" : "text-black/40")}>{t('community_link_label')}</p>
                    <p className="font-medium">{post.productName}</p>
                </div>
            </div>
            <div>
                <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                <p className={clsx("leading-relaxed", isDark ? "text-white/70" : "text-black/70")}>{post.content}</p>
            </div>
            <div className={clsx("flex items-center justify-between text-sm", isDark ? "text-white/50" : "text-black/50")}>
                <div className="flex items-center gap-6">
                    <button
                        type="button"
                        className="flex items-center gap-2 transition-transform relative"
                        onClick={(e) => {
                            if (!currentUser) {
                                alert(isZh ? '请先登录后再点赞' : 'Please sign in to like');
                                return;
                            }
                            likeButtonFeedback.handleClick(e);
                            if (onUpdatePost) {
                                onUpdatePost({
                                    ...post,
                                    helpfulCount: post.helpfulCount + 1,
                                });
                            }
                            // Analytics - like post
                            logEvent('community_post_like', {
                                postId: post.id,
                                productId: post.productId,
                            });
                        }}
                        onMouseEnter={likeButtonFeedback.handleMouseEnter}
                        onMouseLeave={likeButtonFeedback.handleMouseLeave}
                    >
                        <Heart size={18} />
                        <span>{post.helpfulCount}</span>
                    </button>
                    <button
                        className="flex items-center gap-2 transition-transform relative"
                        onClick={(e) => {
                            commentButtonFeedback.handleClick(e);
                            setShowCommentInput(!showCommentInput);
                        }}
                        onMouseEnter={commentButtonFeedback.handleMouseEnter}
                        onMouseLeave={commentButtonFeedback.handleMouseLeave}
                    >
                        <MessageCircle size={18} />
                        <span>{t('reply')}</span>
                    </button>
                    <button
                        className="flex items-center gap-2 transition-transform relative"
                        onClick={shareButtonFeedback.handleClick}
                        onMouseEnter={shareButtonFeedback.handleMouseEnter}
                        onMouseLeave={shareButtonFeedback.handleMouseLeave}
                    >
                        <Share2 size={18} />
                    </button>
                </div>
                {currentUser?.id === post.userId && (
                    <div className="flex items-center gap-3 text-xs">
                        <button
                            type="button"
                            className={clsx(
                                "underline-offset-2 hover:underline",
                                isDark ? "text-white/70" : "text-black/70"
                            )}
                            onClick={() => {
                                setEditingPostId(post.id);
                                setShowComposer(true);
                                setSelectedProductId(post.productId);
                                setDraftTitle(post.title);
                                setDraftContent(post.content);
                                setDraftRating(post.rating);
                            }}
                        >
                            {isZh ? '编辑' : 'Edit'}
                        </button>
                        <button
                            type="button"
                            className={clsx(
                                "underline-offset-2 hover:underline",
                                isDark ? "text-red-400" : "text-red-600"
                            )}
                            onClick={() => {
                                setDeleteConfirmPostId(post.id);
                            }}
                        >
                            {isZh ? '删除' : 'Delete'}
                        </button>
                    </div>
                )}
            </div>

            {/* Comment Input Section with DynamicInput */}
            {showCommentInput && (
                <div className="pt-4 border-t border-white/10 dark:border-white/10 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <DynamicInput
                        label={isZh ? '添加评论' : 'Add a comment'}
                        placeholder={isZh ? '分享你的想法...' : 'Share your thoughts...'}
                        value={commentText}
                        onChange={setCommentText}
                        glowOnFocus={true}
                        floatingLabel={true}
                        icon={<MessageCircle size={18} />}
                        maxLength={500}
                        showCharCount={true}
                    />
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => {
                                setShowCommentInput(false);
                                setCommentText('');
                            }}
                            className={clsx(
                                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                                isDark ? "text-white/70 hover:text-white hover:bg-white/10" : "text-black/70 hover:text-black hover:bg-black/5"
                            )}
                        >
                            {isZh ? '取消' : 'Cancel'}
                        </button>
                        <button
                            onClick={() => {
                                if (commentText.trim()) {
                                    // Handle comment submission
                                    alert(isZh ? `评论已提交: ${commentText}` : `Comment submitted: ${commentText}`);
                                    setCommentText('');
                                    setShowCommentInput(false);
                                }
                            }}
                            disabled={!commentText.trim()}
                            className={clsx(
                                "px-4 py-2 rounded-lg text-sm font-semibold transition-all",
                                commentText.trim()
                                    ? (isDark ? "bg-white text-black hover:scale-105" : "bg-black text-white hover:scale-105")
                                    : (isDark ? "bg-white/10 text-white/30 cursor-not-allowed" : "bg-black/10 text-black/30 cursor-not-allowed")
                            )}
                        >
                            {isZh ? '发送' : 'Send'}
                        </button>
                    </div>
                </div>
            )}
        </GlassmorphicCard>
    );
};

export const CommunityView: React.FC<CommunityViewProps> = ({
    t,
    posts,
    products,
    onViewProduct,
    onAddPost,
    onUpdatePost,
    onDeletePost,
    currentUser,
    lang = 'zh',
    syncStatus = 'synced',
    lastSynced
}) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const isZh = lang === 'zh';
    const navigate = useNavigate();
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [showComposer, setShowComposer] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<string>('');
    const [draftTitle, setDraftTitle] = useState('');
    const [draftContent, setDraftContent] = useState('');
    const [draftRating, setDraftRating] = useState(5);
    const [editingPostId, setEditingPostId] = useState<string | null>(null);
    const [deleteConfirmPostId, setDeleteConfirmPostId] = useState<string | null>(null);
    
    // 自动保存草稿
    useEffect(() => {
        if (showComposer && (draftTitle.trim() || draftContent.trim())) {
            const draftKey = editingPostId 
                ? `post_draft_edit_${editingPostId}` 
                : 'post_draft_new';
            const draft = {
                title: draftTitle,
                content: draftContent,
                rating: draftRating,
                productId: selectedProductId,
                timestamp: Date.now(),
            };
            localStorage.setItem(draftKey, JSON.stringify(draft));
        }
    }, [draftTitle, draftContent, draftRating, selectedProductId, showComposer, editingPostId]);
    
    // 加载草稿
    useEffect(() => {
        if (showComposer && !editingPostId) {
            const savedDraft = localStorage.getItem('post_draft_new');
            if (savedDraft) {
                try {
                    const draft = JSON.parse(savedDraft);
                    // 只加载24小时内的草稿
                    if (Date.now() - draft.timestamp < 24 * 60 * 60 * 1000) {
                        setDraftTitle(draft.title || '');
                        setDraftContent(draft.content || '');
                        setDraftRating(draft.rating || 5);
                        if (draft.productId) {
                            setSelectedProductId(draft.productId);
                        }
                    }
                } catch (e) {
                    // 忽略解析错误
                }
            }
        }
    }, [showComposer, editingPostId]);
    
    const [showGuidelines, setShowGuidelines] = useState(false);

    const uniqueProducts = useMemo(() => {
        const byId: Record<string, Product> = {};
        posts.forEach(post => {
            const product = products.find(p => p.id === post.productId);
            if (product) byId[product.id] = product;
        });
        return Object.values(byId).slice(0, 12);
    }, [posts, products]);

    const filteredPosts = useMemo(() => {
        return selectedFilter === 'all'
            ? posts
            : posts.filter(p => p.productId === selectedFilter);
    }, [posts, selectedFilter]);

    const heroStats = useMemo(() => [
        { label: t('community_stats_posts') || (isZh ? '帖子' : 'Posts'), value: posts.length },
        { label: t('community_stats_products') || (isZh ? '产品' : 'Products'), value: uniqueProducts.length },
        { label: t('community_stats_verified') || (isZh ? '已验证' : 'Verified'), value: posts.filter(p => p.isVerifiedPurchase).length }
    ], [posts, uniqueProducts, t, isZh]);

    const spotlightPost = useMemo(() => {
        if (posts.length === 0) return null;
        return posts.reduce((prev, current) => 
            (current.helpfulCount > prev.helpfulCount || 
             (current.helpfulCount === prev.helpfulCount && current.rating > prev.rating))
                ? current : prev
        );
    }, [posts]);

    const renderRating = (rating: number) => {
        return (
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((num) => (
                    <span
                        key={num}
                        className={clsx(
                            "text-xs",
                            num <= rating
                                ? "text-yellow-400"
                                : isDark ? "text-white/20" : "text-black/20"
                        )}
                    >
                        ★
                    </span>
                ))}
            </div>
        );
    };

    const handleSubmitDraft = (e: React.FormEvent) => {
        e.preventDefault();
        if (!draftContent.trim() || !draftTitle.trim() || !selectedProductId) {
            alert(isZh ? "请填写所有字段" : "Please fill in all fields");
            return;
        }

        const product = products.find(p => p.id === selectedProductId);
        if (!product) return;

        const fallbackName = currentUser?.name || currentUser?.email?.split('@')[0] || (isZh ? '访客' : 'Guest');

        if (editingPostId) {
            const existing = posts.find(p => p.id === editingPostId);
            if (existing && onUpdatePost) {
                const updated: CommunityPost = {
                    ...existing,
                    productId: product.id,
                    productName: product.name,
                    productImage: product.imageUrl,
                    rating: draftRating,
                    title: draftTitle,
                    content: draftContent,
                };
                onUpdatePost(updated);
            }
        } else {
            const newPost: CommunityPost = {
                id: Date.now().toString(),
                userId: currentUser?.id ?? 'guest',
                userName: fallbackName,
                userAvatar: undefined,
                productId: product.id,
                productName: product.name,
                productImage: product.imageUrl,
                rating: draftRating,
                title: draftTitle,
                content: draftContent,
                images: [],
                createdAt: new Date().toLocaleDateString(),
                helpfulCount: 0,
                isVerifiedPurchase: true
            };

            if (onAddPost) {
                onAddPost(newPost);
                if (selectedFilter !== 'all' && selectedFilter !== product.id) {
                    setSelectedFilter('all');
                }
            }
        }

        setShowComposer(false);
        setSelectedProductId('');
        setDraftTitle('');
        setDraftContent('');
        setDraftRating(5);
        setEditingPostId(null);
    };

    const resetComposer = () => {
        setShowComposer(false);
        setSelectedProductId('');
        setDraftTitle('');
        setDraftContent('');
        setDraftRating(5);
        setEditingPostId(null);
    };

    // Full Page Composer View
    if (showComposer) {
        return (
            <div className={clsx(
                "min-h-screen transition-colors duration-300",
                isDark ? "bg-black text-white" : "bg-[#f5f5f7] text-black"
            )}>
                {/* Header */}
                <div className={clsx(
                    "sticky top-14 z-50 border-b backdrop-blur-xl",
                    isDark ? "bg-black/80 border-white/10" : "bg-white/80 border-black/10"
                )}>
                    <div className="max-w-3xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
                        <button
                            type="button"
                            onClick={resetComposer}
                            className={clsx(
                                "relative z-20 flex items-center gap-2 text-sm font-medium transition-colors",
                                isDark ? "text-white/70 hover:text-white" : "text-black/70 hover:text-black"
                            )}
                            aria-label={isZh ? '返回社区' : 'Back to Community'}
                        >
                            <ArrowLeft size={20} />
                            <span className="hidden sm:inline">{isZh ? '返回社区' : 'Back to Community'}</span>
                        </button>
                        
                        <h1 className="text-lg font-semibold">
                            {editingPostId 
                                ? (isZh ? '编辑帖子' : 'Edit Post')
                                : (isZh ? '发布新帖' : 'New Post')
                            }
                        </h1>
                        
                        <button
                            onClick={handleSubmitDraft}
                            disabled={!draftContent.trim() || !draftTitle.trim() || !selectedProductId}
                            className={clsx(
                                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all",
                                (!draftContent.trim() || !draftTitle.trim() || !selectedProductId)
                                    ? (isDark ? "bg-white/10 text-white/30 cursor-not-allowed" : "bg-black/10 text-black/30 cursor-not-allowed")
                                    : (isDark ? "bg-white text-black hover:scale-105" : "bg-black text-white hover:scale-105")
                            )}
                        >
                            <Send size={16} />
                            <span>{isZh ? '发布' : 'Post'}</span>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 space-y-8">
                    {/* Product Selection */}
                    <div className="space-y-3">
                        <label className={clsx(
                            "text-sm font-medium",
                            isDark ? "text-white/70" : "text-black/70"
                        )}>
                            {isZh ? '选择产品 *' : 'Select Product *'}
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {products.slice(0, 12).map(product => (
                                <button
                                    key={product.id}
                                    type="button"
                                    onClick={() => setSelectedProductId(product.id)}
                                    className={clsx(
                                        "p-3 rounded-2xl border text-left transition-all",
                                        selectedProductId === product.id
                                            ? (isDark 
                                                ? "border-white bg-white/10 ring-2 ring-white/50" 
                                                : "border-black bg-black/5 ring-2 ring-black/50")
                                            : (isDark 
                                                ? "border-white/10 bg-white/5 hover:border-white/30" 
                                                : "border-black/10 bg-white hover:border-black/30")
                                    )}
                                >
                                    <img 
                                        src={product.imageUrl} 
                                        alt={product.name}
                                        className="w-full aspect-square object-cover rounded-xl mb-2"
                                    />
                                    <p className="text-xs font-medium line-clamp-2">{product.name}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Rating */}
                    <div className="space-y-3">
                        <label className={clsx(
                            "text-sm font-medium",
                            isDark ? "text-white/70" : "text-black/70"
                        )}>
                            {isZh ? '评分 *' : 'Rating *'}
                        </label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map(num => (
                                <button
                                    key={num}
                                    type="button"
                                    onClick={() => setDraftRating(num)}
                                    className={clsx(
                                        "w-12 h-12 rounded-xl border flex items-center justify-center transition-all text-lg",
                                        draftRating >= num
                                            ? "bg-yellow-400 text-black border-yellow-400 shadow-lg shadow-yellow-400/30"
                                            : (isDark ? "border-white/20 text-white/40 hover:border-white/40" : "border-black/20 text-black/40 hover:border-black/40")
                                    )}
                                >
                                    <Star size={20} fill={draftRating >= num ? "currentColor" : "none"} />
                                </button>
                            ))}
                            <span className={clsx(
                                "ml-3 flex items-center text-sm",
                                isDark ? "text-white/50" : "text-black/50"
                            )}>
                                {draftRating === 5 ? (isZh ? '非常满意' : 'Excellent') :
                                 draftRating === 4 ? (isZh ? '满意' : 'Good') :
                                 draftRating === 3 ? (isZh ? '一般' : 'Average') :
                                 draftRating === 2 ? (isZh ? '不满意' : 'Poor') :
                                 (isZh ? '非常不满意' : 'Very Poor')}
                            </span>
                        </div>
                    </div>

                    {/* Title */}
                    <div className="space-y-3">
                        <label className={clsx(
                            "text-sm font-medium",
                            isDark ? "text-white/70" : "text-black/70"
                        )}>
                            {isZh ? '标题 *' : 'Title *'}
                        </label>
                        <input
                            type="text"
                            value={draftTitle}
                            onChange={e => setDraftTitle(e.target.value)}
                            className={clsx(
                                "w-full border rounded-2xl px-5 py-4 text-lg focus:outline-none transition-colors",
                                isDark 
                                    ? "bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/40" 
                                    : "bg-white border-black/10 text-black placeholder:text-black/30 focus:border-black/40"
                            )}
                            placeholder={isZh ? "用一句话概括你的体验..." : "Summarize your experience..."}
                        />
                    </div>

                    {/* Content */}
                    <div className="space-y-3">
                        <label className={clsx(
                            "text-sm font-medium",
                            isDark ? "text-white/70" : "text-black/70"
                        )}>
                            {isZh ? '详细内容 *' : 'Content *'}
                        </label>
                        <textarea
                            value={draftContent}
                            onChange={e => setDraftContent(e.target.value)}
                            rows={8}
                            className={clsx(
                                "w-full border rounded-2xl px-5 py-4 focus:outline-none transition-colors resize-none",
                                isDark 
                                    ? "bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/40" 
                                    : "bg-white border-black/10 text-black placeholder:text-black/30 focus:border-black/40"
                            )}
                            placeholder={isZh 
                                ? "分享你的使用体验、优缺点、购买建议等..." 
                                : "Share your experience, pros & cons, buying advice..."}
                        />
                        <p className={clsx(
                            "text-xs text-right",
                            isDark ? "text-white/30" : "text-black/30"
                        )}>
                            {draftContent.length} {isZh ? '字' : 'characters'}
                        </p>
                    </div>

                    {/* Image Upload Placeholder */}
                    <div className="space-y-3">
                        <label className={clsx(
                            "text-sm font-medium",
                            isDark ? "text-white/70" : "text-black/70"
                        )}>
                            {isZh ? '添加图片（可选）' : 'Add Images (Optional)'}
                        </label>
                        <div className={clsx(
                            "border-2 border-dashed rounded-2xl p-8 text-center transition-colors cursor-pointer hover:border-opacity-50",
                            isDark ? "border-white/20 hover:bg-white/5" : "border-black/20 hover:bg-black/5"
                        )}>
                            <Image size={32} className={clsx("mx-auto mb-3", isDark ? "text-white/30" : "text-black/30")} />
                            <p className={clsx("text-sm", isDark ? "text-white/50" : "text-black/50")}>
                                {isZh ? '点击上传或拖拽图片到此处' : 'Click to upload or drag images here'}
                            </p>
                            <p className={clsx("text-xs mt-1", isDark ? "text-white/30" : "text-black/30")}>
                                {isZh ? '支持 JPG、PNG，最多 9 张' : 'JPG, PNG supported, max 9 images'}
                            </p>
                        </div>
                    </div>

                    {/* Tips */}
                    <div className={clsx(
                        "p-5 rounded-2xl border",
                        isDark ? "bg-white/5 border-white/10" : "bg-yellow-50 border-yellow-200"
                    )}>
                        <p className={clsx(
                            "text-sm font-medium mb-2",
                            isDark ? "text-white" : "text-yellow-800"
                        )}>
                            {isZh ? '💡 发帖小贴士' : '💡 Posting Tips'}
                        </p>
                        <ul className={clsx(
                            "text-xs space-y-1",
                            isDark ? "text-white/60" : "text-yellow-700"
                        )}>
                            <li>• {isZh ? '详细描述你的使用场景和体验' : 'Describe your use case and experience in detail'}</li>
                            <li>• {isZh ? '客观评价产品的优缺点' : 'Objectively evaluate pros and cons'}</li>
                            <li>• {isZh ? '附上实拍图片更有说服力' : 'Real photos make your review more convincing'}</li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

    // Main Community View
    return (
        <>
        <div className={clsx(
            "min-h-screen transition-colors duration-300 pb-24",
            isDark ? "bg-black text-white" : "bg-[#f5f5f7] text-black"
        )}>
            {/* Speckled Background Pattern */}
            <div 
                className="fixed inset-0 pointer-events-none z-0 opacity-[0.15]" 
                style={{
                    backgroundImage: `radial-gradient(${isDark ? '#ffffff' : '#000000'} 1px, transparent 1px)`,
                    backgroundSize: '24px 24px'
                }}
            />

            {/* Hero Section */}
            <div className="relative z-10 pt-12 md:pt-20 pb-12 md:pb-16 px-6 border-b border-black/5 dark:border-white/5">
                <div className="max-w-5xl mx-auto text-center">
                    <h1 className={clsx(
                        "text-3xl md:text-5xl lg:text-7xl font-light tracking-tight mb-6 md:mb-8 leading-[1.15] md:leading-[1.1]",
                        isDark ? "text-white" : "text-black"
                    )}
                    style={{
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif',
                        fontWeight: 300,
                        letterSpacing: '-0.02em'
                    }}
                    >
                        {t('community_hero_title')}
                    </h1>
                    
                    <button className={clsx(
                        "px-6 md:px-8 py-3 md:py-4 rounded-full text-sm md:text-base font-light transition-all hover:scale-105 mb-12 md:mb-20",
                        isDark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"
                    )}
                    style={{
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif',
                        fontWeight: 300
                    }}
                    >
                        {t('community_rules_btn')}
                    </button>
                    
                    {/* 社区公约 Modal */}
                    {showGuidelines && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowGuidelines(false)}>
                            <div 
                                className={clsx(
                                    "w-full max-w-lg rounded-2xl p-6 max-h-[80vh] overflow-y-auto",
                                    isDark ? "bg-[#1a1a1a] border border-white/10" : "bg-white shadow-2xl"
                                )}
                                onClick={e => e.stopPropagation()}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold">{isZh ? '📜 社区公约' : '📜 Community Guidelines'}</h2>
                                    <button onClick={() => setShowGuidelines(false)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10">
                                        <X size={20} />
                                    </button>
                                </div>
                                <div className="space-y-4 text-sm">
                                    {[
                                        { icon: '🤝', title: isZh ? '尊重他人' : 'Respect Others', desc: isZh ? '保持友善、专业的交流态度，禁止人身攻击和歧视性言论' : 'Be kind and professional. No personal attacks or discrimination.' },
                                        { icon: '✅', title: isZh ? '真实评测' : 'Authentic Reviews', desc: isZh ? '分享真实的产品体验，标注是否为赞助或获赠产品' : 'Share genuine experiences. Disclose sponsored or gifted products.' },
                                        { icon: '🔒', title: isZh ? '保护隐私' : 'Protect Privacy', desc: isZh ? '不发布他人个人信息，尊重创作者和用户的隐私权' : 'Do not share others personal info. Respect privacy.' },
                                        { icon: '🚫', title: isZh ? '禁止广告' : 'No Spam', desc: isZh ? '禁止未经授权的商业推广、垃圾信息和重复发帖' : 'No unauthorized promotions, spam, or duplicate posts.' },
                                        { icon: '⚖️', title: isZh ? '版权合规' : 'Respect Copyright', desc: isZh ? '尊重原创内容，转载需注明出处并获得授权' : 'Credit original content. Get permission for reposts.' },
                                        { icon: '🛡️', title: isZh ? '安全第一' : 'Safety First', desc: isZh ? '不分享危险的改装方法或可能损害设备的操作' : 'Do not share dangerous mods or harmful procedures.' },
                                    ].map((rule, i) => (
                                        <div key={i} className={clsx("p-3 rounded-xl", isDark ? "bg-white/5" : "bg-gray-50")}>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span>{rule.icon}</span>
                                                <h4 className="font-medium">{rule.title}</h4>
                                            </div>
                                            <p className={isDark ? "text-gray-400" : "text-gray-600"}>{rule.desc}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-white/10 text-center">
                                    <p className={clsx("text-xs mb-3", isDark ? "text-gray-400" : "text-gray-500")}>
                                        {isZh ? '违反社区公约可能导致内容删除或账号限制' : 'Violations may result in content removal or account restrictions'}
                                    </p>
                                    <button 
                                        onClick={() => setShowGuidelines(false)}
                                        className="px-6 py-2 rounded-full bg-black text-white dark:bg-white dark:text-black text-sm font-medium"
                                    >
                                        {isZh ? '我已了解' : 'I Understand'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Resource Cards */}
                    <div className="grid md:grid-cols-1 max-w-xl gap-3 md:gap-4 text-left">
                        <div 
                            onClick={() => navigate('/trending')}
                            className={clsx(
                                "p-4 md:p-5 rounded-xl md:rounded-2xl transition-all hover:-translate-y-0.5 group cursor-pointer",
                                isDark ? "bg-[#1c1c1e] hover:bg-[#2c2c2e]" : "bg-white hover:shadow-lg shadow-sm"
                            )}
                        >
                            <div className="flex items-start gap-3 mb-3">
                                <div className={clsx(
                                    "w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0",
                                    isDark ? "bg-[#2c2c2e]" : "bg-[#f5f5f7]"
                                )}>
                                    <Zap size={18} className={clsx("md:w-5 md:h-5", isDark ? "text-white" : "text-black")} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-base md:text-lg font-light mb-1">{t('community_card_trending_title')}</h3>
                                    <p className={clsx("text-xs md:text-sm leading-relaxed mb-3", isDark ? "text-gray-400" : "text-gray-500")}>
                                        {t('community_card_trending_desc')}
                                    </p>
                                    <div className="flex items-center gap-1.5 text-xs md:text-sm font-light">
                                        {t('community_card_explore')} <ExternalLink size={12} className="md:w-3.5 md:h-3.5" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 space-y-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">{t('community_title')}</h2>
                        <p className={isDark ? "text-gray-400" : "text-gray-600"}>{t('community_subtitle')}</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setSelectedFilter('all')}
                            className={clsx(
                                "px-4 py-2 rounded-full text-sm font-medium border transition-all",
                                selectedFilter === 'all'
                                    ? (isDark ? "bg-white text-black border-white" : "bg-black text-white border-black")
                                    : (isDark ? "border-white/10 text-white/70 hover:border-white/40" : "border-black/10 text-black/70 hover:border-black/40")
                            )}
                        >
                            {t('filter_all')}
                        </button>
                        {uniqueProducts.map(product => (
                            <button
                                key={product.id}
                                onClick={() => setSelectedFilter(product.id)}
                                className={clsx(
                                    "px-4 py-2 rounded-full text-sm font-medium border transition-all",
                                    selectedFilter === product.id
                                        ? (isDark ? "bg-white text-black border-white" : "bg-black text-white border-black")
                                        : (isDark ? "border-white/10 text-white/70 hover:border-white/40" : "border-black/10 text-black/70 hover:border-black/40")
                                )}
                            >
                                {product.name}
                            </button>
                        ))}
                    </div>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4">
                    {heroStats.map(stat => (
                        <div key={stat.label} className={clsx(
                            "p-4 rounded-2xl border",
                            isDark ? "border-white/10 bg-white/[0.03]" : "border-black/10 bg-white shadow-sm"
                        )}>
                            <p className={clsx("text-xs uppercase mb-2", isZh ? "tracking-normal" : "tracking-[0.3em]", isDark ? "text-white/40" : "text-black/40")}>{stat.label}</p>
                            <p className="text-4xl font-semibold tracking-tight">{stat.value}</p>
                        </div>
                    ))}
                    <div className="flex items-center justify-end">
                        <SyncStatusIndicator 
                            status={syncStatus} 
                            lastSynced={lastSynced || undefined}
                            lang={lang as 'zh' | 'en'}
                        />
                    </div>
                </div>

                {spotlightPost && (
                    <div className={clsx(
                        "rounded-[30px] border p-8 relative overflow-hidden",
                        isDark 
                            ? "border-white/10 bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-transparent" 
                            : "border-black/10 bg-white shadow-lg"
                    )}>
                        <div className="absolute inset-0 pointer-events-none opacity-20" style={{ background: `radial-gradient(circle at top left, ${isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.1)'}, transparent 60%)` }} />
                        <div className="relative flex flex-col md:flex-row gap-8 items-start">
                            <div className="flex-1">
                                <p className={clsx("text-xs uppercase mb-4", isZh ? "tracking-normal" : "tracking-[0.4em]", isDark ? "text-white/60" : "text-black/60")}>{t('community_spotlight')}</p>
                                <h2 className={clsx("text-3xl font-semibold mb-4 leading-tight", isDark ? "text-white" : "text-black")}>{spotlightPost.title}</h2>
                                <p className={clsx("text-lg leading-relaxed mb-6", isDark ? "text-white/70" : "text-black/70")}>{spotlightPost.content}</p>
                                <div className="flex items-center gap-3">
                                    <span className="font-medium">{spotlightPost.userName}</span>
                                    {spotlightPost.isVerifiedPurchase && (
                                        <span className={clsx("text-xs border px-3 py-1 rounded-full", isDark ? "bg-white/10 border-white/20 text-white" : "bg-black/5 border-black/10 text-black")}>
                                            ✓ {t('verified')}
                                        </span>
                                    )}
                                    {renderRating(spotlightPost.rating)}
                                </div>
                            </div>
                            <div
                                onClick={() => {
                                    const product = products.find(p => p.id === spotlightPost.productId);
                                    if (product && onViewProduct) onViewProduct(product);
                                }}
                                className={clsx(
                                    "w-full md:w-60 border rounded-2xl p-4 flex flex-col gap-3 cursor-pointer transition-colors",
                                    isDark ? "bg-black/30 border-white/10 hover:border-white/40" : "bg-gray-50 border-black/10 hover:border-black/30"
                                )}
                            >
                                <img src={spotlightPost.productImage} alt={spotlightPost.productName} className="w-full aspect-square object-cover rounded-xl" />
                                <div>
                                    <p className={clsx("text-xs uppercase mb-1", isZh ? "tracking-normal" : "tracking-[0.3em]", isDark ? "text-white/40" : "text-black/40")}>{t('community_spotlight_product')}</p>
                                    <p className="font-semibold">{spotlightPost.productName}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {filteredPosts.length === 0 ? (
                    <div className={clsx("text-center py-24 border border-dashed rounded-3xl", isDark ? "border-white/20" : "border-black/20")}>
                        <p className="text-xl font-semibold mb-3">{t('no_posts')}</p>
                        <p className={isDark ? "text-white/50" : "text-black/50"}>{t('community_empty_state')}</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                        {filteredPosts.map((post, index) => (
                            <div
                                key={post.id}
                                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                                style={{
                                    animationDelay: `${index * 100}ms`,
                                    animationFillMode: 'backwards',
                                }}
                            >
                                <PostCard
                                    post={post}
                                    t={t}
                                    products={products}
                                    onViewProduct={onViewProduct}
                                    onUpdatePost={onUpdatePost}
                                    onDeletePost={onDeletePost}
                                    currentUser={currentUser}
                                    isDark={isDark}
                                    isZh={isZh}
                                    setEditingPostId={setEditingPostId}
                                    setShowComposer={setShowComposer}
                                    setSelectedProductId={setSelectedProductId}
                                    setDraftTitle={setDraftTitle}
                                    setDraftContent={setDraftContent}
                                    setDraftRating={setDraftRating}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>

        {/* FAB rendered via Portal - always fixed to screen */}
        <FloatingActionButton onClick={() => setShowComposer(true)} isDark={isDark} />
        </>
    );
};
