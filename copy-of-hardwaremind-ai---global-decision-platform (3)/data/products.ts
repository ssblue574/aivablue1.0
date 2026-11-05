import { LocalizedProductDefinition } from './types';

/**
 * 核心产品定义（真实/样板 SKU）。运行时由 getLatestDrops() 合并 mock 并刷新 launchDate。
 * 首页固定展示哪几款 → 改 data/homeShowcase.ts，不要在这里为首页单独删改条目。
 */
export const PRODUCT_LIBRARY: LocalizedProductDefinition[] = [
    {
        "id": "p_rabbit_r1",
        "name": "Rabbit R1",
        "manufacturer": "Rabbit Inc.",
        "launchDate": "2024-04-24",
        "price": "$199",
        "status": "released",
        "imageUrl": "/images/products/rabbit-r1.png",
        "category": "AI Assistant",
        "tags": ["LAM", "Teenage Engineering", "Voice First"],
        "isClassic": false,
        "survivalRate": 50,
        "riskLevel": "Moderate",
        "specs": {
            "Processor": "MediaTek Helio P35",
            "RAM": "4GB",
            "Storage": "128GB",
            "Display": "2.88\" Touchscreen",
            "Battery": "1000mAh"
        },
        "locales": {
            "en": {
                "name": "Rabbit R1",
                "brand": "Rabbit Inc.",
                "category": "AI Assistant",
                "priceEstimate": "$199",
                "buyingChannel": "Official",
                "tags": ["LAM", "Teenage Engineering", "Voice First"],
                "description": "The Rabbit R1 is a pocket-sized AI companion with a rotating camera and scroll wheel push-to-talk, built on a Large Action Model (LAM) to execute actions for you.",
                "strategy": "Deliver a post-app device that runs services on your behalf.",
                "performance": "Good for simple flows; app coverage still expanding.",
                "painPoints": "Battery and LAM coverage are early-stage.",
                "verdict": "Promising v1 for action-centric AI hardware.",
                "productivity": "Voice-first shortcuts for ride, food, music, and quick lookups.",
                "targetAudience": "Early adopters、开发者、想体验动作模型的极客。",
                "aivaReview": "硬件体验有辨识度，LAM 生态是关键变量。",
                "localizationIntel": "国内需代理，语音主要英文，社区在做汉化脚本。",
                "tacticalAnalysis": "短期看生态与续航，建议观望固件迭代；适合试水而非主力机。",
                "userIntel": "实测简单任务流畅，复杂场景偶有失败；电池半天左右需充电。",
                "coreFeatures": ["LAM 动作执行", "旋转摄像头", "滚轮 PTT", "离线听写（基础）"],
                "notableHighlights": ["动作模型代操作", "物理滚轮+PTT 交互", "口袋尺寸"],
                "detail": {
                    "gallery": [
                        "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1200&q=80",
                        "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&q=70",
                        "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600&q=60"
                    ],
                    "highlights": ["Rotating Camera", "Scroll Wheel PTT", "LAM Actions", "Basic offline dictation"],
                    "shipping": "Ships in 2-4 weeks",
                    "warranty": "1 Year",
                    "specs": [
                        { "label": "Processor", "value": "MediaTek Helio P35" },
                        { "label": "RAM", "value": "4GB" },
                        { "label": "Storage", "value": "128GB" },
                        { "label": "Battery", "value": "1000mAh (light use ~1 day)" }
                    ]
                }
            },
            "zh": {
                "name": "Rabbit R1 AI 掌上伴侣",
                "brand": "Rabbit Inc.",
                "category": "AI 助手",
                "priceEstimate": "¥1399",
                "buyingChannel": "官网",
                "tags": ["LAM", "Teenage Engineering", "语音优先"],
                "description": "Rabbit R1 是一款口袋级 AI 伴侣，配备旋转摄像头与实体滚轮，基于 LAM 大动作模型为您代办复杂任务。",
                "strategy": "用动作模型打造“后 App 时代”设备。",
                "performance": "简单任务顺滑，生态仍在扩充。",
                "painPoints": "续航与动作覆盖待迭代。",
                "verdict": "动作型 AI 硬件的有趣首秀。",
                "productivity": "语音驱动叫车/点单/查资料的快捷入口。",
                "targetAudience": "尝鲜族、开发者、内容创作者的随身副设备。",
                "aivaReview": "硬件交互新颖，核心看动作生态和续航。",
                "localizationIntel": "国内使用需代理，语音/界面英文为主；社区在做汉化脚本与快捷动作。",
                "tacticalAnalysis": "建议观望 1-2 次固件大更；适合作为副机体验，关键看 LAM 覆盖。",
                "userIntel": "早期用户反馈：简单流程好用，长时续航与应用覆盖需提升。",
                "coreFeatures": ["LAM 动作执行", "旋转摄像头", "滚轮一键通话", "基础离线听写"],
                "notableHighlights": ["动作模型代操作", "滚轮+PTT 物理交互", "口袋便携"],
                "detail": {
                    "gallery": [
                        "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1200&q=80",
                        "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&q=70",
                        "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600&q=60"
                    ],
                    "highlights": ["旋转摄像头", "滚轮一键通话", "LAM 动作模型", "基础离线听写"],
                    "shipping": "2-4 周",
                    "warranty": "1 年",
                    "specs": [
                        { "label": "处理器", "value": "MediaTek Helio P35" },
                        { "label": "内存", "value": "4GB" },
                        { "label": "存储", "value": "128GB" },
                        { "label": "电池", "value": "1000mAh（轻度全天）" }
                    ]
                }
            }
        },
        "purchaseChannels": [
            {
                "name": "Rabbit Official",
                "price": "$199",
                "url": "https://www.rabbit.tech/rabbit-r1",
                "isOfficial": true,
                "score": 9,
                "shippingInfo": "Ships in 2-4 weeks",
                "paymentMethods": ["Credit Card", "Apple Pay", "PayPal"],
                "pros": ["官方保修", "最新固件优先推送"],
                "cons": ["国际运费自理"]
            },
            {
                "name": "B&H",
                "price": "$199",
                "url": "https://www.bhphotovideo.com/",
                "isOfficial": false,
                "score": 8,
                "shippingInfo": "US 3-5 days",
                "paymentMethods": ["Credit Card", "PayPal"],
                "pros": ["本土物流快", "偶有促销"],
                "cons": ["库存波动"]
            },
            {
                "name": "Amazon US",
                "price": "$199",
                "url": "https://www.amazon.com/",
                "isOfficial": false,
                "score": 7,
                "shippingInfo": "Prime 2-day (US)",
                "paymentMethods": ["Credit Card", "Amazon Pay"],
                "pros": ["配送快", "退换货便捷"],
                "cons": ["库存有限，地区限制"]
            }
        ],
        "chinaAdaptability": {
            "network": { "score": 4, "description": "需网络，国内建议代理", "vpnRequired": true },
            "language": { "score": 5, "description": "英文为主，社区汉化", "supportLevel": "community" },
            "warranty": { "score": 4, "description": "海外保修为主", "vpnRequired": false },
            "ecosystem": { "score": 5, "description": "USB-C 充电，适配 220V", "voltageCompatible": true }
        }
    },
    {
        "id": "p_humane_ai_pin",
        "name": "Humane Ai Pin",
        "manufacturer": "Humane",
        "launchDate": "2024-04-11",
        "price": "$699 + $24/mo",
        "status": "released",
        "imageUrl": "/images/products/humane-ai-pin.png",
        "category": "Wearable",
        "tags": ["Laser Projection", "Voice OS", "Privacy"],
        "isClassic": false,
        "survivalRate": 50,
        "riskLevel": "Moderate",
        "specs": {
            "Processor": "Snapdragon",
            "Display": "Laser Ink Display",
            "Weight": "34g (Main) + 20g (Booster)",
            "Camera": "13MP Ultra Wide"
        },
        "locales": {
            "en": {
                "name": "Humane Ai Pin",
                "brand": "Humane",
                "category": "Wearable",
                "priceEstimate": "$699",
                "buyingChannel": "Official",
                "tags": ["Laser Projection", "Voice OS", "Privacy"],
                "description": "Humane Ai Pin is a screenless wearable device that projects information onto your hand. It features a trust light and privacy-first design.",
                "strategy": "To reduce screen time and enhance presence.",
                "performance": "Innovative but slow.",
                "painPoints": "Overheating issues reported.",
                "verdict": "A futuristic concept with first-gen hurdles.",
                "detail": {
                    "gallery": [],
                    "highlights": ["Laser Projection", "Trust Light", "Magnetic Battery"],
                    "shipping": "In Stock",
                    "warranty": "1 Year",
                    "specs": [
                        { "label": "Processor", "value": "Snapdragon" },
                        { "label": "Display", "value": "Laser Ink" }
                    ]
                }
            },
            "zh": {
                "name": "Humane Ai Pin 投影徽章",
                "brand": "Humane",
                "category": "可穿戴设备",
                "priceEstimate": "¥4999",
                "buyingChannel": "官网",
                "tags": ["激光投影", "语音系统", "隐私"],
                "description": "Humane Ai Pin 是开创性的无屏可穿戴设备，以激光将信息投射于掌心。内置信任灯，秉持隐私优先的设计理念。",
                "strategy": "减少屏幕时间，增强临场感。",
                "performance": "创新但反应慢。",
                "painPoints": "有报告称存在过热问题。",
                "verdict": "具有第一代障碍的未来主义概念。",
                "detail": {
                    "gallery": [],
                    "highlights": ["激光投影", "信任灯", "磁吸电池"],
                    "shipping": "现货",
                    "warranty": "1 年",
                    "specs": [
                        { "label": "处理器", "value": "Snapdragon" },
                        { "label": "显示", "value": "激光墨水" }
                    ]
                }
            }
        },
        "purchaseChannels": [
            {
                "name": "Humane Official",
                "price": "$699",
                "url": "https://hu.ma.ne/aipin",
                "isOfficial": true,
                "score": 8,
                "shippingInfo": "In Stock",
                "paymentMethods": ["Credit Card"],
                "pros": ["Official Warranty", "Accessories"],
                "cons": ["Subscription Required"]
            }
        ],
        "chinaAdaptability": {
            "network": { "score": 5, "description": "需要网络支持", "vpnRequired": true },
            "language": { "score": 5, "description": "支持有限", "supportLevel": "community" },
            "warranty": { "score": 5, "description": "视地区而定", "vpnRequired": false },
            "ecosystem": { "score": 5, "description": "一般", "voltageCompatible": true }
        }
    },
    {
        "id": "p_friend_necklace",
        "name": "Friend",
        "manufacturer": "Based Hardware",
        "launchDate": "2024-07-30",
        "price": "$99",
        "status": "preorder",
        "imageUrl": "/images/products/friend-necklace.png",
        "category": "Wearable",
        "tags": ["Open Source", "Companion", "Audio"],
        "isClassic": false,
        "survivalRate": 50,
        "riskLevel": "Low",
        "specs": {
            "Battery": "24h+",
            "Connectivity": "Bluetooth LE",
            "Audio": "Near-field Mic",
            "Platform": "Open Source"
        },
        "locales": {
            "en": {
                "name": "Friend",
                "brand": "Friend",
                "category": "Wearable",
                "priceEstimate": "$99",
                "buyingChannel": "Official",
                "tags": ["Open Source", "Companion", "Audio"],
                "description": "Friend is an open-source AI pendant that listens, summarizes, and can be customized by the community.",
                "strategy": "Community-driven companion with hackable firmware.",
                "performance": "Lightweight, good standby; AI relies on phone.",
                "painPoints": "Needs phone connectivity; firmware early.",
                "verdict": "Best for makers who want a hackable AI wearable.",
                "productivity": "语音笔记、轻量摘要、可自定义的开源工作流。",
                "targetAudience": "极客/开发者/创客、开源社区用户。",
                "aivaReview": "硬件简单但可玩性高，适合想自定义 AI 流程的人。",
                "localizationIntel": "依赖手机算力，国内可直接使用；社区正在补中文 TTS/ASR。",
                "tacticalAnalysis": "适合当作可编程节点而非成品消费设备；关注固件迭代与社区插件。",
                "userIntel": "社区反馈续航不错，体验取决于手机网络与自定义脚本质量。",
                "coreFeatures": ["开源固件", "24h+ 续航", "社区插件", "蓝牙直连手机"],
                "notableHighlights": ["开源可刷固件", "社区插件生态", "轻量长续航"],
                "detail": {
                    "gallery": [
                        "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1200&q=80",
                        "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=70"
                    ],
                    "highlights": ["Open firmware", "24h+ battery", "Community plugins"],
                    "shipping": "Pre-order (batch shipping)",
                    "warranty": "6 months (official)",
                    "specs": [
                        { "label": "Battery", "value": "24h+" },
                        { "label": "Connectivity", "value": "Bluetooth LE" },
                        { "label": "Audio", "value": "Near-field mic, basic ANC" }
                    ]
                }
            },
            "zh": {
                "name": "Friend AI 吊坠",
                "brand": "Friend",
                "category": "可穿戴设备",
                "priceEstimate": "¥699",
                "buyingChannel": "官网",
                "tags": ["开源", "伴侣", "音频"],
                "description": "Friend 是一款开源 AI 吊坠，能够时刻聆听并摘要关键信息，更支持社区深度的功能定制。",
                "strategy": "社区驱动的可黑客化伴侣。",
                "performance": "待机不错，AI 依赖手机算力。",
                "painPoints": "依赖手机连接，固件早期。",
                "verdict": "适合想折腾的极客与开发者。",
                "productivity": "语音笔记与摘要，可编程工作流。",
                "targetAudience": "极客、开发者、开源社区用户。",
                "aivaReview": "玩法弹性大，适合折腾；普通消费者需准备好配置成本。",
                "localizationIntel": "可直接在国内用，中文体验取决于社区模型与手机链路。",
                "tacticalAnalysis": "把它当可编程节点，核心在社区生态。",
                "userIntel": "用户称续航好，功能需自行配置，固件仍在快迭代。",
                "coreFeatures": ["开源固件", "24h+ 续航", "社区插件", "蓝牙直连手机"],
                "notableHighlights": ["开源可刷", "社区插件", "续航长"],
                "detail": {
                    "gallery": [
                        "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1200&q=80",
                        "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=70"
                    ],
                    "highlights": ["开源固件", "24h+ 续航", "社区插件"],
                    "shipping": "预购（分批发货）",
                    "warranty": "6 个月（官网）",
                    "specs": [
                        { "label": "电池", "value": "24h+" },
                        { "label": "连接", "value": "Bluetooth LE" },
                        { "label": "音频", "value": "近场麦克风 + 基础降噪" }
                    ]
                }
            }
        },
        "purchaseChannels": [
            {
                "name": "Based Hardware Official",
                "price": "$99",
                "url": "https://basedhardware.com/friend",
                "isOfficial": true,
                "score": 8,
                "shippingInfo": "Pre-order, ships in waves",
                "paymentMethods": ["Credit Card", "PayPal"],
                "pros": ["开源固件", "活跃社区"],
                "cons": ["排队发货", "需手机算力"]
            },
            {
                "name": "Crowd Supply (Campaign)",
                "price": "$99",
                "url": "https://www.crowdsupply.com/",
                "isOfficial": false,
                "score": 7,
                "shippingInfo": "Campaign fulfillment",
                "paymentMethods": ["Credit Card", "PayPal"],
                "pros": ["开发者文档齐全"],
                "cons": ["履约时间不确定"]
            },
            {
                "name": "Tindie (Community)",
                "price": "$99",
                "url": "https://www.tindie.com/",
                "isOfficial": false,
                "score": 6,
                "shippingInfo": "Community shipping",
                "paymentMethods": ["Credit Card", "PayPal"],
                "pros": ["社区版周边/配件"],
                "cons": ["供货不稳定"]
            }
        ],
        "chinaAdaptability": {
            "network": { "score": 6, "description": "依赖手机网络，国内可用", "vpnRequired": false },
            "language": { "score": 6, "description": "社区可汉化", "supportLevel": "community" },
            "warranty": { "score": 4, "description": "海外保修为主", "vpnRequired": false },
            "ecosystem": { "score": 6, "description": "USB-C 充电，配件易获得", "voltageCompatible": true }
        }
    },
    {
        "id": "p_brilliant_frame",
        "name": "Frame",
        "manufacturer": "Brilliant Labs",
        "launchDate": "2024-05-15",
        "price": "$349",
        "status": "released",
        "imageUrl": "/images/products/brilliant-frame.png",
        "category": "AR Glasses",
        "tags": ["Multimodal", "Open Source", "Lightweight"],
        "isClassic": false,
        "survivalRate": 50,
        "riskLevel": "Moderate",
        "specs": {
            "Display": "640x400 MicroOLED",
            "Weight": "39g",
            "Camera": "720p",
            "Battery": "All-day (with Mister Power)"
        },
        "locales": {
            "en": {
                "name": "Frame",
                "brand": "Brilliant Labs",
                "category": "AR Glasses",
                "priceEstimate": "$349",
                "buyingChannel": "Official",
                "tags": ["Multimodal", "Open Source", "Lightweight"],
                "description": "Frame are lightweight open AR glasses with MicroOLED and camera, fully hackable for builders and translators.",
                "strategy": "Give makers an open AR canvas.",
                "performance": "Great for prototyping; consumer UX minimal.",
                "painPoints": "Requires coding; optics limited outdoors.",
                "verdict": "Excellent dev kit, not for casual users.",
                "productivity": "实时翻译、视觉查找、代码/原型调试的轻量眼镜端。",
                "targetAudience": "开发者、创客、翻译与视觉搜索场景用户。",
                "aivaReview": "硬件轻量且开放，适合做 AR 原型；消费级体验需自行打磨。",
                "localizationIntel": "国内可直连，英文为主；社区有中文 UI/语音方案。",
                "tacticalAnalysis": "把它当开发板而非终端产品，关注 SDK 与镜片适配。",
                "userIntel": "用户反馈：室内效果好，户外强光观感一般；需编程能力。",
                "coreFeatures": ["39g 轻量机身", "MicroOLED 显示", "内置摄像头", "开源 SDK"],
                "notableHighlights": ["39g 超轻", "开源 SDK/硬件", "摄像头+MicroOLED 组合"],
                "detail": {
                    "gallery": [
                        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=1200&q=80",
                        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=70"
                    ],
                    "highlights": ["39g lightweight", "Open SDK", "Camera + MicroOLED"],
                    "shipping": "In Stock (US/EU)",
                    "warranty": "1 Year",
                    "specs": [
                        { "label": "Weight", "value": "39g" },
                        { "label": "Display", "value": "640x400 MicroOLED" },
                        { "label": "Camera", "value": "720p" }
                    ]
                }
            },
            "zh": {
                "name": "Frame 轻量级 AR 眼镜",
                "brand": "Brilliant Labs",
                "category": "AR 眼镜",
                "priceEstimate": "¥2499",
                "buyingChannel": "官网",
                "tags": ["多模态", "开源", "轻量级"],
                "description": "Frame 专为开发者打造的轻量级开源 AR 眼镜，集成 MicroOLED 与摄像头，赋予创客无限的可编程空间。",
                "strategy": "为创客提供开放的 AR 画布。",
                "performance": "原型体验佳，消费级体验简约。",
                "painPoints": "需编程，强光环境观感一般。",
                "verdict": "创客/开发者首选，不建议小白。",
                "productivity": "轻量翻译/视觉检索/代码调试的随身屏。",
                "targetAudience": "开发者、创客、翻译/视觉搜索需求的技术用户。",
                "aivaReview": "开放度高，可玩性强；对小白不友好。",
                "localizationIntel": "英文为主，可刷社区中文 UI；国内直连可用。",
                "tacticalAnalysis": "定位 Dev Kit，核心看 SDK 和镜片配件。",
                "userIntel": "室内体验佳，户外强光需遮光；需编程基础。",
                "coreFeatures": ["39g 轻量", "MicroOLED", "摄像头", "开源 SDK"],
                "notableHighlights": ["超轻 39g", "开源可编程", "摄像头+MicroOLED"],
                "detail": {
                    "gallery": [
                        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=1200&q=80",
                        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=70"
                    ],
                    "highlights": ["39g 轻量", "开源 SDK", "摄像头+MicroOLED"],
                    "shipping": "现货（美/欧仓）",
                    "warranty": "1 年",
                    "specs": [
                        { "label": "重量", "value": "39g" },
                        { "label": "显示", "value": "640x400 MicroOLED" },
                        { "label": "相机", "value": "720p" }
                    ]
                }
            }
        },
        "purchaseChannels": [
            {
                "name": "Brilliant Labs",
                "price": "$349",
                "url": "https://brilliant.xyz/products/frame",
                "isOfficial": true,
                "score": 9,
                "shippingInfo": "In Stock (US/EU warehouses)",
                "paymentMethods": ["Credit Card", "PayPal"],
                "pros": ["官方配镜支持", "开发文档齐全"],
                "cons": ["度数镜片需另购"]
            },
            {
                "name": "Crowd Supply Dev Bundle",
                "price": "$379",
                "url": "https://www.crowdsupply.com/",
                "isOfficial": false,
                "score": 8,
                "shippingInfo": "Campaign fulfillment",
                "paymentMethods": ["Credit Card", "PayPal"],
                "pros": ["开发者套件", "配件齐全"],
                "cons": ["履约周期不定"]
            },
            {
                "name": "Amazon US (Third-party)",
                "price": "$349",
                "url": "https://www.amazon.com/",
                "isOfficial": false,
                "score": 7,
                "shippingInfo": "Prime 2-day (US)",
                "paymentMethods": ["Credit Card", "Amazon Pay"],
                "pros": ["配送快", "退换货便捷"],
                "cons": ["库存与价格波动"]
            }
        ],
        "chinaAdaptability": {
            "network": { "score": 5, "description": "需要网络支持", "vpnRequired": true },
            "language": { "score": 5, "description": "支持有限", "supportLevel": "community" },
            "warranty": { "score": 5, "description": "视地区而定", "vpnRequired": false },
            "ecosystem": { "score": 5, "description": "一般", "voltageCompatible": true }
        }
    },
    {
        "id": "p_limitless_pendant",
        "name": "Limitless Pendant",
        "manufacturer": "Limitless",
        "launchDate": "2024-08-01",
        "price": "$99",
        "status": "preorder",
        "imageUrl": "/images/products/limitless-pendant.png",
        "category": "Wearable",
        "tags": ["Productivity", "Meeting Recorder", "Privacy"],
        "isClassic": false,
        "survivalRate": 50,
        "riskLevel": "Low",
        "specs": {
            "Battery": "100 hours",
            "Mic": "Beam-forming array",
            "Connectivity": "Wi-Fi & Bluetooth",
            "Storage": "Cloud Sync"
        },
        "locales": {
            "en": {
                "name": "Limitless Pendant",
                "brand": "Limitless",
                "category": "Wearable",
                "priceEstimate": "$99",
                "buyingChannel": "Official",
                "tags": ["Productivity", "Meeting Recorder", "Privacy"],
                "description": "Limitless Pendant is a privacy-first meeting recorder with cloud transcription, summaries, and optional redaction.",
                "strategy": "Own your memory with encrypted capture.",
                "performance": "Accurate transcripts; relies on cloud.",
                "painPoints": "Subscription for AI features.",
                "verdict": "A practical meeting assistant.",
                "productivity": "一键录会、云端转写/摘要、自动敏感遮挡。",
                "targetAudience": "频繁会议/访谈的职场人士、记者、研究者。",
                "aivaReview": "录音隐私友好，核心取决于云服务质量与订阅成本。",
                "localizationIntel": "国内使用需代理，英文识别佳，中文表现待实测。",
                "tacticalAnalysis": "适合作为会议伴侣；若重度依赖需评估订阅与延迟。",
                "userIntel": "早期用户称转写准确，偶有上传延迟；硬件佩戴舒适。",
                "coreFeatures": ["加密录音", "云转写/摘要", "物理静音键", "敏感遮挡"],
                "notableHighlights": ["端到端加密录音", "云转写/摘要", "物理静音键"],
                "detail": {
                    "gallery": [
                        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&q=80",
                        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=70"
                    ],
                    "highlights": ["Encrypted recording", "Cloud transcripts & summaries", "Physical mute switch"],
                    "shipping": "Pre-order",
                    "warranty": "1 Year",
                    "specs": [
                        { "label": "Battery", "value": "100 hours" },
                        { "label": "Mic", "value": "Beam-forming array" },
                        { "label": "Connectivity", "value": "Wi‑Fi / Bluetooth" }
                    ]
                }
            },
            "zh": {
                "name": "Limitless 会议伴侣",
                "brand": "Limitless",
                "category": "可穿戴设备",
                "priceEstimate": "¥699",
                "buyingChannel": "官网",
                "tags": ["生产力", "会议记录", "隐私"],
                "description": "Limitless Pendant 是隐私至上的会议伴侣，提供精准的云端转写、智能摘要及敏感信息自动遮蔽功能。",
                "strategy": "用加密录音保存记忆。",
                "performance": "转写准确，依赖云端。",
                "painPoints": "高级功能需订阅。",
                "verdict": "实用的会议记录助手。",
                "productivity": "一键录会/采访，自动转写与摘要。",
                "targetAudience": "会议密集人群、记者、研究者、法律/咨询行业。",
                "aivaReview": "隐私做得好，订阅和网络决定体验上限。",
                "localizationIntel": "国内需代理，中文识别需自行验证；USB-C 充电适配 220V。",
                "tacticalAnalysis": "重度会议可提升效率；若网络不稳可备离线录音备份。",
                "userIntel": "用户好评转写准确，偶有同步延迟；佩戴舒适。",
                "coreFeatures": ["加密录音", "云转写/摘要", "物理静音", "敏感遮挡"],
                "notableHighlights": ["加密录音", "云摘要", "物理静音"],
                "detail": {
                    "gallery": [
                        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&q=80",
                        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=70"
                    ],
                    "highlights": ["加密录音", "云转写/摘要", "物理静音"],
                    "shipping": "预购",
                    "warranty": "1 年",
                    "specs": [
                        { "label": "电池", "value": "100 小时" },
                        { "label": "麦克风", "value": "阵列波束成形" },
                        { "label": "连接", "value": "Wi‑Fi / 蓝牙" }
                    ]
                }
            }
        },
        "purchaseChannels": [
            {
                "name": "Limitless Official",
                "price": "$99",
                "url": "https://www.limitless.ai/pendant",
                "isOfficial": true,
                "score": 9,
                "shippingInfo": "Pre-order",
                "paymentMethods": ["Credit Card", "Apple Pay"],
                "pros": ["隐私与云端套餐一体", "官方固件更新快"],
                "cons": ["国际运费与订阅成本"]
            },
            {
                "name": "Limitless EU Store",
                "price": "€119",
                "url": "https://www.limitless.ai/pendant",
                "isOfficial": true,
                "score": 8,
                "shippingInfo": "EU 5-8 days",
                "paymentMethods": ["Credit Card"],
                "pros": ["欧盟本地履约"],
                "cons": ["含税价格更高"]
            },
            {
                "name": "Amazon US (3P)",
                "price": "$109",
                "url": "https://www.amazon.com/",
                "isOfficial": false,
                "score": 7,
                "shippingInfo": "Prime 2-day (US)",
                "paymentMethods": ["Credit Card", "Amazon Pay"],
                "pros": ["配送快", "退换货便捷"],
                "cons": ["第三方库存波动"]
            }
        ],
        "chinaAdaptability": {
            "network": { "score": 4, "description": "需网络，转写走海外云", "vpnRequired": true },
            "language": { "score": 6, "description": "支持英文，中文识别待测", "supportLevel": "community" },
            "warranty": { "score": 4, "description": "海外保修", "vpnRequired": false },
            "ecosystem": { "score": 6, "description": "USB-C 充电，适配 220V", "voltageCompatible": true }
        }
    },
    {
        "id": "p_tab_ai",
        "name": "Tab",
        "manufacturer": "Avi Schiffmann",
        "launchDate": "2024-09-01",
        "price": "$600",
        "status": "concept",
        "imageUrl": "/images/products/tab.png",
        "category": "Wearable",
        "tags": ["Companion", "Privacy", "Design"],
        "isClassic": false,
        "survivalRate": 50,
        "riskLevel": "Moderate",
        "specs": {
            "Battery": "30h",
            "Mic": "High fidelity",
            "AI": "Local + Cloud",
            "Material": "Fabric & Metal"
        },
        "locales": {
            "en": {
                "name": "Tab",
                "brand": "Tab",
                "category": "Wearable",
                "priceEstimate": "$600",
                "buyingChannel": "Official",
                "tags": ["Companion", "Privacy", "Design"],
                "description": "Tab is a wearable AI companion concept. It aims to understand you and your relationships.",
                "strategy": "Emotional AI.",
                "performance": "Unknown.",
                "painPoints": "High price.",
                "verdict": "An interesting concept.",
                "detail": {
                    "gallery": [],
                    "highlights": ["Design", "Companion", "Privacy"],
                    "shipping": "Waitlist",
                    "warranty": "N/A",
                    "specs": [
                        { "label": "Material", "value": "Fabric & Metal" }
                    ]
                }
            },
            "zh": {
                "name": "Tab 可穿戴情感伴侣",
                "brand": "Tab",
                "category": "可穿戴设备",
                "priceEstimate": "¥4299",
                "buyingChannel": "官网",
                "tags": ["伴侣", "隐私", "设计"],
                "description": "Tab 是一款概念级可穿戴 AI 伴侣，旨在通过持续感知，深刻理解您与世界的联结。",
                "strategy": "情感 AI。",
                "performance": "未知。",
                "painPoints": "价格高。",
                "verdict": "一个有趣的概念。",
                "detail": {
                    "gallery": [],
                    "highlights": ["设计", "伴侣", "隐私"],
                    "shipping": "候补名单",
                    "warranty": "无",
                    "specs": [
                        { "label": "材质", "value": "织物和金属" }
                    ]
                }
            }
        },
        "purchaseChannels": [
            {
                "name": "Tab Official",
                "price": "$600",
                "url": "https://www.tab.us",
                "isOfficial": true,
                "score": 7,
                "shippingInfo": "Waitlist",
                "paymentMethods": ["Credit Card"],
                "pros": ["Unique Design", "Privacy"],
                "cons": ["Concept Stage"]
            }
        ],
        "chinaAdaptability": {
            "network": { "score": 5, "description": "需要网络支持", "vpnRequired": true },
            "language": { "score": 5, "description": "支持有限", "supportLevel": "community" },
            "warranty": { "score": 5, "description": "视地区而定", "vpnRequired": false },
            "ecosystem": { "score": 5, "description": "一般", "voltageCompatible": true }
        }
    },
    {
        "id": "p_rewind_pendant",
        "name": "Rewind Pendant",
        "manufacturer": "Rewind",
        "launchDate": "Cancelled",
        "price": "$59",
        "status": "cancelled",
        "imageUrl": "/images/products/rewind-pendant.png",
        "category": "Wearable",
        "tags": ["Memory", "Mac", "Cancelled"],
        "isClassic": false,
        "survivalRate": 0,
        "riskLevel": "Safe",
        "specs": {
            "Battery": "Multi-day",
            "Form": "Necklace",
            "Function": "Audio Capture",
            "Status": "Discontinued"
        },
        "locales": {
            "en": {
                "name": "Rewind Pendant",
                "brand": "Rewind",
                "category": "Wearable",
                "priceEstimate": "$59/mo",
                "buyingChannel": "N/A",
                "tags": ["Memory", "AI", "Privacy"],
                "description": "The Rewind Pendant was planned as a continuous audio capture necklace for private recall. It was cancelled; users are pointed to Limitless Pendant instead.",
                "strategy": "Personal recall device with local-first approach (cancelled).",
                "performance": "Not shipped; no production units.",
                "painPoints": "Cancelled; no support; no hardware.",
                "verdict": "Cancelled concept; see Limitless Pendant.",
                "productivity": "（已取消）原计划用于全程录音+搜索。",
                "targetAudience": "无（项目终止）。",
                "aivaReview": "已取消，关注 Limitless Pendant 作为替代。",
                "localizationIntel": "无实际产品；无需考虑本土化。",
                "tacticalAnalysis": "不再投入，转向 Limitless 生态。",
                "userIntel": "无量产用户。",
                "coreFeatures": ["已取消项目"],
                "notableHighlights": ["项目已取消", "后继产品：Limitless Pendant"],
                "detail": {
                    "gallery": [
                        "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=1200&q=80",
                        "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=70"
                    ],
                    "highlights": ["Cancelled", "Planned audio capture", "Local-first vision"],
                    "shipping": "N/A (cancelled)",
                    "warranty": "N/A",
                    "specs": [
                        { "label": "Status", "value": "Cancelled" },
                        { "label": "Successor", "value": "Limitless Pendant" }
                    ]
                }
            },
            "zh": {
                "name": "Rewind 记忆吊坠",
                "brand": "Rewind",
                "category": "可穿戴设备",
                "priceEstimate": "¥399/月",
                "buyingChannel": "无",
                "tags": ["记忆", "AI", "隐私"],
                "description": "Rewind Pendant 原计划作为持续录音的吊坠，但已取消，官方推荐转向 Limitless Pendant。",
                "strategy": "本地化记忆设备（已取消）。",
                "performance": "未量产，无实际表现。",
                "painPoints": "项目终止，无售后。",
                "verdict": "已取消的概念产品，可关注 Limitless Pendant。",
                "productivity": "（已取消）原计划全程录音+搜索。",
                "targetAudience": "无（项目终止）。",
                "aivaReview": "已取消，转看 Limitless Pendant。",
                "localizationIntel": "无产品。",
                "tacticalAnalysis": "不建议等待，直接选择替代品。",
                "userIntel": "无量产用户。",
                "coreFeatures": ["已取消项目"],
                "notableHighlights": ["项目已取消", "后继产品：Limitless Pendant"],
                "detail": {
                    "gallery": [
                        "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=1200&q=80",
                        "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=70"
                    ],
                    "highlights": ["已取消项目", "计划中的音频捕捉", "后继：Limitless Pendant"],
                    "shipping": "无（已取消）",
                    "warranty": "无",
                    "specs": [
                        { "label": "状态", "value": "已取消" },
                        { "label": "替代方案", "value": "Limitless Pendant" }
                    ]
                }
            }
        },
        "purchaseChannels": [
            {
                "name": "N/A (Cancelled)",
                "price": "$0",
                "url": "https://www.rewind.ai/",
                "isOfficial": true,
                "score": 0,
                "shippingInfo": "Cancelled",
                "paymentMethods": [],
                "pros": ["项目信息保留"],
                "cons": ["不再发售，跳转至 Limitless"]
            },
            {
                "name": "Limitless Official (Successor)",
                "price": "$99",
                "url": "https://www.limitless.ai/pendant",
                "isOfficial": true,
                "score": 9,
                "shippingInfo": "Pre-order",
                "paymentMethods": ["Credit Card", "Apple Pay"],
                "pros": ["官方后继产品"],
                "cons": ["需订阅，国际运费"]
            },
            {
                "name": "Amazon US (Info)",
                "price": "$0",
                "url": "https://www.amazon.com/",
                "isOfficial": false,
                "score": 1,
                "shippingInfo": "N/A",
                "paymentMethods": ["Credit Card"],
                "pros": ["仅供历史查询"],
                "cons": ["无货，跳转后继品"]
            }
        ],
        "chinaAdaptability": {
            "network": { "score": 0, "description": "已取消", "vpnRequired": false },
            "language": { "score": 0, "description": "已取消", "supportLevel": "none" },
            "warranty": { "score": 0, "description": "已取消", "vpnRequired": false },
            "ecosystem": { "score": 0, "description": "已取消", "voltageCompatible": false }
        }
    },
    {
        "id": "p_tp7",
        "name": "TP-7",
        "manufacturer": "Teenage Engineering",
        "launchDate": "2023-05-10",
        "price": "$1499",
        "status": "released",
        "imageUrl": "/images/products/tp7.png",
        "category": "Audio",
        "tags": ["Design", "Field Recorder", "Premium"],
        "isClassic": false,
        "survivalRate": 50,
        "riskLevel": "Safe",
        "specs": {
            "Storage": "128GB",
            "Battery": "7h",
            "Mic": "Internal MEMS",
            "Connectivity": "USB-C, BT, MFi"
        },
        "locales": {
            "en": {
                "name": "TP-7",
                "brand": "Teenage Engineering",
                "category": "Audio",
                "priceEstimate": "$1499",
                "buyingChannel": "Official",
                "tags": ["Design", "Field Recorder", "Premium"],
                "description": "TP-7 is a premium field recorder with a motorized tape reel. It offers a unique tactile experience for recording.",
                "strategy": "Premium design.",
                "performance": "High quality audio.",
                "painPoints": "Expensive.",
                "verdict": "A beautiful recorder.",
                "detail": {
                    "gallery": [],
                    "highlights": ["Motorized Reel", "Tactile", "Premium"],
                    "shipping": "In Stock",
                    "warranty": "1 Year",
                    "specs": [
                        { "label": "Storage", "value": "128GB" }
                    ]
                }
            },
            "zh": {
                "name": "TP-7 极简机械录音机",
                "brand": "Teenage Engineering",
                "category": "音频设备",
                "priceEstimate": "¥10999",
                "buyingChannel": "官网",
                "tags": ["设计", "录音机", "高端"],
                "description": "TP-7 是一款极具机械美感的旗舰级现场录音机。标志性的电动磁带轮设计，为数字录音带来久违的物理触感。",
                "strategy": "高端设计。",
                "performance": "高质量音频。",
                "painPoints": "昂贵。",
                "verdict": "一款漂亮的录音机。",
                "detail": {
                    "gallery": [],
                    "highlights": ["电动卷轴", "触觉", "高端"],
                    "shipping": "现货",
                    "warranty": "1 年",
                    "specs": [
                        { "label": "存储", "value": "128GB" }
                    ]
                }
            }
        },
        "purchaseChannels": [
            {
                "name": "Teenage Engineering",
                "price": "$1499",
                "url": "https://teenage.engineering/products/tp-7",
                "isOfficial": true,
                "score": 10,
                "shippingInfo": "In Stock",
                "paymentMethods": ["Credit Card", "PayPal"],
                "pros": ["Direct from Manufacturer", "Design Icon"],
                "cons": ["Premium Price"]
            }
        ],
        "chinaAdaptability": {
            "network": { "score": 5, "description": "需要网络支持", "vpnRequired": false },
            "language": { "score": 5, "description": "支持有限", "supportLevel": "community" },
            "warranty": { "score": 5, "description": "视地区而定", "vpnRequired": false },
            "ecosystem": { "score": 5, "description": "一般", "voltageCompatible": true }
        }
    },
    {
        "id": "p_cm15",
        "name": "CM-15",
        "manufacturer": "Teenage Engineering",
        "launchDate": "2023-06-20",
        "price": "$1199",
        "status": "released",
        "imageUrl": "/images/products/cm15.png",
        "category": "Audio",
        "tags": ["Microphone", "Studio", "Portable"],
        "isClassic": false,
        "survivalRate": 50,
        "riskLevel": "Safe",
        "specs": {
            "Type": "Large-diaphragm condenser",
            "ADC": "ESS Sabre ES9822Q PRO",
            "Output": "USB-C, 3.5mm, Mini-XLR",
            "Battery": "10h"
        },
        "locales": {
            "en": {
                "name": "CM-15",
                "brand": "Teenage Engineering",
                "category": "Audio",
                "priceEstimate": "$1199",
                "buyingChannel": "Official",
                "tags": ["Microphone", "Studio", "Portable"],
                "description": "CM-15 is a portable studio microphone. It features multiple outputs and a compact design.",
                "strategy": "Portable professional audio.",
                "performance": "Studio quality.",
                "painPoints": "Expensive.",
                "verdict": "A great portable mic.",
                "detail": {
                    "gallery": [],
                    "highlights": ["Portable", "Studio Quality", "Multiple Outputs"],
                    "shipping": "In Stock",
                    "warranty": "1 Year",
                    "specs": [
                        { "label": "Type", "value": "Condenser" }
                    ]
                }
            },
            "zh": {
                "name": "CM-15 便携录音室麦克风",
                "brand": "Teenage Engineering",
                "category": "音频设备",
                "priceEstimate": "¥8999",
                "buyingChannel": "官网",
                "tags": ["麦克风", "录音棚", "便携"],
                "description": "CM-15 是一款口袋里的录音室级麦克风。精巧机身下蕴含专业级音质，支持多种专业输出接口。",
                "strategy": "便携式专业音频。",
                "performance": "录音室质量。",
                "painPoints": "昂贵。",
                "verdict": "一款出色的便携式麦克风。",
                "detail": {
                    "gallery": [],
                    "highlights": ["便携", "录音室质量", "多种输出"],
                    "shipping": "现货",
                    "warranty": "1 年",
                    "specs": [
                        { "label": "类型", "value": "电容式" }
                    ]
                }
            }
        },
        "purchaseChannels": [
            {
                "name": "Teenage Engineering",
                "price": "$1199",
                "url": "https://teenage.engineering/products/cm-15",
                "isOfficial": true,
                "score": 10,
                "shippingInfo": "In Stock",
                "paymentMethods": ["Credit Card"],
                "pros": ["Pro Quality", "Versatile Connectivity"],
                "cons": ["Price"]
            }
        ],
        "chinaAdaptability": {
            "network": { "score": 5, "description": "需要网络支持", "vpnRequired": false },
            "language": { "score": 5, "description": "支持有限", "supportLevel": "community" },
            "warranty": { "score": 5, "description": "视地区而定", "vpnRequired": false },
            "ecosystem": { "score": 5, "description": "一般", "voltageCompatible": true }
        }
    },
    {
        "id": "p_nothing_phone_2a",
        "name": "Nothing Phone (2a)",
        "manufacturer": "Nothing",
        "launchDate": "2024-03-05",
        "price": "$349",
        "status": "released",
        "imageUrl": "/images/products/nothing-phone-2a.png",
        "category": "Smartphone",
        "tags": ["Budget", "Design", "Glyph"],
        "isClassic": false,
        "survivalRate": 50,
        "riskLevel": "Low",
        "specs": {
            "Processor": "Dimensity 7200 Pro",
            "Display": "120Hz AMOLED",
            "Battery": "5000mAh",
            "Charging": "45W"
        },
        "locales": {
            "en": {
                "name": "Nothing Phone (2a)",
                "brand": "Nothing",
                "category": "Smartphone",
                "priceEstimate": "$349",
                "buyingChannel": "Official",
                "tags": ["Budget", "Design", "Glyph"],
                "description": "Nothing Phone (2a) is a budget-friendly smartphone with a unique design. It features the Glyph interface.",
                "strategy": "Budget design phone.",
                "performance": "Good for the price.",
                "painPoints": "Plastic build.",
                "verdict": "A good budget option.",
                "detail": {
                    "gallery": [],
                    "highlights": ["Glyph Interface", "Unique Design", "Budget Friendly"],
                    "shipping": "In Stock",
                    "warranty": "1 Year",
                    "specs": [
                        { "label": "Processor", "value": "Dimensity 7200 Pro" }
                    ]
                }
            },
            "zh": {
                "name": "Nothing Phone (2a) 透明手机",
                "brand": "Nothing",
                "category": "智能手机",
                "priceEstimate": "¥2499",
                "buyingChannel": "官网",
                "tags": ["性价比", "设计", "Glyph"],
                "description": "Nothing Phone (2a) 是一款打破常规的透明设计手机。标志性的 Glyph 光效界面，让交互重归纯粹与直观。",
                "strategy": "经济型设计手机。",
                "performance": "性价比高。",
                "painPoints": "塑料机身。",
                "verdict": "一个不错的预算选择。",
                "detail": {
                    "gallery": [],
                    "highlights": ["Glyph 界面", "独特设计", "经济实惠"],
                    "shipping": "现货",
                    "warranty": "1 年",
                    "specs": [
                        { "label": "处理器", "value": "Dimensity 7200 Pro" }
                    ]
                }
            }
        },
        "purchaseChannels": [
            {
                "name": "Nothing Official",
                "price": "$349",
                "url": "https://nothing.tech/products/phone-2a",
                "isOfficial": true,
                "score": 9,
                "shippingInfo": "In Stock",
                "paymentMethods": ["Credit Card", "Klarna"],
                "pros": ["Official Support", "Exclusive Colors"],
                "cons": ["Limited Carrier Deals"]
            }
        ],
        "chinaAdaptability": {
            "network": { "score": 5, "description": "需要网络支持", "vpnRequired": false },
            "language": { "score": 5, "description": "支持有限", "supportLevel": "community" },
            "warranty": { "score": 5, "description": "视地区而定", "vpnRequired": false },
            "ecosystem": { "score": 5, "description": "一般", "voltageCompatible": true }
        }
    },
    {
        "id": "p_google_pixel_fold",
        "name": "Google Pixel Fold",
        "manufacturer": "Google",
        "launchDate": "2023-06-27",
        "price": "$1799",
        "status": "released",
        "imageUrl": "/images/products/pixel-fold.png",
        "category": "Smartphone",
        "tags": ["Foldable", "Android", "Tablet"],
        "isClassic": false,
        "survivalRate": 50,
        "riskLevel": "Moderate",
        "specs": {
            "Processor": "Tensor G2",
            "Inner Screen": "7.6\" OLED",
            "Outer Screen": "5.8\" OLED",
            "Battery": "4821mAh"
        },
        "locales": {
            "en": {
                "name": "Google Pixel Fold",
                "brand": "Google",
                "category": "Smartphone",
                "priceEstimate": "$1799",
                "buyingChannel": "Official",
                "tags": ["Foldable", "Android", "Tablet"],
                "description": "Google Pixel Fold is a foldable smartphone from Google. It opens into a tablet.",
                "strategy": "Google's foldable.",
                "performance": "Good camera.",
                "painPoints": "Expensive and heavy.",
                "verdict": "A solid foldable.",
                "detail": {
                    "gallery": [],
                    "highlights": ["Foldable", "Google Camera", "Tensor G2"],
                    "shipping": "In Stock",
                    "warranty": "1 Year",
                    "specs": [
                        { "label": "Processor", "value": "Tensor G2" }
                    ]
                }
            },
            "zh": {
                "name": "Google Pixel Fold 折叠屏手机",
                "brand": "Google",
                "category": "智能手机",
                "priceEstimate": "¥12999",
                "buyingChannel": "官网",
                "tags": ["折叠屏", "Android", "平板"],
                "description": "Google Pixel Fold 是谷歌首款折叠屏旗舰。展开即是平板，融合了 Pixel 的影像实力与 Android 的原生智慧。",
                "strategy": "谷歌的折叠屏。",
                "performance": "相机不错。",
                "painPoints": "昂贵且重。",
                "verdict": "一款扎实的折叠屏。",
                "detail": {
                    "gallery": [],
                    "highlights": ["折叠屏", "谷歌相机", "Tensor G2"],
                    "shipping": "现货",
                    "warranty": "1 年",
                    "specs": [
                        { "label": "处理器", "value": "Tensor G2" }
                    ]
                }
            }
        },
        "purchaseChannels": [
            {
                "name": "Google Store",
                "price": "$1799",
                "url": "https://store.google.com/product/pixel_fold",
                "isOfficial": true,
                "score": 9,
                "shippingInfo": "In Stock",
                "paymentMethods": ["Credit Card", "Google Pay"],
                "pros": ["Official Warranty", "Trade-in Offers"],
                "cons": ["High Price"]
            }
        ],
        "chinaAdaptability": {
            "network": { "score": 5, "description": "需要网络支持", "vpnRequired": true },
            "language": { "score": 5, "description": "支持有限", "supportLevel": "community" },
            "warranty": { "score": 5, "description": "视地区而定", "vpnRequired": false },
            "ecosystem": { "score": 5, "description": "一般", "voltageCompatible": true }
        }
    },
    {
        "id": "p_meta_quest_3",
        "name": "Meta Quest 3",
        "manufacturer": "Meta",
        "launchDate": "2023-10-10",
        "price": "$499",
        "status": "released",
        "imageUrl": "/images/products/meta-quest-3.png",
        "category": "VR Headset",
        "tags": ["MR", "Gaming", "Spatial"],
        "isClassic": false,
        "survivalRate": 50,
        "riskLevel": "Moderate",
        "specs": {
            "Processor": "Snapdragon XR2 Gen 2",
            "Display": "2064x2208 per eye",
            "FOV": "110 degrees",
            "Weight": "515g"
        },
        "locales": {
            "en": {
                "name": "Meta Quest 3",
                "brand": "Meta",
                "category": "VR Headset",
                "priceEstimate": "$499",
                "buyingChannel": "Official",
                "tags": ["MR", "Gaming", "Spatial"],
                "description": "Meta Quest 3 is a mixed reality headset. It features improved graphics and passthrough.",
                "strategy": "Consumer MR.",
                "performance": "Great value.",
                "painPoints": "Battery life.",
                "verdict": "The best consumer VR.",
                "detail": {
                    "gallery": [],
                    "highlights": ["Mixed Reality", "Snapdragon XR2", "Pancake Lenses"],
                    "shipping": "In Stock",
                    "warranty": "1 Year",
                    "specs": [
                        { "label": "Processor", "value": "Snapdragon XR2 Gen 2" }
                    ]
                }
            },
            "zh": {
                "name": "Meta Quest 3 混合现实头显",
                "brand": "Meta",
                "category": "VR 头显",
                "priceEstimate": "¥3599",
                "buyingChannel": "官网",
                "tags": ["MR", "游戏", "空间计算"],
                "description": "Meta Quest 3 是一款消费级混合现实头显的标杆之作。全彩透视与强劲图形性能，将虚拟与现实无缝融合。",
                "strategy": "消费级 MR。",
                "performance": "性价比高。",
                "painPoints": "电池续航。",
                "verdict": "最好的消费级 VR。",
                "detail": {
                    "gallery": [],
                    "highlights": ["混合现实", "Snapdragon XR2", "Pancake 透镜"],
                    "shipping": "现货",
                    "warranty": "1 年",
                    "specs": [
                        { "label": "处理器", "value": "Snapdragon XR2 Gen 2" }
                    ]
                }
            }
        },
        "purchaseChannels": [
            {
                "name": "Meta Store",
                "price": "$499",
                "url": "https://www.meta.com/quest/quest-3",
                "isOfficial": true,
                "score": 9,
                "shippingInfo": "In Stock",
                "paymentMethods": ["Credit Card", "PayPal"],
                "pros": ["Official Warranty", "Game Bundles"],
                "cons": ["Account Requirement"]
            }
        ],
        "chinaAdaptability": {
            "network": { "score": 5, "description": "需要网络支持", "vpnRequired": true },
            "language": { "score": 5, "description": "支持有限", "supportLevel": "community" },
            "warranty": { "score": 5, "description": "视地区而定", "vpnRequired": false },
            "ecosystem": { "score": 5, "description": "一般", "voltageCompatible": true }
        }
    }
];
