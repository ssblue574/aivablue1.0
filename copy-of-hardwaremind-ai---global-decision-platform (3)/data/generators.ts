import { LocalizedProductDefinition, PurchaseChannel, UserReview, MakerStage } from './types';
import { PRODUCT_LIBRARY } from './products';

/** 随机扩展产品，供 getLatestDrops() 使用；不直接驱动首页 5 款横条 */
export const generateMockProducts = (count: number): LocalizedProductDefinition[] => {
    const MOCK_IMAGES = PRODUCT_LIBRARY.map(p => p.imageUrl);
    const categoriesZh = [
        'AI 终端', '机器人', '智能家居', '农业科技', '美容个护', '健康医疗',
        '可穿戴', '出行交通', '工业制造', '能源储能', '教育硬件', '零售商业',
        '安防监控', '运动户外', '餐饮食品', '音频', '影像', '玩具娱乐',
        '办公企业', '环保气候', '宠物科技', 'AR 眼镜'
    ];
    const categoriesEn = [
        'AI Device', 'Robotics', 'Smart Home', 'Agriculture', 'Beauty', 'Health',
        'Wearable', 'Mobility', 'Industrial', 'Energy', 'Education', 'Retail',
        'Security', 'Sports', 'Food', 'Audio', 'Camera', 'Toys',
        'Office', 'Climate', 'Pets', 'AR Glasses'
    ];
    const brands = ['Sony', 'Samsung', 'Xiaomi', 'DJI', 'Bose', 'Logitech', 'Garmin', 'Fitbit', 'Anker', 'Nothing', 'Google', 'Amazon', 'Dyson', 'Polaroid', 'Insta360'];

    const featureTemplatesZh: Record<string, string[]> = {
        'AI 终端': ['一键语音/对话式控制', '多模态识别：听声+看图', '本地+云混合推理，降低延迟', '实体按键，离线可用的基础指令', '屏幕少打扰，专注任务执行'],
        '机器人': ['自主导航与避障', '多传感器融合感知', '可扩展末端执行器', '远程运维与日志回传', '安全急停与围栏策略'],
        '智能家居': ['本地网关，支持主流协议', '全屋联动，场景自动化', '语音控制，多平台兼容', '能耗监测，低功耗待机', '安全加密，远程可控'],
        '农业科技': ['田间环境实时监测', '精准灌溉/施肥建议', '低功耗长续航节点', '适配温室与露天场景', '数据可对接农事管理系统'],
        '美容个护': ['肤质检测与个性化方案', '多档能量/温度安全控制', '护肤流程引导', '可更换护理头', '使用记录同步到 App'],
        '健康医疗': ['睡眠/压力/心率监测', 'AI 健康建议', '趋势分析而非碎片数据', '多平台同步（Apple/Google）', '防水设计，日常佩戴无负担'],
        '可穿戴': ['全天候佩戴，防水防汗', '健康/运动监测', '长续航充电盒', '蓝牙多设备切换', '轻量材质，睡眠也可戴'],
        '出行交通': ['车规级连接与定位', '能耗与行程分析', 'OTA 远程升级', '多场景驾驶辅助信息', '安全冗余与故障提示'],
        '工业制造': ['产线级稳定采集', '工业协议兼容', '边缘计算降低延迟', '异常预警与追溯', '宽温宽压适应性'],
        '能源储能': ['充放电策略优化', '电芯健康监测', '家庭/小微场景适配', '安全防护与过温保护', 'App 能耗可视化'],
        '教育硬件': ['课堂/自学双场景', '内容与练习联动', '护眼显示与时长提醒', '家长端进度同步', '离线可用核心功能'],
        '零售商业': ['收银/核销一体化', '门店客流与库存洞察', '多支付方式接入', '远程运维与补货提醒', '防损与异常告警'],
        '安防监控': ['高清夜视与智能侦测', '本地存储+云备份', '推送告警可分级', '隐私遮蔽区域', '低带宽流畅回传'],
        '运动户外': ['轨迹/配速/心率记录', '长续航户外模式', '防水防震结构', '训练计划建议', '多运动模式切换'],
        '餐饮食品': ['食材识别与配方引导', '温度/时间精准控制', '易清洁可拆结构', '厨房场景安全联锁', '食谱云端更新'],
        '音频': ['主动降噪/通透模式', '多点连接切换', '高分辨率编解码支持', '长续航+快充', '定制 EQ 与空间音频'],
        '影像': ['高像素主摄+防抖', '即拍即传到云端', 'RAW/Log 支持', '一键长续航外接电池', '防水防尘，户外可靠'],
        '玩具娱乐': ['可编程互动玩法', '安全材质与圆角设计', 'App 关卡/内容更新', '亲子共创模式', '可扩展配件生态'],
        '办公企业': ['会议采集与纪要', '跨会议室投屏协作', '企业账号与权限', '安全合规加密', '远程运维管理'],
        '环保气候': ['空气/水质多参数监测', '低碳运行策略', '数据开放接口', '异常阈值预警', '可持续材料与低功耗'],
        '宠物科技': ['自动喂食与份量控制', '健康活动监测', '远程查看与互动', '防卡粮安全设计', '多宠档案管理'],
        'AR 眼镜': ['轻量机身，日常可戴', '实时翻译/取字/识图', '语音+手势交互', '可侧载插件/应用', '开放式音频，听环境声'],
        '生产力': ['多麦克风收音，转写摘要', '云端同步到 Notion/日历', '会议/访谈场景预设', '物理静音键+指示灯', '轻量便携，长续航'],
        '摄影': ['高像素主摄+防抖', '即拍即传到云端', 'RAW/Log 支持', '一键长续航外接电池', '防水防尘，户外可靠'],
        '健康': ['睡眠/压力/心率监测', 'AI 健康建议', '趋势分析而非碎片数据', '多平台同步（Apple/Google）', '防水设计，日常佩戴无负担'],
    };

    const featureTemplatesEn: Record<string, string[]> = {
        'AI Device': ['Push-to-talk voice control', 'Multimodal (vision + audio) input', 'Hybrid on-device + cloud AI', 'Hardware buttons for reliability', 'Minimal screen distraction'],
        'Robotics': ['Autonomous navigation & obstacle avoidance', 'Multi-sensor fusion', 'Swappable end-effectors', 'Remote ops & telemetry', 'E-stop and safety fencing'],
        'Smart Home': ['Local hub, major protocols supported', 'Whole-home automations', 'Voice control, cross-platform', 'Energy monitoring, low standby', 'Secure remote access'],
        'Agriculture': ['Field environment sensing', 'Precision irrigation/fertilizer cues', 'Low-power long-life nodes', 'Greenhouse & open-field ready', 'Farm system integrations'],
        'Beauty': ['Skin analysis & personal plans', 'Safe multi-level energy control', 'Guided care routines', 'Swappable treatment heads', 'Usage history in app'],
        'Health': ['Sleep / stress / HR tracking', 'AI insights and coaching', 'Trends over raw numbers', 'Sync to Apple/Google platforms', 'Water-resistant daily wear'],
        'Wearable': ['All-day wear, sweat/water resistant', 'Health & activity tracking', 'Battery case for long trips', 'Multi-device Bluetooth switching', 'Featherweight for sleep comfort'],
        'Mobility': ['Automotive-grade connectivity', 'Trip & energy analytics', 'OTA updates', 'Driver-assist insights', 'Fail-safe alerts'],
        'Industrial': ['Line-grade stable sensing', 'Industrial protocol support', 'Edge compute for low latency', 'Anomaly alerts & traceability', 'Wide temp/voltage tolerance'],
        'Energy': ['Charge/discharge optimization', 'Cell health monitoring', 'Home/SMB scenarios', 'Thermal & overcurrent protection', 'Energy dashboards'],
        'Education': ['Classroom + self-study modes', 'Content linked to practice', 'Eye-care & time limits', 'Parent progress sync', 'Offline core features'],
        'Retail': ['Checkout & verification in one', 'Footfall & inventory insights', 'Multi-pay support', 'Remote ops & restock alerts', 'Loss-prevention alarms'],
        'Security': ['HD night vision & smart detect', 'Local + cloud backup', 'Tiered push alerts', 'Privacy mask zones', 'Low-bandwidth streaming'],
        'Sports': ['Route / pace / HR logging', 'Long outdoor battery modes', 'Rugged waterproof build', 'Training plan suggestions', 'Multi-sport profiles'],
        'Food': ['Ingredient ID & recipe guide', 'Precise temp/time control', 'Easy-clean modular parts', 'Kitchen safety interlocks', 'Cloud recipe updates'],
        'Audio': ['ANC + transparency', 'Multipoint connectivity', 'Hi-res codec support', 'Long battery + fast charge', 'Custom EQ and spatial audio'],
        'Camera': ['High-res main sensor + OIS', 'Instant cloud backup', 'RAW / Log capture', 'Swappable high-capacity battery', 'Rugged / weather resistant'],
        'Toys': ['Programmable play loops', 'Safe materials & rounded edges', 'App levels/content updates', 'Parent-child co-create modes', 'Accessory ecosystem'],
        'Office': ['Meeting capture & summaries', 'Cross-room casting', 'Enterprise identity & roles', 'Encrypted compliance modes', 'Remote fleet management'],
        'Climate': ['Air/water multi-parameter sensing', 'Low-carbon operating modes', 'Open data APIs', 'Threshold alerts', 'Sustainable materials'],
        'Pets': ['Auto feeding with portion control', 'Activity & health tracking', 'Remote view & interact', 'Anti-jam safety design', 'Multi-pet profiles'],
        'AR Glasses': ['Lightweight daily-wear frame', 'Live translate / OCR / object ID', 'Voice + gesture input', 'Sideloadable apps / plugins', 'Open-ear audio for situational awareness'],
        'Productivity': ['Multi-mic capture with AI summary', 'Sync to Notion / Calendar', 'Meeting / interview presets', 'Physical mute + indicator LED', 'Pocketable with long battery'],
    };

    const descTemplatesZh: Record<string, { strategy: string; performance: string; painPoints: string; verdict: string }> = {
        'AI 终端': {
            strategy: '做一台“少看屏幕、多用语音/视觉”的 AI 终端，接管琐碎操作。',
            performance: '日常指令可用，复杂场景取决于网络和模型质量。',
            painPoints: '中文/本地化依赖云端，延迟和稳定性受网络影响。',
            verdict: '适合尝鲜和极客，主力设备要看网络和生态表现。'
        },
        'AR 眼镜': {
            strategy: '轻量 AR 眼镜，主打识图/翻译/取字等即时信息叠加。',
            performance: '室内/静态场景效果好，户外强光或长时使用受续航影响。',
            painPoints: '中文体验和服务依赖云端；续航有限；部分 App 需侧载。',
            verdict: '适合开发者和早期尝鲜者，普通用户需接受续航与梯子成本。'
        },
        '智能家居': {
            strategy: '做一体化智能家居中枢，强调本地联动与跨平台兼容。',
            performance: '常用协议支持到位，延迟低；复杂场景需手动编排。',
            painPoints: '生态碎片化，不同品牌兼容度需验证；进阶玩法有学习成本。',
            verdict: '适合折腾全屋智能的用户，想“一步到位”的需预留调试时间。'
        },
        '可穿戴': {
            strategy: '轻量可穿戴，主打无感佩戴与基础通知/监测。',
            performance: '健康/步行监测准确度中等，续航友好，日常佩戴舒适。',
            painPoints: '深度运动/专业场景数据有限；App 体验因平台而异。',
            verdict: '适合日常轻量使用，不追求专业运动指标的用户。'
        },
        '健康': {
            strategy: '以睡眠/压力为核心，辅以 AI 建议，帮你调整作息与恢复。',
            performance: '睡眠/心率/体温趋势可靠，压力检测需连续佩戴获得趋势。',
            painPoints: '部分功能可能需订阅；硬件无屏幕，需依赖 App 解读。',
            verdict: '适合重视睡眠恢复的人群，愿意长期佩戴和看趋势。'
        },
        '生产力': {
            strategy: '把录音笔升级成 AI 助手，自动转写/摘要并同步到常用工具。',
            performance: '安静会议室效果好，嘈杂/远距需外接麦；摘要准确度视录音质量而定。',
            painPoints: '云服务依赖网络，隐私敏感场景需确认本地/加密选项。',
            verdict: '适合高频会议/访谈的人群，注重效率但能接受云依赖。'
        },
        '音频': {
            strategy: '强调通勤/办公的主动降噪与舒适度，辅以多点连接。',
            performance: 'ANC/通透表现稳健，音质主流水准，续航充足。',
            painPoints: '极端噪声下 ANC 仍有限；App 生态和固件更新需关注。',
            verdict: '通勤/办公的稳妥之选，发烧友可再试听后决定。'
        },
        '摄影': {
            strategy: '面向内容创作者的便携拍摄工具，主打快速出片与云同步。',
            performance: '日间画质优秀，低光视传感器和防抖；长拍需外接电池。',
            painPoints: '高码率占用存储，长时间拍摄易发热；配件成本需考虑。',
            verdict: '适合 vlogger/旅行博主；纯家用可考虑更性价比方案。'
        }
    };

    const descTemplatesEn: Record<string, { strategy: string; performance: string; painPoints: string; verdict: string }> = {
        'AI Device': {
            strategy: 'Reduce screen time with voice/vision first interactions.',
            performance: 'Great for simple tasks; complex flows depend on network/model quality.',
            painPoints: 'Localization and latency rely on cloud connectivity.',
            verdict: 'Fun for tinkerers; main device depends on your network and ecosystem.'
        },
        'AR Glasses': {
            strategy: 'Lightweight AR for translate/identify/read in real time.',
            performance: 'Indoors strong; bright outdoor and long sessions limited by battery.',
            painPoints: 'Cloud dependence for AI; limited battery; some apps require sideloading.',
            verdict: 'Best for devs/early adopters; mainstream users need to accept trade-offs.'
        },
        'Smart Home': {
            strategy: 'Unified home hub with local automations and protocol coverage.',
            performance: 'Low latency for common scenes; complex routines need tuning.',
            painPoints: 'Ecosystem fragmentation; compatibility may vary; setup learning curve.',
            verdict: 'Great for home hackers; one-click expectations may be disappointed.'
        },
        'Wearable': {
            strategy: 'Comfort-first wearable for notifications and light tracking.',
            performance: 'Solid daily tracking and comfort; not for pro athletes.',
            painPoints: 'Advanced metrics limited; app UX varies by platform.',
            verdict: 'Good everyday companion, not a pro sport device.'
        },
        'Health': {
            strategy: 'Sleep/stress-first health tracker with AI insights.',
            performance: 'Reliable trends for sleep/HR/temp; stress needs consistent wear.',
            painPoints: 'Some features may require subscription; app for full insights.',
            verdict: 'Great for recovery-focused users willing to wear daily.'
        },
        'Productivity': {
            strategy: 'AI recorder that auto-transcribes/summarizes to your tools.',
            performance: 'Quiet rooms shine; noisy/remote needs external mic; summary quality follows audio quality.',
            painPoints: 'Cloud reliance; privacy-sensitive scenarios need local/encrypted modes.',
            verdict: 'Excellent for meeting/interview heavy roles if you accept cloud dependence.'
        },
        'Audio': {
            strategy: 'Commute/office ANC focus with comfort and multipoint.',
            performance: 'ANC/transparency solid; mainstream sound; strong battery.',
            painPoints: 'Extreme noise still challenging; firmware/app quality matters.',
            verdict: 'Safe pick for commuters/office; audiophiles should audition first.'
        },
        'Camera': {
            strategy: 'Creator-friendly compact camera with fast cloud delivery.',
            performance: 'Great daylight/OIS; low light depends on sensor; long shoots need battery packs.',
            painPoints: 'High bitrate eats storage; heat in extended shoots; accessory cost.',
            verdict: 'Good for vloggers/travel; casual users may prefer simpler options.'
        }
    };

    return Array.from({ length: count }).map((_, i) => {
        const catIdx = i % categoriesZh.length;
        const categoryZh = categoriesZh[catIdx];
        const categoryEn = categoriesEn[catIdx];
        const brand = brands[i % brands.length];
        const name = `${brand} ${['Ultra', 'Pro', 'Max', 'Air', 'Lite', 'Prime', 'Flow', 'Neo'][i % 8]} ${['X', '5', '7', 'One', 'Zero'][i % 5]}`;
        const encodedName = encodeURIComponent(name);
        const brandWebsites: Record<string, string> = {
            'Sony': 'https://www.sony.com/electronics',
            'Samsung': 'https://www.samsung.com',
            'Xiaomi': 'https://www.mi.com',
            'DJI': 'https://www.dji.com',
            'Bose': 'https://www.bose.com',
            'Logitech': 'https://www.logitech.com',
            'Garmin': 'https://www.garmin.com',
            'Fitbit': 'https://www.fitbit.com',
            'Anker': 'https://www.anker.com',
            'Nothing': 'https://nothing.tech',
            'Google': 'https://store.google.com',
            'Amazon': 'https://www.amazon.com/electronics',
            'Dyson': 'https://www.dyson.com',
            'Polaroid': 'https://www.polaroid.com',
            'Insta360': 'https://www.insta360.com'
        };
        const brandUrl = brandWebsites[brand] || `https://www.${brand.toLowerCase()}.com`;

        // Launch date within the last 6 months (relative to today, not a fixed calendar year)
        const daysAgo = Math.floor(Math.random() * 180);
        const launch = new Date();
        launch.setDate(launch.getDate() - daysAgo);
        const dateStr = `${launch.getFullYear()}-${String(launch.getMonth() + 1).padStart(2, '0')}-${String(launch.getDate()).padStart(2, '0')}`;

        const riskLevel = ['Low', 'Moderate', 'High', 'Critical', 'Safe'][Math.floor(Math.random() * 5)] as any;
        const survivalRate = Math.floor(Math.random() * 70) + 20; // 20-90

        // Mock Purchase Channels
        const mockChannels: PurchaseChannel[] = [
            {
                name: `${brand} 官网`,
                price: `¥${(Math.floor(Math.random() * 50) + 10) * 100 - 1}`,
                currency: "CNY",
                score: 9,
                pros: ["官方正品", "售后无忧"],
                cons: ["价格略高", "可能需国际支付/关税"],
                paymentMethods: ["visa", "paypal"],
                "shippingInfo": "国际直邮/2-3周",
                url: brandUrl,
                isOfficial: true
            },
            {
                name: "JD.com (京东自营)",
                price: `¥${(Math.floor(Math.random() * 50) + 10) * 100 - 100}`,
                currency: "CNY",
                score: 8,
                pros: ["物流快", "次日达"],
                cons: ["偶尔缺货"],
                paymentMethods: ["wechat", "jdpay"],
                "shippingInfo": "211限时达",
                url: `https://search.jd.com/Search?keyword=${encodedName}`,
                isOfficial: false
            },
            {
                name: "Tmall (天猫国际)",
                price: `¥${(Math.floor(Math.random() * 50) + 10) * 100 - 200}`,
                currency: "CNY",
                score: 7,
                pros: ["价格优惠", "进口税费透明"],
                cons: ["物流较慢"],
                paymentMethods: ["alipay"],
                "shippingInfo": "保税仓发货",
                url: `https://s.taobao.com/search?q=${encodedName}`,
                isOfficial: false
            }
        ];

        // Mock Reviews - More realistic and varied
        const reviewTemplatesEn: { rating: number; content: string; sentiment: 'positive' | 'neutral' | 'negative'; tags: string[] }[] = [
            { rating: 5, content: "Absolutely mind-blowing technology. The integration is seamless and the build quality is exceptional.", sentiment: 'positive', tags: ["Innovation", "Design"] },
            { rating: 4, content: "Great product overall. Some minor issues with battery life but the features make up for it.", sentiment: 'positive', tags: ["Features", "Battery"] },
            { rating: 3, content: "Good concept but execution needs work. Battery life and connectivity could be better.", sentiment: 'neutral', tags: ["Battery", "Connectivity"] },
            { rating: 5, content: "Worth every penny. The AI features are game-changing and the design is beautiful.", sentiment: 'positive', tags: ["AI", "Design"] },
            { rating: 4, content: "Solid product with impressive features. App integration could be smoother.", sentiment: 'positive', tags: ["Features", "App"] }
        ];

        const reviewTemplatesZh: { rating: number; content: string; sentiment: 'positive' | 'neutral' | 'negative'; tags: string[] }[] = [
            { rating: 5, content: "这绝对是年度最佳硬件！工业设计太棒了，功能也很强大。", sentiment: 'positive', tags: ["设计", "创新"] },
            { rating: 4, content: "整体不错，续航稍微有点短，但功能很丰富，值得入手。", sentiment: 'positive', tags: ["功能", "续航"] },
            { rating: 3, content: "概念很好，但执行还需要改进。续航和连接稳定性有待提升。", sentiment: 'neutral', tags: ["续航", "连接"] },
            { rating: 5, content: "物超所值。AI功能改变游戏规则，设计也很漂亮。", sentiment: 'positive', tags: ["AI", "设计"] },
            { rating: 4, content: "产品不错，功能很强大。App集成可以更流畅一些。", sentiment: 'positive', tags: ["功能", "App"] }
        ];

        const selectedReviewsEn = reviewTemplatesEn.slice(0, 2 + Math.floor(Math.random() * 2));
        const selectedReviewsZh = reviewTemplatesZh.slice(0, 2 + Math.floor(Math.random() * 2));

        const mockReviews: UserReview[] = selectedReviewsEn.map((template, idx) => ({
            id: `r_${i}_${idx + 1}`,
            userName: ["TechEnthusiast_99", "GadgetGeek", "EarlyAdopter", "ProductReviewer", "TechLover"][idx],
            userAvatar: `https://i.pravatar.cc/150?u=${i}_${idx + 1}`,
            rating: template.rating,
            date: `2025-${11 - Math.floor(idx / 2)}-${20 - idx * 5}`,
            content: template.content,
            sentiment: template.sentiment,
            tags: template.tags
        }));

        const mockReviewsZh: UserReview[] = selectedReviewsZh.map((template, idx) => ({
            id: `r_${i}_zh_${idx + 1}`,
            userName: ["极客小王", "数码发烧友", "早期用户", "产品评测", "科技爱好者"][idx],
            userAvatar: `https://i.pravatar.cc/150?u=${i}_zh_${idx + 1}`,
            rating: template.rating,
            date: `2025-${11 - Math.floor(idx / 2)}-${20 - idx * 5}`,
            content: template.content,
            sentiment: template.sentiment,
            tags: template.tags
        }));

        return {
            id: `mock_${i}`,
            imageUrl: MOCK_IMAGES[i % MOCK_IMAGES.length],
            launchDate: dateStr,
            stage: Math.random() > 0.7 ? 'startup' : 'enterprise',
            fundingStatus: Math.random() > 0.8 ? 'Series A' : undefined,
            survivalRate,
            riskLevel,
            chinaAdaptability: {
                network: {
                    score: Math.floor(Math.random() * 10) + 1,
                    description: Math.random() > 0.5 ? "无需梯子，直连稳定" : "依赖海外节点，建议搭配加速器",
                    vpnRequired: Math.random() > 0.5
                },
                language: {
                    score: Math.floor(Math.random() * 10) + 1,
                    description: Math.random() > 0.5 ? "原生中文界面与语音" : "仅支持英文，无汉化",
                    supportLevel: Math.random() > 0.5 ? 'native' : 'none'
                },
                warranty: {
                    score: Math.floor(Math.random() * 10) + 1,
                    description: Math.random() > 0.5 ? "京东/天猫旗舰店联保" : "需寄回原产地维修"
                },
                ecosystem: {
                    score: Math.floor(Math.random() * 10) + 1,
                    description: Math.random() > 0.5 ? "已接入米家 App" : "独立生态，数据不互通",
                    voltageCompatible: true
                }
            },
            purchaseChannels: mockChannels,
            locales: {
                en: {
                    name,
                    brand,
                    category: categoryEn,
                    priceEstimate: `$${(Math.floor(Math.random() * 50) + 10) * 10 + 9}`,
                    description: `Latest ${categoryEn.toLowerCase()} from ${brand}, with AI features and solid connectivity.`,
                    buyingChannel: 'Official',
                    tags: ['Tech', 'New', categoryEn],
                    detail: {
                        gallery: [
                            MOCK_IMAGES[i % MOCK_IMAGES.length],
                            MOCK_IMAGES[(i + 1) % MOCK_IMAGES.length],
                            MOCK_IMAGES[(i + 2) % MOCK_IMAGES.length]
                        ],
                        highlights: ['AI Integrated', 'Long Battery', 'Smart Connectivity', 'Premium Design'],
                        shipping: Math.random() > 0.3 ? 'In Stock' : 'Pre-order, Ships in 2-4 Weeks',
                        warranty: '1 Year Limited',
                        specs: [
                            { label: 'Model', value: `${brand} ${name.split(' ')[1]} Gen 1` },
                            { label: 'Weight', value: `${Math.floor(Math.random() * 200) + 50}g` },
                            { label: 'Battery', value: `${Math.floor(Math.random() * 20) + 8} hours` },
                            { label: 'Storage', value: `${[32, 64, 128, 256][Math.floor(Math.random() * 4)]}GB` },
                            { label: 'Connectivity', value: 'Wi-Fi, Bluetooth 5.2' },
                            { label: 'Processor', value: 'AI-Enabled Chip' }
                        ]
                    },
                    features: featureTemplatesEn[categoryEn] || featureTemplatesEn['AI Device'],
                    userReviews: mockReviews,
                    verdict: (descTemplatesEn[categoryEn] || descTemplatesEn['AI Device']).verdict,
                    localizedDescription: {
                        strategy: (descTemplatesEn[categoryEn] || descTemplatesEn['AI Device']).strategy,
                        performance: (descTemplatesEn[categoryEn] || descTemplatesEn['AI Device']).performance,
                        painPoints: (descTemplatesEn[categoryEn] || descTemplatesEn['AI Device']).painPoints
                    }
                },
                zh: {
                    name,
                    brand,
                    category: categoryZh,
                    priceEstimate: `¥${(Math.floor(Math.random() * 50) + 10) * 100 - 1}`,
                    description: `${brand} 最新推出的 ${categoryZh}，主打 AI 能力与连接体验。`,
                    buyingChannel: '官网',
                    tags: ['科技', '新品', categoryZh],
                    detail: {
                        gallery: [
                            MOCK_IMAGES[i % MOCK_IMAGES.length],
                            MOCK_IMAGES[(i + 1) % MOCK_IMAGES.length],
                            MOCK_IMAGES[(i + 2) % MOCK_IMAGES.length]
                        ],
                        highlights: ['AI 驱动', '超长续航', '智能互联', '高端设计'],
                        shipping: Math.random() > 0.3 ? '现货' : '预购，2-4周发货',
                        warranty: '1年有限保修',
                        specs: [
                            { label: '型号', value: `${brand} ${name.split(' ')[1]} 第一代` },
                            { label: '重量', value: `${Math.floor(Math.random() * 200) + 50}克` },
                            { label: '电池', value: `${Math.floor(Math.random() * 20) + 8}小时` },
                            { label: '存储', value: `${[32, 64, 128, 256][Math.floor(Math.random() * 4)]}GB` },
                            { label: '连接', value: 'Wi-Fi, 蓝牙5.2' },
                            { label: '处理器', value: 'AI 芯片' }
                        ]
                    },
                    features: featureTemplatesZh[categoryZh] || featureTemplatesZh['AI 终端'],
                    userReviews: mockReviewsZh,
                    verdict: (descTemplatesZh[categoryZh] || descTemplatesZh['AI 终端']).verdict,
                    localizedDescription: {
                        strategy: (descTemplatesZh[categoryZh] || descTemplatesZh['AI 终端']).strategy,
                        performance: (descTemplatesZh[categoryZh] || descTemplatesZh['AI 终端']).performance,
                        painPoints: (descTemplatesZh[categoryZh] || descTemplatesZh['AI 终端']).painPoints
                    }
                }
            }
        } as LocalizedProductDefinition;
    });
};

