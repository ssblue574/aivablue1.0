import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Clock, Plus, Rocket, Users, X } from 'lucide-react';
import { clsx } from 'clsx';

export interface CrowdProject {
    id: string;
    name: string;
    nameZh: string;
    creator: string;
    creatorZh: string;
    pitch: string;
    pitchZh: string;
    story: string;
    storyZh: string;
    image: string;
    goal: number;
    raised: number;
    backers: number;
    daysLeft: number;
    currency: 'CNY' | 'USD';
    tags: string[];
    tagsZh: string[];
    tiers: Array<{ id: string; amount: number; title: string; titleZh: string; desc: string; descZh: string }>;
    mine?: boolean;
}

interface PersonalCrowdShowcaseProps {
    t: (key: any) => string;
    isZh: boolean;
    isDark: boolean;
    surface: string;
    muted: string;
    soft: string;
    accent: string;
    onBanner: (msg: string) => void;
}

const STORAGE_KEY = 'aiva_lab_crowd_projects';
const PLEDGE_KEY = 'aiva_lab_crowd_pledges';

const seedProjects = (isZh: boolean): CrowdProject[] => [
    {
        id: 'c1',
        name: 'Aura Pin',
        nameZh: 'Aura 智能胸针',
        creator: 'Mia Chen',
        creatorZh: '陈米娅',
        pitch: 'Always-on wearable AI companion for creators on the go',
        pitchZh: '为创作者打造的随身常开 AI 助手胸针',
        story: 'Built from a failed meeting-note workflow. Aura Pin captures context privately and summarizes only what you approve.',
        storyZh: '源于失败的会议记录流程。Aura Pin 本地捕获上下文，只在你确认后生成摘要。',
        image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=90',
        goal: isZh ? 180000 : 28000,
        raised: isZh ? 126400 : 19680,
        backers: 842,
        daysLeft: 18,
        currency: isZh ? 'CNY' : 'USD',
        tags: ['Wearable', 'On-device AI'],
        tagsZh: ['可穿戴', '端侧 AI'],
        tiers: [
            { id: 't1', amount: isZh ? 299 : 49, title: 'Early Bird', titleZh: '早鸟档', desc: '1 unit + sticker pack', descZh: '1 台设备 + 贴纸包' },
            { id: 't2', amount: isZh ? 499 : 79, title: 'Creator Kit', titleZh: '创作者套装', desc: '1 unit + case + API access', descZh: '1 台 + 保护壳 + API 权限' },
            { id: 't3', amount: isZh ? 1299 : 199, title: 'Studio Pack', titleZh: '工作室包', desc: '3 units for teams', descZh: '团队 3 台套装' },
        ],
    },
    {
        id: 'c2',
        name: 'NestBeam Lamp',
        nameZh: 'NestBeam 环境光助手',
        creator: 'Leo Park',
        creatorZh: '朴利奥',
        pitch: 'Ambient desk lamp that adapts light to your focus sessions',
        pitchZh: '跟随专注节奏自动调光的桌面环境灯',
        story: 'A lamp that understands deep-work cycles. Soft transitions, no app spam, open firmware.',
        storyZh: '理解深度工作节奏的台灯：柔和过渡、无打扰通知、开源固件。',
        image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=90',
        goal: isZh ? 120000 : 18000,
        raised: isZh ? 131200 : 19840,
        backers: 1205,
        daysLeft: 6,
        currency: isZh ? 'CNY' : 'USD',
        tags: ['Home Agent', 'Open Firmware'],
        tagsZh: ['家居智能', '开源固件'],
        tiers: [
            { id: 't1', amount: isZh ? 399 : 59, title: 'Single', titleZh: '单灯档', desc: '1 lamp in matte white', descZh: '雾面白单灯' },
            { id: 't2', amount: isZh ? 699 : 99, title: 'Duo', titleZh: '双灯档', desc: '2 lamps + mounting kit', descZh: '双灯 + 安装套件' },
        ],
    },
    {
        id: 'c3',
        name: 'Pocket Loom',
        nameZh: 'Pocket Loom 创作者采样器',
        creator: 'Ana Rivera',
        creatorZh: '安娜·里维拉',
        pitch: 'Pocket hardware sampler for field sound and gesture capture',
        pitchZh: '口袋硬件采样器，捕捉现场声音与手势',
        story: 'Designed for indie musicians and interaction designers who prototype away from the studio.',
        storyZh: '为离开工作室也能原型验证的独立音乐人和交互设计师设计。',
        image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=90',
        goal: isZh ? 90000 : 14000,
        raised: isZh ? 38200 : 5900,
        backers: 267,
        daysLeft: 29,
        currency: isZh ? 'CNY' : 'USD',
        tags: ['Creator Tool', 'Niche Hardware'],
        tagsZh: ['创作者工具', '小众硬件'],
        tiers: [
            { id: 't1', amount: isZh ? 599 : 89, title: 'Maker', titleZh: '创客档', desc: 'Device + USB-C dock', descZh: '主机 + USB-C 底座' },
            { id: 't2', amount: isZh ? 999 : 149, title: 'Pro', titleZh: '专业档', desc: 'Device + mic capsule pack', descZh: '主机 + 麦克风胶囊套装' },
        ],
    },
];

