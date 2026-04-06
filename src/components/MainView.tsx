import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { UploadSetup } from './UploadSetup';
import { Dashboard } from './Dashboard';
import { LandingPage } from './LandingPage';

// We use the browser History API to support the Back button
// Step 0 = Landing, Step 1 = Upload, Step 2 = Dashboard
const MainView: React.FC = () => {
  const { state, reset } = useData();
  const [isStarted, setIsStarted] = useState(false);

  const showBasicDashboard = state.mode === 'basic' && state.followersData && state.followingData;
  const showCompareDashboard = state.mode === 'compare' && state.oldFollowersData && state.oldFollowingData && state.newFollowersData && state.newFollowingData;
  const showDashboard = showBasicDashboard || showCompareDashboard;

  // Push a history entry whenever we move to a new "page"
  useEffect(() => {
    if (showDashboard) {
      window.history.pushState({ step: 'dashboard' }, '');
    } else if (isStarted) {
      window.history.pushState({ step: 'upload' }, '');
    }
  }, [isStarted, showDashboard]);

  // Listen for browser back button
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      const step = e.state?.step;
      if (step === 'dashboard') {
        // they went back to upload — but dashboard is now the "current" page,
        // so this shouldn't normally fire. Let it fall through to upload.
        reset();
      } else if (step === 'upload') {
        // they went back from dashboard to upload page
        reset();
      } else {
        // they went back from upload to landing
        setIsStarted(false);
        reset();
      }
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
