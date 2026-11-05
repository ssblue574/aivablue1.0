import React, { useState } from 'react';
import { PageTransition, RouteTransition, StaggeredTransition } from './PageTransition';
import { useSpatialTransition, useFluidTransition } from '../hooks/usePageTransition';
import { HolographicButton } from './HolographicButton';

/**
 * PageTransition 示例集合
 */

// 示例 1: 基础过渡类型
export const BasicTransitionsExample = () => {
  const [activeType, setActiveType] = useState<'fade' | 'slide' | 'scale' | 'spatial'>('fade');
  const [key, setKey] = useState(0);

  const triggerTransition = (type: typeof activeType) => {
    setActiveType(type);
    setKey(prev => prev + 1);
  };

  return (
    <div className="p-8 space-y-6">
      <h2 className="text-2xl font-bold mb-4">基础过渡类型</h2>
      
      <div className="flex gap-3 mb-8">
        <HolographicButton
          variant="secondary"
          size="sm"
          onClick={() => triggerTransition('fade')}
        >
          Fade
        </HolographicButton>
        <HolographicButton
          variant="secondary"
          size="sm"
          onClick={() => triggerTransition('slide')}
        >
          Slide
        </HolographicButton>
        <HolographicButton
          variant="secondary"
          size="sm"
          onClick={() => triggerTransition('scale')}
        >
          Scale
        </HolographicButton>
        <HolographicButton
          variant="secondary"
          size="sm"
          onClick={() => triggerTransition('spatial')}
        >
          Spatial
        </HolographicButton>
      </div>

      <PageTransition key={key} type={activeType} duration={600}>
        <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10">
          <h3 className="text-xl font-semibold mb-2">
            {activeType.charAt(0).toUpperCase() + activeType.slice(1)} Transition
          </h3>
          <p className="text-white/70">
            这是一个使用 {activeType} 过渡效果的示例内容。
          </p>
        </div>
      </PageTransition>
    </div>
  );
};

// 示例 2: 交错动画
export const StaggeredAnimationExample = () => {
  const [show, setShow] = useState(false);

  const items = [
    { id: 1, title: '神经网络背景', desc: '动态节点和连接线' },
    { id: 2, title: '粒子系统', desc: '三种行为模式' },
    { id: 3, title: '玻璃态卡片', desc: '半透明模糊效果' },
    { id: 4, title: '全息按钮', desc: '渐变光晕和 3D 效果' },
    { id: 5, title: 'AI 思考指示器', desc: '可视化 AI 过程' },
  ];

  return (
    <div className="p-8 space-y-6">
      <h2 className="text-2xl font-bold mb-4">交错入场动画</h2>
      
      <HolographicButton
        variant="primary"
        onClick={() => setShow(!show)}
      >
        {show ? '隐藏' : '显示'} 列表
      </HolographicButton>

      {show && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StaggeredTransition staggerDelay={100} type="slide">
            {items.map(item => (
              <div
                key={item.id}
                className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
              >
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-white/60 text-sm">{item.desc}</p>
              </div>
            ))}
          </StaggeredTransition>
        </div>
      )}
    </div>
  );
};

// 示例 3: 空间转换
export const SpatialTransitionExample = () => {
  const { spatialStyle, triggerSpatialTransition } = useSpatialTransition();
  const [content, setContent] = useState(1);

  const handleNext = () => {
    triggerSpatialTransition(-50, 5, 0, 600);
    setTimeout(() => {
      setContent(prev => (prev % 3) + 1);
    }, 300);
  };

  return (
    <div className="p-8 space-y-6">
      <h2 className="text-2xl font-bold mb-4">3D 空间转换</h2>
      
      <div className="perspective-1000">
        <div
          style={spatialStyle}
          className="p-8 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/10"
        >
          <h3 className="text-2xl font-bold mb-4">内容 {content}</h3>
          <p className="text-white/70 mb-6">
            这是第 {content} 个内容面板。点击按钮查看 3D 空间转换效果。
          </p>
          <HolographicButton variant="primary" onClick={handleNext}>
            下一个
          </HolographicButton>
        </div>
      </div>
    </div>
  );
};

