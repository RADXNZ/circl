import React from 'react';
import { AnalysisResult, TrendResult } from '../types';
import { Users, UserMinus, Percent, Heart, UserX } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../utils/i18n';
import { NumberTicker } from './NumberTicker';
import { motion } from 'framer-motion';

type Props = {
  analysis?: AnalysisResult | null;
  trends?: TrendResult | null;
};

type InsightCard = {
  id: string;
  count?: string | number;
  text: string;
  icon: React.ReactNode;
  tint: string;
  color: string;
};

export const InsightRow: React.FC<Props> = ({ analysis, trends }) => {
  const cards: InsightCard[] = [];
  const { lang } = useLanguage();
  const t = (key: any) => getTranslation(lang, key);

  // Trend Mode Insights
  if (trends) {
    if (trends.unfollowers.length > 0) {
      cards.push({
        id: 'lost_followers',
        count: trends.unfollowers.length,
        text: t('cards.lost'),
        icon: <UserMinus size={24} />,
        tint: 'var(--tint-danger)',
        color: 'var(--danger-color)',
      });

      // Assume array is ordered latest first if natively parsed (we just take the first)
      const recent = trends.unfollowers[0];
      cards.push({
        id: 'recent_unfollower',
        text: `${t('cards.recentUnfollower')} @${recent.username}`,
        icon: <UserX size={24} />,
        tint: 'var(--tint-warning)',
        color: 'var(--warning-color)',
      });
    }
  }

  // Basic Mode Insights
  if (analysis) {
    if (analysis.notFollowingBack.length > 0) {
      cards.push({
        id: 'not_following_back',
        count: analysis.notFollowingBack.length,
        text: t('cards.notFollowingBack'),
        icon: <Users size={24} />,
        tint: 'var(--tint-danger)',
        color: 'var(--danger-color)',
      });
    }

    if (analysis.fans.length > 0) {
      cards.push({
        id: 'fans',
        count: analysis.fans.length,
        text: t('cards.fans'),
        icon: <Heart size={24} />,
        tint: 'var(--tint-success)',
        color: 'var(--success-color)',
      });
    }

    const totalFollowers = Object.keys(analysis.followers).length;
    const totalFollowing = Object.keys(analysis.following).length;
    
    if (totalFollowing > 0) {
      const ratio = ((totalFollowers / totalFollowing) * 100).toFixed(1);
      const isAbove = Number(ratio) >= 100;
      cards.push({
        id: 'ratio',
        count: `${ratio}%`,
        text: isAbove ? t('cards.ratioAbove') : t('cards.ratioBelow'),
        icon: <Percent size={24} />,
        tint: 'var(--tint-info)',
        color: 'var(--info-color)',
      });
    }
  }

  if (cards.length === 0) return null;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
  };

  return (
    <div className="mb-8 w-full">
      <motion.div 
        className="insight-row-container" 
        variants={container}
        initial="hidden"
        animate="show"
        style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem',
          paddingBottom: '1rem',
        }}
      >
        <style>{`
          .insight-card {
            border-radius: var(--radius-lg);
            padding: 1.5rem;
            display: flex;
            flex-direction: column;
            gap: 1rem;
            transition: box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            border: 1px solid rgba(255,255,255,0.05);
          }
        `}</style>
        
        {cards.map(card => (
          <motion.div 
            variants={item}
            whileHover={{ y: -4, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)' }}
            key={card.id} 
            className="insight-card"
            style={{ backgroundColor: card.tint }}
          >
            <div style={{ color: card.color }}>{card.icon}</div>
            <div>
              {card.count !== undefined && (
                <div style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1, color: card.color, marginBottom: '0.5rem' }}>
                  <NumberTicker value={card.count} />
                </div>
              )}
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                {card.text}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
