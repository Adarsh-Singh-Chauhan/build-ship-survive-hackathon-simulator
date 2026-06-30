'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Terminal, Trophy, Lock, ArrowLeft, Star } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { ACHIEVEMENTS, RARITY_COLORS, RARITY_BORDER_COLORS } from '@/data/achievements';
import { playMutedClick, playSubtleHover } from '@/lib/sound';

export default function AchievementsPage() {
  const unlockedAchievements = useGameStore((s) => s.unlockedAchievements);
  const stats = useGameStore((s) => s.stats);
  const theme = useGameStore((s) => s.theme);

  const unlockedCount = unlockedAchievements.length;
  const totalCount = ACHIEVEMENTS.length;
  const completionPct = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-[#fafaf8] dark:bg-[#0a0a0b] text-neutral-900 dark:text-neutral-100 font-mono text-xs transition-colors duration-300">
      <div className="absolute inset-0 grid-pattern pointer-events-none z-0 opacity-[0.4] dark:opacity-[0.15]" />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-[#fafaf8]/50 dark:bg-[#0a0a0b]/50 backdrop-blur-sm select-none">
        <Link
          href="/"
          onClick={() => playMutedClick()}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer group"
        >
          <div className="p-2 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 group-hover:border-neutral-300 dark:group-hover:border-neutral-600 transition-colors">
            <Terminal className="w-4 h-4" />
          </div>
          <span className="font-sans font-bold text-sm tracking-tight">
            THE HACKATHON <span className="text-neutral-500 dark:text-neutral-400 font-normal">SIMULATOR</span>
          </span>
        </Link>
        <Link
          href="/"
          onClick={() => playMutedClick()}
          onMouseEnter={() => playSubtleHover()}
          className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
        >
          <ArrowLeft className="w-3 h-3" />
          BACK TO LOBBY
        </Link>
      </nav>

      <main className="relative z-10 flex-1 px-6 md:px-12 py-8 max-w-5xl mx-auto w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800"
          >
            <Trophy className="w-5 h-5 text-amber-500" />
            <span className="font-bold text-amber-700 dark:text-amber-400 text-sm">TROPHY ROOM</span>
          </motion.div>

          <h1 className="text-3xl sm:text-4xl font-black font-sans uppercase tracking-tight">
            Your Achievements
          </h1>

          {/* Progress Bar */}
          <div className="max-w-xs mx-auto space-y-1.5">
            <div className="flex justify-between text-[9px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              <span>{unlockedCount} / {totalCount} UNLOCKED</span>
              <span>{completionPct}%</span>
            </div>
            <div className="h-2 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completionPct}%` }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500"
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex justify-center gap-6 text-[10px] font-mono text-neutral-500 dark:text-neutral-400">
            <span>🎮 {stats.totalRuns} RUNS</span>
            <span>🏆 BEST: {stats.bestScore}</span>
            <span>📊 AVG: {stats.averageScore}</span>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ACHIEVEMENTS.map((achievement, index) => {
            const isUnlocked = unlockedAchievements.includes(achievement.id);
            const borderColor = RARITY_BORDER_COLORS[achievement.rarity];
            const gradientClass = RARITY_COLORS[achievement.rarity];

            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                whileHover={isUnlocked ? { y: -3, scale: 1.02 } : {}}
                className={`relative p-4 rounded-xl border-2 transition-all ${
                  isUnlocked
                    ? `${borderColor} bg-white dark:bg-neutral-900 shadow-md`
                    : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 opacity-60'
                }`}
              >
                {/* Rarity tag */}
                <span className={`absolute top-2 right-2 text-[7px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                  isUnlocked
                    ? `bg-gradient-to-r ${gradientClass} text-white`
                    : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400'
                }`}>
                  {achievement.rarity}
                </span>

                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className={`flex items-center justify-center w-12 h-12 rounded-lg text-2xl ${
                    isUnlocked
                      ? 'bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20'
                      : 'bg-neutral-100 dark:bg-neutral-800 grayscale'
                  }`}>
                    {isUnlocked ? achievement.icon : <Lock className="w-5 h-5 text-neutral-400" />}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-sans font-bold text-sm ${
                      isUnlocked ? 'text-neutral-900 dark:text-neutral-100' : 'text-neutral-400 dark:text-neutral-500'
                    }`}>
                      {achievement.title}
                    </h3>
                    <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-sans mt-0.5 leading-snug">
                      {achievement.description}
                    </p>
                    <p className="text-[9px] text-neutral-400 dark:text-neutral-500 font-mono mt-1 uppercase tracking-wider">
                      {achievement.condition}
                    </p>
                  </div>
                </div>

                {/* Unlocked checkmark */}
                {isUnlocked && (
                  <div className="absolute bottom-2 right-2">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-5 text-[9px] text-neutral-400 dark:text-neutral-500 border-t border-neutral-200 dark:border-neutral-800 select-none">
        <div className="flex items-center justify-center gap-2">
          <Terminal className="w-3 h-3" />
          <span>THE HACKATHON SIMULATOR v2.5 — TROPHY ROOM</span>
        </div>
      </footer>
    </div>
  );
}
