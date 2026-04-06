import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { UploadSetup } from './UploadSetup';
import { Dashboard } from './Dashboard';
import { LandingPage } from './LandingPage';

const MainView: React.FC = () => {
  const { state } = useData();
  const [isStarted, setIsStarted] = useState(false);

  const showBasicDashboard = state.mode === 'basic' && state.followersData && state.followingData;
  const showCompareDashboard = state.mode === 'compare' && state.oldFollowersData && state.oldFollowingData && state.newFollowersData && state.newFollowingData;

  return (
    <main>
      {!showBasicDashboard && !showCompareDashboard && !isStarted && (
        <LandingPage onStart={() => setIsStarted(true)} />
      )}

      {!showBasicDashboard && !showCompareDashboard && isStarted && <UploadSetup />}

      {(showBasicDashboard || showCompareDashboard) && <Dashboard />}
    </main>
  );
};

export default MainView;
