import React, { useMemo, useState } from 'react';
import { useData } from '../context/DataContext';
import { AnalysisEngine } from '../services/AnalysisEngine';
import { RefreshCw } from 'lucide-react';
import { NarrativeSummary } from './NarrativeSummary';
import { InsightRow } from './InsightRow';
import { ChartsTab } from './ChartsTab';
import { ResultList } from './ResultList';
import { motion, AnimatePresence } from 'framer-motion';

export const Dashboard: React.FC = () => {
  const { state, reset } = useData();
  const [activeTab, setActiveTab] = useState<'Insights' | 'Accounts'>('Insights');

  const analysis = useMemo(() => {
    if (state.mode === 'basic' && state.followersData && state.followingData) {
      return AnalysisEngine.analyzeBasic(state.followersData, state.followingData);
    }
    return null;
  }, [state]);

  const trends = useMemo(() => {
    if (state.mode === 'compare' && state.oldFollowersData && state.newFollowersData && state.oldFollowingData && state.newFollowingData) {
      return AnalysisEngine.analyzeTrends(
        state.oldFollowersData,
        state.newFollowersData,
        state.oldFollowingData,
        state.newFollowingData
      );
    }
    return null;
  }, [state]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6 w-full"
    >
      <div className="flex justify-between items-center mb-4">
        <h2>Analytics Dashboard</h2>
        <button className="btn-secondary flex items-center gap-2" onClick={reset}>
          <RefreshCw size={16} /> Start Over
        </button>
      </div>

      {/* Narrative AI Generator */}
      <NarrativeSummary analysis={analysis} trends={trends} />

      {/* Global AI Insight Generator Row */}
      <InsightRow analysis={analysis} trends={trends} />

      {/* Core Tabs Toggle */}
      <div className="flex gap-4 border-b pb-2 mb-6" style={{ borderBottom: '1px solid var(--border-color)' }}>
        <button 
          onClick={() => setActiveTab('Insights')}
          style={{
            padding: '0.5rem 1rem',
            fontWeight: 500,
            color: activeTab === 'Insights' ? 'var(--primary-color)' : 'var(--text-secondary)',
            borderBottom: activeTab === 'Insights' ? '2px solid var(--primary-color)' : 'none',
            marginBottom: '-2px',
            position: 'relative'
          }}
        >
          Data Visualization
          {activeTab === 'Insights' && (
             <motion.div
               layoutId="activeTabIndicator"
               style={{
                 position: 'absolute',
                 bottom: -2, left: 0, right: 0,
                 height: 2,
                 backgroundColor: 'var(--primary-color)'
               }}
             />
          )}
        </button>
        <button 
          onClick={() => setActiveTab('Accounts')}
          style={{
            padding: '0.5rem 1rem',
            fontWeight: 500,
            color: activeTab === 'Accounts' ? 'var(--primary-color)' : 'var(--text-secondary)',
            borderBottom: 'none',
            marginBottom: '-2px',
            position: 'relative'
          }}
        >
          Account Directory
          {activeTab === 'Accounts' && (
             <motion.div
               layoutId="activeTabIndicator"
               style={{
                 position: 'absolute',
                 bottom: -2, left: 0, right: 0,
                 height: 2,
                 backgroundColor: 'var(--primary-color)'
               }}
             />
          )}
        </button>
      </div>

      {/* Content Rendering */}
      <div style={{ position: 'relative' }}>
        <AnimatePresence mode="wait">
          {activeTab === 'Insights' ? (
            <motion.div
              key="insights"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <ChartsTab analysis={analysis} trends={trends} />
            </motion.div>
          ) : (
            <motion.div
              key="accounts"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <ResultList analysis={analysis} trends={trends} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
    </motion.div>
  );
};
