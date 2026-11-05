import React, { useState } from 'react';
import { ArrowLeft, Users, MessageCircle, Clock, Crown, Sparkles, Send, Heart, Share2 } from 'lucide-react';
import { clsx } from 'clsx';
import { useTheme } from '../ThemeContext';
import { useNavigate } from 'react-router-dom';

interface RoundtableViewProps {
    t: (key: any) => string;
    lang?: string;
}

export const RoundtableView: React.FC<RoundtableViewProps> = ({
    t,
    lang = 'zh'
}) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const isZh = lang === 'zh';
    const navigate = useNavigate();
    const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

    const rooms = [
        { 
            id: 'design', 
            name: isZh ? '产品设计讨论' : 'Product Design Talk', 
            members: 234, 
            online: 18,
            avatar: '🎨',
            description: isZh ? '探讨如何设计用户喜爱的硬件产品，分享设计灵感与经验' : 'Discuss how to design hardware users love',
            topics: [
                { title: isZh ? '如何平衡美学与功能性？' : 'Balancing aesthetics and functionality?', replies: 45, hot: true },
                { title: isZh ? '2025 产品设计趋势预测' : '2025 Product Design Trends', replies: 32 },
                { title: isZh ? '极简主义是否过时了？' : 'Is minimalism outdated?', replies: 28 },
            ]
        },
        { 
            id: 'engineering', 
            name: isZh ? '工程师角落' : 'Engineers Corner', 
            members: 189, 
            online: 24,
            avatar: '⚙️',
            description: isZh ? 'PCB设计、固件开发、硬件调试技术交流' : 'PCB design, firmware dev, hardware debugging',
            topics: [
                { title: isZh ? 'PCB 设计最佳实践分享' : 'PCB Design Best Practices', replies: 67, hot: true },
                { title: isZh ? 'ESP32 vs RP2040 选择指南' : 'ESP32 vs RP2040 Guide', replies: 41 },
                { title: isZh ? '如何降低 BOM 成本？' : 'How to reduce BOM cost?', replies: 35 },
            ]
        },
        { 
            id: 'crowdfunding', 
            name: isZh ? '众筹创业圈' : 'Crowdfunding Circle', 
            members: 156, 
            online: 12,
            avatar: '🚀',
            description: isZh ? 'Kickstarter、众筹经验分享与创业交流' : 'Kickstarter success stories & startup tips',
            topics: [
                { title: isZh ? 'Kickstarter 成功经验交流' : 'Kickstarter Success Stories', replies: 52 },
                { title: isZh ? '如何制作吸引人的众筹视频？' : 'How to make compelling campaign videos?', replies: 38, hot: true },
                { title: isZh ? '供应链管理踩坑记录' : 'Supply chain management lessons', replies: 29 },
            ]
        },
        { 
            id: 'ai-hardware', 
            name: isZh ? 'AI 硬件前沿' : 'AI Hardware Frontier', 
            members: 312, 
            online: 45,
            avatar: '🤖',
            description: isZh ? '探讨 AI 芯片、边缘计算、本地 AI 设备发展' : 'AI chips, edge computing, on-device AI',
            topics: [
                { title: isZh ? '本地 AI 芯片发展趋势' : 'On-device AI Chip Trends', replies: 89, hot: true },
                { title: isZh ? 'NPU vs GPU：AI 推理选哪个？' : 'NPU vs GPU for AI inference?', replies: 56 },
                { title: isZh ? '开源 AI 硬件项目推荐' : 'Open source AI hardware projects', replies: 43 },
            ]
        },
    ];

    const featuredCreators = [
        { name: 'Alex Chen', role: isZh ? '硬件创业者' : 'Hardware Founder', avatar: '👨‍💻', followers: '12.3K' },
        { name: 'Lisa Wang', role: isZh ? '产品设计师' : 'Product Designer', avatar: '👩‍🎨', followers: '8.7K' },
        { name: 'Mike Zhang', role: isZh ? '固件工程师' : 'Firmware Engineer', avatar: '👨‍🔧', followers: '15.2K' },
    ];

    return (
        <div className={clsx("min-h-screen", isDark ? "bg-black text-white" : "bg-[#fafafa] text-black")}>
            {/* Header */}
            <div className={clsx(
                "sticky top-14 z-40 backdrop-blur-xl border-b",
                isDark ? "bg-black/80 border-white/10" : "bg-white/80 border-gray-200"
            )}>
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className={clsx(
                                "relative z-20 shrink-0 p-2 rounded-full transition-colors",
                                isDark ? "hover:bg-white/10" : "hover:bg-gray-100"
                            )}
                            aria-label={isZh ? '返回' : 'Back'}
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                                <Users size={20} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold">{isZh ? '创作者圆桌' : 'Creator Roundtable'}</h1>
                                <p className={clsx("text-xs", isDark ? "text-gray-400" : "text-gray-500")}>
                                    {isZh ? '与全球硬件创作者直接对话' : 'Connect with hardware creators worldwide'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-6">
                {/* Featured Creators */}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Crown size={18} className="text-yellow-500" />
                        {isZh ? '活跃创作者' : 'Featured Creators'}
                    </h2>
                    <div className="flex gap-4 overflow-x-auto pb-2">
                        {featuredCreators.map((creator, i) => (
                            <div 
                                key={i}
                                className={clsx(
                                    "flex-shrink-0 p-4 rounded-2xl text-center cursor-pointer transition-all hover:-translate-y-1",
                                    isDark ? "bg-[#1a1a1a] hover:bg-[#222]" : "bg-white shadow-sm hover:shadow-md"
                                )}
                                style={{ minWidth: '140px' }}
                            >
                                <div className="text-3xl mb-2">{creator.avatar}</div>
                                <p className="font-medium text-sm">{creator.name}</p>
                                <p className={clsx("text-xs mb-2", isDark ? "text-gray-400" : "text-gray-500")}>{creator.role}</p>
                                <p className="text-xs text-purple-500">{creator.followers} {isZh ? '关注者' : 'followers'}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Discussion Rooms */}
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <MessageCircle size={18} className="text-purple-500" />
                    {isZh ? '讨论房间' : 'Discussion Rooms'}
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                    {rooms.map((room) => (
                        <div 
                            key={room.id}
                            className={clsx(
                                "rounded-2xl overflow-hidden transition-all",
                                isDark ? "bg-[#1a1a1a]" : "bg-white shadow-sm"
                            )}
                        >
                            {/* Room Header */}
                            <div 
                                onClick={() => setSelectedRoom(selectedRoom === room.id ? null : room.id)}
                                className={clsx(
                                    "p-4 cursor-pointer transition-colors",
                                    isDark ? "hover:bg-white/5" : "hover:bg-gray-50"
                                )}
                            >
                                <div className="flex items-start gap-3">
                                    <span className="text-3xl">{room.avatar}</span>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="font-semibold">{room.name}</h3>
                                            <span className="text-xs text-green-500 flex items-center gap-1">
                                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                                {room.online} {isZh ? '在线' : 'online'}
                                            </span>
                                        </div>
                                        <p className={clsx("text-sm mb-2", isDark ? "text-gray-400" : "text-gray-500")}>
                                            {room.description}
                                        </p>
                                        <p className="text-xs text-purple-500">
                                            {room.members} {isZh ? '位成员' : 'members'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Expanded Topics */}
                            {selectedRoom === room.id && (
                                <div className={clsx(
                                    "border-t p-4",
                                    isDark ? "border-white/10" : "border-gray-100"
                                )}>
                                    <p className={clsx("text-xs font-medium mb-3", isDark ? "text-gray-400" : "text-gray-500")}>
                                        {isZh ? '热门话题' : 'Hot Topics'}
                                    </p>
                                    <div className="space-y-2">
                                        {room.topics.map((topic, i) => (
                                            <div 
                                                key={i}
                                                className={clsx(
                                                    "p-3 rounded-xl cursor-pointer transition-colors flex items-center justify-between",
                                                    isDark ? "bg-white/5 hover:bg-white/10" : "bg-gray-50 hover:bg-gray-100"
                                                )}
                                            >
                                                <div className="flex items-center gap-2">
                                                    {topic.hot && <span className="text-xs">🔥</span>}
                                                    <span className="text-sm">{topic.title}</span>
                                                </div>
                                                <span className={clsx("text-xs", isDark ? "text-gray-400" : "text-gray-500")}>
                                                    {topic.replies} {isZh ? '回复' : 'replies'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="w-full mt-3 py-2 rounded-xl bg-purple-500 text-white text-sm font-medium hover:bg-purple-600 transition-colors">
                                        {isZh ? '加入讨论' : 'Join Discussion'}
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

