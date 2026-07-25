import { AvatarFrame } from '../types';

export const AVATAR_FRAMES: AvatarFrame[] = [
  {
    id: 'none',
    name: 'Standard',
    minLevel: 1,
    description: 'Klassischer Holzrahmen für Einsteiger',
    borderClass: 'border-2 border-[#E0D8CC]',
    badgeSymbol: '🌱'
  },
  {
    id: 'bronze',
    name: 'Kupfer & Bronze',
    minLevel: 2,
    description: 'Für fleißige Nachwuchsköche (Level 2)',
    borderClass: 'border-3 border-[#D46A43] ring-2 ring-[#F2EDE4]/50',
    glowClass: 'shadow-[0_0_10px_rgba(200,125,83,0.3)]',
    badgeSymbol: '🍳'
  },
  {
    id: 'silver',
    name: 'Edelstahl Silber',
    minLevel: 3,
    description: 'Glänzender Chefkoch-Rahmen (Level 3)',
    borderClass: 'border-3 border-[#94a3b8] ring-2 ring-slate-200',
    glowClass: 'shadow-[0_0_12px_rgba(148,163,184,0.4)]',
    badgeSymbol: '🔪'
  },
  {
    id: 'gold',
    name: 'Messing & Gold',
    minLevel: 5,
    description: 'Goldener Meisterrahmen für erfahrene Köche (Level 5)',
    borderClass: 'border-3 border-[#F2C94C] ring-2 ring-[#F2C94C]',
    glowClass: 'shadow-[0_0_15px_rgba(217,119,6,0.4)]',
    badgeSymbol: '⭐'
  },
  {
    id: 'chef_hat',
    name: 'Toque Blanche (Haube)',
    minLevel: 7,
    description: 'Für wahre Sterne-Kulinariker (Level 7)',
    borderClass: 'border-4 border-[#D46A43] ring-3 ring-[#E0D8CC]',
    glowClass: 'shadow-[0_0_20px_rgba(140,74,50,0.5)]',
    badgeSymbol: '👨‍🍳'
  },
  {
    id: 'master_flame',
    name: 'Feuer & Flamme',
    minLevel: 10,
    description: 'Die höchste Auszeichnung der Versuchsküche (Level 10)',
    borderClass: 'border-4 border-[#D46A43] ring-3 ring-[#F2C94C]',
    glowClass: 'shadow-[0_0_22px_rgba(220,38,38,0.6)] animate-pulse',
    badgeSymbol: '🔥'
  }
];

export function calculateLevel(xp: number): number {
  return Math.floor(xp / 100) + 1;
}

export function xpForNextLevel(xp: number): { currentXPInLevel: number; neededXP: number; percent: number } {
  const currentLevel = calculateLevel(xp);
  const minXPForLevel = (currentLevel - 1) * 100;
  const currentXPInLevel = xp - minXPForLevel;
  const neededXP = 100;
  const percent = Math.min(100, Math.max(0, Math.round((currentXPInLevel / neededXP) * 100)));
  return { currentXPInLevel, neededXP, percent };
}