// 示例 4: 流体过渡
export const FluidTransitionExample = () => {
  const { isAnimating, progress, easedProgress, startTransition } = useFluidTransition(1000);

  return (
    <div className="p-8 space-y-6">
      <h2 className="text-2xl font-bold mb-4">流体过渡动画</h2>
      
      <HolographicButton
        variant="primary"
        onClick={startTransition}
        disabled={isAnimating}
      >
        {isAnimating ? '动画中...' : '开始过渡'}
      </HolographicButton>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>线性进度</span>
            <span>{Math.round(progress * 100)}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>缓动进度 (cubic-bezier)</span>
            <span>{Math.round(easedProgress * 100)}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-500 to-orange-500 transition-all"
              style={{ width: `${easedProgress * 100}%` }}
            />
          </div>
        </div>

        <div
          className="p-6 rounded-xl bg-white/5 border border-white/10 transition-all duration-1000"
          style={{
            opacity: easedProgress,
            transform: `translateY(${(1 - easedProgress) * 20}px) scale(${0.95 + easedProgress * 0.05})`
          }}
        >
          <p className="text-white/70">
            这个内容块使用缓动进度值来控制透明度、位移和缩放，创造流畅的过渡效果。
          </p>
        </div>
      </div>
    </div>
  );
};

// 示例 5: 页面切换模拟
export const PageSwitchExample = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'about' | 'contact'>('home');

  const pages = {
    home: {
      title: '首页',
      content: '欢迎来到 AIVA 平台。这里展示了最新的 AI 产品和技术动态。',
      color: 'from-cyan-500/20 to-blue-500/20'
    },
    about: {
      title: '关于',
      content: 'AIVA 是一个专注于 AI 产品评测和推荐的平台，帮助用户发现最适合的 AI 工具。',
      color: 'from-purple-500/20 to-pink-500/20'
    },
    contact: {
      title: '联系',
      content: '如有任何问题或建议，欢迎通过邮件或社交媒体与我们联系。',
      color: 'from-orange-500/20 to-red-500/20'
    }
  };

  return (
    <div className="p-8 space-y-6">
      <h2 className="text-2xl font-bold mb-4">页面切换模拟</h2>
      
      <div className="flex gap-3 mb-8">
        <HolographicButton
          variant={currentPage === 'home' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setCurrentPage('home')}
        >
          首页
        </HolographicButton>
        <HolographicButton
          variant={currentPage === 'about' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setCurrentPage('about')}
        >
          关于
        </HolographicButton>
        <HolographicButton
          variant={currentPage === 'contact' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setCurrentPage('contact')}
        >
          联系
        </HolographicButton>
      </div>

      <PageTransition key={currentPage} type="spatial" duration={600}>
        <div className={`p-8 rounded-2xl bg-gradient-to-br ${pages[currentPage].color} border border-white/10 min-h-[200px]`}>
          <h3 className="text-2xl font-bold mb-4">{pages[currentPage].title}</h3>
          <p className="text-white/70">{pages[currentPage].content}</p>
        </div>
      </PageTransition>
    </div>
  );
};

// 完整示例展示
export const PageTransitionShowcase = () => {
  return (
    <div className="min-h-screen bg-black text-white p-8 space-y-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">PageTransition 组件示例</h1>
        <p className="text-white/60 mb-12">
          流体页面过渡动画系统，提供多种过渡效果和空间转换动画。
        </p>

        <div className="space-y-16">
          <BasicTransitionsExample />
          <div className="border-t border-white/10" />
          
          <StaggeredAnimationExample />
          <div className="border-t border-white/10" />
          
          <SpatialTransitionExample />
          <div className="border-t border-white/10" />
          
          <FluidTransitionExample />
          <div className="border-t border-white/10" />
          
          <PageSwitchExample />
        </div>
      </div>
    </div>
  );
};

export default PageTransitionShowcase;
