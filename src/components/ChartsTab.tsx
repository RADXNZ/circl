import React, { useMemo } from 'react';
import { AnalysisResult, TrendResult } from '../types';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../utils/i18n';

type Props = {
  analysis?: AnalysisResult | null;
  trends?: TrendResult | null;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="card" style={{ padding: '0.75rem' }}>
        <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{label || payload[0].name}</p>
        <p style={{ color: payload[0].payload.color }}>
          {payload[0].name === 'days' ? `${payload[0].value} days` : payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export const ChartsTab: React.FC<Props> = ({ analysis }) => {
  const { lang } = useLanguage();
  const t = (key: any) => getTranslation(lang, key);
  
  const pieData = useMemo(() => {
    if (!analysis) return [];
    return [
      { name: t('charts.notFollowing'), value: analysis.notFollowingBack.length, color: 'var(--danger-color)' },
      { name: t('charts.fans'), value: analysis.fans.length, color: 'var(--success-color)' },
      { name: t('charts.mutuals'), value: analysis.mutuals.length, color: 'var(--info-color)' }
    ].filter(d => d.value > 0);
  }, [analysis, lang]);

  const barData = useMemo(() => {
    if (!analysis) return [];
    return [
      { name: 'Followers', count: Object.keys(analysis.followers).length, color: 'var(--success-color)' },
      { name: 'Following', count: Object.keys(analysis.following).length, color: 'var(--info-color)' }
    ];
  }, [analysis]);

  const oldestData = useMemo(() => {
    if (!analysis) return [];
    const followers = Object.values(analysis.followers);
    const withTs = followers.filter(u => typeof u.timestamp === 'number');
    if (withTs.length === 0) return [];

    const sorted = withTs.sort((a, b) => a.timestamp! - b.timestamp!);
    const top10 = sorted.slice(0, 10);
    
    return top10.map(u => ({
      name: u.username,
      days: Math.floor((Date.now() - u.timestamp!) / (1000 * 60 * 60 * 24)),
      color: 'var(--primary-color)'
    }));
  }, [analysis]);

  if (!analysis) {
    return <p className="text-secondary">No explicit data to chart.</p>;
  }

  return (
    <div className="flex flex-col gap-8 slide-in w-full">
      
      <div className="grid gap-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        
        {/* Followers vs Following */}
        <div className="card flex flex-col items-center">
          <div className="w-full text-center mb-6">
            <h3 style={{ fontSize: '1.125rem' }}>{t('charts.balanceTitle')}</h3>
            <p className="text-secondary" style={{ fontSize: '0.875rem' }}>{t('charts.balanceSub')}</p>
          </div>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={60}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Relationship Breakdown */}
        <div className="card flex flex-col items-center">
          <div className="w-full text-center mb-6">
            <h3 style={{ fontSize: '1.125rem' }}>{t('charts.relTitle')}</h3>
            <p className="text-secondary" style={{ fontSize: '0.875rem' }}>{t('charts.relSub')}</p>
          </div>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '0.75rem', opacity: 0.8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top 10 Oldest Accounts */}
      {oldestData.length > 0 && (
        <div className="card flex flex-col items-center">
          <div className="w-full text-center mb-6">
            <h3 style={{ fontSize: '1.125rem' }}>{t('charts.oldestTitle')}</h3>
            <p className="text-secondary" style={{ fontSize: '0.875rem' }}>{t('charts.oldestSub')}</p>
          </div>
          <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={oldestData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }} layout="horizontal">
                <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={11} tickLine={false} axisLine={false} angle={-45} textAnchor="end" />
                <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                <Bar dataKey="days" radius={[4, 4, 0, 0]} fill="var(--primary-gradient)">
                  {oldestData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={'url(#arcGradient)'} /> // using same gradient as app.tsx logo
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

    </div>
  );
};
