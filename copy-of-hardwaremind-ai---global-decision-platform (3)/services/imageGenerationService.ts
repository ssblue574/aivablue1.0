import { generateAIImage } from './geminiService';
import { Product, AspectRatio } from '../data';

// 图片缓存：避免重复生成
const imageCache = new Map<string, string>();

/**
 * 为产品生成3D实体图的提示词 - 确保百分百对应产品特征
 */
const generateProductPrompt = (product: Product): string => {
    const { name, brand, category, description, detail, features, tags, localizedDescription } = product;
    
    // 收集所有产品特征信息
    const productFeatures: string[] = [];
    
    // 1. 基本信息
    productFeatures.push(`${brand} ${name}`);
    productFeatures.push(`Category: ${category}`);
    
    // 2. 详细描述
    if (localizedDescription?.strategy) {
        productFeatures.push(`Product concept: ${localizedDescription.strategy}`);
    }
    if (description) {
        productFeatures.push(`Description: ${description}`);
    }
    
    // 3. 核心功能特点
    if (features && features.length > 0) {
        productFeatures.push(`Key features: ${features.slice(0, 5).join(', ')}`);
    }
    
    // 4. 产品亮点
    if (detail?.highlights && detail.highlights.length > 0) {
        productFeatures.push(`Highlights: ${detail.highlights.slice(0, 3).join(', ')}`);
    }
    
    // 5. 技术规格（用于确定产品外观特征）
    if (detail?.specs && detail.specs.length > 0) {
        const relevantSpecs = detail.specs
            .filter(spec => 
                spec.label.toLowerCase().includes('display') ||
                spec.label.toLowerCase().includes('screen') ||
                spec.label.toLowerCase().includes('size') ||
                spec.label.toLowerCase().includes('dimension') ||
                spec.label.toLowerCase().includes('weight') ||
                spec.label.toLowerCase().includes('color') ||
                spec.label.toLowerCase().includes('material') ||
                spec.label.toLowerCase().includes('camera') ||
                spec.label.toLowerCase().includes('sensor')
            )
            .map(spec => `${spec.label}: ${spec.value}`)
            .slice(0, 5);
        
        if (relevantSpecs.length > 0) {
            productFeatures.push(`Technical specs: ${relevantSpecs.join(', ')}`);
        }
    }
    
    // 6. 标签（用于确定产品风格）
    if (tags && tags.length > 0) {
        productFeatures.push(`Tags: ${tags.join(', ')}`);
    }
    
    // 提取关键视觉特征
    const visualFeatures: string[] = [];
    
    // 从描述中提取视觉关键词
    const fullDescription = [
        description,
        localizedDescription?.strategy,
        localizedDescription?.performance,
        ...(features || []).slice(0, 3)
    ].filter(Boolean).join(' ').toLowerCase();
    
    // 检测产品类型特征
    if (fullDescription.includes('camera') || fullDescription.includes('vision') || fullDescription.includes('sensor')) {
        visualFeatures.push('visible camera lens or sensor');
    }
    if (fullDescription.includes('screen') || fullDescription.includes('display') || fullDescription.includes('touchscreen')) {
        visualFeatures.push('visible screen or display');
    }
    if (fullDescription.includes('button') || fullDescription.includes('control')) {
        visualFeatures.push('visible control buttons');
    }
    if (fullDescription.includes('port') || fullDescription.includes('usb') || fullDescription.includes('connector')) {
        visualFeatures.push('visible ports or connectors');
    }
    if (fullDescription.includes('led') || fullDescription.includes('light') || fullDescription.includes('indicator')) {
        visualFeatures.push('LED indicators or status lights');
    }
    if (fullDescription.includes('wearable') || fullDescription.includes('pendant') || fullDescription.includes('badge')) {
        visualFeatures.push('wearable device form factor');
    }
    if (fullDescription.includes('handheld') || fullDescription.includes('portable')) {
        visualFeatures.push('handheld portable device');
    }
    
    // 从规格中提取尺寸信息
    const sizeInfo = detail?.specs?.find(spec => 
        spec.label.toLowerCase().includes('size') || 
        spec.label.toLowerCase().includes('dimension') ||
        spec.label.toLowerCase().includes('weight')
    );
    
    // 构建详细的提示词
    const prompt = `Create a highly accurate, photorealistic 3D product render of the ${brand} ${name}.

PRODUCT IDENTIFICATION (MUST MATCH EXACTLY):
- Brand: ${brand}
- Product Name: ${name}
- Category: ${category}
${productFeatures.length > 0 ? `- Product Details: ${productFeatures.join(' | ')}` : ''}
${sizeInfo ? `- Size/Dimensions: ${sizeInfo.value}` : ''}

VISUAL ACCURACY REQUIREMENTS:
- The rendered product MUST be an exact visual match to the actual ${brand} ${name}
- Show all distinctive design elements, logos, branding, and physical features
${visualFeatures.length > 0 ? `- Must include: ${visualFeatures.join(', ')}` : ''}
- Accurate proportions, size ratios, and form factor
- Correct color scheme matching the brand identity
- Realistic material textures (metal, plastic, glass, fabric, etc.)
- Precise button placement, port locations, screen positions
- Authentic brand logo placement and styling

PHOTOGRAPHY STYLE:
- Professional product photography
- Clean white or neutral gray background
- Studio lighting with soft, even illumination
- Subtle shadows for depth
- Product centered in frame
- Slight 3/4 angle view (showing front and side)
- High resolution, sharp focus
- E-commerce product listing quality

CRITICAL INSTRUCTIONS:
1. The image must be 100% accurate to the actual ${brand} ${name} product
2. Every visible detail must match the product description and specifications
3. Do not add fictional features or elements not mentioned
4. Maintain brand consistency and design language
5. Ensure the product looks authentic and recognizable as the real ${brand} ${name}`;
    
    return prompt.trim();
};

