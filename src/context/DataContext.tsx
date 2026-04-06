import React, { createContext, useContext, useState } from 'react';
import { GlobalState, IGUser, AppMode } from '../types';

type DataContextType = {
  state: GlobalState;
  setMode: (mode: AppMode) => void;
  setBasicData: (followers: IGUser[] | null, following: IGUser[] | null) => void;
  setCompareData: (
    opts: {
      oldFollowersData?: IGUser[] | null,
      newFollowersData?: IGUser[] | null,
      oldFollowingData?: IGUser[] | null,
      newFollowingData?: IGUser[] | null
    }
  ) => void;
  reset: () => void;
};

const initialState: GlobalState = {
  mode: 'basic',
  followersData: null,
  followingData: null,
  oldFollowersData: null,
  oldFollowingData: null,
  newFollowersData: null,
  newFollowingData: null,
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GlobalState>(initialState);

  const setMode = (mode: AppMode) => {
    setState(s => ({ ...s, mode }));
  };

  const setBasicData = (followers: IGUser[] | null, following: IGUser[] | null) => {
    setState(s => ({ ...s, followersData: followers, followingData: following }));
  };

  const setCompareData = (opts: Partial<GlobalState>) => {
    setState(s => ({ ...s, ...opts }));
  };

  const reset = () => {
    setState(initialState);
  };

  return (
    <DataContext.Provider value={{ state, setMode, setBasicData, setCompareData, reset }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
};
