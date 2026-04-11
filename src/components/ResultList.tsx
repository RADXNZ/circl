import React, { useState, useMemo } from 'react';
import { IGUser, AnalysisResult, TrendResult } from '../types';
import { Copy, Check, Search, ExternalLink, Download } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../utils/i18n';
import { motion } from 'framer-motion';

export type Category = 'Never Followed Back' | 'Loyal Fans' | 'Recent Unfollowers' | 'Mutual' | 'New Followers';

export type EnrichedUser = IGUser & {
  category: Category;
};

type Props = {
  analysis?: AnalysisResult | null;
  trends?: TrendResult | null;
};

const getCategoryColor = (cat: Category) => {
  switch (cat) {
    case 'Never Followed Back': return 'var(--danger-color)';
    case 'Recent Unfollowers': return 'var(--warning-color)';
    case 'Loyal Fans': return 'var(--success-color)';
    case 'New Followers': return 'var(--primary-color)';
    case 'Mutual': return 'var(--text-secondary)';
    default: return 'transparent';
  }
};

const getCategoryTint = (cat: Category) => {
  switch (cat) {
    case 'Never Followed Back': return 'var(--tint-danger)';
    case 'Recent Unfollowers': return 'var(--tint-warning)';
    case 'Loyal Fans': return 'var(--tint-success)';
    case 'New Followers': return 'var(--tint-info)';
    case 'Mutual': return 'transparent';
    default: return 'transparent';
  }
};

