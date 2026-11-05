import { LocalizedProductDefinition, Language, Product, LocalizedNewsDefinition, NewsItem, LocalizedKeynoteDefinition, KeynoteItem } from './types';

export const toProduct = (def: LocalizedProductDefinition, lang: Language): Product => {
    // 中文模式始终使用中文名，若缺失则回退英文
    const displayName = lang === 'zh'
        ? (def.locales.zh?.name || def.locales.en.name)
        : (def.locales[lang]?.name || def.locales.en?.name || 'Unknown Product');

    const localeData = def.locales[lang] || def.locales.en || {};
    
    return {
        id: def.id,
        name: displayName || 'Unknown Product',
        brand: localeData.brand || 'Unknown Brand',
        category: localeData.category || 'Uncategorized',
        priceEstimate: localeData.priceEstimate || 'N/A',
        imageUrl: def.imageUrl || '',
        description: localeData.description || '',
        launchDate: def.launchDate || new Date().toISOString().split('T')[0],
        buyingChannel: localeData.buyingChannel || '',
        isClassic: def.isClassic || false,
        tags: localeData.tags || [],
        detail: localeData.detail || {
            gallery: [],
            highlights: [],
            specs: []
        },
        stage: def.stage,
        fundingStatus: def.fundingStatus,
        survivalRate: def.survivalRate,
        riskLevel: def.riskLevel,
        verdict: localeData.verdict,
        localizedDescription: localeData.localizedDescription,
        features: localeData.features, // New mapping
        userReviews: localeData.userReviews, // New mapping
        chinaAdaptability: def.chinaAdaptability,
        purchaseChannels: def.purchaseChannels,
        // Milestone fields
        inventor: localeData.inventor,
        originalPrice: localeData.originalPrice,
        legacyImpact: localeData.legacyImpact,
        historicalNews: localeData.historicalNews,
        // Enhanced Product Information Fields
        productivity: localeData.productivity,
        targetAudience: localeData.targetAudience,
        aivaReview: localeData.aivaReview,
        localizationIntel: localeData.localizationIntel,
        tacticalAnalysis: localeData.tacticalAnalysis,
        userIntel: localeData.userIntel,
        coreFeatures: localeData.coreFeatures,
        notableHighlights: localeData.notableHighlights,
    };
};

export const toNews = (def: LocalizedNewsDefinition, lang: Language): NewsItem => {
    // Safety check: ensure all required fields exist
    if (!def || !def.locales || !def.locales[lang]) {
        console.error('Invalid news definition:', def);
        return {
            id: def?.id || 'unknown',
            category: 'Error',
            title: 'Invalid News Item',
            description: 'This news item has invalid data.',
            date: def?.date || new Date().toISOString().split('T')[0],
            imageUrl: def?.imageUrl || '',
            videoUrl: def?.videoUrl,
            tags: def?.tags || [],
            stage: def?.stage
        };
    }
    return {
        id: def.id,
        category: def.locales[lang].category,
        title: def.locales[lang].title,
        description: def.locales[lang].description,
        date: def.date,
        imageUrl: def.imageUrl,
        videoUrl: def.videoUrl,
        tags: def.tags,
        stage: def.stage
    };
};

export const toKeynote = (def: LocalizedKeynoteDefinition, lang: Language): KeynoteItem => ({
    id: def.id,
    title: def.locales[lang].title,
    description: def.locales[lang].description,
    date: def.releaseDate,
    timestamp: new Date(def.releaseDate).getTime(),
    videoUrl: def.videoUrl,
    thumbnailUrl: def.thumbnailUrl,
    products: def.products,
    speaker: def.locales[lang].speaker,
    stage: def.stage,
    preorderDeposit: def.preorderDeposit,
    preorderShipWindow: def.preorderShipWindow,
    preorderStatus: def.preorderStatus,
    preorderUrl: def.preorderUrl,
    preorderNote: def.locales[lang].preorderNote,
    preorderCta: def.locales[lang].preorderCta
});
