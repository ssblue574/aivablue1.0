import { Product } from './types';

export type ProductTypeId =
  | 'all'
  | 'digital'
  | 'robotics'
  | 'home'
  | 'agriculture'
  | 'beauty'
  | 'health'
  | 'wearable'
  | 'mobility'
  | 'industrial'
  | 'energy'
  | 'education'
  | 'retail'
  | 'security'
  | 'sports'
  | 'food'
  | 'audio'
  | 'camera'
  | 'play'
  | 'office'
  | 'environment'
  | 'pets';

export interface ProductTypeDef {
  id: ProductTypeId;
  labelZh: string;
  labelEn: string;
  descZh: string;
  descEn: string;
  /** Match against product.category / tags / name (case-insensitive) */
  keywords: string[];
  accent: string;
}

/**
 * Industry-wide browse buckets for Discover.
 * Covers major verticals where hardware + tech shows up.
 */
export const PRODUCT_TYPES: ProductTypeDef[] = [
  {
    id: 'all',
    labelZh: '全部',
    labelEn: 'All',
    descZh: '全行业最新信号',
    descEn: 'Signals across industries',
    keywords: [],
    accent: '#FF4D00',
  },
  {
    id: 'digital',
    labelZh: '数码',
    labelEn: 'Digital',
    descZh: 'AI 终端与消费电子',
    descEn: 'AI gadgets & consumer tech',
    keywords: ['ai', 'digital', 'device', 'assistant', 'terminal', '生产力', 'productivity', '电脑', 'computer', 'laptop', 'mobile', '手机', '数码', '智能终端', '消费电子'],
    accent: '#3B82F6',
  },
  {
    id: 'robotics',
    labelZh: '机器人',
    labelEn: 'Robotics',
    descZh: '具身智能与自动化',
    descEn: 'Embodied AI & automation',
    keywords: ['robot', 'robotics', '机器人', '人形', 'humanoid', '机械臂', 'automation', '无人机', 'drone', 'agi'],
    accent: '#6366F1',
  },
  {
    id: 'home',
    labelZh: '家用',
    labelEn: 'Home',
    descZh: '智能家居与生活空间',
    descEn: 'Smart home & living',
    keywords: ['home', '家居', '家用', 'smart home', 'ambient', '空间', '厨房家电'],
    accent: '#10B981',
  },
  {
    id: 'agriculture',
    labelZh: '农业',
    labelEn: 'Agriculture',
    descZh: '智慧农业与田间硬件',
    descEn: 'AgriTech & field hardware',
    keywords: ['agricultur', 'farm', '农业', '农', '种植', '灌溉', 'greenhouse', '温室', '畜牧', 'agritech'],
    accent: '#84CC16',
  },
  {
    id: 'beauty',
    labelZh: '美容',
    labelEn: 'Beauty',
    descZh: '美容仪与个护科技',
    descEn: 'Beauty devices & personal care',
    keywords: ['beauty', '美容', '护肤', '美发', '个护', 'skincare', 'cosmetic', 'facial', '洁面', '美容仪'],
    accent: '#F472B6',
  },
  {
    id: 'health',
    labelZh: '健康医疗',
    labelEn: 'Health',
    descZh: '健康监测与医疗设备',
    descEn: 'Health & medical devices',
    keywords: ['health', '健康', 'medical', '医疗', 'fitness', '诊所', '诊断', 'biosensor'],
    accent: '#EF4444',
  },
  {
    id: 'wearable',
    labelZh: '可穿戴',
    labelEn: 'Wearable',
    descZh: '眼镜、戒指与随身设备',
    descEn: 'Glasses, rings & on-body',
    keywords: ['wearable', '可穿戴', 'ar', 'glasses', '眼镜', 'ring', 'pin', 'pendant', 'badge', 'xr'],
    accent: '#8B5CF6',
  },
  {
    id: 'mobility',
    labelZh: '出行交通',
    labelEn: 'Mobility',
    descZh: '车载、两轮与出行硬件',
    descEn: 'Auto, micromobility & travel',
    keywords: ['mobility', 'auto', 'car', 'ev', '出行', '交通', '车载', '电动车', '两轮', 'scooter', 'bike', '航旅'],
    accent: '#0EA5E9',
  },
  {
    id: 'industrial',
    labelZh: '工业',
    labelEn: 'Industrial',
    descZh: '制造、产线与工业传感',
    descEn: 'Manufacturing & sensors',
    keywords: ['industrial', '工业', '制造', '产线', 'factory', '传感', 'sensor', 'plc', 'mes'],
    accent: '#64748B',
  },
  {
    id: 'energy',
    labelZh: '能源',
    labelEn: 'Energy',
    descZh: '储能、充电与清洁能源',
    descEn: 'Storage, charging & clean power',
    keywords: ['energy', '能源', '储能', '充电', 'solar', '光伏', 'battery', '电网', 'power'],
    accent: '#F59E0B',
  },
  {
    id: 'education',
    labelZh: '教育',
    labelEn: 'Education',
    descZh: '学习终端与教育硬件',
    descEn: 'Learning devices & EdTech',
    keywords: ['education', 'edu', '教育', '学习', '课堂', '词典笔', '学练', 'edtech'],
    accent: '#14B8A6',
  },
  {
    id: 'retail',
    labelZh: '零售商业',
    labelEn: 'Retail',
    descZh: '门店、支付与商业终端',
    descEn: 'Store, POS & commerce',
    keywords: ['retail', '零售', '商业', '门店', 'pos', '收银', '无人店', '商超'],
    accent: '#D946EF',
  },
  {
    id: 'security',
    labelZh: '安防',
    labelEn: 'Security',
    descZh: '监控、门锁与安全硬件',
    descEn: 'Cameras, locks & safety',
    keywords: ['security', '安防', '监控', '门锁', 'surveillance', 'alarm', '门禁', '防护'],
    accent: '#DC2626',
  },
  {
    id: 'sports',
    labelZh: '运动户外',
    labelEn: 'Sports',
    descZh: '运动装备与户外科技',
    descEn: 'Sports & outdoor tech',
    keywords: ['sport', '运动', '户外', 'outdoor', '健身', '跑步', '骑行', '登山'],
    accent: '#22C55E',
  },
  {
    id: 'food',
    labelZh: '餐饮食品',
    labelEn: 'Food',
    descZh: '厨房机器人与食品科技',
    descEn: 'Kitchen robots & food tech',
    keywords: ['food', '餐饮', '食品', '厨房', '咖啡', '烹饪', '厨电', 'foodtech'],
    accent: '#FB923C',
  },
  {
    id: 'audio',
    labelZh: '音频',
    labelEn: 'Audio',
    descZh: '耳机、音箱与声音实验',
    descEn: 'Audio experiments',
    keywords: ['audio', '音频', 'sound', 'speaker', 'headphone', 'earbud', '麦克风'],
    accent: '#06B6D4',
  },
  {
    id: 'camera',
    labelZh: '影像',
    labelEn: 'Imaging',
    descZh: '相机与视觉捕捉',
    descEn: 'Cameras & capture',
    keywords: ['camera', 'photo', '摄影', '影像', '相机', 'video', '拍摄'],
    accent: '#EC4899',
  },
  {
    id: 'play',
    labelZh: '玩具娱乐',
    labelEn: 'Play',
    descZh: '玩具、游戏与趣味硬件',
    descEn: 'Toys, games & fun kits',
    keywords: ['toy', 'play', 'game', 'gaming', '玩具', '游戏', '娱乐', '趣味', '潮玩'],
    accent: '#EAB308',
  },
  {
    id: 'office',
    labelZh: '办公企业',
    labelEn: 'Office',
    descZh: '办公协作与企业硬件',
    descEn: 'Workplace & enterprise',
    keywords: ['office', '办公', '企业', '会议', '协作', 'enterprise', '打印机', '投屏'],
    accent: '#475569',
  },
  {
    id: 'environment',
    labelZh: '环保气候',
    labelEn: 'Climate',
    descZh: '环境监测与可持续硬件',
    descEn: 'Climate & sustainability',
    keywords: ['environment', 'climate', '环保', '气候', '碳', '空气质量', '水质', '可持续', '绿色'],
    accent: '#059669',
  },
  {
    id: 'pets',
    labelZh: '宠物',
    labelEn: 'Pets',
    descZh: '宠物喂养与陪伴硬件',
    descEn: 'Pet care & companion tech',
    keywords: ['pet', '宠物', '猫', '狗', '喂食器', '宠物相机'],
    accent: '#A855F7',
  },
];

export const matchesProductType = (product: Product, type: ProductTypeDef): boolean => {
  if (type.id === 'all' || type.keywords.length === 0) return true;
  const haystack = [
    product.category,
    product.name,
    product.brand,
    ...(product.tags || []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return type.keywords.some((kw) => haystack.includes(kw.toLowerCase()));
};

export const countProductsByType = (products: Product[], type: ProductTypeDef): number =>
  products.filter((p) => matchesProductType(p, type)).length;

export const pickTypeCover = (products: Product[], type: ProductTypeDef): string | null => {
  const match = products.find((p) => matchesProductType(p, type) && p.imageUrl);
  return match?.imageUrl || products[0]?.imageUrl || null;
};
