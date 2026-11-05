export interface ProductSpec {
    label: string;
    value: string;
}

export interface ProductDetail {
    gallery: string[];
    highlights: string[];
    shipping: string;
    warranty: string;
    specs: ProductSpec[];
    videoUrl?: string;
}

export type MakerStage = 'startup' | 'enterprise';
export type NewsStage = 'startup' | 'enterprise' | 'policy' | 'environment' | 'community';

export interface PurchaseChannel {
    name: string;
    price: string;
    currency: string;
    score: number; // AI评分 1-10
    pros: string[]; // 优势
    cons: string[]; // 劣势
    paymentMethods: string[]; // ['alipay', 'wechat', 'visa', 'paypal', 'crypto']
    shippingInfo: string; // 物流信息，e.g., "直邮/含税/3-5天"
    url: string;
    isOfficial: boolean; // 是否官方
}

export interface ChinaAdaptability {
    network: {
        score: number;
        description: string; // "需要科学上网" or "直连无碍"
        vpnRequired: boolean;
    };
    language: {
        score: number;
        description: string; // "原生中文" or "社区汉化" or "无中文"
        supportLevel: 'native' | 'community' | 'none';
    };
    warranty: {
        score: number;
        description: string; // "国内联保" or "寄回维修"
    };
    ecosystem: {
        score: number;
        description: string; // "接入米家" or "HomeKit"
        voltageCompatible: boolean; // 是否适配 220V
    };
}

export type ReleaseStatus = 'announced' | 'preorder' | 'released';
export type RadarStatus = 'rumor' | 'leak' | 'concept' | 'crowdfunding' | 'preorder';

// New: Source Trace Item
export interface SourceEvent {
    date: string;
    source: string; // e.g., "Ming-Chi Kuo", "Supply Chain", "Github Repo"
    type: 'leak' | 'patent' | 'official' | 'rumor';
    description: string;
}

export type AivaRiskLevel = 'Critical' | 'High' | 'Moderate' | 'Low' | 'Safe';

export interface UserReview {
    id: string;
    userName: string;
    userAvatar?: string;
    rating: number; // 1-5
    date: string;
    content: string;
    sentiment: 'positive' | 'neutral' | 'negative';
    tags?: string[]; // e.g. "Battery Life", "Design"
}

export interface Product {
    id: string;
    name: string;
    brand: string;
    country?: string; // 产品来源国家，如 'US', 'CN', 'JP', 'KR', 'EU' 等
    category: string;
    priceEstimate: string;
    imageUrl: string;
    description: string;
    launchDate: string;
    buyingChannel: string;
    isClassic: boolean;
    tags: string[];
    splineUrl?: string;
    glowColor?: string;
    detail?: ProductDetail;
    stage?: MakerStage;
    fundingStatus?: string;

    // New fields
    releaseStatus?: ReleaseStatus;
    releaseDate?: string; // e.g. "2024 Q4" or "2024-03-01"
    preOrderUrl?: string;
    localizedDescription?: {
        strategy: string;
        performance: string;
        painPoints: string;
    };
    purchaseChannels?: PurchaseChannel[];
    chinaAdaptability?: ChinaAdaptability;
    userReviews?: UserReview[]; // New: User Reviews
    features?: string[]; // New: Detailed Features list
    recommendScore?: number; // 0-100 推荐评分，用于决定卡片大小和突出显示

    // Radar / Intelligence Fields
    radarStatus?: RadarStatus;
    radarSource?: string;
    intelligenceAnalysis?: string;

    // CEO/CMO Strategic Additions
    confidenceScore?: number; // 0-100% likelihood for rumors
    disruptionScore?: number; // 1-10 impact on industry
    isInsiderOnly?: boolean; // Content locking for monetization
    sourceTrace?: SourceEvent[]; // The timeline of the leak

    // New Optimization: Survival & Risk
    survivalRate?: number; // 0-100, 本土化生存率
    riskLevel?: AivaRiskLevel; // 风险等级
    verdict?: string; // 一句话判词

    // Milestone / Legacy fields (for classic products)
    inventor?: string; // 发明者/创始人
    originalPrice?: string; // 发行价
    legacyImpact?: string; // 历史影响
    historicalNews?: {
        date: string;
        headline: string;
        source: string;
    }[];

    // Enhanced Product Information Fields
    productivity?: string; // 生产力应用场景
    targetAudience?: string; // 目标用户群体
    aivaReview?: string; // AIVA平台评价
    localizationIntel?: string; // 本土化特别情报
    tacticalAnalysis?: string; // 战术分析/购买建议
    userIntel?: string; // 用户反馈情报
    coreFeatures?: string[]; // 核心功能列表
    notableHighlights?: string[]; // 显著亮点
}

export interface ComparisonMetric {
    metric: string;
    [productName: string]: string | number;
}

