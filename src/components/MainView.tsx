import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../context/DataContext';
import { useNavigation } from '../context/NavigationContext';
import { UploadSetup } from './UploadSetup';
import { Dashboard } from './Dashboard';
import { LandingPage } from './LandingPage';

// Step 0 = Landing, Step 1 = Upload, Step 2 = Dashboard
const MainView: React.FC = () => {
  const { state, reset } = useData();
  const { homeSignal } = useNavigation();
  const [isStarted, setIsStarted] = useState(false);
  const isMounted = useRef(false);

  const showBasicDashboard = state.mode === 'basic' && state.followersData && state.followingData;
  const showCompareDashboard = state.mode === 'compare' && state.oldFollowersData && state.oldFollowingData && state.newFollowersData && state.newFollowingData;
  const showDashboard = showBasicDashboard || showCompareDashboard;

  // Full reset helper — always clears both local + data state
  const fullReset = () => {
    setIsStarted(false);
    reset();
  };

  // Listen for logo/home button click → reset everything back to landing page
  useEffect(() => {
    if (homeSignal === 0) return; // skip initial mount
    fullReset();
  }, [homeSignal]);

  // Push a history entry whenever we move to a new "page"
  // Guard with isMounted to prevent push on initial render
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    if (showDashboard) {
      window.history.pushState({ step: 'dashboard' }, '');
    } else if (isStarted) {
      window.history.pushState({ step: 'upload' }, '');
    } else {
      window.history.pushState({ step: 'landing' }, '');
    }
  }, [isStarted, showDashboard]);

  // Listen for browser back button
  useEffect(() => {
    const handlePopState = () => {
      // Always do a full reset — simpler and more reliable
      fullReset();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [reset]);

  return (
    <main>
      {!showDashboard && !isStarted && (
        <LandingPage onStart={() => setIsStarted(true)} />
      )}

      {!showDashboard && isStarted && <UploadSetup />}

      {showDashboard && <Dashboard />}
    </main>
  );
};

export default MainView;

