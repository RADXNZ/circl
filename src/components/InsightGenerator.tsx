import React from 'react';
import { AnalysisResult, TrendResult } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

type Props = {
  analysis: AnalysisResult | null;
  trends: TrendResult | null;
};

export const InsightGenerator: React.FC<Props> = ({ analysis, trends }) => {
  
  if (analysis) {
    const totalFollowers = Object.keys(analysis.followers).length;
    const totalFollowing = Object.keys(analysis.following).length;
    const notFollowingBackCount = analysis.notFollowingBack.length;
    const ratio = totalFollowers > 0 ? ((totalFollowers / totalFollowing) * 100).toFixed(1) : 0;

    const data = [
      { name: 'Followers', count: totalFollowers, color: 'var(--primary-color)' },
      { name: 'Following', count: totalFollowing, color: 'var(--success-color)' },
    ];

    return (
      <div className="flex flex-col gap-8">
        <div className="grid gap-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <div className="card" style={{ background: 'var(--bg-color)' }}>
            <h4 className="text-secondary text-sm">Total Followers</h4>
            <div className="text-3xl font-bold gradient-text">{totalFollowers}</div>
          </div>
          <div className="card" style={{ background: 'var(--bg-color)' }}>
            <h4 className="text-secondary text-sm">Total Following</h4>
            <div className="text-3xl font-bold">{totalFollowing}</div>
          </div>
          <div className="card" style={{ borderLeft: '4px solid var(--danger-color)' }}>
            <h4 className="text-secondary text-sm">Not Following Back</h4>
            <div className="text-3xl font-bold">{notFollowingBackCount}</div>
          </div>
        </div>

        <div>
          <h3 className="mb-4">AI Summary</h3>
          <p className="mb-2">
            You are following <strong>{totalFollowing}</strong> people, and <strong>{totalFollowers}</strong> are following you back.
          </p>
          <p className="mb-2">
            Your follow-to-following ratio is <strong>{ratio}%</strong>.
            {totalFollowers > totalFollowing ? " You have more followers than people you follow! 🌟" : " You follow more people than follow you back."}
          </p>
          <p>
            There are <strong>{notFollowingBackCount}</strong> accounts you follow that don't follow you back. 
            You can find them in the "Not Following Back" tab to curate your feed.
          </p>
        </div>

        <div style={{ height: 300, width: '100%', marginTop: '2rem' }}>
          <h4 className="mb-4 text-center">Network Comparison</h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ borderRadius: 8, border: 'none', boxShadow: 'var(--shadow-md)' }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  if (trends) {
    const gained = trends.newFollowers.length;
    const lost = trends.unfollowers.length;
    const net = gained - lost;

    const data = [
      { name: 'Gained', count: gained, color: 'var(--success-color)' },
      { name: 'Lost', count: lost, color: 'var(--danger-color)' },
    ];

    return (
      <div className="flex flex-col gap-8">
        <div className="grid gap-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <div className="card" style={{ background: 'var(--bg-color)' }}>
            <h4 className="text-secondary text-sm">Gained Followers</h4>
            <div className="text-3xl font-bold" style={{ color: 'var(--success-color)' }}>+{gained}</div>
          </div>
          <div className="card" style={{ background: 'var(--bg-color)' }}>
            <h4 className="text-secondary text-sm">Lost Followers</h4>
            <div className="text-3xl font-bold" style={{ color: 'var(--danger-color)' }}>-{lost}</div>
          </div>
          <div className="card" style={{ borderLeft: net >= 0 ? '4px solid var(--success-color)' : '4px solid var(--danger-color)' }}>
            <h4 className="text-secondary text-sm">Net Growth</h4>
            <div className="text-3xl font-bold">{net > 0 ? `+${net}` : net}</div>
          </div>
        </div>

        <div>
          <h3 className="mb-4">Trend Summary</h3>
          <p className="mb-2">
            Since your last export, you gained <strong>{gained}</strong> new followers and lost <strong>{lost}</strong>.
          </p>
          <p>
            {net > 0 ? "You're growing! Keep up the good work. 📈" : net < 0 ? "You've had a minor dip in followers. Check the 'Unfollowed You' tab to see who left." : "Your follower count has remained stable."}
          </p>
        </div>

        <div style={{ height: 300, width: '100%', marginTop: '2rem' }}>
          <h4 className="mb-4 text-center">Follower Changes</h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ borderRadius: 8, border: 'none', boxShadow: 'var(--shadow-md)' }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    );
  }

  return null;
};
