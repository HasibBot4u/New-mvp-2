import { useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ui/Toast';

export const useStreak = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const updateStreakAndCheckBadges = useCallback(async (videoDurationMinutes: number = 0) => {
    if (!user) return;

    try {
      // 1. Update Streak
      const { data: streakData } = await supabase
        .from('study_streaks')
        .select('*')
        .eq('user_id', user.id)
        .single();

      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];

      let newStreakCount = 1;
      let newLongestStreak = 1;
      let newTotalVideos = 1;
      let newTotalMinutes = videoDurationMinutes;

      if (streakData) {
        newTotalVideos = (streakData.total_videos_watched || 0) + 1;
        newTotalMinutes = (streakData.total_minutes_watched || 0) + videoDurationMinutes;

        if (streakData.last_study_date) {
          const lastDate = new Date(streakData.last_study_date);
          const diffTime = Math.abs(today.getTime() - lastDate.getTime());
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays === 0) {
            // Already studied today, just update totals
            newStreakCount = streakData.streak_count;
            newLongestStreak = streakData.longest_streak;
          } else if (diffDays === 1) {
            // Studied yesterday, increment streak
            newStreakCount = (streakData.streak_count || 0) + 1;
            newLongestStreak = Math.max(newStreakCount, streakData.longest_streak || 0);
          } else {
            // Missed a day, reset streak
            newStreakCount = 1;
            newLongestStreak = streakData.longest_streak || 1;
          }
        }
      }

      await supabase
        .from('study_streaks')
        .upsert({
          user_id: user.id,
          streak_count: newStreakCount,
          longest_streak: newLongestStreak,
          last_study_date: todayStr,
          total_videos_watched: newTotalVideos,
          total_minutes_watched: newTotalMinutes,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

      // 2. Check and Award Badges
      const checkAndAwardBadge = async (key: string, name: string, nameBn: string, emoji: string) => {
        const { data: existingBadge } = await supabase
          .from('achievements')
          .select('id')
          .eq('user_id', user.id)
          .eq('badge_key', key)
          .single();

        if (!existingBadge) {
          const { error } = await supabase
            .from('achievements')
            .insert({
              user_id: user.id,
              badge_key: key,
              badge_name: name,
              badge_name_bn: nameBn,
              badge_emoji: emoji
            });

          if (!error) {
            showToast(`🏆 নতুন ব্যাজ অর্জন! ${nameBn}`);
          }
        }
      };

      // Badge Logic
      if (newTotalVideos >= 1) await checkAndAwardBadge('first_video', 'First Class', 'প্রথম ক্লাস', '🎬');
      if (newTotalVideos >= 10) await checkAndAwardBadge('videos_10', 'Regular Student', 'নিয়মিত শিক্ষার্থী', '📚');
      if (newTotalVideos >= 50) await checkAndAwardBadge('videos_50', 'Avid Reader', 'অদম্য পাঠক', '🏅');
      if (newTotalVideos >= 100) await checkAndAwardBadge('videos_100', 'Centurion', 'শতাধিক ক্লাস', '🏆');

      if (newStreakCount >= 3) await checkAndAwardBadge('streak_3', '3-Day Streak', '৩ দিনের ধারা', '🔥');
      if (newStreakCount >= 7) await checkAndAwardBadge('streak_7', '7-Day Streak', 'সপ্তাহ ধারা', '🌟');
      if (newStreakCount >= 30) await checkAndAwardBadge('streak_30', '30-Day Streak', 'মাসিক ধারা', '💎');

    } catch (error) {
      console.error('Error updating streak:', error);
    }
  }, [user, showToast]);

  const checkQuizBadges = useCallback(async (scorePercentage: number) => {
    if (!user) return;
    
    try {
      const checkAndAwardBadge = async (key: string, name: string, nameBn: string, emoji: string) => {
        const { data: existingBadge } = await supabase
          .from('achievements')
          .select('id')
          .eq('user_id', user.id)
          .eq('badge_key', key)
          .single();

        if (!existingBadge) {
          const { error } = await supabase
            .from('achievements')
            .insert({
              user_id: user.id,
              badge_key: key,
              badge_name: name,
              badge_name_bn: nameBn,
              badge_emoji: emoji
            });

          if (!error) {
            showToast(`🏆 নতুন ব্যাজ অর্জন! ${nameBn}`);
          }
        }
      };

      await checkAndAwardBadge('quiz_first', 'First Quiz', 'প্রথম পরীক্ষা', '📝');
      
      if (scorePercentage === 100) {
        await checkAndAwardBadge('quiz_perfect', 'Perfect Score', 'নিখুঁত স্কোর', '⭐');
      }
    } catch (error) {
      console.error('Error checking quiz badges:', error);
    }
  }, [user, showToast]);

  return { updateStreakAndCheckBadges, checkQuizBadges };
};
