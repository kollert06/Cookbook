import React, { useState, useEffect } from 'react';
import { User, Recipe, CookLog, SharedCookbook } from './types';
import { StorageService } from './services/storage';

import { HeaderNav } from './components/HeaderNav';
import { BottomNav, TabType } from './components/BottomNav';
import { CalendarView } from './components/CalendarView';
import { RecipesView } from './components/RecipesView';
import { SharedCookbooksView } from './components/SharedCookbooksView';
import { GamificationView } from './components/GamificationView';

import { RecipeModal } from './components/RecipeModal';
import { RecipeFormModal } from './components/RecipeFormModal';
import { CookLogModal } from './components/CookLogModal';
import { XpRewardModal } from './components/XpRewardModal';
import { ProfileEditModal } from './components/ProfileEditModal';
import { AuthModal } from './components/AuthModal';
import { PWAInstallModal } from './components/PWAInstallModal';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('calendar');

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [cookLogs, setCookLogs] = useState<CookLog[]>([]);
  const [sharedCookbooks, setSharedCookbooks] = useState<SharedCookbook[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  // Modals state
  const [showRecipeFormModal, setShowRecipeFormModal] = useState(false);
  const [recipeToEdit, setRecipeToEdit] = useState<Recipe | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const [showCookLogModal, setShowCookLogModal] = useState(false);
  const [preselectedRecipeId, setPreselectedRecipeId] = useState<string | undefined>(undefined);
  const [cookLogToEdit, setCookLogToEdit] = useState<CookLog | null>(null);

  const [xpRewardData, setXpRewardData] = useState<{
    recipeTitle: string;
    xpBreakdown: { base: number; completeBonus: number; firstTimeBonus: number; total: number };
  } | null>(null);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileEditModal, setShowProfileEditModal] = useState(false);
  const [showPwaModal, setShowPwaModal] = useState(false);

  // Load state on mount / update
  const refreshData = async () => {
    setRecipes(await StorageService.getRecipes());
    setCookLogs(await StorageService.getCookLogs());
    setSharedCookbooks(await StorageService.getSharedCookbooks());
    setAllUsers(await StorageService.getUsers());
    const user = await StorageService.getCurrentUser();
    setCurrentUser(user);
    if (!user && !showAuthModal) setShowAuthModal(true);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleUserChange = (user: User) => {
    setCurrentUser(user);
    refreshData();
  };

  const handleRecipeSaved = (savedRecipe: Recipe) => {
    setShowRecipeFormModal(false);
    setRecipeToEdit(null);
    refreshData();
  };

  const handleRecipeDeleted = async (recipeId: string) => {
    await StorageService.deleteRecipe(recipeId);
    setSelectedRecipe(null);
    refreshData();
  };

  const handleCookLogSaved = (result: {
    log: CookLog;
    xpBreakdown: { base: number; completeBonus: number; firstTimeBonus: number; total: number };
  }) => {
    setShowCookLogModal(false);
    setPreselectedRecipeId(undefined);
    setCookLogToEdit(null);
    refreshData();

    // Trigger XP reward popup
    setXpRewardData({
      recipeTitle: result.log.recipeTitle,
      xpBreakdown: result.xpBreakdown
    });
  };

  const handleDeleteCookLog = async (logId: string) => {
    await StorageService.deleteCookLog(logId);
    refreshData();
  };

  if (!currentUser) {
    return (
      <div className="min-h-[100dvh] bg-[#FDFCF8] flex items-center justify-center">
        
      {showProfileEditModal && currentUser && (
        <ProfileEditModal
          currentUser={currentUser}
          onClose={() => setShowProfileEditModal(false)}
          onUpdate={(user) => {
            setCurrentUser(user);
            setShowProfileEditModal(false);
            refreshData();
          }}
        />
      )}

      {showAuthModal && (
          <AuthModal
            onClose={() => setShowAuthModal(false)}
            onAuthenticated={(user) => {
              setCurrentUser(user);
              setShowAuthModal(false);
              refreshData();
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[#FDFCF8] text-[#2D3047] font-sans flex flex-col">
      
      {/* Top Navigation */}
      <HeaderNav
        currentUser={currentUser}
        onUserChange={handleUserChange}
        onOpenPwaModal={() => setShowPwaModal(true)}
        onOpenAuthModal={() => setShowAuthModal(true)}
        onGoHome={() => setActiveTab('calendar')}
          onOpenProfileEdit={() => setShowProfileEditModal(true)}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-md w-full mx-auto p-4 sm:p-5 pb-24">
        {activeTab === 'calendar' && (
          <CalendarView
            cookLogs={cookLogs}
            sharedCookbooks={sharedCookbooks}
            currentUserId={currentUser.id}
            onOpenCookLogModal={() => {
              setPreselectedRecipeId(undefined);
              setCookLogToEdit(null);
              setShowCookLogModal(true);
            }}
            onEditCookLog={(log) => {
              setCookLogToEdit(log);
              setShowCookLogModal(true);
            }}
            onDeleteCookLog={handleDeleteCookLog}
          />
        )}

        {activeTab === 'recipes' && (
          <RecipesView
            recipes={recipes}
            sharedCookbooks={sharedCookbooks}
            onOpenNewRecipeModal={() => {
              setRecipeToEdit(null);
              setShowRecipeFormModal(true);
            }}
            onSelectRecipe={(recipe) => setSelectedRecipe(recipe)}
            onCookRecipe={(recipeId) => {
              setPreselectedRecipeId(recipeId);
              setShowCookLogModal(true);
            }}
          />
        )}

        {activeTab === 'shared' && (
          <SharedCookbooksView
            sharedCookbooks={sharedCookbooks}
            currentUser={currentUser}
            allUsers={allUsers}
            cookLogs={cookLogs}
            onRefresh={refreshData}
            onOpenCookLogModal={() => {
              setPreselectedRecipeId(undefined);
              setShowCookLogModal(true);
            }}
          />
        )}

        {activeTab === 'gamification' && (
          <GamificationView
            currentUser={currentUser}
            onUserUpdated={(updated) => setCurrentUser(updated)}
          />
        )}
      </main>

      {/* Bottom Navigation Tabs */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        onOpenCookLogModal={() => {
          setPreselectedRecipeId(undefined);
          setShowCookLogModal(true);
        }}
      />

      {/* Modals */}
      {showRecipeFormModal && (
        <RecipeFormModal
          recipeToEdit={recipeToEdit}
          sharedCookbooks={sharedCookbooks}
          onClose={() => {
            setShowRecipeFormModal(false);
            setRecipeToEdit(null);
          }}
          onSaved={handleRecipeSaved}
        />
      )}

      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          onCookThis={(recipeId) => {
            setSelectedRecipe(null);
            setPreselectedRecipeId(recipeId);
            setShowCookLogModal(true);
          }}
          onEdit={(recipe) => {
            setSelectedRecipe(null);
            setRecipeToEdit(recipe);
            setShowRecipeFormModal(true);
          }}
          onDelete={handleRecipeDeleted}
        />
      )}

      {showCookLogModal && (
        <CookLogModal
          recipes={recipes}
          sharedCookbooks={sharedCookbooks}
          preselectedRecipeId={preselectedRecipeId}
          cookLogToEdit={cookLogToEdit}
          onClose={() => {
            setShowCookLogModal(false);
            setPreselectedRecipeId(undefined);
            setCookLogToEdit(null);
          }}
          onSaved={handleCookLogSaved}
        />
      )}

      {xpRewardData && (
        <XpRewardModal
          recipeTitle={xpRewardData.recipeTitle}
          xpBreakdown={xpRewardData.xpBreakdown}
          onClose={() => setXpRewardData(null)}
        />
      )}

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onAuthenticated={(user) => {
            setCurrentUser(user);
            setShowAuthModal(false);
            refreshData();
          }}
        />
      )}

      {showPwaModal && (
        <PWAInstallModal
          onClose={() => setShowPwaModal(false)}
        />
      )}

    </div>
  );
}
