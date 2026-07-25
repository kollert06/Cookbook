import { User, Recipe, CookLog, SharedCookbook, XPTransaction, MilestoneBadge } from '../types';
import { INITIAL_USERS, INITIAL_RECIPES, INITIAL_COOK_LOGS, INITIAL_SHARED_COOKBOOKS } from '../data/initialData';
import { calculateLevel } from '../data/constants';

const STORAGE_KEYS = {
  USERS: 'kochbuch_users_v1',
  CURRENT_USER_ID: 'kochbuch_current_user_id_v1',
  RECIPES: 'kochbuch_recipes_v1',
  COOK_LOGS: 'kochbuch_cook_logs_v1',
  SHARED_COOKBOOKS: 'kochbuch_shared_cookbooks_v1',
  XP_TRANSACTIONS: 'kochbuch_xp_transactions_v1'
};

// Helper for local storage
function getItem<T>(key: string, defaultValue: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (e) {
    console.error('Error reading localStorage', e);
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Error writing localStorage', e);
  }
}

export class StorageService {
  // Initialization
  static init() {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      setItem(STORAGE_KEYS.USERS, INITIAL_USERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID)) {
      setItem(STORAGE_KEYS.CURRENT_USER_ID, 'usr_timo');
    }
    if (!localStorage.getItem(STORAGE_KEYS.RECIPES)) {
      setItem(STORAGE_KEYS.RECIPES, INITIAL_RECIPES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.COOK_LOGS)) {
      setItem(STORAGE_KEYS.COOK_LOGS, INITIAL_COOK_LOGS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SHARED_COOKBOOKS)) {
      setItem(STORAGE_KEYS.SHARED_COOKBOOKS, INITIAL_SHARED_COOKBOOKS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.XP_TRANSACTIONS)) {
      setItem(STORAGE_KEYS.XP_TRANSACTIONS, []);
    }
  }

  // Current active user
  static getCurrentUser(): User {
    this.init();
    const users = this.getUsers();
    const currentId = getItem<string>(STORAGE_KEYS.CURRENT_USER_ID, 'usr_timo');
    const user = users.find(u => u.id === currentId);
    return user || users[0] || INITIAL_USERS[0];
  }

  static setCurrentUser(userId: string): User {
    this.init();
    setItem(STORAGE_KEYS.CURRENT_USER_ID, userId);
    return this.getCurrentUser();
  }

  // Users
  static getUsers(): User[] {
    this.init();
    return getItem<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  }

  static registerUser(username: string, email?: string): User {
    const users = this.getUsers();
    const existing = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (existing) {
      return existing;
    }
    const newUser: User = {
      id: `usr_${Date.now()}`,
      username,
      email: email || undefined,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(username)}`,
      frameId: 'none',
      xp: 0,
      level: 1,
      createdAt: new Date().toISOString().split('T')[0]
    };
    users.push(newUser);
    setItem(STORAGE_KEYS.USERS, users);
    setItem(STORAGE_KEYS.CURRENT_USER_ID, newUser.id);
    return newUser;
  }

  static updateUser(updatedUser: User): void {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      setItem(STORAGE_KEYS.USERS, users);
    }
  }

  // Recipes
  static getRecipes(): Recipe[] {
    this.init();
    return getItem<Recipe[]>(STORAGE_KEYS.RECIPES, INITIAL_RECIPES);
  }

  static saveRecipe(recipeData: Omit<Recipe, 'id' | 'createdAt' | 'timesCooked'> & { id?: string }): Recipe {
    const recipes = this.getRecipes();
    const currentUser = this.getCurrentUser();

    if (recipeData.id) {
      const idx = recipes.findIndex(r => r.id === recipeData.id);
      if (idx !== -1) {
        recipes[idx] = {
          ...recipes[idx],
          ...recipeData,
          authorName: recipeData.authorName || currentUser.username
        };
        setItem(STORAGE_KEYS.RECIPES, recipes);
        return recipes[idx];
      }
    }

    const newRecipe: Recipe = {
      ...recipeData,
      id: `rec_${Date.now()}`,
      userId: currentUser.id,
      authorName: currentUser.username,
      createdAt: new Date().toISOString().split('T')[0],
      timesCooked: 0
    };
    recipes.unshift(newRecipe);
    setItem(STORAGE_KEYS.RECIPES, recipes);
    return newRecipe;
  }

  static deleteRecipe(recipeId: string): void {
    const recipes = this.getRecipes().filter(r => r.id !== recipeId);
    setItem(STORAGE_KEYS.RECIPES, recipes);
  }

  // Cook Logs
  static getCookLogs(): CookLog[] {
    this.init();
    return getItem<CookLog[]>(STORAGE_KEYS.COOK_LOGS, INITIAL_COOK_LOGS);
  }

  static createCookLog(data: {
    recipeId: string;
    recipeTitle: string;
    date: string;
    photos: string[];
    rating: number;
    comment: string;
    portions?: number;
    recipeText?: string;
    sharedCookbookId?: string | null;
  }): { log: CookLog; xpBreakdown: { base: number; completeBonus: number; firstTimeBonus: number; total: number } } {
    const logs = this.getCookLogs();
    const currentUser = this.getCurrentUser();
    const recipes = this.getRecipes();

    // Check if first time recipe cooked by this user
    const hasCookedBefore = logs.some(l => l.userId === currentUser.id && l.recipeId === data.recipeId);

    // Calculate XP as per PDF Section 8
    const base = 10;
    const isComplete = data.photos.length > 0 && data.rating > 0 && data.comment.trim().length > 0;
    const completeBonus = isComplete ? 5 : 0;
    const firstTimeBonus = !hasCookedBefore ? 15 : 0;
    const totalXP = base + completeBonus + firstTimeBonus;

    const xpEarned = { base, completeBonus, firstTimeBonus, total: totalXP };

    const newLog: CookLog = {
      id: `log_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.username,
      userAvatar: currentUser.avatarUrl,
      recipeId: data.recipeId,
      recipeTitle: data.recipeTitle,
      date: data.date,
      photos: data.photos,
      rating: data.rating,
      comment: data.comment,
      portions: data.portions,
      recipeText: data.recipeText,
      sharedCookbookId: data.sharedCookbookId || null,
      xpEarned,
      createdAt: new Date().toISOString()
    };

    logs.unshift(newLog);
    setItem(STORAGE_KEYS.COOK_LOGS, logs);

    // Update timesCooked on Recipe
    const recipeIndex = recipes.findIndex(r => r.id === data.recipeId);
    if (recipeIndex !== -1) {
      recipes[recipeIndex].timesCooked = (recipes[recipeIndex].timesCooked || 0) + 1;
      setItem(STORAGE_KEYS.RECIPES, recipes);
    }

    // Award XP to User
    currentUser.xp += totalXP;
    currentUser.level = calculateLevel(currentUser.xp);
    this.updateUser(currentUser);

    // If shared cookbook assigned, award XP to Shared Cookbook as well
    if (data.sharedCookbookId) {
      const cookbooks = this.getSharedCookbooks();
      const cbIdx = cookbooks.findIndex(c => c.id === data.sharedCookbookId);
      if (cbIdx !== -1) {
        cookbooks[cbIdx].xp += totalXP;
        cookbooks[cbIdx].level = calculateLevel(cookbooks[cbIdx].xp);
        setItem(STORAGE_KEYS.SHARED_COOKBOOKS, cookbooks);
      }
    }

    return { log: newLog, xpBreakdown: xpEarned };
  }

  static updateCookLog(logId: string, updates: Partial<CookLog>): CookLog | null {
    const logs = this.getCookLogs();
    const idx = logs.findIndex(l => l.id === logId);
    if (idx === -1) return null;
    
    logs[idx] = { ...logs[idx], ...updates };
    setItem(STORAGE_KEYS.COOK_LOGS, logs);
    return logs[idx];
  }

  static deleteCookLog(logId: string): void {
    const logs = this.getCookLogs().filter(l => l.id !== logId);
    setItem(STORAGE_KEYS.COOK_LOGS, logs);
  }

  // Shared Cookbooks
  static getSharedCookbooks(): SharedCookbook[] {
    this.init();
    return getItem<SharedCookbook[]>(STORAGE_KEYS.SHARED_COOKBOOKS, INITIAL_SHARED_COOKBOOKS);
  }

  static createSharedCookbook(name: string, description: string): SharedCookbook {
    const cookbooks = this.getSharedCookbooks();
    const currentUser = this.getCurrentUser();
    const newCookbook: SharedCookbook = {
      id: `cb_${Date.now()}`,
      name,
      description,
      ownerId: currentUser.id,
      memberIds: [currentUser.id],
      inviteCode: `KOCH-${Math.floor(1000 + Math.random() * 9000)}`,
      xp: 0,
      level: 1,
      createdAt: new Date().toISOString().split('T')[0]
    };
    cookbooks.unshift(newCookbook);
    setItem(STORAGE_KEYS.SHARED_COOKBOOKS, cookbooks);
    return newCookbook;
  }

  static joinSharedCookbookByCode(code: string): SharedCookbook | null {
    const cookbooks = this.getSharedCookbooks();
    const currentUser = this.getCurrentUser();
    const cookbook = cookbooks.find(c => c.inviteCode.toUpperCase() === code.trim().toUpperCase());
    if (!cookbook) return null;

    if (!cookbook.memberIds.includes(currentUser.id)) {
      cookbook.memberIds.push(currentUser.id);
      setItem(STORAGE_KEYS.SHARED_COOKBOOKS, cookbooks);
    }
    return cookbook;
  }

  // Milestones / Badges calculation
  static getMilestoneBadges(userId: string): MilestoneBadge[] {
    const logs = this.getCookLogs().filter(l => l.userId === userId);
    const recipes = this.getRecipes().filter(r => r.userId === userId);
    const fiveStarLogs = logs.filter(l => l.rating === 5.0);

    const logCount = logs.length;
    const recipeCount = recipes.length;
    const fiveStarCount = fiveStarLogs.length;

    return [
      {
        id: 'badge_10_cooks',
        title: 'Erste 10 Gerichte',
        description: 'Logge insgesamt 10 Kocheinträge',
        icon: '🍳',
        unlocked: logCount >= 10,
        progress: Math.min(100, Math.round((logCount / 10) * 100)),
        target: 10,
        current: logCount
      },
      {
        id: 'badge_5_recipes',
        title: 'Rezept-Sammler',
        description: 'Erstelle 5 eigene Rezepte',
        icon: '📖',
        unlocked: recipeCount >= 5,
        progress: Math.min(100, Math.round((recipeCount / 5) * 100)),
        target: 5,
        current: recipeCount
      },
      {
        id: 'badge_5_stars',
        title: 'Sternekoch',
        description: 'Koche 3 Gerichte mit voller 5-Sterne Bewertung',
        icon: '⭐',
        unlocked: fiveStarCount >= 3,
        progress: Math.min(100, Math.round((fiveStarCount / 3) * 100)),
        target: 3,
        current: fiveStarCount
      },
      {
        id: 'badge_photo_master',
        title: 'Foodie Fotograf',
        description: 'Erfasse 5 Kocheinträge inklusive Foto',
        icon: '📸',
        unlocked: logs.filter(l => l.photos.length > 0).length >= 5,
        progress: Math.min(100, Math.round((logs.filter(l => l.photos.length > 0).length / 5) * 100)),
        target: 5,
        current: logs.filter(l => l.photos.length > 0).length
      }
    ];
  }
}
