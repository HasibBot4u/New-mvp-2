import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Settings, LogOut, Award, Clock,
  Flame, ChevronRight, Shield, FileText, Calendar, Trophy
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useVideoProgress } from '../hooks/useVideoProgress';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { useToast } from '../components/ui/Toast';

export function ProfilePage() {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { getStats } = useVideoProgress();
  const { showToast } = useToast();
  const [stats, setStats] = useState({
    completedCount: 0,
    hoursWatched: 0,
    streak: 0,
  });
  const [streakData, setStreakData] = useState<any>(null);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const hasRefreshed = useRef(false);

  useEffect(() => {
    // Load stats immediately from localStorage — instant
    setStats(getStats());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Refresh profile from database once in background
    // Use a ref to prevent double-refresh in StrictMode
    if (!hasRefreshed.current) {
      hasRefreshed.current = true;
      refreshProfile().catch(console.error);
    }
    
    const fetchGamificationData = async () => {
      if (!user) return;
      try {
        const { data: streak } = await supabase
          .from('study_streaks')
          .select('*')
          .eq('user_id', user.id)
          .single();
        if (streak) setStreakData(streak);

        const { data: badges } = await supabase
          .from('achievements')
          .select('*')
          .eq('user_id', user.id)
          .order('earned_at', { ascending: false });
        if (badges) setAchievements(badges);
      } catch (e) {
        console.error('Error fetching gamification data:', e);
      }
    };

    fetchGamificationData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      navigate('/login', { replace: true });
    } catch (e) {
      console.error('Sign out failed:', e);
      // Nuclear option — works even if Supabase is down
      localStorage.clear();
      sessionStorage.clear();
      window.location.replace('/login');
    } finally {
      setIsSigningOut(false);
    }
  };

  // Use live profile first, fall back to cache
  const cachedProfile = (() => {
    try {
      const raw = localStorage.getItem('nexusedu_profile_cache');
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  })();

  const displayProfile = profile || cachedProfile;
  const isAdmin = displayProfile?.role === 'admin';

  const generateProgressReport = () => {
    const printContent = document.getElementById('progress-report-print');
    if (!printContent) return;
    
    const win = window.open('', '_blank');
    if (!win) {
      showToast('Please allow popups to generate the report');
      return;
    }
    
    win.document.write(`
      <html>
        <head>
          <title>Progress Report - ${displayProfile?.display_name || 'Student'}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
            .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #2563eb; padding-bottom: 20px; }
            .logo { font-size: 24px; font-weight: bold; color: #2563eb; }
            .title { font-size: 28px; margin: 10px 0; }
            .info { margin-bottom: 30px; }
            .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 40px; }
            .stat-box { border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px; text-align: center; }
            .stat-value { font-size: 24px; font-weight: bold; color: #2563eb; }
            .stat-label { font-size: 14px; color: #6b7280; text-transform: uppercase; }
            .badges { margin-top: 30px; }
            .badge-list { display: flex; flex-wrap: wrap; gap: 10px; }
            .badge { background: #f3f4f6; padding: 8px 16px; border-radius: 20px; font-size: 14px; }
            .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #9ca3af; }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    win.document.close();
    setTimeout(() => {
      win.print();
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="bg-primary text-white pt-12 pb-6 
                         px-4 sticky top-0 z-30 shadow-md">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-1">Profile</h1>
          <p className="text-white/70 text-sm">
            Manage your account and settings
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <Breadcrumb items={[
          { label: 'Home', href: '/' },
          { label: 'Profile' },
        ]} />

        {/* User Info Card */}
        <div className="bg-white rounded-xl shadow-sm border 
                        border-gray-100 p-6 flex items-center 
                        space-x-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full 
                          flex items-center justify-center 
                          text-primary flex-shrink-0">
            <User className="w-8 h-8" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-gray-900 
                           truncate">
              {displayProfile?.display_name ||
               user?.email?.split('@')[0] ||
               'Student'}
            </h2>
            <p className="text-gray-500 text-sm truncate">
              {user?.email || displayProfile?.email || '...'}
            </p>
            {!displayProfile && user && (
              <p className="text-xs text-orange-400 mt-0.5">
                Syncing profile...
              </p>
            )}
          </div>
          {isAdmin && (
            <span className="flex-shrink-0 bg-amber-100 
                             text-amber-800 px-3 py-1 
                             rounded-full text-xs font-bold 
                             flex items-center gap-1 
                             uppercase tracking-wider">
              <Shield className="w-3 h-3" />
              Admin
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              icon: Award,
              value: streakData?.total_videos_watched || stats.completedCount,
              label: 'Completed',
              color: 'text-blue-500',
              bg: 'bg-blue-50',
            },
            {
              icon: Clock,
              value: streakData?.total_minutes_watched ? Math.round(streakData.total_minutes_watched / 60) : stats.hoursWatched,
              label: 'Hours',
              color: 'text-purple-500',
              bg: 'bg-purple-50',
            },
            {
              icon: Flame,
              value: streakData?.streak_count || stats.streak,
              label: 'Streak',
              color: 'text-orange-500',
              bg: 'bg-orange-50',
            },
          ].map(({ icon: Icon, value, label, color, bg }) => (
            <div key={label}
              className="bg-white rounded-xl shadow-sm border 
                         border-gray-100 p-4 flex flex-col 
                         items-center justify-center text-center">
              <div className={`w-10 h-10 ${bg} rounded-full 
                              flex items-center justify-center 
                              mb-2`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {value}
              </span>
              <span className="text-xs text-gray-500 font-medium 
                               uppercase tracking-wider mt-1">
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Achievements & Streaks */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Achievements & Streaks
          </h3>
          
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="bg-orange-50 rounded-xl p-4 flex-1 border border-orange-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-2xl animate-bounce">
                🔥
              </div>
              <div>
                <p className="bangla font-bold text-lg text-orange-800">
                  {streakData?.streak_count || 0} দিনের ধারাবাহিকতা
                </p>
                <p className="text-sm text-orange-600">
                  সর্বোচ্চ: {streakData?.longest_streak || 0} দিন
                </p>
              </div>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 flex-1 border border-blue-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                ⏱️
              </div>
              <div>
                <p className="bangla font-bold text-lg text-blue-800">
                  মোট: {streakData?.total_minutes_watched || 0} মিনিট
                </p>
                <p className="text-sm text-blue-600">
                  {streakData?.total_videos_watched || 0} ভিডিও দেখা হয়েছে
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Earned Badges</h4>
            {achievements.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {achievements.map(badge => (
                  <div key={badge.id} className="bg-gray-50 border border-gray-200 rounded-full px-4 py-2 flex items-center gap-2">
                    <span className="text-xl">{badge.badge_emoji}</span>
                    <span className="bangla font-medium text-gray-700">{badge.badge_name_bn}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No badges earned yet. Keep studying!</p>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <button 
            onClick={generateProgressReport}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
              <Award className="w-6 h-6" />
            </div>
            <span className="font-semibold text-gray-900" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>প্রগ্রেস রিপোর্ট</span>
          </button>
          
          <button 
            onClick={() => navigate('/notes')}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
              <FileText className="w-6 h-6" />
            </div>
            <span className="font-semibold text-gray-900" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>আমার নোটস</span>
          </button>

          <button 
            onClick={() => navigate('/planner')}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 hover:shadow-md transition-shadow col-span-2 md:col-span-1"
          >
            <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-600">
              <Calendar className="w-6 h-6" />
            </div>
            <span className="font-semibold text-gray-900" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>পড়ার পরিকল্পনা</span>
          </button>
        </div>

        {/* Menu */}
        <div className="bg-white rounded-xl shadow-sm border 
                        border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 
                           uppercase tracking-wider">
              Account
            </h3>
          </div>

          {/* Admin Dashboard — only when role === 'admin' */}
          {isAdmin && (
            <button
              onClick={() => navigate('/admin')}
              className="w-full flex items-center justify-between 
                         p-4 hover:bg-amber-50 transition-colors 
                         border-b border-gray-100 group"
            >
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-amber-500" />
                <span className="font-medium text-amber-700">
                  Admin Dashboard
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 
                                       group-hover:text-amber-500 
                                       transition-colors" />
            </button>
          )}

          {/* App Settings */}
          <button
            onClick={() => showToast('App settings coming soon!')}
            className="w-full flex items-center justify-between 
                       p-4 hover:bg-gray-50 transition-colors 
                       border-b border-gray-100 group"
          >
            <div className="flex items-center space-x-3 
                            text-gray-700">
              <Settings className="w-5 h-5" />
              <span className="font-medium">App Settings</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          {/* Sign Out */}
          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="w-full flex items-center p-4 
                       hover:bg-red-50 transition-colors 
                       disabled:opacity-60 disabled:cursor-wait"
          >
            <LogOut className="w-5 h-5 text-red-500 mr-3 
                               flex-shrink-0" />
            <span className="font-medium text-red-600">
              {isSigningOut ? 'Signing out...' : 'Sign Out'}
            </span>
          </button>
        </div>

        {/* Debug panel — only visible in dev mode */}
        {import.meta.env.DEV && (
          <details className="bg-gray-100 rounded-xl p-4">
            <summary className="text-xs text-gray-500 
                                cursor-pointer font-mono">
              Debug info
            </summary>
            <pre className="text-xs text-gray-600 mt-2 
                            overflow-auto">
              {JSON.stringify({
                userId: user?.id,
                email: user?.email,
                role: displayProfile?.role,
                isBlocked: displayProfile?.is_blocked,
                source: profile ? 'live' : 
                  (cachedProfile ? 'cache' : 'none'),
              }, null, 2)}
            </pre>
          </details>
        )}
      </main>

      {/* Hidden Progress Report for Printing */}
      <div id="progress-report-print" className="hidden">
        <div className="header">
          <div className="logo">NexusEdu</div>
          <h1 className="title">Student Progress Report</h1>
        </div>
        
        <div className="info">
          <p><strong>Student Name:</strong> {displayProfile?.display_name || 'Student'}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Report Date:</strong> {new Date().toLocaleDateString()}</p>
        </div>

        <div className="stats-grid">
          <div className="stat-box">
            <div className="stat-value">{streakData?.total_videos_watched || stats.completedCount}</div>
            <div className="stat-label">Videos Completed</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{streakData?.total_minutes_watched ? Math.round(streakData.total_minutes_watched / 60) : stats.hoursWatched}</div>
            <div className="stat-label">Hours Watched</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{streakData?.streak_count || stats.streak}</div>
            <div className="stat-label">Current Streak (Days)</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{streakData?.longest_streak || 0}</div>
            <div className="stat-label">Longest Streak (Days)</div>
          </div>
        </div>

        <div className="badges">
          <h3>Earned Achievements</h3>
          {achievements.length > 0 ? (
            <div className="badge-list">
              {achievements.map(badge => (
                <div key={badge.id} className="badge">
                  {badge.badge_emoji} {badge.badge_name}
                </div>
              ))}
            </div>
          ) : (
            <p>No achievements earned yet.</p>
          )}
        </div>

        <div className="footer">
          Generated by NexusEdu on {new Date().toLocaleString()}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
