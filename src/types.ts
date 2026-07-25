export interface User {
  id: string;
  username: string;
  email?: string;
  avatarUrl: string;
  frameId: string; // e.g. 'none', 'bronze', 'silver', 'gold', 'chef_hat', 'gourmet_master'
  xp: number;
  level: number;
  createdAt: string;
}

export interface Recipe {
  id: string;
  userId: string;
  authorName?: string;
  title: string;
  ingredients: string; // Free text, line per ingredient as required by section 4
  preparation: string; // Free text preparation steps
  photos: string[]; // up to 5 photos
  sharedCookbookId?: string | null; // optional assignment to shared cookbook
  isPrivate: boolean; // default true
  createdAt: string;
  timesCooked?: number;
}

export interface CookLog {
  id: string;
  userId: string;
  userName?: string;
  userAvatar?: string;
  recipeId: string;
  recipeTitle: string;
  date: string; // YYYY-MM-DD
  photos: string[]; // up to 3 photos
  rating: number; // 0.5 to 5.0 with half stars
  comment: string; // free comment text
  portions?: number;
  recipeText?: string;
  sharedCookbookId?: string | null;
  xpEarned: {
    base: number; // +10 XP
    completeBonus: number; // +5 XP if photo + rating + comment filled
    firstTimeBonus: number; // +15 XP if first time recipe cooked
    total: number;
  };
  createdAt: string;
}

export interface SharedCookbook {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  memberIds: string[];
  inviteCode: string;
  xp: number;
  level: number;
  createdAt: string;
}

export interface XPTransaction {
  id: string;
  targetType: 'user' | 'cookbook';
  targetId: string;
  amount: number;
  reason: string;
  timestamp: string;
}

export interface AvatarFrame {
  id: string;
  name: string;
  minLevel: number;
  description: string;
  borderClass: string;
  bgGradient?: string;
  glowClass?: string;
  badgeSymbol?: string;
}

export interface MilestoneBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number; // 0 to 100
  target: number;
  current: number;
}
