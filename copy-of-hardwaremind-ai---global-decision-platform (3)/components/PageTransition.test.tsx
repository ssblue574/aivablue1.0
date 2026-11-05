import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../ThemeContext';
import { PageTransition, RouteTransition, StaggeredTransition } from './PageTransition';
import { usePageTransition, useRouteTransition, useSpatialTransition, useFluidTransition } from '../hooks/usePageTransition';
import { renderHook, act } from '@testing-library/react';
import fc from 'fast-check';

// 测试包装器
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <ThemeProvider>
      {children}
    </ThemeProvider>
  </BrowserRouter>
);

describe('PageTransition', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('基础功能', () => {
    it('应该渲染子组件', () => {
      render(
        <TestWrapper>
          <PageTransition>
            <div>Test Content</div>
          </PageTransition>
        </TestWrapper>
      );

      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('应该在延迟后显示内容', async () => {
      render(
        <TestWrapper>
          <PageTransition delay={500}>
            <div>Delayed Content</div>
          </PageTransition>
        </TestWrapper>
      );

      const content = screen.getByText('Delayed Content');
      
      // 初始状态应该是不可见的
      expect(content.parentElement).toHaveClass('opacity-0');

      // 等待延迟时间
      act(() => {
        vi.advanceTimersByTime(600);
      });

      // 验证最终状态
      expect(content.parentElement).toHaveClass('opacity-100');
    });
  });

  describe('过渡类型', () => {
    it('应该应用 fade 过渡类', () => {
      render(
        <TestWrapper>
          <PageTransition type="fade">
            <div>Fade Content</div>
          </PageTransition>
        </TestWrapper>
      );

      const content = screen.getByText('Fade Content');
      expect(content.parentElement).toHaveClass('transition-all');
    });

    it('应该应用 slide 过渡类', () => {
      render(
        <TestWrapper>
          <PageTransition type="slide">
            <div>Slide Content</div>
          </PageTransition>
        </TestWrapper>
      );

      const content = screen.getByText('Slide Content');
      expect(content.parentElement).toHaveClass('transition-all');
    });

    it('应该应用 scale 过渡类', () => {
      render(
        <TestWrapper>
          <PageTransition type="scale">
            <div>Scale Content</div>
          </PageTransition>
        </TestWrapper>
      );

      const content = screen.getByText('Scale Content');
      expect(content.parentElement).toHaveClass('transition-all');
    });

    it('应该应用 spatial 过渡类和 3D 样式', () => {
      render(
        <TestWrapper>
          <PageTransition type="spatial">
            <div>Spatial Content</div>
          </PageTransition>
        </TestWrapper>
      );

      const content = screen.getByText('Spatial Content');
      const container = content.parentElement;
      
      expect(container).toHaveClass('transition-all');
      expect(container).toHaveStyle({ transformStyle: 'preserve-3d' });
      expect(container).toHaveStyle({ perspective: '1000px' });
    });
  });

  describe('RouteTransition', () => {
    it('应该使用 transitionKey 触发过渡', () => {
      const { rerender } = render(
        <TestWrapper>
          <RouteTransition transitionKey="page1" type="slide">
            <div>Page 1</div>
          </RouteTransition>
        </TestWrapper>
      );

      expect(screen.getByText('Page 1')).toBeInTheDocument();

      rerender(
        <TestWrapper>
          <RouteTransition transitionKey="page2" type="slide">
            <div>Page 2</div>
          </RouteTransition>
        </TestWrapper>
      );

      expect(screen.getByText('Page 2')).toBeInTheDocument();
    });
  });

  describe('StaggeredTransition', () => {
    it('应该为每个子元素应用交错延迟', () => {
      const children = [
        <div key="1">Item 1</div>,
        <div key="2">Item 2</div>,
        <div key="3">Item 3</div>
      ];

      render(
        <TestWrapper>
          <StaggeredTransition staggerDelay={100}>
            {children}
          </StaggeredTransition>
        </TestWrapper>
      );

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
    });
  });
});

describe('usePageTransition', () => {
  it('应该管理过渡状态', () => {
    const { result } = renderHook(() => usePageTransition(500), {
      wrapper: TestWrapper
    });

    expect(result.current.isTransitioning).toBe(false);
  });
});

describe('useRouteTransition', () => {
  it('应该提供路由过渡状态', () => {
    const { result } = renderHook(() => useRouteTransition(), {
      wrapper: TestWrapper
    });

    expect(result.current.isEntering).toBe(true);
    expect(result.current.isExiting).toBe(false);
    expect(result.current.transitionKey).toBeDefined();
  });
});

describe('useSpatialTransition', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('应该提供空间转换样式', () => {
    const { result } = renderHook(() => useSpatialTransition());

    expect(result.current.spatialStyle).toHaveProperty('transform');
    expect(result.current.spatialStyle).toHaveProperty('transformStyle', 'preserve-3d');
    expect(result.current.spatialStyle).toHaveProperty('transition');
  });

  it('应该触发空间转换动画', () => {
    const { result } = renderHook(() => useSpatialTransition());

    act(() => {
      result.current.triggerSpatialTransition(-50, 5, 0, 600);
    });

    // 检查初始状态
    expect(result.current.spatialStyle.transform).toContain('translateZ(-50px)');
    expect(result.current.spatialStyle.transform).toContain('rotateX(5deg)');

    // 等待动画完成
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // 检查最终状态
    expect(result.current.spatialStyle.transform).toContain('translateZ(0px)');
    expect(result.current.spatialStyle.transform).toContain('rotateX(0deg)');
  });
});

