import { CommunityPost, Language } from './types';

type LocalizedCommunityPost = Omit<CommunityPost, 'userName' | 'productName' | 'title' | 'content'> & {
    locales: {
        en: Pick<CommunityPost, 'userName' | 'productName' | 'title' | 'content'>;
        zh: Pick<CommunityPost, 'userName' | 'productName' | 'title' | 'content'>;
    };
};

const COMMUNITY_POST_LIBRARY: LocalizedCommunityPost[] = [
    {
        id: "c1",
        userId: "u_wei",
        userAvatar: "https://picsum.photos/seed/u1/200",
        productId: "p_rabbit_r1",
        productImage: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=200&q=80",
        rating: 4,
        createdAt: "2025-11-20",
        helpfulCount: 120,
        isVerifiedPurchase: true,
        locales: {
            en: {
                userName: "Wei Zhang",
                productName: "Rabbit R1",
                title: "Camera rotation is satisfying",
                content: "The Rabbit R1 camera rotation is so satisfying. I use it for receipt scanning. It's not perfect but it's fun.",
            },
            zh: {
                userName: "张伟",
                productName: "Rabbit R1",
                title: "镜头旋转效果令人满意",
                content: "Rabbit R1 的摄像头旋转功能真是太棒了。我用它来扫描收据，虽然它并不完美，但用起来很有趣。",
            },
        },
    },
    {
        id: "c2",
        userId: "u_sarah",
        userAvatar: "https://picsum.photos/seed/u2/200",
        productId: "p_friend",
        productImage: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=200&q=80",
        rating: 5,
        createdAt: "2025-11-18",
        helpfulCount: 85,
        isVerifiedPurchase: true,
        locales: {
            en: {
                userName: "Sarah J.",
                productName: "Friend",
                title: "A genuine connection",
                content: "Friend pendant actually helped me remember a promise I made to my mom. Wild how it captures context.",
            },
            zh: {
                userName: "Sarah J.",
                productName: "Friend",
                title: "真的有连接感",
                content: "Friend 吊坠居然帮我记得对妈妈做过的承诺。它捕捉语境的能力挺神奇。",
            },
        },
    },
    {
        id: "c3",
        userId: "u_mike",
        userAvatar: "https://picsum.photos/seed/u3/200",
        productId: "p_humane_pin",
        productImage: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=200&q=80",
        rating: 3,
        createdAt: "2025-11-15",
        helpfulCount: 45,
        isVerifiedPurchase: true,
        locales: {
            en: {
                userName: "Mike Chen",
                productName: "Ai Pin",
                title: "Cool concept, needs work",
                content: "The projection is futuristic but hard to see in daylight. Voice recognition is top tier though.",
            },
            zh: {
                userName: "Mike Chen",
                productName: "Ai Pin",
                title: "概念很酷，完成度待提升",
                content: "投影很有未来感，但白天不好看清。语音识别倒是一流。",
            },
        },
    },
];

/** @deprecated Prefer getCommunityPosts(lang). Kept for compatibility. */
export const COMMUNITY_POSTS: CommunityPost[] = COMMUNITY_POST_LIBRARY.map((post) => ({
    id: post.id,
    userId: post.userId,
    userName: post.locales.en.userName,
    userAvatar: post.userAvatar,
    productId: post.productId,
    productName: post.locales.en.productName,
    productImage: post.productImage,
    rating: post.rating,
    title: post.locales.en.title,
    content: post.locales.en.content,
    createdAt: post.createdAt,
    helpfulCount: post.helpfulCount,
    isVerifiedPurchase: post.isVerifiedPurchase,
}));

export const getLocalizedCommunityPosts = (lang: Language): CommunityPost[] =>
    COMMUNITY_POST_LIBRARY.map((post) => {
        const locale = post.locales[lang] || post.locales.en;
        return {
            id: post.id,
            userId: post.userId,
            userName: locale.userName,
            userAvatar: post.userAvatar,
            productId: post.productId,
            productName: locale.productName,
            productImage: post.productImage,
            rating: post.rating,
            title: locale.title,
            content: locale.content,
            createdAt: post.createdAt,
            helpfulCount: post.helpfulCount,
            isVerifiedPurchase: post.isVerifiedPurchase,
        };
    });
