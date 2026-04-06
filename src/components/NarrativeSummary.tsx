import React, { useState, useEffect, useMemo } from 'react';
import { AnalysisResult, TrendResult } from '../types';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../utils/i18n';

type Props = {
  analysis?: AnalysisResult | null;
  trends?: TrendResult | null;
};

export const NarrativeSummary: React.FC<Props> = ({ analysis, trends }) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { lang } = useLanguage();

  const story = useMemo(() => {
    if (!analysis && !trends) return '';

    const t = (key: any) => getTranslation(lang, key);
    const parts: string[] = [`${t('ai.hi')} `];

    if (trends) {
      if (trends.unfollowers.length > 0) {
        parts.push(` ${t('ai.lost')} ${trends.unfollowers.length} ${t('ai.lostSuffix')}`);
        if (trends.unfollowers.length <= 3) {
          parts.push(` ${t('ai.lostSpecifically')} ${trends.unfollowers.map(u => '@' + u.username).join(', ')}.`);
        } else {
          parts.push(` ${t('ai.lostInstance')} @${trends.unfollowers[0].username} ${t('ai.lostInstanceSuffix')}`);
        }
      } else {
        parts.push(` ${t('ai.noLost')}`);
      }

      if (trends.newFollowers.length > 0) {
         const randomNew = trends.newFollowers[Math.floor(Math.random() * trends.newFollowers.length)];
         parts.push(` ${t('ai.gained')} ${trends.newFollowers.length} ${t('ai.gainedSuffix')} @${randomNew.username}.`);
      }
    }

    if (analysis) {
      const followersCount = Object.keys(analysis.followers).length;
      const followingCount = Object.keys(analysis.following).length;
      
      if (followingCount > 0) {
        const ratio = followersCount / followingCount;
        if (ratio >= 1.5) parts.push(` ${t('ai.ratioExcel')}`);
        else if (ratio < 0.5) parts.push(` ${t('ai.ratioLow')}`);
      }

      if (analysis.notFollowingBack.length > 0) {
        const ghosts = analysis.notFollowingBack;
        parts.push(` ${t('ai.ghostsPrefix')} ${ghosts.length} ${t('ai.ghostsSuffix')}`);
        parts.push(` ${t('ai.review')} @${ghosts[0].username}.`);
      }

      if (analysis.fans.length > 0) {
        const fans = analysis.fans;
        parts.push(` ${t('ai.fansPrefix')} ${fans.length} ${t('ai.fansSuffix')}`);
      }
    }

    parts.push(` ${t('ai.closing')}`);

    return parts.join('');
  }, [analysis, trends, lang]);

  // Typewriter Effect
  useEffect(() => {
    if (!story) return;

    let isCancelled = false;
    setIsTyping(true);
    setDisplayText('');
    
    const typeWriter = async () => {
      // Use substring assignment to completely eliminate React state racing/typos
      for (let i = 0; i <= story.length; i++) {
        if (isCancelled) break;
        setDisplayText(story.substring(0, i));
        await new Promise(r => setTimeout(r, 20)); // typing speed
      }
      if (!isCancelled) setIsTyping(false);
    };

    typeWriter();

    return () => {
      isCancelled = true;
    };
  }, [story]);

  if (!analysis && !trends) return null;

  return (
    <div className="mb-8 w-full fade-in z-10 position-relative">
      <div 
        className="glass-panel" 
        style={{ 
          padding: '1.5rem', 
          borderRadius: '16px', 
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid var(--primary-color)',
          boxShadow: '0 4px 20px rgba(16, 185, 129, 0.15)'
        }}
      >
        {/* Subtle background glow */}
        <div style={{
          position: 'absolute',
          top: 0, right: 0,
          width: '150px', height: '150px',
          background: 'var(--primary-color)',
          opacity: 0.1,
          filter: 'blur(50px)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />

        <div className="flex items-start gap-4">
          <div 
            className="flex-shrink-0 flex items-center justify-center mt-1" 
            style={{ 
              width: 40, height: 40, 
              borderRadius: '12px', 
              background: 'var(--primary-gradient)',
              color: 'white',
              boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)'
            }}
          >
            <Sparkles size={20} />
          </div>
          
          <div className="flex-1">
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--primary-color)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Circl Intelligence
              {isTyping && <span className="flex items-center gap-1"><span className="animate-pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }}></span><span className="animate-pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', animationDelay: '150ms' }}></span><span className="animate-pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', animationDelay: '300ms' }}></span></span>}
            </h3>
            <p 
              className="text-primary" 
              style={{ 
                fontSize: '1.1rem', 
                lineHeight: 1.6, 
                color: 'var(--text-primary)',
                minHeight: '60px' // prevent jumping layout when typing starts
              }}
            >
              {displayText}
              {isTyping && <span style={{ display: 'inline-block', width: '2px', height: '1.2em', background: 'var(--primary-color)', verticalAlign: 'middle', marginLeft: '2px', animation: 'blink 1s step-end infinite' }}></span>}
            </p>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes blink { 50% { opacity: 0; } }
      `}</style>
    </div>
  );
};