describe('useFluidTransition', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('应该管理流体过渡状态', () => {
    const { result } = renderHook(() => useFluidTransition(500));

    expect(result.current.isAnimating).toBe(false);
    expect(result.current.progress).toBe(0);
    expect(result.current.easedProgress).toBe(0);
  });

  it('应该在调用 startTransition 时开始动画', () => {
    const { result } = renderHook(() => useFluidTransition(500));

    act(() => {
      result.current.startTransition();
    });

    expect(result.current.isAnimating).toBe(true);
  });
});

/**
 * 属性测试 12.1: 视图切换流畅性
 * Feature: futuristic-ui-redesign, Property 14: 视图切换流畅性
 * 验证: 需求 4.4
 * 
 * 对于任意视图切换操作，都应该使用流体过渡动画，避免突兀跳转
 */
describe('属性 14: 视图切换流畅性', () => {
  it('对于任意视图切换，都应该有过渡动画', () => {
    const views = ['home', 'about', 'contact', 'products'];
    
    views.forEach(view => {
      const { container, unmount } = render(
        <TestWrapper>
          <PageTransition key={view} type="slide" duration={600}>
            <div>{view} content</div>
          </PageTransition>
        </TestWrapper>
      );

      const transitionElement = container.firstChild as HTMLElement;
      
      // 验证过渡类存在
      expect(transitionElement).toHaveClass('transition-all');
      
      // 验证使用了缓动函数
      expect(transitionElement).toHaveClass('ease-out');
      
      // 验证初始状态（不可见）
      expect(transitionElement).toHaveClass('opacity-0');
      
      // 等待过渡完成
      act(() => {
        vi.advanceTimersByTime(100);
      });
      
      // 验证最终状态
      expect(transitionElement).toHaveClass('opacity-100');
      
      unmount();
    });
  });

  it('过渡动画应该使用平滑的缓动函数', () => {
    const { container } = render(
      <TestWrapper>
        <PageTransition type="slide">
          <div>Content</div>
        </PageTransition>
      </TestWrapper>
    );

    const transitionElement = container.firstChild as HTMLElement;
    expect(transitionElement).toHaveClass('ease-out');
  });

  /**
   * 基于属性的测试：对于任意视图切换配置，都应该使用流体过渡动画
   * 
   * 这个测试生成随机的视图切换配置（类型、持续时间、延迟），
   * 并验证所有配置都产生平滑的过渡效果，避免突兀跳转。
   */
  it('【属性测试】对于任意视图切换配置，都应该使用流体过渡动画，避免突兀跳转', () => {
    fc.assert(
      fc.property(
        // 生成随机的过渡类型
        fc.constantFrom('fade', 'slide', 'scale', 'spatial'),
        // 生成随机的持续时间 (300-1000ms)
        fc.integer({ min: 300, max: 1000 }),
        // 生成随机的延迟 (0-500ms)
        fc.integer({ min: 0, max: 500 }),
        // 生成随机的视图内容
        fc.string({ minLength: 1, maxLength: 50 }),
        (transitionType, duration, delay, content) => {
          // 渲染带有随机配置的 PageTransition
          const { container, unmount } = render(
            <TestWrapper>
              <PageTransition 
                type={transitionType as any}
                duration={duration}
                delay={delay}
              >
                <div>{content}</div>
              </PageTransition>
            </TestWrapper>
          );

          const transitionElement = container.firstChild as HTMLElement;

          // 属性 1: 所有视图切换都必须有 transition-all 类（流体过渡）
          expect(transitionElement).toHaveClass('transition-all');

          // 属性 2: 所有视图切换都必须使用平滑的缓动函数（避免突兀）
          expect(transitionElement).toHaveClass('ease-out');

          // 属性 3: 所有视图切换都必须从不可见状态开始（opacity-0）
          expect(transitionElement).toHaveClass('opacity-0');

          // 属性 4: 根据过渡类型，验证相应的变换类
          switch (transitionType) {
            case 'slide':
              // slide 类型应该包含位移动画
              expect(transitionElement).toHaveClass('translate-y-8');
              break;
            case 'scale':
              // scale 类型应该包含缩放动画
              expect(transitionElement).toHaveClass('scale-95');
              break;
            case 'spatial':
              // spatial 类型应该有 3D 变换样式
              expect(transitionElement).toHaveStyle({ transformStyle: 'preserve-3d' });
              expect(transitionElement).toHaveStyle({ perspective: '1000px' });
              break;
            case 'fade':
              // fade 类型只需要 opacity 变化，已在属性 3 中验证
              break;
          }

          // 模拟时间推进，验证过渡到可见状态
          act(() => {
            vi.advanceTimersByTime(delay + 100);
          });

          // 属性 5: 所有视图切换最终都应该过渡到可见状态（opacity-100）
          expect(transitionElement).toHaveClass('opacity-100');

          // 属性 6: 根据过渡类型，验证最终状态的变换
          switch (transitionType) {
            case 'slide':
              expect(transitionElement).toHaveClass('translate-y-0');
              break;
            case 'scale':
              expect(transitionElement).toHaveClass('scale-100');
              break;
          }

          unmount();
        }
      ),
      { numRuns: 100 } // 运行 100 次以确保属性在各种配置下都成立
    );
  });
});

