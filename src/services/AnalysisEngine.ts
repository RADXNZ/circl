import { IGUser, AnalysisResult, TrendResult } from '../types';

export class AnalysisEngine {
  
  static analyzeBasic(followersArr: IGUser[], followingArr: IGUser[]): AnalysisResult {
    const followers: Record<string, IGUser> = {};
    const following: Record<string, IGUser> = {};
    
    followersArr.forEach(u => followers[u.username] = u);
    followingArr.forEach(u => following[u.username] = u);
    
    const notFollowingBack: IGUser[] = [];
    const fans: IGUser[] = [];
    const mutuals: IGUser[] = [];
    
    // Check who we follow
    for (const username in following) {
      if (!followers[username]) {
        notFollowingBack.push(following[username]);
      } else {
        mutuals.push(following[username]);
      }
    }
    
    // Check who follows us
    for (const username in followers) {
      if (!following[username]) {
        fans.push(followers[username]);
      }
    }
    
    return {
      followers,
      following,
      notFollowingBack,
      fans,
      mutuals
    };
  }

  static analyzeTrends(
    oldFollowersArr: IGUser[],
    newFollowersArr: IGUser[],
    oldFollowingArr: IGUser[],
    newFollowingArr: IGUser[]
  ): TrendResult {
    
    const oldFollowers = new Set(oldFollowersArr.map(u => u.username));
    const newFollowers = new Set(newFollowersArr.map(u => u.username));
    const newFollowersMap = new Map(newFollowersArr.map(u => [u.username, u]));
    const oldFollowersMap = new Map(oldFollowersArr.map(u => [u.username, u]));
    
    const oldFollowing = new Set(oldFollowingArr.map(u => u.username));
    const newFollowing = new Set(newFollowingArr.map(u => u.username));
    const newFollowingMap = new Map(newFollowingArr.map(u => [u.username, u]));
    const oldFollowingMap = new Map(oldFollowingArr.map(u => [u.username, u]));

    const newFollowersList: IGUser[] = [];
    const unfollowersList: IGUser[] = [];
    const newFollowingList: IGUser[] = [];
    const unfollowedList: IGUser[] = [];

    // Analyze followers diff
    for (const username of newFollowers) {
      if (!oldFollowers.has(username)) {
        newFollowersList.push(newFollowersMap.get(username)!);
      }
    }
    for (const username of oldFollowers) {
      if (!newFollowers.has(username)) {
        unfollowersList.push(oldFollowersMap.get(username)!);
      }
    }

    // Analyze following diff
    for (const username of newFollowing) {
      if (!oldFollowing.has(username)) {
        newFollowingList.push(newFollowingMap.get(username)!);
      }
    }
    for (const username of oldFollowing) {
      if (!newFollowing.has(username)) {
        unfollowedList.push(oldFollowingMap.get(username)!);
      }
    }

    return {
      newFollowers: newFollowersList,
      unfollowers: unfollowersList,
      newFollowing: newFollowingList,
      unfollowed: unfollowedList,
    };
  }
}