export const generateMilestones = (): LocalizedProductDefinition[] => {
    const MILESTONE_DATA = [
        // 1970s
        { year: 1972, name: 'HP-35', brand: 'HP', category: { en: 'Calculator', zh: '计算器' }, inventor: 'Bill Hewlett', price: '$395', impact: { en: 'First scientific pocket calculator, replaced slide rules', zh: '首款科学口袋计算器，取代了计算尺' } },
        { year: 1975, name: 'Altair 8800', brand: 'MITS', category: { en: 'Computer', zh: '电脑' }, inventor: 'Ed Roberts', price: '$439', impact: { en: 'Sparked the personal computer revolution, inspired Apple and Microsoft', zh: '点燃了个人电脑革命，启发了苹果和微软' } },
        { year: 1976, name: 'Apple I', brand: 'Apple', category: { en: 'Computer', zh: '电脑' }, inventor: 'Steve Wozniak', price: '$666.66', impact: { en: 'Birth of Apple Computer, hand-built by Woz', zh: '苹果电脑诞生，由沃兹亲手打造' } },
        { year: 1977, name: 'Apple II', brand: 'Apple', category: { en: 'Computer', zh: '电脑' }, inventor: 'Steve Wozniak, Steve Jobs', price: '$1,298', impact: { en: 'First mass-produced personal computer, created the PC industry', zh: '首款量产个人电脑，创造了PC产业' } },
        { year: 1977, name: 'Atari 2600', brand: 'Atari', category: { en: 'Gaming', zh: '游戏' }, inventor: 'Jay Miner', price: '$199', impact: { en: 'Popularized home video gaming, sold 30M+ units', zh: '普及了家用电子游戏，销量超3000万' } },
        { year: 1978, name: 'Space Invaders', brand: 'Taito', category: { en: 'Gaming', zh: '游戏' }, inventor: 'Tomohiro Nishikado', price: '¥100/play', impact: { en: 'Created the shoot-em-up genre, caused coin shortage in Japan', zh: '开创了射击游戏类型，在日本引发硬币短缺' } },
        // 1980s
        { year: 1980, name: 'Pac-Man', brand: 'Namco', category: { en: 'Gaming', zh: '游戏' }, inventor: 'Toru Iwatani', price: '¥100/play', impact: { en: 'First gaming mascot, $2.5B revenue in first year', zh: '首个游戏吉祥物，首年收入25亿美元' } },
        { year: 1981, name: 'IBM PC', brand: 'IBM', category: { en: 'Computer', zh: '电脑' }, inventor: 'Don Estridge', price: '$1,565', impact: { en: 'Set the standard for PC architecture, spawned clone industry', zh: '确立了PC架构标准，催生了兼容机产业' } },
        { year: 1982, name: 'Commodore 64', brand: 'Commodore', category: { en: 'Computer', zh: '电脑' }, inventor: 'Chuck Peddle', price: '$595', impact: { en: 'Best-selling single computer model ever, 17M units', zh: '史上最畅销单一电脑型号，销量1700万' } },
        { year: 1982, name: 'CD Player', brand: 'Sony/Philips', category: { en: 'Audio', zh: '音频' }, inventor: 'Sony & Philips', price: '$1,000', impact: { en: 'Killed vinyl, digital audio revolution begins', zh: '终结了黑胶时代，数字音频革命开始' } },
        { year: 1983, name: 'Motorola DynaTAC', brand: 'Motorola', category: { en: 'Mobile', zh: '手机' }, inventor: 'Martin Cooper', price: '$3,995', impact: { en: 'First commercial mobile phone, the brick phone', zh: '首款商用手机，砖头机的鼻祖' } },
        { year: 1984, name: 'Tetris', brand: 'Electronika', category: { en: 'Gaming', zh: '游戏' }, inventor: 'Alexey Pajitnov', price: 'Free', impact: { en: 'Most ported game ever, 500M+ copies sold', zh: '史上移植最多的游戏，销量超5亿' } },
        { year: 1985, name: 'NES', brand: 'Nintendo', category: { en: 'Gaming', zh: '游戏' }, inventor: 'Masayuki Uemura', price: '$199', impact: { en: 'Revived gaming industry after 1983 crash, sold 62M units', zh: '1983年崩盘后复兴了游戏产业，销量6200万' } },
        { year: 1985, name: 'Windows 1.0', brand: 'Microsoft', category: { en: 'Software', zh: '软件' }, inventor: 'Bill Gates', price: '$99', impact: { en: 'Started Microsoft dominance in OS market', zh: '开启了微软在操作系统市场的统治' } },
        { year: 1986, name: 'Pixar Image Computer', brand: 'Pixar', category: { en: 'Computer', zh: '电脑' }, inventor: 'Ed Catmull', price: '$135,000', impact: { en: 'Pioneered CGI in film, led to Toy Story', zh: '开创了电影CGI技术，催生了《玩具总动员》' } },
        { year: 1987, name: 'Canon EOS', brand: 'Canon', category: { en: 'Camera', zh: '相机' }, inventor: 'Canon Team', price: '$650', impact: { en: 'First fully electronic SLR mount, still used today', zh: '首款全电子单反卡口，沿用至今' } },
        { year: 1988, name: 'NeXT Computer', brand: 'NeXT', category: { en: 'Computer', zh: '电脑' }, inventor: 'Steve Jobs', price: '$6,500', impact: { en: 'Created at CERN, became foundation of macOS', zh: '在CERN诞生，成为macOS的基础' } },
        // 1990s
        { year: 1990, name: 'World Wide Web', brand: 'CERN', category: { en: 'Internet', zh: '互联网' }, inventor: 'Tim Berners-Lee', price: 'Free', impact: { en: 'Changed human civilization, connected the world', zh: '改变了人类文明，连接了整个世界' } },
        { year: 1991, name: 'PowerBook', brand: 'Apple', category: { en: 'Laptop', zh: '笔记本' }, inventor: 'Apple Team', price: '$2,299', impact: { en: 'Defined modern laptop form factor with palm rest', zh: '定义了现代笔记本形态，首创掌托设计' } },
        { year: 1993, name: 'Mosaic', brand: 'NCSA', category: { en: 'Software', zh: '软件' }, inventor: 'Marc Andreessen', price: 'Free', impact: { en: 'First popular web browser, made internet accessible', zh: '首款流行网页浏览器，让互联网触手可及' } },
        { year: 1994, name: 'PlayStation', brand: 'Sony', category: { en: 'Gaming', zh: '游戏' }, inventor: 'Ken Kutaragi', price: '$299', impact: { en: 'Made gaming mainstream, sold 102M units', zh: '让游戏成为主流，销量1.02亿' } },
        { year: 1995, name: 'Windows 95', brand: 'Microsoft', category: { en: 'Software', zh: '软件' }, inventor: 'Bill Gates', price: '$209', impact: { en: 'Start button, taskbar, plug and play changed computing', zh: '开始按钮、任务栏、即插即用改变了计算' } },
        { year: 1996, name: 'Palm Pilot', brand: 'Palm', category: { en: 'PDA', zh: 'PDA' }, inventor: 'Jeff Hawkins', price: '$299', impact: { en: 'First successful PDA, ancestor of smartphones', zh: '首款成功的PDA，智能手机的祖先' } },
        { year: 1996, name: 'Nintendo 64', brand: 'Nintendo', category: { en: 'Gaming', zh: '游戏' }, inventor: 'Genyo Takeda', price: '$199', impact: { en: 'First 3D analog stick, Super Mario 64 changed gaming', zh: '首个3D摇杆，《超级马里奥64》改变了游戏' } },
        { year: 1997, name: 'DVD Player', brand: 'Various', category: { en: 'Video', zh: '视频' }, inventor: 'DVD Forum', price: '$600', impact: { en: 'Killed VHS, enabled home theater revolution', zh: '终结了VHS，开启了家庭影院革命' } },
        { year: 1998, name: 'iMac G3', brand: 'Apple', category: { en: 'Computer', zh: '电脑' }, inventor: 'Jony Ive', price: '$1,299', impact: { en: 'Saved Apple, made computers colorful and fun', zh: '拯救了苹果，让电脑变得多彩有趣' } },
        { year: 1998, name: 'Google Search', brand: 'Google', category: { en: 'Internet', zh: '互联网' }, inventor: 'Larry Page, Sergey Brin', price: 'Free', impact: { en: 'Organized the world information, $1.5T company', zh: '整理了全球信息，市值1.5万亿美元' } },
        { year: 1999, name: 'BlackBerry 850', brand: 'RIM', category: { en: 'Mobile', zh: '手机' }, inventor: 'Mike Lazaridis', price: '$399', impact: { en: 'Created mobile email addiction, Obama favorite', zh: '创造了移动邮件成瘾，奥巴马的最爱' } },
        { year: 1999, name: 'TiVo', brand: 'TiVo', category: { en: 'Video', zh: '视频' }, inventor: 'Jim Barton', price: '$499', impact: { en: 'Invented DVR, time-shifted TV viewing', zh: '发明了DVR，让电视观看不再受时间限制' } },
        // 2000s
        { year: 2000, name: 'PlayStation 2', brand: 'Sony', category: { en: 'Gaming', zh: '游戏' }, inventor: 'Ken Kutaragi', price: '$299', impact: { en: 'Best-selling console ever at 155M units, DVD player', zh: '史上最畅销主机1.55亿台，兼作DVD播放器' } },
        { year: 2001, name: 'iPod', brand: 'Apple', category: { en: 'Audio', zh: '音频' }, inventor: 'Tony Fadell', price: '$399', impact: { en: '1000 songs in your pocket, killed the CD', zh: '口袋里的1000首歌，终结了CD时代' } },
        { year: 2001, name: 'Xbox', brand: 'Microsoft', category: { en: 'Gaming', zh: '游戏' }, inventor: 'Seamus Blackley', price: '$299', impact: { en: 'Microsoft enters gaming, Halo changed FPS', zh: '微软进军游戏，《光环》改变了FPS' } },
        { year: 2001, name: 'Wikipedia', brand: 'Wikimedia', category: { en: 'Internet', zh: '互联网' }, inventor: 'Jimmy Wales', price: 'Free', impact: { en: 'Democratized knowledge, 60M+ articles', zh: '知识民主化，文章超6000万' } },
        { year: 2003, name: 'iTunes Store', brand: 'Apple', category: { en: 'Software', zh: '软件' }, inventor: 'Steve Jobs', price: '$0.99/song', impact: { en: 'Legalized digital music, saved music industry', zh: '让数字音乐合法化，拯救了音乐产业' } },
        { year: 2004, name: 'Facebook', brand: 'Facebook', category: { en: 'Internet', zh: '互联网' }, inventor: 'Mark Zuckerberg', price: 'Free', impact: { en: 'Connected 3B people, changed social interaction', zh: '连接了30亿人，改变了社交方式' } },
        { year: 2004, name: 'Nintendo DS', brand: 'Nintendo', category: { en: 'Gaming', zh: '游戏' }, inventor: 'Satoru Iwata', price: '$149', impact: { en: 'Dual screen gaming, 154M units sold', zh: '双屏游戏，销量1.54亿' } },
        { year: 2005, name: 'YouTube', brand: 'YouTube', category: { en: 'Internet', zh: '互联网' }, inventor: 'Chad Hurley, Steve Chen', price: 'Free', impact: { en: 'Broadcast yourself, 2B+ monthly users', zh: '人人都是主播，月活超20亿' } },
        { year: 2005, name: 'Xbox 360', brand: 'Microsoft', category: { en: 'Gaming', zh: '游戏' }, inventor: 'J Allard', price: '$299', impact: { en: 'First HD console, Xbox Live changed online gaming', zh: '首款高清主机，Xbox Live改变了在线游戏' } },
        { year: 2006, name: 'Wii', brand: 'Nintendo', category: { en: 'Gaming', zh: '游戏' }, inventor: 'Shigeru Miyamoto', price: '$249', impact: { en: 'Motion control gaming, 101M units, reached non-gamers', zh: '体感游戏，销量1.01亿，触及非玩家群体' } },
        { year: 2006, name: 'Twitter', brand: 'Twitter', category: { en: 'Internet', zh: '互联网' }, inventor: 'Jack Dorsey', price: 'Free', impact: { en: '140 characters changed news, revolutions started here', zh: '140字改变了新闻，革命从这里开始' } },
        { year: 2007, name: 'Kindle', brand: 'Amazon', category: { en: 'E-Reader', zh: '电子书' }, inventor: 'Jeff Bezos', price: '$399', impact: { en: 'Made ebooks mainstream, disrupted publishing', zh: '让电子书成为主流，颠覆了出版业' } },
        { year: 2008, name: 'App Store', brand: 'Apple', category: { en: 'Software', zh: '软件' }, inventor: 'Steve Jobs', price: 'Free', impact: { en: 'Created $500B app economy, there is an app for that', zh: '创造了5000亿美元的App经济' } },
        { year: 2008, name: 'MacBook Air', brand: 'Apple', category: { en: 'Laptop', zh: '笔记本' }, inventor: 'Jony Ive', price: '$1,799', impact: { en: 'Fits in an envelope, defined ultrabook category', zh: '装进信封里，定义了超极本品类' } },
        { year: 2008, name: 'Android', brand: 'Google', category: { en: 'Software', zh: '软件' }, inventor: 'Andy Rubin', price: 'Free', impact: { en: '3B+ devices, most popular OS on Earth', zh: '设备超30亿，地球上最流行的操作系统' } },
        { year: 2009, name: 'Bitcoin', brand: 'Bitcoin', category: { en: 'Crypto', zh: '加密货币' }, inventor: 'Satoshi Nakamoto', price: '$0.001', impact: { en: 'Created cryptocurrency, $1T+ market cap', zh: '创造了加密货币，市值超1万亿美元' } },
        // 2010s
        { year: 2010, name: 'iPad', brand: 'Apple', category: { en: 'Tablet', zh: '平板' }, inventor: 'Steve Jobs', price: '$499', impact: { en: 'Created tablet market, post-PC era begins', zh: '创造了平板市场，后PC时代开始' } },
        { year: 2010, name: 'Instagram', brand: 'Instagram', category: { en: 'Internet', zh: '互联网' }, inventor: 'Kevin Systrom', price: 'Free', impact: { en: 'Made everyone a photographer, 2B users', zh: '让人人都成为摄影师，用户20亿' } },
        { year: 2011, name: 'Siri', brand: 'Apple', category: { en: 'AI', zh: 'AI' }, inventor: 'Apple Team', price: 'Built-in', impact: { en: 'First mainstream voice assistant, started AI assistants', zh: '首个主流语音助手，开启了AI助手时代' } },
        { year: 2012, name: 'Tesla Model S', brand: 'Tesla', category: { en: 'EV', zh: '电动车' }, inventor: 'Elon Musk', price: '$57,400', impact: { en: 'Made EVs desirable, forced industry to go electric', zh: '让电动车变得令人向往，迫使行业电动化' } },
        { year: 2012, name: 'Oculus Rift DK1', brand: 'Oculus', category: { en: 'VR', zh: 'VR' }, inventor: 'Palmer Luckey', price: '$300', impact: { en: 'Revived VR industry, acquired by Facebook for $2B', zh: '复兴了VR产业，被Facebook以20亿美元收购' } },
        { year: 2013, name: 'PlayStation 4', brand: 'Sony', category: { en: 'Gaming', zh: '游戏' }, inventor: 'Mark Cerny', price: '$399', impact: { en: '117M units, dominated generation, great exclusives', zh: '销量1.17亿，统治了这一世代' } },
        { year: 2014, name: 'Amazon Echo', brand: 'Amazon', category: { en: 'Smart Home', zh: '智能家居' }, inventor: 'Amazon Lab126', price: '$179', impact: { en: 'Created smart speaker category, Alexa everywhere', zh: '创造了智能音箱品类，Alexa无处不在' } },
        { year: 2015, name: 'Apple Watch', brand: 'Apple', category: { en: 'Wearable', zh: '可穿戴' }, inventor: 'Jony Ive', price: '$349', impact: { en: 'Most successful smartwatch, health monitoring mainstream', zh: '最成功的智能手表，让健康监测成为主流' } },
        { year: 2016, name: 'AirPods', brand: 'Apple', category: { en: 'Audio', zh: '音频' }, inventor: 'Apple Team', price: '$159', impact: { en: 'Killed the headphone jack, TWS earbuds everywhere', zh: '杀死了耳机孔，真无线耳机无处不在' } },
        { year: 2016, name: 'Pokemon Go', brand: 'Niantic', category: { en: 'Gaming', zh: '游戏' }, inventor: 'John Hanke', price: 'Free', impact: { en: 'First mainstream AR game, $6B revenue', zh: '首款主流AR游戏，收入60亿美元' } },
        { year: 2017, name: 'Nintendo Switch', brand: 'Nintendo', category: { en: 'Gaming', zh: '游戏' }, inventor: 'Shinya Takahashi', price: '$299', impact: { en: 'Hybrid console revolution, 140M+ units', zh: '混合主机革命，销量超1.4亿' } },
        { year: 2017, name: 'iPhone X', brand: 'Apple', category: { en: 'Mobile', zh: '手机' }, inventor: 'Jony Ive', price: '$999', impact: { en: 'Face ID, notch design, killed home button', zh: 'Face ID、刘海设计，杀死了Home键' } },
        // 2020s
        { year: 2020, name: 'PlayStation 5', brand: 'Sony', category: { en: 'Gaming', zh: '游戏' }, inventor: 'Mark Cerny', price: '$499', impact: { en: 'Fastest selling console, SSD revolution', zh: '最快销售的主机，SSD革命' } },
        { year: 2020, name: 'Zoom', brand: 'Zoom', category: { en: 'Software', zh: '软件' }, inventor: 'Eric Yuan', price: 'Free', impact: { en: 'Pandemic essential, changed remote work forever', zh: '疫情必需品，永远改变了远程工作' } },
        { year: 2022, name: 'ChatGPT', brand: 'OpenAI', category: { en: 'AI', zh: 'AI' }, inventor: 'OpenAI Team', price: 'Free', impact: { en: 'AI goes mainstream, fastest growing app ever', zh: 'AI走向主流，史上增长最快的应用' } },
        { year: 2023, name: 'Vision Pro', brand: 'Apple', category: { en: 'Spatial', zh: '空间计算' }, inventor: 'Apple Team', price: '$3,499', impact: { en: 'Spatial computing begins, most advanced headset', zh: '空间计算开始，最先进的头显设备' } },
    ];

    const IMAGES = [
        'https://images.unsplash.com/photo-1517430816045-df4b7de35d1d?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1611000272963-a2944c00a52e?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1617802690992-15d93263d3a9?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800&q=80',
    ];

    return MILESTONE_DATA.map((m, idx) => ({
        id: `milestone_${m.year}_${idx}`,
        imageUrl: IMAGES[idx % IMAGES.length],
        launchDate: `${m.year}-01-01`,
        isClassic: true,
        stage: 'enterprise' as MakerStage,
        locales: {
            en: {
                name: m.name,
                brand: m.brand,
                category: m.category.en,
                priceEstimate: m.price,
                description: `A legendary ${m.category.en.toLowerCase()} that changed the world.`,
                buyingChannel: 'History',
                tags: ['Classic', 'Milestone', m.category.en],
                detail: { gallery: [], highlights: [], shipping: `${m.year}`, warranty: 'Expired', specs: [] },
                inventor: m.inventor,
                originalPrice: m.price,
                legacyImpact: m.impact.en,
                historicalNews: [
                    { date: `${m.year}-01-01`, headline: `${m.brand} launches ${m.name}`, source: 'Tech Archives' }
                ]
            },
            zh: {
                name: m.name,
                brand: m.brand,
                category: m.category.zh,
                priceEstimate: m.price,
                description: `改变世界的传奇${m.category.zh}。`,
                buyingChannel: '历史',
                tags: ['经典', '里程碑', m.category.zh],
                detail: { gallery: [], highlights: [], shipping: `${m.year}`, warranty: '已过保', specs: [] },
                inventor: m.inventor,
                originalPrice: m.price,
                legacyImpact: m.impact.zh,
                historicalNews: [
                    { date: `${m.year}-01-01`, headline: `${m.brand} 发布 ${m.name}`, source: '科技档案' }
                ]
            }
        }
    }));
};
