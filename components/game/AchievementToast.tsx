'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { ACHIEVEMENTS, RARITY_COLORS } from '@/data/achievements';
import { playUnlockArpeggio } from '@/lib/sound';

interface AchievementToastProps {
  achievementId: string | null;
  onDismiss: () => void;
}

export default function AchievementToast({ achievementId, onDismiss }: AchievementToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (achievementId) {
      setIsVisible(true);
      playUnlockArpeggio();
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onDismiss, 400); // Wait for exit animation
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [achievementId, onDismiss]);

  const achievement = achievementId
    ? ACHIEVEMENTS.find((a) => a.id === achievementId)
    : null;

  if (!achievement) return null;

  const gradientClass = RARITY_COLORS[achievement.rarity];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -60, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0.95 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] pointer-events-auto"
        >
          <div className="relative flex items-center gap-3 px-5 py-3 rounded-xl bg-white dark:bg-neutral-900 border-2 border-amber-400 dark:border-amber-500 shadow-[0_8px_32px_rgba(251,191,36,0.25)] dark:shadow-[0_8px_32px_rgba(251,191,36,0.15)]">
            {/* Shimmer overlay */}
            <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-100/30 dark:via-amber-400/10 to-transparent animate-shimmer-fast" />
            </div>

            {/* Icon */}
            <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-800/30 dark:to-amber-700/30">
              <span className="text-2xl">{achievement.icon}</span>
            </div>

            {/* Content */}
            <div className="relative">
              <div className="flex items-center gap-1.5">
                <Trophy className="w-3 h-3 text-amber-500" />
                <span className="text-[9px] font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
                  ACHIEVEMENT UNLOCKED
                </span>
              </div>
              <p className="font-sans font-bold text-sm text-neutral-900 dark:text-neutral-100">
                {achievement.title}
              </p>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-sans">
                {achievement.description}
              </p>
            </div>

            {/* Rarity badge */}
            <span className={`ml-2 text-[8px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r ${gradientClass} text-white`}>
              {achievement.rarity}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
