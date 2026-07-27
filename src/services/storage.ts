import { User, Recipe, CookLog, SharedCookbook, XPTransaction, MilestoneBadge } from '../types';
import { calculateLevel } from '../data/constants';
import { supabase } from '../lib/supabase';

const STORAGE_KEYS = {
  CURRENT_USER_ID: 'kochbuch_current_user_id_v1',
};

// Map database cases
function mapUser(dbUser: any): User {
  return {
    id: dbUser.id,
    username: dbUser.username,
    displayName: dbUser.display_name || dbUser.username,
    email: dbUser.email,
    avatarUrl: dbUser.avatar_url,
    frameId: dbUser.frame_id,
    xp: dbUser.xp,
    level: dbUser.level,
    createdAt: dbUser.created_at
  };
}

function mapRecipe(dbRecipe: any): Recipe {
  return {
    id: dbRecipe.id,
    userId: dbRecipe.user_id,
    authorName: dbRecipe.author_name,
    title: dbRecipe.title,
    ingredients: dbRecipe.ingredients,
    preparation: dbRecipe.preparation,
    photos: dbRecipe.photos,
    sharedCookbookId: dbRecipe.shared_cookbook_id,
    isPrivate: dbRecipe.is_private,
    timesCooked: dbRecipe.times_cooked,
    createdAt: dbRecipe.created_at
  };
}

function mapCookLog(dbLog: any): CookLog {
  return {
    id: dbLog.id,
    userId: dbLog.user_id,
    userName: dbLog.user_name,
    userAvatar: dbLog.user_avatar,
    recipeId: dbLog.recipe_id,
    recipeTitle: dbLog.recipe_title,
    date: dbLog.date ? dbLog.date.toString().substring(0, 10) : '',
    photos: dbLog.photos,
    rating: Number(dbLog.rating),
    comment: dbLog.comment,
    portions: dbLog.portions,
    recipeText: dbLog.recipe_text,
    sharedCookbookId: dbLog.shared_cookbook_id,
    xpEarned: typeof dbLog.xp_earned === 'string' ? JSON.parse(dbLog.xp_earned) : dbLog.xp_earned,
    createdAt: dbLog.created_at
  };
}

function mapSharedCookbook(dbCb: any): SharedCookbook {
  return {
    id: dbCb.id,
    name: dbCb.name,
    description: dbCb.description,
    ownerId: dbCb.owner_id,
    memberIds: dbCb.member_ids,
    inviteCode: dbCb.invite_code,
    xp: dbCb.xp,
    level: dbCb.level,
    createdAt: dbCb.created_at
  };
}

export class StorageService {
  static async getUsers(): Promise<User[]> {
    const { data } = await supabase.from('users').select('*').order('created_at', { ascending: false });
    return (data || []).map(mapUser);
  }

  static async getCurrentUser(): Promise<User | null> {
    const userId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    if (!userId) return null;
    const { data } = await supabase.from('users').select('*').eq('id', userId).maybeSingle();
    if (!data) return null;
    return mapUser(data);
  }