const readJson = <T,>(key: string, fallback: T): T => {
    try {
        const raw = localStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
        return fallback;
    }
};

export const PersonalCrowdShowcase: React.FC<PersonalCrowdShowcaseProps> = ({
    t,
    isZh,
    isDark,
    surface,
    muted,
    soft,
    accent,
    onBanner,
}) => {
    const [projects, setProjects] = useState<CrowdProject[]>([]);
    const [pledges, setPledges] = useState<Record<string, number>>({});
    const [filter, setFilter] = useState<'all' | 'hot' | 'ending' | 'funded' | 'mine'>('all');
    const [activeId, setActiveId] = useState<string | null>(null);
    const [showPublish, setShowPublish] = useState(false);
    const [selectedTier, setSelectedTier] = useState<string | null>(null);
    const [formName, setFormName] = useState('');
    const [formPitch, setFormPitch] = useState('');
    const [formGoal, setFormGoal] = useState(isZh ? '50000' : '8000');
    const [formDays, setFormDays] = useState('30');

    useEffect(() => {
        const saved = readJson<CrowdProject[]>(STORAGE_KEY, []);
        const seeded = seedProjects(isZh);
        const merged = [...saved, ...seeded.filter(s => !saved.some(p => p.id === s.id))];
        setProjects(merged);
        setPledges(readJson(PLEDGE_KEY, {}));
    }, [isZh]);

    const active = projects.find(p => p.id === activeId) || null;

    const filtered = useMemo(() => {
        return projects.filter(p => {
            const pct = p.raised / p.goal;
            if (filter === 'hot') return pct >= 0.45 && p.daysLeft > 7;
            if (filter === 'ending') return p.daysLeft <= 7;
            if (filter === 'funded') return pct >= 1;
            if (filter === 'mine') return !!p.mine;
            return true;
        });
    }, [projects, filter]);

    const money = (amount: number, currency: 'CNY' | 'USD') =>
        currency === 'CNY' ? `¥${amount.toLocaleString()}` : `$${amount.toLocaleString()}`;

    const persistProjects = (next: CrowdProject[]) => {
        setProjects(next);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next.filter(p => p.mine)));
    };

    const persistPledges = (next: Record<string, number>) => {
        setPledges(next);
        localStorage.setItem(PLEDGE_KEY, JSON.stringify(next));
    };

    const handlePledge = () => {
        if (!active || !selectedTier) {
            onBanner(isZh ? '请先选择支持档位' : 'Choose a pledge tier first');
            return;
        }
        const tier = active.tiers.find(x => x.id === selectedTier);
        if (!tier) return;

        const nextProjects = projects.map(p => {
            if (p.id !== active.id) return p;
            return {
                ...p,
                raised: p.raised + tier.amount,
                backers: p.backers + 1,
            };
        });
        persistProjects(nextProjects);
        persistPledges({ ...pledges, [active.id]: (pledges[active.id] || 0) + tier.amount });
        onBanner(t('lab_crowd_pledge_success'));
        setSelectedTier(null);
    };

    const handlePublish = () => {
        if (!formName.trim() || !formPitch.trim()) {
            onBanner(isZh ? '请填写产品名称与介绍' : 'Please fill name and pitch');
            return;
        }
        const goal = Math.max(1000, Number(formGoal) || 0);
        const days = Math.max(7, Number(formDays) || 30);
        const id = `mine-${Date.now()}`;
        const project: CrowdProject = {
            id,
            name: formName.trim(),
            nameZh: formName.trim(),
            creator: isZh ? '我' : 'Me',
            creatorZh: '我',
            pitch: formPitch.trim(),
            pitchZh: formPitch.trim(),
            story: formPitch.trim(),
            storyZh: formPitch.trim(),
            image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=90',
            goal,
            raised: 0,
            backers: 0,
            daysLeft: days,
            currency: isZh ? 'CNY' : 'USD',
            tags: ['Indie', 'Crowdfunding'],
            tagsZh: ['独立创作', '众筹中'],
            tiers: [
                {
                    id: `${id}-t1`,
                    amount: Math.round(goal * 0.01),
                    title: 'Early Bird',
                    titleZh: '早鸟档',
                    desc: 'Early supporter unit',
                    descZh: '早鸟支持者设备',
                },
                {
                    id: `${id}-t2`,
                    amount: Math.round(goal * 0.02),
                    title: 'Standard',
                    titleZh: '标准档',
                    desc: 'Standard retail unit',
                    descZh: '标准零售设备',
                },
            ],
            mine: true,
        };
        persistProjects([project, ...projects]);
        setShowPublish(false);
        setFormName('');
        setFormPitch('');
        setActiveId(id);
        onBanner(t('lab_crowd_publish_success'));
    };

    if (active) {
        const pct = Math.min(100, Math.round((active.raised / active.goal) * 100));
        const name = isZh ? active.nameZh : active.name;
        const creator = isZh ? active.creatorZh : active.creator;
        const story = isZh ? active.storyZh : active.story;
        const tags = isZh ? active.tagsZh : active.tags;
        const myPledge = pledges[active.id] || 0;

        return (
            <div className="space-y-4">
                <button type="button" onClick={() => setActiveId(null)} className={clsx('text-[13px] font-medium', accent)}>
                    ← {isZh ? '返回橱窗' : 'Back to showcase'}
                </button>

                <div className={clsx('rounded-[28px] overflow-hidden', surface)}>
                    <div className="relative h-52">
                        <img src={active.image} alt="" className="w-full h-full object-cover saturate-[1.15]" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                            <h2 className="text-[22px] font-semibold text-white tracking-tight">{name}</h2>
                            <p className="text-[13px] text-white/75 mt-1">
                                {t('lab_crowd_creator')} · {creator}
                            </p>
                        </div>
                    </div>
                    <div className="p-5 space-y-4">
                        <p className={clsx('text-[14px] leading-relaxed', soft)}>
                            {isZh ? active.pitchZh : active.pitch}
                        </p>

                        <div>
                            <div className="flex items-end justify-between mb-2">
                                <div>
                                    <div className="text-[20px] font-semibold tabular-nums">
                                        {money(active.raised, active.currency)}
                                    </div>
                                    <div className={clsx('text-[12px]', muted)}>
                                        {t('lab_crowd_raised')} · {pct}% / {money(active.goal, active.currency)}
                                    </div>
                                </div>
                                <div className={clsx('text-right text-[12px]', muted)}>
                                    <div className="flex items-center gap-1 justify-end">
                                        <Users size={12} /> {active.backers} {t('lab_crowd_backers')}
                                    </div>
                                    <div className="flex items-center gap-1 justify-end mt-1">
                                        <Clock size={12} /> {active.daysLeft} {t('lab_crowd_days')}
                                    </div>
                                </div>
                            </div>
                            <div className={clsx('h-2 rounded-full overflow-hidden', isDark ? 'bg-white/10' : 'bg-black/10')}>
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                                    style={{ width: `${pct}%` }}
                                />
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                            {tags.map(tag => (
                                <span
                                    key={tag}
                                    className={clsx(
                                        'px-2 py-0.5 rounded-md text-[11px]',
                                        isDark ? 'bg-white/[0.06] text-white/60' : 'bg-black/[0.04] text-black/55'
                                    )}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <div>
                            <h3 className="text-[15px] font-semibold mb-2">{t('lab_crowd_story')}</h3>
                            <p className={clsx('text-[13px] leading-relaxed', soft)}>{story}</p>
                        </div>

                        <div>
                            <h3 className="text-[15px] font-semibold mb-3">{t('lab_crowd_tiers')}</h3>
                            <div className="space-y-2">
                                {active.tiers.map(tier => {
                                    const selected = selectedTier === tier.id;
                                    return (
                                        <button
                                            key={tier.id}
                                            type="button"
                                            onClick={() => setSelectedTier(tier.id)}
                                            className={clsx(
                                                'w-full text-left rounded-[18px] p-3.5 border transition-colors',
                                                selected
                                                    ? (isDark ? 'border-emerald-400/60 bg-emerald-400/10' : 'border-emerald-500 bg-emerald-50')
                                                    : (isDark ? 'border-white/10 bg-white/[0.03]' : 'border-black/8 bg-black/[0.02]')
                                            )}
                                        >
                                            <div className="flex items-center justify-between gap-3 mb-1">
                                                <span className="text-[14px] font-semibold">
                                                    {isZh ? tier.titleZh : tier.title}
                                                </span>
                                                <span className="text-[14px] font-semibold tabular-nums">
                                                    {money(tier.amount, active.currency)}
                                                </span>
                                            </div>
                                            <p className={clsx('text-[12px]', muted)}>
                                                {isZh ? tier.descZh : tier.desc}
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {myPledge > 0 && (
                            <div className={clsx('text-[12px] flex items-center gap-1.5', 'text-emerald-500')}>
                                <CheckCircle2 size={14} />
                                {t('lab_crowd_pledged')} {money(myPledge, active.currency)}
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={handlePledge}
                            className={clsx(
                                'w-full py-3 rounded-2xl text-[14px] font-medium',
                                isDark ? 'bg-white text-black' : 'bg-black text-white'
                            )}
                        >
                            {t('lab_crowd_support')}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className={clsx('rounded-[24px] p-4 mb-4', surface)}>
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                        <h3 className="text-[16px] font-semibold tracking-tight mb-1 flex items-center gap-2">
                            <Rocket size={16} className={accent} />
                            {t('lab_crowd_title')}
                        </h3>
                        <p className={clsx('text-[12px] leading-relaxed', muted)}>{t('lab_crowd_desc')}</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowPublish(true)}
                        className={clsx(
                            'shrink-0 px-3 py-2 rounded-full text-[12px] font-medium flex items-center gap-1',
                            isDark ? 'bg-white text-black' : 'bg-black text-white'
                        )}
                    >
                        <Plus size={14} />
                        {t('lab_crowd_publish')}
                    </button>
                </div>

                <div className="flex flex-wrap gap-2">
                    {([
                        { id: 'all', label: t('lab_crowd_filter_all') },
                        { id: 'hot', label: t('lab_crowd_filter_hot') },
                        { id: 'ending', label: t('lab_crowd_filter_ending') },
                        { id: 'funded', label: t('lab_crowd_filter_funded') },
                        { id: 'mine', label: t('lab_crowd_mine') },
                    ] as const).map(item => (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => setFilter(item.id)}
                            className={clsx(
                                'px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors',
                                filter === item.id
                                    ? (isDark ? 'bg-white text-black' : 'bg-black text-white')
                                    : (isDark ? 'bg-white/[0.06] text-white/65' : 'bg-black/[0.05] text-black/55')
                            )}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>

            {filtered.length === 0 ? (
                <div className={clsx('rounded-[24px] p-8 text-center text-[13px]', surface, muted)}>
                    {t('lab_crowd_empty')}
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map(project => {
                        const pct = Math.min(100, Math.round((project.raised / project.goal) * 100));
                        const name = isZh ? project.nameZh : project.name;
                        const creator = isZh ? project.creatorZh : project.creator;
                        const pitch = isZh ? project.pitchZh : project.pitch;
                        const funded = pct >= 100;

                        return (
                            <button
                                key={project.id}
                                type="button"
                                onClick={() => setActiveId(project.id)}
                                className={clsx('w-full text-left rounded-[24px] overflow-hidden transition-transform active:scale-[0.99]', surface)}
                            >
                                <div className="relative h-40">
                                    <img src={project.image} alt="" className="w-full h-full object-cover saturate-[1.15]" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                    <span className={clsx(
                                        'absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-medium backdrop-blur-md',
                                        funded ? 'bg-emerald-500/90 text-white' : 'bg-black/40 text-white'
                                    )}>
                                        {funded
                                            ? (isZh ? '已达标' : 'Funded')
                                            : project.daysLeft <= 7
                                                ? (isZh ? '即将结束' : 'Ending soon')
                                                : (isZh ? '众筹中' : 'Live')}
                                    </span>
                                    {project.mine && (
                                        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-medium bg-violet-500/90 text-white">
                                            {t('lab_crowd_mine')}
                                        </span>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h4 className="text-[16px] font-semibold tracking-tight mb-0.5">{name}</h4>
                                    <p className={clsx('text-[12px] mb-2', muted)}>
                                        {t('lab_crowd_creator')} · {creator}
                                    </p>
                                    <p className={clsx('text-[13px] leading-relaxed line-clamp-2 mb-3', soft)}>{pitch}</p>
                                    <div className={clsx('h-1.5 rounded-full overflow-hidden mb-2', isDark ? 'bg-white/10' : 'bg-black/10')}>
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                    <div className={clsx('flex items-center justify-between text-[12px]', muted)}>
                                        <span>{money(project.raised, project.currency)} · {pct}%</span>
                                        <span>{project.backers} {t('lab_crowd_backers')} · {project.daysLeft}d</span>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}

            {showPublish && (
                <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-black/50 p-4">
                    <div className={clsx('w-full max-w-md rounded-[28px] p-5', surface)}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-[17px] font-semibold">{t('lab_crowd_publish_title')}</h3>
                            <button type="button" onClick={() => setShowPublish(false)} className="p-1 rounded-full">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="space-y-3">
                            <input
                                value={formName}
                                onChange={(e) => setFormName(e.target.value)}
                                placeholder={t('lab_crowd_publish_name')}
                                className={clsx(
                                    'w-full rounded-2xl px-4 py-3 text-[14px] outline-none',
                                    isDark ? 'bg-white/[0.06]' : 'bg-black/[0.04]'
                                )}
                            />
                            <textarea
                                value={formPitch}
                                onChange={(e) => setFormPitch(e.target.value)}
                                placeholder={t('lab_crowd_publish_pitch')}
                                rows={3}
                                className={clsx(
                                    'w-full rounded-2xl px-4 py-3 text-[14px] outline-none resize-none',
                                    isDark ? 'bg-white/[0.06]' : 'bg-black/[0.04]'
                                )}
                            />
                            <input
                                value={formGoal}
                                onChange={(e) => setFormGoal(e.target.value)}
                                placeholder={t('lab_crowd_publish_goal')}
                                inputMode="numeric"
                                className={clsx(
                                    'w-full rounded-2xl px-4 py-3 text-[14px] outline-none',
                                    isDark ? 'bg-white/[0.06]' : 'bg-black/[0.04]'
                                )}
                            />
                            <input
                                value={formDays}
                                onChange={(e) => setFormDays(e.target.value)}
                                placeholder={t('lab_crowd_publish_days')}
                                inputMode="numeric"
                                className={clsx(
                                    'w-full rounded-2xl px-4 py-3 text-[14px] outline-none',
                                    isDark ? 'bg-white/[0.06]' : 'bg-black/[0.04]'
                                )}
                            />
                            <button
                                type="button"
                                onClick={handlePublish}
                                className={clsx(
                                    'w-full py-3 rounded-2xl text-[14px] font-medium',
                                    isDark ? 'bg-white text-black' : 'bg-black text-white'
                                )}
                            >
                                {t('lab_crowd_publish_submit')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