/**
 * 属性测试 12.2: 空间转换动画
 * Feature: futuristic-ui-redesign, Property 28: 空间转换动画
 * 验证: 需求 10.5
 * 
 * 对于任意区域导航，都应该使用淡入淡出和位移动画来强化空间转换感
 */
describe('属性 28: 空间转换动画', () => {
  it('对于任意区域切换，都应该有空间转换效果', () => {
    const regions = ['header', 'main', 'sidebar', 'footer'];
    
    regions.forEach(region => {
      const { container } = render(
        <TestWrapper>
          <PageTransition key={region} type="spatial" duration={600}>
            <div>{region} region</div>
          </PageTransition>
        </TestWrapper>
      );

      const transitionElement = container.firstChild as HTMLElement;
      
      // 验证 3D 变换样式
      expect(transitionElement).toHaveStyle({ transformStyle: 'preserve-3d' });
      expect(transitionElement).toHaveStyle({ perspective: '1000px' });
      
      // 验证过渡类
      expect(transitionElement).toHaveClass('transition-all');
    });
  });

  it('空间转换应该包含淡入淡出效果', () => {
    const { container } = render(
      <TestWrapper>
        <PageTransition type="spatial">
          <div>Spatial Content</div>
        </PageTransition>
      </TestWrapper>
    );

    const transitionElement = container.firstChild as HTMLElement;
    
    // 初始状态应该是不可见的
    expect(transitionElement).toHaveClass('opacity-0');
    
    // 等待过渡
    act(() => {
      vi.advanceTimersByTime(100);
    });
    
    // 最终状态应该是可见的
    expect(transitionElement).toHaveClass('opacity-100');
  });

  it('空间转换应该包含位移动画', () => {
    const { result } = renderHook(() => useSpatialTransition());

    // 触发空间转换
    act(() => {
      result.current.triggerSpatialTransition(-50, 5, 0, 600);
    });

    // 验证包含 translateZ（深度位移）
    expect(result.current.spatialStyle.transform).toContain('translateZ');
    
    // 验证包含旋转（空间感）
    expect(result.current.spatialStyle.transform).toContain('rotateX');
  });

  /**
   * 基于属性的测试：对于任意区域导航，都应该使用淡入淡出和位移动画来强化空间转换感
   * 
   * 这个测试生成随机的区域导航场景（区域名称、过渡参数），
   * 并验证所有区域导航都包含：
   * 1. 淡入淡出效果（opacity 变化）
   * 2. 位移动画（translateZ 深度位移）
   * 3. 3D 空间感（preserve-3d 和 perspective）
   * 4. 旋转效果（rotateX/rotateY）
   */
  it('【属性测试】对于任意区域导航，都应该使用淡入淡出和位移动画强化空间转换', () => {
    fc.assert(
      fc.property(
        // 生成随机的区域名称
        fc.string({ minLength: 1, maxLength: 20 }),
        // 生成随机的持续时间 (300-1000ms)
        fc.integer({ min: 300, max: 1000 }),
        // 生成随机的延迟 (0-300ms)
        fc.integer({ min: 0, max: 300 }),
        // 生成随机的深度位移 (-100 到 -20)
        fc.integer({ min: -100, max: -20 }),
        // 生成随机的 X 轴旋转 (0-10 度)
        fc.integer({ min: 0, max: 10 }),
        // 生成随机的 Y 轴旋转 (-5 到 5 度)
        fc.integer({ min: -5, max: 5 }),
        (regionName, duration, delay, depth, rotateX, rotateY) => {
          // 测试 PageTransition 组件的空间转换
          const { container, unmount } = render(
            <TestWrapper>
              <PageTransition 
                key={regionName}
                type="spatial"
                duration={duration}
                delay={delay}
              >
                <div>{regionName} region content</div>
              </PageTransition>
            </TestWrapper>
          );

          const transitionElement = container.firstChild as HTMLElement;

          // 属性 1: 所有区域导航都必须有淡入淡出效果（opacity 变化）
          // 初始状态应该是不可见的
          expect(transitionElement).toHaveClass('opacity-0');

          // 属性 2: 所有区域导航都必须有过渡动画类
          expect(transitionElement).toHaveClass('transition-all');

          // 属性 3: 所有空间转换都必须有 3D 变换样式
          expect(transitionElement).toHaveStyle({ transformStyle: 'preserve-3d' });

          // 属性 4: 所有空间转换都必须有透视效果
          expect(transitionElement).toHaveStyle({ perspective: '1000px' });

          // 模拟时间推进，验证淡入效果
          act(() => {
            vi.advanceTimersByTime(delay + 100);
          });

          // 属性 5: 所有区域导航最终都应该淡入到可见状态
          expect(transitionElement).toHaveClass('opacity-100');

          unmount();

          // 测试 useSpatialTransition Hook 的位移动画
          const { result, unmount: unmountHook } = renderHook(() => useSpatialTransition(), {
            wrapper: TestWrapper
          });

          // 触发空间转换动画
          act(() => {
            result.current.triggerSpatialTransition(depth, rotateX, rotateY, duration);
          });

          // 属性 6: 所有空间转换都必须包含深度位移（translateZ）
          expect(result.current.spatialStyle.transform).toContain('translateZ');
          expect(result.current.spatialStyle.transform).toContain(`translateZ(${depth}px)`);

          // 属性 7: 所有空间转换都必须包含 X 轴旋转（rotateX）
          expect(result.current.spatialStyle.transform).toContain('rotateX');
          expect(result.current.spatialStyle.transform).toContain(`rotateX(${rotateX}deg)`);

          // 属性 8: 所有空间转换都必须包含 Y 轴旋转（rotateY）
          expect(result.current.spatialStyle.transform).toContain('rotateY');
          expect(result.current.spatialStyle.transform).toContain(`rotateY(${rotateY}deg)`);

          // 属性 9: 所有空间转换都必须有 preserve-3d 样式
          expect(result.current.spatialStyle.transformStyle).toBe('preserve-3d');

          // 属性 10: 所有空间转换都必须有平滑的过渡效果
          expect(result.current.spatialStyle.transition).toContain('transform');
          expect(result.current.spatialStyle.transition).toContain('cubic-bezier');

          // 等待动画完成（一半时间后应该回到原位）
          act(() => {
            vi.advanceTimersByTime(duration / 2 + 100);
          });

          // 属性 11: 空间转换完成后，元素应该回到原始位置（translateZ(0)）
          expect(result.current.spatialStyle.transform).toContain('translateZ(0px)');

          // 属性 12: 空间转换完成后，旋转应该回到 0
          expect(result.current.spatialStyle.transform).toContain('rotateX(0deg)');
          expect(result.current.spatialStyle.transform).toContain('rotateY(0deg)');

          unmountHook();
        }
      ),
      { numRuns: 20 } // 运行 20 次以确保属性在各种配置下都成立（减少以避免超时）
    );
  }, 15000); // 增加超时时间到15秒
});