  static setCurrentUser(userId: string): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, userId);
  }

  static async registerUser(username: string, displayName?: string, email?: string): Promise<User> {
    const { data: existing } = await supabase.from('users').select('*').ilike('username', username).maybeSingle();
    if (existing) {
      throw new Error('Benutzername bereits vergeben. Wähle einen anderen.');
    }
    
    const newUser = {
      id: `usr_${Date.now()}`,
      username,
      display_name: displayName?.trim() || username,
      email: email || null,
      avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(username)}`,
      frame_id: 'none',
      xp: 0,
      level: 1
    };
    
    let insertData;
    const { data: d1, error: err1 } = await supabase.from('users').insert([newUser]).select().single();
    if (err1 && err1.code === 'PGRST204') { // Column not found
      // Fallback without display_name
      const fallbackUser = { ...newUser };
      delete fallbackUser.display_name;
      const { data: d2, error: err2 } = await supabase.from('users').insert([fallbackUser]).select().single();
      if (err2) throw err2;
      insertData = d2;
    } else if (err1) {
      throw err1;
    } else {
      insertData = d1;
    }
    const data = insertData;
    const user = mapUser(data || newUser);
    this.setCurrentUser(user.id);
    return user;
  }

  static async updateUser(updatedUser: User): Promise<void> {
    const updatePayload = {
      username: updatedUser.username,
      display_name: updatedUser.displayName,
      email: updatedUser.email,
      avatar_url: updatedUser.avatarUrl,
      frame_id: updatedUser.frameId,
      xp: updatedUser.xp,
      level: updatedUser.level
    };
    const { error: err1 } = await supabase.from('users').update(updatePayload).eq('id', updatedUser.id);
    if (err1 && err1.code === 'PGRST204') {
      delete updatePayload.display_name;
      const { error: err2 } = await supabase.from('users').update(updatePayload).eq('id', updatedUser.id);
      if (err2) throw err2;
    } else if (err1) {
      throw err1;
    }
  }

  // Recipes
  static async getRecipes(): Promise<Recipe[]> {
    const { data } = await supabase.from('recipes').select('*').order('created_at', { ascending: false });
    return (data || []).map(mapRecipe);
  }

  static async saveRecipe(recipeData: Omit<Recipe, 'id' | 'createdAt' | 'timesCooked'> & { id?: string }): Promise<Recipe> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) throw new Error("No user");

    if (recipeData.id) {
      const { data } = await supabase.from('recipes').update({
        title: recipeData.title,
        ingredients: recipeData.ingredients,
        preparation: recipeData.preparation,
        photos: recipeData.photos,
        shared_cookbook_id: recipeData.sharedCookbookId || null,
        is_private: recipeData.isPrivate,
        author_name: recipeData.authorName || currentUser.username
      }).eq('id', recipeData.id).select().single();
      return mapRecipe(data);
    }

    const newRecipe = {
      id: `rec_${Date.now()}`,
      user_id: currentUser.id,
      author_name: currentUser.username,
      title: recipeData.title,
      ingredients: recipeData.ingredients,
      preparation: recipeData.preparation,
      photos: recipeData.photos || [],
      shared_cookbook_id: recipeData.sharedCookbookId || null,
      is_private: recipeData.isPrivate,
      times_cooked: 0
    };

    const { data } = await supabase.from('recipes').insert([newRecipe]).select().single();
    return mapRecipe(data || newRecipe);
  }

  static async deleteRecipe(recipeId: string): Promise<void> {
    await supabase.from('recipes').delete().eq('id', recipeId);
  }

  // Cook Logs
  static async getCookLogs(): Promise<CookLog[]> {
    const { data } = await supabase.from('cook_logs').select('*').order('created_at', { ascending: false });
    return (data || []).map(mapCookLog);
  }

  static async createCookLog(data: {
    recipeId: string;
    recipeTitle: string;
    date: string;
    photos: string[];
    rating: number;
    comment: string;
    portions?: number;
    recipeText?: string;
    sharedCookbookId?: string | null;
  }): Promise<{ log: CookLog; xpBreakdown: { base: number; completeBonus: number; firstTimeBonus: number; total: number } }> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) throw new Error("No current user");
    
    // Check if first time recipe cooked by this user
    const { data: previousLogs } = await supabase.from('cook_logs')
      .select('id')
      .eq('user_id', currentUser.id)
      .eq('recipe_id', data.recipeId);
      
    const hasCookedBefore = previousLogs && previousLogs.length > 0;

    const base = 10;
    const isComplete = data.photos.length > 0 && data.rating >= 0 && data.comment.trim().length > 0;
    const completeBonus = isComplete ? 5 : 0;
    const firstTimeBonus = (!hasCookedBefore && data.recipeId !== 'custom') ? 15 : 0;
    const totalXP = base + completeBonus + firstTimeBonus;
    const xpEarned = { base, completeBonus, firstTimeBonus, total: totalXP };

    const newLog = {
      id: `log_${Date.now()}`,
      user_id: currentUser.id,
      user_name: currentUser.username,
      user_avatar: currentUser.avatarUrl,
      recipe_id: data.recipeId,
      recipe_title: data.recipeTitle,
      date: data.date,
      photos: data.photos || [],
      rating: data.rating,
      comment: data.comment,
      portions: data.portions,
      recipe_text: data.recipeText,
      shared_cookbook_id: data.sharedCookbookId || null,
      xp_earned: xpEarned
    };

    const { data: insertedLog } = await supabase.from('cook_logs').insert([newLog]).select().single();
    
    // Update times_cooked on Recipe if not custom
    if (data.recipeId !== 'custom') {
      const { data: recipe } = await supabase.from('recipes').select('times_cooked').eq('id', data.recipeId).single();
      if (recipe) {
        await supabase.from('recipes').update({ times_cooked: (recipe.times_cooked || 0) + 1 }).eq('id', data.recipeId);
      }
    }

    // Award XP to User
    currentUser.xp += totalXP;
    currentUser.level = calculateLevel(currentUser.xp);
    await this.updateUser(currentUser);

    // If shared cookbook assigned, award XP to Shared Cookbook as well
    if (data.sharedCookbookId) {
      const { data: cb } = await supabase.from('shared_cookbooks').select('xp, level').eq('id', data.sharedCookbookId).single();
      if (cb) {
        const newXp = cb.xp + totalXP;
        const newLevel = calculateLevel(newXp);
        await supabase.from('shared_cookbooks').update({ xp: newXp, level: newLevel }).eq('id', data.sharedCookbookId);
      }
    }

    return { log: mapCookLog(insertedLog || newLog), xpBreakdown: xpEarned };
  }

  static async updateCookLog(logId: string, updates: Partial<CookLog>): Promise<CookLog | null> {
    const dbUpdates: any = {};
    if (updates.recipeId !== undefined) dbUpdates.recipe_id = updates.recipeId;
    if (updates.recipeTitle !== undefined) dbUpdates.recipe_title = updates.recipeTitle;
    if (updates.date !== undefined) dbUpdates.date = updates.date;
    if (updates.photos !== undefined) dbUpdates.photos = updates.photos;
    if (updates.rating !== undefined) dbUpdates.rating = updates.rating;
    if (updates.comment !== undefined) dbUpdates.comment = updates.comment;
    if (updates.portions !== undefined) dbUpdates.portions = updates.portions;
    if (updates.recipeText !== undefined) dbUpdates.recipe_text = updates.recipeText;
    if (updates.sharedCookbookId !== undefined) dbUpdates.shared_cookbook_id = updates.sharedCookbookId;

    const { data } = await supabase.from('cook_logs').update(dbUpdates).eq('id', logId).select().single();
    if (!data) return null;
    return mapCookLog(data);
  }

  static async deleteCookLog(logId: string): Promise<void> {
    await supabase.from('cook_logs').delete().eq('id', logId);
  }

  // Shared Cookbooks
  static async getSharedCookbooks(): Promise<SharedCookbook[]> {
    const { data } = await supabase.from('shared_cookbooks').select('*').order('created_at', { ascending: false });
    return (data || []).map(mapSharedCookbook);
  }

  static async createSharedCookbook(name: string, description: string): Promise<SharedCookbook> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) throw new Error("No user");

    const newCookbook = {
      id: `cb_${Date.now()}`,
      name,
      description,
      owner_id: currentUser.id,
      member_ids: [currentUser.id],
      invite_code: `KOCH-${Math.floor(1000 + Math.random() * 9000)}`,
      xp: 0,
      level: 1
    };

    const { data } = await supabase.from('shared_cookbooks').insert([newCookbook]).select().single();
    return mapSharedCookbook(data || newCookbook);
  }

  static async joinSharedCookbookByCode(code: string): Promise<SharedCookbook | null> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) return null;

    const { data: cb } = await supabase.from('shared_cookbooks')
      .select('*')
      .ilike('invite_code', code.trim())
      .maybeSingle();

    if (!cb) return null;

    const memberIds = cb.member_ids || [];
    if (!memberIds.includes(currentUser.id)) {
      memberIds.push(currentUser.id);
      await supabase.from('shared_cookbooks').update({ member_ids: memberIds }).eq('id', cb.id);
      cb.member_ids = memberIds;
    }

    return mapSharedCookbook(cb);
  }

  // Milestones / Badges calculation
  static async getMilestoneBadges(userId: string): Promise<MilestoneBadge[]> {
    const { data: logsData } = await supabase.from('cook_logs').select('photos, rating').eq('user_id', userId);
    const { count: recipeCount } = await supabase.from('recipes').select('id', { count: 'exact', head: true }).eq('user_id', userId);
    
    const logs = logsData || [];
    const fiveStarLogs = logs.filter(l => Number(l.rating) === 5.0);
    
    const logCount = logs.length;
    const recipeCountNum = recipeCount || 0;
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
        unlocked: recipeCountNum >= 5,
        progress: Math.min(100, Math.round((recipeCountNum / 5) * 100)),
        target: 5,
        current: recipeCountNum
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
        unlocked: logs.filter(l => l.photos && l.photos.length > 0).length >= 5,
        progress: Math.min(100, Math.round((logs.filter(l => l.photos && l.photos.length > 0).length / 5) * 100)),
        target: 5,
        current: logs.filter(l => l.photos && l.photos.length > 0).length
      }
    ];
  }
}