export interface ComparisonResult {
    winner: string;
    summary: string;
    metrics: ComparisonMetric[];
    prosCons: {
        productName: string;
        pros: string[];
        cons: string[];
    }[];
    verdict: string;
    buyingGuide: {
        targetAudience: string;
        bestFor: string;
        localizedTip: string;
        recommendedPlatform: string;
    };
}

export interface ChatMessage {
    role: 'user' | 'ai';
    content: string;
    image?: string; // For image generation results in chat/studio
}

export enum AppView {
    HOME = 'HOME',
    KEYNOTE = 'KEYNOTE',
    PRODUCTS = 'PRODUCTS',
    LAB = 'LAB',
    FAVORITES = 'FAVORITES',
    COMMUNITY = 'COMMUNITY',
    LEGACY = 'LEGACY',
    COMPARE = 'COMPARE',
    CONTACT = 'CONTACT',
    PRODUCT_DETAIL = 'PRODUCT_DETAIL',
    NEWS_DETAIL = 'NEWS_DETAIL',
    PROFILE = 'PROFILE'
}

export type Language = 'en' | 'zh';

export type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9';

export interface NewsItem {
    id: string;
    category: string;
    title: string;
    description: string;
    date: string;
    imageUrl: string;
    videoUrl?: string;
    source?: string;
    readMoreUrl?: string;
    tags?: string[];
    stage?: NewsStage;
    isRadar?: boolean; // If true, show in Radar Stream
    recommendScore?: number; // 0-100 推荐评分，用于决定卡片大小
}

export interface KeynoteItem {
    id: string;
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
    date: string;
    speaker: string;
    products: string[]; // IDs of related products (prelaunch concepts)
    timestamp: number;
    stage?: MakerStage;
    preorderDeposit: string;
    preorderShipWindow: string;
    preorderStatus: string;
    preorderUrl: string;
    preorderNote: string;
    preorderCta: string;
}

export interface CommunityPost {
    id: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    productId: string;
    productName: string;
    productImage: string;
    rating: number; // 1-5
    title: string;
    content: string;
    images?: string[];
    createdAt: string;
    helpfulCount: number;
    isVerifiedPurchase: boolean;
}

export interface UserProfile {
    id: string;
    email: string;
    name?: string;
    avatarUrl?: string;
    bio?: string;
}

// --- Data Entry Types ---

export type LocaleContent<T = string> = Record<Language, T>;

export interface LocalizedProductDefinition {
    id: string;
    locales: LocaleContent<{
        name: string;
        brand: string;
        category: string;
        priceEstimate: string;
        description: string;
        buyingChannel: string;
        tags: string[];
        detail: ProductDetail;
        verdict?: string; // AI一句话判词
        localizedDescription?: { // New: Human language description
            strategy: string;
            performance: string;
            painPoints: string;
        };
        features?: string[]; // New: Detailed features
        userReviews?: UserReview[]; // New: User reviews
        // Milestone/Legacy fields
        inventor?: string;
        originalPrice?: string;
        legacyImpact?: string;
        historicalNews?: { date: string; headline: string; source: string; }[];
        // Enhanced Product Information Fields
        productivity?: string; // 生产力应用场景
        targetAudience?: string; // 目标用户群体
        aivaReview?: string; // AIVA平台评价
        localizationIntel?: string; // 本土化特别情报
        tacticalAnalysis?: string; // 战术分析/购买建议
        userIntel?: string; // 用户反馈情报
        coreFeatures?: string[]; // 核心功能列表
        notableHighlights?: string[]; // 显著亮点
    }>;
    imageUrl: string;
    launchDate: string;
    isClassic?: boolean;
    stage?: MakerStage;
    fundingStatus?: string;
    survivalRate?: number; // 0-100
    riskLevel?: 'Critical' | 'High' | 'Moderate' | 'Low' | 'Safe';
    chinaAdaptability?: ChinaAdaptability; // New: China specific specs
    purchaseChannels?: PurchaseChannel[]; // New: Purchase channels
}

export interface LocalizedNewsDefinition {
    id: string;
    locales: LocaleContent<{
        title: string;
        description: string;
        category: string;
        stage?: NewsStage; // Added to match usage in data.ts if needed, or check if it's top level
    }>;
    date: string;
    imageUrl: string;
    videoUrl?: string;
    stage?: NewsStage;
    tags?: string[];
}

export interface LocalizedKeynoteDefinition {
    id: string;
    releaseDate: string;
    videoUrl: string;
    thumbnailUrl: string;
    products: string[];
    stage?: MakerStage;
    preorderDeposit: string;
    preorderShipWindow: string;
    preorderStatus: string;
    preorderUrl: string;
    locales: LocaleContent<{
        title: string;
        description: string;
        speaker: string;
        preorderNote: string;
        preorderCta: string;
    }>;
}
