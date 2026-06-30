/**
 * @file Achievement definitions for The Hackathon Simulator
 * @description Defines all unlockable achievements with conditions, icons, and rarity tiers.
 */

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  condition: string; // Human-readable condition description
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-hackathon',
    title: 'Beginner',
    description: 'Complete your first hackathon simulation.',
    icon: '🏅',
    rarity: 'common',
    condition: 'Finish any hackathon run',
  },
  {
    id: 'builder',
    title: 'Builder',
    description: 'Complete an MVP with time remaining on the clock.',
    icon: '🔨',
    rarity: 'common',
    condition: 'Finish with time > 0',
  },
  {
    id: 'survivor',
    title: 'Survivor',
    description: 'Survive a harsh mentor review without losing points.',
    icon: '💪',
    rarity: 'rare',
    condition: 'Complete mentor stage with score >= 60',
  },
  {
    id: 'innovator',
    title: 'Innovator',
    description: 'Use a unique or rare tech stack combination.',
    icon: '💡',
    rarity: 'rare',
    condition: 'Use 4+ unique tech items',
  },
  {
    id: 'legend',
    title: 'Legend',
    description: 'Achieve the legendary S-Tier rank.',
    icon: '👑',
    rarity: 'legendary',
    condition: 'Score 94 or higher',
  },
  {
    id: 'speed-demon',
    title: 'Speed Demon',
    description: 'Finish a run with more than 50% time remaining.',
    icon: '⚡',
    rarity: 'epic',
    condition: 'Finish with > 50% time left',
  },
  {
    id: 'chaos-magnet',
    title: 'Chaos Magnet',
    description: 'Survive 3 or more chaos events in a single run.',
    icon: '🔥',
    rarity: 'epic',
    condition: 'Face 3+ chaos events and still finish',
  },
  {
    id: 'perfect-pitch',
    title: 'Perfect Pitch',
    description: 'Score 90+ on your pitch deck evaluation.',
    icon: '🎯',
    rarity: 'rare',
    condition: 'Pitch deck score >= 90',
  },
  {
    id: 'team-player',
    title: 'Team Player',
    description: 'Accept 3 or more teammate suggestions in one run.',
    icon: '🤝',
    rarity: 'common',
    condition: 'Apply 3+ teammate advice',
  },
  {
    id: 'hard-mode',
    title: 'Hard Mode Hero',
    description: 'Complete a hackathon on hard difficulty.',
    icon: '🏋️',
    rarity: 'epic',
    condition: 'Finish on hard difficulty',
  },
  {
    id: 'full-stack',
    title: 'Full Stack',
    description: 'Use technologies from all 4 categories (Frontend, Backend, Database, DevOps).',
    icon: '🗼',
    rarity: 'rare',
    condition: 'Cover all 4 tech categories',
  },
  {
    id: 'comeback-king',
    title: 'Comeback King',
    description: 'Win with an A or S rank after surviving a negative chaos event.',
    icon: '🔄',
    rarity: 'legendary',
    condition: 'Score 84+ after facing chaos',
  },
  {
    id: 'night-owl',
    title: 'Night Owl',
    description: 'Play a hackathon session after midnight.',
    icon: '🦉',
    rarity: 'common',
    condition: 'Play between 12 AM and 5 AM',
  },
];

export const RARITY_COLORS: Record<Achievement['rarity'], string> = {
  common: 'from-neutral-400 to-neutral-500',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-amber-400 to-amber-600',
};

export const RARITY_BORDER_COLORS: Record<Achievement['rarity'], string> = {
  common: 'border-neutral-300 dark:border-neutral-600',
  rare: 'border-blue-300 dark:border-blue-700',
  epic: 'border-purple-300 dark:border-purple-700',
  legendary: 'border-amber-300 dark:border-amber-600',
};
