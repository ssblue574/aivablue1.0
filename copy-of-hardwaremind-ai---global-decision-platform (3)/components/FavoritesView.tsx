import React from 'react';
import { clsx } from 'clsx';
import { Product } from '../data';
import { ProductCard } from './ProductCard';
import { useTheme } from '../ThemeContext';

interface FavoritesViewProps {
  t: (key: any) => string;
  favorites: Product[];
  selectedProducts: Product[];
  toggleSelection: (product: Product) => void;
  onViewProduct: (product: Product) => void;
  onToggleFavorite: (product: Product) => void;
  lang?: string;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  t,
  favorites,
  selectedProducts,
  toggleSelection,
  onViewProduct,
  onToggleFavorite,
  lang = 'zh',
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const hasFavorites = favorites.length > 0;

  return (
    <div className={clsx("min-h-screen pb-20", isDark ? "bg-black" : "bg-[#f5f5f7]")}>
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
        <div>
          <p className={clsx(
            "text-xs uppercase tracking-[0.3em] mb-2",
            isDark ? "text-white/40" : "text-black/40"
          )}>
            {t('favorites_badge')}
          </p>
          <h1 className={clsx(
            "text-3xl md:text-4xl font-semibold mb-2",
            isDark ? "text-white" : "text-black"
          )}>
            {t('favorites_title')}
          </h1>
          <p className={clsx(
            "text-sm",
            isDark ? "text-white/60" : "text-black/60"
          )}>
            {t('favorites_subtitle')}
          </p>
        </div>

        {!hasFavorites ? (
          <div className={clsx(
            "mt-8 border border-dashed rounded-3xl py-20 text-center",
            isDark ? "border-white/20 text-white/60" : "border-black/20 text-black/60"
          )}>
            <p className="text-lg font-medium mb-2">{t('favorites_empty_title')}</p>
            <p className="text-sm">{t('favorites_empty_desc')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 mt-4">
            {favorites.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                isSelected={selectedProducts.some(p => p.id === product.id)}
                isFavorite={true}
                onToggleSelect={toggleSelection}
                onToggleFavorite={onToggleFavorite}
                onViewDetail={onViewProduct}
                t={t}
                lang={lang}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};


