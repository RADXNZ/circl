export type IGUser = {
  username: string;
  url?: string;
  timestamp?: number;
};

export type AnalysisResult = {
  followers: Record<string, IGUser>;
  following: Record<string, IGUser>;
  notFollowingBack: IGUser[];
  fans: IGUser[]; // followers you don't follow back
  mutuals: IGUser[];
};

export type TrendResult = {
  newFollowers: IGUser[];
  unfollowers: IGUser[];
  newFollowing: IGUser[];
  unfollowed: IGUser[]; // people you stopped following
};

export type AppMode = 'basic' | 'compare';

export type GlobalState = {
  mode: AppMode;
  
  // Basic Mode Files
  followersData: IGUser[] | null;
  followingData: IGUser[] | null;
  
  // Compare Mode Files
  oldFollowersData: IGUser[] | null;
  oldFollowingData: IGUser[] | null;
  newFollowersData: IGUser[] | null;
  newFollowingData: IGUser[] | null;
};