export const ResultList: React.FC<Props> = ({ analysis, trends }) => {
  const [filter, setFilter] = useState<Category | 'All'>('All');
  type SortMode = 'a-z' | 'z-a' | 'oldest' | 'newest';
  const [sortMode, setSortMode] = useState<SortMode>('a-z');
  const [search, setSearch] = useState('');
  const [copiedMap, setCopiedMap] = useState<Record<string, boolean>>({});
  
  const { lang } = useLanguage();
  const t = (key: any) => getTranslation(lang, key);

  const getCategoryLabel = (cat: Category | 'All') => {
    switch (cat) {
      case 'All': return t('directory.catAll');
      case 'Never Followed Back': return t('directory.catNotFollowing');
      case 'Loyal Fans': return t('directory.catFans');
      case 'Mutual': return t('directory.catMutual');
      case 'Recent Unfollowers': return t('directory.catUnfollowers');
      case 'New Followers': return t('directory.catNewFollowers');
      default: return cat;
    }
  };

  const allUsers = useMemo(() => {
    const list: Record<string, EnrichedUser> = {};
    
    if (analysis) {
      analysis.notFollowingBack.forEach(u => list[u.username] = { ...u, category: 'Never Followed Back' });
      analysis.fans.forEach(u => list[u.username] = { ...u, category: 'Loyal Fans' });
      analysis.mutuals.forEach(u => list[u.username] = { ...u, category: 'Mutual' });
    }
    
    if (trends) {
      trends.unfollowers.forEach(u => list[u.username] = { ...u, category: 'Recent Unfollowers' });
      trends.newFollowers.forEach(u => list[u.username] = { ...u, category: 'New Followers' });
    }
    
    return Object.values(list);
  }, [analysis, trends]);

  const filtered = useMemo(() => {
    let result = allUsers.filter(u => {
      const matchSearch = u.username.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === 'All' || u.category === filter;
      return matchSearch && matchFilter;
    });

    result.sort((a, b) => {
      if (sortMode === 'a-z') return a.username.localeCompare(b.username);
      if (sortMode === 'z-a') return b.username.localeCompare(a.username);
      if (sortMode === 'oldest' || sortMode === 'newest') {
        const tA = typeof a.timestamp === 'number' ? a.timestamp : 0;
        const tB = typeof b.timestamp === 'number' ? b.timestamp : 0;
        
        if (tA === tB) return a.username.localeCompare(b.username); // Fallback to A-Z
        return sortMode === 'oldest' ? tA - tB : tB - tA;
      }
      return 0;
    });

    return result;
  }, [allUsers, filter, search, sortMode]);

  const copyToClipboard = (username: string) => {
    navigator.clipboard.writeText(username);
    setCopiedMap(prev => ({ ...prev, [username]: true }));
    setTimeout(() => {
      setCopiedMap(prev => ({ ...prev, [username]: false }));
    }, 2000);
  };

  const downloadList = () => {
    const text = filtered.map(u => `@${u.username}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `circl_${filter.replace(/\s+/g, '_').toLowerCase()}_list.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const categories: (Category | 'All')[] = ['All', 'Never Followed Back', 'Loyal Fans', 'Mutual'];
  if (trends) {
    categories.push('Recent Unfollowers', 'New Followers');
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Filter & Controls Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {/* Category Filter Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {categories.map(c => (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              key={c}
              onClick={() => setFilter(c)}
              className={filter === c ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem', whiteSpace: 'nowrap' }}
            >
              {getCategoryLabel(c)}
            </motion.button>
          ))}
        </div>

        {/* Sort + Search Row */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Sorting Dropdown */}
          <div className="card" style={{ padding: '0.45rem 0.9rem', flexShrink: 0 }}>
            <select 
              value={sortMode}
              onChange={e => setSortMode(e.target.value as SortMode)}
              style={{ 
                background: 'transparent', border: 'none', color: 'var(--text-primary)', 
                outline: 'none', cursor: 'pointer', fontSize: '0.85rem',
                fontFamily: 'inherit',
              }}
            >
              <option value="a-z" style={{ background: 'var(--bg-color)', color: 'var(--text-primary)' }}>{t('directory.sortAZ')}</option>
              <option value="z-a" style={{ background: 'var(--bg-color)', color: 'var(--text-primary)' }}>{t('directory.sortZA')}</option>
              <option value="oldest" style={{ background: 'var(--bg-color)', color: 'var(--text-primary)' }}>{t('directory.sortOldest')}</option>
              <option value="newest" style={{ background: 'var(--bg-color)', color: 'var(--text-primary)' }}>{t('directory.sortNewest')}</option>
            </select>
          </div>
          
          {/* Search Box */}
          <div className="card flex items-center gap-2" style={{ padding: '0.45rem 0.9rem', flex: 1, minWidth: 160, maxWidth: 320 }}>
            <Search size={15} color="var(--text-secondary)" style={{ flexShrink: 0 }} />
            <input 
              type="text" 
              placeholder={t('directory.searchPlaceholder')} 
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ 
                background: 'transparent', 
                border: 'none', 
                outline: 'none', 
                color: 'var(--text-primary)',
                width: '100%',
                fontSize: '0.875rem',
                fontFamily: 'inherit',
              }}
            />
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="flex justify-between items-center p-4 border-b" style={{ borderBottom: '1px solid var(--border-color)' }}>
          <p className="text-secondary" style={{ fontSize: '0.875rem' }}>
            {t('directory.showing')} {filtered.length} {t('directory.accounts')}
          </p>
          {filtered.length > 0 && (
            <button 
              onClick={downloadList}
              className="btn-secondary flex items-center gap-2" 
              style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}
              title="Download visible accounts as TXT"
            >
              <Download size={14} className="text-primary" /> {t('directory.downloadTXT')}
            </button>
          )}
        </div>
        
        <ul style={{ listStyle: 'none', maxHeight: 600, overflowY: 'auto' }}>
          {filtered.map(u => (
            <li 
              key={u.username} 
              className="flex justify-between items-center p-4 transition-colors"
              style={{ 
                borderBottom: '1px solid var(--border-color)',
                borderLeft: `4px solid ${getCategoryColor(u.category)}`,
                backgroundColor: getCategoryTint(u.category)
              }}
            >
              <div className="flex items-center gap-4">
                <div 
                  className="flex items-center justify-center font-bold"
                  style={{ 
                    width: 40, height: 40, borderRadius: '50%', 
                    background: 'var(--bg-color)', color: 'var(--text-primary)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  {u.username[0].toUpperCase()}
                </div>
                <div>
                  <div className="font-bold flex items-center gap-2">
                    {u.username}
                    <span 
                      style={{
                        fontSize: '0.7rem',
                        padding: '2px 8px',
                        borderRadius: 12,
                        backgroundColor: getCategoryColor(u.category),
                        color: ['Mutual'].includes(u.category) ? 'var(--text-primary)' : '#fff',
                        border: '1px solid var(--border-color)'
                      }}
                    >
                      {getCategoryLabel(u.category)}
                    </span>
                  </div>
                  {u.timestamp && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      Since {new Date(u.timestamp).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => copyToClipboard(u.username)}
                  className="btn-secondary flex items-center justify-center p-2"
                  title="Copy username"
                >
                  {copiedMap[u.username] ? <Check size={16} color="var(--success-color)" /> : <Copy size={16} />}
                </motion.button>
                <motion.a 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  href={u.url || `https://instagram.com/${u.username}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-primary flex items-center justify-center p-2"
                  title="Open Profile"
                >
                  <ExternalLink size={16} />
                </motion.a>
              </div>
            </li>
          ))}
          {filtered.length === 0 && (
            <div className="p-8 text-center text-secondary">
              No accounts found matching your filter criteria.
            </div>
          )}
        </ul>
      </div>
    </div>
  );
};
