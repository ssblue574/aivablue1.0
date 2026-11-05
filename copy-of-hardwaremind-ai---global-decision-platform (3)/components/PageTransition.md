# PageTransition 组件

流体页面过渡动画组件，提供多种过渡效果和空间转换动画。

## 功能特性

- **多种过渡类型**: fade、slide、scale、spatial
- **流畅动画**: 使用 cubic-bezier 缓动函数
- **交错动画**: 支持子元素交错入场
- **路由集成**: 与 React Router 无缝集成
- **空间转换**: 3D 空间转换效果
- **性能优化**: 使用 CSS transforms 和 GPU 加速

## 组件

### PageTransition

基础页面过渡组件。

```tsx
<PageTransition type="slide" duration={500} delay={0}>
  <YourContent />
</PageTransition>
```

**Props:**
- `type`: 过渡类型 ('fade' | 'slide' | 'scale' | 'spatial')
- `duration`: 动画持续时间（毫秒）
- `delay`: 延迟时间（毫秒）
- `className`: 额外的 CSS 类名

### RouteTransition

路由切换过渡包装器。

```tsx
<RouteTransition transitionKey={location.pathname} type="slide">
  <YourPage />
</RouteTransition>
```

**Props:**
- `transitionKey`: 用于触发过渡的唯一键（通常是路由路径）
- `type`: 过渡类型
- `children`: 子组件

### StaggeredTransition

交错入场动画组件。

```tsx
<StaggeredTransition staggerDelay={100} type="slide">
  {items.map(item => <Item key={item.id} {...item} />)}
</StaggeredTransition>
```

**Props:**
- `staggerDelay`: 每个子元素之间的延迟（毫秒）
- `type`: 过渡类型
- `children`: 子组件数组

## Hooks

### usePageTransition

页面过渡状态管理。

```tsx
const { isTransitioning, displayLocation } = usePageTransition(500);
```

### useRouteTransition

路由过渡动画控制。

```tsx
const { isEntering, isExiting, transitionKey } = useRouteTransition();
```

### useSpatialTransition

3D 空间转换效果。

```tsx
const { spatialStyle, triggerSpatialTransition } = useSpatialTransition();

// 触发空间转换
triggerSpatialTransition(-50, 5, 0, 600);
```

### useFluidTransition

流体过渡动画。

```tsx
const { isAnimating, progress, easedProgress, startTransition } = useFluidTransition(500);
```

## 过渡类型

### fade
淡入淡出效果，适合简单的内容切换。

### slide
位移动画，从下方滑入，适合页面切换。

### scale
缩放效果，从小到大，适合模态框和弹出内容。

### spatial
3D 空间转换，具有深度感，适合强调空间层次的场景。

## 使用示例

### 基础页面过渡

```tsx
import { PageTransition } from './components/PageTransition';

function MyPage() {
  return (
    <PageTransition type="slide" duration={600}>
      <div>
        <h1>Page Content</h1>
        <p>This content will slide in smoothly.</p>
      </div>
    </PageTransition>
  );
}
```

### 路由过渡

```tsx
import { RouteTransition } from './components/PageTransition';
import { useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();
  
  return (
    <RouteTransition transitionKey={location.pathname} type="spatial">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </RouteTransition>
  );
}
```

### 交错动画列表

```tsx
import { StaggeredTransition } from './components/PageTransition';

function ProductList({ products }) {
  return (
    <StaggeredTransition staggerDelay={80} type="slide">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </StaggeredTransition>
  );
}
```

### 自定义空间转换

```tsx
import { useSpatialTransition } from '../hooks/usePageTransition';

function SpatialPage() {
  const { spatialStyle, triggerSpatialTransition } = useSpatialTransition();
  
  const handleNavigate = () => {
    triggerSpatialTransition(-50, 5, 0, 600);
    // 导航逻辑...
  };
  
  return (
    <div style={spatialStyle}>
      <h1>3D Spatial Content</h1>
      <button onClick={handleNavigate}>Navigate</button>
    </div>
  );
}
```

## 性能考虑

- 使用 CSS `transform` 和 `opacity` 属性以利用 GPU 加速
- 避免在过渡期间修改布局属性（width、height、margin 等）
- 对于复杂的列表，考虑使用虚拟滚动
- 在低性能设备上，可以通过 `prefers-reduced-motion` 简化动画

## 可访问性

组件自动支持 `prefers-reduced-motion` 媒体查询，在用户设置减少动画时会简化或禁用动画效果。

## 浏览器兼容性

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- 对于不支持 3D transforms 的浏览器，spatial 类型会降级为 slide 效果
