import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';
import { ComparisonMetric } from '../data';

interface ComparisonChartProps {
  data: ComparisonMetric[];
  products: string[];
  t?: (key: any) => string;
}

const COLORS = ['#0ea5e9', '#d946ef', '#22c55e', '#f59e0b'];

export const ComparisonChart: React.FC<ComparisonChartProps> = ({ data, products, t = (k: any) => k }) => {
  return (
    <div className="w-full h-[280px] sm:h-[320px] lg:h-[420px] bg-dark-card rounded-xl p-4 border border-dark-border">
      <h3 className="text-lg font-semibold text-brand-100 mb-4 text-center">{t('chart_title')}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis dataKey="metric" tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />

          {products.map((product, index) => (
            <Radar
              key={product}
              name={product}
              dataKey={product}
              stroke={COLORS[index % COLORS.length]}
              fill={COLORS[index % COLORS.length]}
              fillOpacity={0.3}
            />
          ))}
          <Legend />
          <Tooltip
            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
            itemStyle={{ color: '#f8fafc' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
