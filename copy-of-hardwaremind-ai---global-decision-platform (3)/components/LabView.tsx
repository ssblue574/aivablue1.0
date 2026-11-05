import React, { useEffect, useMemo, useState } from 'react';
import {
    ArrowLeft,
    Bookmark,
    BookmarkCheck,
    Building2,
    CheckCircle2,
    ChevronRight,
    Circle,
    Factory,
    Heart,
    MapPin,
    MessageCircle,
    Search,
    Send,
    Star,
    UserRound,
    Users,
    X,
} from 'lucide-react';
import { clsx } from 'clsx';
import { useTheme } from '../ThemeContext';
import { useNavigate } from 'react-router-dom';
import { PersonalCrowdShowcase } from './PersonalCrowdShowcase';

interface LabViewProps {
    t: (key: any) => string;
    lang?: string;
}

type LabSection = 'enterprise' | 'personal' | 'partners' | 'discuss';
type PartnerType = 'design' | 'oem';
type PartnerSort = 'rating' | 'moq';

interface Partner {
    id: string;
    name: string;
    nameZh: string;
    type: PartnerType;
    region: string;
    regionZh: string;
    city: string;
    cityZh: string;
    capabilities: string[];
    capabilitiesZh: string[];
    moq: string;
    moqValue: number;
    leadTime: string;
    rating: number;
    projects: string;
    highlight: string;
    highlightZh: string;
    image: string;
    about?: string;
    aboutZh?: string;
    features?: string[];
    featuresZh?: string[];
}

interface Article {
    id: number;
    section: 'enterprise' | 'personal';
    title: string;
    subtitle: string;
    category: string;
    image: string;
    readTime: string;
    featured?: boolean;
    description: string;
    body: string[];
}

const STORAGE_KEYS = {
    SAVED_ARTICLES: 'aiva_lab_saved_articles',
    FAV_PARTNERS: 'aiva_lab_fav_partners',
    ROADMAP: 'aiva_lab_roadmap',
};

const readJson = <T,>(key: string, fallback: T): T => {
    try {
        const raw = localStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
        return fallback;
    }
};