/**
 * 生成产品图片URL（使用缓存）
 */
export const generateProductImage = async (product: Product): Promise<string> => {
    // 检查缓存
    const cacheKey = `product_${product.id}`;
    if (imageCache.has(cacheKey)) {
        return imageCache.get(cacheKey)!;
    }

    // 如果已有图片URL且不是占位符，直接返回
    if (product.imageUrl && 
        !product.imageUrl.includes('unsplash.com') && 
        !product.imageUrl.includes('picsum.photos') &&
        !product.imageUrl.startsWith('data:image')) {
        imageCache.set(cacheKey, product.imageUrl);
        return product.imageUrl;
    }

    try {
        // 生成提示词
        const prompt = generateProductPrompt(product);
        
        // 调用AI生成图片（使用1:1比例，适合产品图）
        const base64Image = await generateAIImage(prompt, '1:1');
        
        if (base64Image) {
            // 缓存base64图片
            imageCache.set(cacheKey, base64Image);
            return base64Image;
        }
    } catch (error) {
        console.error(`Failed to generate image for product ${product.id}:`, error);
    }

    // 如果生成失败，返回占位符或原有URL
    return product.imageUrl || `https://via.placeholder.com/800x800?text=${encodeURIComponent(product.name)}`;
};

/**
 * 批量生成产品图片（带进度回调）
 */
export const generateProductImagesBatch = async (
    products: Product[],
    onProgress?: (current: number, total: number) => void
): Promise<Product[]> => {
    const results: Product[] = [];
    
    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const imageUrl = await generateProductImage(product);
        
        results.push({
            ...product,
            imageUrl
        });
        
        // 调用进度回调
        if (onProgress) {
            onProgress(i + 1, products.length);
        }
        
        // 添加延迟，避免API限流
        if (i < products.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }
    
    return results;
};

/**
 * 清除图片缓存
 */
export const clearImageCache = () => {
    imageCache.clear();
};

/**
 * 获取缓存大小
 */
export const getCacheSize = (): number => {
    return imageCache.size;
};