export const LabView: React.FC<LabViewProps> = ({
    t,
    lang = 'zh'
}) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const isZh = lang === 'zh';
    const navigate = useNavigate();

    const [activeSection, setActiveSection] = useState<LabSection | null>(null);
    const [personalTab, setPersonalTab] = useState<'crowd' | 'learn'>('learn');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [partnerQuery, setPartnerQuery] = useState('');
    const [partnerType, setPartnerType] = useState<'all' | PartnerType>('all');
    const [partnerRegion, setPartnerRegion] = useState('all');
    const [partnerSort, setPartnerSort] = useState<PartnerSort>('rating');
    const [favoritesOnly, setFavoritesOnly] = useState(false);
    const [favPartners, setFavPartners] = useState<string[]>([]);
    const [savedArticles, setSavedArticles] = useState<number[]>([]);
    const [roadmapDone, setRoadmapDone] = useState<Record<string, boolean>>({});
    const [activeArticle, setActiveArticle] = useState<Article | null>(null);
    const [activePartner, setActivePartner] = useState<Partner | null>(null);
    const [contactPartner, setContactPartner] = useState<Partner | null>(null);
    const [contactName, setContactName] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [contactNeed, setContactNeed] = useState('');
    const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
    const [replyDraft, setReplyDraft] = useState('');
    const [roomReplies, setRoomReplies] = useState<Record<string, string[]>>({});
    const [banner, setBanner] = useState<string | null>(null);

    useEffect(() => {
        setFavPartners(readJson(STORAGE_KEYS.FAV_PARTNERS, []));
        setSavedArticles(readJson(STORAGE_KEYS.SAVED_ARTICLES, []));
        setRoadmapDone(readJson(STORAGE_KEYS.ROADMAP, {}));
    }, []);

    useEffect(() => {
        if (!banner) return;
        const timer = window.setTimeout(() => setBanner(null), 2600);
        return () => clearTimeout(timer);
    }, [banner]);

    const showBanner = (msg: string) => setBanner(msg);

    const sections: Array<{
        id: Exclude<LabSection, 'discuss'>;
        label: string;
        desc: string;
        image: string;
        tone: string;
        icon: typeof Building2;
    }> = [
        {
            id: 'enterprise',
            label: t('lab_enterprise'),
            desc: t('lab_enterprise_desc'),
            image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=90',
            tone: 'from-sky-500/30 via-indigo-500/10 to-transparent',
            icon: Building2,
        },
        {
            id: 'personal',
            label: t('lab_personal'),
            desc: t('lab_personal_desc'),
            image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=90',
            tone: 'from-fuchsia-500/30 via-violet-500/10 to-transparent',
            icon: UserRound,
        },
        {
            id: 'partners',
            label: t('lab_partners'),
            desc: t('lab_partners_desc'),
            image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1200&q=90',
            tone: 'from-amber-500/25 via-orange-500/10 to-transparent',
            icon: Factory,
        },
    ];

    const categories = [
        { id: 'all', label: isZh ? '全部' : 'All' },
        { id: 'teardown', label: isZh ? '拆解' : 'Teardowns' },
        { id: 'analysis', label: isZh ? '分析' : 'Analysis' },
        { id: 'review', label: isZh ? '评测' : 'Reviews' },
        { id: 'tutorial', label: isZh ? '教程' : 'Tutorials' },
    ];

    const roadmapItems = useMemo(() => {
        if (activeSection === 'enterprise') {
            return [
                { id: 'e1', label: isZh ? '明确场景与成功指标' : 'Define use case & success metrics' },
                { id: 'e2', label: isZh ? '完成 BOM 与成本模型' : 'Build BOM & cost model' },
                { id: 'e3', label: isZh ? '选定设计/代工候选名单' : 'Shortlist design & OEM partners' },
                { id: 'e4', label: isZh ? '完成 EVT / DVT 验证' : 'Finish EVT / DVT validation' },
                { id: 'e5', label: isZh ? '启动小批量试产' : 'Kick off pilot production' },
            ];
        }
        return [
            { id: 'p1', label: isZh ? '锁定一个真实痛点' : 'Lock one real pain point' },
            { id: 'p2', label: isZh ? '完成外观与核心交互草图' : 'Sketch form & core interaction' },
            { id: 'p3', label: isZh ? '打出第一版可演示原型' : 'Build a demo-ready prototype' },
            { id: 'p4', label: isZh ? '准备众筹/预售物料' : 'Prepare crowdfunding assets' },
            { id: 'p5', label: isZh ? '对接低起订代工厂' : 'Connect with low-MOQ factories' },
        ];
    }, [activeSection, isZh]);

    const rooms = [
        {
            id: 'design',
            name: isZh ? '产品设计讨论' : 'Product Design Talk',
            members: 234,
            online: 18,
            description: isZh ? '探讨美学、CMF 与可制造设计' : 'Aesthetics, CMF, and DFM',
            topics: [
                { title: isZh ? '如何平衡美学与功能性？' : 'Balancing aesthetics and functionality?', replies: 45, hot: true },
                { title: isZh ? '2025 产品设计趋势' : '2025 Product Design Trends', replies: 32 },
            ],
        },
        {
            id: 'engineering',
            name: isZh ? '工程师角落' : 'Engineers Corner',
            members: 189,
            online: 24,
            description: isZh ? 'PCB、固件与硬件调试交流' : 'PCB, firmware, and debugging',
            topics: [
                { title: isZh ? 'PCB 设计最佳实践' : 'PCB Design Best Practices', replies: 67, hot: true },
                { title: isZh ? '如何降低 BOM 成本？' : 'How to reduce BOM cost?', replies: 35 },
            ],
        },
        {
            id: 'crowdfunding',
            name: isZh ? '众筹创业圈' : 'Crowdfunding Circle',
            members: 156,
            online: 12,
            description: isZh ? '众筹叙事、供应链与履约' : 'Campaign storytelling and fulfillment',
            topics: [
                { title: isZh ? 'Kickstarter 成功经验' : 'Kickstarter Success Stories', replies: 52, hot: true },
                { title: isZh ? '供应链踩坑记录' : 'Supply chain lessons', replies: 29 },
            ],
        },
        {
            id: 'ai-hardware',
            name: isZh ? 'AI 硬件前沿' : 'AI Hardware Frontier',
            members: 312,
            online: 45,
            description: isZh ? '边缘 AI、本地推理与可穿戴' : 'Edge AI, on-device inference, wearables',
            topics: [
                { title: isZh ? '本地 AI 芯片趋势' : 'On-device AI chip trends', replies: 89, hot: true },
                { title: isZh ? '开源 AI 硬件项目' : 'Open-source AI hardware', replies: 43 },
            ],
        },
    ];

    const partners: Partner[] = [
        {
            id: 'p1',
            name: 'Shenzhen Apex ID Studio',
            nameZh: '深圳尖峰工业设计',
            type: 'design',
            region: 'Greater China',
            regionZh: '大中华区',
            city: 'Shenzhen',
            cityZh: '深圳',
            capabilities: ['Industrial Design', 'CMF', 'Prototyping'],
            capabilitiesZh: ['工业设计', 'CMF', '手板打样'],
            moq: '—',
            moqValue: 0,
            leadTime: '2–4 wks',
            rating: 4.9,
            projects: '320+',
            highlight: 'AI wearables & consumer electronics form language',
            highlightZh: '擅长 AI 可穿戴与消费电子外观语言',
            image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1200&q=90',
            about: 'Apex ID helps startups and brands turn vague product ideas into manufacturable industrial designs, with strong CMF and rapid prototyping loops.',
            aboutZh: '尖峰工业设计帮助创业团队与品牌，把模糊产品想法落地为可制造的工业设计方案，擅长 CMF 与快速打样闭环。',
            features: [
                'End-to-end industrial design from concept sketches to CAD',
                'CMF systems tailored for AI wearables and consumer gadgets',
                'Prototype reviews with DFM feedback before tooling',
            ],
            featuresZh: [
                '从概念草图到 CAD 的完整工业设计服务',
                '面向 AI 可穿戴与消费电子的 CMF 体系',
                '开模前提供可制造性（DFM）评审与手板验证',
            ],
        },
        {
            id: 'p2',
            name: 'Foxlink Precision OEM',
            nameZh: '富港精密代工',
            type: 'oem',
            region: 'Greater China',
            regionZh: '大中华区',
            city: 'Dongguan',
            cityZh: '东莞',
            capabilities: ['SMT', 'Assembly', 'QC'],
            capabilitiesZh: ['SMT', '整机组装', '品质检测'],
            moq: '5,000',
            moqValue: 5000,
            leadTime: '6–10 wks',
            rating: 4.8,
            projects: '1.2K+',
            highlight: 'Mass production for smart hardware & IoT modules',
            highlightZh: '智能硬件与物联网模组量产经验丰富',
            image: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&w=1200&q=90',
            about: 'Foxlink Precision focuses on mid-to-high volume OEM for smart hardware, with mature SMT lines, final assembly and multi-stage QC gates.',
            aboutZh: '富港精密专注智能硬件中大批量代工，具备成熟 SMT 产线、整机组装与多级品质管控能力。',
            features: [
                'High-yield SMT and PCBA production lines',
                'Full-device assembly with fixture and pack-out support',
                'Incoming / in-process / outgoing QC with traceability',
            ],
            featuresZh: [
                '高良率 SMT 与 PCBA 量产产线',
                '整机组装、治具与包材出货支持',
                '来料/制程/出货三级质检与批次追溯',
            ],
        },
        {
            id: 'p3',
            name: 'Helsinki Form Lab',
            nameZh: '赫尔辛基形态实验室',
            type: 'design',
            region: 'Europe',
            regionZh: '欧洲',
            city: 'Helsinki',
            cityZh: '赫尔辛基',
            capabilities: ['UX Hardware', 'Ergonomics', 'Sustainability'],
            capabilitiesZh: ['硬件体验', '人机工学', '可持续设计'],
            moq: '—',
            moqValue: 0,
            leadTime: '3–5 wks',
            rating: 4.7,
            projects: '180+',
            highlight: 'Nordic minimal design for spatial computing devices',
            highlightZh: '北欧极简风格，专注空间计算设备',
            image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=90',
            about: 'Form Lab blends Nordic minimal aesthetics with rigorous ergonomics research for spatial and wearable computing products.',
            aboutZh: '形态实验室将北欧极简美学与严谨人机研究结合，服务空间计算与可穿戴产品。',
            features: [
                'Hardware interaction and ergonomics research',
                'Sustainable material and lifecycle design choices',
                'Concept-to-appearance models for investor demos',
            ],
            featuresZh: [
                '硬件交互与人机工学研究',
                '可持续材料与生命周期设计建议',
                '面向融资演示的概念到外观模型交付',
            ],
        },
        {
            id: 'p4',
            name: 'Vietnam Delta Electronics MFG',
            nameZh: '越南三角洲电子制造',
            type: 'oem',
            region: 'Southeast Asia',
            regionZh: '东南亚',
            city: 'Hai Phong',
            cityZh: '海防',
            capabilities: ['PCBA', 'Injection Molding', 'Packaging'],
            capabilitiesZh: ['PCBA', '注塑', '包装'],
            moq: '3,000',
            moqValue: 3000,
            leadTime: '5–8 wks',
            rating: 4.6,
            projects: '860+',
            highlight: 'Cost-efficient mid-volume runs with EU/US shipping lanes',
            highlightZh: '中小批量成本优，覆盖欧美出货通道',
            image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1200&q=90',
            about: 'Delta Electronics MFG offers cost-efficient mid-volume manufacturing in Vietnam with PCBA, molding and export packaging for EU/US lanes.',
            aboutZh: '三角洲电子在越南提供性价比突出的中小批量制造，覆盖 PCBA、注塑与面向欧美的出口包装。',
            features: [
                'Integrated PCBA and enclosure molding',
                'Export-ready packaging and documentation',
                'Flexible scheduling for 3k–50k batch sizes',
            ],
            featuresZh: [
                'PCBA 与外壳注塑一体化交付',
                '出口包装与单据支持',
                '适配 3k–50k 批量的柔性排产',
            ],
        },
        {
            id: 'p5',
            name: 'Tokyo Micro Mechanism Co.',
            nameZh: '东京微机构造',
            type: 'design',
            region: 'Japan & Korea',
            regionZh: '日韩',
            city: 'Tokyo',
            cityZh: '东京',
            capabilities: ['Precision Mech', 'Haptics', 'DFM'],
            capabilitiesZh: ['精密机构', '触觉反馈', '可制造设计'],
            moq: '—',
            moqValue: 0,
            leadTime: '4–6 wks',
            rating: 4.9,
            projects: '240+',
            highlight: 'Precision mechanisms for robotics and wearable haptics',
            highlightZh: '机器人与可穿戴触觉精密机构设计',
            image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=90',
            about: 'Tokyo Micro Mechanism specializes in compact precision mechanics and haptic modules for robotics and premium wearables.',
            aboutZh: '东京微机构造专注紧凑精密机构与触觉模组，服务机器人与高端可穿戴产品。',
            features: [
                'Micro mechanism design for tight enclosures',
                'Haptic actuator integration and feel tuning',
                'DFM packages for Japanese and overseas vendors',
            ],
            featuresZh: [
                '面向紧凑腔体的微机构设计',
                '触觉执行器集成与手感调校',
                '面向日系与海外供应商的 DFM 交付包',
            ],
        },
        {
            id: 'p6',
            name: 'Suzhou Soft Tooling Plant',
            nameZh: '苏州软模试产工厂',
            type: 'oem',
            region: 'Greater China',
            regionZh: '大中华区',
            city: 'Suzhou',
            cityZh: '苏州',
            capabilities: ['Soft Tooling', 'Pilot Run', 'NPI'],
            capabilitiesZh: ['软模', '试产', 'NPI'],
            moq: '200',
            moqValue: 200,
            leadTime: '3–5 wks',
            rating: 4.7,
            projects: '980+',
            highlight: 'Low MOQ pilot runs before hard-tooling mass production',
            highlightZh: '硬模量产前的低起订试产与 NPI',
            image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1200&q=90',
            about: 'The Suzhou plant bridges prototype and mass production with soft tooling, pilot runs and structured NPI checkpoints.',
            aboutZh: '苏州工厂以软模、试产和结构化 NPI 节点，帮助产品从原型平滑过渡到量产。',
            features: [
                'Soft tooling for low-risk design validation',
                'Pilot builds from 200 units with yield tracking',
                'NPI checklists before hard-tooling investment',
            ],
            featuresZh: [
                '软模验证，降低开硬模风险',
                '200 起订试产与良率跟踪',
                '硬模投入前的 NPI 检查清单',
            ],
        },
        {
            id: 'p7',
            name: 'Austin Hardware Atelier',
            nameZh: '奥斯汀硬件工坊',
            type: 'design',
            region: 'North America',
            regionZh: '北美',
            city: 'Austin',
            cityZh: '奥斯汀',
            capabilities: ['System Arch', 'RF Enclosure', 'Certification Prep'],
            capabilitiesZh: ['系统架构', '射频结构', '认证预研'],
            moq: '—',
            moqValue: 0,
            leadTime: '3–6 wks',
            rating: 4.6,
            projects: '110+',
            highlight: 'US-based architecture & FCC/CE readiness for startups',
            highlightZh: '美国本土架构设计，帮创业公司备战 FCC/CE',
            image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=90',
            about: 'Austin Hardware Atelier helps US startups define system architecture and RF-friendly enclosures with early certification planning.',
            aboutZh: '奥斯汀硬件工坊帮助美国创业公司完成系统架构与射频友好结构，并提前规划认证路径。',
            features: [
                'System architecture workshops for first hardware builds',
                'RF enclosure co-design with antenna constraints',
                'FCC/CE pre-compliance checklists and lab intros',
            ],
            featuresZh: [
                '首款硬件的系统架构工作坊',
                '考虑天线约束的射频结构设计',
                'FCC/CE 预合规清单与实验室对接',
            ],
        },
        {
            id: 'p8',
            name: 'Bangalore CircuitWorks OEM',
            nameZh: '班加罗尔电路工坊',
            type: 'oem',
            region: 'South Asia',
            regionZh: '南亚',
            city: 'Bengaluru',
            cityZh: '班加罗尔',
            capabilities: ['PCB Fab', 'Firmware Flash', 'Burn-in'],
            capabilitiesZh: ['PCB 制板', '固件烧录', '老化测试'],
            moq: '1,000',
            moqValue: 1000,
            leadTime: '4–7 wks',
            rating: 4.5,
            projects: '540+',
            highlight: 'Fast-turn PCB + firmware for indie AI gadgets',
            highlightZh: '适合独立 AI 硬件的快速 PCB 与固件量产',
            image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=90',
            about: 'CircuitWorks is built for indie AI gadgets that need fast PCB turns, secure firmware flashing and burn-in screening.',
            aboutZh: '电路工坊面向独立 AI 硬件，提供快速 PCB 周转、安全固件烧录与老化筛选。',
            features: [
                'Quick-turn PCB fabrication and assembly',
                'Secure firmware flashing workflows',
                'Burn-in and functional test jigs for small batches',
            ],
            featuresZh: [
                '快速 PCB 制板与组装',
                '安全固件烧录流程',
                '小批量老化与功能测试治具',
            ],
        },
    ];

    const articles: Article[] = [
        {
            id: 1,
            section: 'enterprise',
            title: isZh ? '企业硬件立项工作坊' : 'Enterprise Hardware Workshop',
            subtitle: isZh ? '从痛点到可量产方案' : 'From pain point to production',
            category: 'tutorial',
            image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=90',
            readTime: '50 min',
            featured: true,
            description: isZh
                ? '面向产品与供应链团队，梳理立项评审、原型验证、供应链与合规的关键路径。'
                : 'A playbook for product and supply-chain teams.',
            body: isZh
                ? [
                    '先把业务问题写成可验证指标：吞吐、良率、交付周期与单位成本。',
                    '在概念阶段同步拉入供应链，避免后期因器件锁定导致返工。',
                    '用 EVT/DVT/PVT 三段门禁，把技术风险与量产风险拆开处理。',
                ]
                : [
                    'Translate the business problem into measurable KPIs.',
                    'Bring supply chain into the concept stage early.',
                    'Use EVT/DVT/PVT gates to separate tech and production risk.',
                ],
        },
        {
            id: 2,
            section: 'enterprise',
            title: isZh ? 'B 端 AI 硬件选型矩阵' : 'B2B AI Hardware Matrix',
            subtitle: isZh ? '成本、交付与生态权衡' : 'Cost, delivery & ecosystem',
            category: 'analysis',
            image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=90',
            readTime: '30 min',
            description: isZh
                ? '为企业采购与创新部门提供可落地的硬件评估框架。'
                : 'A practical evaluation framework for enterprise teams.',
            body: isZh
                ? [
                    '按算力密度、功耗、软件栈成熟度与售后支持四维打分。',
                    '优先选择有区域备件与本地服务能力的供应商。',
                    '把总拥有成本（TCO）放在单次采购价之前。',
                ]
                : [
                    'Score by compute density, power, software maturity, and support.',
                    'Prefer vendors with regional spare parts and service.',
                    'Prioritize TCO over unit purchase price.',
                ],
        },
        {
            id: 3,
            section: 'enterprise',
            title: isZh ? '边缘算力部署参考' : 'Edge Compute Reference',
            subtitle: isZh ? '制程、功耗与拓扑' : 'Process, power & topology',
            category: 'analysis',
            image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=90',
            readTime: '35 min',
            description: isZh
                ? '从制程与功耗视角，解读企业场景下的芯片选型逻辑。'
                : 'Chip selection guidance for enterprise edge deployments.',
            body: isZh
                ? [
                    '边缘部署先定散热预算，再反推芯片与外壳结构。',
                    '区分训练/蒸馏与现场推理的不同硬件路径。',
                    '预留 OTA 与安全启动能力，降低后续维护成本。',
                ]
                : [
                    'Set thermal budget first, then reverse into chip and enclosure.',
                    'Separate training/distillation from on-site inference paths.',
                    'Reserve OTA and secure boot for lower maintenance cost.',
                ],
        },
        {
            id: 4,
            section: 'personal',
            title: isZh ? 'Vision Pro 深度拆解' : 'Vision Pro Teardown',
            subtitle: isZh ? 'M2 与 R1 协处理器' : 'M2 & R1 chips revealed',
            category: 'teardown',
            image: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&w=1200&q=90',
            readTime: '45 min',
            featured: true,
            description: isZh
                ? '深入探索 Vision Pro 的硬件架构与核心组件。'
                : 'Explore Vision Pro hardware architecture.',
            body: isZh
                ? [
                    '关注传感器阵列与显示链路如何共同决定延迟。',
                    '协处理器分工是空间计算设备的关键工程决策。',
                    '创客可借鉴其模块化验证思路，而非直接复制成本结构。',
                ]
                : [
                    'Sensor arrays and display pipelines jointly set latency.',
                    'Co-processor split is a key spatial-compute decision.',
                    'Makers should borrow validation patterns, not cost structures.',
                ],
        },
        {
            id: 5,
            section: 'personal',
            title: isZh ? 'AI Pin 全面评测' : 'AI Pin Review',
            subtitle: isZh ? '可穿戴交互的真实体验' : 'Real-world wearable UX',
            category: 'review',
            image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=90',
            readTime: '25 min',
            description: isZh
                ? '从个人创作者视角评测交互、续航与日常可用性。'
                : 'A maker-first review of interaction and battery life.',
            body: isZh
                ? [
                    '无屏交互依赖上下文感知，误触成本很高。',
                    '续航与散热决定用户是否愿意每天佩戴。',
                    '评测结论：先验证“每天愿意戴”，再谈功能密度。',
                ]
                : [
                    'Screenless UX depends on context and has high false-trigger cost.',
                    'Battery and heat decide daily wear willingness.',
                    'Validate daily wear first, then feature density.',
                ],
        },
        {
            id: 6,
            section: 'personal',
            title: isZh ? '设计你的第一款 AI 硬件' : 'Design Your First AI Device',
            subtitle: isZh ? '原型、众筹与小批量' : 'Prototype to small batch',
            category: 'tutorial',
            image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=90',
            readTime: '50 min',
            description: isZh
                ? '给独立创客的入门路径：需求定义、打样与试产。'
                : 'A starter path for indie makers.',
            body: isZh
                ? [
                    '用最小可演示闭环证明价值，而不是一次做完整产品。',
                    '众筹页要讲清用户故事、交付节奏与风险边界。',
                    '小批量优先找低 MOQ、可软模试产的工厂。',
                ]
                : [
                    'Prove value with a minimal demo loop.',
                    'Crowdfunding pages need story, timeline, and risk clarity.',
                    'Prefer low-MOQ soft-tooling partners for early batches.',
                ],
        },
        {
            id: 7,
            section: 'personal',
            title: isZh ? 'Quest 3 光学拆解笔记' : 'Quest 3 Optics Notes',
            subtitle: isZh ? 'Pancake 透镜与散热' : 'Pancake lenses & thermals',
            category: 'teardown',
            image: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?auto=format&fit=crop&w=1200&q=90',
            readTime: '40 min',
            description: isZh
                ? '拆解 XR 关键模组，理解光学与散热取舍。'
                : 'Understand optics and thermal trade-offs in XR.',
            body: isZh
                ? [
                    'Pancake 方案压缩厚度，但会抬高光学与装配复杂度。',
                    '散热通道应与佩戴舒适度一起评估。',
                    '个人项目可先用成熟模组验证体验，再定制光学。',
                ]
                : [
                    'Pancake optics shrink thickness but raise assembly complexity.',
                    'Evaluate thermal paths with wear comfort together.',
                    'Validate experience with mature modules before custom optics.',
                ],
        },
    ];

    const partnerRegions = useMemo(() => {
        const map = new Map<string, string>();
        partners.forEach(p => map.set(p.region, isZh ? p.regionZh : p.region));
        return Array.from(map.entries());
    }, [isZh]);

    const filteredPartners = useMemo(() => {
        const q = partnerQuery.trim().toLowerCase();
        const list = partners.filter(p => {
            if (favoritesOnly && !favPartners.includes(p.id)) return false;
            if (partnerType !== 'all' && p.type !== partnerType) return false;
            if (partnerRegion !== 'all' && p.region !== partnerRegion) return false;
            if (!q) return true;
            const haystack = [
                p.name, p.nameZh, p.city, p.cityZh, p.region, p.regionZh,
                p.highlight, p.highlightZh, ...p.capabilities, ...p.capabilitiesZh,
            ].join(' ').toLowerCase();
            return haystack.includes(q);
        });
        return list.sort((a, b) => {
            if (partnerSort === 'rating') return b.rating - a.rating;
            const av = a.moqValue === 0 ? Number.MAX_SAFE_INTEGER : a.moqValue;
            const bv = b.moqValue === 0 ? Number.MAX_SAFE_INTEGER : b.moqValue;
            return av - bv;
        });
    }, [partnerQuery, partnerType, partnerRegion, partnerSort, favoritesOnly, favPartners]);

    const sectionArticles = articles.filter(a => a.section === activeSection);
    const filteredArticles = selectedCategory === 'all'
        ? sectionArticles
        : sectionArticles.filter(a => a.category === selectedCategory);
    const featuredArticle = sectionArticles.find(a => a.featured) || sectionArticles[0];

    const titleMap: Record<LabSection, string> = {
        enterprise: t('lab_enterprise'),
        personal: t('lab_personal'),
        partners: t('lab_partners'),
        discuss: t('lab_discuss'),
    };

    const surface = isDark ? 'bg-[#1c1c1e]' : 'bg-white';
    const pageBg = isDark ? 'bg-black text-white' : 'bg-[#f5f5f7] text-[#1d1d1f]';
    const muted = isDark ? 'text-white/50' : 'text-black/45';
    const soft = isDark ? 'text-white/70' : 'text-black/65';
    const accent = isDark ? 'text-[#0A84FF]' : 'text-[#0071E3]';

    const toggleFavPartner = (id: string) => {
        setFavPartners(prev => {
            const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
            localStorage.setItem(STORAGE_KEYS.FAV_PARTNERS, JSON.stringify(next));
            return next;
        });
    };

    const toggleSavedArticle = (id: number) => {
        setSavedArticles(prev => {
            const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
            localStorage.setItem(STORAGE_KEYS.SAVED_ARTICLES, JSON.stringify(next));
            showBanner(next.includes(id) ? t('lab_saved') : (isZh ? '已取消收藏' : 'Removed'));
            return next;
        });
    };

    const toggleRoadmap = (id: string) => {
        setRoadmapDone(prev => {
            const next = { ...prev, [id]: !prev[id] };
            localStorage.setItem(STORAGE_KEYS.ROADMAP, JSON.stringify(next));
            return next;
        });
    };

    const submitContact = () => {
        if (!contactName.trim() || !contactEmail.trim() || !contactNeed.trim()) {
            showBanner(isZh ? '请完整填写合作意向' : 'Please complete the form');
            return;
        }
        setContactPartner(null);
        setContactName('');
        setContactEmail('');
        setContactNeed('');
        showBanner(t('lab_contact_success'));
    };

    const sendReply = () => {
        if (!selectedRoom || !replyDraft.trim()) return;
        setRoomReplies(prev => ({
            ...prev,
            [selectedRoom]: [...(prev[selectedRoom] || []), replyDraft.trim()],
        }));
        setReplyDraft('');
        showBanner(isZh ? '回复已发布' : 'Reply posted');
    };

    const activeRoom = rooms.find(r => r.id === selectedRoom);
    const roadmapProgress = roadmapItems.filter(i => roadmapDone[i.id]).length;

    return (
        <div
            className={clsx('min-h-screen', pageBg)}
            style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Noto Sans SC", sans-serif' }}
        >
            {banner && (
                <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[60] px-4 py-2 rounded-full bg-black/85 text-white text-[13px] shadow-lg">
                    {banner}
                </div>
            )}

            <div className={clsx(
                'sticky top-14 z-40 backdrop-blur-2xl border-b',
                isDark ? 'bg-black/70 border-white/[0.06]' : 'bg-[#f5f5f7]/80 border-black/[0.06]'
            )}>
                <div className="max-w-[720px] mx-auto px-5 h-14 flex items-center gap-2">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (activeArticle) {
                                setActiveArticle(null);
                                return;
                            }
                            if (activePartner) {
                                setActivePartner(null);
                                return;
                            }
                            if (selectedRoom) {
                                setSelectedRoom(null);
                                return;
                            }
                            if (activeSection) {
                                setActiveSection(null);
                                return;
                            }
                            navigate('/');
                        }}
                        className={clsx(
                            'relative z-20 shrink-0 p-2 -ml-2 rounded-full transition-colors',
                            isDark ? 'hover:bg-white/10 text-[#0A84FF]' : 'hover:bg-black/5 text-[#0071E3]'
                        )}
                        aria-label={isZh ? '返回' : 'Back'}
                    >
                        <ArrowLeft size={22} strokeWidth={1.75} />
                    </button>
                    <h1 className="flex-1 min-w-0 text-center text-[17px] font-semibold tracking-tight truncate pointer-events-none pr-8">
                        {activeArticle
                            ? t('lab_read')
                            : activePartner
                                ? (isZh ? activePartner.nameZh : activePartner.name)
                                : selectedRoom
                                    ? activeRoom?.name
                                    : activeSection
                                        ? titleMap[activeSection]
                                        : t('lab_title')}
                    </h1>
                </div>
            </div>

            <div className="max-w-[720px] mx-auto px-5 py-6 pb-16">
                {!activeSection ? (
                    <>
                        <p className={clsx('text-[13px] mb-4 px-1', muted)}>{t('lab_hub_hint')}</p>

                        <button
                            type="button"
                            onClick={() => setActiveSection('partners')}
                            className="w-full text-left mb-5 group"
                        >
                            <div className={clsx(
                                'relative overflow-hidden rounded-[28px] transition-transform duration-500 group-active:scale-[0.99]',
                                surface
                            )}>
                                <div className="absolute inset-0 bg-gradient-to-br from-[#ff2d55]/55 via-[#af52de]/35 to-[#1c1c1e]" />
                                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(255,255,255,0.18),transparent_55%)]" />
                                <div className="relative px-6 pt-6 pb-7">
                                    <p className="text-[13px] font-medium text-white/80 mb-8 tracking-wide">
                                        {t('lab_featured')}
                                    </p>
                                    <div className="flex justify-center mb-8">
                                        <div className="relative w-[78%] max-w-[420px] aspect-[16/10]">
                                            <img
                                                src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1000&q=90"
                                                alt=""
                                                className="absolute inset-0 w-full h-full object-cover rounded-[22px] shadow-[0_30px_60px_rgba(0,0,0,0.45)] rotate-[-4deg] scale-[0.92] saturate-[1.15]"
                                            />
                                            <img
                                                src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=90"
                                                alt=""
                                                className="absolute inset-0 w-full h-full object-cover rounded-[22px] shadow-[0_30px_60px_rgba(0,0,0,0.45)] rotate-[4deg] scale-[0.92] translate-x-4 saturate-[1.15]"
                                            />
                                            <img
                                                src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1000&q=90"
                                                alt=""
                                                className="absolute inset-0 w-full h-full object-cover rounded-[22px] shadow-[0_40px_80px_rgba(0,0,0,0.55)] saturate-[1.15]"
                                            />
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <h2 className="text-[22px] font-semibold tracking-tight text-white mb-1">
                                            {t('lab_partners')}
                                        </h2>
                                        <p className="text-[14px] text-white/65 leading-relaxed max-w-md mx-auto">
                                            {t('lab_partners_desc')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </button>

                        <div className="grid grid-cols-2 gap-3.5 mb-3.5">
                            {sections.filter(s => s.id !== 'partners').map((section) => {
                                const Icon = section.icon;
                                return (
                                    <button
                                        key={section.id}
                                        type="button"
                                        onClick={() => {
                                            setActiveSection(section.id);
                                            setSelectedCategory('all');
                                            if (section.id === 'personal') setPersonalTab('learn');
                                        }}
                                        className={clsx(
                                            'text-left rounded-[24px] overflow-hidden transition-transform duration-300 active:scale-[0.98]',
                                            surface
                                        )}
                                    >
                                        <div className={clsx('relative h-36 bg-gradient-to-b', section.tone)}>
                                            <img
                                                src={section.image}
                                                alt=""
                                                className="absolute inset-0 w-full h-full object-cover saturate-[1.2] contrast-[1.05]"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                                            <div className="absolute bottom-3 left-3 w-9 h-9 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center">
                                                <Icon size={16} className="text-white" strokeWidth={1.75} />
                                            </div>
                                        </div>
                                        <div className="px-4 pt-3.5 pb-4">
                                            <h3 className="text-[16px] font-semibold tracking-tight mb-1">
                                                {section.label}
                                            </h3>
                                            <p className={clsx('text-[12px] leading-relaxed line-clamp-2', muted)}>
                                                {section.desc}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            type="button"
                            onClick={() => setActiveSection('discuss')}
                            className={clsx(
                                'w-full text-left rounded-[24px] overflow-hidden mb-3.5 transition-transform duration-300 active:scale-[0.99]',
                                surface
                            )}
                        >
                            <div className="flex items-center gap-4 p-4">
                                <div className="w-[72px] h-[72px] rounded-[18px] bg-gradient-to-br from-violet-500/30 to-blue-500/20 flex items-center justify-center flex-shrink-0">
                                    <MessageCircle size={28} className={accent} strokeWidth={1.75} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-[16px] font-semibold tracking-tight mb-1">{t('lab_discuss')}</h3>
                                    <p className={clsx('text-[12px] leading-relaxed line-clamp-2', muted)}>{t('lab_discuss_desc')}</p>
                                    <div className={clsx('mt-2 flex items-center gap-1 text-[12px]', accent)}>
                                        <span>{t('lab_discuss_enter')}</span>
                                        <ChevronRight size={14} strokeWidth={2} />
                                    </div>
                                </div>
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveSection('partners')}
                            className={clsx(
                                'w-full text-left rounded-[24px] overflow-hidden transition-transform duration-300 active:scale-[0.99]',
                                surface
                            )}
                        >
                            <div className="flex items-center gap-4 p-4">
                                <div className="relative w-[72px] h-[72px] rounded-[18px] overflow-hidden flex-shrink-0">
                                    <img src={sections[2].image} alt="" className="w-full h-full object-cover saturate-[1.15]" />
                                </div>
                                <div className="flex-1 min-w-0 py-1">
                                    <h3 className="text-[16px] font-semibold tracking-tight mb-1">{t('lab_partners')}</h3>
                                    <p className={clsx('text-[12px] leading-relaxed line-clamp-2', muted)}>{t('lab_partners_desc')}</p>
                                    <div className={clsx('mt-2 flex items-center gap-1 text-[12px]', accent)}>
                                        <span>{t('lab_browse')}</span>
                                        <ChevronRight size={14} strokeWidth={2} />
                                    </div>
                                </div>
                            </div>
                        </button>
                    </>
                ) : activeSection === 'discuss' ? (
                    selectedRoom && activeRoom ? (
                        <>
                            <div className={clsx('rounded-[24px] p-4 mb-4', surface)}>
                                <div className="flex items-center gap-2 text-[12px] mb-2">
                                    <Users size={14} className={accent} />
                                    <span className={soft}>{activeRoom.members} {t('lab_discuss_members')}</span>
                                    <span className={muted}>·</span>
                                    <span className="text-emerald-500">{activeRoom.online} {t('lab_discuss_online')}</span>
                                </div>
                                <p className={clsx('text-[13px]', soft)}>{activeRoom.description}</p>
                            </div>

                            <h3 className="text-[15px] font-semibold mb-3 px-1">{t('lab_discuss_topics')}</h3>
                            <div className="space-y-3 mb-5">
                                {activeRoom.topics.map(topic => (
                                    <div key={topic.title} className={clsx('rounded-[20px] p-4', surface)}>
                                        <div className="flex items-start justify-between gap-3">
                                            <p className="text-[14px] font-medium leading-snug">{topic.title}</p>
                                            {topic.hot && (
                                                <span className="text-[11px] px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400 whitespace-nowrap">
                                                    HOT
                                                </span>
                                            )}
                                        </div>
                                        <p className={clsx('text-[12px] mt-2', muted)}>{topic.replies} {isZh ? '回复' : 'replies'}</p>
                                    </div>
                                ))}
                            </div>

                            {(roomReplies[selectedRoom] || []).length > 0 && (
                                <div className="space-y-2 mb-4">
                                    {roomReplies[selectedRoom].map((reply, idx) => (
                                        <div key={`${reply}-${idx}`} className={clsx('rounded-[18px] px-4 py-3 text-[13px]', surface)}>
                                            {reply}
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className={clsx('sticky bottom-4 rounded-[22px] p-3 flex gap-2', surface)}>
                                <input
                                    value={replyDraft}
                                    onChange={(e) => setReplyDraft(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && sendReply()}
                                    placeholder={t('lab_discuss_reply')}
                                    className={clsx(
                                        'flex-1 rounded-xl px-3 py-2.5 text-[14px] outline-none border-0',
                                        isDark ? 'bg-white/[0.06] text-white placeholder:text-white/30' : 'bg-black/[0.04] text-black placeholder:text-black/30'
                                    )}
                                />
                                <button
                                    type="button"
                                    onClick={sendReply}
                                    className={clsx(
                                        'px-3.5 rounded-xl flex items-center gap-1 text-[13px] font-medium',
                                        isDark ? 'bg-white text-black' : 'bg-black text-white'
                                    )}
                                >
                                    <Send size={14} />
                                    {t('lab_discuss_send')}
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="space-y-3">
                            {rooms.map(room => (
                                <button
                                    key={room.id}
                                    type="button"
                                    onClick={() => setSelectedRoom(room.id)}
                                    className={clsx('w-full text-left rounded-[24px] p-4 transition-transform active:scale-[0.99]', surface)}
                                >
                                    <div className="flex items-start justify-between gap-3 mb-2">
                                        <h3 className="text-[16px] font-semibold tracking-tight">{room.name}</h3>
                                        <span className={clsx('text-[12px]', accent)}>{t('lab_discuss_enter')}</span>
                                    </div>
                                    <p className={clsx('text-[13px] mb-3', soft)}>{room.description}</p>
                                    <div className={clsx('flex items-center gap-3 text-[12px]', muted)}>
                                        <span>{room.members} {t('lab_discuss_members')}</span>
                                        <span className="text-emerald-500">{room.online} {t('lab_discuss_online')}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )
                ) : activeSection === 'partners' ? (
                    activePartner ? (
                        <>
                            <button
                                type="button"
                                onClick={() => setActivePartner(null)}
                                className={clsx('text-[13px] font-medium mb-4', accent)}
                            >
                                ← {t('lab_partners_back_list')}
                            </button>

                            <div className={clsx('rounded-[28px] overflow-hidden mb-4', surface)}>
                                <div className="relative h-52">
                                    <img src={activePartner.image} alt="" className="w-full h-full object-cover saturate-[1.15]" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-[11px] font-medium text-white">
                                        {activePartner.type === 'design' ? t('lab_partners_design') : t('lab_partners_oem')}
                                    </span>
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <h2 className="text-[22px] font-semibold text-white tracking-tight">
                                            {isZh ? activePartner.nameZh : activePartner.name}
                                        </h2>
                                        <p className="text-[13px] text-white/75 mt-1 flex items-center gap-1">
                                            <MapPin size={12} />
                                            {isZh ? activePartner.cityZh : activePartner.city}
                                            {' · '}
                                            {isZh ? activePartner.regionZh : activePartner.region}
                                        </p>
                                    </div>
                                </div>

                                <div className="p-5 space-y-5">
                                    <div>
                                        <h3 className="text-[15px] font-semibold mb-2">{t('lab_partners_about')}</h3>
                                        <p className={clsx('text-[14px] leading-relaxed', soft)}>
                                            {isZh
                                                ? (activePartner.aboutZh || activePartner.highlightZh)
                                                : (activePartner.about || activePartner.highlight)}
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-[15px] font-semibold mb-3">{t('lab_partners_features')}</h3>
                                        <div className="space-y-2">
                                            {(isZh
                                                ? (activePartner.featuresZh || activePartner.capabilitiesZh)
                                                : (activePartner.features || activePartner.capabilities)
                                            ).map((item) => (
                                                <div
                                                    key={item}
                                                    className={clsx(
                                                        'rounded-[16px] px-3.5 py-3 text-[13px] leading-relaxed',
                                                        isDark ? 'bg-white/[0.05]' : 'bg-black/[0.03]'
                                                    )}
                                                >
                                                    {item}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-[15px] font-semibold mb-3">{t('lab_partners_overview')}</h3>
                                        <div className="grid grid-cols-2 gap-2.5">
                                            {[
                                                { label: t('lab_partners_rating'), value: String(activePartner.rating) },
                                                { label: t('lab_partners_projects'), value: activePartner.projects },
                                                { label: t('lab_partners_moq'), value: activePartner.moq },
                                                { label: t('lab_partners_lead'), value: activePartner.leadTime },
                                            ].map(item => (
                                                <div
                                                    key={item.label}
                                                    className={clsx(
                                                        'rounded-[16px] px-3.5 py-3',
                                                        isDark ? 'bg-white/[0.05]' : 'bg-black/[0.03]'
                                                    )}
                                                >
                                                    <div className={clsx('text-[11px] mb-1', muted)}>{item.label}</div>
                                                    <div className="text-[15px] font-semibold tabular-nums">{item.value}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-1.5">
                                        {(isZh ? activePartner.capabilitiesZh : activePartner.capabilities).map(cap => (
                                            <span
                                                key={cap}
                                                className={clsx(
                                                    'px-2 py-0.5 rounded-md text-[11px]',
                                                    isDark ? 'bg-white/[0.06] text-white/60' : 'bg-black/[0.04] text-black/55'
                                                )}
                                            >
                                                {cap}
                                            </span>
                                        ))}
                                    </div>

                                    <p className={clsx('text-[12px]', muted)}>{t('lab_partners_ready_contact')}</p>

                                    <button
                                        type="button"
                                        onClick={() => setContactPartner(activePartner)}
                                        className={clsx(
                                            'w-full py-3 rounded-2xl text-[14px] font-medium',
                                            isDark ? 'bg-white text-black' : 'bg-black text-white'
                                        )}
                                    >
                                        {t('lab_partners_contact')}
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                    <>
                        <div className={clsx('rounded-[24px] px-5 py-5 mb-5', surface)}>
                            <div className="grid grid-cols-3 gap-3 mb-5">
                                {[
                                    { value: '12,800+', label: t('lab_partners_count') },
                                    { value: '68', label: t('lab_partners_countries') },
                                    { value: '140+', label: t('lab_partners_capabilities') },
                                ].map(stat => (
                                    <div key={stat.label} className="text-center">
                                        <div className="text-[22px] font-semibold tracking-tight tabular-nums">{stat.value}</div>
                                        <div className={clsx('text-[11px] mt-1 leading-snug', muted)}>{stat.label}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="relative mb-3">
                                <Search size={15} strokeWidth={1.75} className={clsx('absolute left-3.5 top-1/2 -translate-y-1/2', muted)} />
                                <input
                                    value={partnerQuery}
                                    onChange={(e) => setPartnerQuery(e.target.value)}
                                    placeholder={t('lab_partners_search')}
                                    className={clsx(
                                        'w-full rounded-2xl pl-10 pr-4 py-3 text-[14px] outline-none border-0',
                                        isDark ? 'bg-white/[0.06] text-white placeholder:text-white/30' : 'bg-black/[0.04] text-black placeholder:text-black/30'
                                    )}
                                />
                            </div>

                            <div className="flex flex-wrap gap-2 mb-2">
                                {([
                                    { id: 'all', label: t('lab_partners_all_types') },
                                    { id: 'design', label: t('lab_partners_design') },
                                    { id: 'oem', label: t('lab_partners_oem') },
                                ] as const).map(item => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => setPartnerType(item.id)}
                                        className={clsx(
                                            'px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-colors',
                                            partnerType === item.id
                                                ? (isDark ? 'bg-white text-black' : 'bg-black text-white')
                                                : (isDark ? 'bg-white/[0.06] text-white/70' : 'bg-black/[0.05] text-black/60')
                                        )}
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>

                            <div className="flex flex-wrap gap-2 mb-2">
                                <button
                                    type="button"
                                    onClick={() => setPartnerRegion('all')}
                                    className={clsx(
                                        'px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-colors',
                                        partnerRegion === 'all'
                                            ? (isDark ? 'bg-white/15 text-white' : 'bg-black/10 text-black')
                                            : (isDark ? 'bg-white/[0.04] text-white/50' : 'bg-black/[0.03] text-black/45')
                                    )}
                                >
                                    {t('lab_partners_all_regions')}
                                </button>
                                {partnerRegions.map(([id, label]) => (
                                    <button
                                        key={id}
                                        type="button"
                                        onClick={() => setPartnerRegion(id)}
                                        className={clsx(
                                            'px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-colors',
                                            partnerRegion === id
                                                ? (isDark ? 'bg-white/15 text-white' : 'bg-black/10 text-black')
                                                : (isDark ? 'bg-white/[0.04] text-white/50' : 'bg-black/[0.03] text-black/45')
                                        )}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={() => setPartnerSort('rating')}
                                    className={clsx(
                                        'px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-colors',
                                        partnerSort === 'rating'
                                            ? (isDark ? 'bg-white/15 text-white' : 'bg-black/10 text-black')
                                            : (isDark ? 'bg-white/[0.04] text-white/50' : 'bg-black/[0.03] text-black/45')
                                    )}
                                >
                                    {t('lab_sort_rating')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPartnerSort('moq')}
                                    className={clsx(
                                        'px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-colors',
                                        partnerSort === 'moq'
                                            ? (isDark ? 'bg-white/15 text-white' : 'bg-black/10 text-black')
                                            : (isDark ? 'bg-white/[0.04] text-white/50' : 'bg-black/[0.03] text-black/45')
                                    )}
                                >
                                    {t('lab_sort_moq')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFavoritesOnly(v => !v)}
                                    className={clsx(
                                        'px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-colors flex items-center gap-1',
                                        favoritesOnly
                                            ? 'bg-rose-500/20 text-rose-300'
                                            : (isDark ? 'bg-white/[0.04] text-white/50' : 'bg-black/[0.03] text-black/45')
                                    )}
                                >
                                    <Heart size={12} fill={favoritesOnly ? 'currentColor' : 'none'} />
                                    {t('lab_favorites_only')}
                                </button>
                            </div>
                        </div>

                        <p className={clsx('text-[12px] mb-3 px-1', muted)}>
                            {filteredPartners.length} {t('lab_partners_result')}
                        </p>

                        {filteredPartners.length === 0 ? (
                            <div className={clsx('rounded-[24px] p-8 text-center text-[13px]', surface, muted)}>
                                {t('lab_empty_partners')}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {filteredPartners.map((partner) => {
                                    const name = isZh ? partner.nameZh : partner.name;
                                    const city = isZh ? partner.cityZh : partner.city;
                                    const region = isZh ? partner.regionZh : partner.region;
                                    const caps = isZh ? partner.capabilitiesZh : partner.capabilities;
                                    const highlight = isZh ? partner.highlightZh : partner.highlight;
                                    const typeLabel = partner.type === 'design' ? t('lab_partners_design') : t('lab_partners_oem');
                                    const isFav = favPartners.includes(partner.id);

                                    return (
                                        <button
                                            key={partner.id}
                                            type="button"
                                            onClick={() => setActivePartner(partner)}
                                            className={clsx('w-full text-left rounded-[24px] overflow-hidden transition-transform active:scale-[0.99]', surface)}
                                        >
                                            <div className="relative h-36">
                                                <img src={partner.image} alt="" className="w-full h-full object-cover saturate-[1.15]" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                                                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/35 backdrop-blur-md text-[11px] font-medium text-white">
                                                    {typeLabel}
                                                </span>
                                                <span
                                                    role="button"
                                                    tabIndex={0}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleFavPartner(partner.id);
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' || e.key === ' ') {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            toggleFavPartner(partner.id);
                                                        }
                                                    }}
                                                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/35 backdrop-blur-md flex items-center justify-center text-white"
                                                    aria-label="Favorite"
                                                >
                                                    <Heart size={16} fill={isFav ? 'currentColor' : 'none'} className={isFav ? 'text-rose-400' : ''} />
                                                </span>
                                            </div>
                                            <div className="px-4 pt-3.5 pb-4">
                                                <h4 className="text-[16px] font-semibold tracking-tight mb-1">{name}</h4>
                                                <div className={clsx('flex items-center gap-1 text-[12px] mb-2', muted)}>
                                                    <MapPin size={12} strokeWidth={1.75} />
                                                    {city} · {region}
                                                </div>
                                                <p className={clsx('text-[13px] leading-relaxed mb-3 line-clamp-2', soft)}>{highlight}</p>
                                                <div className="flex flex-wrap gap-1.5 mb-3">
                                                    {caps.map(cap => (
                                                        <span
                                                            key={cap}
                                                            className={clsx(
                                                                'px-2 py-0.5 rounded-md text-[11px]',
                                                                isDark ? 'bg-white/[0.06] text-white/60' : 'bg-black/[0.04] text-black/55'
                                                            )}
                                                        >
                                                            {cap}
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className={clsx(
                                                    'flex items-center justify-between pt-3 border-t text-[12px]',
                                                    isDark ? 'border-white/[0.06]' : 'border-black/[0.06]',
                                                    muted
                                                )}>
                                                    <span className="flex items-center gap-1">
                                                        <Star size={12} className="text-yellow-500" fill="currentColor" />
                                                        {partner.rating} · {partner.projects}
                                                    </span>
                                                    <span>{t('lab_partners_moq')} {partner.moq}</span>
                                                    <span className={clsx('font-medium', accent)}>
                                                        {t('lab_partners_view_detail')}
                                                    </span>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </>
                    )
                ) : activeArticle ? (
                    <div className={clsx('rounded-[28px] overflow-hidden', surface)}>
                        <div className="relative h-52">
                            <img src={activeArticle.image} alt="" className="w-full h-full object-cover saturate-[1.15]" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-5">
                                <p className="text-[12px] font-medium text-white/70 mb-1.5">
                                    {activeArticle.readTime}
                                </p>
                                <h2 className="text-[22px] font-semibold tracking-tight text-white leading-snug">
                                    {activeArticle.title}
                                </h2>
                                <p className="text-[13px] text-white/65 mt-1">{activeArticle.subtitle}</p>
                            </div>
                        </div>
                        <div className="p-5 space-y-4">
                            <p className={clsx('text-[14px] leading-relaxed', soft)}>{activeArticle.description}</p>
                            {activeArticle.body.map((para, idx) => (
                                <p key={idx} className={clsx('text-[14px] leading-relaxed', soft)}>{para}</p>
                            ))}
                            <button
                                type="button"
                                onClick={() => toggleSavedArticle(activeArticle.id)}
                                className={clsx(
                                    'w-full mt-2 py-3 rounded-2xl text-[14px] font-medium flex items-center justify-center gap-2',
                                    isDark ? 'bg-white/[0.08]' : 'bg-black/[0.05]'
                                )}
                            >
                                {savedArticles.includes(activeArticle.id) ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                                {savedArticles.includes(activeArticle.id) ? t('lab_saved') : t('lab_save')}
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {activeSection === 'personal' && (
                            <div className="flex gap-2 mb-5">
                                {([
                                    { id: 'learn', label: t('lab_personal_tab_learn') },
                                    { id: 'crowd', label: t('lab_personal_tab_crowd') },
                                ] as const).map(tab => (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => setPersonalTab(tab.id)}
                                        className={clsx(
                                            'flex-1 py-2.5 rounded-full text-[13px] font-medium transition-colors',
                                            personalTab === tab.id
                                                ? (isDark ? 'bg-white text-black' : 'bg-black text-white')
                                                : (isDark ? 'bg-white/[0.06] text-white/65' : 'bg-black/[0.05] text-black/55')
                                        )}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        )}

                        {activeSection === 'personal' && personalTab === 'crowd' ? (
                            <PersonalCrowdShowcase
                                t={t}
                                isZh={isZh}
                                isDark={isDark}
                                surface={surface}
                                muted={muted}
                                soft={soft}
                                accent={accent}
                                onBanner={showBanner}
                            />
                        ) : (
                            <>
                                {featuredArticle && (
                                    <button
                                        type="button"
                                        onClick={() => setActiveArticle(featuredArticle)}
                                        className={clsx('w-full text-left rounded-[28px] overflow-hidden mb-5', surface)}
                                    >
                                        <div className="relative h-52">
                                            <img src={featuredArticle.image} alt="" className="w-full h-full object-cover saturate-[1.15]" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
                                            <div className="absolute bottom-0 left-0 right-0 p-5">
                                                <p className="text-[12px] font-medium text-white/70 mb-1.5">
                                                    {t('lab_featured')} · {featuredArticle.readTime}
                                                </p>
                                                <h2 className="text-[22px] font-semibold tracking-tight text-white leading-snug">
                                                    {featuredArticle.title}
                                                </h2>
                                                <p className="text-[13px] text-white/65 mt-1">{featuredArticle.subtitle}</p>
                                            </div>
                                        </div>
                                    </button>
                                )}

                                <div className={clsx('rounded-[24px] p-4 mb-5', surface)}>
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-[15px] font-semibold">{t('lab_roadmap')}</h3>
                                        <span className={clsx('text-[12px]', muted)}>
                                            {t('lab_roadmap_progress')} {roadmapProgress}/{roadmapItems.length}
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        {roadmapItems.map(item => {
                                            const done = !!roadmapDone[item.id];
                                            return (
                                                <button
                                                    key={item.id}
                                                    type="button"
                                                    onClick={() => toggleRoadmap(item.id)}
                                                    className="w-full flex items-center gap-3 text-left py-1.5"
                                                >
                                                    {done
                                                        ? <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0" />
                                                        : <Circle size={18} className={clsx('flex-shrink-0', muted)} />}
                                                    <span className={clsx('text-[13px]', done ? muted : soft, done && 'line-through')}>
                                                        {item.label}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                                    {categories.map(cat => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setSelectedCategory(cat.id)}
                                            className={clsx(
                                                'px-3.5 py-1.5 rounded-full text-[12px] font-medium whitespace-nowrap transition-colors',
                                                selectedCategory === cat.id
                                                    ? (isDark ? 'bg-white text-black' : 'bg-black text-white')
                                                    : (isDark ? 'bg-white/[0.06] text-white/65' : 'bg-black/[0.05] text-black/55')
                                            )}
                                        >
                                            {cat.label}
                                        </button>
                                    ))}
                                </div>

                                {filteredArticles.filter(a => a.id !== featuredArticle?.id).length === 0 ? (
                                    <div className={clsx('rounded-[24px] p-8 text-center text-[13px]', surface, muted)}>
                                        {t('lab_empty_articles')}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3.5">
                                        {filteredArticles.filter(a => a.id !== featuredArticle?.id).map((article) => (
                                            <button
                                                key={article.id}
                                                type="button"
                                                onClick={() => setActiveArticle(article)}
                                                className={clsx('text-left rounded-[24px] overflow-hidden', surface)}
                                            >
                                                <div className="relative h-28">
                                                    <img src={article.image} alt="" className="w-full h-full object-cover saturate-[1.15]" />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                                    {savedArticles.includes(article.id) && (
                                                        <BookmarkCheck size={14} className="absolute top-2 right-2 text-white" />
                                                    )}
                                                </div>
                                                <div className="px-3.5 pt-3 pb-3.5">
                                                    <h3 className="text-[14px] font-semibold tracking-tight leading-snug line-clamp-2 mb-1">
                                                        {article.title}
                                                    </h3>
                                                    <p className={clsx('text-[11px] line-clamp-2 mb-2', muted)}>{article.subtitle}</p>
                                                    <p className={clsx('text-[11px]', muted)}>{article.readTime}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>

            {contactPartner && (
                <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-black/50 p-4">
                    <div className={clsx('w-full max-w-md rounded-[28px] p-5', surface)}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-[17px] font-semibold">{t('lab_contact_title')}</h3>
                            <button type="button" onClick={() => setContactPartner(null)} className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10">
                                <X size={18} />
                            </button>
                        </div>
                        <p className={clsx('text-[13px] mb-4', muted)}>
                            {isZh ? contactPartner.nameZh : contactPartner.name}
                        </p>
                        <div className="space-y-3">
                            <input
                                value={contactName}
                                onChange={(e) => setContactName(e.target.value)}
                                placeholder={t('lab_contact_name')}
                                className={clsx(
                                    'w-full rounded-2xl px-4 py-3 text-[14px] outline-none',
                                    isDark ? 'bg-white/[0.06]' : 'bg-black/[0.04]'
                                )}
                            />
                            <input
                                value={contactEmail}
                                onChange={(e) => setContactEmail(e.target.value)}
                                placeholder={t('lab_contact_email')}
                                className={clsx(
                                    'w-full rounded-2xl px-4 py-3 text-[14px] outline-none',
                                    isDark ? 'bg-white/[0.06]' : 'bg-black/[0.04]'
                                )}
                            />
                            <textarea
                                value={contactNeed}
                                onChange={(e) => setContactNeed(e.target.value)}
                                placeholder={t('lab_contact_need')}
                                rows={4}
                                className={clsx(
                                    'w-full rounded-2xl px-4 py-3 text-[14px] outline-none resize-none',
                                    isDark ? 'bg-white/[0.06]' : 'bg-black/[0.04]'
                                )}
                            />
                            <button
                                type="button"
                                onClick={submitContact}
                                className={clsx(
                                    'w-full py-3 rounded-2xl text-[14px] font-medium',
                                    isDark ? 'bg-white text-black' : 'bg-black text-white'
                                )}
                            >
                                {t('lab_contact_submit')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
